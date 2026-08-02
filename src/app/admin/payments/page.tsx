'use client';

import { useState, useEffect, useCallback } from 'react';

interface Payment {
  id: string;
  client_id: string;
  client_name: string;
  target_network: string;
  submitted_tx_hash: string | null;
  assigned_destination_wallet: string;
  expected_amount_usd: number;
  verified_amount_tokens: number | null;
  sender_wallet_address: string | null;
  transaction_block_number: number | null;
  status: string;
  processing_stage: string;
  rpc_retry_attempts: number;
  created_at: string;
  verified_at: string | null;
}

const networkStyles: Record<string, { bg: string; text: string; label: string }> = {
  BEP20: { bg: '#FEF3C7', text: '#B45309', label: 'BSC (BEP20)' },
  TRC20: { bg: '#FEE2E2', text: '#B91C1C', label: 'TRON (TRC20)' },
  ERC20: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Ethereum (ERC20)' },
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#F1F5F9', text: '#64748B', label: 'Pending TX' },
  processing_verification: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Verifying' },
  confirmed_active: { bg: '#DCFCE7', text: '#15803D', label: 'Confirmed' },
  failed: { bg: '#FEE2E2', text: '#B91C1C', label: 'Failed' },
  expired: { bg: '#F1F5F9', text: '#475569', label: 'Expired' },
};

const stageLabels: Record<string, string> = {
  unprocessed: 'Queued',
  fetching_rpc: 'RPC Fetch',
  mismatched_parameters: 'Mismatch',
  fully_reconciled: 'Reconciled',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [lastResult, setLastResult] = useState<{ processed: number; verified: number; failed: number } | null>(null);

  const loadPayments = useCallback(() => {
    fetch('/api/payments').then((r) => r.json()).then(setPayments);
  }, []);

  useEffect(() => {
    loadPayments();
    const interval = setInterval(loadPayments, 10_000);
    return () => clearInterval(interval);
  }, [loadPayments]);

  async function runVerification() {
    setVerifying(true);
    try {
      const res = await fetch('/api/payments/verify', { method: 'POST' });
      const data = await res.json();
      setLastResult(data);
      loadPayments();
    } finally {
      setVerifying(false);
    }
  }

  const pending = payments.filter((p) => p.status === 'processing_verification');
  const confirmed = payments.filter((p) => p.status === 'confirmed_active');
  const failed = payments.filter((p) => p.status === 'failed');

  const summaryCards = [
    { label: 'Total Payments', value: payments.length.toString(), color: '#0052FF' },
    { label: 'Pending Verification', value: pending.length.toString(), color: '#F59E0B' },
    { label: 'Confirmed', value: confirmed.length.toString(), color: '#15803D' },
    { label: 'Failed', value: failed.length.toString(), color: '#EF4444' },
  ];

  function truncateHash(hash: string | null): string {
    if (!hash) return '-';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Verification</h1>
          <p className="text-slate-500 text-sm mt-1">Multi-chain on-chain transaction verification engine for BEP20, TRC20, and ERC20 payments.</p>
        </div>
        <button
          onClick={runVerification}
          disabled={verifying}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#00D4AA' }}
        >
          {verifying ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          )}
          {verifying ? 'Running...' : 'Run Verification'}
        </button>
      </div>

      {lastResult && (
        <div className="mb-6 p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-center gap-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          <span className="text-sm text-slate-700">
            Last run: <span className="font-medium">{lastResult.processed}</span> processed,{' '}
            <span className="font-medium" style={{ color: '#15803D' }}>{lastResult.verified}</span> verified,{' '}
            <span className="font-medium" style={{ color: '#EF4444' }}>{lastResult.failed}</span> failed
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${card.color}` }}>
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Network</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">TX Hash</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Expected</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Verified</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Retries</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Block</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const ns = networkStyles[p.target_network] || { bg: '#F1F5F9', text: '#475569', label: p.target_network };
                const ss = statusStyles[p.status] || { bg: '#F1F5F9', text: '#475569', label: p.status };
                return (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 text-sm">{p.client_name || '-'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: ns.bg, color: ns.text }}>{ns.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-600">{truncateHash(p.submitted_tx_hash)}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">${p.expected_amount_usd.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm">
                      {p.verified_amount_tokens != null ? (
                        <span style={{ color: '#15803D' }} className="font-medium">{p.verified_amount_tokens.toLocaleString()} USDT</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ss.bg, color: ss.text }}>{ss.label}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{stageLabels[p.processing_stage] || p.processing_stage}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">{p.rpc_retry_attempts}/5</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-500">{p.transaction_block_number || '-'}</td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">No payment records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-[#E2E8F0] p-6">
        <h2 className="font-semibold text-slate-900 mb-3">Verification Engine</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(254,243,199,0.5)', border: '1px solid #FDE68A' }}>
            <div className="text-sm font-medium mb-1" style={{ color: '#B45309' }}>BEP20 (BNB Smart Chain)</div>
            <div className="text-xs text-slate-600">RPC: bsc-dataseed1.binance.org</div>
            <div className="text-xs text-slate-600">Token: USDT (18 decimals)</div>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(254,226,226,0.5)', border: '1px solid #FECACA' }}>
            <div className="text-sm font-medium mb-1" style={{ color: '#B91C1C' }}>TRC20 (TRON)</div>
            <div className="text-xs text-slate-600">API: api.trongrid.io</div>
            <div className="text-xs text-slate-600">Token: USDT (6 decimals)</div>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(219,234,254,0.5)', border: '1px solid #BFDBFE' }}>
            <div className="text-sm font-medium mb-1" style={{ color: '#1D4ED8' }}>ERC20 (Ethereum)</div>
            <div className="text-xs text-slate-600">RPC: eth.llamarpc.com</div>
            <div className="text-xs text-slate-600">Token: USDT (18 decimals)</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Worker: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">npx tsx scripts/verify-worker.ts</code> — polls every 30s, max 5 retries, 1% amount tolerance.
        </div>
      </div>
    </div>
  );
}
