'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, DollarSign, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      const payload = mode === 'register'
        ? { action: 'register', fullName, email, password, paymentReference: paymentReference || undefined }
        : { action: 'login', email, password };
      const response = await fetch('/api/operations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to complete your request.');
      localStorage.setItem('bte-user-token', data.token);
      localStorage.setItem('bte-user', JSON.stringify(data.user));
      if (mode === 'register') {
        setRegistered(true);
      } else {
        setMessage('signed-in');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete your request.');
    } finally { setLoading(false); }
  }

  if (registered) {
    return (
      <main className="account-page">
        <section className="account-hero">
          <a className="account-brand" href="/">BTE <span>Blockchain Trust Enterprises</span></a>
          <div className="account-copy">
            <div className="eyebrow"><span className="eyebrow-line" />Account created</div>
            <h1>Welcome to BTE.</h1>
            <p>Your account has been created successfully.</p>
          </div>
        </section>
        <section className="account-card">
          <div className="account-success-block">
            <div className="success-icon"><CheckCircle2 size={48} /></div>
            <h2>Account Created Successfully!</h2>
            <p>Welcome to Blockchain Trust Enterprise, <strong>{fullName}</strong>.</p>
            <div className="registration-fee-notice">
              <div className="fee-header"><DollarSign size={18} /> Registration Fee Required</div>
              <p>A <strong>$150 registration fee</strong> is required to fully activate your account. {paymentReference ? 'Your payment reference has been submitted and is pending admin verification.' : 'Please submit your payment and provide the reference to activate your account.'}</p>
              {paymentReference && <p className="fee-ref">Payment Reference: <code>{paymentReference}</code></p>}
            </div>
            <p className="account-muted" style={{ marginTop: 16 }}>You can still access your workspace while your payment is being verified.</p>
            <a className="primary-button account-submit" href="/account/dashboard" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', marginTop: 16 }}>
              Open your workspace <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="account-page">
      <section className="account-hero">
        <a className="account-brand" href="/">BTE <span>Blockchain Trust Enterprises</span></a>
        <div className="account-copy">
          <div className="eyebrow"><span className="eyebrow-line" />Secure client access</div>
          <h1>Build conviction with more control.</h1>
          <p>Create your BTE account to access your personal workspace, copy-trading research, strategy education, and mentorship registration tools.</p>
          <div className="account-proof">
            <span><CheckCircle2 size={16} />Personal workspace</span>
            <span><ShieldCheck size={16} />Secure password authentication</span>
          </div>
        </div>
      </section>
      <section className="account-card">
        <div className="account-tabs">
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setMessage(''); }}>Create account</button>
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setMessage(''); }}>Sign in</button>
        </div>
        <h2>{mode === 'register' ? 'Create your BTE account' : 'Welcome back to BTE'}</h2>
        <p className="account-muted">{mode === 'register' ? 'Use an email address you control and choose a strong password.' : 'Sign in with the email and password you registered.'}</p>

        {mode === 'register' && (
          <div className="registration-fee-banner">
            <DollarSign size={16} />
            <span>A <strong>$150 registration fee</strong> is required to activate your account. You can provide your payment reference during registration.</span>
          </div>
        )}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>Full name<input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" /></label>
          )}
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>
          {mode === 'register' && (
            <label>Payment reference <span className="optional-tag">(optional)</span>
              <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Transaction hash or payment reference" />
            </label>
          )}
          {error && <div className="account-error">{error}</div>}
          {message === 'signed-in' && (
            <div className="account-success">
              <CheckCircle2 size={16} /> You are signed in. Your workspace is ready.
              <a href="/account/dashboard">Open workspace <ArrowRight size={14} /></a>
            </div>
          )}
          <button className="primary-button account-submit" disabled={loading}>
            {loading ? 'Securing your account...' : mode === 'register' ? 'Create account - $150 fee' : 'Sign in'} <ArrowRight size={16} />
          </button>
        </form>
        <p className="account-disclaimer">Your account gives you access to the BTE workspace and educational tools. The $150 registration fee must be verified by an administrator before full account activation.</p>
      </section>
    </main>
  );
}
