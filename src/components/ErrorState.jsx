import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ onRetry, message }) {
  return (
    <div className="panel flex-col items-center justify-center text-center animate-fade-in" style={{ padding: '3rem', borderLeft: '4px solid var(--danger)' }}>
      <AlertCircle size={48} color="var(--danger)" className="mb-4" />
      <h3 className="text-xl mb-2">Order Processing Failed</h3>
      <p className="text-muted mb-6">{message || "Something went wrong while communicating with the server."}</p>
      <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  );
}
