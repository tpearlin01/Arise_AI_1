import React from 'react';
import { Printer } from 'lucide-react';

export default function DeliveryNote({ order }) {
  if (!order || !order.items) return null;

  const validItems = order.items.filter(item => item.price && item.quantity);
  const total = validItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="panel animate-fade-in" style={{ background: '#fff', color: 'var(--text-main)', border: '2px solid var(--primary-dark)' }}>
      <div className="flex justify-between items-center mb-6" style={{ borderBottom: '2px solid var(--neutral)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--primary-dark)', margin: 0, fontSize: '1.5rem' }}>DELIVERY NOTE</h2>
          <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>DukaanAI Order System</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl">{order.order_id || 'ORD-1001'}</div>
          <div className="text-muted" style={{ fontSize: '0.875rem' }}>{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="font-bold mb-2">Items to Deliver:</div>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {validItems.map((item, index) => (
            <li key={index} className="flex justify-between mb-2" style={{ borderBottom: '1px solid var(--bg-light)', paddingBottom: '0.5rem' }}>
              <span>• {item.name}</span>
              <span className="font-bold">{item.quantity} {item.unit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-6" style={{ borderTop: '2px solid var(--neutral)', paddingTop: '1rem' }}>
        <div className="text-xl font-bold">Total: ₹{total}</div>
        <div className="badge badge-matched" style={{ fontSize: '0.875rem', padding: '0.25rem 1rem' }}>
          Status: Confirmed
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={18} /> Print Delivery Note
        </button>
      </div>
    </div>
  );
}
