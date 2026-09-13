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

interface RegistrationUser { id: string; full_name: string; email: string; registration_fee_paid: number; registration_fee_reference: string | null; created_at: string; }

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentLight: '#f1ecff', ink: '#2d2b2b' };

const networkStyles: Record<string, { bg: string; color: string; label: string }> = {
  BEP20: { bg: '#fef3c7', color: '#b45309', label: 'BSC (BEP20)' },
  TRC20: { bg: '#fee2e2', color: '#b91c1c', label: 'TRON (TRC20)' },
  ERC20: { bg: '#dbeafe', color: '#1d4ed8', label: 'ETH (ERC20)' },
};

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)', label: 'Pending TX' },
  processing_verification: { bg: '#dbeafe', color: '#1d4ed8', label: 'Verifying' },
  confirmed_active: { bg: '#dcfce7', color: '#6d43d8', label: 'Confirmed' },
  failed: { bg: '#fee2e2', color: '#b91c1c', label: 'Failed' },
  expired: { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)', label: 'Expired' },
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
  const [registrationUsers, setRegistrationUsers] = useState<RegistrationUser[]>([]);

  const loadPayments = useCallback(() => {
    const token = localStorage.getItem('bte-admin-token');
    fetch('/api/payments').then((r) => r.json()).then(setPayments);
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null).then((d) => setRegistrationUsers((d?.users || []).filter((u: RegistrationUser) => !u.registration_fee_paid && u.registration_fee_reference)));
  }, []);

  async function approveRegistration(user: RegistrationUser) {
    const token = localStorage.getItem('bte-admin-token');
    await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'approve-registration-fee', userId: user.id, paymentReference: user.registration_fee_reference }) });
    loadPayments();
  }

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

  function truncateHash(hash: string | null): string {
    if (!hash) return '—';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Payment Verification</h1>
          <p style={{ color: 'rgba(32,30,29,0.5)', fontSize: 13, margin: '6px 0 0' }}>Multi-chain on-chain transaction verification engine for BEP20, TRC20, and ERC20 payments.</p>
        </div>
        <button
          onClick={runVerification}
          disabled={verifying}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.accent, color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em', cursor: verifying ? 'not-allowed' : 'pointer', opacity: verifying ? 0.5 : 1 }}
        >
          {verifying ? (
            <svg style={{ animation: 'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          )}
          {verifying ? 'RUNNING...' : 'RUN VERIFICATION'}
        </button>
      </div>

      {lastResult && (
        <div style={{ marginBottom: 20, padding: '12px 16px', border: `2px solid ${C.surface}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d43d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          <span>
            Last run: <strong>{lastResult.processed}</strong> processed,{' '}
            <strong style={{ color: '#6d43d8' }}>{lastResult.verified}</strong> verified,{' '}
            <strong style={{ color: '#ef4444' }}>{lastResult.failed}</strong> failed
          </span>
        </div>
      )}

      <section style={{ marginBottom: 28, background: '#fff', border: `2px solid ${C.surface}`, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}><div><h2 style={{ fontSize: 15, margin: 0 }}>BTE registration payments</h2><p style={{ margin: '5px 0 0', color: 'rgba(32,30,29,0.5)', fontSize: 11 }}>Review $150 payment references submitted from user dashboards.</p></div><span style={{ color: C.accent, fontWeight: 800, fontSize: 20 }}>{registrationUsers.length}</span></div>
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}><thead><tr style={{ borderBottom: `2px solid ${C.surface}`, textAlign: 'left' }}>{['User', 'Reference', 'Registered', 'Action'].map(h => <th key={h} style={{ padding: '9px 10px', color: 'rgba(32,30,29,0.5)', fontSize: 10, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{registrationUsers.map(user => <tr key={user.id} style={{ borderBottom: `1px solid ${C.surface}` }}><td style={{ padding: 10 }}><strong>{user.full_name}</strong><div style={{ color: 'rgba(32,30,29,0.5)', fontSize: 10 }}>{user.email}</div></td><td style={{ padding: 10, maxWidth: 260, wordBreak: 'break-all', fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{user.registration_fee_reference}</td><td style={{ padding: 10, color: 'rgba(32,30,29,0.5)' }}>{new Date(user.created_at).toLocaleDateString()}</td><td style={{ padding: 10 }}><button onClick={() => approveRegistration(user)} style={{ background: C.accent, color: '#fff', border: 0, padding: '7px 10px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>Approve $150</button></td></tr>)}{registrationUsers.length === 0 && <tr><td colSpan={4} style={{ padding: 24, color: 'rgba(32,30,29,0.45)', textAlign: 'center' }}>No dashboard registration payments awaiting review.</td></tr>}</tbody></table></div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 8, marginBottom: 28 }}>
        {[
          { label: 'Total Payments', value: payments.length.toString(), color: C.accent },
          { label: 'Pending Verification', value: pending.length.toString(), color: '#e0a800' },
          { label: 'Confirmed', value: confirmed.length.toString(), color: '#6d43d8' },
          { label: 'Failed', value: failed.length.toString(), color: '#ef4444' },
        ].map((card) => (
          <div key={card.label} style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.5)', fontWeight: 600 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: card.color, marginTop: 4 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.surface}` }}>
                {['Client', 'Network', 'TX Hash', 'Expected', 'Verified', 'Status', 'Stage', 'Retries', 'Block'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10, fontWeight: 700, color: 'rgba(32,30,29,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const ns = networkStyles[p.target_network] || { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)', label: p.target_network };
                const ss = statusStyles[p.status] || { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)', label: p.status };
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.surface}` }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{p.client_name || '—'}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', background: ns.bg, color: ns.color, letterSpacing: '0.04em' }}>{ns.label}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.ink }}>{truncateHash(p.submitted_tx_hash)}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: C.ink }}>${p.expected_amount_usd.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {p.verified_amount_tokens != null ? (
                        <span style={{ color: '#6d43d8', fontWeight: 600 }}>{p.verified_amount_tokens.toLocaleString()} USDT</span>
                      ) : (
                        <span style={{ color: 'rgba(32,30,29,0.3)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: ss.bg, color: ss.color, letterSpacing: '0.04em' }}>{ss.label.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{stageLabels[p.processing_stage] || p.processing_stage}</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{p.rpc_retry_attempts}/5</td>
                    <td style={{ padding: '10px 12px', fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'rgba(32,30,29,0.5)' }}>{p.transaction_block_number || '—'}</td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 16px', textAlign: 'center', color: 'rgba(32,30,29,0.4)' }}>No payment records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 28, background: '#fff', border: `2px solid ${C.surface}`, padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Verification Engine</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
          <div style={{ padding: 14, background: '#fef3c720', border: '2px solid #fde68a' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#b45309' }}>BEP20 (BNB Smart Chain)</div>
            <div style={{ fontSize: 11, color: C.ink }}>RPC: bsc-dataseed1.binance.org</div>
            <div style={{ fontSize: 11, color: C.ink }}>Token: USDT (18 decimals)</div>
          </div>
          <div style={{ padding: 14, background: '#fee2e220', border: '2px solid #fecaca' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#b91c1c' }}>TRC20 (TRON)</div>
            <div style={{ fontSize: 11, color: C.ink }}>API: api.trongrid.io</div>
            <div style={{ fontSize: 11, color: C.ink }}>Token: USDT (6 decimals)</div>
          </div>
          <div style={{ padding: 14, background: '#dbeafe20', border: '2px solid #bfdbfe' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#1d4ed8' }}>ERC20 (Ethereum)</div>
            <div style={{ fontSize: 11, color: C.ink }}>RPC: eth.llamarpc.com</div>
            <div style={{ fontSize: 11, color: C.ink }}>Token: USDT (18 decimals)</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>
          Worker: <code style={{ padding: '2px 6px', background: C.bg, fontFamily: "'DM Mono', monospace", fontSize: 10 }}>npx tsx scripts/verify-worker.ts</code> — polls every 30s, max 5 retries, 1% amount tolerance.
        </div>
      </div>
    </div>
  );
}
