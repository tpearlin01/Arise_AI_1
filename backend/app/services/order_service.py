import json
from sqlalchemy.orm import Session
from ..models import Product, Order, OrderItem
from .ai_parser import extract_order_intent

def process_order(db: Session, message: str) -> dict:
    extracted = extract_order_intent(message)
    items = extracted.get("items", [])
    
    matched_items = []
    clarification_items = []
    
    # Simple product matching logic
    products = db.query(Product).all()
    
    for item in items:
        name = item.get("name", "").lower()
        original = item.get("original_text", "")
        quantity = item.get("quantity_num", 1.0)
        
        # Exact match or alias match
        matches = []
        for p in products:
            if name in p.name.lower():
                matches.append(p)
            elif p.aliases and name in p.aliases.lower():
                matches.append(p)
        
        if len(matches) == 1:
            matched_items.append({
                "product": matches[0],
                "quantity": quantity
            })
        elif len(matches) > 1:
            clarification_items.append({
                "original_query": original,
                "reason": "ambiguous",
                "options": matches,
                "quantity": quantity
            })
        else:
            clarification_items.append({
                "original_query": original,
                "reason": "not_found",
                "options": [],
                "quantity": quantity
            })
            
    # Create order
    order_status = "NEEDS_CLARIFICATION" if clarification_items else "READY_TO_CONFIRM"
    
    db_order = Order(
        status=order_status,
        raw_text=message,
        ambiguous_items=json.dumps([
            {
                "original_query": c["original_query"], 
                "reason": c["reason"], 
                "quantity": c["quantity"],
                "options": [{"id": o.id, "name": o.name, "price": o.price, "unit": o.unit, "stock": o.stock} for o in c["options"]]
            } for c in clarification_items
        ])
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    total = 0.0
    for mi in matched_items:
        prod = mi["product"]
        qty = mi["quantity"]
        total += prod.price * qty
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=prod.id,
            quantity=qty,
            price_per_unit=prod.price
        )
        db.add(db_item)
    
    db_order.total_amount = total
    db.commit()
    db.refresh(db_order)
    
    return {
        "order": db_order,
        "clarification_items": clarification_items
    }
