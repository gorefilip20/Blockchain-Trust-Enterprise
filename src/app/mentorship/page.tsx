'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, TrendingUp, Star, ChevronDown, ChevronUp, Send, Award, BarChart3, Target, Shield, Zap, MessageCircle, FileText } from 'lucide-react';

interface Strategy {
  id: string; title: string; trader_name: string; category: string; markets: string;
  description: string; key_concepts: string; difficulty: string; source: string; source_url: string;
}
interface Mentor {
  id: string; name: string; specialty: string; bio: string; experience_years: number;
  markets: string; telegram_handle: string; total_students: number; rating: number;
}

const difficultyColor: Record<string, string> = { Beginner: '#3b82f6', Intermediate: '#0fa987', Advanced: '#e0a800' };
const categoryIcon: Record<string, React.ReactNode> = {
  'Swing Trading': <TrendingUp size={16} />, 'Day Trading': <Zap size={16} />,
};

export default function MentorshipPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<'strategies' | 'mentors' | 'apply' | 'student'>('strategies');
  const [studentForm, setStudentForm] = useState({ fullName: '', email: '', paymentReference: '' });
  const [studentAccess, setStudentAccess] = useState<{ payment_status: string; approval_status: string; notion_access_enabled: number; notionUrl: string | null } | null>(null);
  const [studentResult, setStudentResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', specialty: '', bio: '', experienceYears: '', markets: 'Stocks' });
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/mentorship').then(r => r.json()).then(d => {
      setStrategies(d.strategies || []);
      setMentors(d.mentors || []);
    });
    const token = localStorage.getItem('bte-user-token');
    if (token) fetch('/api/mentorship?section=student', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).then(d => d && setStudentAccess(d.subscription ? { ...d.subscription, notionUrl: d.notionUrl } : null));
  }, []);

  const categories = ['All', ...Array.from(new Set(strategies.map(s => s.category)))];
  const filtered = filter === 'All' ? strategies : strategies.filter(s => s.category === filter);

  async function handleStudentRegistration(e: React.FormEvent) {
    e.preventDefault(); setStudentResult(null);
    const token = localStorage.getItem('bte-user-token');
    if (!token) { setStudentResult({ type: 'error', message: 'Please create or sign in to your BTE account before registering.' }); return; }
    try {
      const res = await fetch('/api/mentorship', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'register-student', ...studentForm }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      setStudentResult({ type: 'success', message: data.message });
      setStudentForm({ fullName: '', email: '', paymentReference: '' });
    } catch (err) { setStudentResult({ type: 'error', message: err instanceof Error ? err.message : 'Registration failed.' }); }
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setResult(null);
    try {
      const token = localStorage.getItem('bte-user-token');
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ action: 'apply-mentor', ...form, experienceYears: parseInt(form.experienceYears) || 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult({ type: 'success', message: data.message });
      setForm({ name: '', email: '', specialty: '', bio: '', experienceYears: '', markets: 'Stocks' });
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Application failed.' });
    } finally { setSubmitting(false); }
  }

  return (
    <main className="terminal-shell">
      <div className="mentorship-page">
        <div className="mentorship-hero">
          <p className="eyebrow"><span className="eyebrow-line" />TRADING EDUCATION</p>
          <h1>Master the markets with battle-tested strategies.</h1>
          <p className="mentorship-hero-sub">
            Access trading playbooks from consistently profitable traders, verified by track record.
            Learn the frameworks behind millions in real returns — completely free.
          </p>
          <div className="mentorship-hero-stats">
            <div className="mh-stat"><BookOpen size={18} /><strong>{strategies.length}</strong><span>Strategies</span></div>
            <div className="mh-stat"><Users size={18} /><strong>{mentors.length}</strong><span>Active Mentors</span></div>
            <div className="mh-stat"><Star size={18} /><strong>Free</strong><span>All Strategies</span></div>
            <div className="mh-stat"><Award size={18} /><strong>Verified</strong><span>Profitable Traders</span></div>
          </div>
        </div>

        <div className="mentorship-tabs">
          <button className={tab === 'strategies' ? 'mt-active' : ''} onClick={() => setTab('strategies')}>
            <BarChart3 size={15} /> Strategies & Playbooks
          </button>
          <button className={tab === 'mentors' ? 'mt-active' : ''} onClick={() => setTab('mentors')}>
            <Users size={15} /> Expert Mentors
          </button>
          <button className={tab === 'apply' ? 'mt-active' : ''} onClick={() => setTab('apply')}>
            <Send size={15} /> Become a Mentor
          </button>
          <button className={tab === 'student' ? 'mt-active' : ''} onClick={() => setTab('student')}>
            <Shield size={15} /> Student Access
          </button>
        </div>

        {tab === 'strategies' && (
          <section className="mentorship-section">
            <div className="strategy-filters">
              {categories.map(c => (
                <button key={c} className={filter === c ? 'sf-active' : ''} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
            <div className="strategy-grid">
              {filtered.map(s => {
                const concepts: string[] = JSON.parse(s.key_concepts || '[]');
                const isOpen = expanded === s.id;
                return (
                  <div className="strategy-card" key={s.id}>
                    <div className="strategy-card-header">
                      <div className="strategy-card-cat">
                        {categoryIcon[s.category] || <Target size={16} />}
                        <span>{s.category}</span>
                      </div>
                      <span className="strategy-difficulty" style={{ color: difficultyColor[s.difficulty], borderColor: difficultyColor[s.difficulty] }}>{s.difficulty}</span>
                    </div>
                    <h3>{s.title}</h3>
                    <p className="strategy-trader">by <strong>{s.trader_name}</strong></p>
                    <p className="strategy-markets"><Target size={12} /> {s.markets}</p>
                    <p className="strategy-desc">{s.description}</p>
                    <button className="strategy-expand" onClick={() => setExpanded(isOpen ? null : s.id)}>
                      {isOpen ? 'Hide Details' : 'Key Concepts'} {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <ul className="strategy-concepts">
                        {concepts.map(c => <li key={c}><Shield size={12} />{c}</li>)}
                      </ul>
                    )}
                    <div className="strategy-footer">
                      <span className="strategy-source">Source: {s.source}</span>
                      <span className="strategy-free-badge">FREE</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="strategy-credit">
              <p>Strategies sourced from <strong>Chart Fanatics</strong> &mdash; The World&apos;s Best Trading Strategies. Free education from verified, profitable traders.</p>
            </div>
            <div className="learning-guides-panel" style={{ marginTop: 28, padding: 24, borderRadius: 14, background: 'linear-gradient(135deg, #102e3e, #174f59)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}><FileText size={18} /><strong>Learning desk</strong></div>
              <p style={{ color: '#c8e3e3', maxWidth: 720 }}>Build a risk-first foundation before you copy a strategy or connect a wallet. These guides are educational resources, not promises of returns or instructions to trade.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }}>
                {[
                  ['Copy Trading Guide', '/guides/copy-trading-guide.pdf'],
                  ['Crypto & Digital Assets', '/guides/crypto-digital-assets-guide.pdf'],
                  ['Memecoin Safety & Rug Pulls', '/guides/memecoin-safety-guide.pdf'],
                ].map(([label, href]) => (
                  <a key={href} href={href} download style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 9, background: '#ffffff18', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
                    <FileText size={15} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === 'student' && (
          <section className="mentorship-section">
            <div className="mentor-apply-wrap">
              <div className="mentor-apply-info">
                <h2>Join the mentorship class</h2>
                <p>Submit your registration and payment reference for manual review. Your private mentorship guide appears here automatically only after an administrator confirms both payment and approval.</p>
                <div className="apply-fee-box"><h4>Access status</h4><div className="apply-fee-amount">{studentAccess?.notion_access_enabled ? 'Approved' : studentAccess ? 'Under review' : 'Not registered'} <span>admin-controlled access</span></div><p>{studentAccess ? `Payment: ${studentAccess.payment_status} · Approval: ${studentAccess.approval_status}` : 'Sign in and submit your payment reference to begin.'}</p>{studentAccess?.notion_access_enabled && studentAccess.notionUrl && <a className="apply-payment-link" href={studentAccess.notionUrl} target="_blank" rel="noreferrer"><BookOpen size={16} /><span>Open private mentorship guide</span></a>}</div>
              </div>
              <form className="mentor-apply-form" onSubmit={handleStudentRegistration}>
                <h3>Student registration</h3>
                {studentResult && <div className={`invest-alert invest-alert-${studentResult.type}`}>{studentResult.message}</div>}
                <label>Full name *<input value={studentForm.fullName} onChange={e => setStudentForm(p => ({ ...p, fullName: e.target.value }))} required /></label>
                <label>Email *<input type="email" value={studentForm.email} onChange={e => setStudentForm(p => ({ ...p, email: e.target.value }))} required /></label>
                <label>Payment reference / transaction hash *<input value={studentForm.paymentReference} onChange={e => setStudentForm(p => ({ ...p, paymentReference: e.target.value }))} placeholder="Paste the reference for admin review" required /></label>
                <button type="submit">Submit for approval <Send size={14} /></button>
              </form>
            </div>
          </section>
        )}

        {tab === 'mentors' && (
          <section className="mentorship-section">
            <div className="mentor-grid">
              {mentors.map(m => (
                <div className="mentor-card" key={m.id}>
                  <div className="mentor-avatar">{m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                  <h3>{m.name}</h3>
                  <p className="mentor-specialty">{m.specialty}</p>
                  <p className="mentor-bio">{m.bio}</p>
                  <div className="mentor-meta">
                    <span><Award size={12} /> {m.experience_years}yr exp</span>
                    <span><Users size={12} /> {m.total_students} students</span>
                    <span><Star size={12} /> {m.rating}/5</span>
                  </div>
                  <div className="mentor-markets"><Target size={12} /> {m.markets}</div>
                  <div className="mentor-contact">
                    <MessageCircle size={14} />
                    <span>Contact via Live Chat</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mentor-cta-box">
              <h3>Want to share your expertise?</h3>
              <p>Join our mentor network and educate the next generation of traders. Registration fee: <strong>$500</strong> (one-time, paid to admin).</p>
              <button className="mentor-cta-btn" onClick={() => setTab('apply')}>Apply to Become a Mentor <Send size={14} /></button>
            </div>
          </section>
        )}

        {tab === 'apply' && (
          <section className="mentorship-section">
            <div className="mentor-apply-wrap">
              <div className="mentor-apply-info">
                <h2>Become a BTE Mentor</h2>
                <p>Share your trading expertise and earn by educating others on the BTE platform.</p>
                <div className="apply-benefits">
                  <div className="apply-benefit"><Shield size={18} /><div><strong>Platform Access</strong><span>Reach thousands of active traders and investors</span></div></div>
                  <div className="apply-benefit"><BarChart3 size={18} /><div><strong>Your Strategies</strong><span>Publish and showcase your trading playbooks</span></div></div>
                  <div className="apply-benefit"><Users size={18} /><div><strong>Build Following</strong><span>Grow your student base and reputation</span></div></div>
                  <div className="apply-benefit"><Award size={18} /><div><strong>Verified Badge</strong><span>Get verified as a profitable trader on BTE</span></div></div>
                </div>
                <div className="apply-fee-box">
                  <h4>Registration Fee</h4>
                  <div className="apply-fee-amount">$500 <span>one-time payment</span></div>
                  <p>Paid via cryptocurrency upon approval. Visit the Payments page for wallet addresses.</p>
                  <a href="/payments" className="apply-payment-link">
                    <Shield size={16} />
                    <span>View Payment Methods &amp; Wallet Addresses</span>
                  </a>
                </div>
              </div>
              <form className="mentor-apply-form" onSubmit={handleApply}>
                <h3>Mentor Application</h3>
                {result && <div className={`invest-alert invest-alert-${result.type}`}>{result.message}</div>}
                <label>Full Name *<input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></label>
                <label>Email *<input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></label>
                <label>Trading Specialty *<input value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))} placeholder="e.g. Options Swing Trading, Forex Day Trading" required /></label>
                <label>Markets
                  <select value={form.markets} onChange={e => setForm(p => ({ ...p, markets: e.target.value }))}>
                    <option>Stocks</option><option>Options</option><option>Futures</option>
                    <option>Forex</option><option>Crypto</option><option>Stocks, Options</option>
                    <option>Futures, Forex</option><option>All Markets</option>
                  </select>
                </label>
                <label>Years of Experience<input type="number" min="1" max="50" value={form.experienceYears} onChange={e => setForm(p => ({ ...p, experienceYears: e.target.value }))} /></label>
                <label>Bio / Trading Background *<textarea rows={4} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Describe your trading experience, track record, and teaching approach..." required /></label>
                <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'} {!submitting && <Send size={14} />}</button>
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
