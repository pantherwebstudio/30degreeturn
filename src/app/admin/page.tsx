'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneIcon, RefreshIcon, ClipboardIcon, PlusIcon, CloseIcon, CheckIcon, SparklesIcon, CoffeeIcon, UserIcon, DeliveryIcon, DineInIcon } from '@/app/components/Icons';

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
  orderType?: 'delivery' | 'dine-in';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subCategory?: string;
  isVeg: boolean;
  image: string;
  available?: boolean;
}

const MENU_CATEGORIES = [
  'hot-classics',
  'flavoured-signature-latte',
  'tea-latte-matcha',
  'espresso-on-ice',
  'signature-frappe',
  'boba-bubble-tea',
  'artisan-hot-chocolate',
  'gourmet-shakes',
  'refreshing-mocktails-cocktails',
  'fresh-cold-pressed-juices',
  'gourmet-omelettes',
  'all-day-starters',
  'signature-pizza-sandwiches',
  'quesadilla',
  'pasta-pancakes-waffles'
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<'orders' | 'menu'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'completed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Menu Management State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState<string>('all');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('hot-classics');
  const [formSubCategory, setFormSubCategory] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formImage, setFormImage] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formError, setFormError] = useState('');

  // Check auth session
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setSessionUser(data.user);
      return data.user;
    } catch (err) {
      router.push('/admin/login');
      return null;
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items from DB API
  const fetchMenuItems = async () => {
    setMenuLoading(true);
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) throw new Error('Failed to load menu');
      const data = await res.json();
      setMenuItems(data.items || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const user = await checkSession();
      if (user) {
        fetchOrders();
        fetchMenuItems();
      }
    }
    init();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: 'preparing' | 'completed' | 'cancelled') => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setOrders(prev =>
        prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Menu Modal Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormPrice('');
    setFormDesc('');
    setFormCategory('hot-classics');
    setFormSubCategory('');
    setFormIsVeg(true);
    setFormImage('');
    setFormAvailable(true);
    setFormError('');
    setIsMenuModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(item.price.toString());
    setFormDesc(item.description);
    setFormCategory(item.category);
    setFormSubCategory(item.subCategory || '');
    setFormIsVeg(item.isVeg);
    setFormImage(item.image);
    setFormAvailable(item.available ?? true);
    setFormError('');
    setIsMenuModalOpen(true);
  };

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFormImage(data.url);
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Menu Item Handler
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formCategory) {
      setFormError('Please fill in Item Name, Price, and Category.');
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    try {
      const payload = {
        id: editingItem ? editingItem.id : `item_${Date.now()}`,
        name: formName,
        price: priceNum,
        description: formDesc,
        category: formCategory,
        subCategory: formSubCategory,
        isVeg: formIsVeg,
        image: formImage,
        available: formAvailable,
      };

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save item');

      fetchMenuItems();
      setIsMenuModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save menu item');
    }
  };

  // Delete Menu Item Handler
  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Error deleting menu item.');
    }
  };

  // Toggle Stock Availability
  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const updated = { ...item, available: !item.available };
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setMenuItems(prev => prev.map(it => (it.id === item.id ? updated : it)));
      }
    } catch (err) {
      alert('Error updating stock availability');
    }
  };

  // Computed metrics
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = menuCatFilter === 'all' || item.category === menuCatFilter;
    return matchesSearch && matchesCat;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="admin-wrapper">
      <style jsx global>{`
        .admin-wrapper {
          min-height: 100vh;
          background: #FAF6F0;
          color: #21100a;
          font-family: var(--font-sans);
        }

        /* Elevated Header Bar */
        .admin-header {
          background: linear-gradient(135deg, #21100a 0%, #3a1b11 100%);
          color: #ffffff;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(33, 16, 10, 0.25);
          position: sticky;
          top: 0;
          z-index: 100;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-title-box {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        /* Circle placeholder with cream background for logo */
        .admin-header-logo-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #FAF3EC;
          border: 1.5px solid rgba(203, 171, 128, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .admin-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .admin-brand-title {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #FAF3EC;
        }

        .admin-badge {
          background: rgba(203, 171, 128, 0.2);
          border: 1px solid rgba(203, 171, 128, 0.4);
          color: #CBAB80;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          flex-wrap: wrap;
        }

        .live-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #2e7d32;
          box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(46, 125, 50, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
        }

        .user-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #FAF3EC;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.4rem 0.9rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(217, 83, 79, 0.25);
          border-color: #d9534f;
          color: #ff8a80;
        }

        /* Container Layout */
        .dashboard-content {
          max-width: 1320px;
          margin: 0 auto;
          padding: 1.75rem 1.25rem;
        }

        /* Main Tabs Switcher */
        .main-tabs-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          background: #ffffff;
          padding: 0.4rem;
          border-radius: 18px;
          border: 1px solid rgba(152, 78, 49, 0.15);
          box-shadow: 0 4px 15px rgba(33, 16, 10, 0.04);
        }

        .main-tab-btn {
          flex: 1;
          font-size: 0.98rem;
          font-weight: 700;
          padding: 0.8rem 1.25rem;
          border: none;
          background: transparent;
          color: #6E5444;
          cursor: pointer;
          border-radius: 14px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .main-tab-btn.active {
          color: #ffffff;
          background: linear-gradient(135deg, #984e31 0%, #7e3e26 100%);
          box-shadow: 0 6px 20px rgba(152, 78, 49, 0.25);
        }

        /* Metrics Row */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .metric-card {
          background: #ffffff;
          padding: 1.25rem 1.5rem;
          border-radius: 20px;
          box-shadow: 0 6px 20px rgba(33, 16, 10, 0.04);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(152, 78, 49, 0.12);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(33, 16, 10, 0.08);
        }

        .metric-label {
          font-size: 0.78rem;
          color: #6E5444;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .metric-value {
          font-size: 2.1rem;
          font-weight: 800;
          font-family: var(--font-serif);
          color: #21100a;
          margin-top: 0.3rem;
        }

        .metric-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
        }

        .metric-total .metric-accent { background: #984e31; }
        .metric-pending .metric-accent { background: #e53e3e; }
        .metric-preparing .metric-accent { background: #dd6b20; }
        .metric-completed .metric-accent { background: #38a169; }

        /* Controls & Filter Bar */
        .controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          background: #ffffff;
          padding: 0.85rem 1.1rem;
          border-radius: 18px;
          border: 1px solid rgba(152, 78, 49, 0.12);
          box-shadow: 0 4px 15px rgba(33, 16, 10, 0.03);
        }

        .filter-tabs {
          display: flex;
          gap: 0.4rem;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 0.2rem;
          width: 100%;
          max-width: 100%;
        }

        .filter-tabs::-webkit-scrollbar {
          height: 3px;
        }

        .filter-tabs::-webkit-scrollbar-thumb {
          background: rgba(152, 78, 49, 0.2);
          border-radius: 999px;
        }

        .filter-tab {
          padding: 0.45rem 0.95rem;
          border-radius: 999px;
          border: 1.5px solid rgba(152, 78, 49, 0.15);
          background-color: #FAF3EC;
          color: #6E5444;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .filter-tab.active {
          background-color: #21100a;
          color: #ffffff;
          border-color: #21100a;
          box-shadow: 0 4px 12px rgba(33, 16, 10, 0.2);
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          border-radius: 12px;
          border: 1.5px solid rgba(152, 78, 49, 0.2);
          background-color: #ffffff;
          color: #21100a;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover {
          background-color: #FAF3EC;
          border-color: #984e31;
          color: #984e31;
        }

        /* Order Cards Layout */
        .orders-container {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .order-row-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(152, 78, 49, 0.15);
          padding: 1.35rem 1.5rem;
          display: grid;
          grid-template-columns: 1.3fr 1.5fr 2fr 1.3fr;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 6px 20px rgba(33, 16, 10, 0.04);
          transition: all 0.25s ease;
        }

        .order-row-card:hover {
          box-shadow: 0 10px 25px rgba(33, 16, 10, 0.08);
          border-color: rgba(152, 78, 49, 0.3);
        }

        .order-ref {
          font-weight: 800;
          font-size: 1rem;
          color: #984e31;
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        .order-time {
          font-size: 0.78rem;
          color: #6E5444;
          margin-top: 0.2rem;
        }

        .cust-name {
          font-weight: 800;
          font-size: 1rem;
          color: #21100a;
        }

        .cust-phone {
          font-size: 0.85rem;
          color: #6E5444;
          font-weight: 600;
          margin-top: 0.2rem;
        }

        .order-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          margin-top: 0.35rem;
        }

        .order-type-badge.delivery {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid rgba(46, 125, 50, 0.2);
        }

        .order-type-badge.dine-in {
          background: #efe4d6;
          color: #4a2e1c;
          border: 1px solid rgba(74, 46, 28, 0.2);
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .badge-pending { background-color: #fdecea; color: #c62828; border: 1px solid rgba(198, 40, 40, 0.2); }
        .badge-preparing { background-color: #fff3e0; color: #e65100; border: 1px solid rgba(230, 81, 0, 0.2); }
        .badge-completed { background-color: #e8f5e9; color: #2e7d32; border: 1px solid rgba(46, 125, 50, 0.2); }
        .badge-cancelled { background-color: #f5f5f5; color: #616161; border: 1px solid rgba(97, 97, 97, 0.2); }

        .items-summary-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .amount-box {
          font-size: 1.25rem;
          font-weight: 800;
          color: #984e31;
          font-family: var(--font-serif);
        }

        .action-btn-row {
          display: flex;
          gap: 0.45rem;
          margin-top: 0.4rem;
          flex-wrap: wrap;
        }

        .act-btn {
          padding: 0.45rem 0.85rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .act-btn-prep { background-color: #1976d2; color: white; }
        .act-btn-prep:hover { background-color: #1565c0; }
        
        .act-btn-done { background: linear-gradient(135deg, #984e31 0%, #7e3e26 100%); color: white; }
        .act-btn-done:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(152, 78, 49, 0.25); }

        .act-btn-cancel { background-color: transparent; border-color: rgba(152, 78, 49, 0.2); color: #6E5444; }
        .act-btn-cancel:hover { background-color: #fdecea; color: #c62828; border-color: #c62828; }

        /* Menu Admin Grid */
        .menu-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .menu-admin-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(152, 78, 49, 0.15);
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(33, 16, 10, 0.04);
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }

        .menu-admin-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(33, 16, 10, 0.08);
          border-color: rgba(152, 78, 49, 0.3);
        }

        .menu-card-img-wrap {
          width: 100%;
          height: 165px;
          position: relative;
          background: #FAF3EC;
          overflow: hidden;
        }

        .menu-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .menu-admin-card:hover .menu-card-img {
          transform: scale(1.06);
        }

        .stock-tag {
          position: absolute;
          top: 0.65rem;
          right: 0.65rem;
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .stock-tag.in-stock { background: rgba(46, 125, 50, 0.9); color: white; }
        .stock-tag.out-stock { background: rgba(198, 40, 40, 0.9); color: white; }

        .menu-card-body {
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .menu-card-title {
          font-weight: 800;
          font-size: 1.05rem;
          color: #21100a;
        }

        .menu-card-price {
          font-weight: 800;
          font-size: 1.05rem;
          color: #984e31;
          font-family: var(--font-serif);
        }

        .menu-card-desc {
          font-size: 0.82rem;
          color: #6E5444;
          margin: 0.5rem 0 0.85rem 0;
          line-height: 1.45;
          flex: 1;
        }

        .menu-card-cat-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #984e31;
          background: #FAF3EC;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .menu-card-actions {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        /* Modal Styles */
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(33, 16, 10, 0.65);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .admin-modal-card {
          background: #FAF3EC;
          border: 1px solid rgba(152, 78, 49, 0.2);
          border-radius: 24px;
          max-width: 540px;
          width: 100%;
          padding: 1.75rem;
          box-shadow: 0 20px 50px rgba(33, 16, 10, 0.3);
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-form-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border-radius: 12px;
          background-color: #ffffff;
          border: 1.5px solid rgba(152, 78, 49, 0.2);
          font-size: 0.9rem;
          color: #21100a;
          outline: none;
        }

        .modal-form-input:focus {
          border-color: #984e31;
        }

        /* RESPONSIVE MEDIA QUERIES FOR MOBILE */
        @media (max-width: 900px) {
          .order-row-card {
            grid-template-columns: 1fr;
            gap: 0.85rem;
            padding: 1.15rem;
          }
          .action-btn-row {
            justify-content: flex-start !important;
          }
        }

        @media (max-width: 600px) {
          .admin-header {
            padding: 0.85rem 1rem;
            flex-direction: column;
            align-items: stretch;
          }
          .admin-title-box {
            justify-content: flex-start;
          }
          .user-info {
            justify-content: space-between;
          }
          .main-tabs-row {
            flex-direction: column;
          }
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .metric-value {
            font-size: 1.65rem;
          }
          .controls-row {
            flex-direction: column;
            align-items: stretch;
          }
          .admin-modal-card {
            padding: 1.25rem 1rem;
            border-radius: 20px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="admin-header">
        <div className="admin-title-box">
          {/* White circle placeholder with creamy background for logo */}
          <div className="admin-header-logo-circle">
            <img src="/logo-30degreeturn.jpeg" alt="30° Turn Cafe Logo" className="admin-logo-img" />
          </div>
          <div>
            <h1 className="admin-brand-title" style={{ margin: 0 }}>30° TURN CAFE</h1>
            <span className="admin-badge">Manager Portal</span>
          </div>
        </div>

        {sessionUser && (
          <div className="user-info">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#a5d6a7' }}>
              <span className="live-dot"></span> Live DB Sync
            </span>
            <span className="user-name">{sessionUser.name} ({sessionUser.role})</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="dashboard-content">
        
        {/* Navigation Tabs */}
        <div className="main-tabs-row">
          <button
            className={`main-tab-btn ${activeMainTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('orders')}
          >
            <ClipboardIcon size={18} /> Cafe Live Orders ({orders.length})
          </button>
          <button
            className={`main-tab-btn ${activeMainTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('menu')}
          >
            <CoffeeIcon size={18} /> Live Menu Manager ({menuItems.length})
          </button>
        </div>

        {/* TAB 1: CAFE LIVE ORDERS */}
        {activeMainTab === 'orders' && (
          <>
            <section className="metrics-grid">
              <div className="metric-card metric-total">
                <div className="metric-label">Total Orders</div>
                <div className="metric-value">{orders.length}</div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card metric-pending">
                <div className="metric-label">Pending</div>
                <div className="metric-value">{pendingCount}</div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card metric-preparing">
                <div className="metric-label">Preparing</div>
                <div className="metric-value">{preparingCount}</div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card metric-completed">
                <div className="metric-label">Completed</div>
                <div className="metric-value">{completedCount}</div>
                <div className="metric-accent"></div>
              </div>
            </section>

            <section className="controls-row">
              <div className="filter-tabs">
                <button className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All ({orders.length})</button>
                <button className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>Pending ({pendingCount})</button>
                <button className={`filter-tab ${statusFilter === 'preparing' ? 'active' : ''}`} onClick={() => setStatusFilter('preparing')}>Preparing ({preparingCount})</button>
                <button className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`} onClick={() => setStatusFilter('completed')}>Completed ({completedCount})</button>
                <button className={`filter-tab ${statusFilter === 'cancelled' ? 'active' : ''}`} onClick={() => setStatusFilter('cancelled')}>Cancelled ({cancelledCount})</button>
              </div>

              <button className="refresh-btn" onClick={fetchOrders}>
                <RefreshIcon size={16} /> Refresh Live Orders
              </button>
            </section>

            <section className="orders-container">
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 0', background: '#ffffff', borderRadius: '22px', border: '1px solid rgba(152, 78, 49, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem', color: '#6E5444' }}>
                    <ClipboardIcon size={48} />
                  </div>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#6E5444' }}>No orders found matching this filter status.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div className="order-row-card" key={order.id}>
                    
                    {/* Ref Column */}
                    <div>
                      <span className="order-ref">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <div className="order-time">{formatDate(order.createdAt)}</div>
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span className={`status-badge badge-${order.status}`}>{order.status}</span>
                        <span className={`order-type-badge ${order.orderType === 'delivery' ? 'delivery' : 'dine-in'}`}>
                          {order.orderType === 'delivery' ? (
                            <><DeliveryIcon size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Delivery</>
                          ) : (
                            <><DineInIcon size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Dine-In / Pickup</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Customer Column */}
                    <div>
                      <div className="cust-name">{order.customerName}</div>
                      <a href={`tel:${order.customerMobile}`} className="cust-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                        <PhoneIcon size={14} style={{ color: '#984e31' }} /> {order.customerMobile}
                      </a>
                    </div>

                    {/* Items Summary Column */}
                    <div>
                      <ul className="items-summary-list">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <strong style={{ color: '#984e31' }}>{item.quantity}x</strong> {item.name} <span style={{ color: '#6E5444', fontSize: '0.8rem' }}>(₹{item.price.toFixed(2)})</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Total & Action Buttons Column */}
                    <div>
                      <div className="amount-box" style={{ marginBottom: '0.4rem' }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </div>

                      <div className="action-controls">
                        {updatingId === order.id ? (
                          <span style={{ fontSize: '0.85rem', color: '#6E5444', fontStyle: 'italic' }}>Updating...</span>
                        ) : (
                          <div className="action-btn-row">
                            {order.status === 'pending' && (
                              <button className="act-btn act-btn-prep" onClick={() => handleUpdateStatus(order.id, 'preparing')}>Prepare</button>
                            )}
                            {order.status === 'preparing' && (
                              <button className="act-btn act-btn-done" onClick={() => handleUpdateStatus(order.id, 'completed')}>Complete</button>
                            )}
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <button className="act-btn act-btn-cancel" onClick={() => handleUpdateStatus(order.id, 'cancelled')}>Cancel</button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </section>
          </>
        )}

        {/* TAB 2: LIVE MENU MANAGER */}
        {activeMainTab === 'menu' && (
          <>
            <div className="controls-row">
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1, width: '100%' }}>
                <input
                  type="text"
                  placeholder="Search live menu items..."
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  className="modal-form-input"
                  style={{ flex: 1, minWidth: '180px' }}
                />
                <select
                  className="modal-form-input"
                  style={{ flex: 1, minWidth: '180px' }}
                  value={menuCatFilter}
                  onChange={e => setMenuCatFilter(e.target.value)}
                >
                  <option value="all">All Categories ({menuItems.length})</option>
                  {MENU_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button className="act-btn act-btn-done" style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem', borderRadius: '14px', width: '100%' }} onClick={handleOpenAddModal}>
                <PlusIcon size={16} style={{ marginRight: '6px' }} /> Add New Menu Item
              </button>
            </div>

            <div className="menu-admin-grid">
              {filteredMenuItems.map(item => (
                <div className="menu-admin-card" key={item.id}>
                  <div className="menu-card-img-wrap">
                    <img src={item.image || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400&h=400'} alt={item.name} className="menu-card-img" />
                    <span className={`stock-tag ${item.available ? 'in-stock' : 'out-stock'}`}>
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="menu-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <span className="menu-card-title">{item.name}</span>
                      <span className="menu-card-price">₹{item.price.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="menu-card-cat-badge">{item.category}</span>
                    </div>

                    <p className="menu-card-desc">{item.description}</p>

                    <div className="menu-card-actions">
                      <button
                        className="act-btn act-btn-prep"
                        style={{ flex: 1 }}
                        onClick={() => handleOpenEditModal(item)}
                      >
                        Edit Item
                      </button>
                      <button
                        className="act-btn"
                        style={{ background: item.available ? '#38a169' : '#e53e3e', color: 'white' }}
                        onClick={() => handleToggleAvailable(item)}
                      >
                        {item.available ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <button
                        className="act-btn act-btn-cancel"
                        onClick={() => handleDeleteMenuItem(item.id, item.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </main>

      {/* Menu Item Add / Edit Modal */}
      {isMenuModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#21100a', margin: 0 }}>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsMenuModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E5444' }}>
                <CloseIcon size={22} />
              </button>
            </div>

            {formError && (
              <div style={{ background: '#fdecea', color: '#c62828', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem', fontWeight: 600 }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveMenuItem}>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4A2E1C', marginBottom: '0.35rem' }}>Item Name</label>
                <input type="text" className="modal-form-input" placeholder="e.g. Biscoff Cold Brew" value={formName} onChange={e => setFormName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4A2E1C', marginBottom: '0.35rem' }}>Price (₹)</label>
                  <input type="number" step="0.01" className="modal-form-input" placeholder="120" value={formPrice} onChange={e => setFormPrice(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4A2E1C', marginBottom: '0.35rem' }}>Category</label>
                  <select className="modal-form-input" value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                    {MENU_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4A2E1C', marginBottom: '0.35rem' }}>Description</label>
                <textarea className="modal-form-input" placeholder="Ingredients and details..." style={{ minHeight: '80px', resize: 'vertical' }} value={formDesc} onChange={e => setFormDesc(e.target.value)} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4A2E1C', marginBottom: '0.35rem' }}>Item Image (Upload File or Enter Image URL)</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ marginBottom: '0.5rem', fontSize: '0.85rem', width: '100%' }} />
                {uploadingImage && <p style={{ fontSize: '0.8rem', color: '#984e31', fontWeight: 600 }}>Uploading image...</p>}
                <input type="text" placeholder="https://..." className="modal-form-input" value={formImage} onChange={e => setFormImage(e.target.value)} />
                {formImage && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <img src={formImage} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(152, 78, 49, 0.2)' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(152, 78, 49, 0.15)', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', color: '#21100a' }}>
                  <input type="checkbox" checked={formIsVeg} onChange={e => setFormIsVeg(e.target.checked)} /> Vegetarian
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', color: '#21100a' }}>
                  <input type="checkbox" checked={formAvailable} onChange={e => setFormAvailable(e.target.checked)} /> In Stock
                </label>
              </div>

              <button type="submit" className="act-btn act-btn-done" style={{ width: '100%', padding: '0.9rem', fontSize: '0.98rem', borderRadius: '14px' }}>
                {editingItem ? 'Save Changes' : 'Add Item to Live Menu'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
