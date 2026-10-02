import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Mock login delay
      setTimeout(() => {
        setIsLoading(false);
        onLogin({ email });
      }, 1000);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="panel" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>DukaanAI</h1>
          <p className="text-muted">Your AI-powered order desk</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="input-group">
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>Email / Username</label>
            <input 
              type="text" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
            />
          </div>
          
          <div className="input-group mb-2">
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Remember me</label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
