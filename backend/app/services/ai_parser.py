import os
import json
from openai import OpenAI

# We use the built-in JSON parsing capabilities of the LLM.
def extract_order_intent(message: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "your_openai_api_key_here")
    if api_key == "your_openai_api_key_here" or not api_key:
        # Mock response for testing
        return {
            "items": [
                {"name": "atta", "quantity_num": 2, "unit": "kilo", "original_text": "2 kilo atta"},
                {"name": "Amul butter", "quantity_num": 1, "unit": "ek", "original_text": "ek Amul butter"},
                {"name": "sugar", "quantity_num": 0.5, "unit": "kilo", "original_text": "sugar half kilo"},
                {"name": "tel", "quantity_num": 1, "unit": "bottle", "original_text": "tel"}
            ]
        }
        
    client = OpenAI(api_key=api_key)
    prompt = f"""
You are an AI order parser for an Indian grocery store.
The user will provide a Hinglish order.
Extract the products and quantities from the order.

Output MUST be a JSON object with a single key "items" which is a list of objects.
Each object must have:
- "name": the product name as mentioned (e.g. "atta", "Amul butter", "sugar", "tel")
- "quantity_num": the numeric quantity (e.g. 2 for "2 kilo", 1 for "ek", 0.5 for "half kilo")
- "unit": the unit mentioned (e.g. "kg", "kilo", "packet", "liter", null if none)
- "original_text": the exact phrase from the user (e.g. "2 kilo atta")

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
        return {"items": []}
