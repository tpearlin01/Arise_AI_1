from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

def print_stock(name):
    products = client.get('/api/products').json()
    for p in products:
        if name.lower() in p['name'].lower():
            print(f"{p['name']} Stock: {p['stock']}")
            return p['id'], p['stock']
    return None, None

print('--- BEFORE STOCK ---')
butter_id, butter_stock = print_stock('Amul Butter')
sugar_id, sugar_stock = print_stock('Sugar')

print('\n--- CREATING ORDER ---')
r = client.post('/api/orders/parse', json={'message': '2 Amul butter, 1.5 sugar'})
order_id = r.json()['order_id']
print('Parsed Order ID:', order_id)

items_to_confirm = [
    {'product_id': butter_id, 'quantity': 2},
    {'product_id': sugar_id, 'quantity': 1.5}
]

print('\n--- CONFIRMING ORDER ---')
conf = client.post(f'/api/orders/{order_id}/confirm', json={'items': items_to_confirm})
print('Confirm status:', conf.status_code)
print('Total amount:', conf.json()['order']['total_amount'])

print('\n--- AFTER STOCK ---')
_, new_butter = print_stock('Amul Butter')
_, new_sugar = print_stock('Sugar')

print(f'\nButter reduction correct? {new_butter == butter_stock - 2}')
print(f'Sugar reduction correct? {new_sugar == sugar_stock - 1.5}')

print('\n--- DOUBLE CONFIRMATION TEST ---')
conf2 = client.post(f'/api/orders/{order_id}/confirm', json={'items': items_to_confirm})
print('Second confirm status:', conf2.status_code)
print('Message:', conf2.json()['message'])
_, final_butter = print_stock('Amul Butter')
print(f'Stock protected from double deduction? {final_butter == new_butter}')

print('\n--- INSUFFICIENT STOCK TEST ---')
r3 = client.post('/api/orders/parse', json={'message': '999 Amul butter'})
order_id_3 = r3.json()['order_id']
conf3 = client.post(f'/api/orders/{order_id_3}/confirm', json={'items': [{'product_id': butter_id, 'quantity': 999}]})
print('Insufficient confirm status:', conf3.status_code)
print('Error detail:', conf3.json())
_, failed_butter = print_stock('Amul Butter')
print(f'Stock protected on failure? {failed_butter == final_butter}')
