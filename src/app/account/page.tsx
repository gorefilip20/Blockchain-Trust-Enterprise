'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AccountPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [registered, setRegistered] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      const payload = mode === 'register' ? { action: 'register', fullName, email, password } : { action: 'login', email, password };
      const response = await fetch('/api/operations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to complete your request.');
      localStorage.setItem('bte-user-token', data.token); localStorage.setItem('bte-user', JSON.stringify(data.user));
      if (mode === 'register') setRegistered(true); else setMessage('signed-in');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to complete your request.'); } finally { setLoading(false); }
  }

  return (
    <main className="account-page">
      <section className="account-hero"><a className="account-brand" href="/"><span className="account-brand-mark">B</span><span>Blockchain Trust <small>Enterprise</small></span></a><div className="account-copy"><div className="eyebrow"><Sparkles size={14} /> {registered ? 'Account created' : 'Your market workspace'}</div><h1>{registered ? 'Welcome to BTE.' : 'Build conviction with more control.'}</h1><p>{registered ? 'Your workspace is ready. Complete your registration payment from the dashboard whenever you are ready to activate your account.' : 'A calm, human space for strategy education, mentor playbooks, and thoughtful market participation.'}</p><div className="account-proof"><span><CheckCircle2 size={16} /> Personal workspace</span><span><ShieldCheck size={16} /> Secure authentication</span></div></div></section>
      <section className="account-card">
        {registered ? <div className="account-success-block"><div className="success-icon"><CheckCircle2 size={48} /></div><h2>Account created successfully</h2><p>Welcome to Blockchain Trust Enterprise, <strong>{fullName}</strong>.</p><div className="account-next-step"><strong>Your workspace is ready.</strong><span>The $150 registration payment will appear inside your dashboard, where you can review wallet instructions and submit your transaction hash for verification.</span></div><a className="primary-button account-submit" href="/account/dashboard">Open your workspace <ArrowRight size={16} /></a></div> : <><div className="account-tabs"><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setMessage(''); }}>Create account</button><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setMessage(''); }}>Sign in</button></div><h2>{mode === 'register' ? 'Create your BTE account' : 'Welcome back to BTE'}</h2><p className="account-muted">{mode === 'register' ? 'Start free. Your registration payment instructions appear after sign-up in your dashboard.' : 'Sign in with the email and password you registered.'}</p><form onSubmit={submit}>{mode === 'register' && <label>Full name<input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" /></label>}<label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>{error && <div className="account-error">{error}</div>}{message === 'signed-in' && <div className="account-success"><CheckCircle2 size={16} /> You are signed in. <a href="/account/dashboard">Open workspace <ArrowRight size={14} /></a></div>}<button className="primary-button account-submit" disabled={loading}>{loading ? 'Securing your account...' : mode === 'register' ? 'Create free account' : 'Sign in'} <ArrowRight size={16} /></button></form><p className="account-disclaimer">Registration is free. The one-time $150 activation payment is shown only in your dashboard after you create an account.</p></>}
      </section>
    </main>
  );
}
