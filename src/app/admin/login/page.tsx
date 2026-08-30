'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      // Redirect to Admin dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <style jsx global>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
          padding: 1.5rem;
        }

        .login-card {
          background: var(--bg-creamy);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 420px;
          padding: 3rem 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-logo {
          width: 48px;
          height: 48px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          margin: 0 auto 1.5rem auto;
          box-shadow: var(--shadow-sm);
        }

        .login-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          text-align: center;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .login-subtitle {
          text-align: center;
          color: var(--text-light);
          font-size: 0.9rem;
          margin-bottom: 2.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-medium);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
        }

        .error-box {
          background-color: rgba(217, 83, 79, 0.1);
          color: #d9534f;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          border-left: 3px solid #d9534f;
          font-weight: 500;
        }

        .submit-btn {
          width: 100%;
          margin-top: 1rem;
          background-color: var(--primary);
          color: white;
          padding: 0.85rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .submit-btn:hover {
          background-color: var(--primary-light);
        }

        .back-btn {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 500;
        }

        .back-btn:hover {
          color: var(--primary);
        }
      `}</style>

      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="30° Turn Cafe Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-md)' }} />
        </div>
        <h1 className="login-title">Cafe Manager Login</h1>
        <p className="login-subtitle">Sign in to manage orders and updates</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@30degreecafe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Verifying Session...' : 'Access Dashboard'}
          </button>
        </form>

        <a href="/" className="back-btn">← Back to Main Menu</a>
      </div>
    </div>
  );
}
