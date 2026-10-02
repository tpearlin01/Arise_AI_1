import os
import json
import re
from openai import OpenAI

def deterministic_fallback_parse(message: str) -> dict:
    parts = re.split(r',|\baur\b|\band\b', message.lower())
    items = []
    
    num_map = {
        "ek": 1.0, "one": 1.0, "do": 2.0, "two": 2.0, "teen": 3.0, "three": 3.0,
        "char": 4.0, "chaar": 4.0, "four": 4.0, "paanch": 5.0, "panch": 5.0, "five": 5.0,
        "chhe": 6.0, "six": 6.0, "saat": 7.0, "seven": 7.0, "aath": 8.0, "eight": 8.0,
        "nau": 9.0, "nine": 9.0, "das": 10.0, "ten": 10.0,
        "aadha": 0.5, "half": 0.5, "adha": 0.5, "pauna": 0.75, "sawa": 1.25, "dedh": 1.5, "dhai": 2.5
    }
    units = {"kilo", "kg", "gram", "g", "packet", "packets", "pkt", "pkts", "liter", "litre", "l", "bottle", "bottles", "piece", "pieces", "pc", "pcs"}
    skip_words = {
        "bhaiya", "chahiye", "chaiye", "dedo", "give", "me", "please", "bhi", "mujhe", "mujhji", "mujhi", 
        "kal", "ke", "liye", "rakh", "dena", "wo", "wala", "bhej", "do", "delivery", 
        "ghar", "pe", "yaar", "de", "of", "the", "a", "an", "is", "for", "aur", "and", "hai", "hain", "lo", "ko", "k", "ki", "ka"
    }
    
    delivery_keywords = ["kal", "subah", "bhej", "dena", "ghar", "pe", "delivery", "deliver", "rakh"]
    words_all = message.lower().split()
    delivery_notes = None
    
    # Very basic heuristic for fallback delivery notes
    del_words = []
    for w in words_all:
        if w in delivery_keywords or len(del_words) > 0:
            del_words.append(w)
            
    if len(del_words) >= 2:
        delivery_notes = " ".join(del_words[:10]) # grab up to 10 words of context
    
    for part in parts:
        part = part.strip()
        if not part:
            continue
            
        words = part.split()
        filtered_words = [w for w in words if w not in skip_words]
        if not filtered_words:
            continue
            
        quantity = 1.0
        unit = None
        product_name_tokens = []
        
        for w in filtered_words:
            # Check number
            try:
                val = float(w)
                quantity = val
                continue
            except ValueError:
                pass
                
            if w in num_map:
                quantity = num_map[w]
                continue
                
            if w in units:
                unit = w
                continue
                
            product_name_tokens.append(w)
            
        name = " ".join(product_name_tokens).strip()
        if name:
            items.append({
                "name": name,
                "quantity_num": quantity,
                "unit": unit,
                "original_text": part
            })
            
    return {"items": items, "delivery_notes": delivery_notes}

# We use the built-in JSON parsing capabilities of the LLM.
def extract_order_intent(message: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "your_openai_api_key_here")
    if api_key == "your_openai_api_key_here" or not api_key:
        return deterministic_fallback_parse(message)
        
    client = OpenAI(api_key=api_key)
    prompt = f"""
You are an AI order parser for an Indian grocery store.
The user will provide a Hinglish order.
Extract the products and quantities from the order.

Output MUST be a JSON object with two keys:
1. "items": a list of objects. Each object must have:
   - "name": Extract ONLY the product mention. Do NOT include conversational words such as: mujhe, chahiye, chaiye, dena, de do, bhej do, bhaiya, please, aur, hai, hain, mujhji, mujhi, etc. (e.g. ONLY "atta", "Amul butter", "sugar", "tel", "sabun", "shampoo")
   - "quantity_num": the numeric quantity (e.g. 2 for "2 kilo", 1 for "ek", 0.5 for "half kilo")
   - "unit": the unit mentioned (e.g. "kg", "kilo", "packet", "liter", null if none)
   - "original_text": the exact phrase from the user (e.g. "2 kilo atta")
2. "delivery_notes": Any delivery instructions or notes mentioned (e.g. "kal subah tak bhej dena"). If none, output null.

User Message: {message}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # or gpt-4o-mini
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print("Error parsing with AI:", e)
        return {"items": [], "delivery_notes": None}

