import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

export default function StatusBadge({ status }) {
  if (status === 'MATCHED') {
    return (
      <span className="badge badge-matched">
        <CheckCircle2 size={12} /> Matched
      </span>
    );
  }
  if (status === 'AMBIGUOUS') {
    return (
      <span className="badge badge-ambiguous">
        <AlertTriangle size={12} /> Ambiguous
      </span>
    );
  }
  if (status === 'OUT_OF_STOCK') {
    return (
      <span className="badge badge-outofstock">
        <XCircle size={12} /> Out of Stock
      </span>
    );
  }
  return (
    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
      <Search size={12} /> Not Found
    </span>
  );
}
