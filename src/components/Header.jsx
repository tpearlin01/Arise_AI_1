import React from 'react';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="header animate-fade-in">
      <div>
        <h1>DukaanAI</h1>
        <p className="text-muted">AI-Powered Hinglish Order Desk</p>
      </div>
      <div className="status-indicator">
        <div className="status-dot"></div>
        <Activity size={16} />
        System Online
      </div>
    </header>
  );
}
