'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Investment {
  id: string; user_name: string; user_email: string; plan_name: string; tier: string;
  amount_usd: number; projected_return_pct: number; actual_return_pct: number;
  current_value: number; status: string; risk_level: string;
  started_at: string | null; matures_at: string | null; created_at: string;
}
interface Stats {
  total_investments: number; active_count: number; pending_count: number;
  total_aum: number; avg_return: number;
}

const statusColors: Record<string, string> = {
  pending: '#e0a800', active: '#0fa987', matured: '#3b82f6', withdrawn: '#8b5cf6', cancelled: '#ef4444',
};

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  function load() {
    const token = localStorage.getItem('bte-admin-token');
    fetch('/api/admin/investments', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setInvestments(d.investments || []); setStats(d.stats || null); });
  }

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem('bte-admin-token');
    await fetch('/api/admin/investments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'investment', id, status }),
    });
    load();
  }

  const filtered = filter === 'all' ? investments : investments.filter(i => i.status === filter);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Investment Management</h1>
      <p style={{ color: '#66808e', fontSize: 13, marginBottom: 24 }}>Monitor and manage user investment portfolios and plans.</p>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard icon={<DollarSign size={18} />} label="Total AUM" value={`$${(stats.total_aum || 0).toLocaleString()}`} color="#0fa987" />
          <StatCard icon={<Users size={18} />} label="Total Investments" value={String(stats.total_investments || 0)} color="#3b82f6" />
          <StatCard icon={<CheckCircle2 size={18} />} label="Active" value={String(stats.active_count || 0)} color="#0fa987" />
          <StatCard icon={<Clock size={18} />} label="Pending Review" value={String(stats.pending_count || 0)} color="#e0a800" />
          <StatCard icon={<TrendingUp size={18} />} label="Avg Return" value={`${(stats.avg_return || 0).toFixed(1)}%`} color="#8b5cf6" />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {['all', 'pending', 'active', 'matured', 'withdrawn', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: '1px solid', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              background: filter === s ? '#0fa987' : 'transparent',
              color: filter === s ? '#fff' : '#66808e',
              borderColor: filter === s ? '#0fa987' : '#d3e1e8',
            }}
          >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5edf1', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Investor</th>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Plan</th>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Current Value</th>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Return</th>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '8px 10px', color: '#66808e', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #edf3f6' }}>
                <td style={{ padding: '10px' }}>
                  <div style={{ fontWeight: 600, color: '#173247' }}>{inv.user_name}</div>
                  <div style={{ fontSize: 10, color: '#8aa0ac' }}>{inv.user_email}</div>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ fontWeight: 600, color: '#173247' }}>{inv.plan_name}</span>
                  <div style={{ fontSize: 10, color: '#8aa0ac' }}>{inv.risk_level} risk</div>
                </td>
                <td style={{ padding: '10px', fontWeight: 600, color: '#173247' }}>${inv.amount_usd.toLocaleString()}</td>
                <td style={{ padding: '10px', fontWeight: 600, color: inv.current_value >= inv.amount_usd ? '#0fa987' : '#ef4444' }}>
                  ${inv.current_value.toLocaleString()}
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ color: inv.actual_return_pct >= 0 ? '#0fa987' : '#ef4444', fontWeight: 600 }}>
                    {inv.actual_return_pct >= 0 ? '+' : ''}{inv.actual_return_pct}%
                  </span>
                  <div style={{ fontSize: 10, color: '#8aa0ac' }}>Target: {inv.projected_return_pct}%</div>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: `${statusColors[inv.status]}18`, color: statusColors[inv.status],
                  }}>{inv.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {inv.status === 'pending' && (
                      <button onClick={() => updateStatus(inv.id, 'active')} title="Activate"
                        style={{ background: '#0fa987', color: '#fff', border: 0, borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Activate
                      </button>
                    )}
                    {inv.status === 'active' && (
                      <button onClick={() => updateStatus(inv.id, 'matured')} title="Mark Matured"
                        style={{ background: '#3b82f6', color: '#fff', border: 0, borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                        <AlertCircle size={12} /> Mature
                      </button>
                    )}
                    {(inv.status === 'pending' || inv.status === 'active') && (
                      <button onClick={() => updateStatus(inv.id, 'cancelled')} title="Cancel"
                        style={{ background: '#ef4444', color: '#fff', border: 0, borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                        <XCircle size={12} /> Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#8aa0ac' }}>No investments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5edf1', borderRadius: 10, padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ background: `${color}14`, color, borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#173247' }}>{value}</div>
        <div style={{ fontSize: 10, color: '#8aa0ac', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}
