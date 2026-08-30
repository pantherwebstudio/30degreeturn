'use client';

import React from 'react';

export default function Footer() {
  return (
    <>
      <style jsx global>{`
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
          transition: all 0.25s ease;
          position: relative;
          padding-left: 0;
        }

        .sb-footer-link:hover {
          color: white;
          padding-left: 6px;
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
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .social-icon-circle:hover {
          background-color: white;
          border-color: white;
          color: var(--primary-dark);
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
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
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>

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
              <a href="#" className="social-icon-circle">X</a>
              <a href="#" className="social-icon-circle">f</a>
              <a href="#" className="social-icon-circle">in</a>
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
          <p>&copy; {new Date().getFullYear()} 30&deg; Turn Cafe Company. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
