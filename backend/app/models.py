import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String)
    category = Column(String)
    unit = Column(String)
    price = Column(Float)
    stock = Column(Float)
    aliases = Column(String)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="PENDING")
    total_amount = Column(Float, default=0.0)
    raw_text = Column(String, nullable=True)
    clarification_msg = Column(String, nullable=True)
    ambiguous_items = Column(String, nullable=True) # JSON string of ambiguous items
    delivery_notes = Column(String, nullable=True)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Float) # Using Float for cases like "half kilo"
    price_per_unit = Column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
