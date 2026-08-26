'use client';

import { useEffect, useMemo, useState } from 'react';
import FeatureWorkspace, { type WorkspaceArea } from '../components/FeatureWorkspace';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  Download,
  Eye,
  Globe2,
  LayoutDashboard,
  LineChart,
  Lock,
  Menu,
  MoreHorizontal,
  Newspaper,
  PanelLeft,
  PieChart,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

type Asset = {
  symbol: string;
  name: string;
  type: string;
  price: string;
  change: string;
  percent: string;
  positive?: boolean;
  spark: string;
  sector: string;
};

const assets: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', price: '$108,492.00', change: '+$2,184.50', percent: '+2.05%', positive: true, spark: 'M2 27 C 12 24, 14 18, 23 20 S 32 13, 42 16 S 53 7, 65 11 S 79 5, 94 2', sector: 'Digital assets' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Crypto', price: '$3,942.18', change: '+$96.22', percent: '+2.50%', positive: true, spark: 'M2 25 C 12 27, 18 18, 27 20 S 41 15, 49 17 S 63 8, 74 10 S 84 4, 94 3', sector: 'Digital assets' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', price: '$182.06', change: '-$1.42', percent: '-0.77%', spark: 'M2 8 C 12 13, 14 9, 25 15 S 38 11, 47 18 S 62 14, 71 18 S 84 21, 94 26', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Equity', price: '$342.78', change: '+$4.66', percent: '+1.38%', positive: true, spark: 'M2 25 C 12 21, 19 24, 28 18 S 37 20, 47 13 S 60 16, 69 10 S 84 7, 94 3', sector: 'Automotive' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', price: '$227.16', change: '+$0.88', percent: '+0.39%', positive: true, spark: 'M2 18 C 14 19, 17 13, 27 16 S 41 10, 51 13 S 65 8, 76 11 S 86 6, 94 7', sector: 'Technology' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', price: '$634.21', change: '+$1.94', percent: '+0.31%', positive: true, spark: 'M2 20 C 15 17, 22 19, 31 15 S 42 17, 52 12 S 65 15, 74 9 S 86 10, 94 5', sector: 'Index' },
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Portfolio', icon: PieChart },
  { label: 'Markets', icon: BarChart3 },
  { label: 'Trade', icon: Zap },
  { label: 'Research', icon: Newspaper },
  { label: 'Copy Trading', icon: UsersRound },
];

function Sparkline({ path, positive = true }: { path: string; positive?: boolean }) {
  return (
    <svg className="sparkline" viewBox="0 0 96 32" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} fill="none" stroke={positive ? '#2bd6a5' : '#ff7185'} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ValueChange({ value, positive = true }: { value: string; positive?: boolean }) {
  return <span className={positive ? 'positive' : 'negative'}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{value}</span>;
}

export default function BrokerageWorkspace() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [watchlist, setWatchlist] = useState('Global watchlist');
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [search, setSearch] = useState('');
  const [tradeOpen, setTradeOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [tradeSide, setTradeSide] = useState<'Buy' | 'Sell'>('Buy');
  const [orderType, setOrderType] = useState('Market');
  const [quantity, setQuantity] = useState('0.10');
  const [notice, setNotice] = useState('');
  const [platformConfig, setPlatformConfig] = useState<Record<string, string | boolean | number>>({});

  useEffect(() => {
    fetch('/api/platform-config').then((response) => response.ok ? response.json() : {}).then(setPlatformConfig).catch(() => undefined);
  }, []);

  const filteredAssets = useMemo(() => assets.filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(search.toLowerCase())), [search]);

  const submitPaperOrder = () => {
    setNotice(`${tradeSide} order staged for ${quantity} ${selectedAsset.symbol} · ${orderType} order`);
    setTradeOpen(false);
    window.setTimeout(() => setNotice(''), 4500);
  };

  return (
    <main className="terminal-shell">
      <aside className={`sidebar ${sideOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup"><div className="brand-mark"><span /></div><div><strong>Blockchain Trust</strong><small>Enterprise Markets</small></div></div>
        <button className="account-switcher"><span className="account-avatar">BT</span><span><b>BT Enterprise</b><small>Paper account · USD</small></span><ChevronDown size={15} /></button>
        <nav className="main-nav" aria-label="Main navigation">
          <div className="nav-caption">Workspace</div>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); setSideOpen(false); }}><Icon size={17} /><span>{label}</span>{label === 'Trade' && <em>New</em>}</button>)}
          <div className="nav-caption nav-caption-spaced">Account</div>
          <button className={`nav-item ${activeNav === 'Balances' ? 'active' : ''}`} onClick={() => { setActiveNav('Balances'); setSideOpen(false); }}><Wallet size={17} /><span>Balances</span></button>
          <button className={`nav-item ${activeNav === 'Reports' ? 'active' : ''}`} onClick={() => { setActiveNav('Reports'); setSideOpen(false); }}><Download size={17} /><span>Reports</span></button>
          <button className={`nav-item ${activeNav === 'Security center' ? 'active' : ''}`} onClick={() => { setActiveNav('Security center'); setSideOpen(false); }}><ShieldCheck size={17} /><span>Security center</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="live-status"><span className="status-dot" />All systems operational</div><button className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`} onClick={() => { setActiveNav('Settings'); setSideOpen(false); }}><Settings2 size={17} /><span>Settings</span></button><button className={`nav-item ${activeNav === 'Help center' ? 'active' : ''}`} onClick={() => { setActiveNav('Help center'); setSideOpen(false); }}><CircleHelp size={17} /><span>Help center</span></button><a className="profile-row" href="/account"><div className="profile-avatar">JM</div><div><b>Jordan Morgan</b><small>Account access</small></div><MoreHorizontal size={17} /></a></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><button className="mobile-menu" onClick={() => setSideOpen((value) => !value)} aria-label="Toggle navigation"><Menu size={21} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><b>{activeNav}</b></div><div className="topbar-actions"><div className="global-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search markets, symbols..." /><kbd><Command size={12} />K</kbd></div><button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><button className="icon-button" aria-label="Display settings"><SlidersHorizontal size={18} /></button></div></header>

        {activeNav !== 'Overview' && <FeatureWorkspace area={activeNav as WorkspaceArea} config={platformConfig} onNotify={setNotice} onOpenOrder={() => setTradeOpen(true)} />}{activeNav === 'Overview' && <div className="content-wrap overview-content">
          <div className="welcome-row"><div><p className="eyebrow"><span className="eyebrow-line" />MONDAY, AUGUST 24, 2026 · MARKET OPEN</p><h1>{String(platformConfig.hero_headline || 'Good morning, Jordan.')}</h1><p className="subtitle">{String(platformConfig.hero_subtitle || 'A clear view across your global portfolio, powered by institutional-grade intelligence.')}</p></div><div className="welcome-actions"><button className="secondary-button" onClick={() => setNotice('Export prepared. Download links will appear in the Reports center.')}><Download size={16} /> Export view</button><button className="primary-button" onClick={() => setTradeOpen(true)}><Plus size={17} /> Create order</button></div></div>

          <section className="metric-grid"><div className="metric-card metric-card-featured"><div className="metric-label">Total account value <Eye size={15} /></div><div className="metric-value">$284,619.42</div><div className="metric-foot"><ValueChange value="$6,842.18 (2.46%)" /><span>Today</span></div><div className="metric-orbit orbit-one" /><div className="metric-orbit orbit-two" /></div><div className="metric-card"><div className="metric-label">Available to invest <Wallet size={15} /></div><div className="metric-value">$68,420.00</div><div className="metric-foot"><span className="muted">Buying power</span><span className="positive">100%</span></div></div><div className="metric-card"><div className="metric-label">Unrealized P&amp;L <TrendingUp size={15} /></div><div className="metric-value positive-text">+$24,882.64</div><div className="metric-foot"><ValueChange value="8.74%" /><span>Since inception</span></div></div><div className="metric-card"><div className="metric-label">Risk posture <ShieldCheck size={15} /></div><div className="metric-value">Balanced</div><div className="risk-bar"><span /><span /><span /><span /><span /></div><div className="metric-foot"><span className="muted">Moderate allocation</span><span className="accent-text">Review</span></div></div></section>

          <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><div className="panel-kicker"><LineChart size={15} />Net liquidation value</div><div className="chart-value">$284,619.42 <span className="positive">+2.46%</span></div></div><div className="range-tabs"><button className="active">1D</button><button>1W</button><button>1M</button><button>1Y</button><button>Max</button></div></div><div className="main-chart"><div className="chart-y-axis"><span>$290k</span><span>$280k</span><span>$270k</span><span>$260k</span><span>$250k</span></div><svg viewBox="0 0 720 238" preserveAspectRatio="none" role="img" aria-label="Portfolio value chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2bd6a5" stopOpacity=".26" /><stop offset="100%" stopColor="#2bd6a5" stopOpacity="0" /></linearGradient></defs><g className="chart-grid"><line x1="0" y1="20" x2="720" y2="20" /><line x1="0" y1="68" x2="720" y2="68" /><line x1="0" y1="116" x2="720" y2="116" /><line x1="0" y1="164" x2="720" y2="164" /><line x1="0" y1="212" x2="720" y2="212" /></g><path d="M0 190 C 25 182, 34 189, 58 169 S 89 175, 110 151 S 146 158, 169 139 S 199 152, 227 126 S 260 136, 282 111 S 322 120, 343 96 S 374 112, 400 86 S 429 94, 458 74 S 497 88, 517 58 S 550 71, 572 50 S 602 61, 631 37 S 666 49, 690 27 S 708 34, 720 17 L720 238 L0 238Z" fill="url(#chartFill)" /><path d="M0 190 C 25 182, 34 189, 58 169 S 89 175, 110 151 S 146 158, 169 139 S 199 152, 227 126 S 260 136, 282 111 S 322 120, 343 96 S 374 112, 400 86 S 429 94, 458 74 S 497 88, 517 58 S 550 71, 572 50 S 602 61, 631 37 S 666 49, 690 27 S 708 34, 720 17" fill="none" stroke="#2bd6a5" strokeWidth="2.5" strokeLinecap="round" /></svg><div className="chart-tooltip"><span>Aug 24, 2026 · 09:42</span><b>$284,619.42</b><small>+$6,842.18 today</small></div><div className="chart-x-axis"><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span><span>16:00</span></div></div></section>

            <section className="panel allocation-panel"><div className="panel-heading"><div><div className="panel-kicker"><PieChart size={15} />Portfolio allocation</div><div className="panel-title">By asset class</div></div><button className="more-button"><MoreHorizontal size={18} /></button></div><div className="donut-wrap"><div className="donut"><div className="donut-center"><b>$284.6k</b><span>Portfolio</span></div></div><div className="allocation-legend"><div><span className="legend-color color-equities" /><span>Equities</span><b>48.2%</b></div><div><span className="legend-color color-digital" /><span>Digital assets</span><b>31.7%</b></div><div><span className="legend-color color-fixed" /><span>Fixed income</span><b>14.6%</b></div><div><span className="legend-color color-cash" /><span>Cash</span><b>5.5%</b></div></div></div><button className="full-link" onClick={() => setActiveNav('Portfolio')}>View portfolio analytics <ArrowUpRight size={15} /></button></section></div>

          <section className="panel watchlist-panel"><div className="panel-heading watchlist-heading"><div><div className="panel-kicker"><Star size={15} />Market intelligence</div><div className="panel-title">Your watchlist</div></div><div className="watchlist-tools"><button className="watchlist-select">{watchlist}<ChevronDown size={14} /></button><button className="more-button"><Plus size={17} /></button><button className="more-button"><MoreHorizontal size={18} /></button></div></div><div className="asset-table"><div className="asset-row asset-header"><span>Instrument</span><span>Last price</span><span>Change</span><span>Chart · 1D</span><span> </span></div>{filteredAssets.map((asset) => <button className={`asset-row ${selectedAsset.symbol === asset.symbol ? 'selected' : ''}`} key={asset.symbol} onClick={() => setSelectedAsset(asset)}><span className="instrument"><span className="asset-icon">{asset.symbol.slice(0, 1)}</span><span><b>{asset.symbol}</b><small>{asset.name} · {asset.type}</small></span></span><span className="last-price">{asset.price}</span><span><ValueChange value={`${asset.change}  ${asset.percent}`} positive={asset.positive} /></span><span className="mini-chart"><Sparkline path={asset.spark} positive={asset.positive} /></span><span className="row-action"><ChevronRight size={17} /></span></button>)}</div>{filteredAssets.length === 0 && <div className="empty-state">No instruments match “{search}”. Try a symbol such as BTC or NVDA.</div>}<div className="table-footer"><span>Quotes delayed for demo purposes · Last updated 09:42:18 ET</span><button onClick={() => setNotice('Market data connection settings opened.')}>Data settings <ChevronRight size={14} /></button></div></section>

          <div className="lower-grid"><section className="panel activity-panel"><div className="panel-heading"><div><div className="panel-kicker"><BookOpen size={15} />Account activity</div><div className="panel-title">Recent orders</div></div><button className="full-link" onClick={() => setActiveNav('Trade')}>View all <ChevronRight size={14} /></button></div><div className="activity-list"><div className="activity-row"><span className="activity-icon buy-icon"><ArrowUpRight size={15} /></span><span><b>Buy · BTC</b><small>0.10 BTC · Market order</small></span><span><b>$10,849.20</b><small>Today, 09:32</small></span><em className="filled">Filled</em></div><div className="activity-row"><span className="activity-icon sell-icon"><ArrowDownRight size={15} /></span><span><b>Sell · NVDA</b><small>12 shares · Limit order</small></span><span><b>$2,184.72</b><small>Yesterday, 15:48</small></span><em className="filled">Filled</em></div><div className="activity-row"><span className="activity-icon deposit-icon"><Download size={15} /></span><span><b>Cash deposit</b><small>Business checking · ACH</small></span><span><b>$25,000.00</b><small>Aug 21, 2026</small></span><em className="pending">Pending</em></div></div></section><section className="panel insights-panel"><div className="insights-glow" /><div className="panel-kicker"><Sparkles size={15} />BTE signal</div><h3>Portfolio resilience is strengthening.</h3><p>Your diversification score moved into the top quartile of balanced portfolios after the latest rebalance.</p><div className="signal-score"><div><b>82</b><span>/ 100</span></div><div className="score-track"><span /></div><span className="positive">+6 pts</span></div><button className="insight-link" onClick={() => setNotice('Opening your personalized portfolio review.')}>Review signal <ArrowRightIcon /></button></section></div>
          <section className="advantage-grid"><div className="advantage-heading"><div className="panel-kicker"><Sparkles size={15} />BTE advantage layer</div><h2>Built for confidence, not just clicks.</h2><p>Four product principles that make every decision more observable, reversible, and aligned with your mandate.</p></div><button className="advantage-card" onClick={() => setNotice('Execution receipt preview opened.')}><span className="advantage-icon"><Zap size={16} /></span><span><b>Explainable execution</b><small>Every simulated order gets a human-readable receipt with price, timing, controls, and fees.</small></span><ArrowUpRight size={15} /></button><button className="advantage-card" onClick={() => setNotice('TrustLayer transparency report opened.')}><span className="advantage-icon"><ShieldCheck size={16} /></span><span><b>TrustLayer transparency</b><small>Surface custody, provider status, data freshness, and operational incidents in one place.</small></span><ArrowUpRight size={15} /></button><button className="advantage-card" onClick={() => setNotice('Guardrail builder opened.')}><span className="advantage-icon"><SlidersHorizontal size={16} /></span><span><b>Personal guardrails</b><small>Set concentration, drawdown, and approval rules before an order is staged.</small></span><ArrowUpRight size={15} /></button><button className="advantage-card" onClick={() => setNotice('Privacy-first tax intelligence opened.')}><span className="advantage-icon"><Lock size={16} /></span><span><b>Private tax intelligence</b><small>Explore tax-lot and scenario insights without turning your financial life into an ad profile.</small></span><ArrowUpRight size={15} /></button></section>
          <footer className="workspace-footer"><span><ShieldCheck size={14} />Secure session · Protected by BTE TrustLayer</span><span>{String(platformConfig.trust_message || 'Paper account · Data is simulated')} · © 2026 Blockchain Trust Enterprise</span></footer>
        </div>}
      </section>

      {notice && <div className="toast"><ShieldCheck size={17} /><span>{notice}</span><button onClick={() => setNotice('')}><X size={15} /></button></div>}
      {tradeOpen && <div className="modal-backdrop" onClick={() => setTradeOpen(false)}><section className="trade-modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><div className="panel-kicker"><Zap size={15} />Order ticket</div><h2>Place a paper trade</h2><p>Fast, transparent execution preview for your BTE workspace.</p></div><button className="close-button" onClick={() => setTradeOpen(false)}><X size={19} /></button></div><div className="trade-symbol"><span className="asset-icon large">{selectedAsset.symbol.slice(0, 1)}</span><div><b>{selectedAsset.symbol}</b><span>{selectedAsset.name}</span></div><strong>{selectedAsset.price}</strong></div><div className="side-toggle"><button className={tradeSide === 'Buy' ? 'active buy-active' : ''} onClick={() => setTradeSide('Buy')}>Buy</button><button className={tradeSide === 'Sell' ? 'active sell-active' : ''} onClick={() => setTradeSide('Sell')}>Sell</button></div><div className="form-grid"><label>Order type<select value={orderType} onChange={(event) => setOrderType(event.target.value)}><option>Market</option><option>Limit</option><option>Stop</option></select></label><label>Time in force<select><option>Day</option><option>Good till canceled</option></select></label><label>Quantity<input value={quantity} onChange={(event) => setQuantity(event.target.value)} inputMode="decimal" /></label><label>Estimated value<div className="input-readonly">${(Number(quantity || 0) * Number(selectedAsset.price.replace(/[$,]/g, ''))).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div></label></div><div className="order-note"><ShieldCheck size={16} /><span>Paper trading only. No live order will be routed.</span></div><button className={`submit-order ${tradeSide === 'Sell' ? 'sell-submit' : ''}`} onClick={submitPaperOrder}>{tradeSide} {selectedAsset.symbol} <ArrowUpRight size={17} /></button></section></div>}
    </main>
  );
}

function ArrowRightIcon({ size = 18 }: { size?: number }) {
  return <ArrowUpRight size={size} />;
}
