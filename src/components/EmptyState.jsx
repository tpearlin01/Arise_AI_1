import React from 'react';
import { MessageSquareText } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="glass-panel flex-col items-center justify-center text-center animate-fade-in" style={{ padding: '4rem 2rem', borderStyle: 'dashed' }}>
      <MessageSquareText size={48} className="text-muted mb-4" style={{ opacity: 0.5 }} />
      <h3 className="text-xl mb-2" style={{ color: 'var(--text-muted)' }}>Your order analysis will appear here.</h3>
      <p className="text-muted">Enter a customer's message on the left to get started.</p>
    </div>
  );
}
