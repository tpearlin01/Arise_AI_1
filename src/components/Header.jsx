import React from 'react';
import { Activity, LogOut, User } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header className="header animate-fade-in">
      <div>
        <h1>DukaanAI</h1>
        <p className="text-muted">AI-Powered Hinglish Order Desk</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <Activity size={16} />
          System Online
        </div>
        
        {user && (
          <div className="flex items-center gap-3 ml-4" style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--neutral)' }}>
            <div className="flex items-center gap-2 text-primary-dark">
              <div style={{ background: 'var(--neutral)', padding: '0.25rem', borderRadius: '50%' }}>
                <User size={16} color="var(--primary-dark)" />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.email || 'Shopkeeper'}</span>
            </div>
            <button 
              onClick={onLogout}
              className="btn btn-secondary" 
              style={{ padding: '0.25rem 0.5rem' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
