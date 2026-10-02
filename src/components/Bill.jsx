import React from 'react';
import { Printer } from 'lucide-react';

export default function Bill({ order }) {
  if (!order || !order.items) return null;

  const validItems = order.items.filter(item => item.price && item.quantity);
  const total = validItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="panel animate-fade-in" style={{ background: '#fff', color: 'var(--text-main)', border: '1px solid var(--neutral)' }}>
      <div className="text-center mb-6" style={{ borderBottom: '2px dashed var(--neutral)', paddingBottom: '1rem' }}>
        <h2 className="justify-center" style={{ color: 'var(--primary-dark)', margin: 0, fontSize: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>DUKAANAI</h2>
        <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>Order Bill</div>
      </div>
      
      <div className="flex justify-between items-center mb-6 text-sm">
        <div>
          <div className="text-muted">Order ID:</div>
          <div className="font-bold">{order.order_id || 'ORD-1001'}</div>
        </div>
        <div className="text-right">
          <div className="text-muted">Date:</div>
          <div className="font-bold">{new Date().toLocaleString()}</div>
        </div>
      </div>

      <div className="table-container mb-6">
        <table style={{ fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--primary-dark)' }}>
              <th>Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {validItems.map((item, index) => (
              <tr key={index}>
                <td className="font-bold">{item.name}</td>
                <td className="text-center">{item.quantity} {item.unit}</td>
                <td className="text-right">₹{item.price}</td>
                <td className="text-right font-bold">₹{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6" style={{ borderTop: '2px dashed var(--primary-dark)', paddingTop: '1rem' }}>
        <div className="text-xl font-bold">Total</div>
        <div className="text-xl font-bold text-primary-dark">₹{total}</div>
      </div>

      <div className="text-center mt-4 mb-6">
        <div className="badge badge-matched" style={{ fontSize: '0.875rem', padding: '0.25rem 1rem' }}>
          {order.status === 'CONFIRMED' ? 'ORDER CONFIRMED' : 'ORDER CONFIRMED'}
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={18} /> Print Bill
        </button>
      </div>
    </div>
  );
}
