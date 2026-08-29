'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneIcon, RefreshIcon, ClipboardIcon } from '@/app/components/Icons';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'completed' | 'cancelled'>('all');
  
  // Action triggers
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  // Fetch orders list
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession().then((user) => {
      if (user) {
        fetchOrders();
      }
    });

    // Setup active polling every 10 seconds to look for new incoming orders
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update order status');
      }

      // Update locally
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
    } catch (err: any) {
      alert(err.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error');
    }
  };

  // Compute metrics
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  // Format Date Helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <style jsx>{`
          .admin-loading {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            color: var(--primary);
            font-weight: 600;
          }
        `}</style>
        <span>Loading Admin Panel...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <style jsx global>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background-color: var(--bg-sage-light);
          display: flex;
          flex-direction: column;
        }

        .admin-header {
          background-color: var(--bg-card);
          padding: 1.25rem 2.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-title-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .admin-badge {
          background-color: var(--accent);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-dark);
        }

        .logout-btn {
          color: var(--text-light);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .logout-btn:hover {
          color: #d9534f;
        }

        .dashboard-content {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        /* Metrics grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .metric-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-md);
          padding: 1.5rem 2rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .metric-label {
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .metric-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1;
        }

        .metric-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .metric-pending .metric-accent { background-color: var(--gold); }
        .metric-preparing .metric-accent { background-color: #3182ce; }
        .metric-completed .metric-accent { background-color: var(--primary); }
        .metric-total .metric-accent { background-color: var(--accent); }

        /* Controls / Filter row */
        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .filter-tab {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.85rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-medium);
          transition: var(--transition-fast);
        }

        .filter-tab:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-tab.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .refresh-btn {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--primary);
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: var(--shadow-sm);
        }

        .refresh-btn:hover {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* Order List */
        .orders-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .no-orders-box {
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 4rem 2rem;
          text-align: center;
          border: 1px solid var(--border-color);
          color: var(--text-light);
        }

        .order-row-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-md);
          padding: 1.75rem 2rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          display: grid;
          grid-template-columns: 1fr 2fr 1.5fr 1fr;
          align-items: center;
          gap: 2rem;
          transition: var(--transition-normal);
        }

        .order-row-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        @media (max-width: 900px) {
          .order-row-card {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            padding: 1.5rem;
          }
        }

        @media (max-width: 600px) {
          .order-row-card {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .col-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .order-ref {
          font-family: monospace;
          font-weight: 700;
          color: var(--text-dark);
          font-size: 1rem;
          text-transform: uppercase;
        }

        .order-time {
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .cust-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .cust-phone {
          font-size: 0.9rem;
          color: var(--primary-light);
          font-weight: 500;
        }

        .items-summary-list {
          list-style: none;
          font-size: 0.95rem;
          color: var(--text-medium);
        }

        .item-summary-row {
          margin-bottom: 0.25rem;
        }

        .item-summary-row span {
          font-weight: 600;
          color: var(--text-dark);
          margin-right: 0.25rem;
        }

        .amount-box {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        /* Status badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .badge-pending {
          background-color: rgba(196, 159, 101, 0.15);
          color: var(--gold);
        }

        .badge-preparing {
          background-color: rgba(49, 130, 206, 0.15);
          color: #3182ce;
        }

        .badge-completed {
          background-color: rgba(74, 103, 79, 0.15);
          color: var(--primary);
        }

        .badge-cancelled {
          background-color: rgba(142, 153, 144, 0.15);
          color: var(--text-light);
        }

        /* Actions dropdown/buttons */
        .action-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .status-select {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          background-color: var(--bg-creamy);
          border: 1px solid var(--border-color);
          width: 100%;
        }

        .action-btn-row {
          display: flex;
          gap: 0.35rem;
        }

        .act-btn {
          flex: 1;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          transition: var(--transition-fast);
          border: 1px solid transparent;
          text-align: center;
        }

        .act-btn-prep {
          background-color: #3182ce;
          color: white;
        }
        .act-btn-prep:hover { background-color: #2b6cb0; }

        .act-btn-done {
          background-color: var(--primary);
          color: white;
        }
        .act-btn-done:hover { background-color: var(--primary-dark); }

        .act-btn-cancel {
          background-color: transparent;
          border-color: var(--border-color);
          color: var(--text-light);
        }
        .act-btn-cancel:hover {
          background-color: rgba(217, 83, 79, 0.1);
          color: #d9534f;
          border-color: #d9534f;
        }
      `}</style>

      {/* Header */}
      <header className="admin-header">
        <div className="admin-title-box">
          <img src="/30degree%20turn.png" alt="30° Turn Cafe Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)', marginRight: '8px' }} />
          <h1 className="logo-text" style={{ fontSize: '1.25rem' }}>30° TURN CAFE</h1>
          <span className="admin-badge">Dashboard</span>
        </div>
        {sessionUser && (
          <div className="user-info">
            <span className="user-name">{sessionUser.name} ({sessionUser.role})</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        
        {/* Metrics Row */}
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

        {/* Filters and Actions Control Row */}
        <section className="controls-row">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'preparing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('preparing')}
            >
              Preparing ({preparingCount})
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed ({completedCount})
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setStatusFilter('cancelled')}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>

          <button className="refresh-btn" onClick={fetchOrders}>
            <RefreshIcon size={14} style={{ marginRight: '6px' }} /> Refresh Live
          </button>
        </section>

        {/* Orders list container */}
        <section className="orders-container">
          {filteredOrders.length === 0 ? (
            <div className="no-orders-box">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-light)' }}>
                <ClipboardIcon size={44} />
              </div>
              <p>No orders found matching the filter.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div className="order-row-card" key={order.id}>
                
                {/* Reference column */}
                <div className="col-info">
                  <span className="order-ref">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="order-time">{formatDate(order.createdAt)}</span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className={`status-badge badge-${order.status}`}>{order.status}</span>
                  </div>
                </div>

                {/* Customer Column */}
                <div className="col-info">
                  <span className="cust-name">{order.customerName}</span>
                  <span className="cust-phone" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <PhoneIcon size={14} /> {order.customerMobile}
                  </span>
                </div>

                {/* Items column */}
                <div className="col-info">
                  <ul className="items-summary-list">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="item-summary-row">
                        <span>{item.quantity}x</span> {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Amount and actions column */}
                <div className="col-info" style={{ gap: '1rem', justifySelf: 'flex-end', width: '100%', maxWidth: '200px' }}>
                  <div className="amount-box" style={{ textAlign: 'right' }}>
                    ${order.totalAmount.toFixed(2)}
                  </div>

                  <div className="action-controls">
                    {updatingId === order.id ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'right', fontWeight: '500' }}>
                        Updating...
                      </span>
                    ) : (
                      <div className="action-btn-row">
                        {order.status === 'pending' && (
                          <button 
                            className="act-btn act-btn-prep"
                            onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          >
                            Prepare
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            className="act-btn act-btn-done"
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <button 
                            className="act-btn act-btn-cancel"
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                        {(order.status === 'completed' || order.status === 'cancelled') && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'right', fontStyle: 'italic', width: '100%' }}>
                            Archived
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </section>

      </main>
    </div>
  );
}
