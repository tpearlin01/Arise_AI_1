import React from 'react';
import StatusBadge from './StatusBadge';
import { AlertCircle } from 'lucide-react';

export default function OrderItem({ item, onClarify }) {
  const isAmbiguous = item.status === 'AMBIGUOUS';

  return (
    <tr style={{ background: isAmbiguous ? 'rgba(241, 107, 79, 0.05)' : 'transparent' }}>
      <td>
        <div className="font-bold">{item.name || 'Unknown Item'}</div>
        {isAmbiguous && (
          <div className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <AlertCircle size={12} color="var(--warning)"/> Needs clarification
          </div>
        )}
      </td>
      <td>
        {item.quantity ? `${item.quantity} ${item.unit}` : <span className="text-muted">—</span>}
      </td>
      <td>
        <StatusBadge status={item.status} />
      </td>
      <td>
        {isAmbiguous && onClarify && (
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
            onClick={() => onClarify(item)}
          >
            Resolve
          </button>
        )}
      </td>
    </tr>
  );
}
