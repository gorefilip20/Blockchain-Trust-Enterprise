'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/operations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mode === 'register' ? { action: 'register', fullName, email, password } : { action: 'login', email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to complete your request.');
      localStorage.setItem('bte-user-token', data.token);
      localStorage.setItem('bte-user', JSON.stringify(data.user));
      setMessage(mode === 'register' ? 'Your BTE account is ready. You can now access your workspace.' : 'You are signed in. Your workspace is ready.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete your request.');
    } finally { setLoading(false); }
  }

  return <main className="account-page"><section className="account-hero"><a className="account-brand" href="/">BTE <span>Blockchain Trust Enterprises</span></a><div className="account-copy"><div className="eyebrow"><span className="eyebrow-line" />Secure client access</div><h1>Build conviction with more control.</h1><p>Create your BTE account to access your personal workspace, copy-trading research, strategy education, and mentorship registration tools.</p><div className="account-proof"><span><CheckCircle2 size={16} />Personal workspace</span><span><ShieldCheck size={16} />Secure password authentication</span></div></div></section><section className="account-card"><div className="account-tabs"><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setMessage(''); }}>Create account</button><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setMessage(''); }}>Sign in</button></div><h2>{mode === 'register' ? 'Create your BTE account' : 'Welcome back to BTE'}</h2><p className="account-muted">{mode === 'register' ? 'Use an email address you control and choose a strong password.' : 'Sign in with the email and password you registered.'}</p><form onSubmit={submit}>{mode === 'register' && <label>Full name<input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" /></label>}<label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>{error && <div className="account-error">{error}</div>}{message && <div className="account-success">{message} <a href="/account/dashboard">Open workspace <ArrowRight size={14} /></a></div>}<button className="primary-button account-submit" disabled={loading}>{loading ? 'Securing your account…' : mode === 'register' ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button></form><p className="account-disclaimer">Your account gives you access to the BTE workspace and educational tools. Trading features are paper-mode unless separately enabled and connected to an approved production integration.</p></section></main>;
}
