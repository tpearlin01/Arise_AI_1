from app.database import SessionLocal, engine, Base
from app.models import Product, Order, OrderItem

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # clear existing data
    db.query(OrderItem).delete()
    db.query(Order).delete()
    db.query(Product).delete()
    
    products = [
        Product(name="Aashirvaad Whole Wheat Atta", brand="Aashirvaad", category="Grains & Flours", unit="1kg", price=50.0, stock=50, aliases="aata, atta, wheat flour, gehu atta"),
        Product(name="Aashirvaad Select Premium Atta", brand="Aashirvaad", category="Grains & Flours", unit="5kg", price=250.0, stock=20, aliases="atta, aata"),
        Product(name="Tata Salt", brand="Tata", category="Salt & Sugar", unit="1kg", price=25.0, stock=100, aliases="namak, salt, tata namak"),
        Product(name="Madhur Pure & Hygienic Sugar", brand="Madhur", category="Salt & Sugar", unit="1kg", price=55.0, stock=80, aliases="chini, shakkar, sugar"),
        Product(name="Amul Butter", brand="Amul", category="Dairy", unit="100g", price=54.0, stock=40, aliases="butter, makhan"),
        Product(name="Fortune Sunlite Refined Sunflower Oil", brand="Fortune", category="Oils", unit="1L", price=140.0, stock=60, aliases="tel, oil, sunflower oil, rificed tel"),
        Product(name="Saffola Gold Blended Oil", brand="Saffola", category="Oils", unit="1L", price=170.0, stock=30, aliases="tel, oil, saffola tel")
    ]

    db.add_all(products)
    db.commit()
    print("Database seeded with products.")
    db.close()

if __name__ == "__main__":
    seed_data()
