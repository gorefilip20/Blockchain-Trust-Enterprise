'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

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

const faqs = [
  { q: 'What jurisdictions do you work with?', a: 'We primarily form entities in Delaware (multi-member partnerships) and Wyoming (single-member anonymous LLCs). Each jurisdiction offers distinct privacy and tax advantages depending on your situation.' },
  { q: 'What entity types are available?', a: 'We offer Holding LLCs for long-term asset protection, Operating LLCs for active trading and mining, and DAO LLCs (Wyoming) for decentralized governance with legal entity protection.' },
  { q: 'How long does the formation process take?', a: 'A standard dual-state formation (Delaware parent + Wyoming subsidiary) typically completes in 10–15 business days. Expedited filings are available for time-sensitive situations.' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', who: 'investor', goals: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', border: '2px solid rgba(32,30,29,0.25)', background: '#fff', fontSize: 14, fontFamily: FONT, color: C.text, boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.text };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" />
      <style>{`
        .bte-contact-input::placeholder { color: rgba(32,30,29,0.35); }
        .bte-contact-input:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px rgba(106,61,240,0.18); }
        .bte-contact-submit:hover:not(:disabled) { background: ${C.accentHover} !important; }
        .bte-contact-nav a:hover { color: ${C.accent} !important; }
        @media (max-width: 860px) {
          .bte-contact-grid { grid-template-columns: 1fr !important; }
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
          <div className="bte-contact-nav" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/#strategies" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(32,30,29,0.6)', textDecoration: 'none' }}>Strategies</Link>
            <Link href="/academy" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(32,30,29,0.6)', textDecoration: 'none' }}>Academy</Link>
            <Link href="/contact" style={{ fontSize: 13, fontWeight: 600, color: C.accent, textDecoration: 'none' }}>Contact</Link>
          </div>
        </nav>

        {/* Two-column split */}
        <div className="bte-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: C.surface, maxWidth: 1120, margin: '48px auto 0', padding: '0 24px' }}>
          {/* Left: info */}
          <div style={{ background: C.bg, padding: '48px 40px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `2px solid rgba(32,30,29,0.25)`, padding: '6px 12px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Get started
            </span>
            <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.08, margin: '24px 0 0', letterSpacing: '-0.01em' }}>
              Start the<br /><span style={{ color: C.accent }}>conversation.</span>
            </h1>
            <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.65, color: 'rgba(32,30,29,0.6)', maxWidth: 400 }}>
              Schedule a free structural assessment with our team. We determine the optimal entity type, jurisdiction, and governance setup for your situation.
            </p>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `2px solid ${C.surface}` }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 6 }}>Jurisdiction comparison</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(32,30,29,0.7)' }}>Delaware for multi-member partnerships. Wyoming for anonymous single-member asset vaults.</p>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 6 }}>Entity types</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(32,30,29,0.7)' }}>Holding LLCs, Operating LLCs, and DAO LLCs — each with tailored governance and tax treatment.</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ background: '#fff', padding: '48px 40px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <ShieldCheck size={40} color={C.accent} style={{ marginBottom: 16 }} />
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>Thank you</h2>
                <p style={{ fontSize: 14, color: 'rgba(32,30,29,0.6)', lineHeight: 1.6 }}>Your assessment request has been received. Our team will reach out within 24 hours.</p>
                <Link href="/" style={{ display: 'inline-block', marginTop: 24, padding: '12px 24px', background: C.ink, color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                  Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <label style={labelStyle}>
                    Name
                    <input className="bte-contact-input" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Your name" style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Email
                    <input className="bte-contact-input" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" style={inputStyle} />
                  </label>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.text, marginBottom: 8 }}>Who are you?</div>
                  <div style={{ display: 'flex', border: `2px solid ${C.surface}` }}>
                    {[['investor', 'Investor'], ['founder', 'Founder'], ['institution', 'Institution']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setFormData({ ...formData, who: val })} style={{ flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontFamily: FONT, background: formData.who === val ? C.accent : 'transparent', color: formData.who === val ? '#fff' : 'rgba(32,30,29,0.6)', transition: 'all 0.15s' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <label style={labelStyle}>
                  Goals
                  <textarea className="bte-contact-input" name="goals" value={formData.goals} onChange={handleChange} rows={4} placeholder="Describe your situation and goals..." style={{ ...inputStyle, resize: 'vertical' }} />
                </label>

                <button type="submit" className="bte-contact-submit" style={{ width: '100%', padding: '15px 0', border: 'none', background: C.accent, color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: FONT, cursor: 'pointer', textAlign: 'center', transition: 'background 0.15s' }}>
                  Request free assessment
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ borderTop: `2px solid ${C.surface}`, paddingTop: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 24px' }}>Frequently asked questions</h2>
            {faqs.map((faq, i) => (
              <details key={i} style={{ borderBottom: `1px solid ${C.surface}`, padding: '16px 0' }}>
                <summary style={{ fontSize: 14, fontWeight: 700, cursor: 'pointer', color: C.text }}>{faq.q}</summary>
                <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.65, color: 'rgba(32,30,29,0.65)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: `2px solid ${C.surface}`, padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark size={24} />
            <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(32,30,29,0.4)' }}>© {new Date().getFullYear()} Blockchain Trust Enterprise. All rights reserved.</span>
        </footer>
      </main>
    </>
  );
}
