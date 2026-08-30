'use client';

import React, { useState, useEffect } from 'react';
import { TargetIcon, CheckIcon, CloseIcon } from '@/app/components/Icons';

export const CAFE_LAT = 17.3983688;
export const CAFE_LNG = 78.3337426;
export const MAX_DELIVERY_RADIUS_KM = 2.0;

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrderType: (type: 'delivery' | 'dine-in', isServiceable: boolean, distanceKm: number | null) => void;
}

export default function LocationModal({ isOpen, onClose, onSelectOrderType }: LocationModalProps) {
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isServiceable, setIsServiceable] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'delivery' | 'dine-in'>('dine-in');

  useEffect(() => {
    if (isOpen && !locationChecked) {
      checkUserLocation();
    }
  }, [isOpen]);

  const checkUserLocation = () => {
    setCheckingLocation(true);
    setErrorMessage('');

    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      setCheckingLocation(false);
      setLocationChecked(true);
      setIsServiceable(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        const dist = calculateDistanceKm(uLat, uLng, CAFE_LAT, CAFE_LNG);
        
        setUserCoords({ lat: uLat, lng: uLng });
        setDistanceKm(dist);
        const serviceable = dist <= MAX_DELIVERY_RADIUS_KM;
        setIsServiceable(serviceable);
        setCheckingLocation(false);
        setLocationChecked(true);

        if (serviceable) {
          setSelectedType('delivery');
        } else {
          setSelectedType('dine-in');
        }
      },
      (error) => {
        console.warn('Geolocation permission denied or error:', error);
        setErrorMessage('Location access denied. Distance check unavailable.');
        setCheckingLocation(false);
        setLocationChecked(true);
        setIsServiceable(false);
        setSelectedType('dine-in');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedType === 'delivery' && (!isServiceable || distanceKm === null || distanceKm > MAX_DELIVERY_RADIUS_KM)) {
      setErrorMessage(
        `📍 Location Not Serviceable for Delivery! We currently only deliver within 2 km of 30° Turn Cafe${distanceKm ? ` (You are ${distanceKm.toFixed(1)} km away)` : ''}. Please select Dine-In / Takeaway.`
      );
      return;
    }
    onSelectOrderType(selectedType, isServiceable, distanceKm);
    onClose();
  };

  return (
    <>
      <style jsx global>{`
        .loc-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(33, 16, 10, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          animation: fadeIn 0.3s ease;
        }

        .loc-modal-card {
          background: #FAF3EC;
          border: 1px solid rgba(152, 78, 49, 0.2);
          border-radius: 28px;
          max-width: 480px;
          width: 100%;
          padding: 2.25rem 2rem;
          box-shadow: 0 20px 50px rgba(33, 16, 10, 0.3);
          position: relative;
          color: #21100a;
        }

        .loc-modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .loc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .loc-badge.serviceable {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .loc-badge.unserviceable {
          background: #fdecea;
          color: #d32f2f;
        }

        .loc-title {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.5rem;
        }

        .loc-subtitle {
          font-size: 0.9rem;
          color: #6E5444;
          line-height: 1.5;
        }

        .loc-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .loc-option-btn {
          border-radius: 18px;
          padding: 1.25rem 1rem;
          border: 2px solid rgba(152, 78, 49, 0.2);
          background: #ffffff;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .loc-option-btn.selected {
          border-color: #21100a;
          background: #21100a;
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(33, 16, 10, 0.25);
        }

        .loc-option-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        .loc-option-title {
          font-weight: 700;
          font-size: 1.05rem;
        }

        .loc-option-tag {
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.85;
        }

        .alert-banner {
          background: #fdecea;
          border-left: 4px solid #d32f2f;
          color: #c62828;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.45;
          margin-bottom: 1.25rem;
        }

        .loc-confirm-btn {
          width: 100%;
          padding: 0.95rem;
          border-radius: 999px;
          border: none;
          background: #984e31;
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .loc-confirm-btn:hover {
          background: #7e3e26;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(152, 78, 49, 0.3);
        }
      `}</style>

      <div className="loc-modal-overlay">
        <div className="loc-modal-card">
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6E5444'
            }}
          >
            <CloseIcon size={20} />
          </button>

          <div className="loc-modal-header">
            {checkingLocation ? (
              <span className="loc-badge serviceable">
                <TargetIcon size={14} /> Detecting Location...
              </span>
            ) : locationChecked && isServiceable ? (
              <span className="loc-badge serviceable">
                <CheckIcon size={14} /> Location Serviceable ({distanceKm?.toFixed(1)} km away)
              </span>
            ) : (
              <span className="loc-badge unserviceable">
                📍 {distanceKm ? `${distanceKm.toFixed(1)} km away – Out of 2km Radius` : 'Location Not Serviceable'}
              </span>
            )}

            <h3 className="loc-title">Choose Experience</h3>
            <p className="loc-subtitle">
              We offer doorstep delivery within <strong>2 km</strong> of our cafe, and unlimited <strong>Dine-In / Pickup</strong> for everyone!
            </p>
          </div>

          {errorMessage && <div className="alert-banner">{errorMessage}</div>}

          <div className="loc-options-grid">
            {/* Option 1: Delivery */}
            <div
              className={`loc-option-btn ${selectedType === 'delivery' ? 'selected' : ''} ${!isServiceable && locationChecked ? 'disabled' : ''}`}
              onClick={() => {
                if (!isServiceable && locationChecked) {
                  setErrorMessage(
                    `📍 Delivery Not Serviceable! You are ${distanceKm ? `${distanceKm.toFixed(1)} km` : 'outside the 2 km radius'} away from 30° Turn Cafe. Please select Dine-In / Takeaway!`
                  );
                } else {
                  setSelectedType('delivery');
                  setErrorMessage('');
                }
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>🛵</span>
              <span className="loc-option-title">Delivery</span>
              <span className="loc-option-tag">
                {isServiceable ? 'Within 2 km' : 'Outside 2 km'}
              </span>
            </div>

            {/* Option 2: Dine-In */}
            <div
              className={`loc-option-btn ${selectedType === 'dine-in' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedType('dine-in');
                setErrorMessage('');
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>🍽️</span>
              <span className="loc-option-title">Dine-In / Pickup</span>
              <span className="loc-option-tag">Always Available</span>
            </div>
          </div>

          <button className="loc-confirm-btn" onClick={handleConfirm}>
            Confirm Selection
          </button>
        </div>
      </div>
    </>
  );
}
