'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  client_type: string;
  status: string;
  entity_type: string;
  jurisdiction: string;
  crypto_holdings_usd: number;
  created_at: string;
  entity_count: number;
  completed_steps: number;
  total_steps: number;
}

const typeLabels: Record<string, string> = {
  hnw_investor: 'HNW Investor',
  web3_founder: 'Web3 Founder',
  dao_member: 'DAO Member',
  crypto_miner: 'Crypto Miner',
  staking_operator: 'Staking Operator',
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  lead: { bg: '#F1F5F9', text: '#475569' },
  onboarding: { bg: '#DBEAFE', text: '#1D4ED8' },
  active: { bg: '#DCFCE7', text: '#15803D' },
  inactive: { bg: '#FEE2E2', text: '#B91C1C' },
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then(setClients);
  }, []);

  const filtered = clients.filter((c) => {
    const matchesSearch =
      !search ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 text-sm mt-1">{clients.length} total clients</p>
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

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] outline-none"
        >
          <option value="">All Statuses</option>
          <option value="lead">Lead</option>
          <option value="onboarding">Onboarding</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Entities</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Workflow</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => {
                const ss = statusStyles[client.status] || { bg: '#F1F5F9', text: '#475569' };
                return (
                  <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/clients/${client.id}`} className="hover:underline">
                        <div className="font-medium text-slate-900">{client.first_name} {client.last_name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{typeLabels[client.client_type] || client.client_type}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: ss.bg, color: ss.text }}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{client.entity_count || 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${client.total_steps > 0 ? (client.completed_steps / client.total_steps) * 100 : 0}%`,
                              backgroundColor: '#00D4AA',
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{client.completed_steps || 0}/{client.total_steps || 5}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{new Date(client.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    {clients.length === 0 ? 'No clients yet. Start by creating one.' : 'No clients match your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
