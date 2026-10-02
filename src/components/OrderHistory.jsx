import React from 'react';
import { History, Clock, CheckCircle } from 'lucide-react';

export default function OrderHistory() {
  const mockOrders = [
    { id: 'ORD-1002', total: 210, status: 'Confirmed', date: 'Today, 09:30 AM' },
    { id: 'ORD-1003', total: 480, status: 'Pending', date: 'Yesterday, 04:15 PM' },
    { id: 'ORD-1004', total: 125, status: 'Confirmed', date: 'Yesterday, 11:00 AM' }
  ];

  return (
    <div className="panel animate-fade-in mt-6">
      <h2 style={{ fontSize: '1.125rem' }}>
        <History size={18} color="var(--primary-dark)" />
        Recent Orders
      </h2>
      <div className="flex flex-col gap-3 mt-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="flex justify-between items-center" style={{ padding: '0.75rem', border: '1px solid var(--neutral)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div className="font-bold">{order.id}</div>
              <div className="text-muted flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <Clock size={12} /> {order.date}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary-dark">₹{order.total}</div>
              <div style={{ fontSize: '0.75rem', color: order.status === 'Confirmed' ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                {order.status === 'Confirmed' && <CheckCircle size={10} />}
                {order.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
