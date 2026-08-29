'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Shield, BarChart3, Star, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface Plan {
  id: string; name: string; tier: string; amount_usd: number;
  min_return_pct: number; max_return_pct: number; duration_months: number;
  features: string; risk_level: string;
}

const tierIcons: Record<string, React.ReactNode> = {
  starter: <Shield size={28} />,
  growth: <TrendingUp size={28} />,
  premium: <Zap size={28} />,
};

const tierColors: Record<string, string> = {
  starter: 'plan-starter',
  growth: 'plan-growth',
  premium: 'plan-premium',
};

export default function InvestPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/investment-plans').then(r => r.json()).then(d => { setPlans(d.plans || []); setLoading(false); });
  }, []);

  async function handleSubscribe(planId: string) {
    const token = localStorage.getItem('bte-user-token');
    if (!token) { setResult({ type: 'error', message: 'Please sign in to subscribe to an investment plan.' }); return; }
    setSubscribing(planId);
    setResult(null);
    try {
      const res = await fetch('/api/investment-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult({ type: 'success', message: data.message });
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Subscription failed.' });
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <main className="terminal-shell">
      <div className="invest-page">
        <div className="invest-hero">
          <p className="eyebrow"><span className="eyebrow-line" />INVESTMENT PLANS</p>
          <h1>Grow your wealth with expert-managed stock portfolios.</h1>
          <p className="invest-hero-sub">
            Our investment team combines quantitative strategies with institutional-grade execution
            to deliver consistent returns across market conditions.
          </p>
        </div>

        <div className="invest-stats-row">
          <div className="invest-stat"><BarChart3 size={18} /><div><strong>$2.4B+</strong><span>Assets Under Management</span></div></div>
          <div className="invest-stat"><Star size={18} /><div><strong>94%</strong><span>Client Satisfaction</span></div></div>
          <div className="invest-stat"><TrendingUp size={18} /><div><strong>18.7%</strong><span>Avg. Annual Return</span></div></div>
          <div className="invest-stat"><Shield size={18} /><div><strong>100%</strong><span>Regulated & Insured</span></div></div>
        </div>

        {result && (
          <div className={`invest-alert invest-alert-${result.type}`}>
            {result.type === 'success' ? <CheckCircle2 size={16} /> : <Shield size={16} />}
            {result.message}
          </div>
        )}

        {loading ? (
          <div className="invest-loading">Loading investment plans...</div>
        ) : (
          <div className="invest-grid">
            {plans.map((plan) => {
              const features: string[] = JSON.parse(plan.features || '[]');
              const isPremium = plan.tier === 'premium';
              return (
                <div className={`invest-card ${tierColors[plan.tier]} ${isPremium ? 'invest-card-featured' : ''}`} key={plan.id}>
                  {isPremium && <div className="invest-badge">Most Popular</div>}
                  <div className="invest-card-icon">{tierIcons[plan.tier]}</div>
                  <h2>{plan.name}</h2>
                  <div className="invest-amount">
                    <span className="invest-dollar">$</span>
                    <span className="invest-value">{plan.amount_usd.toLocaleString()}</span>
                  </div>
                  <div className="invest-return">
                    <TrendingUp size={14} />
                    <span>{plan.min_return_pct}% &ndash; {plan.max_return_pct}% projected annual return</span>
                  </div>
                  <div className="invest-meta">
                    <span>{plan.duration_months}-month term</span>
                    <span className="invest-risk">{plan.risk_level} risk</span>
                  </div>
                  <ul className="invest-features">
                    {features.map((f) => (
                      <li key={f}><CheckCircle2 size={14} />{f}</li>
                    ))}
                  </ul>
                  <button
                    className="invest-cta"
                    disabled={subscribing === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {subscribing === plan.id ? 'Processing...' : 'Get Started'}
                    {subscribing !== plan.id && <ArrowRight size={16} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="invest-disclaimer">
          <p>
            Past performance does not guarantee future results. All investments carry risk including the potential loss of principal.
            Returns are projected based on historical performance and market analysis. Individual results may vary.
            BTE is a registered investment platform operating under applicable regulatory frameworks.
          </p>
        </div>
      </div>
    </main>
  );
}
