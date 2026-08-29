'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  Eye,
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
} from 'lucide-react';
import NotificationPanel from '@/components/NotificationPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { LanguageSwitcher, useTranslation } from '@/lib/i18n';

type User = { id: string; fullName: string; email: string };

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

const mockPayments = [
  { id: 'pay-1', date: 'Aug 24, 2026', description: 'Formation Package', amount: '$499.00', status: 'Confirmed', network: 'BEP20' },
  { id: 'pay-2', date: 'Jul 15, 2026', description: 'Annual Report Filing', amount: '$52.00', status: 'Confirmed', network: 'TRC20' },
  { id: 'pay-3', date: 'Jun 01, 2026', description: 'Registered Agent (Annual)', amount: '$149.00', status: 'Confirmed', network: 'ERC20' },
  { id: 'pay-4', date: 'May 12, 2026', description: 'Copy Trading Subscription', amount: '$29.00', status: 'Pending', network: 'BEP20' },
];

const mockSubscriptions = [
  { name: 'Atlas Balanced', manager: 'BTE Research Desk', return30d: '+18.4%', status: 'Active', allocation: '$12,500' },
  { name: 'Signal & Carry', manager: 'BTE Systematic', return30d: '+12.1%', status: 'Active', allocation: '$8,200' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();

  useEffect(() => {
    try {
      const token = localStorage.getItem('bte-user-token');
      const userData = localStorage.getItem('bte-user');
      if (!token || !userData) {
        router.push('/account');
        return;
      }
      setUser(JSON.parse(userData));
    } catch {
      router.push('/account');
    }
  }, [router]);

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

  return (
    <main className="terminal-shell">
      <aside className={`sidebar ${sideOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span /></div>
          <div><strong>Blockchain Trust</strong><small>Enterprise Markets</small></div>
        </div>
        <button className="account-switcher">
          <span className="account-avatar">{initials}</span>
          <span><b>{user.fullName}</b><small>{t('common.paper_account')} · USD</small></span>
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

          {/* Portfolio Overview */}
          <section className="metric-grid">
            <div className="metric-card metric-card-featured">
              <div className="metric-label">{t('common.total_value')} <Eye size={15} /></div>
              <div className="metric-value">$284,619.42</div>
              <div className="metric-foot">
                <span className="positive"><ArrowUpRight size={14} />$6,842.18 (2.46%)</span>
                <span>{t('common.today')}</span>
              </div>
              <div className="metric-orbit orbit-one" />
              <div className="metric-orbit orbit-two" />
            </div>
            <div className="metric-card">
              <div className="metric-label">{t('common.unrealized_pnl')} <TrendingUp size={15} /></div>
              <div className="metric-value" style={{ color: 'var(--mint)' }}>+$24,882.64</div>
              <div className="metric-foot">
                <span className="positive"><ArrowUpRight size={14} />8.74%</span>
                <span>{t('common.since_inception')}</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">{t('section.portfolio_allocation')} <PieChart size={15} /></div>
              <div className="metric-value">4 classes</div>
              <div className="metric-foot">
                <span className="muted">Equities 48.2%</span>
                <span className="muted">Digital 31.7%</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">{t('common.available_invest')} <Wallet size={15} /></div>
              <div className="metric-value">$68,420.00</div>
              <div className="metric-foot">
                <span className="muted">{t('common.buying_power')}</span>
                <span className="positive">100%</span>
              </div>
            </div>
          </section>

          {/* Active Subscriptions */}
          <section className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-heading">
              <div>
                <div className="panel-kicker"><UsersRound size={15} />{t('dashboard.active_subscriptions')}</div>
                <div className="panel-title">Copy trading strategies</div>
              </div>
              <a href="/" className="full-link">{t('btn.view_all')} <ChevronRight size={14} /></a>
            </div>
            <div className="holdings-table" style={{ marginTop: 17 }}>
              <div className="holdings-row holdings-header" style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr .8fr' }}>
                <span>Strategy</span><span>Manager</span><span>30d return</span><span>Allocation</span><span>Status</span>
              </div>
              {mockSubscriptions.map((sub) => (
                <div key={sub.name} className="holdings-row" style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr .8fr' }}>
                  <span><b>{sub.name}</b></span>
                  <span>{sub.manager}</span>
                  <span className="positive"><ArrowUpRight size={12} />{sub.return30d}</span>
                  <span>{sub.allocation}</span>
                  <span className="positive">{sub.status}</span>
                </div>
              ))}
            </div>
          </section>

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

          {/* Payment History */}
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
                  <span>Date</span><span>Description</span><span>Amount</span><span>Network</span><span>Status</span>
                </div>
                {mockPayments.map((pay) => (
                  <div key={pay.id} className="holdings-row" style={{ gridTemplateColumns: '1fr 1.4fr 1fr .8fr .8fr' }}>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{pay.date}</span>
                    <span><b>{pay.description}</b></span>
                    <span>{pay.amount}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{pay.network}</span>
                    <span className={pay.status === 'Confirmed' ? 'positive' : 'pending'} style={{ fontSize: 10 }}>
                      {pay.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="workspace-footer">
            <span><ShieldCheck size={14} />Secure session · Protected by BTE TrustLayer</span>
            <span>Paper account · Data is simulated · &copy; 2026 Blockchain Trust Enterprise</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
