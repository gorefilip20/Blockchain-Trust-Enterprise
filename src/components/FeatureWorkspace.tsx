'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FileText,
  Filter,
  Globe2,
  KeyRound,
  LineChart,
  LockKeyhole,
  Newspaper,
  Percent,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';

export type WorkspaceArea = 'Portfolio' | 'Markets' | 'Trade' | 'Research' | 'Balances' | 'Reports' | 'Security center' | 'Settings' | 'Help center';

type Props = { area: WorkspaceArea; onNotify: (message: string) => void; onOpenOrder: () => void; config?: Record<string, string | boolean | number> };

type MarketRow = { symbol: string; name: string; className: string; last: string; move: string; positive: boolean; volume: string };

const marketRows: MarketRow[] = [
  { symbol: 'BTC', name: 'Bitcoin / USD', className: 'Crypto', last: '$108,492.00', move: '+2.05%', positive: true, volume: '$38.4B' },
  { symbol: 'ETH', name: 'Ethereum / USD', className: 'Crypto', last: '$3,942.18', move: '+2.50%', positive: true, volume: '$17.9B' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', className: 'Equity', last: '$182.06', move: '-0.77%', positive: false, volume: '$21.6B' },
  { symbol: 'EUR.USD', name: 'Euro / US Dollar', className: 'FX', last: '1.1704', move: '+0.18%', positive: true, volume: '$4.1T' },
  { symbol: 'TLT', name: '20+ Year Treasury Bond ETF', className: 'Fixed income', last: '$87.44', move: '-0.24%', positive: false, volume: '$3.2B' },
  { symbol: 'SPX', name: 'S&P 500 Index', className: 'Index', last: '6,411.37', move: '+0.31%', positive: true, volume: '$6.8T' },
];

const researchStories = [
  { category: 'Macro', title: 'Rates, liquidity and the next rotation in global risk assets', source: 'BTE Research Desk', time: '18 min ago', tone: 'mint' },
  { category: 'Equities', title: 'AI infrastructure enters its second act: what investors are watching', source: 'Market Intelligence', time: '1 hr ago', tone: 'blue' },
  { category: 'Digital assets', title: 'Bitcoin liquidity map: institutional flows and key levels', source: 'Digital Assets Brief', time: '3 hrs ago', tone: 'gold' },
];

function AreaHeader({ icon: Icon, eyebrow, title, description, action }: { icon: typeof Activity; eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="feature-header"><div><div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}

function FeatureStat({ label, value, change, positive = true }: { label: string; value: string; change?: string; positive?: boolean }) {
  return <div className="feature-stat"><span>{label}</span><b>{value}</b>{change && <small className={positive ? 'positive' : 'negative'}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}</small>}</div>;
}

function PortfolioArea({ onNotify }: { onNotify: (message: string) => void }) {
  return <>
    <AreaHeader icon={PieChart} eyebrow="Portfolio intelligence" title="Portfolio analytics" description="Understand performance, exposure, liquidity, and risk across every account and sleeve." action={<button className="secondary-button" onClick={() => onNotify('Portfolio report queued for export.')}><Download size={15} /> Export report</button>} />
    <div className="feature-stat-grid"><FeatureStat label="Net liquidation value" value="$284,619.42" change="2.46% today" /><FeatureStat label="Time-weighted return" value="18.24%" change="4.80% YTD" /><FeatureStat label="Sharpe ratio" value="1.42" change="0.18 vs. prior period" /><FeatureStat label="Margin cushion" value="68.4%" change="Healthy" /></div>
    <div className="feature-columns"><section className="panel feature-card"><div className="panel-heading"><div><div className="panel-kicker"><LineChart size={15} />Performance analysis</div><div className="panel-title">Growth of $100,000</div></div><div className="range-tabs"><button className="active">1Y</button><button>3Y</button><button>5Y</button><button>Max</button></div></div><div className="large-chart"><div className="chart-y-axis"><span>$300k</span><span>$250k</span><span>$200k</span><span>$150k</span><span>$100k</span></div><svg viewBox="0 0 700 230" preserveAspectRatio="none"><defs><linearGradient id="featureFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2bd6a5" stopOpacity=".27" /><stop offset="100%" stopColor="#2bd6a5" stopOpacity="0" /></linearGradient></defs><path d="M0 198 C42 188 61 204 91 177 S130 190 159 159 S211 172 239 141 S276 153 313 128 S353 142 387 98 S430 117 459 86 S510 95 542 65 S584 81 611 46 S666 50 700 23 L700 230 L0 230Z" fill="url(#featureFill)" /><path d="M0 198 C42 188 61 204 91 177 S130 190 159 159 S211 172 239 141 S276 153 313 128 S353 142 387 98 S430 117 459 86 S510 95 542 65 S584 81 611 46 S666 50 700 23" fill="none" stroke="#2bd6a5" strokeWidth="2.6" strokeLinecap="round" /></svg><div className="chart-x-axis"><span>Aug 25</span><span>Nov 25</span><span>Feb 26</span><span>May 26</span><span>Aug 26</span></div></div></section><section className="panel feature-card"><div className="panel-kicker"><SlidersHorizontal size={15} />Exposure monitor</div><div className="panel-title">Allocation by risk factor</div><div className="exposure-list"><div><span>Equity beta</span><b>0.82</b><i><em style={{ width: '82%' }} /></i></div><div><span>Digital asset beta</span><b>0.46</b><i><em style={{ width: '46%' }} /></i></div><div><span>Interest-rate sensitivity</span><b>0.21</b><i><em style={{ width: '21%' }} /></i></div><div><span>Currency exposure</span><b>14.8%</b><i><em style={{ width: '37%' }} /></i></div></div><div className="risk-callout"><ShieldCheck size={16} /><div><b>Risk posture is balanced</b><span>Concentration is below your 20% threshold.</span></div></div></section></div>
    <section className="panel feature-card"><div className="panel-heading"><div><div className="panel-kicker"><PieChart size={15} />Holdings</div><div className="panel-title">Positions and tax lots</div></div><button className="full-link" onClick={() => onNotify('Tax lot selection tools are ready for integration.')}><Filter size={14} /> Manage filters</button></div><div className="holdings-table"><div className="holdings-row holdings-header"><span>Instrument</span><span>Quantity</span><span>Avg. cost</span><span>Market value</span><span>P&amp;L</span></div>{[['BTC', '0.84', '$82,110.00', '$91,133.28', '+$21,422.18'], ['NVDA', '120', '$142.60', '$21,847.20', '+$4,735.20'], ['SPY', '85', '$512.40', '$53,907.85', '+$7,116.10'], ['TLT', '210', '$91.62', '$18,362.40', '-$860.80']].map((row) => <div className="holdings-row" key={row[0]}><span><b>{row[0]}</b><small>{row[0] === 'BTC' ? 'Bitcoin' : row[0] === 'NVDA' ? 'NVIDIA Corporation' : row[0] === 'SPY' ? 'S&P 500 ETF' : 'Treasury Bond ETF'}</small></span><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><span className={row[4].startsWith('+') ? 'positive' : 'negative'}>{row[4]}</span></div>)}</div></section>
  </>;
}

function MarketsArea({ onNotify }: { onNotify: (message: string) => void }) {
  const [query, setQuery] = useState('');
  const [assetClass, setAssetClass] = useState('All assets');
  const filtered = useMemo(() => marketRows.filter((row) => `${row.symbol} ${row.name}`.toLowerCase().includes(query.toLowerCase()) && (assetClass === 'All assets' || row.className === assetClass)), [query, assetClass]);
  return <>
    <AreaHeader icon={Globe2} eyebrow="Global market center" title="Markets" description="Discover instruments, compare asset classes, and build a view across global venues." action={<button className="secondary-button" onClick={() => onNotify('Market data settings opened.')}><SlidersHorizontal size={15} /> Data preferences</button>} />
    <div className="market-toolbar"><div className="feature-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search symbol, company, or exchange" /></div><select value={assetClass} onChange={(event) => setAssetClass(event.target.value)}><option>All assets</option><option>Equity</option><option>Crypto</option><option>FX</option><option>Fixed income</option><option>Index</option></select><button className="secondary-button" onClick={() => onNotify('Screener saved to your workspace.')}><Plus size={15} /> Save screen</button></div>
    <div className="feature-stat-grid"><FeatureStat label="Global indices" value="42,816" change="Across 34 venues" /><FeatureStat label="Market breadth" value="61.2%" change="Advancing" /><FeatureStat label="Volatility index" value="16.84" change="-4.21%" /><FeatureStat label="Currencies" value="29" change="Supported" /></div>
    <section className="panel feature-card"><div className="panel-heading"><div><div className="panel-kicker"><BarChart3 size={15} />Instrument explorer</div><div className="panel-title">Global markets</div></div><span className="data-badge"><span className="status-dot" />Streaming preview</span></div><div className="holdings-table market-table"><div className="holdings-row holdings-header"><span>Instrument</span><span>Asset class</span><span>Last price</span><span>Change</span><span>Volume</span></div>{filtered.map((row) => <button className="holdings-row market-row" key={row.symbol} onClick={() => onNotify(`${row.symbol} added to active quote panel.`)}><span><b>{row.symbol}</b><small>{row.name}</small></span><span>{row.className}</span><span>{row.last}</span><span className={row.positive ? 'positive' : 'negative'}>{row.move}</span><span>{row.volume}</span></button>)}</div>{filtered.length === 0 && <div className="empty-state">No instruments match your filters.</div>}</section>
    <div className="feature-columns"><section className="panel feature-card"><div className="panel-kicker"><Zap size={15} />Market movers</div><div className="panel-title">Momentum snapshot</div><div className="mover-list"><div><span className="mover-symbol">SMCI</span><span>Super Micro Computer</span><b className="positive">+12.82%</b></div><div><span className="mover-symbol">COIN</span><span>Coinbase Global</span><b className="positive">+8.41%</b></div><div><span className="mover-symbol">GLD</span><span>Gold ETF</span><b className="negative">-3.18%</b></div></div></section><section className="panel feature-card"><div className="panel-kicker"><CalendarDays size={15} />Economic calendar</div><div className="panel-title">Next catalysts</div><div className="calendar-list"><div><span className="calendar-date">AUG 26</span><span><b>US durable goods</b><small>08:30 ET · Medium impact</small></span></div><div><span className="calendar-date">AUG 28</span><span><b>Federal Reserve remarks</b><small>10:00 ET · High impact</small></span></div></div></section></div>
  </>;
}

function TradeArea({ onOpenOrder, onNotify }: { onOpenOrder: () => void; onNotify: (message: string) => void }) {
  return <>
    <AreaHeader icon={Zap} eyebrow="Execution center" title="Trade" description="Stage orders, review open exposure, and monitor execution quality in one controlled workflow." action={<button className="primary-button" onClick={onOpenOrder}><Plus size={15} /> New order</button>} />
    <div className="trade-command-row"><div className="command-card"><div className="command-icon"><Zap size={18} /></div><div><b>Quick trade</b><span>Launch an order ticket for equities, ETFs, crypto, FX, and fixed income.</span></div><button onClick={onOpenOrder}>Open ticket <ChevronRight size={15} /></button></div><div className="command-card"><div className="command-icon"><RefreshCw size={18} /></div><div><b>Recurring investments</b><span>Set a schedule for repeat purchases and cash allocation rules.</span></div><button onClick={() => onNotify('Recurring investment builder opened.')}>Configure <ChevronRight size={15} /></button></div></div>
    <div className="feature-stat-grid"><FeatureStat label="Open orders" value="4" change="2 need review" positive={false} /><FeatureStat label="Filled today" value="18" change="$42,861 notional" /><FeatureStat label="Buying power" value="$68,420" change="Available" /><FeatureStat label="Execution quality" value="98.6%" change="Within target" /></div>
    <div className="feature-columns"><section className="panel feature-card"><div className="panel-heading"><div><div className="panel-kicker"><Activity size={15} />Order management</div><div className="panel-title">Open and recent orders</div></div><button className="full-link" onClick={() => onNotify('Order history exported.')}><Download size={14} /> Export</button></div><div className="orders-list"><div className="order-row order-header"><span>Side / instrument</span><span>Type</span><span>Qty</span><span>Status</span></div>{[['Buy · BTC', 'Market', '0.10', 'Filled'], ['Sell · NVDA', 'Limit · $184.00', '12', 'Working'], ['Buy · SPY', 'Recurring', '5', 'Scheduled'], ['Buy · EUR.USD', 'Market', '25,000', 'Filled']].map((order) => <div className="order-row" key={`${order[0]}-${order[1]}`}><span><b>{order[0]}</b><small>Today · BTE Paper account</small></span><span>{order[1]}</span><span>{order[2]}</span><em className={order[3] === 'Filled' ? 'filled' : order[3] === 'Working' ? 'pending' : 'muted'}>{order[3]}</em></div>)}</div></section><section className="panel feature-card"><div className="panel-kicker"><ShieldCheck size={15} />Pre-trade controls</div><div className="panel-title">Risk and suitability</div><div className="control-list"><div><span><Check size={14} />Buying power check</span><b>Pass</b></div><div><span><Check size={14} />Concentration limit</span><b>Pass</b></div><div><span><Check size={14} />Market hours</span><b>Pass</b></div><div><span><Clock3 size={14} />Settlement preview</span><b>T+1</b></div></div><button className="full-link" onClick={() => onNotify('Pre-trade settings opened.')}>Configure controls <ChevronRight size={14} /></button></section></div>
  </>;
}

function ResearchArea({ onNotify }: { onNotify: (message: string) => void }) {
  return <>
    <AreaHeader icon={Newspaper} eyebrow="Ideas and intelligence" title="Research" description="Move from signal to context with news, fundamentals, calendars, and BTE-curated insights." action={<button className="secondary-button" onClick={() => onNotify('Research preferences saved.')}><BellRing size={15} /> Manage alerts</button>} />
    <div className="research-grid">{researchStories.map((story) => <article className={`research-card ${story.tone}`} key={story.title}><div className="story-meta"><span>{story.category}</span><small>{story.time}</small></div><h3>{story.title}</h3><p>Concise, decision-ready coverage with the key drivers, watch items, and potential scenarios in one view.</p><footer><span>{story.source}</span><button onClick={() => onNotify(`Opening ${story.category} research.`)}>Read brief <ArrowUpRight size={14} /></button></footer></article>)}</div><div className="feature-columns"><section className="panel feature-card"><div className="panel-kicker"><BookOpen size={15} />Research tools</div><div className="panel-title">Build your edge</div><div className="tool-grid"><button onClick={() => onNotify('Fundamentals screener launched.')}><SlidersHorizontal size={17} /><b>Fundamentals screener</b><span>Filter quality, valuation, growth, and factor data.</span></button><button onClick={() => onNotify('Options strategy builder launched.')}><Percent size={17} /><b>Options strategy builder</b><span>Compare payoff profiles and scenario ranges.</span></button><button onClick={() => onNotify('Earnings calendar launched.')}><CalendarDays size={17} /><b>Earnings calendar</b><span>Track upcoming reports and market catalysts.</span></button><button onClick={() => onNotify('Learning center launched.')}><CircleHelp size={17} /><b>Learning center</b><span>Explore explainers for every asset class.</span></button></div></section><section className="panel feature-card"><div className="panel-kicker"><Sparkles size={15} />BTE copilot</div><div className="panel-title">Ask about a market</div><p className="feature-copy">Summarize the latest signal, compare an instrument, or translate a research theme into a watchlist.</p><div className="copilot-input"><Sparkles size={15} /><input placeholder="Ask BTE about BTC, rates, or NVDA..." /><button onClick={() => onNotify('BTE research brief generated for review.')}>Ask</button></div><small className="disclaimer">AI-assisted summaries are informational and not investment advice.</small></section></div>
  </>;
}

type AccountAreaKey = 'Balances' | 'Reports' | 'Security center' | 'Settings' | 'Help center';

function AccountArea({ area, onNotify }: { area: AccountAreaKey; onNotify: (message: string) => void }) {
  const content = {
    Balances: { icon: WalletCards, eyebrow: 'Cash and funding', title: 'Balances', description: 'Review cash, buying power, margin, and multi-currency balances.', cards: [['Total cash', '$68,420.00'], ['Settled cash', '$52,114.00'], ['Margin used', '$18,260.00'], ['Available withdrawal', '$42,810.00']] },
    Reports: { icon: FileText, eyebrow: 'Documents and statements', title: 'Reports', description: 'Access statements, confirms, tax lots, performance reports, and audit-ready exports.', cards: [['Monthly statement', 'Aug 2026'], ['Tax package', 'Not yet available'], ['Trade confirmations', '18 this month'], ['Portfolio report', 'Updated today']] },
    'Security center': { icon: LockKeyhole, eyebrow: 'TrustLayer security', title: 'Security center', description: 'Control authentication, devices, permissions, and activity across your BTE account.', cards: [['Account protection', 'Strong'], ['MFA status', 'Enabled'], ['Active sessions', '2 devices'], ['Last review', 'Today']] },
    Settings: { icon: SlidersHorizontal, eyebrow: 'Workspace preferences', title: 'Settings', description: 'Personalize your workspace, notifications, quote behavior, and account preferences.', cards: [['Base currency', 'USD'], ['Quote refresh', 'Streaming preview'], ['Notifications', '12 enabled'], ['Theme', 'Midnight terminal']] },
    'Help center': { icon: CircleHelp, eyebrow: 'Support and guidance', title: 'Help center', description: 'Find platform guidance, secure support, and answers for your BTE workspace.', cards: [['Open cases', '0'], ['Knowledge base', '184 articles'], ['Response target', '< 4 hours'], ['System status', 'Operational']] },
  }[area];
  const Icon = content.icon;
  return <><AreaHeader icon={Icon} eyebrow={content.eyebrow} title={content.title} description={content.description} action={<button className="secondary-button" onClick={() => onNotify(`${area} request submitted.`)}><Plus size={15} /> Create request</button>} /><div className="feature-stat-grid">{content.cards.map(([label, value]) => <FeatureStat key={label} label={label} value={value} />)}</div><div className="feature-columns"><section className="panel feature-card"><div className="panel-kicker"><Icon size={15} />Workspace controls</div><div className="panel-title">Manage your BTE experience</div><div className="settings-list">{['Account preferences', 'Permissions and entitlements', 'Notifications and alerts', 'Data and privacy controls', 'Download center'].map((item) => <button key={item} onClick={() => onNotify(`${item} opened.`)}><span><Icon size={15} />{item}</span><ChevronRight size={15} /></button>)}</div></section><section className="panel feature-card account-notice"><ShieldCheck size={22} /><h3>Production integration checkpoint</h3><p>This area is ready for provider-backed data, but this environment is currently using safe demo records. No funds, identity documents, or live orders are processed here.</p><button className="full-link" onClick={() => onNotify('Integration checklist opened.')}>View integration checklist <ChevronRight size={14} /></button></section></div></>;
}

export default function FeatureWorkspace({ area, onNotify, onOpenOrder, config = {} }: Props) {
  const mode = String(config.workspace_mode || 'demo');
  return <div className="feature-workspace"><div className="feature-subnav"><button className="active">Workspace</button><button onClick={() => onNotify('Saved views opened.')}>Saved views</button><button onClick={() => onNotify('Entitlements opened.')}>Entitlements</button><span /><div className="feature-live"><span className="status-dot" />{mode === 'live' ? 'Live provider mode' : 'Demo data mode'}</div></div>{area === 'Portfolio' && <PortfolioArea onNotify={onNotify} />}{area === 'Markets' && <MarketsArea onNotify={onNotify} />}{area === 'Trade' && <TradeArea onOpenOrder={onOpenOrder} onNotify={onNotify} />}{area === 'Research' && <ResearchArea onNotify={onNotify} />}{(['Balances', 'Reports', 'Security center', 'Settings', 'Help center'] as AccountAreaKey[]).includes(area as AccountAreaKey) && <AccountArea area={area as AccountAreaKey} onNotify={onNotify} />}</div>;
}
