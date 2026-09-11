'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalClients: number;
  activeClients: number;
  totalEntities: number;
  activeEntities: number;
  totalPartners: number;
  totalTreasuryAccounts: number;
  totalTreasuryValue: number;
  totalDocuments: number;
  totalVaults: number;
  parentEntities: number;
  subsidiaryEntities: number;
  clientsByType: Array<{ client_type: string; count: number }>;
  clientsByStatus: Array<{ status: string; count: number }>;
  entitiesByJurisdiction: Array<{ jurisdiction: string; count: number }>;
  entitiesByTier: Array<{ tier_type: string; count: number }>;
  workflowProgress: Array<{ step_name: string; completed: number; total: number }>;
  recentActivity: Array<{ type: string; description: string; created_at: string }>;
  documentsByStatus: Array<{ status: string; count: number }>;
  totalPayments: number;
  pendingPayments: number;
  confirmedPayments: number;
  paymentsByNetwork: Array<{ target_network: string; count: number }>;
}

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentHover: '#5a2fd6', ink: '#2d2b2b', accentLight: '#f1ecff' };
const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

const typeLabels: Record<string, string> = {
  hnw_investor: 'HNW Investor', web3_founder: 'Web3 Founder', dao_member: 'DAO Member',
  crypto_miner: 'Crypto Miner', staking_operator: 'Staking Operator',
};

const treasuryAssets = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$78,700', change: '+1.2%' },
  { symbol: 'ETH', name: 'Ethereum', price: '$2,490', change: '+2.4%' },
  { symbol: 'SOL', name: 'Solana', price: '$103.00', change: '+3.1%' },
  { symbol: 'XRP', name: 'Ripple', price: '$1.40', change: '+0.8%' },
  { symbol: 'AVAX', name: 'Avalanche', price: '$18.20', change: '-1.2%' },
  { symbol: 'USDC', name: 'USD Coin', price: '$1.00', change: '0.0%' },
];

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', borderBottom: `2px solid ${C.surface}` };
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${C.surface}` };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bte-admin-token');
    fetch('/api/stats', { headers: { Authorization: `Bearer ${token || ''}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((p) => { if (p) setStats(p); });
  }, []);

  if (!stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256, fontFamily: FONT }}>
        <span style={{ fontSize: 13, color: 'rgba(32,30,29,0.5)' }}>Loading dashboard...</span>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const statCards = [
    { label: 'Active clients', value: stats.totalClients, sub: `${stats.activeClients} active` },
    { label: 'Entities', value: stats.totalEntities, sub: `${stats.parentEntities} parent · ${stats.subsidiaryEntities} subsidiary` },
    { label: 'Treasury AUM', value: `$${(stats.totalTreasuryValue || 0).toLocaleString()}`, sub: `${stats.totalTreasuryAccounts} accounts · ${stats.totalVaults} vaults` },
    { label: 'Pending onboarding', value: stats.clientsByStatus?.find(s => s.status === 'onboarding')?.count || 0, sub: `${stats.totalDocuments} documents` },
  ];

  return (
    <div style={{ fontFamily: FONT, color: C.text }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'rgba(32,30,29,0.5)', marginTop: 4 }}>{today}</p>
        </div>
        <Link href="/admin/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accent, color: '#fff', padding: '10px 20px', fontSize: 13, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'left' }}>
          + New client
        </Link>
      </div>

      {/* Stat cards on divider grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: C.surface, marginBottom: 32 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: '#fff', padding: '24px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.text }}>{card.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)', marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* 2-up: pipeline + treasury snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: C.surface, marginBottom: 32 }}>
        {/* Onboarding pipeline */}
        <div style={{ background: '#fff', padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px' }}>Onboarding pipeline</h2>
          <p style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)', margin: '0 0 20px' }}>6-stage workflow progress</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Step</th>
                <th style={thStyle}>Progress</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {stats.workflowProgress.map((step, i) => {
                const pct = step.total > 0 ? (step.completed / step.total) * 100 : 0;
                return (
                  <tr key={step.step_name}>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                      {step.step_name}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ width: '100%', height: 4, background: C.surface }}>
                        <div style={{ width: `${pct}%`, height: 4, background: C.accent }} />
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{step.completed}/{step.total}</td>
                  </tr>
                );
              })}
              {stats.workflowProgress.length === 0 && (
                <tr><td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(32,30,29,0.4)' }}>No active workflows</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Treasury snapshot */}
        <div style={{ background: C.ink, padding: 24, color: '#fff' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px' }}>Treasury snapshot</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>Illustrative prices · Sept 9 2026</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {treasuryAssets.map((asset) => (
              <div key={asset.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{asset.symbol}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>{asset.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{asset.price}</span>
                  <span style={{ fontSize: 12, marginLeft: 10, color: asset.change.startsWith('-') ? '#ff6b6b' : asset.change === '0.0%' ? 'rgba(255,255,255,0.5)' : '#4ade80' }}>{asset.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client breakdown table */}
      <div style={{ background: '#fff', border: `2px solid ${C.surface}` }}>
        <div style={{ padding: '20px 24px', borderBottom: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Client breakdown</h2>
          <Link href="/admin/clients" style={{ fontSize: 12, fontWeight: 600, color: C.accent, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Type</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {stats.clientsByType.map((item) => (
                <tr key={item.client_type}>
                  <td style={tdStyle}>{typeLabels[item.client_type] || item.client_type}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{item.count}</td>
                </tr>
              ))}
              {stats.clientsByType.length === 0 && (
                <tr><td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(32,30,29,0.4)' }}>No clients yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Status + Document rows */}
        <div style={{ padding: '16px 24px', borderTop: `2px solid ${C.surface}`, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>By status</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {stats.clientsByStatus.map((item) => (
                <span key={item.status} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', border: `2px solid ${C.surface}`, textTransform: 'capitalize' }}>
                  {item.status} ({item.count})
                </span>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>Documents</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {stats.documentsByStatus?.map((item) => (
                <span key={item.status} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', border: `2px solid ${C.surface}`, textTransform: 'capitalize' }}>
                  {item.status} ({item.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment verification */}
      {(stats.totalPayments > 0 || stats.pendingPayments > 0) && (
        <div style={{ marginTop: 32, background: '#fff', border: `2px solid ${C.surface}` }}>
          <div style={{ padding: '20px 24px', borderBottom: `2px solid ${C.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Payment verification</h2>
            <Link href="/admin/payments" style={{ fontSize: 12, fontWeight: 600, color: C.accent, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: C.surface }}>
            <div style={{ background: '#fff', padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)' }}>Total</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{stats.totalPayments}</div>
            </div>
            <div style={{ background: '#fff', padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#B45309' }}>Pending</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: '#B45309' }}>{stats.pendingPayments}</div>
            </div>
            <div style={{ background: '#fff', padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#15803D' }}>Confirmed</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: '#15803D' }}>{stats.confirmedPayments}</div>
            </div>
          </div>
          {stats.paymentsByNetwork && stats.paymentsByNetwork.length > 0 && (
            <div style={{ padding: '12px 24px', display: 'flex', gap: 8 }}>
              {stats.paymentsByNetwork.map((n) => (
                <span key={n.target_network} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', border: `2px solid ${C.surface}` }}>{n.target_network}: {n.count}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent activity */}
      <div style={{ marginTop: 32, background: '#fff', border: `2px solid ${C.surface}` }}>
        <div style={{ padding: '20px 24px', borderBottom: `2px solid ${C.surface}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Recent activity</h2>
        </div>
        {stats.recentActivity.length === 0 ? (
          <p style={{ padding: 24, fontSize: 13, color: 'rgba(32,30,29,0.4)' }}>No recent activity. Start by adding a new client.</p>
        ) : (
          <div>
            {stats.recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: i < stats.recentActivity.length - 1 ? `1px solid ${C.surface}` : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.description}</div>
                  <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.5)', textTransform: 'capitalize' }}>{item.type}</div>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(32,30,29,0.4)' }}>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px' }}>Quick actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: C.surface }}>
          {[
            { label: 'New Client', desc: 'Start 6-stage onboarding', href: '/admin/onboarding' },
            { label: 'Payments', desc: 'Multi-chain verification', href: '/admin/payments' },
            { label: 'Documents', desc: 'Agreements & filings', href: '/admin/documents' },
            { label: 'Treasury', desc: 'Accounts, vaults & wallets', href: '/admin/treasury' },
          ].map((action) => (
            <Link key={action.label} href={action.href} style={{ background: '#fff', padding: 20, textDecoration: 'none', color: C.text }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{action.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)' }}>{action.desc}</div>
              <span style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 600, color: C.accent }}>Open →</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
