from pydantic import BaseModel
from typing import List, Optional, Dict
import datetime

class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    unit: str
    price: float
    stock: float
    aliases: Optional[str] = None

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: float
    price_per_unit: float

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    product: Product

    class Config:
        from_attributes = True

class ProductOption(BaseModel):
    id: int
    name: str
    price: float
    unit: str
    stock: float

class ClarificationItem(BaseModel):
    original_query: str
    reason: str
    quantity: float = 1.0
    options: List[ProductOption] = []

class OrderBase(BaseModel):
    status: str
    total_amount: float
    raw_text: Optional[str] = None
    clarification_msg: Optional[str] = None
    ambiguous_items: Optional[str] = None
    delivery_notes: Optional[str] = None

class Order(OrderBase):
    id: int
    created_at: datetime.datetime
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

class ParseRequest(BaseModel):
    message: str

class ParseResponse(BaseModel):
    order_id: int
    status: str
    message: str
    matched_items: List[OrderItem] = []
    clarification_items: List[ClarificationItem] = []

class ClarifyRequest(BaseModel):
    resolutions: Dict[str, int] # original_query -> product_id

class UpdatedItem(BaseModel):
    product_id: int
    quantity: float

class ConfirmRequest(BaseModel):
    items: Optional[List[UpdatedItem]] = None

class TranslateRequest(BaseModel):
    message: str
    target_language: str

class TranslateResponse(BaseModel):
    translated_text: str

class OrderActionResponse(BaseModel):
    message: str
    order: Order
