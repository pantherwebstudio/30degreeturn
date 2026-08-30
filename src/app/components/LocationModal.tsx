'use client';

import React, { useState, useEffect } from 'react';
import { TargetIcon, CheckIcon, CloseIcon, DeliveryIcon, DineInIcon, LocationPinIcon } from '@/app/components/Icons';

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
  return parseFloat((R * c).toFixed(2));
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (option: { orderType: 'delivery' | 'dine-in'; isServiceable: boolean; distanceKm: number | null }) => void;
  onSelectOrderType?: (type: 'delivery' | 'dine-in', isServiceable: boolean, distanceKm: number | null) => void;
  initialType?: 'delivery' | 'dine-in';
}

export default function LocationModal({ isOpen, onClose, onSelect, onSelectOrderType, initialType = 'dine-in' }: LocationModalProps) {
  const [selectedType, setSelectedType] = useState<'delivery' | 'dine-in'>(initialType);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isServiceable, setIsServiceable] = useState<boolean>(true);
  const [locationChecked, setLocationChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen && !locationChecked) {
      detectUserLocation();
    }
  }, [isOpen]);

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setIsServiceable(false);
      setLocationChecked(true);
      return;
    }

    setCheckingLocation(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);

        const dist = calculateDistanceKm(lat, lng, CAFE_LAT, CAFE_LNG);
        setDistanceKm(dist);

        const serviceable = dist <= MAX_DELIVERY_RADIUS_KM;
        setIsServiceable(serviceable);
        setLocationChecked(true);
        setCheckingLocation(false);

        if (!serviceable) {
          setSelectedType('dine-in');
        }
      },
      (error) => {
        console.warn('Geolocation permission denied/failed:', error.message);
        setIsServiceable(false);
        setLocationChecked(true);
        setCheckingLocation(false);
        setSelectedType('dine-in');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedType === 'delivery' && !isServiceable && locationChecked) {
      setErrorMessage(
        `Delivery Not Serviceable! You are ${distanceKm ? `${distanceKm.toFixed(1)} km` : 'outside the 2 km radius'} away from 30° Turn Cafe. Please select Dine-In / Takeaway!`
      );
      return;
    }

    const effectiveServiceable = selectedType === 'dine-in' ? true : isServiceable;

    if (onSelect) {
      onSelect({
        orderType: selectedType,
        isServiceable: effectiveServiceable,
        distanceKm
      });
    }

    if (onSelectOrderType) {
      onSelectOrderType(selectedType, effectiveServiceable, distanceKm);
    }

    onClose();
  };

  return (
    <div className="loc-modal-overlay">
      <style jsx global>{`
        .loc-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(33, 16, 10, 0.7);
          backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
        }

        .loc-modal-card {
          background: #FAF3EC;
          border-radius: 28px;
          max-width: 480px;
          width: 100%;
          padding: 2.25rem 2rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          border: 1.5px solid rgba(152, 78, 49, 0.25);
          position: relative;
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .loc-modal-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .loc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          margin-bottom: 0.75rem;
        }

        .loc-badge.serviceable {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid rgba(46, 125, 50, 0.3);
        }

        .loc-badge.unserviceable {
          background: #fdecea;
          color: #c62828;
          border: 1px solid rgba(198, 40, 40, 0.3);
        }

        .loc-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: #21100a;
          margin-bottom: 0.4rem;
        }

        .loc-subtitle {
          font-size: 0.92rem;
          color: #6E5444;
          line-height: 1.5;
        }

        .loc-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .loc-option-btn {
          background: #ffffff;
          border: 2px solid rgba(152, 78, 49, 0.18);
          border-radius: 20px;
          padding: 1.35rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .loc-option-btn:hover {
          transform: translateY(-3px);
          border-color: #984e31;
          box-shadow: 0 8px 20px rgba(152, 78, 49, 0.12);
        }

        .loc-option-btn.selected {
          border-color: #984e31;
          background: linear-gradient(135deg, #FAF3EC 0%, #EFE4D6 100%);
          box-shadow: 0 8px 20px rgba(152, 78, 49, 0.2);
        }

        .loc-option-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loc-option-title {
          font-weight: 800;
          font-size: 1rem;
          color: #21100a;
        }

        .loc-option-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #6E5444;
          background: rgba(152, 78, 49, 0.1);
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .alert-banner {
          background-color: #fdecea;
          color: #c62828;
          border-left: 4px solid #c62828;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }

        .loc-confirm-btn {
          width: 100%;
          background: linear-gradient(135deg, #984e31 0%, #7e3e26 100%);
          color: white;
          padding: 0.95rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(152, 78, 49, 0.3);
          transition: all 0.25s ease;
        }

        .loc-confirm-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(152, 78, 49, 0.4);
        }
      `}</style>

      <div className="loc-modal-card">
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
              <LocationPinIcon size={14} /> {distanceKm ? `${distanceKm.toFixed(1)} km away – Out of 2km Radius` : 'Location Not Serviceable'}
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
                  `Delivery Not Serviceable! You are ${distanceKm ? `${distanceKm.toFixed(1)} km` : 'outside the 2 km radius'} away from 30° Turn Cafe. Please select Dine-In / Takeaway!`
                );
              } else {
                setSelectedType('delivery');
                setErrorMessage('');
              }
            }}
          >
            <DeliveryIcon size={32} style={{ color: '#2e7d32' }} />
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
            <DineInIcon size={32} style={{ color: '#984e31' }} />
            <span className="loc-option-title">Dine-In / Pickup</span>
            <span className="loc-option-tag">Always Available</span>
          </div>
        </div>

        <button className="loc-confirm-btn" onClick={handleConfirm}>
          Confirm Selection
        </button>
      </div>
    </div>
  );
}
