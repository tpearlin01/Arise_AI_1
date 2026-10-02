import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function OrderSummary({ order }) {
  if (!order || !order.items) return null;

  const validItems = order.items.filter(item => item.price && item.quantity);
  const total = validItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="glass-panel animate-fade-in">
      <h2>
        <ShoppingBag size={20} color="var(--primary)" />
        Order Summary
      </h2>
      
      <div className="mt-4">
        {validItems.map((item, index) => (
          <div key={item.id || index} className="bill-row">
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                {item.quantity} {item.unit} × ₹{item.price}
              </div>
            </div>
            <div className="font-bold">₹{item.subtotal}</div>
          </div>
        ))}
        
        <div className="bill-row bill-total">
          <div>TOTAL</div>
          <div>₹{total}</div>
        </div>
      </div>
    </div>
  );
}
