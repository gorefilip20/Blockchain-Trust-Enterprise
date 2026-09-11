'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

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

const guides = [
  { time: '8 min read', title: 'Understanding copy trading', body: 'A practical overview of how copy trading works, what risks to weigh, and how guardrails help you stay within your own boundaries.', tag: 'PDF · Free' },
  { time: '6 min read', title: 'Custody and keys', body: 'An explanation of self-custody, multi-sig wallets, and why understanding your key setup matters before allocating capital.', tag: 'PDF · Free' },
  { time: '5 min read', title: 'Memecoin safety guide', body: 'A checklist-based approach to investigating memecoin risks — liquidity locks, holder concentration, contract permissions, and red flags.', tag: 'PDF · Free' },
  { time: '10 min read', title: 'Entity structuring 101', body: 'Why a dual-state structure (Delaware + Wyoming) protects your assets and how the parent-subsidiary model works for crypto holders.', tag: 'PDF · Free' },
  { time: '7 min read', title: 'Reading drawdown', body: 'Returns tell you what happened. Drawdown tells you what the journey felt like. Learn to read both before following a strategy.', tag: 'PDF · Free' },
  { time: '4 min read', title: 'Setting guardrails', body: 'How to define allocation limits, stop-copy conditions, and review cadences — so the platform works within your risk tolerance.', tag: 'PDF · Free' },
];

export default function AcademyPage() {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" />
      <style>{`
        .bte-academy-nav a:hover { color: ${C.accent} !important; }
        .bte-academy-card:hover { background: ${C.accentLight} !important; }
        .bte-academy-cta-btn:hover { background: ${C.accentHover} !important; }
        @media (max-width: 860px) {
          .bte-academy-grid { grid-template-columns: 1fr !important; }
          .bte-academy-hero { padding: 32px 24px !important; }
          .bte-academy-cta { padding: 40px 24px !important; }
        }
      `}</style>
      <main style={{ minHeight: '100vh', fontFamily: FONT, color: C.text, background: C.bg }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: `2px solid ${C.surface}` }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
            <LogoMark />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</div>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.45)' }}>Enterprise markets</div>
            </div>
          </Link>
          <div className="bte-academy-nav" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/#strategies" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(32,30,29,0.6)', textDecoration: 'none' }}>Strategies</Link>
            <Link href="/academy" style={{ fontSize: 13, fontWeight: 600, color: C.accent, textDecoration: 'none' }}>Academy</Link>
            <Link href="/contact" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(32,30,29,0.6)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="bte-academy-hero" style={{ padding: '56px 48px 40px', maxWidth: 900 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '2px solid rgba(32,30,29,0.25)', padding: '6px 12px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            <BookOpen size={14} /> BTE Learning desk
          </span>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.08, margin: '24px 0 0', letterSpacing: '-0.01em' }}>
            Learn before you<br /><span style={{ color: C.accent }}>allocate.</span>
          </h1>
          <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.65, color: 'rgba(32,30,29,0.6)', maxWidth: 520 }}>
            Guides, frameworks, and research to help you understand risk, custody, entity structuring, and the strategies available on the BTE platform.
          </p>
        </section>

        <div style={{ borderTop: `2px solid ${C.surface}` }} />

        {/* Card grid */}
        <section style={{ padding: '48px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="bte-academy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: C.surface }}>
            {guides.map((guide) => (
              <div key={guide.title} className="bte-academy-card" style={{ background: '#fff', padding: '28px 24px', display: 'flex', flexDirection: 'column', transition: 'background 0.15s' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.45)', marginBottom: 10 }}>{guide.time}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.25 }}>{guide.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(32,30,29,0.6)', flex: 1 }}>{guide.body}</p>
                <span style={{ display: 'inline-block', marginTop: 16, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '4px 10px', background: C.surface, color: 'rgba(32,30,29,0.5)' }}>{guide.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mentorship CTA band */}
        <section className="bte-academy-cta" style={{ background: C.ink, color: '#fff', padding: '56px 48px' }}>
          <div style={{ maxWidth: 700 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '2px solid rgba(255,255,255,0.3)', padding: '6px 12px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              <Sparkles size={14} /> 1-on-1 mentorship
            </span>
            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: '24px 0 0' }}>Get personal guidance from the BTE team.</h2>
            <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.65)', maxWidth: 500 }}>
              Book a session with our research team. Topics include entity formation, custody architecture, risk frameworks, and strategy selection.
            </p>
            <Link href="/contact" className="bte-academy-cta-btn" style={{ display: 'inline-block', marginTop: 24, background: C.accent, color: '#fff', padding: '14px 28px', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.15s' }}>
              Book a session <span style={{ marginLeft: 4 }}>→</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `2px solid ${C.surface}`, padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark size={24} />
            <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(32,30,29,0.4)' }}>Educational tools · Paper mode · No guaranteed returns</span>
          <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: C.text, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Back to BTE home <ChevronRight size={14} />
          </Link>
        </footer>
      </main>
    </>
  );
}
