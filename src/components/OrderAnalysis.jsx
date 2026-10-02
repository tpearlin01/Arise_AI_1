import React from 'react';
import OrderItem from './OrderItem';
import { Sparkles } from 'lucide-react';

export default function OrderAnalysis({ order, onClarify }) {
  if (!order || !order.items) return null;

  return (
    <div className="panel animate-fade-in">
      <h2>
        <Sparkles size={20} color="var(--primary-dark)" />
        AI Order Analysis
      </h2>
      
      <div className="table-container mt-4">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <OrderItem 
                key={item.id || index} 
                item={item} 
                onClarify={onClarify}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
