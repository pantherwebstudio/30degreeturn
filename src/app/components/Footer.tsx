'use client';

import React from 'react';

export default function Footer() {
  return (
    <>
      <style jsx global>{`
        .sb-footer {
          background-color: var(--primary-dark);
          color: var(--text-white);
          padding: 3.5rem 6% 2rem 6%;
          font-size: 0.85rem;
        }

        .sb-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 2.5rem;
        }

        @media (max-width: 768px) {
          .sb-footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .sb-footer-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sb-footer-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 0.25rem;
        }

        .sb-footer-desc {
          color: var(--bg-creamy);
          opacity: 0.9;
          line-height: 1.5;
          max-width: 440px;
        }

        .insta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(242, 235, 223, 0.12);
          border: 1px solid rgba(242, 235, 223, 0.25);
          color: var(--text-white);
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          width: fit-content;
          text-decoration: none;
          margin-top: 0.5rem;
        }

        .insta-btn:hover {
          background: #E1306C;
          border-color: #E1306C;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(225, 48, 108, 0.35);
        }

        .sb-footer-bottom {
          border-top: 1px solid rgba(242, 235, 223, 0.15);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          color: var(--bg-creamy);
          opacity: 0.85;
          font-size: 0.8rem;
        }
      `}</style>

      <footer className="sb-footer">
        <div className="sb-footer-grid">
          <div className="sb-footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src="/logo-30degreeturn.jpeg"
                  alt="30° Turn Cafe Logo"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    backgroundColor: '#FAF3EC'
                  }}
                />
              </div>
              <h4 className="sb-footer-title" style={{ margin: 0 }}>30° Turn Cafe</h4>
            </div>
            <p className="sb-footer-desc">
              A destination for handcrafted, high-quality bakers creations that blend indulgence with accessibility. Every product is made with care, creativity, and a commitment to excellence—offering a fresh turn toward flavor, joy, and everyday celebration.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <a
                href="https://www.instagram.com/30degreeturn?igsi=OTZyMWV6MHo2YnAy"
                target="_blank"
                rel="noopener noreferrer"
                className="insta-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Follow @30degreeturn
              </a>
              <a href="/about" style={{ color: '#ebdcc9', fontWeight: 600, textDecoration: 'underline' }}>
                Read Our Full Story &rarr;
              </a>
            </div>
          </div>

          <div className="sb-footer-col">
            <h4 className="sb-footer-title">Find Our Location</h4>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.5245784273257!2d78.33374260315875!3d17.398368777309255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95001caf8f5f%3A0xf52881a301202bfe!2s30degreeturn!5e0!3m2!1sen!2sin!4v1788084382603!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>

        <div className="sb-footer-bottom">
          <p>&copy; {new Date().getFullYear()} 30&deg; Turn Cafe. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
