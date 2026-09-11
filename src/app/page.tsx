'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, Eye, FileText, LockKeyhole, Menu, ShieldCheck, Sparkles, Users, Wallet, X } from 'lucide-react';
import { useState } from 'react';

const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', ink: '#2d2b2b', accent: '#6a3df0', accent600: '#5a2fd6', accent100: '#f1ecff', accent200: '#e0d4ff' };

const strategies = [
  { name: 'Atlas Balanced', type: 'Multi-asset allocation', returnValue: '+18.42%', risk: 'Moderate', followers: '2,841', bars: [28, 42, 35, 58, 51, 73, 66, 88] },
  { name: 'Digital Conviction', type: 'Crypto trend rotation', returnValue: '+31.76%', risk: 'Growth', followers: '1,926', bars: [32, 24, 48, 40, 61, 56, 74, 92] },
  { name: 'Core Momentum', type: 'Rules-based equities', returnValue: '+12.08%', risk: 'Balanced', followers: '4,108', bars: [44, 38, 52, 49, 64, 57, 71, 78] },
];

const steps = [
  ['01', 'Explore', 'Compare transparent strategy profiles, risk posture, drawdown history, and the logic behind each approach.'],
  ['02', 'Start in paper mode', 'Build conviction with a simulated workspace before connecting any production account or committing capital.'],
  ['03', 'Set your guardrails', 'Choose allocation limits, review cadence, and stop-copy conditions before automation is ever considered.'],
];

const ticker = [
  { symbol: 'BTC', price: '$78,700', change: '+1.2%' },
  { symbol: 'ETH', price: '$2,490', change: '+2.4%' },
  { symbol: 'SOL', price: '$103.00', change: '+3.1%' },
];

function LogoMark({ size = 32 }: { size?: number }) {
  const inner = Math.round(size * 12 / 32);
  const offset = Math.round((size - inner) / 2);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="1" y="1" width={size - 2} height={size - 2} stroke={C.text} strokeWidth="2" />
      <rect x={offset} y={offset} width={inner} height={inner} fill={C.accent} />
    </svg>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink: React.CSSProperties = { color: 'rgba(32,30,29,0.6)', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: FONT, letterSpacing: '0.02em' };
  const sectionWidth: React.CSSProperties = { width: 'min(1200px, calc(100% - 56px))', margin: '0 auto' };

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" />
      <style>{`
        .m-nav-link:hover { color: ${C.accent} !important; }
        .m-btn-ghost:hover { color: ${C.accent} !important; }
        .m-btn-solid:hover { background: ${C.accent600} !important; }
        .m-card:hover { border-color: ${C.accent} !important; }
        .m-link:hover { text-decoration: underline !important; }
        .m-mobile-nav { display: none; }
        .m-mobile-btn { display: none; }
        @media (max-width: 860px) {
          .m-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .m-strategy-grid { grid-template-columns: 1fr !important; }
          .m-process-grid { grid-template-columns: 1fr !important; }
          .m-split-grid { grid-template-columns: 1fr !important; }
          .m-desktop-links { display: none !important; }
          .m-desktop-signin { display: none !important; }
          .m-mobile-btn { display: grid !important; place-items: center; background: transparent; color: ${C.text}; }
          .m-mobile-nav.open { display: flex !important; }
          .m-bottom-cta-inner { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
          .m-footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>

      {/* Nav */}
      <header style={{ ...sectionWidth, height: 82, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'sticky', top: 0, zIndex: 10, background: C.bg }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 11, color: C.text, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{ lineHeight: 1.15 }}>
            <span style={{ display: 'block', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Blockchain Trust</span>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(32,30,29,0.55)' }}>Enterprise Markets</span>
          </span>
        </Link>

        <nav className="m-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 30, marginLeft: 'auto' }}>
          <a href="#strategies" className="m-nav-link" style={navLink}>Strategies</a>
          <a href="#process" className="m-nav-link" style={navLink}>How it works</a>
          <a href="/academy" className="m-nav-link" style={navLink}>Academy</a>
          <a href="#security" className="m-nav-link" style={navLink}>Security</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 19 }}>
          <a href="/account" className="m-desktop-signin m-btn-ghost" style={{ ...navLink, color: 'rgba(32,30,29,0.6)' }}>Sign in</a>
          <a href="/account" className="m-btn-solid" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 20px', background: C.accent, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 800, fontFamily: FONT, letterSpacing: '0.02em', borderRadius: 0, border: 'none' }}>
            Open workspace <ArrowRight size={15} />
          </a>
          <button className="m-mobile-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" style={{ border: 'none', cursor: 'pointer' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className={`m-mobile-nav ${menuOpen ? 'open' : ''}`} style={{ position: 'absolute', top: 75, left: 0, right: 0, flexDirection: 'column', gap: 18, padding: 20, background: '#fff', border: `2px solid ${C.surface}`, zIndex: 20 }}>
          <a href="#strategies" onClick={() => setMenuOpen(false)} style={navLink}>Strategies</a>
          <a href="#process" onClick={() => setMenuOpen(false)} style={navLink}>How it works</a>
          <a href="/academy" onClick={() => setMenuOpen(false)} style={navLink}>Academy</a>
          <a href="#security" onClick={() => setMenuOpen(false)} style={navLink}>Security</a>
          <a href="/account" onClick={() => setMenuOpen(false)} style={navLink}>Sign in</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="m-hero-grid" style={{ ...sectionWidth, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(420px,.86fr)', gap: 86, alignItems: 'center', minHeight: 580, padding: '40px 0 80px' }}>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `2px solid ${C.accent}`, padding: '7px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: C.accent }}>
            <Sparkles size={14} /> A clearer way to follow the markets
          </span>

          <h1 style={{ marginTop: 24, fontSize: 'clamp(42px, 5.5vw, 58px)', lineHeight: 1.02, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Trade with context.<br />
            <span style={{ color: C.accent }}>Stay in control.</span>
          </h1>

          <p style={{ marginTop: 20, fontSize: 15, lineHeight: 1.7, color: 'rgba(32,30,29,0.6)', maxWidth: 520 }}>
            A transparent copy-trading workspace for people who want to understand the strategy, set the boundaries, and make the next decision with confidence.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 23, marginTop: 32 }}>
            <a href="/account" className="m-btn-solid" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 22px', background: C.accent, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 800, fontFamily: FONT, borderRadius: 0 }}>
              Explore the paper workspace <ArrowRight size={17} />
            </a>
            <a href="#process" className="m-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(32,30,29,0.55)', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              See how it works
            </a>
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: C.surface, margin: '36px 0' }} />

          {/* Crypto ticker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            {ticker.map((t) => (
              <span key={t.symbol} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <span style={{ fontWeight: 800, color: C.text }}>{t.symbol}</span>
                <span style={{ color: 'rgba(32,30,29,0.6)' }}>{t.price}</span>
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 12 }}>{t.change}</span>
              </span>
            ))}
          </div>
          <span style={{ display: 'block', marginTop: 8, fontSize: 10, color: 'rgba(32,30,29,0.4)', letterSpacing: '0.04em' }}>
            Illustrative snapshot · Sept 9 2026
          </span>
        </div>

        {/* Dark strategy panel */}
        <div style={{ background: C.ink, padding: 28, minHeight: 430, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>Live strategy desk</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Paper environment · USD</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40 }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Portfolio signal</span>
              <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 8 }}>Atlas Balanced</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 4 }}>Multi-asset · Moderate risk</p>
            </div>
            <span style={{ color: C.accent, fontSize: 22, fontWeight: 800, fontFamily: FONT }}>+18.42%</span>
          </div>

          {/* Straight-line sparkline */}
          <svg viewBox="0 0 500 120" preserveAspectRatio="none" style={{ width: '100%', height: 120, marginTop: 28, display: 'block' }}>
            <polyline
              points="0,100 62,88 125,72 187,80 250,55 312,62 375,40 437,30 500,10"
              fill="none"
              stroke={C.accent}
              strokeWidth="2"
              strokeLinejoin="miter"
            />
          </svg>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {[['30D return', '+6.84%'], ['Max drawdown', '-4.21%'], ['Followers', '2,841']].map(([label, val]) => (
              <div key={label} style={{ flex: 1, paddingTop: 14 }}>
                <span style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{label}</span>
                <b style={{ display: 'block', color: '#fff', fontSize: 14, fontWeight: 700, marginTop: 6 }}>{val}</b>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: 11 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
              <ShieldCheck size={14} /> Guardrails active
            </span>
            <a href="/account" style={{ color: C.accent, textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              View strategy <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div style={{ borderTop: `2px solid ${C.surface}`, borderBottom: `2px solid ${C.surface}`, padding: '16px max(28px, calc((100% - 1200px) / 2))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap', fontSize: 12, color: 'rgba(32,30,29,0.55)' }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const, fontSize: 11 }}>Designed for thoughtful participation</span>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: C.text }}><ShieldCheck size={16} color={C.accent} /> Explainable by design</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: C.text }}><LockKeyhole size={16} color={C.accent} /> Your keys, your control</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: C.text }}><Eye size={16} color={C.accent} /> Clear risk visibility</span>
        </div>
      </div>

      {/* Strategy cards */}
      <section id="strategies" style={{ ...sectionWidth, padding: '100px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, alignItems: 'flex-end', marginBottom: 44 }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              <Sparkles size={14} /> Curated strategy desk
            </span>
            <h2 style={{ marginTop: 18, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Find a framework<br /><span style={{ color: C.accent }}>you can explain.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, color: 'rgba(32,30,29,0.55)', fontSize: 13, lineHeight: 1.7 }}>
            Explore example strategies in a paper environment. Performance figures are illustrative and do not predict future results.
          </p>
        </div>

        <div className="m-strategy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: C.surface }}>
          {strategies.map((s) => (
            <article key={s.name} className="m-card" style={{ padding: 24, background: '#fff', border: 'none' }}>
              <span style={{ display: 'block', color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                <BarChart3 size={14} style={{ verticalAlign: -2 }} /> Active research
              </span>
              <h3 style={{ marginTop: 22, fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>{s.name}</h3>
              <p style={{ color: 'rgba(32,30,29,0.5)', fontSize: 11, marginTop: 4 }}>{s.type}</p>

              <div style={{ height: 64, display: 'flex', alignItems: 'flex-end', gap: 4, margin: '24px 0 18px', borderBottom: `1px solid ${C.surface}` }}>
                {s.bars.map((h, i) => (
                  <i key={i} style={{ flex: 1, maxWidth: 28, height: `${h}%`, background: C.accent, display: 'block', opacity: 0.7 }} />
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ display: 'block', color: 'rgba(32,30,29,0.45)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Illustrative return</span>
                  <b style={{ color: C.accent, fontSize: 14, fontWeight: 800 }}>{s.returnValue}</b>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'rgba(32,30,29,0.45)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Risk posture</span>
                  <b style={{ fontSize: 13, fontWeight: 700 }}>{s.risk}</b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 14, borderTop: `2px solid ${C.surface}`, fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {s.followers} following</span>
                <a href="/account" style={{ color: C.accent, textDecoration: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>View details <ArrowRight size={13} /></a>
              </div>
            </article>
          ))}
        </div>

        <a href="/account/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, fontSize: 13, fontWeight: 800, color: C.accent, textDecoration: 'none' }}>
          Open full strategy workspace <ArrowRight size={15} />
        </a>
      </section>

      {/* Process */}
      <section id="process" style={{ ...sectionWidth, padding: '100px 0', borderTop: `2px solid ${C.surface}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, alignItems: 'flex-start', marginBottom: 44 }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              <CheckCircle2 size={14} /> A measured path
            </span>
            <h2 style={{ marginTop: 18, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Automation is optional.<br /><span style={{ color: C.accent }}>Understanding is not.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, color: 'rgba(32,30,29,0.55)', fontSize: 13, lineHeight: 1.7 }}>
            BTE is designed to help you learn the logic, define the boundaries, and stay informed at every stage.
          </p>
        </div>

        <div className="m-process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: C.surface }}>
          {steps.map(([num, title, body]) => (
            <div key={num} style={{ padding: 28, background: '#fff', minHeight: 220 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: C.accent100, display: 'block', lineHeight: 1 }}>{num}</span>
              <h3 style={{ marginTop: 24, fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ marginTop: 10, color: 'rgba(32,30,29,0.55)', fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security / Learning split */}
      <section id="security" style={{ ...sectionWidth, paddingBottom: 100 }}>
        <div className="m-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: C.surface }}>
          <div style={{ padding: 36, background: C.accent100, minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              <ShieldCheck size={14} /> Control layer
            </span>
            <h2 style={{ marginTop: 36, fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Clear signals.<br /><span style={{ color: C.accent }}>Defined limits.</span>
            </h2>
            <p style={{ marginTop: 18, maxWidth: 340, color: 'rgba(32,30,29,0.55)', fontSize: 13, lineHeight: 1.7 }}>
              Every workspace is built around visibility: paper accounts, allocation boundaries, strategy notes, and a clear stop-copy path.
            </p>
            <a href="/account" style={{ marginTop: 'auto', display: 'inline-flex', gap: 7, alignItems: 'center', color: C.accent, textDecoration: 'none', fontSize: 13, fontWeight: 800 }}>
              See the control layer <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ padding: 36, background: C.ink, color: '#fff', minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.accent200, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              <FileText size={14} /> BTE learning desk
            </span>
            <h2 style={{ marginTop: 36, fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Learn before<br /><span style={{ color: C.accent200 }}>you allocate.</span>
            </h2>
            <p style={{ marginTop: 18, maxWidth: 340, color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7 }}>
              Download free guides on copy trading, digital assets, and memecoin safety. Join mentorship when you are ready for structured support.
            </p>
            <a href="/academy" style={{ marginTop: 'auto', display: 'inline-flex', gap: 7, alignItems: 'center', color: C.accent200, textDecoration: 'none', fontSize: 13, fontWeight: 800 }}>
              Open learning desk <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA — full-bleed solid violet */}
      <section style={{ background: C.accent, padding: '64px max(28px, calc((100% - 1200px) / 2))' }}>
        <div className="m-bottom-cta-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40 }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              <Wallet size={14} /> Start with clarity
            </span>
            <h2 style={{ marginTop: 18, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Your next decision<br />deserves context.
            </h2>
          </div>
          <div style={{ maxWidth: 360 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Create a paper workspace and explore the platform before making any live-market decision.
            </p>
            <a href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 22px', background: '#fff', color: C.accent, textDecoration: 'none', fontSize: 13, fontWeight: 800, fontFamily: FONT, borderRadius: 0 }}>
              Create your workspace <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ ...sectionWidth, padding: '24px 0 32px', borderTop: `2px solid ${C.surface}` }}>
        <div className="m-footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: C.text, textDecoration: 'none' }}>
            <LogoMark size={24} />
            <span style={{ lineHeight: 1.15 }}>
              <span style={{ display: 'block', fontWeight: 800, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Blockchain Trust</span>
              <span style={{ display: 'block', fontSize: 9, color: 'rgba(32,30,29,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Enterprise Markets</span>
            </span>
          </Link>
          <span style={{ color: 'rgba(32,30,29,0.4)', fontSize: 11 }}>Educational platform · Paper workspace · No guaranteed returns</span>
          <span style={{ color: 'rgba(32,30,29,0.4)', fontSize: 11 }}>© 2026 BTE</span>
        </div>
      </footer>
    </main>
  );
}
