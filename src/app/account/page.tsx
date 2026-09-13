'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';

export default function AccountPage() {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot' | 'reset'>('register');
  const [fullName, setFullName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); const verify = params.get('verify'); const reset = params.get('reset');
    if (verify) { fetch('/api/operations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify-email', token: verify }) }).then(r => r.json()).then(d => setMessage(d.success ? 'Your email has been verified. You can sign in.' : (d.error || 'Verification failed.'))); }
    if (reset) { setResetToken(reset); setMode('reset'); }
  }, []);

  function changeMode(next: typeof mode) { setMode(next); setError(''); setMessage(''); setShowPassword(false); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      let payload: Record<string, string> = mode === 'register' ? { action: 'register', fullName, email, password } : mode === 'login' ? { action: 'login', email, password } : mode === 'forgot' ? { action: 'forgot-password', email } : { action: 'reset-password', token: resetToken, password };
      const response = await fetch('/api/operations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to complete your request.');
      if (mode === 'register') { localStorage.setItem('bte-user-token', data.token); localStorage.setItem('bte-user', JSON.stringify(data.user)); setRegistered(true); }
      else if (mode === 'login') { localStorage.setItem('bte-user-token', data.token); localStorage.setItem('bte-user', JSON.stringify(data.user)); window.location.href = '/account/dashboard'; }
      else if (mode === 'forgot') setMessage(data.message);
      else { setMessage('Password reset successfully. You can now sign in.'); changeMode('login'); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to complete your request.'); } finally { setLoading(false); }
  }

  const formTitle = mode === 'register' ? 'Create your BTE account' : mode === 'login' ? 'Welcome back to BTE' : mode === 'forgot' ? 'Recover your account' : 'Choose a new password';
  return (
    <main className="account-page"><section className="account-hero"><a className="account-brand" href="/"><span className="account-brand-mark">B</span><span>Blockchain Trust <small>Enterprise</small></span></a><div className="account-copy"><div className="eyebrow"><Sparkles size={14} /> {registered ? 'Account created' : 'Your market workspace'}</div><h1>{registered ? 'Welcome to BTE.' : 'Build conviction with more control.'}</h1><p>{registered ? 'Your workspace is ready. Complete your registration payment from the dashboard whenever you are ready to activate your account.' : 'A calm, human space for strategy education, mentor playbooks, and thoughtful market participation.'}</p><div className="account-proof"><span><CheckCircle2 size={16} /> Personal workspace</span><span><ShieldCheck size={16} /> Secure authentication</span></div></div></section><section className="account-card">{registered ? <div className="account-success-block"><div className="success-icon"><CheckCircle2 size={48} /></div><h2>Account created successfully</h2><p>Welcome to Blockchain Trust Enterprise, <strong>{fullName}</strong>.</p><div className="account-next-step"><strong>Your workspace is ready.</strong><span>The $150 registration payment will appear inside your dashboard, where you can review wallet instructions and submit your transaction hash for verification.</span></div><a className="primary-button account-submit" href="/account/dashboard">Open your workspace <ArrowRight size={16} /></a></div> : <><div className="account-tabs"><button className={mode === 'register' ? 'active' : ''} onClick={() => changeMode('register')}>Create account</button><button className={mode === 'login' ? 'active' : ''} onClick={() => changeMode('login')}>Sign in</button></div><div className="account-form-heading"><KeyRound size={22} /><div><h2>{formTitle}</h2><p className="account-muted">{mode === 'register' ? 'Start free. Payment instructions appear after sign-up in your dashboard.' : mode === 'forgot' ? 'Enter your email and we will send a secure reset link.' : mode === 'reset' ? 'Use at least 8 characters for your new password.' : 'Sign in with the email and password you registered.'}</p></div></div><form onSubmit={submit}>{mode === 'register' && <label>Full name<input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Your full name" /></label>}{mode !== 'reset' && <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" /></label>}{mode !== 'forgot' && <label>{mode === 'reset' ? 'New password' : 'Password'}<span className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>}{mode === 'login' && <button type="button" className="forgot-link" onClick={() => changeMode('forgot')}>Forgot password?</button>}{error && <div className="account-error">{error}</div>}{message && <div className="account-success"><CheckCircle2 size={16} /> {message}</div>}<button className="primary-button account-submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'register' ? 'Create free account' : mode === 'login' ? 'Sign in' : mode === 'forgot' ? 'Send reset link' : 'Save new password'} <ArrowRight size={16} /></button></form>{mode === 'forgot' || mode === 'reset' ? <button className="account-back-link" onClick={() => changeMode('login')}>Back to sign in</button> : <p className="account-disclaimer">Registration is free. The one-time $150 activation payment is shown only in your dashboard after you create an account.</p>}</>}</section></main>
  );
}
