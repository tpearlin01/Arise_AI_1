from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Product, Order
from pydantic import BaseModel
import os
import json
from openai import OpenAI
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(request: ChatRequest, db: Session = Depends(get_db)):
    api_key = os.environ.get("OPENAI_API_KEY", "your_openai_api_key_here")
    if api_key == "your_openai_api_key_here" or not api_key:
        return ChatResponse(message="Error: OpenAI API key is missing. Cannot process request.")
        
    client = OpenAI(api_key=api_key)
    
    intent_prompt = f"""
Analyze the user's message and determine their intent regarding a retail shop.
Possible intents:
- CHECK_STOCK (Check stock of a specific product)
- SALES_TODAY (Check today's sales, revenue, or number of orders today)
- LOW_STOCK (Check which products are low on stock)
- RECENT_ORDERS (Check recent orders or last order)
- OTHER (General conversation or unrelated)

Respond STRICTLY in JSON format with no markdown formatting or extra text.
Format: {{"intent": "INTENT_NAME", "product": "product_name_if_applicable"}}

Message: "{request.message}"
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": intent_prompt}],
            temperature=0.0
        )
        intent_str = response.choices[0].message.content.strip().strip("`")
        if intent_str.startswith("json\n"):
            intent_str = intent_str[5:]
        intent_data = json.loads(intent_str)
    except Exception as e:
        print("Intent parsing error:", e)
        intent_data = {"intent": "OTHER"}

    intent = intent_data.get("intent", "OTHER")
    product_name = intent_data.get("product", "")
    
    db_context = ""
    today = datetime.now().date()
    
    if intent == "CHECK_STOCK" and product_name:
        search_term = f"%{product_name}%"
        products = db.query(Product).filter(Product.name.ilike(search_term) | Product.aliases.ilike(search_term)).all()
        if products:
            db_context = "Found products:\n" + "\n".join([f"- {p.name}: {p.stock} in stock" for p in products])
        else:
            db_context = f"Product '{product_name}' not found in database."
            
    elif intent == "SALES_TODAY":
        orders = db.query(Order).all()
        today_orders = [o for o in orders if o.created_at.date() == today]
        sales_today = sum(o.total_amount for o in today_orders if o.status == 'CONFIRMED')
        num_orders = len(today_orders)
        db_context = f"Today's Date: {today}\nTotal Orders Today: {num_orders}\nTotal Sales Today: ₹{sales_today}"
        
    elif intent == "LOW_STOCK":
        low_stock_products = db.query(Product).filter(Product.stock <= 5).all()
        if low_stock_products:
            db_context = "Low stock products:\n" + "\n".join([f"- {p.name}: {p.stock} left" for p in low_stock_products])
        else:
            db_context = "No products are currently low on stock."
            
    elif intent == "RECENT_ORDERS":
        recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
        if recent_orders:
            db_context = "Recent orders:\n" + "\n".join([f"- Order #{o.id} at {o.created_at.strftime('%H:%M')}: ₹{o.total_amount} ({o.status})" for o in recent_orders])
        else:
            db_context = "No recent orders found."
    else:
        db_context = "No specific database query was made. Provide a general helpful response."

    system_prompt = f"""
You are the AI Shop Assistant for 'DukaanAI', a small Indian retail shop.
Your job is to answer the shopkeeper's question using ONLY the provided DATABASE CONTEXT.
If the information is not in the context, politely say you don't have that information.
Be concise, professional, and use a friendly tone. Use Hinglish if appropriate or clear English.
DO NOT hallucinate or guess any numbers.

DATABASE CONTEXT:
{db_context}
"""

    try:
        final_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            temperature=0.0
        )
        answer = final_response.choices[0].message.content
        return ChatResponse(message=answer)
    except Exception as e:
        print("Error generating final response:", e)
        raise HTTPException(status_code=500, detail="Failed to communicate with AI service.")
