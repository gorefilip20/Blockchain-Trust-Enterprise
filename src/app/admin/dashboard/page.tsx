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

const typeLabels: Record<string, string> = {
  hnw_investor: 'HNW Investor',
  web3_founder: 'Web3 Founder',
  dao_member: 'DAO Member',
  crypto_miner: 'Crypto Miner',
  staking_operator: 'Staking Operator',
};

const statusColors: Record<string, string> = {
  lead: 'bg-slate-100 text-slate-700',
  onboarding: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
};

const activityIcons: Record<string, React.ReactNode> = {
  client: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  entity: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
    </svg>
  ),
  document: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  workflow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bte-admin-token');
    fetch('/api/stats', { headers: { Authorization: `Bearer ${token || ''}` } })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => { if (payload) setStats(payload); });
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5" style={{ color: '#6A45E8' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-400 text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statCards = [
    {
      label: 'Total Clients',
      value: stats.totalClients,
      sub: `${stats.activeClients} active`,
      borderColor: '#6A45E8',
      iconBg: 'rgba(106,69,232,0.1)',
      iconColor: '#6A45E8',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Entities Formed',
      value: stats.totalEntities,
      sub: `${stats.parentEntities} parent · ${stats.subsidiaryEntities} subsidiary`,
      borderColor: '#8B6BEA',
      iconBg: 'rgba(139,107,234,0.12)',
      iconColor: '#7250D0',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="12" y2="14" />
        </svg>
      ),
    },
    {
      label: 'Legal Documents',
      value: stats.totalDocuments,
      sub: `${stats.documentsByStatus?.find((d) => d.status === 'generated')?.count || 0} generated`,
      borderColor: '#A15CF4',
      iconBg: 'rgba(161,92,244,0.12)',
      iconColor: '#8A45D8',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: 'Treasury & Vaults',
      value: stats.totalTreasuryAccounts + stats.totalVaults,
      sub: `$${(stats.totalTreasuryValue || 0).toLocaleString()} · ${stats.totalVaults} vaults`,
      borderColor: '#D483E8',
      iconBg: 'rgba(212,131,232,0.14)',
      iconColor: '#B15EC8',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 14h.01" />
          <path d="M10 14h4" />
        </svg>
      ),
    },
  ];

  const pipelineColors = ['#6A45E8', '#8B6BEA', '#A15CF4', '#D483E8', '#B795FF', '#7C63D7'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{today}</p>
        </div>
        <Link
          href="/admin/onboarding"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ backgroundColor: '#6A45E8' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4821B8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#6A45E8'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          New Client
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow"
            style={{ borderLeft: `4px solid ${card.borderColor}`, border: `1px solid #E2E8F0`, borderLeftWidth: '4px', borderLeftColor: card.borderColor }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.iconBg, color: card.iconColor }}
              >
                {card.icon}
              </div>
              <span className="text-3xl font-bold text-slate-900">{card.value}</span>
            </div>
            <div className="font-semibold text-slate-700 text-sm">{card.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Entity Tier Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,107,234,0.12)', color: '#7250D0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Parent Entities (Delaware)</div>
              <div className="text-xs text-slate-500">Multi-member fundraising hubs</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.parentEntities}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(139,107,234,0.12)', color: '#7250D0' }}>Partnership (1065)</span>
            <span className="text-xs text-slate-400">Tax classification</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(106,69,232,0.1)', color: '#6A45E8' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Subsidiary Entities (Wyoming)</div>
              <div className="text-xs text-slate-500">Single-member anonymous asset vaults</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.subsidiaryEntities}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(106,69,232,0.1)', color: '#5D3CC0' }}>Disregarded Entity</span>
            <span className="text-xs text-slate-400">Flow-through to parent</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6-Stage Workflow Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-1">6-Stage Onboarding Pipeline</h2>
          <p className="text-xs text-slate-500 mb-4">Two-tier parent-subsidiary formation workflow</p>
          <div className="space-y-4">
            {stats.workflowProgress.map((step, i) => {
              const pct = step.total > 0 ? (step.completed / step.total) * 100 : 0;
              const color = pipelineColors[i % pipelineColors.length];
              return (
                <div key={step.step_name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-700">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white mr-2" style={{ backgroundColor: color }}>{i + 1}</span>
                      {step.step_name}
                    </span>
                    <span className="text-slate-500 font-medium">{step.completed}/{step.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 ml-7">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.workflowProgress.length === 0 && (
              <div className="text-sm text-slate-400 py-4 text-center">No active workflows. Start by onboarding a client.</div>
            )}
          </div>
        </div>

        {/* Client Breakdown */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Clients by Type</h2>
          <div className="space-y-3">
            {stats.clientsByType.map((item) => (
              <div key={item.client_type} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{typeLabels[item.client_type] || item.client_type}</span>
                <span
                  className="text-sm font-medium px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(106,69,232,0.1)', color: '#5D3CC0' }}
                >
                  {item.count}
                </span>
              </div>
            ))}
            {stats.clientsByType.length === 0 && (
              <div className="text-sm text-slate-400">No clients yet</div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 mb-3">By Status</h3>
            <div className="flex flex-wrap gap-2">
              {stats.clientsByStatus.map((item) => (
                <span
                  key={item.status}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[item.status] || 'bg-slate-100 text-slate-700'}`}
                >
                  {item.status} ({item.count})
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 mb-3">Document Status</h3>
            <div className="flex flex-wrap gap-2">
              {stats.documentsByStatus?.map((item) => (
                <span
                  key={item.status}
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: item.status === 'generated' ? '#DBEAFE' : item.status === 'signed' ? '#DCFCE7' : item.status === 'verified' ? '#D1FAE5' : '#F1F5F9',
                    color: item.status === 'generated' ? '#1D4ED8' : item.status === 'signed' ? '#15803D' : item.status === 'verified' ? '#065F46' : '#475569',
                  }}
                >
                  {item.status} ({item.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Verification Status */}
      {(stats.totalPayments > 0 || stats.pendingPayments > 0) && (
        <div className="mt-6 bg-white rounded-xl border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Payment Verification Engine</h2>
            <Link href="/admin/payments" className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ backgroundColor: 'rgba(139,107,234,0.12)', color: '#7250D0' }}>View All</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-xl font-bold text-slate-900">{stats.totalPayments}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}>
              <div className="text-xs" style={{ color: '#B45309' }}>Pending</div>
              <div className="text-xl font-bold" style={{ color: '#B45309' }}>{stats.pendingPayments}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(21,128,61,0.08)' }}>
              <div className="text-xs" style={{ color: '#15803D' }}>Confirmed</div>
              <div className="text-xl font-bold" style={{ color: '#15803D' }}>{stats.confirmedPayments}</div>
            </div>
          </div>
          {stats.paymentsByNetwork && stats.paymentsByNetwork.length > 0 && (
            <div className="mt-3 flex gap-2">
              {stats.paymentsByNetwork.map((n) => (
                <span key={n.target_network} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                  backgroundColor: n.target_network === 'BEP20' ? '#FEF3C7' : n.target_network === 'TRC20' ? '#FEE2E2' : '#DBEAFE',
                  color: n.target_network === 'BEP20' ? '#B45309' : n.target_network === 'TRC20' ? '#B91C1C' : '#1D4ED8',
                }}>{n.target_network}: {n.count}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-slate-400 text-sm">No recent activity. Start by adding a new client.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(106,69,232,0.1)', color: '#6A45E8' }}
                  >
                    {activityIcons[item.type] || activityIcons.client}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{item.description}</div>
                    <div className="text-xs text-slate-500">{item.type === 'client' ? 'Client' : item.type === 'entity' ? 'Entity' : item.type === 'document' ? 'Document' : item.type}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'New Client', desc: 'Start 6-stage onboarding wizard', href: '/admin/onboarding', color: '#6A45E8' },
            { label: 'Payments', desc: 'Multi-chain verification', href: '/admin/payments', color: '#8B6BEA' },
            { label: 'Documents', desc: 'Agreements & filings', href: '/admin/documents', color: '#A15CF4' },
            { label: 'Treasury', desc: 'Accounts, vaults & wallets', href: '/admin/treasury', color: '#D483E8' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: action.color }}
                />
                <span className="font-semibold text-slate-900 group-hover:text-slate-700">{action.label}</span>
              </div>
              <p className="text-sm text-slate-500">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
