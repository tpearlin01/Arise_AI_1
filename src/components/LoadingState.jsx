import React from 'react';

export default function LoadingState({ message = "Understanding order..." }) {
  return (
    <div className="glass-panel flex-col items-center justify-center text-center animate-fade-in" style={{ padding: '3rem' }}>
      <div className="spinner mb-4" style={{ borderColor: 'rgba(79, 70, 229, 0.3)', borderTopColor: 'var(--primary)' }}></div>
      <h3 className="text-xl mb-2">{message}</h3>
      <p className="text-muted">Our AI is processing the Hinglish text and matching products.</p>
    </div>
  );
}
