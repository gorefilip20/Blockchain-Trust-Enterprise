'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  RefreshCw,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  status: string;
  registration_fee_paid: number;
  created_at: string;
  last_login_at: string | null;
  balance: number;
}

interface Stats {
  total_users: number;
  paid_users: number;
  unpaid_users: number;
  total_balances: number;
  pending_transactions: number;
}

interface UserDetail {
  user: UserRow & { registration_fee_reference: string | null };
  balance: { available_balance: number; total_deposited: number; total_withdrawn: number; interest_earned: number };
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    payment_reference: string | null;
    status: string;
    created_at: string;
  }>;
  investments: Array<{
    id: string;
    plan_name: string;
    tier: string;
    amount_usd: number;
    current_value: number;
    actual_return_pct: number;
    status: string;
  }>;
}

type ModalType = 'deposit' | 'interest' | 'adjust' | null;

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRef, setFormRef] = useState('');
  const [formNetwork, setFormNetwork] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  function getToken() {
    return localStorage.getItem('bte-admin-token') || '';
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) { router.push('/admin/login'); return; }
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch {
      router.push('/admin/login');
    }
    setLoading(false);
  }

  async function fetchUserDetail(userId: string) {
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data);
      }
    } catch {}
  }

  async function adminAction(action: string, payload: Record<string, unknown>) {
    setActionLoading(true);
    setFeedback('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Action completed successfully.');
        setModal(null);
        setFormAmount(''); setFormDesc(''); setFormRef(''); setFormNetwork('');
        if (selectedUser) await fetchUserDetail(selectedUser.user.id);
        await fetchUsers();
      } else {
        setFeedback(data.error || 'Action failed.');
      }
    } catch {
      setFeedback('Connection error.');
    }
    setActionLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedUser) {
    const u = selectedUser.user;
    const b = selectedUser.balance;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '30px 38px' }}>
        <button onClick={() => setSelectedUser(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', color: 'var(--muted)', fontSize: 12, marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back to all users
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.03em' }}>{u.full_name}</h1>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>{u.email} &middot; Joined {formatDate(u.created_at)}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!u.registration_fee_paid && (
              <button className="admin-btn admin-btn-primary" onClick={() => adminAction('approve-registration-fee', { userId: u.id, paymentReference: u.registration_fee_reference || 'Admin approved' })}>
                <UserCheck size={13} /> Approve Reg Fee
              </button>
            )}
            <button className="admin-btn" onClick={() => { setModal('deposit'); setFormDesc('Deposit'); }}>
              <DollarSign size={13} /> Add Deposit
            </button>
            <button className="admin-btn" onClick={() => { setModal('interest'); setFormDesc('Interest earned'); }}>
              <Percent size={13} /> Add Interest
            </button>
            <button className="admin-btn" onClick={() => { setModal('adjust'); setFormAmount(String(b.available_balance)); setFormDesc('Admin balance adjustment'); }}>
              <Wallet size={13} /> Adjust Balance
            </button>
          </div>
        </div>

        {feedback && <div style={{ padding: '10px 14px', marginBottom: 14, borderRadius: 8, background: 'rgba(43,214,165,.08)', border: '1px solid rgba(43,214,165,.2)', color: 'var(--mint)', fontSize: 12 }}>{feedback}</div>}

        <div className="admin-stats-row">
          <div className="admin-stat-card"><span>Available Balance</span><b style={{ color: 'var(--mint)' }}>{formatCurrency(b.available_balance)}</b></div>
          <div className="admin-stat-card"><span>Total Deposited</span><b>{formatCurrency(b.total_deposited)}</b></div>
          <div className="admin-stat-card"><span>Interest Earned</span><b style={{ color: 'var(--gold)' }}>{formatCurrency(b.interest_earned)}</b></div>
          <div className="admin-stat-card"><span>Reg Fee</span><b>{u.registration_fee_paid ? <span className="badge-paid"><CheckCircle2 size={10} /> Paid</span> : <span className="badge-pending"><Clock size={10} /> Pending</span>}</b></div>
        </div>

        {/* Transactions */}
        <div className="panel" style={{ marginBottom: 14 }}>
          <div className="panel-heading"><div><div className="panel-kicker"><DollarSign size={15} /> Transaction History</div></div></div>
          <div className="holdings-table" style={{ marginTop: 14 }}>
            <div className="holdings-row holdings-header" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .8fr .8fr' }}>
              <span>Date</span><span>Description</span><span>Amount</span><span>Type</span><span>Status</span>
            </div>
            {selectedUser.transactions.length > 0 ? selectedUser.transactions.map((tx) => (
              <div key={tx.id} className="holdings-row" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .8fr .8fr' }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{formatDate(tx.created_at)}</span>
                <span><b>{tx.description}</b></span>
                <span style={{ color: tx.type === 'withdrawal' ? 'var(--red)' : 'var(--mint)' }}>{tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</span>
                <span style={{ fontSize: 10 }}>{tx.status === 'approved' ? <span className="badge-paid">Approved</span> : tx.status === 'pending' ? (
                  <span style={{ display: 'flex', gap: 4 }}>
                    <button className="admin-btn" style={{ padding: '3px 8px', fontSize: 9 }} onClick={() => adminAction('approve-transaction', { transactionId: tx.id })}>Approve</button>
                    <button className="admin-btn admin-btn-danger" style={{ padding: '3px 8px', fontSize: 9 }} onClick={() => adminAction('reject-transaction', { transactionId: tx.id })}>Reject</button>
                  </span>
                ) : <span className="badge-rejected">{tx.status}</span>}</span>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No transactions yet.</div>
            )}
          </div>
        </div>

        {/* Investments */}
        {selectedUser.investments.length > 0 && (
          <div className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-heading"><div><div className="panel-kicker"><TrendingUp size={15} /> Investments</div></div></div>
            <div className="holdings-table" style={{ marginTop: 14 }}>
              <div className="holdings-row holdings-header" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr .8fr' }}>
                <span>Plan</span><span>Invested</span><span>Current</span><span>Return</span><span>Status</span>
              </div>
              {selectedUser.investments.map((inv) => (
                <div key={inv.id} className="holdings-row" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr .8fr' }}>
                  <span><b>{inv.plan_name}</b></span>
                  <span>{formatCurrency(inv.amount_usd)}</span>
                  <span>{formatCurrency(inv.current_value)}</span>
                  <span className={inv.actual_return_pct > 0 ? 'positive' : 'muted'}>{inv.actual_return_pct > 0 ? '+' : ''}{inv.actual_return_pct}%</span>
                  <span style={{ fontSize: 10, textTransform: 'capitalize' }}>{inv.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="admin-user-modal" onClick={() => setModal(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{modal === 'deposit' ? 'Add Deposit' : modal === 'interest' ? 'Add Interest' : 'Adjust Balance'}</h3>
              <label>
                {modal === 'adjust' ? 'New Balance ($)' : 'Amount ($)'}
                <input type="number" step="0.01" min="0" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="0.00" />
              </label>
              <label>
                Description
                <input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Description" />
              </label>
              {modal === 'deposit' && (
                <>
                  <label>Payment Reference<input value={formRef} onChange={(e) => setFormRef(e.target.value)} placeholder="Transaction hash or ref" /></label>
                  <label>Network
                    <select value={formNetwork} onChange={(e) => setFormNetwork(e.target.value)}>
                      <option value="">Select network</option>
                      <option value="BEP20">BEP20</option>
                      <option value="TRC20">TRC20</option>
                      <option value="ERC20">ERC20</option>
                    </select>
                  </label>
                </>
              )}
              <div className="admin-modal-actions">
                <button className="admin-btn" onClick={() => setModal(null)}>Cancel</button>
                <button className="admin-btn admin-btn-primary" disabled={actionLoading || !formAmount} onClick={() => {
                  const amt = parseFloat(formAmount);
                  if (isNaN(amt) || (modal !== 'adjust' && amt <= 0)) return;
                  if (modal === 'deposit') adminAction('add-deposit', { userId: u.id, amount: amt, description: formDesc, paymentReference: formRef, network: formNetwork });
                  else if (modal === 'interest') adminAction('add-interest', { userId: u.id, amount: amt, description: formDesc });
                  else adminAction('adjust-balance', { userId: u.id, newBalance: amt, reason: formDesc });
                }}>
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '30px 38px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 10 }}><span className="eyebrow-line" />User Management</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.04em' }}>App Users</h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>Manage user accounts, approve payments, adjust balances, and add interest.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn" onClick={() => fetchUsers()}><RefreshCw size={13} /> Refresh</button>
          <a href="/admin/dashboard" className="admin-btn" style={{ textDecoration: 'none' }}><ArrowLeft size={13} /> Dashboard</a>
        </div>
      </div>

      {feedback && <div style={{ padding: '10px 14px', marginBottom: 14, borderRadius: 8, background: 'rgba(43,214,165,.08)', border: '1px solid rgba(43,214,165,.2)', color: 'var(--mint)', fontSize: 12 }}>{feedback}</div>}

      {stats && (
        <div className="admin-stats-row">
          <div className="admin-stat-card"><span><Users size={14} /> Total Users</span><b>{stats.total_users}</b></div>
          <div className="admin-stat-card"><span><UserCheck size={14} /> Fee Paid</span><b style={{ color: 'var(--mint)' }}>{stats.paid_users}</b></div>
          <div className="admin-stat-card"><span><Clock size={14} /> Fee Pending</span><b style={{ color: 'var(--gold)' }}>{stats.unpaid_users}</b></div>
          <div className="admin-stat-card"><span><Wallet size={14} /> Total Balances</span><b>{formatCurrency(stats.total_balances)}</b></div>
          <div className="admin-stat-card"><span><DollarSign size={14} /> Pending Txns</span><b>{stats.pending_transactions}</b></div>
        </div>
      )}

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: '0 12px', maxWidth: 400 }}>
        <Search size={14} style={{ color: 'var(--dim)' }} />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          style={{ flex: 1, border: 0, background: 'transparent', color: 'var(--text)', padding: '10px 0', fontSize: 12, outline: 'none' }}
        />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', color: 'var(--dim)' }}><X size={13} /></button>}
      </div>

      {loading ? (
        <div className="dashboard-loading"><div className="loading-spinner" /><p>Loading users...</p></div>
      ) : (
        <div>
          {filtered.map((u) => (
            <div key={u.id} className="admin-user-card">
              <div className="admin-user-header">
                <div>
                  <div className="admin-user-name">{u.full_name}</div>
                  <div className="admin-user-email">{u.email}</div>
                </div>
                <div>
                  {u.registration_fee_paid ? <span className="badge-paid"><CheckCircle2 size={10} /> Fee Paid</span> : <span className="badge-pending"><Clock size={10} /> Fee Pending</span>}
                </div>
              </div>
              <div className="admin-user-meta">
                <span>Balance: <b style={{ color: 'var(--mint)' }}>{formatCurrency(u.balance)}</b></span>
                <span>Status: <b style={{ textTransform: 'capitalize' }}>{u.status}</b></span>
                <span>Joined: <b>{formatDate(u.created_at)}</b></span>
                {u.last_login_at && <span>Last login: <b>{formatDate(u.last_login_at)}</b></span>}
              </div>
              <div className="admin-user-actions">
                <button className="admin-btn admin-btn-primary" onClick={() => fetchUserDetail(u.id)}>Manage User</button>
                {!u.registration_fee_paid && (
                  <button className="admin-btn" onClick={() => adminAction('approve-registration-fee', { userId: u.id })}>
                    <CheckCircle2 size={12} /> Approve Fee
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)', fontSize: 13 }}>
              {search ? 'No users match your search.' : 'No users registered yet.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
