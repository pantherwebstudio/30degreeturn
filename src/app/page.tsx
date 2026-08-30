'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import LocationModal from '@/app/components/LocationModal';
import {
  CoffeeIcon,
  SparklesIcon,
  LeafIcon,
  CakeIcon,
  SnowflakeIcon,
  HeartCupIcon,
  PaletteIcon
} from '@/app/components/Icons';

const DESKTOP_VIDEO_URL = "/cup-desktop.gif";
const MOBILE_VIDEO_URL = "/cup-mobile.gif";

export default function Home() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<{ name: string; mobile: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState(DESKTOP_VIDEO_URL);
  const [heroBgColor, setHeroBgColor] = useState('#cbab80');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  // Location Serviceability & Order Type state (2km radius limit)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in'>('dine-in');
  const [isServiceable, setIsServiceable] = useState<boolean>(false);
  const [userDistanceKm, setUserDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    const hasChecked = sessionStorage.getItem('30_loc_prompted');
    if (!hasChecked) {
      setIsLocationModalOpen(true);
      sessionStorage.setItem('30_loc_prompted', 'true');
    }
  }, []);

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

    // Track scroll for header background and hero position
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.getElementById('cinema-hero');
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        setIsPastHero(scrollY >= heroBottom - 80);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
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
          background-color: var(--bg-cream);
        }

        /* Cinematic Full-Video Hero Section */
        .cinema-hero {
          position: relative;
          width: 100%;
          background-color: #0f1914;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.4s ease;
        }

        /* 16:9 video wrapper */
        .cinema-video-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          aspect-ratio: 16 / 9;
        }

        /* Background Text behind GIF in Tanker webfont */
        .hero-bg-text {
          position: absolute;
          top: 140px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          pointer-events: none;
          user-select: none;
          line-height: 0.88;
        }

        .hero-word {
          font-family: 'Tanker-Regular', 'Inter', sans-serif;
          font-size: 88px;
          font-weight: 400;
          letter-spacing: 5px;
          color: var(--primary-dark);
          text-transform: uppercase;
          line-height: 0.88;
          display: block;
          text-align: center;
          opacity: 0.92;
        }

        @media (max-width: 768px) {
          .hero-bg-text {
            top: 140px;
          }

          .hero-word {
            font-size: clamp(50px, 15vw, 100px);
            letter-spacing: 3px;
          }
        }

        /* Collapsible Color Picker Widget over Hero */
        .hero-color-picker {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .color-picker-toggle-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(18, 9, 5, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #f2ebdf;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
          transition: all 0.35s cubic-bezier(0.25, 1, 0.35, 1);
        }

        .color-picker-toggle-btn:hover {
          transform: scale(1.1) rotate(12deg);
          background: rgba(152, 78, 49, 0.95);
          border-color: #ffffff;
          box-shadow: 0 6px 22px rgba(152, 78, 49, 0.45);
        }

        .color-presets-panel {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(18, 9, 5, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          animation: fadeInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .color-picker-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .color-presets {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .color-swatch {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
          padding: 0;
        }

        .color-swatch:hover,
        .color-swatch.active {
          transform: scale(1.25);
          border-color: #FFFFFF;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        }

        .color-custom-btn {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .color-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .hero-glass-order-btn {
          position: absolute;
          top: 75%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          background: rgba(250, 243, 236, 0.22);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: none;
          color: #FAF3EC;
          padding: 1.15rem 3.25rem;
          border-radius: 999px;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 0.8px;
          cursor: pointer;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          white-space: nowrap;
        }

        .hero-glass-order-btn:hover {
          background: rgba(255, 255, 255, 0.38);
          color: #ffffff;
          transform: translate(-50%, -50%) scale(1.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        }

        @media (max-width: 768px) {
          .hero-glass-order-btn {
            padding: 0.85rem 2.25rem;
            font-size: 1rem;
          }

          .hero-color-picker {
            bottom: 1rem;
            right: 1rem;
          }

          .color-picker-toggle-btn {
            width: 40px;
            height: 40px;
          }

          .color-swatch {
            width: 24px;
            height: 24px;
          }
        }

        .cinema-video-wrap video,
        .cinema-video-wrap img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          pointer-events: none;
          display: block;
        }

        @media (max-width: 768px) {
          .cinema-video-wrap {
            aspect-ratio: 9 / 16;
            max-height: 100vh;
          }

          .cinema-video-wrap video {
            object-fit: cover;
          }
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
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .season-image-box:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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

        /* Handcrafted Curations Section matching reference design */
        .curations-section {
          padding: 3.5rem 6%;
          background-color: var(--bg-cream);
          text-align: center;
        }

        .curations-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .curations-title {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 700;
          color: #4A2E1C;
          margin-bottom: 0.5rem;
        }

        .curations-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #984e31;
          margin-bottom: 0.5rem;
        }

        .curations-divider-line {
          width: 40px;
          height: 1px;
          background-color: rgba(152, 78, 49, 0.4);
        }

        .curations-subtitle {
          font-size: 0.95rem;
          color: #6E5444;
          font-weight: 500;
        }

        .curations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .curation-card {
          background: #FAF3EC;
          border: 1px solid rgba(152, 78, 49, 0.16);
          border-radius: 20px;
          padding: 1.75rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 15px rgba(110, 52, 31, 0.04);
        }

        .curation-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(110, 52, 31, 0.12);
          border-color: rgba(152, 78, 49, 0.35);
        }

        .curation-card-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #EFE4D6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: #6e341f;
          transition: transform 0.3s ease;
        }

        .curation-card:hover .curation-card-icon {
          transform: scale(1.1);
        }

        .curation-card-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: #4A2E1C;
          margin-bottom: 0.5rem;
        }

        .curation-card-desc {
          font-size: 0.85rem;
          color: #7A6253;
          line-height: 1.4;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .curation-card-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: #984e31;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: color 0.2s ease;
        }

        .curation-card:hover .curation-card-link {
          color: #6e341f;
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
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .article-banner:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .article-banner:hover .article-overlay {
          background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.05) 100%);
        }

        .article-banner img {
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .article-banner:hover img {
          transform: scale(1.05);
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

        @media (max-width: 768px) {
          .curations-section {
            padding: 2.25rem 2%;
          }

          .curations-title {
            font-size: 1.6rem;
          }

          .curations-subtitle {
            font-size: 0.82rem;
          }

          .curations-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.35rem !important;
          }

          .curation-card {
            padding: 0.85rem 0.3rem !important;
            border-radius: 14px !important;
          }

          .curation-card-icon {
            width: 42px !important;
            height: 44px !important;
            margin-bottom: 0.4rem !important;
          }

          .curation-card-icon svg {
            width: 22px !important;
            height: 22px !important;
          }

          .curation-card-title {
            font-size: 0.72rem !important;
            line-height: 1.15 !important;
            margin-bottom: 0.25rem !important;
          }

          .curation-card-desc {
            font-size: 0.62rem !important;
            line-height: 1.25 !important;
            margin-bottom: 0.4rem !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .curation-card-link {
            font-size: 0.65rem !important;
          }

          .cta-section {
            padding: 2.5rem 1.25rem;
          }

          .cta-title {
            font-size: 1.65rem;
          }

          .cta-desc {
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }

          .our-story-section {
            padding: 3rem 1.25rem !important;
          }

          .our-story-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }

          .article-banner {
            aspect-ratio: auto;
            min-height: 380px;
            padding: 2.5rem 1.5rem;
            display: flex;
            align-items: center;
          }

          .article-overlay {
            background: rgba(0, 0, 0, 0.72) !important;
          }

          .article-content {
            max-width: 100%;
          }

          .article-title {
            font-size: 1.5rem;
            line-height: 1.25;
            margin-bottom: 0.5rem;
          }

          .article-desc {
            font-size: 0.88rem;
            line-height: 1.45;
            margin-bottom: 1.25rem;
          }
        }

      `}</style>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectOrderType={(type, serviceable, distKm) => {
          setOrderType(type);
          setIsServiceable(serviceable);
          setUserDistanceKm(distKm);
        }}
      />

      <Header
        activePage="home"
        customer={customer}
        cartCount={cartCount}
        heroOverlay={!isPastHero}
        onLogout={handleCustomerLogout}
        onLocationClick={() => setIsLocationModalOpen(true)}
        locationState={{ orderType, isServiceable, distanceKm: userDistanceKm }}
      />

      {/* Cinema 16:9 Video Hero */}
      <section id="cinema-hero" className="cinema-hero" style={{ backgroundColor: heroBgColor }}>
        {/* Background Typography behind GIF in Tanker-Regular webfont */}
        <div className="hero-bg-text">
          <span className="hero-word">BREWED</span>
          <span className="hero-word">DIFFERENT</span>
        </div>

        <div className="cinema-video-wrap">
          {videoUrl.endsWith('.gif') ? (
            <img
              key={videoUrl}
              src={videoUrl}
              alt="Hero coffee animation"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          ) : (
            <video
              key={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              onContextMenu={(e) => e.preventDefault()}
            >
              {videoUrl.endsWith('.webm') ? (
                <>
                  <source src={videoUrl} type='video/webm; codecs="vp9, opus"' />
                  <source src={videoUrl} type="video/webm" />
                </>
              ) : (
                <source src={videoUrl} type="video/mp4" />
              )}
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Floating Transparent Glass Order Now Button */}
        <button
          className="hero-glass-order-btn"
          onClick={() => router.push('/menu')}
        >
          <CoffeeIcon size={18} /> Order Now →
        </button>

        {/* Collapsible Color Picker Widget in bottom right corner */}
        <div className="hero-color-picker">
          <button
            className="color-picker-toggle-btn"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            title="Customize Hero Theme Background"
            aria-label="Toggle Color Palette"
          >
            <PaletteIcon size={20} />
          </button>

          {isColorPickerOpen && (
            <div className="color-presets-panel">
              <span className="color-picker-label">Bg:</span>
              <div className="color-presets">
                {['#cbab80', '#f2ebdf', '#ebdcc9', '#faf3ec', '#984e31', '#6e341f', '#4a2e1c'].map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${heroBgColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setHeroBgColor(color)}
                    title={`Switch background to ${color}`}
                  />
                ))}
                <label className="color-custom-btn" title="Pick custom color">
                  <input
                    type="color"
                    value={heroBgColor}
                    onChange={(e) => setHeroBgColor(e.target.value)}
                    className="color-input"
                  />
                  <span className="color-custom-icon">🎨</span>
                </label>
              </div>
            </div>
          )}
        </div>
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

      {/* Handcrafted Curations */}
      <section className="curations-section">
        <div className="curations-header">
          <h3 className="curations-title">Handcrafted Curations</h3>
          <div className="curations-divider">
            <span className="curations-divider-line"></span>
            <LeafIcon size={16} />
            <span className="curations-divider-line"></span>
          </div>
          <p className="curations-subtitle">Carefully crafted. Perfectly poured.</p>
        </div>

        <div className="curations-grid">
          <div className="curation-card" onClick={() => router.push('/menu?category=all')}>
            <div className="curation-card-icon">
              <HeartCupIcon size={28} />
            </div>
            <h4 className="curation-card-title">All Curations</h4>
            <p className="curation-card-desc">Explore our complete collection</p>
            <span className="curation-card-link">Explore &rarr;</span>
          </div>

          <div className="curation-card" onClick={() => router.push('/menu?category=coffee')}>
            <div className="curation-card-icon">
              <SnowflakeIcon size={26} />
            </div>
            <h4 className="curation-card-title">Cold Brews</h4>
            <p className="curation-card-desc">Chilled to perfection, crafted to refresh</p>
            <span className="curation-card-link">Discover &rarr;</span>
          </div>

          <div className="curation-card" onClick={() => router.push('/menu?category=specialty')}>
            <div className="curation-card-icon">
              <LeafIcon size={26} />
            </div>
            <h4 className="curation-card-title">Matcha Series</h4>
            <p className="curation-card-desc">Pure, vibrant, and naturally energizing</p>
            <span className="curation-card-link">Explore &rarr;</span>
          </div>

          <div className="curation-card" onClick={() => router.push('/menu?category=pastry')}>
            <div className="curation-card-icon">
              <CoffeeIcon size={26} />
            </div>
            <h4 className="curation-card-title">Signature Lattes</h4>
            <p className="curation-card-desc">Classic comfort, perfectly balanced</p>
            <span className="curation-card-link">Explore &rarr;</span>
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

      {/* Our Story Feature Section */}
      <section className="our-story-section" style={{ padding: '4.5rem 6%', backgroundColor: '#FAF3EC', borderTop: '1px solid rgba(152, 78, 49, 0.15)' }}>
        <div className="our-story-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: '#984e31', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Our Story & Philosophy
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: '#21100a', margin: '0 0 1rem 0', lineHeight: 1.25 }}>
              The 30degree Turn
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.75', color: '#4A2E1C', marginBottom: '1.25rem' }}>
              At The 30degree Turn, we believe life is full of quiet shifts, moments when everything changes, often in the most meaningful ways. That’s the spirit behind our name and everything we bake: a celebration of transformation, intention, and joy.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#6E5444', marginBottom: '1.75rem' }}>
              Every product is made with care, creativity, and a commitment to excellence, offering a fresh turn toward flavor, joy, and everyday celebration.
            </p>
            <button className="btn-primary" style={{ padding: '0.8rem 1.8rem' }} onClick={() => router.push('/about')}>
              Read Our Full Story &rarr;
            </button>
          </div>
          <div style={{ textAlign: 'center', background: '#EFE4D6', borderRadius: '28px', padding: '3rem 2rem', border: '1px solid rgba(152, 78, 49, 0.2)', boxShadow: '0 12px 30px rgba(33, 16, 10, 0.06)' }}>
            <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" style={{ width: '150px', height: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', marginBottom: '1.5rem' }} />
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#21100a', margin: '0 0 0.5rem 0' }}>Where Indulgence Meets Integrity</h4>
            <p style={{ fontSize: '0.9rem', color: '#6E5444', margin: 0, fontStyle: 'italic' }}>
              “Turning everyday moments into extraordinary experiences.”
            </p>
          </div>
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

      <Footer />
    </div>
  );
}
