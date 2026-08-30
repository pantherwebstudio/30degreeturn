'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIcon,
  UserIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
  LogOutIcon,
  LogInIcon,
  CoffeeIcon
} from '@/app/components/Icons';

interface HeaderProps {
  activePage: 'home' | 'menu';
  customer: { name: string; mobile: string } | null;
  cartCount: number;
  heroOverlay?: boolean;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLogout?: () => void;
  onLoginClick?: () => void;
  onCartClick?: () => void;
  onTrackOrdersClick?: () => void;
}

export default function Header({
  activePage,
  customer,
  cartCount,
  heroOverlay = false,
  searchQuery = '',
  onSearchChange,
  onLogout,
  onLoginClick,
  onCartClick,
  onTrackOrdersClick,
}: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem('30_turn_user');
    localStorage.removeItem('30_turn_cart');
    if (activePage === 'home') {
      router.refresh();
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/menu?login=open');
    }
    setIsMobileMenuOpen(false);
  };

  const handleTrackOrders = () => {
    if (onTrackOrdersClick) {
      onTrackOrdersClick();
    } else {
      router.push('/menu?orders=open');
    }
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      router.push('/menu?cart=open');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style jsx global>{`
        .sb-header {
          background-color: var(--bg-white);
          border-bottom: 1px solid var(--border-color);
          padding: 10px 10px 10px 10px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          transition: background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .sb-header nav {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .sb-header.hero-overlay {
          background-color: transparent;
          border-bottom: none;
          box-shadow: none;
        }

        .sb-header.hero-overlay .sb-nav {
          background-color: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .sb-header.hero-overlay .sb-nav-link {
          color: rgba(255, 255, 255, 0.85);
        }

        .sb-header.hero-overlay .sb-nav-link:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.18);
        }

        .sb-header.hero-overlay .sb-nav-link.active {
          background-color: rgba(255, 255, 255, 0.25);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .sb-header.hero-overlay .sb-nav-link.active:hover {
          background-color: rgba(255, 255, 255, 0.35);
        }

        .sb-header.hero-overlay .sb-nav-cart-btn {
          color: rgba(255, 255, 255, 0.85);
        }

        .sb-header.hero-overlay .sb-nav-cart-btn:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.18);
        }

        .sb-header.hero-overlay .sb-nav-cart-btn::before {
          background: rgba(255, 255, 255, 0.1);
        }

        .sb-header.hero-overlay .search-input-trigger {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.8);
        }

        .sb-header.hero-overlay .search-icon {
          color: rgba(255, 255, 255, 0.7);
        }

        .sb-header.hero-overlay .search-input {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .sb-header.hero-overlay .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .sb-header.hero-overlay .profile-btn {
          border-color: rgba(255, 255, 255, 0.6);
          color: white;
        }

        .sb-header.hero-overlay .profile-btn:hover {
          border-color: white;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .sb-header.hero-overlay .icon-btn {
          border-color: rgba(255, 255, 255, 0.6);
          color: white;
        }

        .sb-header.hero-overlay .icon-btn:hover {
          border-color: white;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .sb-header.hero-overlay .icon-btn.logout {
          border-color: rgba(255, 100, 100, 0.7);
          color: rgba(255, 130, 130, 0.9);
        }

        .sb-header.hero-overlay .icon-btn.logout:hover {
          border-color: rgba(255, 100, 100, 1);
          background-color: rgba(255, 100, 100, 0.15);
        }

        .sb-header.hero-overlay .user-greeting {
          color: white;
        }

        .sb-header.hero-overlay .user-greeting .greeting-icon {
          color: white;
        }

        .sb-header.hero-overlay .hamburger-btn {
          color: white;
        }

        .sb-header.hero-overlay .hamburger-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .logo-box {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .logo-box img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .logo-box:hover img {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .sb-nav {
          display: flex;
          list-style: none;
          align-items: center;
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 0.25rem;
          gap: 0;
        }

        .sb-nav li {
          list-style: none;
        }

        .sb-nav-link {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-dark);
          position: relative;
          padding: 0.45rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          overflow: hidden;
          border-radius: var(--radius-full);
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .sb-nav-link:hover {
          background-color: rgba(152, 78, 49, 0.08);
          color: var(--primary);
        }

        .sb-nav-link.active {
          background-color: var(--primary);
          color: var(--text-white);
          box-shadow: 0 2px 8px rgba(152, 78, 49, 0.25);
        }

        .sb-nav-link.active:hover {
          background-color: var(--primary-light);
        }

        .sb-nav-link::after {
          display: none;
        }

        .sb-nav-cart-btn {
          font-weight: 600;
          font-size: 14px;
          color: var(--primary);
          padding: 0.45rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-full);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .sb-nav-cart-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(152, 78, 49, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .sb-nav-cart-btn:hover::before {
          width: 120px;
          height: 120px;
        }

        .sb-nav-cart-btn:hover {
          background-color: rgba(152, 78, 49, 0.1);
          transform: translateY(-1px);
        }

        .sb-header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--text-medium);
          color: var(--text-medium);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          flex-shrink: 0;
        }

        .icon-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: rgba(152, 78, 49, 0.08);
          transform: scale(1.1);
        }

        .icon-btn.logout {
          border-color: #d9534f;
          color: #d9534f;
        }

        .icon-btn.logout:hover {
          background-color: rgba(217, 83, 79, 0.12);
          border-color: #c9302c;
          color: #c9302c;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(217, 83, 79, 0.25);
        }

        .user-greeting {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
        }

        .user-greeting .greeting-icon {
          color: var(--primary);
        }

        .search-container {
          position: relative;
          width: 300px;
          cursor: pointer;
        }

        .search-input-trigger {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.2rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          font-size: 16px;
          font-weight: 500;
          background-color: var(--bg-light);
          color: var(--text-light);
          text-align: left;
          transition: all 0.3s ease;
        }

        .search-container:hover .search-input-trigger {
          border-color: var(--primary-light);
          box-shadow: 0 2px 8px rgba(152, 78, 49, 0.1);
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.2rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }

        .search-icon {
          position: absolute;
          left: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .profile-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--text-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-medium);
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .profile-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(152, 78, 49, 0.2);
        }

        .hamburger-btn {
          display: none;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          color: var(--text-dark);
          z-index: 210;
          border-radius: var(--radius-sm);
        }

        .hamburger-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 300;
          animation: fadeIn 0.2s ease forwards;
        }

        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 280px;
          height: 100%;
          background: var(--bg-white);
          z-index: 310;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-menu-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-menu-title {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .mobile-menu-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-medium);
          border-radius: 50%;
        }

        .mobile-menu-close:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .mobile-menu-body {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-dark);
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .mobile-menu-item:hover {
          background-color: var(--bg-light);
          color: var(--primary);
        }

        .mobile-menu-item.active {
          background-color: rgba(152, 78, 49, 0.08);
          color: var(--primary);
        }

        .mobile-menu-item-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .sb-header {
            padding: 0.6rem 1rem;
          }

          .sb-nav {
            display: none;
          }

          .hamburger-btn {
            display: flex;
          }

          .search-container {
            display: none;
          }

          .sb-header-right {
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .logo-box img {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>

      <header className={`sb-header ${heroOverlay ? 'hero-overlay' : ''}`}>
        <div className="logo-box" onClick={() => router.push('/')}>
          <img src="/30degree%20turn.png" alt="30° Turn Cafe Logo" />
        </div>
        <nav>
          <ul className="sb-nav">
            <li><a href="/" className={`sb-nav-link ${activePage === 'home' ? 'active' : ''}`}>Home</a></li>
            <li><a href="/menu" className={`sb-nav-link ${activePage === 'menu' ? 'active' : ''}`}>Order</a></li>
            <li>
              <button className="sb-nav-link" onClick={handleTrackOrders}>
                Track Orders
              </button>
            </li>
            {cartCount > 0 && (
              <li>
                <button className="sb-nav-cart-btn" onClick={handleCartClick}>
                  <CartIcon size={14} /> Cart ({cartCount})
                </button>
              </li>
            )}
          </ul>
        </nav>
        <div className="sb-header-right">
          {activePage === 'home' ? (
            <div className="search-container" onClick={() => router.push('/menu')}>
              <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}><SearchIcon size={14} /></span>
              <div className="search-input-trigger">Looking for something specific?</div>
            </div>
          ) : (
            <div className="search-container">
              <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}><SearchIcon size={14} /></span>
              <input
                type="text"
                className="search-input"
                placeholder="Looking for something specific?"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}

          {customer ? (
            <div className="user-greeting">
              <span className="greeting-icon"><UserIcon size={16} /></span>
              <span>Hi, {customer.name.split(' ')[0]}</span>
              <button
                className="icon-btn logout"
                onClick={handleLogout}
                title="Sign Out"
              >
                <LogOutIcon size={15} />
              </button>
            </div>
          ) : (
            <button
              className="profile-btn"
              onClick={handleLoginClick}
              title="Customer Sign In"
            >
              <LogInIcon size={16} />
            </button>
          )}

          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <MenuIcon size={24} />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="mobile-menu-body">
              <a href="/" className={`mobile-menu-item ${activePage === 'home' ? 'active' : ''}`}>
                <span className="mobile-menu-item-icon"><CoffeeIcon size={18} /></span>
                Home
              </a>
              <a href="/menu" className={`mobile-menu-item ${activePage === 'menu' ? 'active' : ''}`}>
                <span className="mobile-menu-item-icon"><CartIcon size={18} /></span>
                Order
              </a>
              <button className="mobile-menu-item" onClick={handleTrackOrders}>
                <span className="mobile-menu-item-icon"><SearchIcon size={18} /></span>
                Track Orders
              </button>
              {cartCount > 0 && (
                <button className="mobile-menu-item" onClick={handleCartClick}>
                  <span className="mobile-menu-item-icon"><CartIcon size={18} /></span>
                  Cart ({cartCount})
                </button>
              )}
              <div className="mobile-menu-divider" />
              {customer ? (
                <>
                  <div className="mobile-menu-item" style={{ cursor: 'default' }}>
                    <span className="mobile-menu-item-icon"><UserIcon size={18} /></span>
                    Hi, {customer.name.split(' ')[0]}
                  </div>
                  <button className="mobile-menu-item" onClick={handleLogout} style={{ color: '#d9534f' }}>
                    <span className="mobile-menu-item-icon"><LogOutIcon size={18} /></span>
                    Sign Out
                  </button>
                </>
              ) : (
                <button className="mobile-menu-item" onClick={handleLoginClick}>
                  <span className="mobile-menu-item-icon"><LogInIcon size={18} /></span>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
