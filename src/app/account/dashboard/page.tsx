'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Lock,
  Newspaper,
  PieChart,
  Send,
  ShieldCheck,
  TrendingUp,
  Unlock,
  UsersRound,
  Wallet,
  Zap,
  AlertCircle,
} from 'lucide-react';
import NotificationPanel from '@/components/NotificationPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { LanguageSwitcher, useTranslation } from '@/lib/i18n';
import FeatureWorkspace, { WorkspaceArea } from '@/components/FeatureWorkspace';

type User = { id: string; fullName: string; email: string };

interface WalletInfo {
  blockchain_network: string;
  receiving_address: string;
}

interface DashboardData {
  profile: {
    id: string; full_name: string; email: string; status: string;
    registration_fee_paid: number; created_at: string; last_login_at: string | null;
  };
  balance: {
    available_balance: number; total_deposited: number;
    total_withdrawn: number; interest_earned: number;
  };
  transactions: Array<{
    id: string; type: string; amount: number; description: string;
    payment_reference: string | null; network: string | null;
    status: string; created_at: string;
  }>;
  investments: Array<{
    id: string; plan_name: string; tier: string; risk_level: string;
    amount_usd: number; projected_return_pct: number; actual_return_pct: number;
    current_value: number; status: string; started_at: string | null; matures_at: string | null;
  }>;
  notifications: Array<{
    id: string; type: string; title: string; message: string;
    is_read: number; created_at: string;
  }>;
  wallets: WalletInfo[];
}

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentHover: '#5a2fd6', ink: '#2d2b2b', accentLight: '#f1ecff' };
const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

function LogoMark({ size = 28 }: { size?: number }) {
  const inner = Math.round(size * 0.375);
  const offset = Math.round((size - inner) / 2);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect x="1" y="1" width={size - 2} height={size - 2} stroke={C.text} strokeWidth="2" />
      <rect x={offset} y={offset} width={inner} height={inner} fill={C.accent} />
    </svg>
  );
}

const sectionTabs = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'Portfolio', label: 'Portfolio', icon: PieChart },
  { key: 'Markets', label: 'Markets', icon: BarChart3 },
  { key: 'Trade', label: 'Trade', icon: Zap },
  { key: 'Copy Trading', label: 'Copy Trading', icon: UsersRound },
  { key: 'Research', label: 'Research', icon: Newspaper },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'payments', label: 'Payments', icon: CreditCard },
];

const documents = [
  { name: 'Operating Agreement', type: 'operating_agreement', locked: false },
  { name: 'Articles of Organization', type: 'articles_of_organization', locked: false },
  { name: 'EIN Letter', type: 'ein_letter', locked: true },
  { name: 'Tax Return 2025', type: 'tax_return', locked: true },
  { name: 'Annual Report', type: 'annual_report', locked: false },
  { name: 'Trust Deed', type: 'trust_deed', locked: true },
];

const networkLabels: Record<string, { label: string; color: string }> = {
  BEP20: { label: 'BNB Smart Chain (BEP20)', color: '#f3ba2f' },
  TRC20: { label: 'Tron (TRC20)', color: '#eb0029' },
  ERC20: { label: 'Ethereum (ERC20)', color: '#627eea' },
};

const watchlistAssets = [
  { symbol: 'BTC', name: 'Bitcoin', price: 78700, change: 2.4 },
  { symbol: 'ETH', name: 'Ethereum', price: 2490, change: -1.2 },
  { symbol: 'SOL', name: 'Solana', price: 103.00, change: 5.8 },
  { symbol: 'XRP', name: 'Ripple', price: 1.40, change: 0.3 },
  { symbol: 'AVAX', name: 'Avalanche', price: 18.20, change: -0.7 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.0 },
];

const guardrailItems = [
  { title: 'Max allocation', value: '$25,000', desc: 'Per-strategy capital ceiling. Limits exposure to any single copy-trade strategy.' },
  { title: 'Stop-copy trigger', value: '-12%', desc: 'Auto-pause if drawdown exceeds threshold. Protects against extended losses.' },
  { title: 'Review cadence', value: '30 days', desc: 'Scheduled portfolio review cycle. Ensures regular assessment of active strategies.' },
];

function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function WalletCopyButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button onClick={copy} title="Copy address" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: `2px solid ${C.surface}`, background: '#fff', fontSize: 11, fontWeight: 600, fontFamily: FONT, color: copied ? C.accent : C.text, cursor: 'pointer' }}>
      {copied ? <><CheckCircle2 size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
    </button>
  );
}

function PaymentSubmissionSection({ wallets }: { wallets: WalletInfo[] }) {
  const [txHash, setTxHash] = useState('');
  const [txNetwork, setTxNetwork] = useState('BEP20');
  const [txNotes, setTxNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSubmitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!txHash.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const token = localStorage.getItem('bte-user-token');
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ action: 'submit-payment', transactionHash: txHash.trim(), network: txNetwork, notes: txNotes.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTxHash('');
        setTxNotes('');
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    }
    setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '2px solid rgba(32,30,29,0.25)', background: '#fff', fontSize: 13, fontFamily: FONT, color: C.text, boxSizing: 'border-box' };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderLeft: `4px solid ${C.accent}`, background: C.accentLight, marginBottom: 16 }}>
        <AlertCircle size={18} style={{ flex: '0 0 auto', color: C.accent, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Registration fee pending — $150</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(32,30,29,0.6)', margin: 0 }}>
            Send $150 to one of the wallet addresses below and submit your transaction hash for admin verification.
          </p>
          {wallets.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {wallets.map((w) => {
                const net = networkLabels[w.blockchain_network] || { label: w.blockchain_network, color: '#888' };
                return (
                  <div key={w.blockchain_network} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff', background: net.color }}>{w.blockchain_network}</span>
                    <code style={{ fontSize: 11, color: C.text, wordBreak: 'break-all' }}>{w.receiving_address}</code>
                    <WalletCopyButton address={w.receiving_address} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Send size={15} style={{ color: C.accent }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>Submit payment proof</span>
        </div>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={32} style={{ color: C.accent, marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Payment submitted successfully</h3>
            <p style={{ fontSize: 13, color: 'rgba(32,30,29,0.6)', lineHeight: 1.6 }}>Your transaction has been recorded and our admin team will verify it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="bte-dash-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Transaction Hash *
                <input className="bte-dash-input" type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="e.g. 0x1a2b3c..." required style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Network
                <select className="bte-dash-input" value={txNetwork} onChange={(e) => setTxNetwork(e.target.value)} style={inputStyle}>
                  <option value="BEP20">BEP20 (BNB Smart Chain)</option>
                  <option value="TRC20">TRC20 (Tron)</option>
                  <option value="ERC20">ERC20 (Ethereum)</option>
                </select>
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Notes (optional)
              <input className="bte-dash-input" type="text" value={txNotes} onChange={(e) => setTxNotes(e.target.value)} placeholder="Any additional details" style={inputStyle} />
            </label>
            {submitError && <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#c0392b', margin: 0 }}><AlertCircle size={12} /> {submitError}</p>}
            <button type="submit" className="bte-dash-submit" disabled={submitting || !txHash.trim()} style={{ width: '100%', padding: '14px 0', border: 'none', background: C.accent, color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: FONT, cursor: 'pointer', textAlign: 'center', opacity: (submitting || !txHash.trim()) ? 0.5 : 1, transition: 'background 0.15s' }}>
              {submitting ? 'Submitting...' : 'Submit for verification'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('bte-user');
      return stored ? JSON.parse(stored) as User : null;
    } catch { return null; }
  });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [workspaceNotice, setWorkspaceNotice] = useState('');
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();

  const fetchDashboard = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/user?section=dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('bte-user-token');
      const userData = localStorage.getItem('bte-user');
      if (!token || !userData) { router.push('/account'); return; }
      window.setTimeout(() => { void fetchDashboard(token); }, 0);
    } catch { router.push('/account'); }
  }, [router, fetchDashboard]);

  const handleSignOut = () => {
    localStorage.removeItem('bte-user-token');
    localStorage.removeItem('bte-user');
    router.push('/account');
  };

  if (!user) return null;

  const balance = data?.balance || { available_balance: 0, total_deposited: 0, total_withdrawn: 0, interest_earned: 0 };
  const feeStatus = data?.profile?.registration_fee_paid ? 'paid' : 'pending';
  const totalPortfolio = balance.available_balance + (data?.investments?.reduce((sum, inv) => sum + (inv.status === 'active' ? inv.current_value : 0), 0) || 0);
  const workspaceAreas: WorkspaceArea[] = ['Portfolio', 'Markets', 'Trade', 'Research', 'Copy Trading', 'Balances', 'Reports', 'Security center', 'Settings', 'Help center'];
  const isWorkspaceArea = workspaceAreas.includes(activeSection as WorkspaceArea);
  const wallets = data?.wallets || [];
  const initials = user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', borderBottom: `2px solid ${C.surface}` };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${C.surface}` };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" />
      <style>{`
        .bte-dash-nav a:hover { color: ${C.accent} !important; }
        .bte-dash-tab:hover { color: ${C.text} !important; background: ${C.accentLight} !important; }
        .bte-dash-input:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px rgba(106,61,240,0.18); }
        .bte-dash-submit:hover:not(:disabled) { background: ${C.accentHover} !important; }
        @keyframes bte-spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .bte-dash-stats { grid-template-columns: 1fr 1fr !important; }
          .bte-dash-2col { grid-template-columns: 1fr !important; }
          .bte-dash-3col { grid-template-columns: 1fr !important; }
          .bte-dash-content { padding: 24px 16px !important; }
          .bte-dash-hero { padding: 24px 16px !important; }
          .bte-dash-nav-main { padding: 0 16px !important; }
          .bte-dash-topnav { padding: 0 16px !important; }
          .bte-dash-footer { padding: 24px 16px !important; flex-direction: column; gap: 12px !important; align-items: flex-start !important; }
          .bte-dash-form-row { grid-template-columns: 1fr !important; }
          .bte-dash-nav-right { display: none !important; }
        }
        @media (max-width: 600px) {
          .bte-dash-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main style={{ minHeight: '100vh', fontFamily: FONT, color: C.text, background: C.bg }}>
        {/* Nav */}
        <nav className="bte-dash-topnav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: `2px solid ${C.surface}` }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
            <LogoMark />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</div>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.45)' }}>Enterprise markets</div>
            </div>
          </Link>
          <div className="bte-dash-nav bte-dash-nav-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/#strategies" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(32,30,29,0.6)', textDecoration: 'none' }}>Strategies</Link>
            <Link href="/academy" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(32,30,29,0.6)', textDecoration: 'none' }}>Academy</Link>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: `2px solid ${C.accent}`, padding: '4px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.accent }}>Paper mode</span>
            <NotificationPanel />
            <LanguageSwitcher locale={locale} setLocale={setLocale} />
            <ThemeToggle />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: C.accent, color: '#fff', fontSize: 11, fontWeight: 800 }}>{initials}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{user.fullName}</span>
            </div>
            <button onClick={handleSignOut} style={{ padding: '6px 12px', border: `2px solid ${C.surface}`, background: 'transparent', fontSize: 11, fontWeight: 600, fontFamily: FONT, color: 'rgba(32,30,29,0.6)', cursor: 'pointer' }}>Sign out</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="bte-dash-hero" style={{ padding: '32px 48px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.45)', margin: '0 0 8px' }}>
            {t('section.account')} / {activeSection === 'documents' ? t('dashboard.document_vault') : activeSection === 'payments' ? t('dashboard.payment_history') : t('dashboard.title')}
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: '-0.01em' }}>
            {activeSection === 'documents' ? 'Document Vault' : activeSection === 'payments' ? 'Payment History' : <>Welcome back, <span style={{ color: C.accent }}>{user.fullName.split(' ')[0]}.</span></>}
          </h1>
          {activeSection === 'overview' && (
            <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(32,30,29,0.55)', maxWidth: 460 }}>
              Your account overview and active services.{feeStatus === 'paid' ? ' All systems operational.' : ''}
            </p>
          )}
        </section>

        <div style={{ borderTop: `2px solid ${C.surface}` }} />

        {/* Tab bar */}
        <div className="bte-dash-nav-main" style={{ padding: '0 48px', maxWidth: 1200, margin: '0 auto', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${C.surface}` }}>
            {sectionTabs.map((tab) => {
              const active = activeSection === tab.key;
              return (
                <button
                  key={tab.key}
                  className={active ? '' : 'bte-dash-tab'}
                  onClick={() => setActiveSection(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px',
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
                    border: 'none', borderBottom: active ? `2px solid ${C.accent}` : '2px solid transparent',
                    marginBottom: -2, cursor: 'pointer', fontFamily: FONT,
                    background: 'transparent', color: active ? C.accent : 'rgba(32,30,29,0.5)',
                    whiteSpace: 'nowrap', transition: 'color 0.15s',
                  }}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bte-dash-content" style={{ padding: '32px 48px', maxWidth: 1200, margin: '0 auto' }}>

          {feeStatus === 'pending' && activeSection === 'overview' && <PaymentSubmissionSection wallets={wallets} />}

          {isWorkspaceArea ? (
            <div className="terminal-shell" style={{ background: 'transparent', minHeight: 400 }}>
              <section className="workspace" style={{ background: 'transparent' }}>
                <div className="content-wrap" style={{ padding: 0 }}>
                  <FeatureWorkspace area={activeSection as WorkspaceArea} onNotify={setWorkspaceNotice} onOpenOrder={() => setActiveSection('Trade')} />
                  {workspaceNotice && (
                    <div onClick={() => setWorkspaceNotice('')} style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 35, maxWidth: 320, padding: '12px 16px', border: `2px solid ${C.surface}`, background: C.accentLight, color: C.text, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {workspaceNotice}
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(32,30,29,0.4)' }}>
              <div style={{ width: 28, height: 28, border: `3px solid ${C.surface}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'bte-spin 0.7s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13 }}>Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* ===== OVERVIEW ===== */}
              {activeSection === 'overview' && (
                <>
                  {/* 4-up stat cards */}
                  <div className="bte-dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: C.surface, marginBottom: 24 }}>
                    <div style={{ background: '#fff', padding: '20px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Wallet size={14} /> Total Portfolio
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatCurrency(totalPortfolio)}</div>
                      <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.45)', marginTop: 6 }}>
                        {balance.interest_earned > 0 && <span style={{ color: C.accent }}><ArrowUpRight size={12} style={{ verticalAlign: '-2px' }} /> {formatCurrency(balance.interest_earned)} interest</span>}
                      </div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DollarSign size={14} /> Available Balance
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: C.accent }}>{formatCurrency(balance.available_balance)}</div>
                      <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.45)', marginTop: 6 }}>Deposited: {formatCurrency(balance.total_deposited)}</div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendingUp size={14} /> Active Investments
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{data?.investments?.filter(i => i.status === 'active').length || 0}</div>
                      <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.45)', marginTop: 6 }}>{formatCurrency(data?.investments?.filter(i => i.status === 'active').reduce((s, i) => s + i.current_value, 0) || 0)} invested</div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck size={14} /> Account Status
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, color: feeStatus === 'paid' ? C.accent : 'rgba(32,30,29,0.6)' }}>
                        {feeStatus === 'paid' ? <><CheckCircle2 size={18} /> Active</> : <><Clock size={18} /> Pending</>}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.45)', marginTop: 6 }}>Since {data?.profile?.created_at ? formatDate(data.profile.created_at) : '—'}</div>
                    </div>
                  </div>

                  {/* 2-col: dark-ink strategy + watchlist */}
                  <div className="bte-dash-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: C.surface, marginBottom: 24 }}>
                    <div style={{ background: C.ink, color: '#fff', padding: '28px 24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Featured strategy</span>
                          <h3 style={{ fontSize: 22, fontWeight: 800, margin: '6px 0 0', letterSpacing: '-0.02em' }}>Atlas Balanced</h3>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Multi-asset · Medium risk</p>
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>+14.2%</span>
                      </div>
                      <svg width="100%" height="80" viewBox="0 0 300 80" fill="none" style={{ display: 'block', marginBottom: 20 }}>
                        <defs>
                          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.accent} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <polygon points="0,65 30,58 60,52 90,55 120,42 150,38 180,30 210,35 240,22 270,18 300,12 300,80 0,80" fill="url(#chartFill)" />
                        <polyline points="0,65 30,58 60,52 90,55 120,42 150,38 180,30 210,35 240,22 270,18 300,12" stroke={C.accent} strokeWidth="2" fill="none" />
                      </svg>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 16 }}>
                        <div>
                          <div style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>AUM</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>$2.4M</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Max DD</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>-8.2%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Sharpe</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>1.87</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#fff', padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>Watchlist</span>
                        <span style={{ fontSize: 10, color: 'rgba(32,30,29,0.35)' }}>Illustrative snapshot</span>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ ...thStyle, padding: '8px 0' }}>Asset</th>
                            <th style={{ ...thStyle, padding: '8px 0', textAlign: 'right' }}>Price</th>
                            <th style={{ ...thStyle, padding: '8px 0', textAlign: 'right' }}>24h</th>
                          </tr>
                        </thead>
                        <tbody>
                          {watchlistAssets.map((a) => (
                            <tr key={a.symbol}>
                              <td style={{ ...tdStyle, padding: '10px 0' }}>
                                <span style={{ fontWeight: 700 }}>{a.symbol}</span>
                                <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(32,30,29,0.45)' }}>{a.name}</span>
                              </td>
                              <td style={{ ...tdStyle, padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>
                                ${a.price.toLocaleString('en-US', { minimumFractionDigits: a.price < 10 ? 2 : 0 })}
                              </td>
                              <td style={{ ...tdStyle, padding: '10px 0', textAlign: 'right', fontWeight: 600, color: a.change > 0 ? C.accent : a.change < 0 ? '#c0392b' : 'rgba(32,30,29,0.45)' }}>
                                {a.change > 0 ? '+' : ''}{a.change.toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3-up guardrails */}
                  <div className="bte-dash-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: C.surface, marginBottom: 24 }}>
                    {guardrailItems.map((g) => (
                      <div key={g.title} style={{ background: '#fff', padding: 20 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>{g.title}</span>
                        <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 6px', letterSpacing: '-0.02em' }}>{g.value}</div>
                        <p style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(32,30,29,0.5)', margin: 0 }}>{g.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Investments */}
                  {data?.investments && data.investments.length > 0 ? (
                    <div style={{ background: '#fff', border: `2px solid ${C.surface}`, marginBottom: 24, overflowX: 'auto' }}>
                      <div style={{ padding: '16px 20px', borderBottom: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingUp size={15} style={{ color: C.accent }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>Active investments</span>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={thStyle}>Plan</th><th style={thStyle}>Invested</th><th style={thStyle}>Current Value</th><th style={thStyle}>Return</th><th style={thStyle}>Status</th></tr></thead>
                        <tbody>
                          {data.investments.map((inv) => (
                            <tr key={inv.id}>
                              <td style={tdStyle}><div style={{ fontWeight: 600 }}>{inv.plan_name}</div><div style={{ fontSize: 11, color: 'rgba(32,30,29,0.45)' }}>{inv.risk_level} risk</div></td>
                              <td style={tdStyle}>{formatCurrency(inv.amount_usd)}</td>
                              <td style={{ ...tdStyle, color: inv.current_value > inv.amount_usd ? C.accent : C.text }}>{formatCurrency(inv.current_value)}</td>
                              <td style={{ ...tdStyle, color: inv.actual_return_pct > 0 ? C.accent : 'rgba(32,30,29,0.5)' }}>{inv.actual_return_pct > 0 ? '+' : ''}{inv.actual_return_pct}%</td>
                              <td style={tdStyle}><span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '3px 8px', background: inv.status === 'active' ? C.accentLight : C.surface, color: inv.status === 'active' ? C.accent : 'rgba(32,30,29,0.5)' }}>{inv.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ background: '#fff', border: `2px solid ${C.surface}`, marginBottom: 24, padding: '48px 20px', textAlign: 'center' }}>
                      <TrendingUp size={24} style={{ color: 'rgba(32,30,29,0.2)', marginBottom: 12 }} />
                      <p style={{ fontSize: 13, color: 'rgba(32,30,29,0.4)', margin: 0 }}>No active investments yet.</p>
                    </div>
                  )}

                  {/* Documents */}
                  <div style={{ background: '#fff', border: `2px solid ${C.surface}`, marginBottom: 24, overflowX: 'auto' }}>
                    <div style={{ padding: '16px 20px', borderBottom: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={15} style={{ color: C.accent }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>{t('dashboard.document_vault')}</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr><th style={{ ...thStyle, width: 36 }}></th><th style={thStyle}>Document</th><th style={thStyle}>Type</th><th style={thStyle}>Access</th></tr></thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.type}>
                            <td style={{ ...tdStyle, color: doc.locked ? 'rgba(32,30,29,0.25)' : C.accent }}>{doc.locked ? <Lock size={14} /> : <Unlock size={14} />}</td>
                            <td style={{ ...tdStyle, fontWeight: 600 }}>{doc.name}</td>
                            <td style={{ ...tdStyle, fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{doc.type.replace(/_/g, ' ')}</td>
                            <td style={{ ...tdStyle, fontSize: 11, fontWeight: 600, color: doc.locked ? 'rgba(32,30,29,0.3)' : C.accent }}>{doc.locked ? 'Locked' : 'Available'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Transactions */}
                  <div style={{ background: '#fff', border: `2px solid ${C.surface}`, marginBottom: 24, overflowX: 'auto' }}>
                    <div style={{ padding: '16px 20px', borderBottom: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CreditCard size={15} style={{ color: C.accent }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>{t('dashboard.payment_history')}</span>
                    </div>
                    {data?.transactions && data.transactions.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Description</th><th style={thStyle}>Amount</th><th style={thStyle}>Type</th><th style={thStyle}>Status</th></tr></thead>
                        <tbody>
                          {data.transactions.map((tx) => (
                            <tr key={tx.id}>
                              <td style={{ ...tdStyle, fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{formatDate(tx.created_at)}</td>
                              <td style={{ ...tdStyle, fontWeight: 600 }}>{tx.description}</td>
                              <td style={{ ...tdStyle, color: tx.type === 'withdrawal' ? '#c0392b' : C.accent }}>{tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}</td>
                              <td style={{ ...tdStyle, fontSize: 11, color: 'rgba(32,30,29,0.5)', textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</td>
                              <td style={tdStyle}>
                                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '3px 8px', background: tx.status === 'confirmed' || tx.status === 'approved' ? C.accentLight : tx.status === 'pending' ? '#fff' : C.surface, color: tx.status === 'confirmed' || tx.status === 'approved' ? C.accent : tx.status === 'pending' ? C.text : 'rgba(32,30,29,0.5)', border: tx.status === 'pending' ? `2px solid ${C.surface}` : 'none' }}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(32,30,29,0.4)', fontSize: 13 }}>No transactions yet.</div>
                    )}
                  </div>
                </>
              )}

              {/* ===== DOCUMENTS ===== */}
              {activeSection === 'documents' && (
                <div style={{ background: '#fff', border: `2px solid ${C.surface}`, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={{ ...thStyle, width: 36 }}></th><th style={thStyle}>Document</th><th style={thStyle}>Type</th><th style={thStyle}>Access</th></tr></thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.type}>
                          <td style={{ ...tdStyle, color: doc.locked ? 'rgba(32,30,29,0.25)' : C.accent }}>{doc.locked ? <Lock size={14} /> : <Unlock size={14} />}</td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{doc.name}</td>
                          <td style={{ ...tdStyle, fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{doc.type.replace(/_/g, ' ')}</td>
                          <td style={{ ...tdStyle, fontSize: 11, fontWeight: 600, color: doc.locked ? 'rgba(32,30,29,0.3)' : C.accent }}>{doc.locked ? 'Locked' : 'Available'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ===== PAYMENTS ===== */}
              {activeSection === 'payments' && (
                <>
                  {wallets.length > 0 && (
                    <div className="bte-dash-3col" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(wallets.length, 3)}, 1fr)`, gap: 2, background: C.surface, marginBottom: 24 }}>
                      {wallets.map((w) => {
                        const net = networkLabels[w.blockchain_network] || { label: w.blockchain_network, color: '#888' };
                        return (
                          <div key={w.blockchain_network} style={{ background: '#fff', padding: 20, borderTop: `4px solid ${net.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                              <span style={{ width: 8, height: 8, background: net.color, display: 'inline-block' }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{net.label}</div>
                                <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.45)' }}>{w.blockchain_network} Network</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 4 }}>Deposit Address</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <code style={{ fontSize: 10, wordBreak: 'break-all', color: C.text, flex: 1 }}>{w.receiving_address}</code>
                              <WalletCopyButton address={w.receiving_address} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(32,30,29,0.45)', marginBottom: 24 }}>
                    <AlertCircle size={12} /> Only send the specified cryptocurrency on the correct network.
                  </p>
                  <div style={{ background: '#fff', border: `2px solid ${C.surface}`, overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Description</th><th style={thStyle}>Amount</th><th style={thStyle}>Type</th><th style={thStyle}>Status</th></tr></thead>
                      <tbody>
                        {data?.transactions && data.transactions.length > 0 ? data.transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td style={{ ...tdStyle, fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{formatDate(tx.created_at)}</td>
                            <td style={{ ...tdStyle, fontWeight: 600 }}>{tx.description}</td>
                            <td style={{ ...tdStyle, color: tx.type === 'withdrawal' ? '#c0392b' : C.accent }}>{tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}</td>
                            <td style={{ ...tdStyle, fontSize: 11, color: 'rgba(32,30,29,0.5)', textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</td>
                            <td style={tdStyle}>
                              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '3px 8px', background: tx.status === 'confirmed' || tx.status === 'approved' ? C.accentLight : C.surface, color: tx.status === 'confirmed' || tx.status === 'approved' ? C.accent : 'rgba(32,30,29,0.5)' }}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: '48px 16px', color: 'rgba(32,30,29,0.4)' }}>No transactions yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="bte-dash-footer" style={{ borderTop: `2px solid ${C.surface}`, padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark size={24} />
            <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(32,30,29,0.4)' }}>
            <ShieldCheck size={14} /> Secure session · Paper mode · No guaranteed returns
          </span>
          <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: C.text, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            BTE home <ChevronRight size={14} />
          </Link>
        </footer>
      </main>
    </>
  );
}
