import React from 'react';
import { Printer, Download } from 'lucide-react';

export default function DeliveryNote({ order }) {
  if (!order || !order.items) return null;

  const validItems = order.items.filter(item => item.price && item.quantity);
  const total = validItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="glass-panel animate-fade-in" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <div className="flex justify-between items-center mb-6" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <h2 style={{ color: '#0f172a', margin: 0 }}>DELIVERY NOTE</h2>
        <div className="font-bold text-xl">{order.order_id || 'ORD-1001'}</div>
      </div>
      
      <div className="mb-6">
        <div className="font-bold mb-2">Items:</div>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {validItems.map((item, index) => (
            <li key={index} className="flex justify-between mb-2" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <span>• {item.name}</span>
              <span className="font-bold">{item.quantity} {item.unit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-6" style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
        <div className="text-xl font-bold">Total: ₹{total}</div>
        <div className="badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
          Status: Confirmed
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <button className="btn" style={{ background: '#e2e8f0', color: '#0f172a' }}>
          <Printer size={18} /> Print
        </button>
        <button className="btn" style={{ background: '#e2e8f0', color: '#0f172a' }}>
          <Download size={18} /> Download
        </button>
      </div>
    </div>
  );
}
