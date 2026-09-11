'use client';

import Link from 'next/link';
import { LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = {
  bg: '#f3f2f2',
  surface: '#eae9e9',
  text: '#201e1d',
  ink: '#2d2b2b',
  accent: '#6a3df0',
};

const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const text = await res.text();
      let data: Record<string, string>;
      try { data = JSON.parse(text); } catch { data = { error: 'Server returned an unexpected response.' }; }
      if (res.ok && data.token) {
        localStorage.setItem('bte-admin-token', data.token);
        localStorage.setItem('bte-admin-user', JSON.stringify({ username: data.username, role: data.role }));
        router.push('/admin/dashboard');
      } else setError(data.error || 'Access denied: invalid credentials.');
    } catch { setError('Connection failed. Please try again.'); } finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: 'normal',
    padding: '12px 14px',
    border: '2px solid rgba(32,30,29,0.35)',
    borderRadius: 0,
    background: '#fff',
    color: COLORS.text,
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: COLORS.text,
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" />
      <style>{`
        .bte-login-input::placeholder { color: rgba(32,30,29,0.38); }
        .bte-login-input:focus {
          outline: none;
          border-color: ${COLORS.accent} !important;
          box-shadow: 0 0 0 3px rgba(106,61,240,0.22);
        }
        .bte-login-submit:hover:not(:disabled) { background: #5a2fe0 !important; }
        .bte-login-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .bte-login-back:hover { text-decoration: underline !important; }
        @media (max-width: 860px) {
          .bte-login-layout { grid-template-columns: 1fr !important; }
          .bte-login-left { min-height: 360px !important; }
        }
      `}</style>
      <main style={{ minHeight: '100vh', width: '100%', fontFamily: FONT, color: COLORS.text, background: COLORS.bg }}>
        <div className="bte-login-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
          {/* Left panel */}
          <section className="bte-login-left" style={{ background: COLORS.ink, color: '#fff', padding: '56px 48px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
            {/* logo + wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <rect x="1" y="1" width="30" height="30" stroke="#ffffff" strokeWidth="2" />
                <rect x="10" y="10" width="12" height="12" fill={COLORS.accent} />
              </svg>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</div>
                <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Enterprise operations</div>
              </div>
            </div>

            {/* tag */}
            <div style={{ marginTop: 48 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '2px solid rgba(255,255,255,0.4)', padding: '8px 14px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                <Sparkles size={14} /> Supervisor workspace
              </span>
            </div>

            {/* headline */}
            <h1 style={{ marginTop: 28, fontSize: 44, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.01em', margin: '28px 0 0' }}>
              Keep the operation<br />
              <span style={{ color: COLORS.accent }}>in view.</span>
            </h1>

            <p style={{ marginTop: 20, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.68)', maxWidth: 380 }}>
              A focused control room for client onboarding, treasury, payment verification, and the teams supporting the BTE platform.
            </p>

            {/* proof items */}
            <div style={{ marginTop: 32, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                <ShieldCheck size={16} color={COLORS.accent} /> Role-aware access
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                <LockKeyhole size={16} color={COLORS.accent} /> Protected workspace
              </span>
            </div>

            {/* copyright, pinned to bottom */}
            <div style={{ marginTop: 'auto', paddingTop: 40, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              © {new Date().getFullYear()} Blockchain Trust Enterprise. All rights reserved.
            </div>
          </section>

          {/* Right panel */}
          <section style={{ background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: 400, background: COLORS.surface, border: `2px solid ${COLORS.text}`, padding: '40px 36px', boxSizing: 'border-box' }}>
              {/* top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.text }}>
                  <i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#2f9e58' }} />
                  Secure sign in
                </span>
                <span style={{ fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.04em', color: 'rgba(32,30,29,0.5)' }}>
                  BTE / 01
                </span>
              </div>

              <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: COLORS.text }}>Welcome back</h2>
              <p style={{ marginTop: 8, marginBottom: 24, fontSize: 14, color: 'rgba(32,30,29,0.6)' }}>
                Use your authorized administrator credentials to continue.
              </p>

              {error && (
                <div role="alert" style={{ border: '2px solid #b3261e', background: 'rgba(179,38,30,0.06)', color: '#b3261e', padding: '12px 14px', fontSize: 13, marginBottom: 20 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={labelStyle}>
                  Username
                  <input
                    className="bte-login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    required
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  Password
                  <input
                    className="bte-login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={inputStyle}
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="bte-login-submit"
                  style={{
                    marginTop: 8,
                    width: '100%',
                    border: 'none',
                    borderRadius: 0,
                    background: COLORS.accent,
                    color: '#fff',
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '15px 0',
                    textAlign: 'center',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {loading ? 'Establishing connection…' : 'Enter operations workspace'}
                </button>
              </form>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '2px solid rgba(32,30,29,0.12)', display: 'flex', gap: 8, fontSize: 12, color: 'rgba(32,30,29,0.55)' }}>
                <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Authorized personnel only. Contact your administrator for access credentials.</span>
              </div>

              <Link href="/" className="bte-login-back" style={{ display: 'inline-block', marginTop: 18, fontSize: 13, fontWeight: 600, color: COLORS.accent, textDecoration: 'none' }}>
                ← Back to public site
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
