import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ onRetry }) {
  return (
    <div className="panel flex-col items-center justify-center text-center animate-fade-in" style={{ padding: '3rem', borderLeft: '4px solid var(--danger)' }}>
      <AlertCircle size={48} color="var(--danger)" className="mb-4" />
      <h3 className="text-xl mb-2">Unable to process the order.</h3>
      <p className="text-muted mb-6">Something went wrong while communicating with the AI service.</p>
      <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  );
}
