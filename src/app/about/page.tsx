'use client';

import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { 
  TargetIcon, 
  RocketIcon, 
  EyeStarIcon, 
  AwardIcon, 
  HandshakeIcon, 
  SparklesIcon, 
  SmileHeartIcon, 
  LeafPlantIcon, 
  FlameIcon,
  CheckIcon
} from '@/app/components/Icons';

export default function AboutPage() {
  return (
    <div className="about-wrapper">
      <style jsx global>{`
        .about-wrapper {
          min-height: 100vh;
          background: #FAF6F0;
          color: #21100a;
          font-family: var(--font-sans);
        }

        /* Hero Section */
        .about-hero {
          background: linear-gradient(135deg, #21100a 0%, #3a1b11 100%);
          color: #ffffff;
          padding: 5rem 1.5rem 4.5rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(203, 171, 128, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
        }

        .about-logo-card {
          display: inline-block;
          background: #FAF3EC;
          border-radius: 50%;
          padding: 1.25rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          margin-bottom: 1.5rem;
        }

        .about-logo-img {
          width: 110px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .about-badge {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #CBAB80;
          background: rgba(203, 171, 128, 0.15);
          padding: 0.35rem 1rem;
          border-radius: 999px;
          margin-bottom: 1rem;
          border: 1px solid rgba(203, 171, 128, 0.3);
        }

        .about-hero-title {
          font-family: var(--font-serif);
          font-size: 3rem;
          font-weight: 700;
          color: #FAF3EC;
          margin-bottom: 0.85rem;
        }

        .about-hero-subtitle {
          max-width: 720px;
          margin: 0 auto;
          font-size: 1.15rem;
          color: #e0d0c1;
          line-height: 1.6;
        }

        /* Brand Statement Box */
        .brand-statement-section {
          max-width: 1000px;
          margin: -2.5rem auto 3.5rem auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 10;
        }

        .brand-statement-box {
          background: #FAF3EC;
          border-radius: 28px;
          padding: 2.5rem 3rem;
          box-shadow: 0 15px 40px rgba(33, 16, 10, 0.08);
          border: 1.5px solid rgba(152, 78, 49, 0.2);
          text-align: center;
        }

        .brand-statement-text {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          line-height: 1.6;
          color: #21100a;
          font-style: italic;
        }

        /* Story Grid */
        .story-section {
          max-width: 960px;
          margin: 0 auto 4.5rem auto;
          padding: 0 1.5rem;
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
          font-size: 1.08rem;
          line-height: 1.85;
          color: #4A2E1C;
          margin-bottom: 1.6rem;
        }

        .story-highlight-box {
          background: linear-gradient(135deg, #FAF3EC 0%, #EFE4D6 100%);
          border-left: 5px solid #984e31;
          padding: 1.75rem 2rem;
          border-radius: 18px;
          margin: 2.25rem 0;
        }

        .story-highlight-box p {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.5rem;
        }

        .story-highlight-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .story-highlight-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          color: #984e31;
          font-size: 0.95rem;
        }

        /* PMV Section */
        .pmv-section {
          background: #FAF3EC;
          padding: 4.5rem 1.5rem;
          border-top: 1px solid rgba(152, 78, 49, 0.15);
          border-bottom: 1px solid rgba(152, 78, 49, 0.15);
        }

        .pmv-grid {
          max-width: 1150px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .pmv-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          border: 1px solid rgba(152, 78, 49, 0.15);
          box-shadow: 0 10px 30px rgba(33, 16, 10, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }

        .pmv-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(33, 16, 10, 0.08);
          border-color: rgba(152, 78, 49, 0.3);
        }

        .pmv-icon {
          width: 72px;
          height: 72px;
          background: #FAF3EC;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem auto;
          box-shadow: 0 4px 15px rgba(33, 16, 10, 0.05);
        }

        .pmv-title {
          font-family: var(--font-serif);
          font-size: 1.65rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.85rem;
        }

        .pmv-desc {
          font-size: 0.98rem;
          line-height: 1.7;
          color: #6E5444;
        }

        /* Values Section */
        .values-section {
          max-width: 1150px;
          margin: 4.5rem auto;
          padding: 0 1.5rem;
        }

        .values-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .values-title {
          font-family: var(--font-serif);
          font-size: 2.3rem;
          font-weight: 700;
          color: #21100a;
        }

        .values-subtitle {
          color: #6E5444;
          font-size: 1.05rem;
          margin-top: 0.4rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.75rem;
        }

        .value-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid rgba(152, 78, 49, 0.12);
          box-shadow: 0 6px 20px rgba(33, 16, 10, 0.03);
          transition: transform 0.25s ease;
        }

        .value-card:hover {
          transform: translateY(-3px);
          border-color: #984e31;
        }

        .value-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .value-card-desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #6E5444;
        }

        @media (max-width: 768px) {
          .about-hero {
            padding: 3.5rem 1rem 3.5rem 1rem;
          }
          .about-hero-title {
            font-size: 2.2rem;
          }
          .brand-statement-box {
            padding: 1.75rem 1.25rem;
          }
          .brand-statement-text {
            font-size: 1.1rem;
          }
          .story-heading {
            font-size: 1.75rem;
          }
        }
      `}</style>

      {/* Header */}
      <Header activePage="about" />

      {/* Hero */}
      <section className="about-hero">
        <div className="about-logo-card">
          <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" className="about-logo-img" />
        </div>
        <span className="about-badge">Our Journey & Philosophy</span>
        <h1 className="about-hero-title">The 30degree Turn: Our Story</h1>
        <p className="about-hero-subtitle">
          At The 30degree Turn, we believe life is full of quiet shifts, moments when everything changes, often in the most meaningful ways.
        </p>
      </section>

      {/* Brand Statement Banner */}
      <section className="brand-statement-section">
        <div className="brand-statement-box">
          <p className="brand-statement-text">
            “The 30degree Turn is a destination for handcrafted, high-quality bakers creations that blend indulgence with accessibility. Every product is made with care, creativity, and a commitment to excellence, offering a fresh turn toward flavor, joy, and everyday celebration.”
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
          The number <strong>30</strong> holds deep significance in many cultures and spiritual traditions. It symbolizes maturity, awakening, and purpose, a time when clarity replaces confusion, and passion finds its true direction. It’s not just an age; it’s a mindset. A turning point where you stop chasing what’s expected and start choosing what truly matters.
        </p>

        <p className="story-paragraph">
          Society often tells us that by 25, we should have it all figured out, that after that, it’s too late to start something new. We respectfully disagree. <strong>The 30degree Turn is our answer to that narrative.</strong> At 30, we chose to begin again, to follow our passion, build something from scratch, and prove that it’s never too late to create something extraordinary.
        </p>

        <p className="story-paragraph">
          We started this cafe and bakery with a simple but powerful idea: to craft baked goods and artisanal drinks that reflect this sense of evolution. Every item is made by us, by hand, using only the finest ingredients, because we believe food made with intention tastes, and feels, different.
        </p>

        <div className="story-highlight-box">
          <p>We don’t just bake. We create moments of transformation.</p>
          <span style={{ fontSize: '0.95rem', color: '#6E5444' }}>
            A shift in your day. A pause to savor. A sweet reminder that you’re allowed to treat yourself to something better, and that it’s never too late to turn toward your dreams.
          </span>
          <ul className="story-highlight-list">
            <li><CheckIcon size={16} /> A fresh turn toward pure artisanal flavor</li>
            <li><CheckIcon size={16} /> A deeper taste crafted with integrity</li>
            <li><CheckIcon size={16} /> A more meaningful indulgence for everyday life</li>
          </ul>
        </div>

        <p className="story-paragraph">
          Our bakery is a space where indulgence meets integrity. Where premium doesn’t mean exclusive. And where every product, from the familiar to the unexpected, is designed to surprise, satisfy, and spark joy.
        </p>

        <p className="story-paragraph" style={{ fontWeight: 600, color: '#21100a', fontSize: '1.15rem' }}>
          Because at The 30degree Turn, we’re not just about what’s on the plate: we’re about what it means.
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
              To delight every customer with premium-quality baked creations that are both indulgent and accessible, turning everyday moments into extraordinary experiences.
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
              To become the most loved premium bakery brand known for redefining indulgence where quality meets affordability, and every visit feels like a sweet escape.
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
              Premium taste should be within reach without cutting corners.
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
              Our love for baking fuels everything we do, from the oven to the customer.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
