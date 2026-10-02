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
        # ATTA / RICE / FLOUR
        Product(name="Aashirvaad Atta", brand="Aashirvaad", category="Atta & Rice", unit="1 kg", price=65.0, stock=50, aliases="atta, aata, flour, aashirvaad atta"),
        Product(name="Fortune Chakki Fresh Atta", brand="Fortune", category="Atta & Rice", unit="1 kg", price=60.0, stock=40, aliases="atta, aata, flour, fortune atta"),
        Product(name="Pillsbury Atta", brand="Pillsbury", category="Atta & Rice", unit="1 kg", price=62.0, stock=30, aliases="atta, aata, flour, pillsbury atta"),
        Product(name="India Gate Basmati Rice", brand="India Gate", category="Atta & Rice", unit="1 kg", price=120.0, stock=20, aliases="rice, chawal, india gate, basmati"),
        Product(name="Daawat Basmati Rice", brand="Daawat", category="Atta & Rice", unit="1 kg", price=110.0, stock=15, aliases="rice, chawal, daawat, basmati"),
        Product(name="Fortune Rice", brand="Fortune", category="Atta & Rice", unit="1 kg", price=95.0, stock=25, aliases="rice, chawal, fortune rice"),
        Product(name="Sona Masoori Rice", brand="Generic", category="Atta & Rice", unit="1 kg", price=75.0, stock=60, aliases="rice, chawal, sona masoori"),
        Product(name="Poha", brand="Generic", category="Atta & Rice", unit="500 g", price=40.0, stock=30, aliases="poha, chivda"),
        Product(name="Suji / Rava", brand="Generic", category="Atta & Rice", unit="500 g", price=35.0, stock=45, aliases="suji, rava, sooji"),
        Product(name="Besan", brand="Generic", category="Atta & Rice", unit="500 g", price=55.0, stock=40, aliases="besan, gram flour"),

        # DAL / PULSES
        Product(name="Toor Dal", brand="Generic", category="Dal", unit="1 kg", price=160.0, stock=30, aliases="dal, toor dal, arhar dal"),
        Product(name="Moong Dal", brand="Generic", category="Dal", unit="1 kg", price=140.0, stock=35, aliases="dal, moong dal"),
        Product(name="Masoor Dal", brand="Generic", category="Dal", unit="1 kg", price=120.0, stock=40, aliases="dal, masoor dal"),
        Product(name="Chana Dal", brand="Generic", category="Dal", unit="1 kg", price=110.0, stock=50, aliases="dal, chana dal"),
        Product(name="Urad Dal", brand="Generic", category="Dal", unit="1 kg", price=150.0, stock=20, aliases="dal, urad dal"),
        Product(name="Rajma", brand="Generic", category="Dal", unit="1 kg", price=170.0, stock=25, aliases="rajma, kidney beans"),
        Product(name="Kabuli Chana", brand="Generic", category="Dal", unit="1 kg", price=180.0, stock=15, aliases="chole, chana, kabuli chana"),

        # OIL / GHEE
        Product(name="Fortune Sunlite Refined Sunflower Oil", brand="Fortune", category="Oil & Ghee", unit="1 L", price=140.0, stock=40, aliases="tel, oil, sunflower oil, fortune oil"),
        Product(name="Saffola Gold Oil", brand="Saffola", category="Oil & Ghee", unit="1 L", price=170.0, stock=3, aliases="tel, oil, saffola oil, saffola gold"),
        Product(name="Fortune Groundnut Oil", brand="Fortune", category="Oil & Ghee", unit="1 L", price=190.0, stock=10, aliases="tel, oil, groundnut oil, mungfali tel"),
        Product(name="Fortune Mustard Oil", brand="Fortune", category="Oil & Ghee", unit="1 L", price=160.0, stock=30, aliases="tel, oil, mustard oil, sarson tel"),
        Product(name="Dhara Mustard Oil", brand="Dhara", category="Oil & Ghee", unit="1 L", price=155.0, stock=20, aliases="tel, oil, mustard oil, sarson tel, dhara"),
        Product(name="Amul Ghee", brand="Amul", category="Oil & Ghee", unit="1 L", price=550.0, stock=12, aliases="ghee, amul ghee, tup"),
        Product(name="Patanjali Cow Ghee", brand="Patanjali", category="Oil & Ghee", unit="1 L", price=540.0, stock=18, aliases="ghee, patanjali ghee, cow ghee"),

        # DAIRY
        Product(name="Amul Butter", brand="Amul", category="Dairy", unit="100 g", price=60.0, stock=40, aliases="butter, amul butter, makkhan, amul makkhan"),
        Product(name="Amul Taaza Milk", brand="Amul", category="Dairy", unit="1 L", price=68.0, stock=4, aliases="milk, doodh, amul milk, taaza"),
        Product(name="Amul Gold Milk", brand="Amul", category="Dairy", unit="1 L", price=72.0, stock=25, aliases="milk, doodh, amul milk, amul gold"),
        Product(name="Amul Cheese", brand="Amul", category="Dairy", unit="200 g", price=120.0, stock=15, aliases="cheese, amul cheese"),
        Product(name="Amul Paneer", brand="Amul", category="Dairy", unit="200 g", price=90.0, stock=20, aliases="paneer, amul paneer"),
        Product(name="Amul Curd", brand="Amul", category="Dairy", unit="400 g", price=45.0, stock=30, aliases="curd, dahi, amul dahi, yoghurt"),
        Product(name="Mother Dairy Milk", brand="Mother Dairy", category="Dairy", unit="1 L", price=66.0, stock=2, aliases="milk, doodh, mother dairy"),

        # BISCUITS / SNACKS
        Product(name="Parle-G", brand="Parle", category="Snacks", unit="1 packet", price=10.0, stock=100, aliases="biscuit, biscuits, parle g, parle-g"),
        Product(name="Britannia Good Day", brand="Britannia", category="Snacks", unit="1 packet", price=20.0, stock=80, aliases="biscuit, biscuits, good day, goodday"),
        Product(name="Britannia Marie Gold", brand="Britannia", category="Snacks", unit="1 packet", price=30.0, stock=60, aliases="biscuit, biscuits, marie gold, marie"),
        Product(name="Hide & Seek", brand="Parle", category="Snacks", unit="1 packet", price=40.0, stock=40, aliases="biscuit, biscuits, hide and seek, chocolate biscuit"),
        Product(name="Oreo", brand="Cadbury", category="Snacks", unit="1 packet", price=35.0, stock=50, aliases="biscuit, biscuits, oreo"),
        Product(name="Monaco", brand="Parle", category="Snacks", unit="1 packet", price=20.0, stock=45, aliases="biscuit, biscuits, monaco, salty biscuit"),
        Product(name="KrackJack", brand="Parle", category="Snacks", unit="1 packet", price=20.0, stock=45, aliases="biscuit, biscuits, krackjack"),
        Product(name="Lays Classic", brand="Lays", category="Snacks", unit="1 packet", price=20.0, stock=60, aliases="chips, lays, wafers, potato chips"),
        Product(name="Kurkure", brand="Kurkure", category="Snacks", unit="1 packet", price=20.0, stock=70, aliases="kurkure, chips, snacks"),
        Product(name="Bingo", brand="Bingo", category="Snacks", unit="1 packet", price=20.0, stock=30, aliases="chips, bingo, mad angles"),

        # NOODLES / INSTANT FOOD
        Product(name="Maggi 2-Minute Noodles", brand="Nestle", category="Noodles", unit="1 packet", price=14.0, stock=150, aliases="maggi, maggie, noodles"),
        Product(name="Yippee Noodles", brand="Sunfeast", category="Noodles", unit="1 packet", price=14.0, stock=80, aliases="yippee, noodles, yipee"),
        Product(name="Top Ramen", brand="Nissin", category="Noodles", unit="1 packet", price=15.0, stock=40, aliases="top ramen, noodles, ramen"),
        Product(name="Maggi Masala", brand="Nestle", category="Noodles", unit="1 packet", price=6.0, stock=100, aliases="maggi masala, masala magic, masala"),
        Product(name="Maggi Atta Noodles", brand="Nestle", category="Noodles", unit="1 packet", price=25.0, stock=50, aliases="maggi, maggie, noodles, atta maggi, atta noodles"),

        # CHOCOLATE / SWEETS
        Product(name="Dairy Milk", brand="Cadbury", category="Chocolate", unit="1 piece", price=20.0, stock=120, aliases="chocolate, dairy milk, dairymilk, cadbury"),
        Product(name="KitKat", brand="Nestle", category="Chocolate", unit="1 piece", price=25.0, stock=90, aliases="chocolate, kitkat, kit kat"),
        Product(name="5 Star", brand="Cadbury", category="Chocolate", unit="1 piece", price=10.0, stock=110, aliases="chocolate, 5 star, five star"),
        Product(name="Munch", brand="Nestle", category="Chocolate", unit="1 piece", price=10.0, stock=100, aliases="chocolate, munch"),
        Product(name="Perk", brand="Cadbury", category="Chocolate", unit="1 piece", price=10.0, stock=100, aliases="chocolate, perk"),
        Product(name="Gems", brand="Cadbury", category="Chocolate", unit="1 piece", price=10.0, stock=80, aliases="chocolate, gems"),
        Product(name="Sugar", brand="Generic", category="Salt & Sugar", unit="1 kg", price=48.0, stock=90, aliases="chini, shakkar, sugar"),
        Product(name="Tata Salt", brand="Tata", category="Salt & Sugar", unit="1 kg", price=25.0, stock=100, aliases="namak, salt, tata namak, tata salt"),

        # BEVERAGES
        Product(name="Coca-Cola", brand="Coca-Cola", category="Beverages", unit="1 L", price=50.0, stock=40, aliases="coke, coca cola, coca-cola, cold drink"),
        Product(name="Pepsi", brand="Pepsi", category="Beverages", unit="1 L", price=50.0, stock=4, aliases="pepsi, cold drink"),
        Product(name="Sprite", brand="Coca-Cola", category="Beverages", unit="1 L", price=50.0, stock=45, aliases="sprite, cold drink"),
        Product(name="Thums Up", brand="Coca-Cola", category="Beverages", unit="1 L", price=50.0, stock=50, aliases="thums up, cold drink, thumsup"),
        Product(name="Fanta", brand="Coca-Cola", category="Beverages", unit="1 L", price=50.0, stock=30, aliases="fanta, cold drink"),
        Product(name="Limca", brand="Coca-Cola", category="Beverages", unit="1 L", price=50.0, stock=25, aliases="limca, cold drink"),
        Product(name="Real Fruit Juice", brand="Real", category="Beverages", unit="1 L", price=110.0, stock=20, aliases="juice, real juice, fruit juice"),
        Product(name="Maaza", brand="Coca-Cola", category="Beverages", unit="1 L", price=60.0, stock=40, aliases="maaza, mango juice, juice"),

        # PERSONAL CARE
        Product(name="Dove Soap", brand="Dove", category="Personal Care", unit="1 piece", price=55.0, stock=60, aliases="soap, sabun, dove, dove soap"),
        Product(name="Lux Soap", brand="Lux", category="Personal Care", unit="1 piece", price=35.0, stock=80, aliases="soap, sabun, lux, lux soap"),
        Product(name="Lifebuoy Soap", brand="Lifebuoy", category="Personal Care", unit="1 piece", price=25.0, stock=100, aliases="soap, sabun, lifebuoy, lifebuoy soap"),
        Product(name="Dettol Soap", brand="Dettol", category="Personal Care", unit="1 piece", price=40.0, stock=90, aliases="soap, sabun, dettol, dettol soap"),
        Product(name="Head & Shoulders Shampoo", brand="Head & Shoulders", category="Personal Care", unit="1 bottle", price=180.0, stock=30, aliases="shampoo, head and shoulders"),
        Product(name="Sunsilk Shampoo", brand="Sunsilk", category="Personal Care", unit="1 bottle", price=150.0, stock=40, aliases="shampoo, sunsilk"),
        Product(name="Clinic Plus Shampoo", brand="Clinic Plus", category="Personal Care", unit="1 bottle", price=120.0, stock=50, aliases="shampoo, clinic plus"),
        Product(name="Dove Shampoo", brand="Dove", category="Personal Care", unit="1 bottle", price=200.0, stock=4, aliases="shampoo, dove shampoo, dove"),

        # HOME CARE
        Product(name="Surf Excel", brand="Surf Excel", category="Home Care", unit="1 kg", price=120.0, stock=40, aliases="surf, detergent, surf excel, washing powder"),
        Product(name="Ariel", brand="Ariel", category="Home Care", unit="1 kg", price=130.0, stock=30, aliases="ariel, detergent, washing powder"),
        Product(name="Tide", brand="Tide", category="Home Care", unit="1 kg", price=100.0, stock=50, aliases="tide, detergent, washing powder"),
        Product(name="Vim Dishwash", brand="Vim", category="Home Care", unit="500 ml", price=55.0, stock=60, aliases="vim, dishwash, vim liquid, sabun"),
        Product(name="Harpic", brand="Harpic", category="Home Care", unit="500 ml", price=90.0, stock=45, aliases="harpic, toilet cleaner"),
        Product(name="Lizol", brand="Lizol", category="Home Care", unit="500 ml", price=95.0, stock=40, aliases="lizol, floor cleaner"),
        Product(name="Colin", brand="Colin", category="Home Care", unit="500 ml", price=85.0, stock=35, aliases="colin, glass cleaner")
    ]

    db.add_all(products)
    db.commit()
    print("Database seeded with products.")
    db.close()

if __name__ == "__main__":
    seed_data()
