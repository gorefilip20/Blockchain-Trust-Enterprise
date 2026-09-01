'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, BookOpen, CheckCircle2, XCircle, Clock, Star, AlertCircle } from 'lucide-react';

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

const statusColors: Record<string, string> = {
  pending: '#e0a800', approved: '#3b82f6', active: '#0fa987', suspended: '#ef4444', rejected: '#6b7280',
};

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
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Mentorship Management</h1>
      <p style={{ color: '#66808e', fontSize: 13, marginBottom: 24 }}>Manage mentors, applications, strategies, and fees.</p>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
          <SC icon={<Users size={18} />} label="Total Mentors" value={String(stats.total_mentors)} color="#3b82f6" />
          <SC icon={<CheckCircle2 size={18} />} label="Active" value={String(stats.active_mentors)} color="#0fa987" />
          <SC icon={<Clock size={18} />} label="Pending" value={String(stats.pending_mentors)} color="#e0a800" />
          <SC icon={<DollarSign size={18} />} label="Fees Collected" value={`$${(stats.total_fees_collected || 0).toLocaleString()}`} color="#8b5cf6" />
          <SC icon={<BookOpen size={18} />} label="Strategies" value={String(stats.total_strategies)} color="#0fa987" />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button onClick={() => setTab('mentors')} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: tab === 'mentors' ? '#0fa987' : 'transparent', color: tab === 'mentors' ? '#fff' : '#66808e', borderColor: tab === 'mentors' ? '#0fa987' : '#d3e1e8' }}>Mentors</button>
        <button onClick={() => setTab('strategies')} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: tab === 'strategies' ? '#0fa987' : 'transparent', color: tab === 'strategies' ? '#fff' : '#66808e', borderColor: tab === 'strategies' ? '#0fa987' : '#d3e1e8' }}>Strategies</button>
        <button onClick={() => setTab('subscriptions')} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: tab === 'subscriptions' ? '#0fa987' : 'transparent', color: tab === 'subscriptions' ? '#fff' : '#66808e', borderColor: tab === 'subscriptions' ? '#0fa987' : '#d3e1e8' }}>Student Access</button>
      </div>

      {tab === 'mentors' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'active', 'suspended', 'rejected'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid', fontSize: 10, fontWeight: 600, cursor: 'pointer', background: filter === s ? '#173247' : 'transparent', color: filter === s ? '#fff' : '#8aa0ac', borderColor: filter === s ? '#173247' : '#d3e1e8' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5edf1', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Mentor</th>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Specialty</th>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Markets</th>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Fee</th>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Students</th>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMentors.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #edf3f6' }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600, color: '#173247' }}>{m.name}</div>
                      <div style={{ fontSize: 10, color: '#8aa0ac' }}>{m.email}</div>
                      {m.telegram_handle && <div style={{ fontSize: 10, color: '#0fa987' }}>{m.telegram_handle}</div>}
                    </td>
                    <td style={{ padding: '10px', color: '#456271' }}>{m.specialty}</td>
                    <td style={{ padding: '10px', color: '#456271', fontSize: 11 }}>{m.markets}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ color: m.fee_paid ? '#0fa987' : '#ef4444', fontWeight: 600, fontSize: 11 }}>
                        {m.fee_paid ? 'Paid' : 'Unpaid'} (${m.fee_amount})
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={12} color="#e0a800" fill="#e0a800" />
                        <span style={{ fontWeight: 600 }}>{m.rating}</span>
                        <span style={{ color: '#8aa0ac', fontSize: 10 }}>({m.total_students})</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${statusColors[m.status]}18`, color: statusColors[m.status] }}>{m.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {m.status === 'pending' && (
                          <>
                            <Btn color="#0fa987" onClick={() => updateMentor(m.id, 'approved')}>Approve</Btn>
                            <Btn color="#ef4444" onClick={() => updateMentor(m.id, 'rejected')}>Reject</Btn>
                          </>
                        )}
                        {m.status === 'approved' && !m.fee_paid && (
                          <Btn color="#3b82f6" onClick={() => updateMentor(m.id, 'active', true)}>Mark Paid & Activate</Btn>
                        )}
                        {m.status === 'approved' && m.fee_paid === 1 && (
                          <Btn color="#0fa987" onClick={() => updateMentor(m.id, 'active')}>Activate</Btn>
                        )}
                        {m.status === 'active' && (
                          <Btn color="#e0a800" onClick={() => updateMentor(m.id, 'suspended')}>Suspend</Btn>
                        )}
                        {m.status === 'suspended' && (
                          <Btn color="#0fa987" onClick={() => updateMentor(m.id, 'active')}>Reactivate</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMentors.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#8aa0ac' }}>No mentors found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'subscriptions' && (
        <div style={{ overflowX: 'auto' }}>
          <p style={{ color: '#66808e', fontSize: 12, marginBottom: 14 }}>Mark both payment and approval as complete to automatically unlock the private mentorship guide for that student.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ borderBottom: '2px solid #e5edf1', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', color: '#66808e' }}>Student</th><th style={{ padding: '8px 10px', color: '#66808e' }}>Payment reference</th><th style={{ padding: '8px 10px', color: '#66808e' }}>Payment</th><th style={{ padding: '8px 10px', color: '#66808e' }}>Approval</th><th style={{ padding: '8px 10px', color: '#66808e' }}>Access</th><th style={{ padding: '8px 10px', color: '#66808e' }}>Actions</th>
            </tr></thead>
            <tbody>{subscriptions.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #edf3f6' }}>
                <td style={{ padding: '10px' }}><div style={{ fontWeight: 600, color: '#173247' }}>{s.full_name}</div><div style={{ fontSize: 10, color: '#8aa0ac' }}>{s.email}</div></td>
                <td style={{ padding: '10px', fontSize: 10, color: '#456271', maxWidth: 180, wordBreak: 'break-all' }}>{s.payment_reference || '—'}</td>
                <td style={{ padding: '10px' }}><span style={{ color: s.payment_status === 'paid' ? '#0fa987' : '#e0a800', fontWeight: 600 }}>{s.payment_status}</span></td>
                <td style={{ padding: '10px' }}><span style={{ color: s.approval_status === 'approved' ? '#0fa987' : s.approval_status === 'rejected' ? '#ef4444' : '#e0a800', fontWeight: 600 }}>{s.approval_status}</span></td>
                <td style={{ padding: '10px' }}><span style={{ color: s.notion_access_enabled ? '#0fa987' : '#8aa0ac', fontWeight: 600 }}>{s.notion_access_enabled ? 'Unlocked' : 'Locked'}</span></td>
                <td style={{ padding: '10px' }}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Btn color="#0fa987" onClick={() => updateSubscription(s.id, 'paid', 'approved')}>Paid & Approve</Btn>
                  <Btn color="#ef4444" onClick={() => updateSubscription(s.id, s.payment_status, 'rejected')}>Reject</Btn>
                  {s.approval_status === 'approved' && <Btn color="#e0a800" onClick={() => updateSubscription(s.id, s.payment_status, 'suspended')}>Suspend</Btn>}
                </div></td>
              </tr>
            ))}{subscriptions.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#8aa0ac' }}>No student registrations yet.</td></tr>}</tbody>
          </table>
        </div>
      )}

      {tab === 'strategies' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5edf1', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Strategy</th>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Trader</th>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Markets</th>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Difficulty</th>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #edf3f6' }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#173247' }}>{s.title}</td>
                  <td style={{ padding: '10px', color: '#456271' }}>{s.trader_name}</td>
                  <td style={{ padding: '10px', color: '#456271' }}>{s.category}</td>
                  <td style={{ padding: '10px', color: '#456271', fontSize: 11 }}>{s.markets}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ color: difficultyColor[s.difficulty] || '#66808e', fontWeight: 600 }}>{s.difficulty}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: s.status === 'active' ? '#0fa98718' : '#ef444418', color: s.status === 'active' ? '#0fa987' : '#ef4444' }}>{s.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {s.status === 'active' ? (
                      <Btn color="#e0a800" onClick={() => updateStrategy(s.id, 'inactive')}>Disable</Btn>
                    ) : (
                      <Btn color="#0fa987" onClick={() => updateStrategy(s.id, 'active')}>Enable</Btn>
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

const difficultyColor: Record<string, string> = { Beginner: '#3b82f6', Intermediate: '#0fa987', Advanced: '#e0a800' };

function SC({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5edf1', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ background: `${color}14`, color, borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#173247' }}>{value}</div>
        <div style={{ fontSize: 10, color: '#8aa0ac', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function Btn({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ background: color, color: '#fff', border: 0, borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}
