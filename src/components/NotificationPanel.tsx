'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Info,
  TrendingUp,
  X,
} from 'lucide-react';

type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
};

const typeIcon: Record<string, typeof Bell> = {
  price_alert: TrendingUp,
  order_fill: CheckCircle2,
  document_ready: FileText,
  payment_confirmed: CreditCard,
  system: Info,
};

const typeColor: Record<string, string> = {
  price_alert: '#0fa987',
  order_fill: '#0fa987',
  document_ready: '#456dca',
  payment_confirmed: '#b87b18',
  system: '#7f96a5',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('bte-user-token');
      if (!token) return;
      setLoading(true);
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('bte-user-token');
      if (!token) return;
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch {
      // silent fail
    }
  };

  const markRead = async (id: string) => {
    try {
      const token = localStorage.getItem('bte-user-token');
      if (!token) return;
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch {
      // silent fail
    }
  };

  return (
    <>
      <button
        className="icon-button notification-bell-btn"
        onClick={() => { setOpen((v) => !v); if (!open) fetchNotifications(); }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-backdrop" onClick={() => setOpen(false)}>
          <aside className="notification-panel" onClick={(e) => e.stopPropagation()}>
            <div className="notification-panel-header">
              <h3>Notifications</h3>
              <div className="notification-panel-actions">
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
                <button className="notif-close" onClick={() => setOpen(false)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="notification-list">
              {loading && notifications.length === 0 && (
                <div className="notif-empty">Loading...</div>
              )}
              {!loading && notifications.length === 0 && (
                <div className="notif-empty">
                  <Bell size={24} />
                  <span>No notifications yet</span>
                </div>
              )}
              {notifications.map((notif) => {
                const Icon = typeIcon[notif.type] || AlertTriangle;
                const color = typeColor[notif.type] || '#7f96a5';
                return (
                  <button
                    key={notif.id}
                    className={`notif-item ${notif.is_read ? '' : 'notif-unread'}`}
                    onClick={() => !notif.is_read && markRead(notif.id)}
                  >
                    <span
                      className="notif-icon"
                      style={{ color, background: `${color}18` }}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="notif-content">
                      <b>{notif.title}</b>
                      <small>{notif.message}</small>
                    </span>
                    <span className="notif-meta">
                      <small>{timeAgo(notif.created_at)}</small>
                      {!notif.is_read && <span className="notif-unread-dot" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
