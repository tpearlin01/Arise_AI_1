from pydantic import BaseModel
from typing import List, Optional, Dict
import datetime

class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    unit: str
    price: float
    stock: int
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
    stock: int

class ClarificationItem(BaseModel):
    original_query: str
    reason: str
    options: List[ProductOption] = []

class OrderBase(BaseModel):
    status: str
    total_amount: float
    raw_text: Optional[str] = None
    clarification_msg: Optional[str] = None
    ambiguous_items: Optional[str] = None

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
