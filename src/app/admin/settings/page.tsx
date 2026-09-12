'use client';

import { useState, useEffect, useCallback } from 'react';

interface Wallet {
  id: string;
  blockchain_network: string;
  receiving_address: string;
  is_active: number;
}

interface BillingRule {
  package_name: string;
  price_usd: number;
}

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentHover: '#5a2fd6', ink: '#2d2b2b', accentLight: '#f1ecff' };
const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

const NETWORK_META: Record<string, { label: string; color: string; prefix: string; placeholder: string }> = {
  BEP20: { label: 'BEP20 (BNB Smart Chain)', color: '#F0B90B', prefix: '0x', placeholder: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD...' },
  TRC20: { label: 'TRC20 (TRON Network)', color: '#FF0013', prefix: 'T', placeholder: 'TXYZabc123def456ghi789jkl012mno345pqr...' },
  ERC20: { label: 'ERC20 (Ethereum Mainnet)', color: '#627EEA', prefix: '0x', placeholder: '0x1234567890abcdef1234567890abcdef12345678' },
};

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : null;
}

export default function AdminSettingsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [billing, setBilling] = useState<BillingRule | null>(null);
  const [editNetwork, setEditNetwork] = useState('BEP20');
  const [editAddress, setEditAddress] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    const token = getToken();
    const [wRes, bRes] = await Promise.all([
      fetch('/api/admin/wallets', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/billing'),
    ]);
    if (wRes.ok) {
      const wData = await wRes.json();
      setWallets(Array.isArray(wData) ? wData : wData.wallets || []);
    }
    const b = await bRes.json();
    setBilling(b);
    setEditPrice(b.price_usd?.toString() || '499');
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSaveWallet() {
    if (!editAddress) return;
    setSaving(true);
    setMessage('');
    const token = getToken();
    const res = await fetch('/api/admin/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ network: editNetwork, walletAddress: editAddress }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`${editNetwork} wallet saved successfully`);
      setEditAddress('');
      loadData();
    } else {
      setMessage(data.error || 'Failed to save');
    }
    setSaving(false);
  }

  async function handleSavePrice() {
    setSavingPrice(true);
    const token = getToken();
    const res = await fetch('/api/billing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ price_usd: parseFloat(editPrice) }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Price updated to $${data.price_usd}`);
      loadData();
    }
    setSavingPrice(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: `2px solid ${C.surface}`, background: '#fff',
    fontSize: 13, fontFamily: FONT, color: C.text, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 800, fontFamily: FONT, color: C.text }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Platform Settings</h1>
        <p style={{ color: 'rgba(32,30,29,0.5)', fontSize: 13, margin: '6px 0 0' }}>Configure payment gateways, billing rules, and administrative preferences.</p>
      </div>

      {message && (
        <div style={{ marginBottom: 20, padding: '10px 14px', border: '2px solid #2f9e58', background: '#eafbf0', fontSize: 13, color: '#1a6e3a' }}>
          {message}
        </div>
      )}

      {/* Billing Configuration */}
      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Registration Fee Configuration</h2>
            <p style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)', margin: '2px 0 0' }}>Set the dual-entity formation package price</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Package: {billing?.package_name}</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(32,30,29,0.5)', fontWeight: 600, fontSize: 14 }}>$</span>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 28 }}
                placeholder="499.00"
                step="0.01"
              />
            </div>
          </div>
          <button
            onClick={handleSavePrice}
            disabled={savingPrice}
            style={{ padding: '10px 20px', background: C.accent, color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em', cursor: savingPrice ? 'not-allowed' : 'pointer', opacity: savingPrice ? 0.5 : 1, whiteSpace: 'nowrap' }}
          >
            {savingPrice ? 'Saving...' : 'UPDATE PRICE'}
          </button>
        </div>
      </div>

      {/* Wallet Configuration */}
      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Crypto Payment Gateway Configuration</h2>
            <p style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)', margin: '2px 0 0' }}>Set receiving wallet addresses for each blockchain network</p>
          </div>
        </div>

        {wallets.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {wallets.map((w) => {
              const meta = NETWORK_META[w.blockchain_network];
              return (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `2px solid ${C.surface}`, background: C.bg, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', color: '#fff', background: meta?.color || '#64748B', letterSpacing: '0.05em' }}>
                    {w.blockchain_network}
                  </span>
                  <code style={{ fontSize: 11, color: C.ink, fontFamily: "'DM Mono', monospace", flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.receiving_address}</code>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#eafbf0', color: '#1a6e3a' }}>Active</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Network</label>
            <select
              value={editNetwork}
              onChange={(e) => setEditNetwork(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {Object.entries(NETWORK_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Receiving Wallet Address</label>
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder={NETWORK_META[editNetwork]?.placeholder}
              style={{ ...inputStyle, fontFamily: "'DM Mono', monospace" }}
            />
          </div>
          <button
            onClick={handleSaveWallet}
            disabled={saving || !editAddress}
            style={{ alignSelf: 'flex-start', padding: '10px 20px', background: C.accent, color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em', cursor: saving || !editAddress ? 'not-allowed' : 'pointer', opacity: saving || !editAddress ? 0.5 : 1 }}
          >
            {saving ? 'Saving...' : 'SAVE DESTINATION ADDRESS'}
          </button>
        </div>
      </div>

      {/* Authentication Info */}
      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="0" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Authentication Security</h2>
            <p style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)', margin: '2px 0 0' }}>Admin credentials are bcrypt-hashed with JWT session tokens</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
          {[
            { label: 'Password Hashing', value: 'bcrypt (10 rounds)' },
            { label: 'Session Tokens', value: 'JWT (24h expiry)' },
            { label: 'Token Storage', value: 'localStorage' },
          ].map(item => (
            <div key={item.label} style={{ padding: 12, background: C.bg }}>
              <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.5)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
