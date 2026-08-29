'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  SearchIcon,
  UserIcon,
  CartIcon,
  CoffeeIcon,
  SparklesIcon,
  LeafIcon,
  CakeIcon,
  ChevronDownIcon
} from '@/app/components/Icons';

const DESKTOP_VIDEO_URL = "./Untitled design.mp4";
const MOBILE_VIDEO_URL = "Untitled-1.mp4";

export default function Home() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<{ name: string; mobile: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState(DESKTOP_VIDEO_URL);

  // Read cart quantity, customer login, and handle responsive video swaps on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('30_turn_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const count = parsed.reduce((sum, ci) => sum + ci.quantity, 0);
          setCartCount(count);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedUser = localStorage.getItem('30_turn_user');
    if (savedUser) {
      try {
        setCustomer(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Dynamic responsive video selection
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVideoUrl(MOBILE_VIDEO_URL);
      } else {
        setVideoUrl(DESKTOP_VIDEO_URL);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCustomerLogout = () => {
    setCustomer(null);
    localStorage.removeItem('30_turn_user');
    router.refresh();
  };

  const scrollToSeasonal = () => {
    const el = document.getElementById('seasonal-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="starbucks-layout">
      <style jsx global>{`
        .starbucks-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-white);
        }

        /* Header Navigation */
        .sb-header {
          background-color: var(--bg-white);
          border-bottom: 1px solid var(--border-color);
          padding: 0.8rem 6%;
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }

        .logo-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .logo-box img {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .logo-box img:hover {
          transform: scale(1.05);
        }

        .logo-brand {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--primary-dark);
          letter-spacing: -0.5px;
        }

        .logo-brand span {
          color: var(--primary);
          font-weight: 500;
        }

        .sb-nav {
          display: flex;
          gap: 2.2rem;
          list-style: none;
          align-items: center;
        }

        .sb-nav-link {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-dark);
          position: relative;
          padding: 0.5rem 0;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .sb-nav-link:hover {
          color: var(--primary);
        }

        .sb-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--primary);
          border-radius: 2px;
        }

        .sb-header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* Search bar trigger */
        .search-container {
          position: relative;
          width: 260px;
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
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid var(--text-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-medium);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .sb-header {
            padding: 0.8rem 1.5rem;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .sb-nav {
            order: 3;
            width: 100%;
            justify-content: center;
            gap: 1.5rem;
            border-top: 1px solid var(--border-color);
            padding-top: 0.75rem;
            margin-top: 0.25rem;
          }
          .search-container {
            width: 170px;
          }
        }

        @media (max-width: 480px) {
          .logo-brand span {
            display: none;
          }
          .search-container {
            width: 130px;
          }
        }

        /* Promo Ribbon */
        .promo-ribbon {
          background-color: var(--primary-dark);
          color: var(--text-white);
          padding: 0.6rem 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.825rem;
          font-weight: 600;
        }

        .ribbon-btn {
          background-color: transparent;
          color: white;
          border: 1px solid white;
          padding: 0.25rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          transition: var(--transition-fast);
        }

        .ribbon-btn:hover {
          background-color: white;
          color: var(--primary-dark);
        }

        /* Cinematic Full-Video Hero Section */
        .cinema-hero {
          position: relative;
          height: calc(100vh - 72px);
          min-height: 520px;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 3.5rem;
          background-color: var(--primary-dark);
        }

        .cinema-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 25, 20, 0.45);
          z-index: 2;
          pointer-events: none;
        }

        .scroll-down-btn {
          position: relative;
          z-index: 3;
          background: rgba(255, 255, 255, 0.12);
          border: 2px solid rgba(255, 255, 255, 0.45);
          color: #FFFFFF;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: bounce 2s infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scroll-down-btn:hover {
          background: rgba(255, 255, 255, 0.28);
          border-color: #FFFFFF;
          transform: translateY(-2px);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        /* Seasonal Details Section */
        .season-hero {
          background-color: var(--bg-mint);
          margin: 3.5rem 6%;
          border-radius: var(--radius-md);
          padding: 3rem 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3rem;
          scroll-margin-top: 90px;
        }

        @media (max-width: 768px) {
          .season-hero {
            flex-direction: column;
            text-align: center;
            padding: 2.5rem 1.5rem;
            margin: 2rem 1.5rem;
            gap: 2rem;
          }
        }

        .season-content {
          max-width: 60%;
        }

        @media (max-width: 768px) {
          .season-content {
            max-width: 100%;
          }
        }

        .season-tag {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .season-title {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .season-desc {
          font-size: 0.95rem;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .season-image-box {
          position: relative;
          width: 420px;
          height: 280px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          flex-shrink: 0;
        }

        @media (max-width: 992px) {
          .season-image-box {
            width: 320px;
            height: 220px;
          }
        }

        @media (max-width: 768px) {
          .season-image-box {
            width: 100%;
            max-width: 420px;
            height: 240px;
          }
        }

        /* Handcrafted Curations */
        .curations-section {
          padding: 3rem 6%;
        }

        .section-heading {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }

        .curations-list {
          display: flex;
          gap: 2.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }

        .curation-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          cursor: pointer;
          min-width: 85px;
        }

        .curation-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background-color: var(--bg-sage-light);
          border: 2px solid transparent;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          box-shadow: var(--shadow-sm);
        }

        .curation-item:hover .curation-circle {
          border-color: var(--primary);
          transform: scale(1.05);
        }

        .curation-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        /* Call to Action Banner */
        .cta-section {
          background-color: var(--bg-light);
          padding: 4rem 6%;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .cta-box {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          color: var(--primary-dark);
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .cta-desc {
          color: var(--text-medium);
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        /* Article Banner */
        .world-coffee-section {
          padding: 3rem 6%;
          background-color: var(--bg-white);
        }

        .article-banner {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          aspect-ratio: 21/9;
          display: flex;
          align-items: center;
          padding: 4rem;
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 768px) {
          .article-banner {
            aspect-ratio: 16/9;
            padding: 1.5rem;
          }
        }

        .article-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%);
          z-index: 1;
        }

        .article-content {
          position: relative;
          z-index: 2;
          color: white;
          max-width: 500px;
        }

        .article-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--bg-mint);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .article-title {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .article-desc {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 1.75rem;
        }

        /* Starbucks Footer */
        .sb-footer {
          background-color: var(--primary-dark);
          color: var(--text-white);
          padding: 4rem 8% 2rem 8%;
          font-size: 0.85rem;
        }

        .sb-footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .sb-footer-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sb-footer-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-white);
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .sb-footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          list-style: none;
        }

        .sb-footer-link {
          color: var(--bg-creamy);
          font-weight: 500;
        }

        .sb-footer-link:hover {
          color: white;
        }

        .sb-footer-socials {
          display: flex;
          gap: 1.25rem;
          margin-top: 0.5rem;
        }

        .social-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #A0B2A6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #A0B2A6;
          font-size: 0.9rem;
        }

        .app-badges {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .sb-footer-bottom {
          border-top: 1px solid #3B5B47;
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          color: #A0B2A6;
          font-size: 0.75rem;
        }

        .sb-footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }

        .sb-footer-bottom-link:hover {
          color: white;
        }
      `}</style>

      {/* Header */}
      <header className="sb-header">
        <div className="logo-box" onClick={() => router.push('/')}>
          <img src="/30degree%20turn.png" alt="30° Turn Cafe Logo" />
          <div className="logo-brand">30° TURN<span> CAFE</span></div>
        </div>
        <nav>
          <ul className="sb-nav">
            <li><a href="/" className="sb-nav-link active">Home</a></li>
            <li><a href="/menu" className="sb-nav-link">Order</a></li>
            <li>
              <button className="sb-nav-link" onClick={() => router.push('/menu?orders=open')}>
                Track Orders
              </button>
            </li>
            {cartCount > 0 && (
              <li>
                <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)', gap: '0.35rem' }} onClick={() => router.push('/menu?cart=open')}>
                  <CartIcon size={14} /> Cart ({cartCount})
                </button>
              </li>
            )}
          </ul>
        </nav>
        <div className="sb-header-right">
          {/* Triggers search redirecting to menu */}
          <div className="search-container" onClick={() => router.push('/menu')}>
            <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}><SearchIcon size={14} /></span>
            <div className="search-input-trigger">Looking for something specific?</div>
          </div>

          {customer ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>
                Hi, {customer.name.split(' ')[0]}
              </span>
              <button
                onClick={handleCustomerLogout}
                style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d9534f', textTransform: 'uppercase' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="profile-btn"
              onClick={() => router.push('/menu')}
              title="Customer Sign In (Redirect to Order Menu)"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <UserIcon size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Seasonal Hero Banner */}
      {/* Cinema Fullscreen Background Video Hero */}
      <section className="cinema-hero">
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Cinematic dark overlay */}
        <div className="cinema-overlay"></div>

        {/* Scroll Down Indicator Arrow */}
        <button
          className="scroll-down-btn"
          onClick={scrollToSeasonal}
          title="Explore New Season Menu"
        >
          <ChevronDownIcon size={24} />
        </button>
      </section>

      {/* Seasonal Feature Content Banner */}
      <section id="seasonal-section" className="season-hero">
        <div className="season-content">
          <span className="season-tag">New this season</span>
          <h2 className="season-title">Cozy up with hand-brewed perfection</h2>
          <p className="season-desc">
            Explore our limited-run specialty series of slow-brewed lattes, Uji ceremonial matchas, and fresh butter pastries designed to elevate your morning routine.
          </p>
          <button className="btn-primary" onClick={() => router.push('/menu')}>Order Now</button>
        </div>
        <div className="season-image-box">
          <Image
            src="/hero_cafe.jpg"
            alt="Handcrafted Coffee Curations"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Handcrafted Curations filters */}
      <section className="curations-section">
        <h3 className="section-heading">Handcrafted Curations</h3>
        <div className="curations-list">
          <div className="curation-item" onClick={() => router.push('/menu?category=all')}>
            <div className="curation-circle">
              <CoffeeIcon size={30} style={{ color: 'var(--primary-dark)' }} />
            </div>
            <span className="curation-name">All Curations</span>
          </div>

          <div className="curation-item" onClick={() => router.push('/menu?category=coffee')}>
            <div className="curation-circle">
              <SparklesIcon size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <span className="curation-name">Cold Brews</span>
          </div>

          <div className="curation-item" onClick={() => router.push('/menu?category=specialty')}>
            <div className="curation-circle">
              <LeafIcon size={28} style={{ color: 'var(--primary-light)' }} />
            </div>
            <span className="curation-name">Matcha Series</span>
          </div>

          <div className="curation-item" onClick={() => router.push('/menu?category=pastry')}>
            <div className="curation-circle">
              <CakeIcon size={28} style={{ color: 'var(--gold)' }} />
            </div>
            <span className="curation-name">Bakery & Food</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h3 className="cta-title">Order Fresh Pickup</h3>
          <p className="cta-desc">
            Place your order in under a minute with just your name and mobile number, and grab it hot at the counter.
          </p>
          <button className="btn-primary" style={{ padding: '0.85rem 2rem' }} onClick={() => router.push('/menu')}>
            Explore Full Menu
          </button>
        </div>
      </section>

      {/* Coffee Brewing Article */}
      <section className="world-coffee-section">
        <div className="article-banner">
          <Image
            src="/hero_cafe.jpg"
            alt="Coffee filter drip art"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="article-overlay"></div>
          <div className="article-content">
            <span className="article-tag">Coffee Culture</span>
            <h3 className="article-title">Art & Science Of Coffee Brewing</h3>
            <p className="article-desc">
              Master the detour. Savoring the perfect brew at 30° Turn starts with selecting organic beans, roasting with micro-precision, and utilizing double-filtration techniques.
            </p>
            <button className="btn-secondary" style={{ backgroundColor: 'white', color: 'var(--primary-dark)', borderColor: 'white' }} onClick={() => router.push('/menu')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="sb-footer">
        <div className="sb-footer-grid">
          <div className="sb-footer-col">
            <h4 className="sb-footer-title">About Us</h4>
            <ul className="sb-footer-links">
              <li><a href="#" className="sb-footer-link">Our Heritage</a></li>
              <li><a href="#" className="sb-footer-link">Coffeehouse Details</a></li>
              <li><a href="#" className="sb-footer-link">Our Company</a></li>
            </ul>
          </div>
          <div className="sb-footer-col">
            <h4 className="sb-footer-title">Responsibility</h4>
            <ul className="sb-footer-links">
              <li><a href="#" className="sb-footer-link">Diversity & Inclusion</a></li>
              <li><a href="#" className="sb-footer-link">Ethical Sourcing</a></li>
              <li><a href="#" className="sb-footer-link">Environmental Stewardship</a></li>
            </ul>
          </div>
          <div className="sb-footer-col">
            <h4 className="sb-footer-title">Quick Links</h4>
            <ul className="sb-footer-links">
              <li><a href="#" className="sb-footer-link">Delivery FAQs</a></li>
              <li><a href="#" className="sb-footer-link">Customer Service</a></li>
              <li><a href="#" className="sb-footer-link">Beverage Subscription</a></li>
            </ul>
          </div>
          <div className="sb-footer-col">
            <h4 className="sb-footer-title">Social Media</h4>
            <div className="sb-footer-socials">
              <a href="#" className="social-icon-circle">𝕏</a>
              <a href="#" className="social-icon-circle">f</a>
              <a href="#" className="social-icon-circle">📷</a>
            </div>
            <div className="app-badges">
              <div className="badge-img" style={{ display: 'inline-block', width: '135px', height: '40px' }}>
                <span style={{ fontSize: '0.65rem', color: 'white', display: 'block', padding: '5px 10px', textAlign: 'center', border: '1px solid white', borderRadius: '4px' }}>GET IT ON Google Play</span>
              </div>
              <div className="badge-img" style={{ display: 'inline-block', width: '135px', height: '40px', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'white', display: 'block', padding: '5px 10px', textAlign: 'center', border: '1px solid white', borderRadius: '4px' }}>Download on App Store</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sb-footer-bottom">
          <div className="sb-footer-bottom-links">
            <a href="#" className="sb-footer-bottom-link">Web Accessibility</a>
            <span>|</span>
            <a href="#" className="sb-footer-bottom-link">Privacy Statement</a>
            <span>|</span>
            <a href="#" className="sb-footer-bottom-link">Terms of Use</a>
            <span>|</span>
            <a href="#" className="sb-footer-bottom-link">Contact Us</a>
          </div>
          <p>© {new Date().getFullYear()} 30° Turn Cafe Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
