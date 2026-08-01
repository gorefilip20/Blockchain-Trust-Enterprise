'use client';

import { useEffect, useState } from 'react';

interface TreasuryAccount {
  id: string;
  entity_id: string;
  account_type: string;
  provider: string;
  account_name: string;
  address: string;
  network: string;
  signature_threshold: string;
  status: string;
  balance_usd: number;
  created_at: string;
  entity_name: string;
  jurisdiction: string;
}

const typeLabels: Record<string, string> = {
  fiat_bank: 'Corporate Bank Account',
  exchange_account: 'Exchange Account',
  multisig_wallet: 'Multi-Sig Wallet',
  cold_storage: 'Cold Storage',
};

const typeIcons: Record<string, React.ReactNode> = {
  fiat_bank: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  exchange_account: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  multisig_wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  cold_storage: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 7l-5-5-5 5M17 17l-5 5-5-5M2 12h20M7 7L2 12l5 5M17 7l5 5-5 5" />
    </svg>
  ),
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#F1F5F9', text: '#64748B' },
  setup: { bg: '#DBEAFE', text: '#1D4ED8' },
  active: { bg: '#DCFCE7', text: '#15803D' },
  frozen: { bg: '#FEF3C7', text: '#B45309' },
  closed: { bg: '#FEE2E2', text: '#B91C1C' },
};

export default function AdminTreasuryPage() {
  const [accounts, setAccounts] = useState<TreasuryAccount[]>([]);

  useEffect(() => {
    fetch('/api/treasury').then((r) => r.json()).then(setAccounts);
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance_usd || 0), 0);
  const activeAccounts = accounts.filter((a) => a.status === 'active').length;

  const summaryCards = [
    { label: 'Total Accounts', value: accounts.length.toString(), color: '#00D4AA' },
    { label: 'Active', value: activeAccounts.toString(), color: '#0052FF' },
    { label: 'Total Balance', value: `$${totalBalance.toLocaleString()}`, color: '#8B5CF6' },
    { label: 'Multi-Sig Wallets', value: accounts.filter((a) => a.account_type === 'multisig_wallet').length.toString(), color: '#F59E0B' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Treasury Management</h1>
        <p className="text-slate-500 text-sm mt-1">Corporate bank accounts, exchange accounts, and multi-sig wallets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5"
            style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${card.color}` }}
          >
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Entity</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => {
                const ss = statusStyles[account.status] || { bg: '#F1F5F9', text: '#475569' };
                return (
                  <tr key={account.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}
                        >
                          {typeIcons[account.account_type] || typeIcons.fiat_bank}
                        </span>
                        <div>
                          <div className="font-medium text-slate-900">{account.account_name || account.provider}</div>
                          {account.signature_threshold && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                              {account.signature_threshold}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{typeLabels[account.account_type]}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-700">{account.entity_name}</div>
                      <div className="text-xs text-slate-500">{account.jurisdiction}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{account.provider}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: ss.bg, color: ss.text }}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      ${account.balance_usd?.toLocaleString() || '0'}
                    </td>
                  </tr>
                );
              })}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No treasury accounts configured yet.
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
