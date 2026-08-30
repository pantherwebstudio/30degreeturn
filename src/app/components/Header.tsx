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
      <header className={`sb-header ${heroOverlay ? 'hero-overlay' : 'sticky-bar'}`}>
        <style jsx global>{`
          .sb-header {
            width: 100%;
            padding: 0.85rem 4%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(250, 243, 236, 0.96);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid rgba(152, 78, 49, 0.15);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            transition: background 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        backdrop-filter 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        -webkit-backdrop-filter 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        padding 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                        border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .sb-header.hero-overlay {
            position: fixed;
            top: 0;
            left: 0;
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-bottom: 1px solid transparent !important;
            box-shadow: none !important;
            z-index: 100;
            padding: 1.25rem 4%;
          }

          /* Animated Logo: Left on Hero, Center after Hero */
          .logo-box {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            cursor: pointer;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 10;
          }

          .sb-header.hero-overlay .logo-box {
            position: relative;
            left: 0;
            transform: none;
          }

          .sb-header.sticky-bar .logo-box {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }

          .logo-box img {
            width: 66px;
            height: 66px;
            object-fit: contain;
            transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .sb-header.hero-overlay .logo-box img {
            width: 85px;
            height: 85px;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35));
          }

          .sb-brand-name {
            font-family: var(--font-serif);
            font-weight: 700;
            font-size: 1.25rem;
            letter-spacing: -0.02em;
            color: var(--primary-dark);
          }

          /* Desktop Nav Positioning */
          .sb-nav {
            display: flex;
            align-items: center;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Hero Overlay Nav: Centered Capsule */
          .sb-header.hero-overlay .sb-nav {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }

          /* Sticky Non-Hero Nav: Left Positioned Capsule */
          .sb-header.sticky-bar .sb-nav {
            position: relative;
            left: 0;
            transform: none;
          }

          /* Hero Navigation List Capsule */
          .sb-header.hero-overlay .sb-nav-list {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: nowrap;
            white-space: nowrap;
            background: rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            padding: 0.35rem 0.6rem;
            border-radius: 999px;
            gap: 0.35rem;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
            list-style: none;
            margin: 0;
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
            text-decoration: none;
            background: transparent;
            border: none;
            cursor: pointer;
            display: inline-block;
            white-space: nowrap;
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

          /* Sticky Non-Hero Nav List Capsule */
          .sb-header.sticky-bar .sb-nav-list {
            background: #EFE4D6;
            border: 1.5px solid rgba(152, 78, 49, 0.18);
            border-radius: 999px;
            padding: 0.3rem 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.35rem;
            list-style: none;
            margin: 0;
            box-shadow: 0 4px 15px rgba(33, 16, 10, 0.04);
          }

          .sb-header.sticky-bar .sb-nav-link {
            font-size: 0.85rem;
            font-weight: 700;
            color: #4A2E1C;
            padding: 0.45rem 1rem;
            border-radius: 999px;
            text-decoration: none;
            position: relative;
            z-index: 1;
            overflow: hidden;
            transition: color 0.3s ease, transform 0.25s ease;
            background: transparent;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }

          .sb-header.sticky-bar .sb-nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(152, 78, 49, 0.14);
            border-radius: 999px;
            z-index: -1;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sb-header.sticky-bar .sb-nav-link:hover {
            color: #984e31;
            transform: translateY(-1px);
          }

          .sb-header.sticky-bar .sb-nav-link:hover::before {
            transform: scaleX(1);
            transform-origin: left;
          }

          .sb-header.sticky-bar .sb-nav-link.active {
            background: #21100a;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(33, 16, 10, 0.2);
          }

          .sb-header.sticky-bar .sb-nav-link.active {
            background: #21100a;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(33, 16, 10, 0.2);
          }

          .sb-header-right {
            display: flex;
            align-items: center;
            gap: 0.85rem;
          }

          .user-greeting {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            font-weight: 700;
            color: #984e31;
            background: #FAF3EC;
            padding: 0.35rem 0.85rem;
            border-radius: 999px;
            border: 1px solid rgba(152, 78, 49, 0.2);
          }

          .icon-btn.logout {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid rgba(217, 83, 79, 0.3);
            color: #d9534f;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .icon-btn.logout:hover {
            background: #fdecea;
            color: #c62828;
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
            width: 270px;
            background: rgba(33, 16, 10, 0.88);
            backdrop-filter: blur(28px) saturate(190%);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            border-radius: 24px;
            border: 1px solid rgba(152, 78, 49, 0.35);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
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
            border-bottom: 1px solid rgba(250, 243, 236, 0.15);
            padding-bottom: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .dropdown-user-name {
            font-weight: 800;
            font-size: 1rem;
            color: #FAF3EC;
          }

          .dropdown-user-mobile {
            font-size: 0.82rem;
            color: #D2B48C;
            margin-top: 0.15rem;
          }

          .dropdown-item-btn {
            width: 100%;
            padding: 0.65rem 0.85rem;
            border-radius: 14px;
            border: none;
            background: transparent;
            color: #FAF3EC;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            transition: all 0.2s ease;
            text-align: left;
          }

          .dropdown-item-btn:hover {
            background: rgba(250, 243, 236, 0.15);
            color: #ffffff;
          }

          .dropdown-item-btn.logout {
            color: #ff6b6b;
          }

          .dropdown-item-btn.logout:hover {
            background: rgba(217, 83, 79, 0.2);
            color: #ff8787;
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

          .sb-header.hero-overlay .search-input-trigger {
            background: rgba(255, 255, 255, 0.14) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
            color: rgba(255, 255, 255, 0.95) !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18) !important;
            border-radius: 999px !important;
            padding: 0.55rem 1rem 0.55rem 2.3rem !important;
            font-size: 0.85rem !important;
            font-weight: 600 !important;
          }

          .sb-header.hero-overlay .search-icon {
            color: rgba(255, 255, 255, 0.9) !important;
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

            .sb-header .logo-box {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
            }

            .sb-header-right {
              margin-left: auto;
              gap: 0.4rem;
            }

            .profile-dropdown-container .profile-btn span {
              display: none !important;
            }

            .profile-dropdown-container .profile-btn {
              padding: 0.4rem !important;
              width: 38px !important;
              height: 38px !important;
              border-radius: 50% !important;
            }

            .hamburger-btn {
              display: flex;
              margin-left: auto;
            }

            .search-container {
              display: none;
            }

            .sb-header.hero-overlay .logo-box img {
              width: 85px;
              height: 85px;
              filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
            }

            .sb-header:not(.hero-overlay) .logo-box img {
              width: 56px;
              height: 56px;
            }
          }
        `}</style>

        {/* Brand Mark (Left on Hero, Center after Hero) */}
        <div className="logo-box" onClick={() => router.push('/')}>
          <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" />
        </div>

        {/* Desktop Nav */}
        <nav className="sb-nav">
          <ul className="sb-nav-list">
            <li><a href="/" className={`sb-nav-link ${activePage === 'home' ? 'active' : ''}`}>Home</a></li>
            <li><a href="/menu" className={`sb-nav-link ${activePage === 'menu' ? 'active' : ''}`}>Order</a></li>
            <li><a href="/about" className={`sb-nav-link ${activePage === 'about' ? 'active' : ''}`}>Our Story</a></li>
            {!heroOverlay && onLocationClick && (
              <li>
                <button
                  className="sb-nav-link"
                  onClick={onLocationClick}
                  style={{
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
            {!heroOverlay && cartCount > 0 && (
              <li>
                <button className="sb-nav-link active" onClick={handleCartClick} style={{ background: '#984e31' }}>
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

          {/* Profile Icon / Badge with Dropdown Menu in ALL navbars */}
          <div className="profile-dropdown-container">
            <button
              className="profile-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Profile & Account"
              style={!heroOverlay ? {
                background: '#FAF3EC',
                color: '#984e31',
                border: '1px solid rgba(152, 78, 49, 0.25)',
                width: 'auto',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                gap: '0.4rem',
                fontWeight: 700,
                fontSize: '0.85rem'
              } : undefined}
            >
              <UserIcon size={18} />
              {!heroOverlay && (customer ? <span>Hi, {customer.name.split(' ')[0]}</span> : null)}
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
                        color: locationState?.orderType === 'delivery' && locationState?.isServiceable ? '#2e7d32' : '#D2B48C'
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

                  <div style={{ height: '1px', background: 'rgba(250, 243, 236, 0.15)', margin: '0.4rem 0' }} />

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
                      style={{ color: '#D2B48C' }}
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
