'use client';

import Link from 'next/link';
import { LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  return (
    <main className="admin-login-page">
      <div className="admin-login-orb admin-login-orb-one" /><div className="admin-login-orb admin-login-orb-two" />
      <div className="admin-login-layout">
        <section className="admin-login-intro"><div className="admin-login-brand"><span>BTE</span><div><b>Blockchain Trust</b><small>Enterprise operations</small></div></div><div className="admin-login-copy"><div className="admin-login-kicker"><Sparkles size={14} /> Supervisor workspace</div><h1>Keep the operation<br /><em>in view.</em></h1><p>A focused control room for client onboarding, treasury, payment verification, and the teams supporting the BTE platform.</p><div className="admin-login-proof"><span><ShieldCheck size={16} /> Role-aware access</span><span><LockKeyhole size={16} /> Protected workspace</span></div></div></section>
        <section className="admin-login-card"><div className="admin-login-card-top"><span className="admin-login-status"><i /> Secure sign in</span><span className="admin-login-code">BTE / 01</span></div><div className="admin-login-card-heading"><h2>Welcome back</h2><p>Use your authorized administrator credentials to continue.</p></div>{error && <div className="admin-login-error" role="alert">{error}</div>}<form onSubmit={handleSubmit} className="admin-login-form"><label>Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter admin username" required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /></label><button type="submit" disabled={loading}>{loading ? 'Establishing connection…' : 'Enter operations workspace'}</button></form><div className="admin-login-note"><ShieldCheck size={15} /><span>Authorized personnel only. Contact your administrator for access credentials.</span></div><Link className="admin-login-back" href="/">← Back to public site</Link></section>
      </div>
    </main>
  );
}
