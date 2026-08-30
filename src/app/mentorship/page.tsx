'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, TrendingUp, Star, ChevronDown, ChevronUp, Send, Award, BarChart3, Target, Shield, Zap, MessageCircle } from 'lucide-react';

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
  const [tab, setTab] = useState<'strategies' | 'mentors' | 'apply'>('strategies');
  const [form, setForm] = useState({ name: '', email: '', specialty: '', bio: '', experienceYears: '', markets: 'Stocks', telegramHandle: '' });
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/mentorship').then(r => r.json()).then(d => {
      setStrategies(d.strategies || []);
      setMentors(d.mentors || []);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(strategies.map(s => s.category)))];
  const filtered = filter === 'All' ? strategies : strategies.filter(s => s.category === filter);

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
      setForm({ name: '', email: '', specialty: '', bio: '', experienceYears: '', markets: 'Stocks', telegramHandle: '' });
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Application failed.' });
    } finally { setSubmitting(false); }
  }

  return (
    <main className="terminal-shell">
      <div className="mentorship-page">
        <div className="mentorship-hero">
          <p className="eyebrow"><span className="eyebrow-line" />TRADING EDUCATION</p>
          <h1>Master the markets with proven strategies and expert mentors.</h1>
          <p className="mentorship-hero-sub">
            Access institutional-grade trading playbooks from verified, consistently profitable traders.
            Learn the exact frameworks used by professionals who have generated millions in returns.
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
                  {m.telegram_handle && (
                    <div className="mentor-contact">
                      <MessageCircle size={14} />
                      <span>Telegram: {m.telegram_handle}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mentor-cta-box">
              <h3>Want to share your expertise?</h3>
              <p>Join our mentor network and educate the next generation of traders. Registration fee: <strong>$150</strong> (one-time, paid to admin).</p>
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
                  <div className="apply-fee-amount">$150 <span>one-time payment</span></div>
                  <p>Paid to admin upon approval. Contact via Telegram for payment instructions.</p>
                  <div className="apply-telegram">
                    <MessageCircle size={16} />
                    <span>Telegram link will be provided after application review</span>
                  </div>
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
                <label>Telegram Handle<input value={form.telegramHandle} onChange={e => setForm(p => ({ ...p, telegramHandle: e.target.value }))} placeholder="@your_handle" /></label>
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
