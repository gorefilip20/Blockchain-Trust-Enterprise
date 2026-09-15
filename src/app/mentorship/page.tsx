'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, TrendingUp, Star, ChevronDown, ChevronUp, Send, Award, BarChart3, Target, Shield, Zap, MessageCircle, FileText, Video, Play, Lock, Copy, Check, Wallet, DollarSign, Eye, X } from 'lucide-react';

interface Strategy {
  id: string; title: string; trader_name: string; category: string; markets: string;
  description: string; key_concepts: string; difficulty: string; source: string; source_url: string;
}
interface Mentor {
  id: string; name: string; specialty: string; bio: string; experience_years: number;
  markets: string; telegram_handle: string; total_students: number; rating: number;
  youtube_channel?: string; guide_pdf?: string; youtube_video_id?: string;
}
interface WalletInfo {
  blockchain_network: string;
  receiving_address: string;
}

const difficultyColor: Record<string, string> = { Beginner: '#3b82f6', Intermediate: '#6d43d8', Advanced: '#e0a800' };
const categoryIcon: Record<string, React.ReactNode> = {
  'Swing Trading': <TrendingUp size={16} />, 'Day Trading': <Zap size={16} />,
};

const guidePreview: Record<string, { title: string; sections: string[]; previewText: string }> = {
  'mentor-kane-prop-firm-playbook': {
    title: 'Prop Firm Trading Playbook',
    sections: ['Understanding Funded Accounts', 'Risk Rules & Drawdown Management', 'The Repeatable Setup', 'Scaling Your Prop Firm Career'],
    previewText: 'Prop firm trading has revolutionized access to capital for skilled traders. Instead of risking your own money, you trade with the firm\'s capital and keep a share of profits — typically 70-90%. The key to passing evaluations and staying funded is strict risk management. Most firms set a maximum daily drawdown of 4-5% and a total drawdown cap of 8-12%. Your edge isn\'t in finding the biggest trade — it\'s in consistency. Focus on setups with a 2:1 reward-to-risk ratio and keep position sizes small enough that no single loss triggers a rule violation...',
  },
  'mentor-brando-options-masterclass': {
    title: 'Options Swing Trading Masterclass',
    sections: ['The Size for Zero Method', 'Reading Options Flow', 'Entry Timing & Strike Selection', 'Managing Winners & Cutting Losers'],
    previewText: 'The Size for Zero method is built on one principle: size your position so that your maximum loss is a predetermined, comfortable amount — effectively zero impact on your trading psychology. When you remove the fear of loss from the equation, you trade your plan with precision. Start by identifying a stock with strong directional momentum on the daily chart. Look for pullbacks to the 21 EMA or a key support level. Select call options 30-45 days to expiration, one or two strikes in-the-money, to reduce theta decay...',
  },
  'mentor-ariel-swing-system': {
    title: 'Stock Swing Trading System',
    sections: ['Eliminating FOMO with Rules', 'The Setup Scanner', 'Entry, Stop & Target Framework', 'Journaling for Growth'],
    previewText: 'FOMO — Fear of Missing Out — is the silent killer of trading accounts. Every time you chase a stock that already moved 30%, you\'re buying someone else\'s profits. This system eliminates FOMO by giving you a strict checklist: if the setup doesn\'t meet all five criteria, you don\'t trade. Criteria 1: The stock must be above its 50-day moving average. Criteria 2: Volume on the breakout candle must exceed the 20-day average by at least 50%. Criteria 3: The entry must be within 3% of the breakout level...',
  },
  'mentor-rayner-price-action-guide': {
    title: 'Price Action & Trend Following Guide',
    sections: ['Reading Price Action Like a Pro', 'Trend Following Fundamentals', 'Multi-Timeframe Analysis', 'Building a Trading Plan'],
    previewText: 'Price action trading strips away the noise of indicators and focuses on what matters most: the price itself. Every candlestick tells a story about the battle between buyers and sellers. A long lower wick on a daily candle at a support level isn\'t just a pattern — it\'s rejection. Buyers stepped in aggressively and overwhelmed sellers. When you see this at a level where price has bounced three or more times, you have a high-probability long setup. The stop goes below the wick; the target is the next resistance level...',
  },
  'mentor-ross-daytrading-blueprint': {
    title: 'Small-Cap Day Trading Blueprint',
    sections: ['Gap-and-Go Strategy', 'VWAP as Your Compass', 'Momentum Breakout Playbook', 'The $583 to $10M Journey'],
    previewText: 'The Gap-and-Go strategy targets stocks gapping up 10%+ in pre-market on significant news — earnings beats, FDA approvals, contract wins. These stocks attract massive volume and retail attention, creating predictable momentum patterns. Scan for stocks gapping up at least 10% with pre-market volume exceeding 500K shares. Wait for the market open, then watch for the first pullback to VWAP or the pre-market high. If the stock holds above VWAP and forms a bull flag or flat-top breakout pattern, enter on the break with a stop below VWAP...',
  },
  'mentor-cryptobanter-crypto-playbook': {
    title: 'Crypto Market Analysis Playbook',
    sections: ['Macro Cycles & BTC Dominance', 'Altcoin Rotation Strategy', 'DeFi Alpha & Yield Farming', 'On-Chain Analysis Basics'],
    previewText: 'Understanding Bitcoin dominance (BTC.D) is the single most important skill in crypto trading. When BTC dominance rises, capital flows from altcoins into Bitcoin — this is "alt season ending." When it falls, capital rotates into altcoins — this is where 10-100x gains happen. Track BTC.D on the weekly chart. A break below 50% historically signals the start of alt season. During this phase, focus on large-cap altcoins first (ETH, SOL, AVAX), then mid-caps, then small-caps. The rotation follows a predictable waterfall pattern...',
  },
  'mentor-humbled-risk-management': {
    title: 'Risk-First Day Trading Guide',
    sections: ['The Reality of Day Trading', 'Position Sizing That Protects You', 'Emotional Discipline Framework', 'Building Consistent Habits'],
    previewText: 'Here\'s the truth nobody tells you on YouTube: 90% of day traders lose money. Not because trading doesn\'t work, but because most people skip the boring part — risk management. Before you learn any strategy, you need to answer: "How much am I willing to lose today?" Set a hard daily loss limit of 1-2% of your account. When you hit it, close your platform. No exceptions. This single rule will save your account while you learn. Position sizing follows: if your daily max loss is $200 and your stop loss on a trade is $0.50 per share...',
  },
  'mentor-ttchannel-technical-systems': {
    title: 'Technical Analysis Systems Guide',
    sections: ['Supply & Demand Zone Mapping', 'Order Flow Fundamentals', 'Multi-Timeframe Confluence', 'Backtesting Your Edge'],
    previewText: 'Supply and demand zones are not the same as support and resistance. Support and resistance are horizontal lines; supply and demand zones are areas where institutional orders cluster. To identify a demand zone: find a strong bullish move that left a base of 1-3 candles before the impulse. Draw a rectangle from the low of the base to the open of the last bearish candle before the rally. This zone represents unfilled buy orders. When price returns to this zone, institutional buyers are likely to step in again...',
  },
  'mentor-umar-momentum-swings': {
    title: 'Momentum Swing Trading Guide',
    sections: ['Finding Momentum Before the Crowd', 'Sector Rotation Timing', 'Breakout Pattern Recognition', 'Scaling Into Winners'],
    previewText: 'Momentum trading is about being early, not first. You don\'t need to catch the bottom — you need to catch the acceleration. Use relative strength (RS) to find stocks outperforming the market. When the S&P 500 pulls back 2% and a stock only dips 0.5%, that stock has institutional support. Build a watchlist of 20-30 high-RS names each week. When the broader market stabilizes or bounces, these stocks will lead the rally. Enter on a breakout above a clean resistance level with volume confirmation...',
  },
  'mentor-cryptoface-leverage-guide': {
    title: 'Crypto Leverage Trading Guide',
    sections: ['Understanding Leverage & Liquidation', 'Order Flow & Liquidation Maps', 'Risk-Adjusted Leverage Strategy', 'Advanced BTC/ETH Setups'],
    previewText: 'Leverage is a tool, not a strategy. Using 50x leverage doesn\'t make you 50x more profitable — it makes you 50x more likely to get liquidated. Smart leverage trading starts with understanding liquidation prices. At 10x leverage on a BTC long, a 10% drop liquidates your position. At 3x, you can withstand a 33% drawdown. For most traders, 2-5x leverage is the sweet spot — enough amplification to make meaningful gains, low enough to survive normal market volatility...',
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="wallet-copy-btn"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
    >
      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
    </button>
  );
}

const mentorVideoIds: Record<string, string> = {
  'Trader Mayne': '-Y0jslIFFGM', 'Chart Fanatics': 'yW6c0K8uGvw',
  'The Traveling Trader': 'chahOEXjQRE', 'NBB Trader': 'CLyhuudwq24', JadeCap: 'gZLj1fqVtsQ', '@socialcapofficial': 'CefxjriF-N8', Brando: 'lcBNWiCn1Uo',
  '@TrencherMatt': '3YRJ4Jblzvg', '@OrangieWEB3': 'dVxtJGybGfI', '@CryptoGorilla': '3YRJ4Jblzvg', '@itsvladify': '85qG_F9X0w'
};

function MentorVideoModal({ mentor, onClose, paid }: { mentor: Mentor; onClose: () => void; paid: boolean }) {
  const [locked, setLocked] = useState(false);
  const videoId = mentor.youtube_video_id || mentorVideoIds[mentor.name];
  useEffect(() => {
    if (paid) return;
    const timer = window.setTimeout(() => setLocked(true), 60_000);
    return () => window.clearTimeout(timer);
  }, [paid]);
  return (
    <div className="mentor-video-overlay" onClick={onClose}>
      <div className="mentor-video-modal" onClick={e => e.stopPropagation()}>
        <button className="pdf-preview-close" onClick={onClose}><X size={18} /></button>
        <div className="mentor-video-frame">
          {!videoId && <div className="mentor-video-unavailable"><Video size={28} /><h3>Video being verified</h3><p>This mentor’s educational video is being reviewed and will be available shortly.</p></div>}
          {videoId && <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title={`${mentor.name} strategy video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
          {locked && <div className="mentor-video-paywall"><Lock size={28} /><h3>Your preview has ended</h3><p>Complete the $150 registration payment from your dashboard to continue watching full mentor videos and unlock the complete BTE workspace.</p><a href="/account/dashboard"><Shield size={14} /> Open payment dashboard</a></div>}
        </div>
        <div className="mentor-video-caption"><span className="catalog-kicker">VIDEO PLAYBOOK · PLAYS HERE</span><h2>{mentor.specialty}</h2><p>with <strong>{mentor.name}</strong> · {mentor.youtube_channel || 'BTE mentor'}</p></div>
      </div>
    </div>
  );
}

function PdfPreviewModal({ mentor, onClose, hasAccess }: { mentor: Mentor; onClose: () => void; hasAccess: boolean }) {
  const slug = mentor.guide_pdf?.replace('/guides/', '').replace('.pdf', '') || '';
  const preview = guidePreview[slug];
  if (!preview) return null;

  return (
    <div className="pdf-preview-overlay" onClick={onClose}>
      <div className="pdf-preview-modal" onClick={e => e.stopPropagation()}>
        <button className="pdf-preview-close" onClick={onClose}><X size={18} /></button>
        <div className="pdf-preview-header">
          <FileText size={24} />
          <div>
            <h2>{preview.title}</h2>
            <p>by <strong>{mentor.name}</strong> {mentor.youtube_channel && <span>({mentor.youtube_channel})</span>}</p>
          </div>
        </div>

        <div className="pdf-preview-toc">
          <h4>Table of Contents</h4>
          <ol>
            {preview.sections.map((s, i) => (
              <li key={i}><span>{i + 1}.</span> {s}</li>
            ))}
          </ol>
        </div>

        <div className="pdf-preview-content">
          <h4>{preview.sections[0]}</h4>
          <p>{preview.previewText}</p>
        </div>

        {!hasAccess && (
          <div className="pdf-paywall-overlay">
            <div className="pdf-paywall-fade" />
            <div className="pdf-paywall-card">
              <Lock size={28} />
              <h3>Continue reading</h3>
              <p>This guide is exclusive to BTE mentorship students. Create your BTE account and complete the registration step from your dashboard to unlock the learning library.</p>
              <a href="#student-access" onClick={(e) => { e.preventDefault(); onClose(); const el = document.querySelector('[data-tab="student"]'); if (el instanceof HTMLElement) el.click(); }}>
                <Shield size={14} /> Create account to unlock
              </a>
            </div>
          </div>
        )}

        {hasAccess && (
          <div className="pdf-full-access">
            <a href={mentor.guide_pdf} download className="pdf-download-btn">
              <FileText size={15} /> Download Full Guide (PDF)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MentorshipPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<'strategies' | 'mentors' | 'apply' | 'student'>('strategies');
  const [studentForm, setStudentForm] = useState({ fullName: '', email: '', paymentReference: '' });
  const [studentAccess, setStudentAccess] = useState<{ payment_status: string; approval_status: string; notion_access_enabled: number; notionUrl: string | null } | null>(null);
  const [studentResult, setStudentResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', specialty: '', bio: '', experienceYears: '', markets: 'Stocks' });
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [previewMentor, setPreviewMentor] = useState<Mentor | null>(null);
  const [videoMentor, setVideoMentor] = useState<Mentor | null>(null);
  const [registrationPaid, setRegistrationPaid] = useState(false);

  const hasStudentAccess = studentAccess?.notion_access_enabled === 1;

  useEffect(() => {
    fetch('/api/mentorship').then(r => r.json()).then(d => {
      setStrategies(d.strategies || []);
      setMentors(d.mentors || []);
      setWallets(d.wallets || []);
    });
    const token = localStorage.getItem('bte-user-token');
    if (token) fetch('/api/user?section=dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).then(d => setRegistrationPaid(Boolean(d?.profile?.registration_fee_paid))).catch(() => undefined);
    if (token) fetch('/api/mentorship?section=student', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).then(d => d && setStudentAccess(d.subscription ? { ...d.subscription, notionUrl: d.notionUrl } : null));
  }, []);

  const categories = ['All', 'Stocks', 'Options', 'Futures', 'Forex', 'Crypto', 'Memecoin', 'Swing Trading', 'Day Trading', 'Mindset', ...Array.from(new Set(strategies.map(s => s.category))).filter(c => !['All', 'Stocks', 'Options', 'Futures', 'Forex', 'Crypto', 'Memecoin', 'Swing Trading', 'Day Trading', 'Mindset'].includes(c))];
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = strategies.filter(s => s.trader_name !== 'Ariel' && s.trader_name !== 'Ariel Hernandez').filter(s => {
    const matchesFilter = filter === 'All' || s.category === filter;
    const haystack = `${s.title} ${s.trader_name} ${s.description} ${s.markets}`.toLowerCase();
    return matchesFilter && (!normalizedSearch || haystack.includes(normalizedSearch));
  });

  async function handleStudentRegistration(e: React.FormEvent) {
    e.preventDefault(); setStudentResult(null);
    const token = localStorage.getItem('bte-user-token');
    if (!token) { setStudentResult({ type: 'error', message: 'Please create or sign in to your BTE account before registering.' }); return; }
    try {
      const res = await fetch('/api/mentorship', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'register-student', ...studentForm }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      setStudentResult({ type: 'success', message: data.message });
      setStudentForm({ fullName: '', email: '', paymentReference: '' });
    } catch (err) { setStudentResult({ type: 'error', message: err instanceof Error ? err.message : 'Registration failed.' }); }
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setResult(null);
    try {
      const token = localStorage.getItem('bte-user-token');
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ action: 'apply-mentor', ...form, experienceYears: parseInt(form.experienceYears) || 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult({ type: 'success', message: data.message });
      setForm({ name: '', email: '', specialty: '', bio: '', experienceYears: '', markets: 'Stocks' });
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Application failed.' });
    } finally { setSubmitting(false); }
  }

  return (
    <main className="terminal-shell">
      <div className="mentorship-page">
        <div className="mentorship-hero">
          <p className="eyebrow"><span className="eyebrow-line" />TRADING EDUCATION</p>
          <h1>Master the markets with battle-tested strategies.</h1>
          <p className="mentorship-hero-sub">
            Access trading playbooks from consistently profitable traders, verified by track record.
            Learn the frameworks behind millions in real returns.
          </p>
          <div className="mentorship-hero-stats">
            <div className="mh-stat"><BookOpen size={18} /><strong>{strategies.length}</strong><span>Strategies</span></div>
            <div className="mh-stat"><Users size={18} /><strong>{mentors.length}</strong><span>Active Mentors</span></div>
            <div className="mh-stat"><DollarSign size={18} /><strong>Included</strong><span>Student Access</span></div>
            <div className="mh-stat"><Award size={18} /><strong>Verified</strong><span>Profitable Traders</span></div>
          </div>
        </div>

        <div className="mentorship-tabs">
          <button className={tab === 'strategies' ? 'mt-active' : ''} onClick={() => setTab('strategies')}>
            <BarChart3 size={15} /> Strategies & Playbooks
          </button>
          <button className={tab === 'mentors' ? 'mt-active' : ''} onClick={() => setTab('mentors')}>
            <Users size={15} /> Expert Mentors
          </button>
          <button className={tab === 'apply' ? 'mt-active' : ''} onClick={() => setTab('apply')}>
            <Send size={15} /> Become a Mentor
          </button>
          <button data-tab="student" className={tab === 'student' ? 'mt-active' : ''} onClick={() => setTab('student')}>
            <Shield size={15} /> Student Access
          </button>
        </div>

        {tab === 'strategies' && (
          <section className="mentorship-section">
            <div className="strategy-search-wrap">
              <input className="strategy-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search strategies or mentors" aria-label="Search strategies or mentors" />
            </div>
            <div className="strategy-filters">
              {categories.map(c => (
                <button key={c} className={filter === c ? 'sf-active' : ''} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
            <div className="strategy-grid">
              {filtered.map(s => {
                const concepts: string[] = JSON.parse(s.key_concepts || '[]');
                const isOpen = expanded === s.id;
                return (
                  <div className="strategy-card" key={s.id}>
                    <div className="strategy-card-header">
                      <div className="strategy-card-cat">
                        {categoryIcon[s.category] || <Target size={16} />}
                        <span>{s.category}</span>
                      </div>
                      <span className="strategy-difficulty" style={{ color: difficultyColor[s.difficulty], borderColor: difficultyColor[s.difficulty] }}>{s.difficulty}</span>
                    </div>
                    <h3>{s.title}</h3>
                    <p className="strategy-trader">by <strong>{s.trader_name}</strong></p>
                    <p className="strategy-markets"><Target size={12} /> {s.markets}</p>
                    <p className="strategy-desc">{s.description}</p>
                    <button className="strategy-expand" onClick={() => setExpanded(isOpen ? null : s.id)}>
                      {isOpen ? 'Hide Details' : 'Key Concepts'} {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <ul className="strategy-concepts">
                        {concepts.map(c => <li key={c}><Shield size={12} />{c}</li>)}
                      </ul>
                    )}
                    {mentorVideoIds[s.trader_name] && <button className="strategy-video-btn" onClick={() => setVideoMentor({ id: s.id, name: s.trader_name, specialty: s.title, bio: s.description, experience_years: 0, markets: s.markets, telegram_handle: '', total_students: 0, rating: 0, youtube_channel: s.trader_name, youtube_video_id: mentorVideoIds[s.trader_name] })}><Video size={14} /> Watch {s.trader_name} video <Play size={12} fill="currentColor" /></button>}
                    <div className="strategy-footer">
                      <span className="strategy-source">Source: {s.source}</span>
                      <span className="strategy-free-badge">FREE</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="strategy-credit">
              <p>Strategies sourced from <strong>Chart Fanatics</strong> &mdash; The World&apos;s Best Trading Strategies. Free education from verified, profitable traders.</p>
            </div>
            <div className="learning-guides-panel" style={{ marginTop: 28, padding: 24, borderRadius: 14, background: 'linear-gradient(135deg, #102e3e, #174f59)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><FileText size={18} /><strong>Learning desk</strong></div>
              <p style={{ color: '#c8e3e3', maxWidth: 720 }}>Build a risk-first foundation before you copy a strategy or connect a wallet. These guides are educational resources, not promises of returns or instructions to trade.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }}>
                {[
                  ['Copy Trading Guide', '/guides/copy-trading-guide.pdf'],
                  ['Crypto & Digital Assets', '/guides/crypto-digital-assets-guide.pdf'],
                  ['Memecoin Safety & Rug Pulls', '/guides/memecoin-safety-guide.pdf'],
                ].map(([label, href]) => (
                  <a key={href} href={href} download style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 9, background: '#ffffff18', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
                    <FileText size={15} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === 'student' && (
          <section className="mentorship-section">
            <div className="mentor-apply-wrap">
              <div className="mentor-apply-info">
                <h2>Join the mentorship class</h2>
                <p>Get full access to all mentor guides, copy trading documents, and the private mentorship class after completing your BTE account registration from the dashboard.</p>

                <div className="apply-fee-box">
                  <h4><DollarSign size={16} /> Account registration</h4>
                  <div className="apply-fee-amount">$150 <span>shown on your dashboard</span></div>
                  <p>Create your account first. Your $150 registration payment instructions and verification status appear in your personal dashboard.</p>
                </div>

                {wallets.length > 0 && (
                  <div className="mentorship-wallets">
                    <h4><Wallet size={16} /> Payment Wallets</h4>
                    {wallets.map(w => (
                      <div key={w.blockchain_network} className="mentorship-wallet-row">
                        <div className="wallet-network-badge">{w.blockchain_network}</div>
                        <div className="wallet-address-wrap">
                          <code className="wallet-address-code">{w.receiving_address}</code>
                          <CopyButton text={w.receiving_address} />
                        </div>
                      </div>
                    ))}
                    <p className="wallet-note">Payment instructions for account registration are shown in your dashboard after you create an account.</p>
                  </div>
                )}

                <div className="apply-fee-box" style={{ marginTop: 16 }}>
                  <h4>Access status</h4>
                  <div className="apply-fee-amount">
                    {studentAccess?.notion_access_enabled ? 'Approved' : studentAccess ? 'Under review' : 'Not registered'}
                    <span>admin-controlled access</span>
                  </div>
                  <p>{studentAccess ? `Payment: ${studentAccess.payment_status} · Approval: ${studentAccess.approval_status}` : 'Sign in and submit your payment reference to begin.'}</p>
                  {studentAccess?.notion_access_enabled && studentAccess.notionUrl && (
                    <a className="apply-payment-link" href={studentAccess.notionUrl} target="_blank" rel="noreferrer"><BookOpen size={16} /><span>Open private mentorship guide</span></a>
                  )}
                </div>
              </div>

              <form className="mentor-apply-form" onSubmit={handleStudentRegistration}>
                <h3>Student registration</h3>
                <div className="student-fee-reminder">
                  <DollarSign size={16} />
                  <span>Registration: <strong>$150</strong> — Complete payment from your account dashboard</span>
                </div>
                {studentResult && <div className={`invest-alert invest-alert-${studentResult.type}`}>{studentResult.message}</div>}
                <label>Full name *<input value={studentForm.fullName} onChange={e => setStudentForm(p => ({ ...p, fullName: e.target.value }))} required /></label>
                <label>Email *<input type="email" value={studentForm.email} onChange={e => setStudentForm(p => ({ ...p, email: e.target.value }))} required /></label>
                <label>Payment reference / transaction hash *<input value={studentForm.paymentReference} onChange={e => setStudentForm(p => ({ ...p, paymentReference: e.target.value }))} placeholder="Paste the transaction hash from your dashboard payment" required /></label>
                <button type="submit">Submit for approval <Send size={14} /></button>
              </form>
            </div>
          </section>
        )}

        {tab === 'mentors' && (
          <section className="mentorship-section">
            <div className="mentor-grid">
              {mentors.map(m => (
                <div className="mentor-card" key={m.id}>
                  <div className="mentor-avatar">{m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                  <h3>{m.name}</h3>
                  {m.youtube_channel && (
                    <div className="mentor-youtube-badge"><Video size={13} /> {m.youtube_channel}</div>
                  )}
                  <p className="mentor-specialty">{m.specialty}</p>
                  <p className="mentor-bio">{m.bio}</p>
                  <div className="mentor-meta">
                    <span><Award size={12} /> {m.experience_years}yr exp</span>
                    <span><Users size={12} /> {m.total_students} students</span>
                    <span><Star size={12} /> {m.rating}/5</span>
                  </div>
                  <div className="mentor-markets"><Target size={12} /> {m.markets}</div>
                  <button className="mentor-video-btn" onClick={() => setVideoMentor(m)}><Video size={14} /> Watch mentor video <Play size={12} fill="currentColor" /></button>
                  {m.guide_pdf && (
                    <button className="mentor-guide-btn" onClick={() => setPreviewMentor(m)}>
                      <Eye size={14} />
                      <span>Preview Trading Guide</span>
                      {!hasStudentAccess && <Lock size={11} />}
                    </button>
                  )}
                  <div className="mentor-contact">
                    <MessageCircle size={14} />
                    <span>Contact via Live Chat</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mentor-cta-box">
              <h3>Want to share your expertise?</h3>
              <p>Join our mentor network and educate the next generation of traders. Registration fee: <strong>$500</strong> (one-time, paid to admin).</p>
              <button className="mentor-cta-btn" onClick={() => setTab('apply')}>Apply to Become a Mentor <Send size={14} /></button>
            </div>
          </section>
        )}

        {tab === 'apply' && (
          <section className="mentorship-section">
            <div className="mentor-apply-wrap">
              <div className="mentor-apply-info">
                <h2>Become a BTE Mentor</h2>
                <p>Share your trading expertise and earn by educating others on the BTE platform.</p>
                <div className="apply-benefits">
                  <div className="apply-benefit"><Shield size={18} /><div><strong>Platform Access</strong><span>Reach thousands of active traders and investors</span></div></div>
                  <div className="apply-benefit"><BarChart3 size={18} /><div><strong>Your Strategies</strong><span>Publish and showcase your trading playbooks</span></div></div>
                  <div className="apply-benefit"><Users size={18} /><div><strong>Build Following</strong><span>Grow your student base and reputation</span></div></div>
                  <div className="apply-benefit"><Award size={18} /><div><strong>Verified Badge</strong><span>Get verified as a profitable trader on BTE</span></div></div>
                </div>
                <div className="apply-fee-box">
                  <h4>Registration Fee</h4>
                  <div className="apply-fee-amount">$500 <span>one-time payment</span></div>
                  <p>Paid via cryptocurrency upon approval. Visit the Payments page for wallet addresses.</p>
                  <a href="/payments" className="apply-payment-link">
                    <Shield size={16} />
                    <span>View Payment Methods &amp; Wallet Addresses</span>
                  </a>
                </div>
              </div>
              <form className="mentor-apply-form" onSubmit={handleApply}>
                <h3>Mentor Application</h3>
                {result && <div className={`invest-alert invest-alert-${result.type}`}>{result.message}</div>}
                <label>Full Name *<input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></label>
                <label>Email *<input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></label>
                <label>Trading Specialty *<input value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))} placeholder="e.g. Options Swing Trading, Forex Day Trading" required /></label>
                <label>Markets
                  <select value={form.markets} onChange={e => setForm(p => ({ ...p, markets: e.target.value }))}>
                    <option>Stocks</option><option>Options</option><option>Futures</option>
                    <option>Forex</option><option>Crypto</option><option>Stocks, Options</option>
                    <option>Futures, Forex</option><option>All Markets</option>
                  </select>
                </label>
                <label>Years of Experience<input type="number" min="1" max="50" value={form.experienceYears} onChange={e => setForm(p => ({ ...p, experienceYears: e.target.value }))} /></label>
                <label>Bio / Trading Background *<textarea rows={4} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Describe your trading experience, track record, and teaching approach..." required /></label>
                <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'} {!submitting && <Send size={14} />}</button>
              </form>
            </div>
          </section>
        )}
      </div>

      {previewMentor && (
        <PdfPreviewModal mentor={previewMentor} onClose={() => setPreviewMentor(null)} hasAccess={hasStudentAccess} />
      )}
      {videoMentor && <MentorVideoModal mentor={videoMentor} onClose={() => setVideoMentor(null)} paid={registrationPaid} />}
    </main>
  );
}
