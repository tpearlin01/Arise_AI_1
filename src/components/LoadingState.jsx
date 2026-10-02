import React from 'react';

export default function LoadingState({ message = "Understanding order..." }) {
  return (
    <div className="panel flex-col items-center justify-center text-center animate-fade-in" style={{ padding: '3rem' }}>
      <div className="spinner mb-4" style={{ borderColor: 'rgba(93, 86, 70, 0.2)', borderTopColor: 'var(--primary-dark)' }}></div>
      <h3 className="text-xl mb-2">{message}</h3>
      <p className="text-muted">Our AI is processing the Hinglish text and matching products.</p>
    </div>
  );
}
