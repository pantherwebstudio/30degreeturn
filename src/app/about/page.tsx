'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  SparklesIcon,
  LeafIcon,
  HeartCupIcon,
  CoffeeIcon,
  CheckIcon,
  TargetIcon,
  RocketIcon,
  EyeStarIcon,
  AwardIcon,
  HandshakeIcon,
  SmileHeartIcon,
  LeafPlantIcon,
  FlameIcon
} from '@/app/components/Icons';

export default function AboutPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<{ name: string; mobile: string } | null>(null);

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
  }, []);

  const handleCustomerLogout = () => {
    setCustomer(null);
    localStorage.removeItem('30_turn_user');
    router.refresh();
  };

  return (
    <div className="about-layout">
      <style jsx global>{`
        .about-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #FAF3EC;
          color: #21100a;
        }

        /* Hero Banner */
        .about-hero {
          padding: 8rem 6% 4rem 6%;
          background: linear-gradient(185deg, #FAF3EC 0%, #EFE4D6 100%);
          text-align: center;
          position: relative;
          border-bottom: 1px solid rgba(152, 78, 49, 0.15);
        }

        .about-logo-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .about-logo-img {
          width: 160px;
          height: auto;
          border-radius: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .about-logo-img:hover {
          transform: scale(1.05);
        }

        .about-badge {
          display: inline-block;
          padding: 0.35rem 1.25rem;
          border-radius: 999px;
          background: rgba(152, 78, 49, 0.12);
          color: #984e31;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .about-hero-title {
          font-family: var(--font-serif);
          font-size: 3rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .about-hero-subtitle {
          font-size: 1.2rem;
          color: #6E5444;
          max-width: 680px;
          margin: 0 auto;
          font-weight: 500;
        }

        /* Brand Statement Quote Box */
        .brand-statement-section {
          padding: 3rem 6%;
          background: #21100a;
          color: #FAF3EC;
          text-align: center;
        }

        .brand-statement-box {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          padding: 1.5rem;
        }

        .brand-statement-text {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          line-height: 1.7;
          font-style: italic;
          color: #ebdcc9;
          font-weight: 400;
        }

        /* Story Section */
        .story-section {
          padding: 5rem 6%;
          max-width: 960px;
          margin: 0 auto;
        }

        .story-heading {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .story-paragraph {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #4A2E1C;
          margin-bottom: 1.75rem;
          font-weight: 400;
        }

        .story-highlight-box {
          background: #FAF3EC;
          border-left: 4px solid #984e31;
          padding: 1.5rem 2rem;
          border-radius: 0 16px 16px 0;
          margin: 2.5rem 0;
          box-shadow: 0 4px 20px rgba(33, 16, 10, 0.05);
        }

        .story-highlight-box p {
          font-size: 1.1rem;
          font-weight: 600;
          color: #21100a;
          margin: 0 0 0.5rem 0;
        }

        .story-highlight-list {
          list-style: none;
          padding: 0;
          margin: 0.75rem 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .story-highlight-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          color: #984e31;
        }

        /* PMV Cards Grid (Purpose, Mission, Vision) */
        .pmv-section {
          padding: 4rem 6%;
          background: #EFE4D6;
          border-top: 1px solid rgba(152, 78, 49, 0.15);
          border-bottom: 1px solid rgba(152, 78, 49, 0.15);
        }

        .pmv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pmv-card {
          background: #FAF3EC;
          border: 1px solid rgba(152, 78, 49, 0.18);
          border-radius: 24px;
          padding: 2.25rem 1.75rem;
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 6px 20px rgba(33, 16, 10, 0.04);
          display: flex;
          flex-direction: column;
        }

        .pmv-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 36px rgba(33, 16, 10, 0.12);
          border-color: #984e31;
        }

        .pmv-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .pmv-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.75rem;
        }

        .pmv-desc {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #6E5444;
          flex: 1;
        }

        /* Core Values Section */
        .values-section {
          padding: 5rem 6%;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .values-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .values-title {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.5rem;
        }

        .values-subtitle {
          font-size: 1rem;
          color: #6E5444;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .value-card {
          background: #ffffff;
          border: 1px solid rgba(152, 78, 49, 0.15);
          border-radius: 20px;
          padding: 1.75rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(33, 16, 10, 0.03);
        }

        .value-card:hover {
          transform: translateY(-5px);
          border-color: #984e31;
          box-shadow: 0 10px 25px rgba(152, 78, 49, 0.12);
        }

        .value-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .value-card-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #6E5444;
        }

        @media (max-width: 992px) {
          .pmv-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .about-hero-title {
            font-size: 2.1rem;
          }
          .about-hero-subtitle {
            font-size: 1rem;
          }
          .values-grid {
            grid-template-columns: 1fr;
          }
          .brand-statement-text {
            font-size: 1.1rem;
          }
        }
      `}</style>

      {/* Main Navigation Header */}
      <Header
        activePage="about"
        customer={customer}
        cartCount={cartCount}
        onLogout={handleCustomerLogout}
      />

      {/* Hero Header Section */}
      <section className="about-hero">
        <div className="about-logo-wrapper">
          <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" className="about-logo-img" />
        </div>
        <span className="about-badge">Our Journey & Philosophy</span>
        <h1 className="about-hero-title">The 30degree Turn – Our Story</h1>
        <p className="about-hero-subtitle">
          At The 30degree Turn, we believe life is full of quiet shifts—moments when everything changes, often in the most meaningful ways.
        </p>
      </section>

      {/* Brand Statement Banner */}
      <section className="brand-statement-section">
        <div className="brand-statement-box">
          <p className="brand-statement-text">
            “The 30degree Turn is a destination for handcrafted, high-quality bakers creations that blend indulgence with accessibility. Every product is made with care, creativity, and a commitment to excellence—offering a fresh turn toward flavor, joy, and everyday celebration.”
          </p>
        </div>
      </section>

      {/* Detailed Story Narrative */}
      <section className="story-section">
        <h2 className="story-heading">
          <SparklesIcon size={28} />
          A Celebration of Transformation & Purpose
        </h2>

        <p className="story-paragraph">
          The number <strong>30</strong> holds deep significance in many cultures and spiritual traditions. It symbolizes maturity, awakening, and purpose—a time when clarity replaces confusion, and passion finds its true direction. It’s not just an age; it’s a mindset. A turning point where you stop chasing what’s expected and start choosing what truly matters.
        </p>

        <p className="story-paragraph">
          Society often tells us that by 25, we should have it all figured out—that after that, it’s too late to start something new. We respectfully disagree. <strong>The 30degree Turn is our answer to that narrative.</strong> At 30, we chose to begin again—to follow our passion, build something from scratch, and prove that it’s never too late to create something extraordinary.
        </p>

        <p className="story-paragraph">
          We started this cafe and bakery with a simple but powerful idea: to craft baked goods and artisanal drinks that reflect this sense of evolution. Every item is made by us, by hand, using only the finest ingredients—because we believe food made with intention tastes, and feels, different.
        </p>

        <div className="story-highlight-box">
          <p>We don’t just bake. We create moments of transformation.</p>
          <span style={{ fontSize: '0.95rem', color: '#6E5444' }}>
            A shift in your day. A pause to savor. A sweet reminder that you’re allowed to treat yourself to something better—and that it’s never too late to turn toward your dreams.
          </span>
          <ul className="story-highlight-list">
            <li><CheckIcon size={16} /> A fresh turn toward pure artisanal flavor</li>
            <li><CheckIcon size={16} /> A deeper taste crafted with integrity</li>
            <li><CheckIcon size={16} /> A more meaningful indulgence for everyday life</li>
          </ul>
        </div>

        <p className="story-paragraph">
          Our bakery is a space where indulgence meets integrity. Where premium doesn’t mean exclusive. And where every product—from the familiar to the unexpected—is designed to surprise, satisfy, and spark joy.
        </p>

        <p className="story-paragraph" style={{ fontWeight: 600, color: '#21100a', fontSize: '1.15rem' }}>
          Because at The 30degree Turn, we’re not just about what’s on the plate — we’re about what it means.
        </p>
      </section>

      {/* Purpose, Mission & Vision */}
      <section className="pmv-section">
        <div className="pmv-grid">
          <div className="pmv-card">
            <div className="pmv-icon" style={{ color: '#984e31' }}>
              <TargetIcon size={38} />
            </div>
            <h3 className="pmv-title">Purpose</h3>
            <p className="pmv-desc">
              To delight every customer with premium-quality baked creations that are both indulgent and accessible—turning everyday moments into extraordinary experiences.
            </p>
          </div>

          <div className="pmv-card">
            <div className="pmv-icon" style={{ color: '#984e31' }}>
              <RocketIcon size={38} />
            </div>
            <h3 className="pmv-title">Mission</h3>
            <p className="pmv-desc">
              To craft exceptional cakes, pastries, and baked goods using the finest ingredients and artisanal techniques, while maintaining affordability and uncompromising quality. We aim to bring joy, warmth, and a “30-degree turn” of surprise to every bite.
            </p>
          </div>

          <div className="pmv-card">
            <div className="pmv-icon" style={{ color: '#984e31' }}>
              <EyeStarIcon size={38} />
            </div>
            <h3 className="pmv-title">Vision</h3>
            <p className="pmv-desc">
              To become the most loved premium bakery brand known for redefining indulgence—where quality meets affordability, and every visit feels like a sweet escape.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <div className="values-header">
          <h2 className="values-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
            <AwardIcon size={32} style={{ color: '#984e31' }} />
            Core Values
          </h2>
          <p className="values-subtitle">The principles that guide everything we bake and pour</p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <h4 className="value-card-title">
              <AwardIcon size={20} style={{ color: '#984e31' }} />
              Quality First
            </h4>
            <p className="value-card-desc">
              We never compromise on ingredients, craftsmanship, or freshness.
            </p>
          </div>

          <div className="value-card">
            <h4 className="value-card-title">
              <HandshakeIcon size={20} style={{ color: '#984e31' }} />
              Affordability with Integrity
            </h4>
            <p className="value-card-desc">
              Premium taste should be within reach—without cutting corners.
            </p>
          </div>

          <div className="value-card">
            <h4 className="value-card-title">
              <SparklesIcon size={20} style={{ color: '#984e31' }} />
              Creativity & Innovation
            </h4>
            <p className="value-card-desc">
              We constantly explore new flavors, designs, and experiences.
            </p>
          </div>

          <div className="value-card">
            <h4 className="value-card-title">
              <SmileHeartIcon size={20} style={{ color: '#984e31' }} />
              Customer Delight
            </h4>
            <p className="value-card-desc">
              Every interaction is an opportunity to surprise and satisfy.
            </p>
          </div>

          <div className="value-card">
            <h4 className="value-card-title">
              <LeafPlantIcon size={20} style={{ color: '#984e31' }} />
              Sustainability & Responsibility
            </h4>
            <p className="value-card-desc">
              We care for our community and the planet through mindful sourcing and practices.
            </p>
          </div>

          <div className="value-card">
            <h4 className="value-card-title">
              <FlameIcon size={20} style={{ color: '#984e31' }} />
              Passion-Driven
            </h4>
            <p className="value-card-desc">
              Our love for baking fuels everything we do—from the oven to the customer.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
