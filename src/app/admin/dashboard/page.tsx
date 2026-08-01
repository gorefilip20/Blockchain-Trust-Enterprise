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
  clientsByType: Array<{ client_type: string; count: number }>;
  clientsByStatus: Array<{ status: string; count: number }>;
  entitiesByJurisdiction: Array<{ jurisdiction: string; count: number }>;
  workflowProgress: Array<{ step_name: string; completed: number; total: number }>;
  recentActivity: Array<{ type: string; description: string; created_at: string }>;
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
    fetch('/api/stats').then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5" style={{ color: '#00D4AA' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      borderColor: '#00D4AA',
      iconBg: 'rgba(0,212,170,0.1)',
      iconColor: '#00D4AA',
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
      sub: `${stats.activeEntities} active`,
      borderColor: '#0052FF',
      iconBg: 'rgba(0,82,255,0.1)',
      iconColor: '#0052FF',
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
      label: 'Partner Network',
      value: stats.totalPartners,
      sub: 'Active partners',
      borderColor: '#8B5CF6',
      iconBg: 'rgba(139,92,246,0.1)',
      iconColor: '#8B5CF6',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Treasury Accounts',
      value: stats.totalTreasuryAccounts,
      sub: `$${(stats.totalTreasuryValue || 0).toLocaleString()} total`,
      borderColor: '#F59E0B',
      iconBg: 'rgba(245,158,11,0.1)',
      iconColor: '#F59E0B',
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

  const pipelineColors = ['#00D4AA', '#0052FF', '#8B5CF6', '#F59E0B', '#EF4444'];

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
          style={{ backgroundColor: '#00D4AA' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00BF99'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00D4AA'; }}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Onboarding Pipeline Progress</h2>
          <div className="space-y-4">
            {stats.workflowProgress.map((step, i) => {
              const pct = step.total > 0 ? (step.completed / step.total) * 100 : 0;
              const color = pipelineColors[i % pipelineColors.length];
              return (
                <div key={step.step_name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-700">
                      <span className="font-medium text-slate-400 mr-2">Step {i + 1}</span>
                      {step.step_name}
                    </span>
                    <span className="text-slate-500 font-medium">{step.completed}/{step.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
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
                  style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}
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
        </div>
      </div>

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
                    style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}
                  >
                    {activityIcons[item.type] || activityIcons.client}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{item.description}</div>
                    <div className="text-xs text-slate-500">{item.type === 'client' ? 'Client activity' : item.type}</div>
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
            { label: 'New Client', desc: 'Start onboarding wizard', href: '/admin/onboarding', color: '#00D4AA' },
            { label: 'View Clients', desc: 'Manage existing clients', href: '/admin/clients', color: '#0052FF' },
            { label: 'Treasury', desc: 'Review accounts & wallets', href: '/admin/treasury', color: '#8B5CF6' },
            { label: 'Partners', desc: 'View partner network', href: '/admin/partners', color: '#F59E0B' },
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
