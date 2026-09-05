'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, CircleHelp, Eye, FileText, LockKeyhole, Menu, Play, ShieldCheck, Sparkles, Users, Wallet, X } from 'lucide-react';
import { useState } from 'react';

const strategies = [
  { name: 'Atlas Balanced', type: 'Multi-asset allocation', returnValue: '+18.42%', risk: 'Moderate', followers: '2,841', accent: '#6a45e8', bars: [28, 42, 35, 58, 51, 73, 66, 88] },
  { name: 'Digital Conviction', type: 'Crypto trend rotation', returnValue: '+31.76%', risk: 'Growth', followers: '1,926', accent: '#a15cf4', bars: [32, 24, 48, 40, 61, 56, 74, 92] },
  { name: 'Core Momentum', type: 'Rules-based equities', returnValue: '+12.08%', risk: 'Balanced', followers: '4,108', accent: '#d483e8', bars: [44, 38, 52, 49, 64, 57, 71, 78] },
];

const steps = [
  ['01', 'Explore', 'Compare transparent strategy profiles, risk posture, drawdown history, and the logic behind each approach.'],
  ['02', 'Start in paper mode', 'Build conviction with a simulated workspace before connecting any production account or committing capital.'],
  ['03', 'Set your guardrails', 'Choose allocation limits, review cadence, and stop-copy conditions before automation is ever considered.'],
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="bte-landing human-landing">
      <header className="human-nav">
        <Link className="human-brand" href="/" aria-label="Blockchain Trust Enterprise home">
          <span className="human-mark"><i /><i /><i /></span>
          <span><b>Blockchain Trust</b><small>Enterprise Markets</small></span>
        </Link>
        <nav className={menuOpen ? 'human-links open' : 'human-links'} aria-label="Primary navigation">
          <a href="#strategies" onClick={() => setMenuOpen(false)}>Strategies</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="/mentorship" onClick={() => setMenuOpen(false)}>Mentorship</a>
          <a href="#security" onClick={() => setMenuOpen(false)}>Security</a>
        </nav>
        <div className="human-actions">
          <a className="human-signin" href="/account">Sign in</a>
          <a className="human-cta" href="/account">Open workspace <ArrowRight size={15} /></a>
          <button className="human-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <section className="human-hero">
        <div className="human-hero-copy">
          <div className="human-eyebrow"><span /> A clearer way to follow the markets</div>
          <h1>Trade with context.<br /><em>Stay in control.</em></h1>
          <p className="human-lede">A transparent copy-trading workspace for people who want to understand the strategy, set the boundaries, and make the next decision with confidence.</p>
          <div className="human-actions-row"><a className="human-primary" href="/account">Explore the paper workspace <ArrowRight size={17} /></a><a className="human-secondary" href="#process"><Play size={14} fill="currentColor" /> See how it works</a></div>
          <div className="human-proof"><span><CheckCircle2 size={15} /> Paper mode first</span><span><CheckCircle2 size={15} /> Guardrails built in</span><span><CheckCircle2 size={15} /> No return guarantees</span></div>
        </div>
        <div className="human-console" aria-label="Illustrative strategy preview">
          <div className="human-console-orb" />
          <div className="human-console-top"><span><i /> Live strategy desk</span><span>Paper environment · USD</span></div>
          <div className="human-console-title"><div><small>PORTFOLIO SIGNAL</small><h3>Atlas Balanced</h3><p>Multi-asset · Moderate risk</p></div><span className="human-console-badge">+18.42%</span></div>
          <div className="human-console-chart"><div className="human-console-y"><span>120</span><span>100</span><span>80</span><span>60</span></div><svg viewBox="0 0 500 150" preserveAspectRatio="none" aria-label="Illustrative strategy performance chart"><defs><linearGradient id="humanArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c5a8ff" stopOpacity=".42" /><stop offset="100%" stopColor="#c5a8ff" stopOpacity="0" /></linearGradient></defs><path d="M0 123 C 24 115 32 119 49 108 S 81 111 96 93 S 126 102 144 82 S 176 89 194 76 S 222 86 240 66 S 271 72 288 55 S 317 67 337 50 S 366 52 383 38 S 417 45 437 28 S 468 30 500 12 L500 150 L0 150Z" fill="url(#humanArea)" /><path d="M0 123 C 24 115 32 119 49 108 S 81 111 96 93 S 126 102 144 82 S 176 89 194 76 S 222 86 240 66 S 271 72 288 55 S 317 67 337 50 S 366 52 383 38 S 417 45 437 28 S 468 30 500 12" fill="none" stroke="#c6a6ff" strokeWidth="3" strokeLinecap="round" /></svg></div>
          <div className="human-console-stats"><span><small>30D return</small><b>+6.84%</b></span><span><small>Max drawdown</small><b className="gold">-4.21%</b></span><span><small>Followers</small><b>2,841</b></span></div>
          <div className="human-console-footer"><span><ShieldCheck size={14} /> Guardrails active</span><a href="/account">View strategy <ChevronRight size={14} /></a></div>
        </div>
      </section>

      <section className="human-trust-strip"><span>Designed for thoughtful participation</span><div><span><ShieldCheck size={16} /> Explainable by design</span><span><LockKeyhole size={16} /> Your keys, your control</span><span><Eye size={16} /> Clear risk visibility</span></div></section>

      <section className="human-section human-strategy-section" id="strategies"><div className="human-section-heading"><div><div className="human-kicker"><Sparkles size={14} /> Curated strategy desk</div><h2>Find a framework<br /><span>you can explain.</span></h2></div><p>Explore example strategies in a paper environment. Performance figures are illustrative and do not predict future results.</p></div><div className="human-strategy-cards">{strategies.map((strategy) => <article className="human-strategy-card" key={strategy.name}><div className="human-strategy-head"><span className="human-strategy-icon" style={{ background: `${strategy.accent}16`, color: strategy.accent }}><BarChart3 size={18} /></span><span className="human-strategy-status"><i /> Active research</span></div><h3>{strategy.name}</h3><p>{strategy.type}</p><div className="human-preview-chart">{strategy.bars.map((height, index) => <i key={index} style={{ height: `${height}%`, background: strategy.accent }} />)}</div><div className="human-strategy-data"><span><small>Illustrative return</small><b style={{ color: strategy.accent }}>{strategy.returnValue}</b></span><span><small>Risk posture</small><b>{strategy.risk}</b></span></div><div className="human-strategy-foot"><span><Users size={13} /> {strategy.followers} following</span><a href="/account">View details <ArrowRight size={13} /></a></div></article>)}</div><a className="human-section-link" href="/account/dashboard">Open full strategy workspace <ArrowRight size={15} /></a></section>

      <section className="human-section human-process-section" id="process"><div className="human-section-heading human-process-heading"><div><div className="human-kicker"><CircleHelp size={14} /> A measured path</div><h2>Automation is optional.<br /><span>Understanding is not.</span></h2></div><p>BTE is designed to help you learn the logic, define the boundaries, and stay informed at every stage.</p></div><div className="human-process-grid">{steps.map(([number, title, body]) => <div className="human-process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><ArrowRight size={17} /></div>)}</div></section>

      <section className="human-section human-split-section" id="security"><div className="human-split-card human-security-card"><div className="human-kicker"><ShieldCheck size={14} /> Control layer</div><h2>Clear signals.<br /><span>Defined limits.</span></h2><p>Every workspace is built around visibility: paper accounts, allocation boundaries, strategy notes, and a clear stop-copy path.</p><a href="/account">See the control layer <ArrowRight size={15} /></a></div><div className="human-split-card human-learn-card"><div className="human-kicker"><FileText size={14} /> BTE learning desk</div><h2>Learn before<br /><span>you allocate.</span></h2><p>Download free guides on copy trading, digital assets, and memecoin safety. Join mentorship when you are ready for structured support.</p><a href="/academy">Open learning desk <ArrowRight size={15} /></a></div></section>

      <section className="human-bottom-cta"><div><div className="human-kicker"><Wallet size={14} /> Start with clarity</div><h2>Your next decision<br /><span>deserves context.</span></h2></div><div><p>Create a paper workspace and explore the platform before making any live-market decision.</p><a className="human-primary" href="/account">Create your workspace <ArrowRight size={17} /></a></div></section>
      <footer className="human-footer"><Link className="human-brand" href="/"><span className="human-mark"><i /><i /><i /></span><span><b>Blockchain Trust</b><small>Enterprise Markets</small></span></Link><span>Educational platform · Paper workspace · No guaranteed returns</span><span>© 2026 BTE</span></footer>
    </main>
  );
}
