'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  CoffeeIcon,
  SparklesIcon,
  LeafIcon,
  CakeIcon,
} from '@/app/components/Icons';

const DESKTOP_VIDEO_URL = "./Untitled design.mp4";
const MOBILE_VIDEO_URL = "/clean_Rotating_glass_with_coffee_beans_202608301101.mp4";

export default function Home() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<{ name: string; mobile: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState(DESKTOP_VIDEO_URL);
  const [isPastHero, setIsPastHero] = useState(false);

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
        setIsPastHero(scrollY + 80 >= heroBottom);
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
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 16:9 video wrapper */
        .cinema-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
        }

        .cinema-video-wrap video {
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

        /* Handcrafted Curations */
        .curations-section {
          padding: 3rem 6%;
          background-color: var(--bg-white);
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
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          box-shadow: var(--shadow-sm);
        }

        .curation-item:hover .curation-circle {
          border-color: var(--primary);
          transform: scale(1.1) translateY(-4px);
          box-shadow: 0 8px 20px rgba(152, 78, 49, 0.2);
        }

        .curation-item {
          transition: transform 0.3s ease;
        }

        .curation-item:hover {
          transform: translateY(-2px);
        }

        .curation-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-dark);
          transition: color 0.2s ease;
        }

        .curation-item:hover .curation-name {
          color: var(--primary);
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

      `}</style>

      <Header
        activePage="home"
        customer={customer}
        cartCount={cartCount}
        heroOverlay={!isPastHero}
        onLogout={handleCustomerLogout}
      />

      {/* Cinema 16:9 Video Hero */}
      <section id="cinema-hero" className="cinema-hero">
        <div className="cinema-video-wrap">
          <video
            key={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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

      <Footer />
    </div>
  );
}
