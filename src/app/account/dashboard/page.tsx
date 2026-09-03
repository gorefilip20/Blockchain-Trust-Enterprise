'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Lock,
  Menu,
  MoreHorizontal,
  Newspaper,
  PieChart,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Unlock,
  UsersRound,
  Wallet,
  X,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import NotificationPanel from '@/components/NotificationPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { LanguageSwitcher, useTranslation } from '@/lib/i18n';

type User = { id: string; fullName: string; email: string };

interface DashboardData {
  profile: {
    id: string;
    full_name: string;
    email: string;
    status: string;
    registration_fee_paid: number;
    created_at: string;
    last_login_at: string | null;
  };
  balance: {
    available_balance: number;
    total_deposited: number;
    total_withdrawn: number;
    interest_earned: number;
  };
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    payment_reference: string | null;
    network: string | null;
    status: string;
    created_at: string;
  }>;
  investments: Array<{
    id: string;
    plan_name: string;
    tier: string;
    risk_level: string;
    amount_usd: number;
    projected_return_pct: number;
    actual_return_pct: number;
    current_value: number;
    status: string;
    started_at: string | null;
    matures_at: string | null;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: number;
    created_at: string;
  }>;
}

const navItems = [
  { label: 'Overview', key: 'nav.overview', icon: LayoutDashboard },
  { label: 'Portfolio', key: 'nav.portfolio', icon: PieChart },
  { label: 'Markets', key: 'nav.markets', icon: BarChart3 },
  { label: 'Trade', key: 'nav.trade', icon: Zap },
  { label: 'Research', key: 'nav.research', icon: Newspaper },
  { label: 'Copy Trading', key: 'nav.copy_trading', icon: UsersRound },
];

const documents = [
  { name: 'Operating Agreement', type: 'operating_agreement', locked: false },
  { name: 'Articles of Organization', type: 'articles_of_organization', locked: false },
  { name: 'EIN Letter', type: 'ein_letter', locked: true },
  { name: 'Tax Return 2025', type: 'tax_return', locked: true },
  { name: 'Annual Report', type: 'annual_report', locked: false },
  { name: 'Trust Deed', type: 'trust_deed', locked: true },
];

function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusColor(status: string): string {
  switch (status) {
    case 'approved': case 'active': case 'confirmed': return 'positive';
    case 'pending': return 'pending';
    case 'rejected': case 'cancelled': case 'failed': return 'negative';
    default: return 'muted';
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sideOpen, setSideOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();

  const fetchDashboard = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/user?section=dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('bte-user-token');
      const userData = localStorage.getItem('bte-user');
      if (!token || !userData) {
        router.push('/account');
        return;
      }
      setUser(JSON.parse(userData));
      fetchDashboard(token);
    } catch {
      router.push('/account');
    }
  }, [router, fetchDashboard]);

  const handleSignOut = () => {
    localStorage.removeItem('bte-user-token');
    localStorage.removeItem('bte-user');
    router.push('/account');
  };

  if (!user) return null;

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const balance = data?.balance || { available_balance: 0, total_deposited: 0, total_withdrawn: 0, interest_earned: 0 };
  const feeStatus = data?.profile?.registration_fee_paid ? 'paid' : 'pending';
  const totalPortfolio = balance.available_balance + (data?.investments?.reduce((sum, inv) => sum + (inv.status === 'active' ? inv.current_value : 0), 0) || 0);

  return (
    <main className="terminal-shell">
      <aside className={`sidebar ${sideOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span /></div>
          <div><strong>Blockchain Trust</strong><small>Enterprise Markets</small></div>
        </div>
        <button className="account-switcher">
          <span className="account-avatar">{initials}</span>
          <span><b>{user.fullName}</b><small>{t('common.paper_account')} &middot; USD</small></span>
          <ChevronDown size={15} />
        </button>

        <nav className="main-nav" aria-label="Dashboard navigation">
          <div className="nav-caption">{t('section.workspace')}</div>
          {navItems.map(({ label, key, icon: Icon }) => (
            <a key={label} className="nav-item" href="/" style={{ textDecoration: 'none' }}>
              <Icon size={17} /><span>{t(key)}</span>
            </a>
          ))}
          <div className="nav-caption nav-caption-spaced">{t('section.account')}</div>
          <button className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
            <LayoutDashboard size={17} /><span>{t('dashboard.title')}</span>
          </button>
          <button className={`nav-item ${activeSection === 'documents' ? 'active' : ''}`} onClick={() => setActiveSection('documents')}>
            <FileText size={17} /><span>{t('dashboard.document_vault')}</span>
          </button>
          <button className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`} onClick={() => setActiveSection('payments')}>
            <CreditCard size={17} /><span>{t('dashboard.payment_history')}</span>
          </button>
          <button className="nav-item" onClick={() => setSideOpen(false)}>
            <Settings2 size={17} /><span>{t('nav.settings')}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="live-status"><span className="status-dot" />{t('common.all_systems_operational')}</div>
          <div className="sidebar-controls">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} setLocale={setLocale} />
          </div>
          <div className="profile-row" style={{ cursor: 'pointer' }} onClick={handleSignOut}>
            <div className="profile-avatar">{initials}</div>
            <div><b>{user.fullName}</b><small>{t('btn.sign_out')}</small></div>
            <MoreHorizontal size={17} />
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSideOpen((v) => !v)} aria-label="Toggle navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>{t('section.account')}</span><ChevronRight size={14} /><b>{t('dashboard.title')}</b></div>
          <div className="topbar-actions">
            <NotificationPanel />
          </div>
        </header>

        <div className="content-wrap">
          <div className="welcome-row">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" />{t('dashboard.title').toUpperCase()}</p>
              <h1>Welcome back, {user.fullName.split(' ')[0]}.</h1>
              <p className="subtitle">Your account overview and active services.</p>
            </div>
          </div>

          {/* Registration Fee Alert */}
          {feeStatus === 'pending' && (
            <div className="dashboard-alert">
              <AlertCircle size={18} />
              <div>
                <strong>Registration fee pending</strong>
                <p>Your $150 registration fee has not been confirmed yet. Please submit payment and provide your reference to the admin for verification.</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loading">
              <div className="loading-spinner" />
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Portfolio Overview */}
              <section className="metric-grid">
                <div className="metric-card metric-card-featured">
                  <div className="metric-label">Total Portfolio Value <Wallet size={15} /></div>
                  <div className="metric-value">{formatCurrency(totalPortfolio)}</div>
                  <div className="metric-foot">
                    <span className={balance.interest_earned > 0 ? 'positive' : 'muted'}>
                      {balance.interest_earned > 0 && <ArrowUpRight size={14} />}
                      {formatCurrency(balance.interest_earned)} interest
                    </span>
                    <span>Total earned</span>
                  </div>
                  <div className="metric-orbit orbit-one" />
                  <div className="metric-orbit orbit-two" />
                </div>
                <div className="metric-card">
                  <div className="metric-label">Available Balance <DollarSign size={15} /></div>
                  <div className="metric-value" style={{ color: 'var(--mint)' }}>{formatCurrency(balance.available_balance)}</div>
                  <div className="metric-foot">
                    <span className="muted">Deposited: {formatCurrency(balance.total_deposited)}</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Active Investments <TrendingUp size={15} /></div>
                  <div className="metric-value">{data?.investments?.filter(i => i.status === 'active').length || 0}</div>
                  <div className="metric-foot">
                    <span className="muted">{formatCurrency(data?.investments?.filter(i => i.status === 'active').reduce((s, i) => s + i.current_value, 0) || 0)} invested</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Account Status <ShieldCheck size={15} /></div>
                  <div className="metric-value" style={{ fontSize: 20 }}>
                    {feeStatus === 'paid' ? (
                      <span className="positive" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={20} /> Active</span>
                    ) : (
                      <span className="pending" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={20} /> Pending</span>
                    )}
                  </div>
                  <div className="metric-foot">
                    <span className="muted">Since {data?.profile?.created_at ? formatDate(data.profile.created_at) : 'N/A'}</span>
                  </div>
                </div>
              </section>

              {/* Active Investments */}
              {(data?.investments && data.investments.length > 0) && (
                <section className="panel" style={{ marginBottom: 14 }}>
                  <div className="panel-heading">
                    <div>
                      <div className="panel-kicker"><TrendingUp size={15} />Active Investments</div>
                      <div className="panel-title">Your investment plans</div>
                    </div>
                  </div>
                  <div className="holdings-table" style={{ marginTop: 17 }}>
                    <div className="holdings-row holdings-header" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr .8fr' }}>
                      <span>Plan</span><span>Invested</span><span>Current Value</span><span>Return</span><span>Status</span>
                    </div>
                    {data.investments.map((inv) => (
                      <div key={inv.id} className="holdings-row" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr .8fr' }}>
                        <span><b>{inv.plan_name}</b><br /><small style={{ color: 'var(--muted)', fontSize: 10 }}>{inv.risk_level} risk</small></span>
                        <span>{formatCurrency(inv.amount_usd)}</span>
                        <span style={{ color: inv.current_value > inv.amount_usd ? 'var(--mint)' : 'var(--text)' }}>{formatCurrency(inv.current_value)}</span>
                        <span className={inv.actual_return_pct > 0 ? 'positive' : 'muted'}>
                          {inv.actual_return_pct > 0 && <ArrowUpRight size={12} />}
                          {inv.actual_return_pct > 0 ? '+' : ''}{inv.actual_return_pct}%
                        </span>
                        <span className={statusColor(inv.status)} style={{ fontSize: 10, textTransform: 'capitalize' }}>{inv.status}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state for investments */}
              {(!data?.investments || data.investments.length === 0) && (activeSection === 'overview') && (
                <section className="panel" style={{ marginBottom: 14 }}>
                  <div className="panel-heading">
                    <div>
                      <div className="panel-kicker"><TrendingUp size={15} />Investments</div>
                      <div className="panel-title">No active investments</div>
                    </div>
                  </div>
                  <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                    <p>You have no active investments yet. Contact an administrator to explore investment opportunities.</p>
                  </div>
                </section>
              )}

              {/* Document Vault */}
              {(activeSection === 'overview' || activeSection === 'documents') && (
                <section className="panel" style={{ marginBottom: 14 }}>
                  <div className="panel-heading">
                    <div>
                      <div className="panel-kicker"><FileText size={15} />{t('dashboard.document_vault')}</div>
                      <div className="panel-title">Available documents</div>
                    </div>
                  </div>
                  <div className="holdings-table" style={{ marginTop: 17 }}>
                    <div className="holdings-row holdings-header" style={{ gridTemplateColumns: '24px 1.8fr 1fr .6fr' }}>
                      <span></span><span>Document</span><span>Type</span><span>Access</span>
                    </div>
                    {documents.map((doc) => (
                      <div key={doc.type} className="holdings-row" style={{ gridTemplateColumns: '24px 1.8fr 1fr .6fr', cursor: 'pointer' }}>
                        <span style={{ color: doc.locked ? 'var(--dim)' : 'var(--mint)' }}>
                          {doc.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </span>
                        <span><b>{doc.name}</b></span>
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>{doc.type.replace(/_/g, ' ')}</span>
                        <span style={{ fontSize: 10, color: doc.locked ? 'var(--dim)' : 'var(--mint)' }}>
                          {doc.locked ? 'Locked' : 'Available'}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Transaction History */}
              {(activeSection === 'overview' || activeSection === 'payments') && (
                <section className="panel" style={{ marginBottom: 14 }}>
                  <div className="panel-heading">
                    <div>
                      <div className="panel-kicker"><CreditCard size={15} />{t('dashboard.payment_history')}</div>
                      <div className="panel-title">Transaction records</div>
                    </div>
                  </div>
                  <div className="holdings-table" style={{ marginTop: 17 }}>
                    <div className="holdings-row holdings-header" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .8fr .8fr' }}>
                      <span>Date</span><span>Description</span><span>Amount</span><span>Type</span><span>Status</span>
                    </div>
                    {data?.transactions && data.transactions.length > 0 ? (
                      data.transactions.map((tx) => (
                        <div key={tx.id} className="holdings-row" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .8fr .8fr' }}>
                          <span style={{ fontSize: 10, color: 'var(--muted)' }}>{formatDate(tx.created_at)}</span>
                          <span><b>{tx.description}</b></span>
                          <span style={{ color: tx.type === 'withdrawal' ? 'var(--red, #ef4444)' : 'var(--mint)' }}>
                            {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</span>
                          <span className={statusColor(tx.status)} style={{ fontSize: 10, textTransform: 'capitalize' }}>
                            {tx.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                        <p>No transactions yet.</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}

          <footer className="workspace-footer">
            <span><ShieldCheck size={14} />Secure session &middot; Protected by BTE TrustLayer</span>
            <span>&copy; 2026 Blockchain Trust Enterprise</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
