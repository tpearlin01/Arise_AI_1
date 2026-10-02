import json
import os
from openai import OpenAI
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..services.order_service import process_order

router = APIRouter()

@router.post("/parse", response_model=schemas.ParseResponse)
def parse_order(request: schemas.ParseRequest, db: Session = Depends(get_db)):
    result = process_order(db, request.message)
    order = result["order"]
    clarifications = result["clarification_items"]
    
    formatted_clarifications = []
    for c in clarifications:
        formatted_clarifications.append(
            schemas.ClarificationItem(
                original_query=c["original_query"],
                reason=c["reason"],
                quantity=c.get("quantity", 1.0),
                options=[
                    schemas.ProductOption(
                        id=o["id"],
                        name=o["name"],
                        price=o["price"],
                        unit=o["unit"],
                        stock=o["stock"]
                    ) if isinstance(o, dict) else schemas.ProductOption(
                        id=o.id,
                        name=o.name,
                        price=o.price,
                        unit=o.unit,
                        stock=o.stock
                    ) for o in c["options"]
                ]
            )
        )
        
    return schemas.ParseResponse(
        order_id=order.id,
        status=order.status,
        message="Order parsed with clarifications needed." if formatted_clarifications else "Order parsed successfully.",
        matched_items=order.items,
        clarification_items=formatted_clarifications
    )

@router.post("/{order_id}/clarify", response_model=schemas.OrderActionResponse)
def clarify_order(order_id: int, request: schemas.ClarifyRequest, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if not order.ambiguous_items:
        return {"message": "No clarifications needed", "order": order}
        
    ambiguous_data = json.loads(order.ambiguous_items)
    
    for amb_item in ambiguous_data:
        original = amb_item["original_query"]
        qty = amb_item.get("quantity", 1.0)
        if original in request.resolutions:
            product_id = request.resolutions[original]
            prod = db.query(models.Product).filter(models.Product.id == product_id).first()
            if prod:
                db_item = models.OrderItem(
                    order_id=order.id,
                    product_id=prod.id,
                    quantity=qty,
                    price_per_unit=prod.price
                )
                db.add(db_item)
                order.total_amount += (prod.price * qty)
    
    order.status = "READY_TO_CONFIRM"
    order.ambiguous_items = None
    db.commit()
    db.refresh(order)
    
    return {"message": "Clarifications applied", "order": order}

@router.post("/{order_id}/confirm", response_model=schemas.OrderActionResponse)
def confirm_order(order_id: int, request: schemas.ConfirmRequest = None, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.status == "CONFIRMED":
        # Do not throw an error, make it idempotent to prevent double-deduction
        return {"message": "Order already confirmed", "order": order}
        
    try:
        # If user edited the order before confirming
        if request and request.items is not None:
            # Delete old items
            db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).delete()
            total = 0.0
            
            for ui in request.items:
                prod = db.query(models.Product).filter(models.Product.id == ui.product_id).first()
                if not prod:
                    raise HTTPException(status_code=400, detail="Invalid product in order")
                    
                if ui.quantity > prod.stock:
                    raise HTTPException(status_code=400, detail=f"Only {prod.stock} available for {prod.name}")
                
                # Deduct stock immediately
                prod.stock = float(prod.stock) - float(ui.quantity)
                
                db_item = models.OrderItem(
                    order_id=order.id,
                    product_id=prod.id,
                    quantity=ui.quantity,
                    price_per_unit=prod.price
                )
                db.add(db_item)
                total += (prod.price * ui.quantity)
                    
            order.total_amount = total
            
        else:
            # Confirm directly from existing items
            for item in order.items:
                prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
                if not prod:
                    raise HTTPException(status_code=400, detail="Invalid product in order")
                    
                if item.quantity > prod.stock:
                    raise HTTPException(status_code=400, detail=f"Only {prod.stock} available for {prod.name}")
                    
                # Deduct stock
                prod.stock = float(prod.stock) - float(item.quantity)
                
        order.status = "CONFIRMED"
        db.commit()
        db.refresh(order)
        return {"message": "Order confirmed", "order": order}
        
    except Exception as e:
        db.rollback()
        raise e

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/", response_model=List[schemas.Order])
def get_recent_orders(db: Session = Depends(get_db), limit: int = 5):
    return db.query(models.Order).order_by(models.Order.created_at.desc()).limit(limit).all()

@router.post("/translate", response_model=schemas.TranslateResponse)
def translate_message(request: schemas.TranslateRequest):
    api_key = os.environ.get("OPENAI_API_KEY", "your_openai_api_key_here")
    if api_key == "your_openai_api_key_here" or not api_key:
        return schemas.TranslateResponse(translated_text=request.message)
        
    try:
        client = OpenAI(api_key=api_key)
        prompt = f"Translate the following Hinglish order message into clean, simple shopkeeper-friendly {request.target_language}:\n\n{request.message}"
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return schemas.TranslateResponse(translated_text=response.choices[0].message.content.strip())
    except Exception as e:
        print("Translation error:", e)
        return schemas.TranslateResponse(translated_text=request.message)
