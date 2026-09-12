'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, BookOpen, CheckCircle2, Clock, Star } from 'lucide-react';

interface Mentor {
  id: string; name: string; email: string; specialty: string; bio: string;
  experience_years: number; markets: string; fee_paid: number; fee_amount: number;
  telegram_handle: string; status: string; total_students: number; rating: number; created_at: string;
}
interface Subscription {
  id: string; full_name: string; email: string; plan_name: string;
  payment_status: string; approval_status: string; payment_reference: string | null;
  notion_access_enabled: number; created_at: string; approved_at: string | null;
}
interface Strategy {
  id: string; title: string; trader_name: string; category: string; markets: string;
  difficulty: string; status: string;
}
interface Stats {
  total_mentors: number; active_mentors: number; pending_mentors: number;
  total_fees_collected: number; total_strategies: number;
}

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentLight: '#f1ecff', ink: '#2d2b2b' };

const statusColors: Record<string, string> = {
  pending: '#e0a800', approved: '#3b82f6', active: '#2f9e58', suspended: '#ef4444', rejected: '#6b7280',
};

const difficultyColor: Record<string, string> = { Beginner: '#3b82f6', Intermediate: '#2f9e58', Advanced: '#e0a800' };

export default function AdminMentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<'mentors' | 'strategies' | 'subscriptions'>('mentors');
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  function load() {
    const token = localStorage.getItem('bte-admin-token');
    fetch('/api/mentorship?section=admin', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        setMentors(d.mentors || []);
        setStrategies(d.strategies || []);
        setSubscriptions(d.subscriptions || []);
        setStats(d.stats || null);
      });
  }

  async function updateMentor(id: string, status: string, feePaid?: boolean) {
    const token = localStorage.getItem('bte-admin-token');
    await fetch('/api/mentorship', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'mentor', id, status, ...(feePaid !== undefined ? { fee_paid: feePaid } : {}) }),
    });
    load();
  }

  async function updateSubscription(id: string, paymentStatus: string, approvalStatus: string) {
    const token = localStorage.getItem('bte-admin-token');
    await fetch('/api/mentorship', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'subscription', id, payment_status: paymentStatus, approval_status: approvalStatus }),
    });
    load();
  }

  async function updateStrategy(id: string, status: string) {
    const token = localStorage.getItem('bte-admin-token');
    await fetch('/api/mentorship', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'strategy', id, status }),
    });
    load();
  }

  const filteredMentors = filter === 'all' ? mentors : mentors.filter(m => m.status === filter);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Mentorship Management</h1>
      <p style={{ color: 'rgba(32,30,29,0.5)', fontSize: 13, marginBottom: 24 }}>Manage mentors, applications, strategies, and fees.</p>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 8, marginBottom: 24 }}>
          <SC icon={<Users size={18} />} label="Total Mentors" value={String(stats.total_mentors)} color="#3b82f6" />
          <SC icon={<CheckCircle2 size={18} />} label="Active" value={String(stats.active_mentors)} color="#2f9e58" />
          <SC icon={<Clock size={18} />} label="Pending" value={String(stats.pending_mentors)} color="#e0a800" />
          <SC icon={<DollarSign size={18} />} label="Fees Collected" value={`$${(stats.total_fees_collected || 0).toLocaleString()}`} color={C.accent} />
          <SC icon={<BookOpen size={18} />} label="Strategies" value={String(stats.total_strategies)} color="#2f9e58" />
        </div>
      )}

      <div style={{ display: 'flex', gap: 0, marginBottom: 18, border: `2px solid ${C.surface}`, width: 'fit-content' }}>
        {(['mentors', 'strategies', 'subscriptions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: tab === t ? C.text : 'transparent', color: tab === t ? C.bg : 'rgba(32,30,29,0.5)',
            letterSpacing: '0.03em',
          }}>
            {t === 'mentors' ? 'Mentors' : t === 'strategies' ? 'Strategies' : 'Student Access'}
          </button>
        ))}
      </div>

      {tab === 'mentors' && (
        <>
          <div style={{ display: 'flex', gap: 0, marginBottom: 14, flexWrap: 'wrap', border: `2px solid ${C.surface}`, width: 'fit-content' }}>
            {['all', 'pending', 'approved', 'active', 'suspended', 'rejected'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '4px 12px', border: 'none', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                background: filter === s ? C.accent : 'transparent', color: filter === s ? '#fff' : 'rgba(32,30,29,0.5)',
                letterSpacing: '0.04em',
              }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.surface}`, textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mentor</th>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Specialty</th>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Markets</th>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Fee</th>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Students</th>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMentors.map(m => (
                  <tr key={m.id} style={{ borderBottom: `1px solid ${C.surface}` }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600, color: C.text }}>{m.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)' }}>{m.email}</div>
                      {m.telegram_handle && <div style={{ fontSize: 10, color: C.accent }}>{m.telegram_handle}</div>}
                    </td>
                    <td style={{ padding: '10px', color: C.ink }}>{m.specialty}</td>
                    <td style={{ padding: '10px', color: C.ink, fontSize: 11 }}>{m.markets}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ color: m.fee_paid ? '#2f9e58' : '#ef4444', fontWeight: 600, fontSize: 11 }}>
                        {m.fee_paid ? 'Paid' : 'Unpaid'} (${m.fee_amount})
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={12} color="#e0a800" fill="#e0a800" />
                        <span style={{ fontWeight: 600 }}>{m.rating}</span>
                        <span style={{ color: 'rgba(32,30,29,0.4)', fontSize: 10 }}>({m.total_students})</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 8px', fontSize: 10, fontWeight: 700, background: `${statusColors[m.status]}18`, color: statusColors[m.status], letterSpacing: '0.04em' }}>{m.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {m.status === 'pending' && (
                          <>
                            <Btn color="#2f9e58" onClick={() => updateMentor(m.id, 'approved')}>Approve</Btn>
                            <Btn color="#ef4444" onClick={() => updateMentor(m.id, 'rejected')}>Reject</Btn>
                          </>
                        )}
                        {m.status === 'approved' && !m.fee_paid && (
                          <Btn color="#3b82f6" onClick={() => updateMentor(m.id, 'active', true)}>Mark Paid & Activate</Btn>
                        )}
                        {m.status === 'approved' && m.fee_paid === 1 && (
                          <Btn color="#2f9e58" onClick={() => updateMentor(m.id, 'active')}>Activate</Btn>
                        )}
                        {m.status === 'active' && (
                          <Btn color="#e0a800" onClick={() => updateMentor(m.id, 'suspended')}>Suspend</Btn>
                        )}
                        {m.status === 'suspended' && (
                          <Btn color="#2f9e58" onClick={() => updateMentor(m.id, 'active')}>Reactivate</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMentors.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'rgba(32,30,29,0.4)' }}>No mentors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'subscriptions' && (
        <div style={{ overflowX: 'auto' }}>
          <p style={{ color: 'rgba(32,30,29,0.5)', fontSize: 12, marginBottom: 14 }}>Mark both payment and approval as complete to automatically unlock the private mentorship guide for that student.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ borderBottom: `2px solid ${C.surface}`, textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Student</th>
              <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment reference</th>
              <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment</th>
              <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Approval</th>
              <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Access</th>
              <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</th>
            </tr></thead>
            <tbody>{subscriptions.map(s => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${C.surface}` }}>
                <td style={{ padding: '10px' }}><div style={{ fontWeight: 600, color: C.text }}>{s.full_name}</div><div style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)' }}>{s.email}</div></td>
                <td style={{ padding: '10px', fontSize: 10, color: C.ink, maxWidth: 180, wordBreak: 'break-all' }}>{s.payment_reference || '—'}</td>
                <td style={{ padding: '10px' }}><span style={{ color: s.payment_status === 'paid' ? '#2f9e58' : '#e0a800', fontWeight: 600 }}>{s.payment_status}</span></td>
                <td style={{ padding: '10px' }}><span style={{ color: s.approval_status === 'approved' ? '#2f9e58' : s.approval_status === 'rejected' ? '#ef4444' : '#e0a800', fontWeight: 600 }}>{s.approval_status}</span></td>
                <td style={{ padding: '10px' }}><span style={{ color: s.notion_access_enabled ? '#2f9e58' : 'rgba(32,30,29,0.4)', fontWeight: 600 }}>{s.notion_access_enabled ? 'Unlocked' : 'Locked'}</span></td>
                <td style={{ padding: '10px' }}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Btn color="#2f9e58" onClick={() => updateSubscription(s.id, 'paid', 'approved')}>Paid & Approve</Btn>
                  <Btn color="#ef4444" onClick={() => updateSubscription(s.id, s.payment_status, 'rejected')}>Reject</Btn>
                  {s.approval_status === 'approved' && <Btn color="#e0a800" onClick={() => updateSubscription(s.id, s.payment_status, 'suspended')}>Suspend</Btn>}
                </div></td>
              </tr>
            ))}{subscriptions.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'rgba(32,30,29,0.4)' }}>No student registrations yet.</td></tr>}</tbody>
          </table>
        </div>
      )}

      {tab === 'strategies' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.surface}`, textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Strategy</th>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Trader</th>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Markets</th>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Difficulty</th>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '8px 10px', color: 'rgba(32,30,29,0.5)', fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${C.surface}` }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: C.text }}>{s.title}</td>
                  <td style={{ padding: '10px', color: C.ink }}>{s.trader_name}</td>
                  <td style={{ padding: '10px', color: C.ink }}>{s.category}</td>
                  <td style={{ padding: '10px', color: C.ink, fontSize: 11 }}>{s.markets}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ color: difficultyColor[s.difficulty] || 'rgba(32,30,29,0.5)', fontWeight: 600 }}>{s.difficulty}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', fontSize: 10, fontWeight: 700, background: s.status === 'active' ? '#2f9e5818' : '#ef444418', color: s.status === 'active' ? '#2f9e58' : '#ef4444', letterSpacing: '0.04em' }}>{s.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {s.status === 'active' ? (
                      <Btn color="#e0a800" onClick={() => updateStrategy(s.id, 'inactive')}>Disable</Btn>
                    ) : (
                      <Btn color="#2f9e58" onClick={() => updateStrategy(s.id, 'active')}>Enable</Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SC({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ background: `${color}14`, color, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{value}</div>
        <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function Btn({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ background: color, color: '#fff', border: 0, padding: '4px 10px', cursor: 'pointer', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
      {children}
    </button>
  );
}
