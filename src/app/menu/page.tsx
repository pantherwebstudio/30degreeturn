'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  UserIcon,
  CartIcon,
  KeyIcon,
  CloseIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  CoffeeIcon,
  SparklesIcon,
  LeafIcon,
  CakeIcon,
  SnowflakeIcon,
  HeartCupIcon
} from '@/app/components/Icons';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  calories: string;
  size: string;
  category: 'coffee' | 'specialty' | 'pastry';
  image: string;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerMobile: string;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'c1',
    name: 'Vietnamese Cold Brew',
    price: 149,
    description: 'Slow-brewed cold coffee with sweet condensed milk, served over ice.',
    calories: '280 kcal',
    size: 'Tall (354 ml)',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'c2',
    name: 'Iced Shaken Espresso',
    price: 169,
    description: 'Double espresso shaken with ice, vanilla syrup, and finished with a splash of oat milk.',
    calories: '180 kcal',
    size: 'Tall (354 ml)',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'c3',
    name: 'Cold Coffee Latte',
    price: 139,
    description: 'Rich, full-bodied espresso combined with cold milk and poured over ice.',
    calories: '190 kcal',
    size: 'Grande (473 ml)',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'c4',
    name: 'Nitro Cold Brew',
    price: 179,
    description: 'Our signature slow-steeped cold brew infused with nitrogen for a sweet, velvety head.',
    calories: '5 kcal',
    size: 'Grande (473 ml)',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 's1',
    name: 'Matcha Latte',
    price: 189,
    description: 'Pure Japanese Uji matcha whisked to order, served with steamed oat milk.',
    calories: '210 kcal',
    size: 'Grande (473 ml)',
    category: 'specialty',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 's2',
    name: 'Chocolate Mocha',
    price: 199,
    description: 'Espresso mixed with bittersweet cocoa syrup, steamed milk, and dark chocolate flakes.',
    calories: '390 kcal',
    size: 'Grande (473 ml)',
    category: 'specialty',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 's3',
    name: 'Lavender Iced Tea',
    price: 129,
    description: 'Refreshing iced black tea infused with notes of rosemary, lavender flower, and honey.',
    calories: '120 kcal',
    size: 'Grande (473 ml)',
    category: 'specialty',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'p1',
    name: 'Butter Croissant',
    price: 99,
    description: 'Warm, flaky, golden croissant made with real French butter.',
    calories: '310 kcal',
    size: '1 Piece',
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'p2',
    name: 'Almond Croissant',
    price: 129,
    description: 'Freshly baked croissant stuffed with premium sweet almond paste and topped with almond slices.',
    calories: '420 kcal',
    size: '1 Piece',
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'p3',
    name: 'Chocolate Fudge Cookie',
    price: 79,
    description: 'Rich, soft chocolate fudge cookie baked with double chocolate chips and sea salt.',
    calories: '290 kcal',
    size: '1 Piece',
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cart & Category state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'specialty' | 'pastry'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Customer identity login states (Persisted in Local Storage)
  const [customer, setCustomer] = useState<{ name: string; mobile: string } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [loginError, setLoginError] = useState('');

  // Hidden admin form toggles inside customer modal
  const [isAdminForm, setIsAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Orders views
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'tampered' | 'error' | null>(null);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

  // Booking Checkout & Success alert states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Checkout form states (for anonymous checkouts)
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  // Read URL params
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam && ['coffee', 'specialty', 'pastry'].includes(catParam)) {
      setActiveCategory(catParam as any);
    }
    const cartParam = searchParams.get('cart');
    if (cartParam === 'open') {
      setIsCartOpen(true);
    }
    const loginParam = searchParams.get('login');
    if (loginParam === 'open') {
      setIsLoginOpen(true);
    }
    // Handle PayU payment callback status
    const paymentParam = searchParams.get('payment');
    if (paymentParam === 'success') {
      const orderId = searchParams.get('orderId');
      setPaymentStatus('success');
      setPaymentOrderId(orderId);
      // Clear pending order from localStorage
      localStorage.removeItem('30_turn_pending_order');
      saveCart([]);
    } else if (paymentParam === 'failed') {
      setPaymentStatus('failed');
    } else if (paymentParam === 'tampered') {
      setPaymentStatus('tampered');
    } else if (paymentParam === 'error') {
      setPaymentStatus('error');
    }
  }, [searchParams]);

  // Load cart & customer login from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('30_turn_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart');
      }
    }

    const savedUser = localStorage.getItem('30_turn_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCustomer(parsedUser);
        fetchCustomerOrders(parsedUser.mobile);
      } catch (e) {
        console.error('Error parsing customer details');
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('30_turn_cart', JSON.stringify(newCart));
  };

  // Fetch orders matching customer's mobile
  const fetchCustomerOrders = async (mobileNum: string) => {
    setFetchingOrders(true);
    try {
      const res = await fetch(`/api/orders/customer?mobile=${mobileNum}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to load customer orders:', e);
    } finally {
      setFetchingOrders(false);
    }
  };

  // Handle Login (Supports either Customer check-in OR secret Admin login form)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isAdminForm) {
      // ADMIN AUTH FLOW
      if (!adminEmail.trim() || !adminPassword.trim()) {
        setLoginError('Email and password are required.');
        return;
      }
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail, password: adminPassword })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to authenticate admin.');
        }

        // Successfully logged in as admin
        setIsLoginOpen(false);
        setIsAdminForm(false);
        setAdminEmail('');
        setAdminPassword('');
        // Redirect to admin dashboard
        router.push('/admin');
      } catch (err: any) {
        setLoginError(err.message || 'Invalid admin credentials.');
      }
    } else {
      // CUSTOMER CHECK-IN FLOW
      if (!loginName.trim() || !loginMobile.trim()) {
        setLoginError('Both name and mobile number are required.');
        return;
      }
      if (loginMobile.replace(/\D/g, '').length < 10) {
        setLoginError('Enter a valid 10-digit mobile number.');
        return;
      }

      const userData = {
        name: loginName.trim(),
        mobile: loginMobile.trim()
      };

      setCustomer(userData);
      localStorage.setItem('30_turn_user', JSON.stringify(userData));
      setIsLoginOpen(false);
      setLoginName('');
      setLoginMobile('');

      // Automatically load their orders
      fetchCustomerOrders(userData.mobile);
    }
  };

  // Handle Customer Logout
  const handleCustomerLogout = () => {
    setCustomer(null);
    setCustomerOrders([]);
    localStorage.removeItem('30_turn_user');
  };

  const addToCart = (item: MenuItem) => {
    if (!customer) {
      setIsLoginOpen(true);
      return;
    }
    const existing = cart.find(ci => ci.item.id === item.id);
    if (existing) {
      const updated = cart.map(ci =>
        ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { item, quantity: 1 }]);
    }

    const cartBtn = document.getElementById('cart-floating-btn');
    if (cartBtn) {
      cartBtn.classList.remove('bounce-animation');
      void cartBtn.offsetWidth;
      cartBtn.classList.add('bounce-animation');
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const updated = cart.map(ci => {
      if (ci.item.id === itemId) {
        const newQty = ci.quantity + delta;
        return newQty > 0 ? { ...ci, quantity: newQty } : null;
      }
      return ci;
    }).filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    const updated = cart.filter(ci => ci.item.id !== itemId);
    saveCart(updated);
  };

  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const tax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + tax;

  // Handles Checkout Submit — initiates PayU payment
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeName = customer ? customer.name : name;
    const activeMobile = customer ? customer.mobile : mobile;

    if (!activeName.trim() || !activeMobile.trim()) {
      setSubmitError('Customer name and mobile number are required.');
      return;
    }
    if (activeMobile.replace(/\D/g, '').length < 10) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const orderItems = cart.map(ci => ({
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price
      }));

      // Auto-save customer session
      if (!customer) {
        const userSession = { name: activeName, mobile: activeMobile };
        setCustomer(userSession);
        localStorage.setItem('30_turn_user', JSON.stringify(userSession));
      }

      // Store pending order in localStorage for reference
      localStorage.setItem('30_turn_pending_order', JSON.stringify({
        customerName: activeName,
        customerMobile: activeMobile,
        totalAmount: parseFloat(cartTotal.toFixed(2)),
        items: orderItems
      }));

      // Call server to create Cashfree order → get payment_session_id
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: activeName,
          customerMobile: activeMobile,
          totalAmount: parseFloat(cartTotal.toFixed(2)),
          items: orderItems
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment initiation failed.');

      const { paymentSessionId, cfEnv } = data;

      // Dynamically load Cashfree JS SDK and open checkout
      await new Promise<void>((resolve, reject) => {
        if ((window as any).Cashfree) { resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Cashfree SDK.'));
        document.head.appendChild(script);
      });

      const cashfree = (window as any).Cashfree({ mode: cfEnv === 'production' ? 'production' : 'sandbox' });

      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_self',
      });

    } catch (err: any) {
      setSubmitError(err.message || 'Payment error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="starbucks-layout">
      {/* Dynamic CSS Styles */}
      <style jsx global>{`
        .starbucks-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-white);
        }

        /* Ribbon */
        .promo-ribbon {
          background-color: #f7fafc;
          border-bottom: 2px solid var(--gold);
          color: var(--text-dark);
          padding: 0.75rem 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
          animation: slideUp 0.3s ease-out;
        }

        .cancel-append-btn {
          color: #d9534f;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        /* Ribbon */
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

        /* Handcrafted Curations Section matching home page design */
        .curations-section {
          padding: 3.5rem 6%;
          background-color: var(--bg-cream);
          text-align: center;
          border-bottom: 1px solid var(--border-color);
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

        .curation-card.active {
          border-color: #984e31;
          background: #f7ede2;
          box-shadow: 0 6px 20px rgba(152, 78, 49, 0.15);
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
        }

        /* Recommended list */
        .recommended-section {
          padding: 2.5rem 6% 5rem 6%;
          background-color: var(--bg-light);
          flex: 1;
        }

        .recommended-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }

        @media (max-width: 600px) {
          .recommended-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Horizontal Card */
        .sb-card {
          background-color: var(--bg-white);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 1.25rem;
          display: flex;
          gap: 1.25rem;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: var(--transition-normal);
        }

        .sb-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .sb-card-img-box {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
          background-color: var(--bg-sage-light);
        }

        .sb-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .sb-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .sb-veg-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border: 1.5px solid #2e7d32;
          border-radius: 2px;
          padding: 2px;
          margin-bottom: 0.25rem;
        }

        .sb-veg-dot {
          width: 6px;
          height: 6px;
          background-color: #2e7d32;
          border-radius: 50%;
        }

        .sb-item-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.3;
        }

        .sb-item-subtitle {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-light);
        }

        .sb-item-desc {
          font-size: 0.8rem;
          color: var(--text-medium);
          line-height: 1.4;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sb-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .sb-item-price {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-dark);
        }

        .sb-add-circle {
          width: 32px;
          height: 32px;
          background-color: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          transition: var(--transition-fast);
          box-shadow: 0 2px 4px rgba(74, 109, 85, 0.2);
        }

        .sb-add-circle:hover {
          background-color: var(--primary-light);
          transform: scale(1.08);
        }

        /* Floating Cart */
        .sb-cart-floating {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 90;
        }

        .sb-cart-btn {
          width: 58px;
          height: 58px;
          background-color: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          font-size: 1.4rem;
          position: relative;
          transition: var(--transition-fast);
        }

        .sb-cart-btn:hover {
          background-color: var(--primary-light);
          transform: scale(1.05);
        }

        .sb-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--primary-dark);
          color: white;
          border-radius: 50%;
          min-width: 22px;
          height: 22px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-white);
        }

        /* Cart Drawer */
        .cart-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          justify-content: flex-end;
        }

        .cart-drawer {
          background: var(--bg-white);
          width: 100%;
          max-width: 440px;
          height: 100%;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cart-drawer-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-drawer-title {
          font-weight: 700;
          font-size: 1.25rem;
        }

        .close-btn {
          font-size: 1.75rem;
          color: var(--text-light);
        }

        .cart-drawer-items {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-drawer-item {
          display: flex;
          align-items: center;
          background: var(--bg-light);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          gap: 1rem;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-dark);
        }

        .cart-item-price {
          color: var(--primary);
          font-weight: 700;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 0.2rem 0.5rem;
          background: var(--bg-white);
        }

        .qty-btn {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-medium);
        }

        .qty-num {
          font-weight: 700;
          font-size: 0.85rem;
        }

        .cart-drawer-footer {
          padding: 2rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-light);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-medium);
        }

        .summary-row.total {
          margin-top: 0.75rem;
          border-top: 1px dashed var(--border-color);
          padding-top: 0.75rem;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .checkout-btn {
          width: 100%;
          margin-top: 1.5rem;
          padding: 0.85rem;
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          background: var(--bg-white);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 480px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          overflow: hidden;
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scaleUp {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-medium);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }

        .submit-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.8rem;
        }

        /* Order Lists (My Orders popup) */
        .orders-popup-body {
          max-height: 400px;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .customer-order-card {
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .customer-order-card:last-child {
          margin-bottom: 0;
        }

        .ord-card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .status-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .badge-pending { background-color: rgba(196, 159, 101, 0.15); color: var(--gold); }
        .badge-preparing { background-color: rgba(49, 130, 206, 0.15); color: #3182ce; }
        .badge-completed { background-color: rgba(74, 109, 85, 0.15); color: var(--primary); }
        .badge-cancelled { background-color: rgba(142, 153, 144, 0.15); color: var(--text-light); }

        .ord-card-items {
          list-style: none;
          font-size: 0.85rem;
          color: var(--text-medium);
          margin-bottom: 0.75rem;
        }

        .ord-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .add-more-btn {
          background-color: var(--primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .add-more-btn:hover {
          background-color: var(--primary-light);
        }

        .success-card {
          text-align: center;
          padding: 3rem 2rem;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          background-color: rgba(74, 109, 85, 0.1);
          color: var(--primary);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          border: 1px solid var(--primary);
        }

        .success-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--primary-dark);
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .success-desc {
          font-size: 0.9rem;
          color: var(--text-medium);
          margin-bottom: 2rem;
        }

        .order-details-box {
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          text-align: left;
          margin-bottom: 2rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: var(--text-medium);
        }

        .detail-val {
          font-weight: 700;
          color: var(--text-dark);
        }


      `}</style>

      <Header
        activePage="menu"
        customer={customer}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={handleCustomerLogout}
        onLoginClick={() => setIsLoginOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onTrackOrdersClick={() => {
          if (customer) {
            setIsOrdersOpen(true);
            fetchCustomerOrders(customer.mobile);
          } else {
            setIsLoginOpen(true);
          }
        }}
      />



      {/* Payment Status Banner */}
      {paymentStatus && (
        <div style={{
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: paymentStatus === 'success' ? '#e8f5e9' : '#fdecea',
          borderBottom: `2px solid ${paymentStatus === 'success' ? 'var(--accent)' : 'var(--primary)'}`,
        }}>
          <span style={{ fontWeight: '700', color: paymentStatus === 'success' ? 'var(--accent)' : 'var(--primary)', fontSize: '0.95rem' }}>
            {paymentStatus === 'success' && `✅ Payment successful! Your order has been placed${paymentOrderId ? ` (ID: #${paymentOrderId.slice(0, 8).toUpperCase()})` : ''}.`}
            {paymentStatus === 'failed' && '❌ Payment was unsuccessful. Please try again.'}
            {paymentStatus === 'tampered' && '⚠️ Payment verification failed. Please contact support.'}
            {paymentStatus === 'error' && '⚠️ An error occurred processing your payment. Please contact support.'}
          </span>
          <button
            onClick={() => { setPaymentStatus(null); setPaymentOrderId(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}
          >✕</button>
        </div>
      )}

      <div className="promo-ribbon">
        <span>Savor the new season. Get organic coffee and warm pastries delivered or pickup fresh.</span>
        <button className="ribbon-btn" onClick={() => setIsLoginOpen(true)}>Sign In</button>
      </div>

      {/* Curation Categories */}
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
          <div
            className={`curation-card ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
          >
            <div className="curation-card-icon">
              <HeartCupIcon size={28} />
            </div>
            <h4 className="curation-card-title">All Curations</h4>
            <p className="curation-card-desc">Explore our complete collection</p>
            <span className="curation-card-link">Explore &rarr;</span>
          </div>

          <div
            className={`curation-card ${activeCategory === 'coffee' ? 'active' : ''}`}
            onClick={() => setActiveCategory('coffee')}
          >
            <div className="curation-card-icon">
              <SnowflakeIcon size={26} />
            </div>
            <h4 className="curation-card-title">Cold Brews</h4>
            <p className="curation-card-desc">Chilled to perfection, crafted to refresh</p>
            <span className="curation-card-link">Discover &rarr;</span>
          </div>

          <div
            className={`curation-card ${activeCategory === 'specialty' ? 'active' : ''}`}
            onClick={() => setActiveCategory('specialty')}
          >
            <div className="curation-card-icon">
              <LeafIcon size={26} />
            </div>
            <h4 className="curation-card-title">Matcha Series</h4>
            <p className="curation-card-desc">Pure, vibrant, and naturally energizing</p>
            <span className="curation-card-link">Explore &rarr;</span>
          </div>

          <div
            className={`curation-card ${activeCategory === 'pastry' ? 'active' : ''}`}
            onClick={() => setActiveCategory('pastry')}
          >
            <div className="curation-card-icon">
              <CoffeeIcon size={26} />
            </div>
            <h4 className="curation-card-title">Signature Lattes</h4>
            <p className="curation-card-desc">Classic comfort, perfectly balanced</p>
            <span className="curation-card-link">Explore &rarr;</span>
          </div>
        </div>
      </section>

      {/* Recommended menu cards */}
      <section className="recommended-section">
        <h3 className="section-heading" style={{ borderBottom: '2px solid var(--primary)', width: 'fit-content', paddingBottom: '0.25rem' }}>
          Select & Customize
        </h3>

        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-medium)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-light)' }}>
              <CoffeeIcon size={48} />
            </div>
            <p style={{ marginTop: '1rem', fontWeight: '600' }}>No products match your search.</p>
          </div>
        ) : (
          <div className="recommended-grid">
            {filteredItems.map(item => (
              <div className="sb-card" key={item.id}>
                <div className="sb-card-img-box">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div className="sb-card-info">
                  <div className="sb-card-meta">
                    <div className="sb-veg-icon">
                      <div className="sb-veg-dot"></div>
                    </div>
                    <h4 className="sb-item-title">{item.name}</h4>
                    <span className="sb-item-subtitle">{item.calories} | {item.size}</span>
                  </div>
                  <p className="sb-item-desc">{item.description}</p>

                  <div className="sb-card-bottom">
                    <span className="sb-item-price">₹{item.price.toFixed(2)}</span>
                    <button className="sb-add-circle" onClick={() => addToCart(item)} title="Add to Order">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="sb-cart-floating">
          <button
            id="cart-floating-btn"
            className="sb-cart-btn bounce-animation"
            onClick={() => setIsCartOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <CartIcon size={22} />
            <span className="sb-cart-badge">{cartCount}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h2 className="cart-drawer-title">
                Your Cart
              </h2>
              <button className="close-btn" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsCartOpen(false)}><CloseIcon size={20} /></button>
            </div>

            <div className="cart-drawer-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CoffeeIcon size={40} />
                  </div>
                  <p>Your shopping basket is empty.</p>
                </div>
              ) : (
                cart.map(ci => (
                  <div className="cart-drawer-item" key={ci.item.id}>
                    <img src={ci.item.image} alt={ci.item.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{ci.item.name}</h4>
                      <span className="cart-item-price">₹{(ci.item.price * ci.quantity).toFixed(2)}</span>
                    </div>
                    <div className="quantity-controls">
                      <button className="qty-btn" style={{ display: 'flex', alignItems: 'center' }} onClick={() => updateQuantity(ci.item.id, -1)}><MinusIcon size={10} /></button>
                      <span className="qty-num">{ci.quantity}</span>
                      <button className="qty-btn" style={{ display: 'flex', alignItems: 'center' }} onClick={() => updateQuantity(ci.item.id, 1)}><PlusIcon size={10} /></button>
                    </div>
                    <button className="remove-item-btn" style={{ display: 'flex', alignItems: 'center', background: 'none', color: 'var(--text-light)', border: 'none' }} onClick={() => removeFromCart(ci.item.id)}><CloseIcon size={14} /></button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>GST (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  className="btn-primary checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  Confirm and Book Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Login Modal */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => { setIsLoginOpen(false); setIsAdminForm(false); }}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleLoginSubmit}>
            <div className="modal-header">
              <h2 className="cart-drawer-title">
                {isAdminForm ? 'Manager Administration' : 'Identify / Sign In'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAdminForm(!isAdminForm)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.35, outline: 'none', color: 'var(--text-dark)' }}
                  title={isAdminForm ? "Back to Customer Login" : "Admin Secret Portal"}
                >
                  <KeyIcon size={16} />
                </button>
                <button type="button" className="close-btn" style={{ display: 'flex', alignItems: 'center' }} onClick={() => { setIsLoginOpen(false); setIsAdminForm(false); }}><CloseIcon size={18} /></button>
              </div>
            </div>
            <div className="modal-body">
              {isAdminForm ? (
                <>
                  <p style={{ color: 'var(--text-medium)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    Authenticate with your administrator email and credentials.
                  </p>

                  <div className="form-group">
                    <label className="form-label" htmlFor="admin-email-field">Admin Email</label>
                    <input
                      id="admin-email-field"
                      type="email"
                      className="form-input"
                      placeholder="admin@30degreecafe.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="admin-password-field">Password</label>
                    <input
                      id="admin-password-field"
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-medium)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    Use your Name and Mobile Number to view active/past orders or append items to them easily!
                  </p>

                  <div className="form-group">
                    <label className="form-label" htmlFor="login-cust-name">Your Full Name</label>
                    <input
                      id="login-cust-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. John Doe"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="login-cust-mobile">Mobile Number</label>
                    <input
                      id="login-cust-mobile"
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 9876543210"
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {loginError && <p className="error-message">{loginError}</p>}

              <button type="submit" className="btn-primary submit-btn">
                {isAdminForm ? 'Sign In as Admin' : 'Sign In / Track Orders'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Orders list Modal */}
      {isOrdersOpen && (
        <div className="modal-overlay" onClick={() => setIsOrdersOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="cart-drawer-title">My Orders Tracker</h2>
              <button className="close-btn" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsOrdersOpen(false)}><CloseIcon size={20} /></button>
            </div>

            <div className="orders-popup-body">
              {fetchingOrders ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--primary)' }}>
                  <span>Loading orders history...</span>
                </div>
              ) : customerOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CoffeeIcon size={40} />
                  </div>
                  <p style={{ marginTop: '0.5rem' }}>No orders found for this mobile number.</p>
                </div>
              ) : (
                customerOrders.map(order => (
                  <div className="customer-order-card" key={order.id}>
                    <div className="ord-card-top">
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`status-badge badge-${order.status}`}>{order.status}</span>
                    </div>

                    <ul className="ord-card-items">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          • {item.quantity}x {item.name} (₹{item.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>

                    <div className="ord-card-bottom">
                      <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                      <span style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleCheckoutSubmit}>
            <div className="modal-header">
              <h2 className="cart-drawer-title">
                Complete Your Order
              </h2>
              <button type="button" className="close-btn" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsCheckoutOpen(false)}><CloseIcon size={20} /></button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                Enter your details to proceed to secure payment via PayU. Your order will be confirmed after payment.
              </p>

              {/* Only show inputs if the customer is not logged in */}
              {!customer && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-cust-name">Your Full Name</label>
                    <input
                      id="checkout-cust-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-cust-mobile">10-Digit Mobile Number</label>
                    <input
                      id="checkout-cust-mobile"
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {customer && (
                <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <p>Ordering as: <strong>{customer.name}</strong></p>
                  <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>Mobile: {customer.mobile}</p>
                </div>
              )}

              {/* Order summary */}
              <div style={{ background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Order Total</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>₹{cartTotal.toFixed(2)}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Inclusive of taxes</p>
              </div>

              {submitError && <p className="error-message">{submitError}</p>}

              <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Redirecting to PayU...' : '🔒 Pay Now'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Modal */}
      {placedOrder && (
        <div className="modal-overlay" onClick={() => setPlacedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-card">
              <div className="success-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none' }}>
                <CheckIcon size={64} style={{ color: 'var(--primary)' }} />
              </div>
              <h2 className="success-title">
                {placedOrder.isAppendSuccess ? 'Order Updated!' : 'Order Booked!'}
              </h2>
              <p className="success-desc">
                Congratulations, <strong>{placedOrder.customerName}</strong>! Your order modifications are saved.
              </p>

              <div className="order-details-box">
                <div className="detail-row">
                  <span className="detail-label">Order Ref ID</span>
                  <span className="detail-val" style={{ fontFamily: 'monospace' }}>{placedOrder.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Customer Mobile</span>
                  <span className="detail-val">{placedOrder.customerMobile}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">New Total Amount</span>
                  <span className="detail-val" style={{ color: 'var(--primary)' }}>₹{placedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-val" style={{ textTransform: 'capitalize', color: 'var(--gold)' }}>{placedOrder.status}</span>
                </div>
              </div>

              <button className="btn-primary" onClick={() => setPlacedOrder(null)}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading Menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
