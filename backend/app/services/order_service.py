import json
import difflib
from sqlalchemy.orm import Session
from ..models import Product, Order, OrderItem
from .ai_parser import extract_order_intent

def process_order(db: Session, message: str) -> dict:
    extracted = extract_order_intent(message)
    items = extracted.get("items", [])
    delivery_notes = extracted.get("delivery_notes")
    
    matched_items = []
    clarification_items = []
    
    # Simple product matching logic with fuzzy
    products = db.query(Product).all()
    
    for item in items:
        name = item.get("name", "").lower()
        original = item.get("name", "")
        quantity = item.get("quantity_num", 1.0)
        
        matches_set = set()
        for p in products:
            p_name = p.name.lower()
            p_aliases = [a.strip() for a in (p.aliases.lower() if p.aliases else "").split(',') if a.strip()]
            all_names = [p_name] + p_aliases
            
            # Exact or Substring
            if name in p_name or any(name in a for a in p_aliases):
                matches_set.add(p)
            else:
                # Fuzzy
                close_matches = difflib.get_close_matches(name, all_names, n=1, cutoff=0.7)
                if close_matches:
                    matches_set.add(p)
                    
        matches = list(matches_set)
        
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
        delivery_notes=delivery_notes,
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
