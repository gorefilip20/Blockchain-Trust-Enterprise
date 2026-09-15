'use client';

import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, Menu, Play, Search, ShieldCheck, Sparkles, Star, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Strategy = { id: string; title: string; trader_name: string; category: string; markets: string; description: string; difficulty: string; key_concepts: string };
type Mentor = { id: string; name: string; specialty: string; bio: string; experience_years: number; markets: string; total_students: number; rating: number; youtube_channel?: string };

const fallbackStrategies: Strategy[] = [
  { id: 'atlas', title: 'Price Action & Trend Following', trader_name: 'Ariel Hernandez', category: 'Swing Trading', markets: 'Stocks · ETFs', description: 'A calm, rules-first framework for identifying clean trends, managing entries, and staying out of noisy trades.', difficulty: 'Intermediate', key_concepts: '[]' },
  { id: 'liquidity', title: 'Liquidity & Order Flow Playbook', trader_name: 'Marco Trades', category: 'Day Trading', markets: 'Futures · Forex', description: 'Read liquidity shifts, failed breakouts, and session structure with a repeatable intraday process.', difficulty: 'Advanced', key_concepts: '[]' },
  { id: 'crypto', title: 'Crypto Market Cycles', trader_name: 'CryptoBanter', category: 'Crypto', markets: 'BTC · ETH · Altcoins', description: 'A practical way to frame macro cycles, BTC dominance, and rotation without chasing the crowd.', difficulty: 'Beginner', key_concepts: '[]' },
  { id: 'options', title: 'Options Flow & Gamma Reversal', trader_name: 'Brando Elite', category: 'Options', markets: 'US Equities · Options', description: 'Build context around positioning, volatility, and the levels that matter before pressing the button.', difficulty: 'Advanced', key_concepts: '[]' },
  { id: 'momentum', title: 'Momentum Swing System', trader_name: 'Umar Ashraf', category: 'Swing Trading', markets: 'Stocks', description: 'Find relative strength early, time breakouts with volume, and scale into winners with discipline.', difficulty: 'Intermediate', key_concepts: '[]' },
  { id: 'psychology', title: 'Trading Psychology Masterclass', trader_name: 'Jared Tendler', category: 'Mindset', markets: 'All Markets', description: 'A grounded approach to consistency, emotional control, and building habits that survive real market pressure.', difficulty: 'Beginner', key_concepts: '[]' },
];

const categories = ['All', 'Stocks', 'Options', 'Futures', 'Forex', 'Crypto', 'Memecoin', 'Swing Trading', 'Day Trading', 'Mindset'];
const coverColors = ['cover-lilac', 'cover-plum', 'cover-sky', 'cover-rose', 'cover-lavender', 'cover-sand'];
const strategyVideoIds: Record<string, string> = {
  'Ariel Hernandez': 'Nq-p7Bu1YT0', 'Brando Elite': 'Nziws-GG3uQ',
  'CryptoBanter': 'HNuRp9Z1bMs', 'Marco Trades': 'HNuRp9Z1bMs', 'Umar Ashraf': 'Nq-p7Bu1YT0',
  '@TrencherMatt': '3YRJ4Jblzvg', 'TrencherMatt': '3YRJ4Jblzvg'
};

function initials(name: string) { return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

export default function HomePage() {
  const [strategies, setStrategies] = useState<Strategy[]>(fallbackStrategies);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Strategy | null>(null);

  useEffect(() => {
    fetch('/api/mentorship').then((res) => res.ok ? res.json() : null).then((data) => {
      if (data?.strategies?.length) setStrategies(data.strategies);
      if (data?.mentors?.length) setMentors(data.mentors);
    }).catch(() => undefined);
  }, []);

  const filtered = useMemo(() => strategies.filter((strategy) => {
    const matchesCategory = filter === 'All' || strategy.category === filter || strategy.markets.includes(filter);
    const haystack = `${strategy.title} ${strategy.trader_name} ${strategy.category} ${strategy.markets}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [filter, query, strategies]);

  return (
    <main className="catalog-page">
      <div className="catalog-ribbon"><span>NEW</span> Learn from verified strategists. Build your own process. <Link href="/account">Join the community <ArrowRight size={13} /></Link></div>
      <header className="catalog-header">
        <Link href="/" className="catalog-logo"><span className="catalog-logo-mark">B</span><span>Blockchain Trust <small>Enterprise</small></span></Link>
        <nav className={`catalog-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#strategies">Strategies</a><a href="#mentors">Mentors</a><Link href="/academy">Academy</Link><Link href="/mentorship">Mentorship</Link>
        </nav>
        <div className="catalog-actions"><Link href="/account" className="catalog-login">Sign in</Link><Link href="/account" className="catalog-primary">Create account <ArrowRight size={15} /></Link><button className="catalog-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </header>

      <section className="catalog-hero">
        <div className="catalog-hero-copy"><p className="catalog-kicker"><Sparkles size={15} /> THE BTE STRATEGY DESK</p><h1>Good trading starts with a <em>better framework.</em></h1><p>Explore playbooks, mentors, and market ideas from the BTE community. Learn the thinking behind the trade before you ever take one.</p><div className="hero-actions"><a className="catalog-primary large" href="#strategies">Explore strategies <ArrowRight size={17} /></a><Link className="catalog-secondary" href="/mentorship">Meet the mentors <ChevronRight size={16} /></Link></div><div className="hero-proof"><span><Check size={14} /> Curated education</span><span><Check size={14} /> Clear risk language</span><span><Check size={14} /> Your pace, your process</span></div></div>
        <div className="hero-feature"><div className="feature-top"><span className="feature-badge">FEATURED PLAYBOOK</span><span><Star size={14} fill="currentColor" /> 4.9</span></div><div className="feature-art"><span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" /><span className="art-line line-one" /><span className="art-line line-two" /><strong>READ<br />THE<br /><i>MOVE.</i></strong></div><div className="feature-body"><p className="catalog-kicker">ARIEL HERNANDEZ · SWING TRADING</p><h2>Price Action &amp; Trend Following</h2><p>Eliminate FOMO with a checklist-driven approach to entries, stops, and targets.</p><Link href="/mentorship">View playbook <ArrowRight size={14} /></Link></div></div>
      </section>

      <section className="trust-row"><span>Built for thoughtful participation</span><div><span><ShieldCheck size={17} /> Risk-first education</span><span><Users size={17} /> 1,200+ learners</span><span><Play size={17} /> Video-led lessons</span></div></section>

      <section id="strategies" className="catalog-section"><div className="section-heading"><div><p className="catalog-kicker">EXPLORE THE DESK</p><h2>Find a strategy that <em>fits your thinking.</em></h2></div><p>Every strategist has a different lens. Browse the collection, open a playbook, and see what resonates.</p></div><div className="catalog-toolbar"><div className="category-pills">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><label className="catalog-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search strategies or mentors" /></label></div><div className="strategy-catalog">{filtered.map((strategy, index) => <article className="strategy-tile" key={strategy.id} onClick={() => setSelected(strategy)}><div className={`strategy-cover ${coverColors[index % coverColors.length]}`}><span className="cover-label">{strategy.category}</span><span className="cover-avatar">{initials(strategy.trader_name)}</span><div className="cover-wave" /><strong>{strategy.title.split(' ').slice(0, 3).join(' ')}<br /><i>PLAYBOOK</i></strong></div><div className="strategy-tile-body"><p className="tile-meta">{strategy.markets} <span>·</span> {strategy.difficulty}</p><h3>{strategy.title}</h3><p className="tile-author">with <strong>{strategy.trader_name}</strong></p><p className="tile-desc">{strategy.description}</p><button>Explore strategy <ArrowRight size={14} /></button></div></article>)}</div>{filtered.length === 0 && <div className="empty-catalog">No strategies match that search yet. Try another market or mentor.</div>}</section>

      <section id="mentors" className="mentor-strip"><div><p className="catalog-kicker">THE PEOPLE BEHIND THE PLAYBOOKS</p><h2>Learn from people who <em>do the work.</em></h2><p>Meet the mentors bringing real experience, honest lessons, and a human voice to the market.</p><Link href="/mentorship" className="catalog-secondary">View all mentors <ArrowRight size={15} /></Link></div><div className="mentor-peek">{(mentors.length ? mentors.slice(0, 3) : [{ id: 'a', name: 'Ariel Hernandez', specialty: 'Price action & swing trading', total_students: 284, rating: 4.9 }, { id: 'b', name: 'Brando Elite', specialty: 'Options & market structure', total_students: 412, rating: 4.8 }, { id: 'c', name: 'Umar Ashraf', specialty: 'Momentum & risk systems', total_students: 189, rating: 4.9 }]).map((mentor, index) => <div className="mentor-mini" key={mentor.id}><div className={`mentor-mini-avatar mini-${index}`}>{initials(mentor.name)}</div><div><h3>{mentor.name}</h3><p>{mentor.specialty}</p><span><Star size={12} fill="currentColor" /> {mentor.rating} · {mentor.total_students} learners</span></div></div>)}</div></section>

      <section className="catalog-cta"><div><p className="catalog-kicker">READY WHEN YOU ARE</p><h2>Start with curiosity.<br /><em>Build with intention.</em></h2></div><Link href="/account" className="catalog-primary large">Create your free account <ArrowRight size={17} /></Link></section>
      <footer className="catalog-footer"><Link href="/" className="catalog-logo"><span className="catalog-logo-mark">B</span><span>Blockchain Trust <small>Enterprise</small></span></Link><span>Education first. Always.</span><div><Link href="/mentorship">Mentorship</Link><Link href="/account">Account</Link><Link href="/contact">Contact</Link></div></footer>

      {selected && <div className="strategy-modal-backdrop" onClick={() => setSelected(null)}><div className="strategy-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X size={19} /></button><div className="modal-video modal-video-embed"><iframe src={`https://www.youtube-nocookie.com/embed/${strategyVideoIds[selected.trader_name] || 'HNuRp9Z1bMs'}?rel=0& modestbranding=1`} title={`${selected.title} video`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div><p className="catalog-kicker">{selected.category} · {selected.markets}</p><h2>{selected.title}</h2><p className="modal-byline">with <strong>{selected.trader_name}</strong></p><p>{selected.description}</p><div className="modal-actions"><Link href="/mentorship" className="catalog-primary">Open full playbook <ArrowRight size={15} /></Link><Link href="/account" className="catalog-secondary">Create account</Link></div></div></div>}
    </main>
  );
}
