'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, KeyIcon } from '@/app/components/Icons';

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
          background: radial-gradient(circle at 50% 20%, #4a2e1c 0%, #21100a 80%);
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .login-wrapper::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(203, 171, 128, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
          top: -150px;
          right: -150px;
          pointer-events: none;
        }

        .login-card {
          background: rgba(250, 243, 236, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
          width: 100%;
          max-width: 440px;
          padding: 3rem 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          z-index: 10;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .admin-logo-circle-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background-color: #FAF3EC;
          border: 2px solid rgba(152, 78, 49, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem;
          box-shadow: 0 8px 25px rgba(33, 16, 10, 0.12);
        }

        .login-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }

        .login-logo-img:hover {
          transform: scale(1.06);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #984e31;
          background: rgba(152, 78, 49, 0.1);
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          margin-bottom: 0.5rem;
        }

        .login-title {
          font-family: var(--font-serif);
          font-size: 1.9rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.35rem;
        }

        .login-subtitle {
          color: #6E5444;
          font-size: 0.9rem;
          line-height: 1.45;
        }

        .form-group {
          margin-bottom: 1.35rem;
        }

        .form-label {
          display: block;
          font-weight: 700;
          font-size: 0.8rem;
          color: #4A2E1C;
          margin-bottom: 0.45rem;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.1rem;
          color: #984e31;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 0.9rem 1.1rem 0.9rem 3rem;
          border-radius: 14px;
          background-color: #ffffff;
          border: 1.5px solid rgba(152, 78, 49, 0.2);
          font-size: 0.95rem;
          color: #21100a;
          outline: none;
          transition: all 0.25s ease;
        }

        .form-input:focus {
          border-color: #984e31;
          box-shadow: 0 0 0 4px rgba(152, 78, 49, 0.12);
        }

        .error-box {
          background-color: #fdecea;
          color: #c62828;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          font-size: 0.85rem;
          margin-bottom: 1.35rem;
          border-left: 4px solid #c62828;
          font-weight: 600;
        }

        .submit-btn {
          width: 100%;
          margin-top: 0.5rem;
          background: linear-gradient(135deg, #984e31 0%, #7e3e26 100%);
          color: white;
          padding: 0.95rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(152, 78, 49, 0.3);
          transition: all 0.25s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(152, 78, 49, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #6E5444;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-btn:hover {
          color: #984e31;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2.25rem 1.5rem;
            border-radius: 22px;
          }
          .login-title {
            font-size: 1.65rem;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo-container">
          <div className="admin-logo-circle-placeholder">
            <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" className="login-logo-img" />
          </div>
        </div>

        <div className="login-header">
          <span className="login-badge">Portal Authentication</span>
          <h1 className="login-title">Manager Login</h1>
          <p className="login-subtitle">Sign in to manage live orders and menu inventory</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Manager Email</label>
            <div className="input-icon-wrapper">
              <UserIcon size={18} className="input-icon" />
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
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div className="input-icon-wrapper">
              <KeyIcon size={18} className="input-icon" />
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
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Authenticating Session...' : 'Access Dashboard →'}
          </button>
        </form>

        <a href="/" className="back-btn">← Return to Public Cafe Menu</a>
      </div>
    </div>
  );
}
