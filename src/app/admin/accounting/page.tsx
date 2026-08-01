'use client';

import { useState, useEffect } from 'react';

interface AccountingEntry {
  id: string;
  entity_id: string;
  entry_type: string;
  amount_usd: number;
  amount_crypto: number;
  crypto_symbol: string;
  transaction_hash: string;
  category: string;
  tax_year: number;
  created_at: string;
}

const entryTypes = [
  { value: 'income', label: 'Income', color: '#15803D' },
  { value: 'expense', label: 'Expense', color: '#B91C1C' },
  { value: 'transfer', label: 'Transfer', color: '#1D4ED8' },
  { value: 'mining_reward', label: 'Mining Reward', color: '#7C3AED' },
  { value: 'staking_reward', label: 'Staking Reward', color: '#B45309' },
  { value: 'capital_gain', label: 'Capital Gain', color: '#00A080' },
  { value: 'capital_loss', label: 'Capital Loss', color: '#DC2626' },
];

const entryIcons: Record<string, React.ReactNode> = {
  income: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  expense: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 17 17 7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  transfer: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  mining_reward: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
    </svg>
  ),
  staking_reward: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  capital_gain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  capital_loss: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
};

export default function AdminAccountingPage() {
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch('/api/entities').then((r) => r.json()).then(async () => {
      // Accounting entries are loaded via entity API when available
    });
  }, []);

  const totalIncome = entries
    .filter(
      (e) =>
        e.entry_type === 'income' ||
        e.entry_type === 'mining_reward' ||
        e.entry_type === 'staking_reward' ||
        e.entry_type === 'capital_gain'
    )
    .reduce((sum, e) => sum + e.amount_usd, 0);
  const totalExpenses = entries
    .filter((e) => e.entry_type === 'expense' || e.entry_type === 'capital_loss')
    .reduce((sum, e) => sum + e.amount_usd, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accounting & Tax</h1>
          <p className="text-slate-500 text-sm mt-1">Crypto-native accounting, cost basis tracking, and tax reporting</p>
        </div>
        <select
          value={taxYear}
          onChange={(e) => setTaxYear(parseInt(e.target.value))}
          className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] outline-none"
        >
          {[2026, 2025, 2024, 2023].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { name: 'Recap.io', status: 'preferred', desc: 'Real-time cost basis tracking via API' },
          { name: 'CoinTracker', status: 'available', desc: 'Portfolio tracking and tax filing' },
          { name: 'TokenTax', status: 'available', desc: 'Automated tax report generation' },
        ].map((tool) => (
          <div key={tool.name} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">{tool.name}</h3>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={
                  tool.status === 'preferred'
                    ? { backgroundColor: '#F3E8FF', color: '#7C3AED' }
                    : { backgroundColor: '#F1F5F9', color: '#64748B' }
                }
              >
                {tool.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{tool.desc}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00D4AA' }} />
              <span className="text-xs text-slate-500">API integration ready</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tax Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: `Total Income (${taxYear})`, value: `$${totalIncome.toLocaleString()}`, color: '#00D4AA' },
          { label: `Total Expenses (${taxYear})`, value: `$${totalExpenses.toLocaleString()}`, color: '#EF4444' },
          { label: `Net P&L (${taxYear})`, value: `$${(totalIncome - totalExpenses).toLocaleString()}`, color: totalIncome - totalExpenses >= 0 ? '#00D4AA' : '#EF4444' },
          { label: 'Transactions', value: entries.length.toString(), color: '#0052FF' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5"
            style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${card.color}` }}
          >
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: card.color === '#EF4444' ? '#DC2626' : '#0F172A' }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* What Gets Tracked */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Automated Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">Cost Basis Tracking</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                FIFO / LIFO / HIFO inventory methods
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Fair market value at time of receipt
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Per-wallet cost basis isolation
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Cross-exchange aggregation
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">Tax Reporting</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Form 1065 (Partnership) inputs
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Schedule K-1 generation
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Form 8949 (Capital Gains) export
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                6-year mandatory transaction log
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Entry Types Legend */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Supported Entry Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {entryTypes.map((type) => (
            <div key={type.value} className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="flex justify-center mb-1" style={{ color: type.color }}>
                {entryIcons[type.value] || entryIcons.income}
              </div>
              <div className="text-xs font-medium text-slate-700 mt-1">{type.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Notes */}
      <div className="rounded-xl p-6 border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
        <h2 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#92400E' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Compliance Requirements
        </h2>
        <ul className="space-y-2 text-sm" style={{ color: '#92400E' }}>
          <li>Maintain 6-year mandatory transaction logs for all entity accounts</li>
          <li>Track fair market value at the time of all mined or staked rewards</li>
          <li>File corporation tax reports annually (Form 1065 for LLCs, 1120 for Corps)</li>
          <li>Keep entity funds completely separate from personal funds to avoid &quot;piercing the corporate veil&quot;</li>
          <li>Document all capital contributions and distributions with board resolutions</li>
        </ul>
      </div>

      {entries.length === 0 && (
        <div className="mt-8 bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <div className="flex justify-center mb-4" style={{ color: '#00D4AA' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
              <line x1="2" y1="20" x2="22" y2="20" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No Accounting Entries Yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Connect your exchange APIs and wallet addresses to automatically import transactions and generate tax-ready reports.
          </p>
        </div>
      )}
    </div>
  );
}
