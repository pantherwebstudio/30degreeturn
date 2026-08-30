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
  CoffeeIcon,
  SparklesIcon,
  TargetIcon
} from '@/app/components/Icons';

interface HeaderProps {
  activePage?: 'home' | 'menu' | 'about';
  customer?: { name: string; mobile: string } | null;
  cartCount?: number;
  heroOverlay?: boolean;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onLogout?: () => void;
  onLoginClick?: () => void;
  onCartClick?: () => void;
  onTrackOrdersClick?: () => void;
  onLocationClick?: () => void;
  locationState?: { orderType: 'delivery' | 'dine-in'; isServiceable: boolean; distanceKm: number | null };
}

export default function Header({
  activePage = 'about',
  customer = null,
  cartCount = 0,
  heroOverlay = false,
  searchQuery = '',
  onSearchChange,
  onLogout,
  onLoginClick,
  onCartClick,
  onTrackOrdersClick,
  onLocationClick,
  locationState,
}: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      router.push('/menu?cart=open');
    }
    setIsMobileMenuOpen(false);
  };

  const handleTrackOrders = () => {
    if (onTrackOrdersClick) {
      onTrackOrdersClick();
    } else {
      router.push('/menu?track=open');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`sb-header ${heroOverlay ? 'hero-overlay' : ''}`}>
        <style jsx global>{`
          .sb-header {
            width: 100%;
            padding: 0.85rem 4%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(250, 243, 236, 0.94);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(152, 78, 49, 0.15);
            position: sticky;
            top: 0;
            z-index: 100;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .sb-header.hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-bottom: none !important;
            z-index: 100;
            padding: 1.25rem 4%;
          }

          /* Floating Capsule Navigation Pill Container on Hero */
          .sb-header.hero-overlay .sb-nav-list {
            background: rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            padding: 0.3rem 0.4rem;
            border-radius: 999px;
            gap: 0.25rem;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
          }

          .sb-header.hero-overlay .sb-nav-link {
            color: rgba(255, 255, 255, 0.88);
            padding: 0.45rem 1.15rem;
            border-radius: 999px;
            font-size: 0.88rem;
            font-weight: 600;
            position: relative;
            z-index: 1;
            overflow: hidden;
            transition: color 0.3s ease, transform 0.25s ease;
          }

          .sb-header.hero-overlay .sb-nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.28);
            border-radius: 999px;
            z-index: -1;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sb-header.hero-overlay .sb-nav-link:hover {
            color: #ffffff;
            transform: translateY(-1px);
          }

          .sb-header.hero-overlay .sb-nav-link:hover::before {
            transform: scaleX(1);
            transform-origin: left;
          }

          .sb-header.hero-overlay .sb-nav-link::after {
            display: none !important;
          }

          .sb-header.hero-overlay .sb-nav-link.active {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.35);
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          }

          .sb-header.hero-overlay .logo-box img {
            width: 85px;
            height: 85px;
            object-fit: contain;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35));
          }

          .sb-header.hero-overlay .search-input-trigger {
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.28);
            color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(14px);
            font-size: 0.85rem;
          }

          .sb-header.hero-overlay .search-icon {
            color: rgba(255, 255, 255, 0.85);
          }

          .sb-header.hero-overlay .profile-btn {
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.28);
            color: #ffffff;
            backdrop-filter: blur(14px);
          }

          .sb-header.hero-overlay .hamburger-btn {
            color: #ffffff;
          }

          .logo-box {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;

            /* Override default logo rules to ensure clean circular mark */
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
          }

          .logo-box img {
            width: 52px;
            height: 52px;
            object-fit: contain;
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .logo-box:hover img {
            transform: scale(1.06);
          }

          .sb-header.hero-overlay .logo-box img {
            width: 150px;
            height: 150px;
            object-fit: contain;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
          }

          .sb-brand-name {
            font-family: var(--font-serif);
            font-weight: 700;
            font-size: 1.25rem;
            letter-spacing: -0.02em;
            color: var(--primary-dark);
          }

          .sb-nav {
            display: flex;
            align-items: center;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }

          .sb-nav-list {
            display: flex;
            align-items: center;
            gap: 1.75rem;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .sb-nav-link {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-dark);
            text-decoration: none;
            transition: color 0.2s ease;
            position: relative;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
          }

          .sb-nav-link:hover,
          .sb-nav-link.active {
            color: var(--primary);
          }

          .sb-nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--primary);
            border-radius: 2px;
          }

          .sb-nav-cart-btn {
            background-color: var(--primary);
            color: white;
            padding: 0.45rem 1rem;
            border-radius: var(--radius-full);
            font-weight: 600;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            transition: var(--transition-fast);
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-sm);
          }

          .sb-nav-cart-btn:hover {
            background-color: var(--primary-light);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          .sb-header-right {
            display: flex;
            align-items: center;
            gap: 0.85rem;
          }

          .hamburger-btn {
            display: none;
            background: none;
            border: none;
            color: var(--primary-dark);
            cursor: pointer;
            padding: 0.35rem;
            border-radius: 10px;
            transition: background-color 0.2s ease;
          }

          .hamburger-btn:hover {
            background-color: rgba(152, 78, 49, 0.1);
          }

          /* Profile Dropdown Container */
          .profile-dropdown-container {
            position: relative;
          }

          .profile-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: rgba(250, 243, 236, 0.25);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: none;
            color: #FAF3EC;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .profile-btn:hover {
            background: rgba(255, 255, 255, 0.4);
            color: #ffffff;
            transform: scale(1.06);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          }

          .dropdown-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999;
            background: transparent;
          }

          .profile-dropdown-menu {
            position: absolute;
            top: calc(100% + 12px);
            right: 0;
            width: 260px;
            background: rgba(250, 243, 236, 0.58);
            backdrop-filter: blur(28px) saturate(190%);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.35);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);
            padding: 1.25rem;
            z-index: 1000;
            color: #FAF3EC;
            animation: dropFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes dropFade {
            from { opacity: 0; transform: translateY(-8px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .dropdown-header-info {
            border-bottom: 1px solid rgba(152, 78, 49, 0.2);
            padding-bottom: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .dropdown-user-name {
            font-weight: 800;
            font-size: 1rem;
            color: #21100a;
          }

          .dropdown-user-mobile {
            font-size: 0.82rem;
            color: #6E5444;
            margin-top: 0.15rem;
          }

          .dropdown-item-btn {
            width: 100%;
            padding: 0.65rem 0.85rem;
            border-radius: 14px;
            border: none;
            background: transparent;
            color: #21100a;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            transition: all 0.2s ease;
            text-align: left;
          }

          .dropdown-item-btn:hover {
            background: rgba(152, 78, 49, 0.15);
            color: #984e31;
          }

          .dropdown-item-btn.logout {
            color: #c62828;
          }

          .dropdown-item-btn.logout:hover {
            background: #fdecea;
            color: #c62828;
          }

          .search-container {
            position: relative;
            width: 280px;
            cursor: pointer;
          }

          .search-input-trigger {
            width: 100%;
            padding: 0.5rem 1rem 0.5rem 2.2rem;
            border-radius: var(--radius-full);
            border: 1px solid var(--border-color);
            font-size: 0.85rem;
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
            background-color: var(--bg-light);
            color: var(--text-dark);
            outline: none;
            transition: all 0.3s ease;
          }

          .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(152, 78, 49, 0.15);
            background-color: #ffffff;
          }

          .search-icon {
            position: absolute;
            left: 0.85rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
            pointer-events: none;
          }

          /* Mobile Menu Drawer */
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(6px) !important;
            -webkit-backdrop-filter: blur(6px) !important;
            z-index: 300;
            animation: fadeIn 0.2s ease forwards;
          }

          .mobile-menu-drawer {
            position: fixed;
            top: 0;
            right: 0;
            width: 280px;
            height: 100%;
            background: rgba(250, 243, 236, 0.96) !important;
            backdrop-filter: blur(24px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
            z-index: 310;
            display: flex;
            flex-direction: column;
            box-shadow: -5px 0 30px rgba(0, 0, 0, 0.2);
            border-left: 1px solid rgba(152, 78, 49, 0.2);
            animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          .mobile-menu-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid rgba(152, 78, 49, 0.15);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .mobile-menu-title {
            font-weight: 800;
            font-size: 1.1rem;
            color: #21100a;
          }

          .mobile-menu-close {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #984e31;
            border-radius: 50%;
            border: 1px solid rgba(152, 78, 49, 0.2);
            background: rgba(152, 78, 49, 0.1);
          }

          .mobile-menu-body {
            flex: 1;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .mobile-menu-item {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.8rem 1rem;
            border-radius: 14px;
            font-weight: 700;
            font-size: 0.92rem;
            color: #21100a;
            text-decoration: none;
            background: transparent;
            border: none;
            cursor: pointer;
            text-align: left;
            transition: background-color 0.2s ease;
          }

          .mobile-menu-item:hover,
          .mobile-menu-item.active {
            background-color: rgba(152, 78, 49, 0.1);
            color: #984e31;
          }

          .mobile-menu-item-icon {
            color: #984e31;
            display: flex;
            align-items: center;
          }

          .mobile-menu-divider {
            height: 1px;
            background: rgba(152, 78, 49, 0.15);
            margin: 0.5rem 0;
          }

          @media (max-width: 768px) {
            .sb-header {
              padding: 0.65rem 1.25rem;
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
              gap: 0.5rem;
            }
          }

          @media (max-width: 768px) {
            .sb-header.hero-overlay .logo-box img {
              width: 110px;
              height: 110px;
            }

            .sb-header:not(.hero-overlay) .logo-box img {
              width: 44px;
              height: 44px;
            }
          }
        `}</style>

        {/* Brand Mark */}
        <div className="logo-box" onClick={() => router.push('/')}>
          <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" />
          {!heroOverlay && <span className="sb-brand-name">30° TURN CAFE</span>}
        </div>

        {/* Desktop Nav */}
        <nav className="sb-nav">
          <ul className="sb-nav-list">
            <li><a href="/" className={`sb-nav-link ${activePage === 'home' ? 'active' : ''}`}>Home</a></li>
            <li><a href="/menu" className={`sb-nav-link ${activePage === 'menu' ? 'active' : ''}`}>Order Online</a></li>
            <li><a href="/about" className={`sb-nav-link ${activePage === 'about' ? 'active' : ''}`}>Our Story</a></li>
            {onLocationClick && (
              <li>
                <button
                  className="sb-nav-link"
                  onClick={onLocationClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: locationState?.orderType === 'delivery' && locationState?.isServiceable ? '#2e7d32' : '#984e31'
                  }}
                >
                  <TargetIcon size={14} />
                  {locationState?.orderType === 'delivery' ? (
                    locationState?.isServiceable ? (
                      `Delivery (${locationState.distanceKm?.toFixed(1)}km)`
                    ) : (
                      'Not Serviceable (>2km)'
                    )
                  ) : (
                    'Dine-In / Pickup'
                  )}
                </button>
              </li>
            )}
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

        {/* Header Right Actions */}
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

          {/* Cart button if item added */}
          {cartCount > 0 && (
            <button className="sb-nav-cart-btn" onClick={handleCartClick}>
              <CartIcon size={14} /> ({cartCount})
            </button>
          )}

          {/* Profile Icon with Dropdown Menu */}
          <div className="profile-dropdown-container">
            <button
              className="profile-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Profile & Account"
            >
              <UserIcon size={18} />
            </button>

            {isProfileDropdownOpen && (
              <>
                <div className="dropdown-overlay" onClick={() => setIsProfileDropdownOpen(false)} />
                <div className="profile-dropdown-menu">
                  {customer ? (
                    <div className="dropdown-header-info">
                      <div className="dropdown-user-name">Hi, {customer.name}</div>
                      <div className="dropdown-user-mobile">{customer.mobile}</div>
                    </div>
                  ) : (
                    <div className="dropdown-header-info">
                      <div className="dropdown-user-name">Welcome to 30° Turn</div>
                      <div className="dropdown-user-mobile">Guest User</div>
                    </div>
                  )}

                  {onLocationClick && (
                    <button
                      className="dropdown-item-btn"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onLocationClick();
                      }}
                      style={{
                        color: locationState?.orderType === 'delivery' && locationState?.isServiceable ? '#2e7d32' : '#984e31'
                      }}
                    >
                      <TargetIcon size={16} />
                      {locationState?.orderType === 'delivery' ? (
                        locationState?.isServiceable ? (
                          `Delivery (${locationState.distanceKm?.toFixed(1)}km)`
                        ) : (
                          'Not Serviceable (>2km)'
                        )
                      ) : (
                        'Dine-In / Pickup Mode'
                      )}
                    </button>
                  )}

                  <button
                    className="dropdown-item-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      handleTrackOrders();
                    }}
                  >
                    <SearchIcon size={16} />
                    Track My Orders
                  </button>

                  <div style={{ height: '1px', background: 'rgba(152, 78, 49, 0.15)', margin: '0.4rem 0' }} />

                  {customer ? (
                    <button
                      className="dropdown-item-btn logout"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOutIcon size={16} />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      className="dropdown-item-btn"
                      style={{ color: '#984e31' }}
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLoginClick();
                      }}
                    >
                      <LogInIcon size={16} />
                      Customer Sign In
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <MenuIcon size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Navigation</span>
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
                Order Online
              </a>
              <a href="/about" className={`mobile-menu-item ${activePage === 'about' ? 'active' : ''}`}>
                <span className="mobile-menu-item-icon"><SparklesIcon size={18} /></span>
                Our Story
              </a>

              {onLocationClick && (
                <button
                  className="mobile-menu-item"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLocationClick();
                  }}
                  style={{
                    color: locationState?.orderType === 'delivery' && locationState?.isServiceable ? '#2e7d32' : '#984e31'
                  }}
                >
                  <span className="mobile-menu-item-icon"><TargetIcon size={18} /></span>
                  {locationState?.orderType === 'delivery' ? (
                    locationState?.isServiceable ? (
                      `Delivery (${locationState.distanceKm?.toFixed(1)}km)`
                    ) : (
                      'Not Serviceable (>2km)'
                    )
                  ) : (
                    'Dine-In / Pickup Mode'
                  )}
                </button>
              )}

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
