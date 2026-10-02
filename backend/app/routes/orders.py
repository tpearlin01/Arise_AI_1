import json
from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/{order_id}/clarify")
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

@router.post("/{order_id}/confirm")
def confirm_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = "CONFIRMED"
    
    for item in order.items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if prod:
            prod.stock -= int(item.quantity)
            
    db.commit()
    db.refresh(order)
    return {"message": "Order confirmed", "order": order}

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
