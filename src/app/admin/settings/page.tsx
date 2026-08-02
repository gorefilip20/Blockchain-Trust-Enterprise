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

const NETWORK_META: Record<string, { label: string; color: string; prefix: string; placeholder: string }> = {
  BEP20: { label: 'BEP20 (BNB Smart Chain)', color: '#F0B90B', prefix: '0x', placeholder: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD...' },
  TRC20: { label: 'TRC20 (TRON Network)', color: '#FF0013', prefix: 'T', placeholder: 'TXYZabc123def456ghi789jkl012mno345pqr...' },
  ERC20: { label: 'ERC20 (Ethereum Mainnet)', color: '#627EEA', prefix: '0x', placeholder: '0x1234567890abcdef1234567890abcdef12345678' },
};

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
    const [wRes, bRes] = await Promise.all([
      fetch('/api/admin/wallets'),
      fetch('/api/billing'),
    ]);
    setWallets(await wRes.json());
    const b = await bRes.json();
    setBilling(b);
    setEditPrice(b.price_usd?.toString() || '499');
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSaveWallet() {
    if (!editAddress) return;
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch('/api/billing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_usd: parseFloat(editPrice) }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Price updated to $${data.price_usd}`);
      loadData();
    }
    setSavingPrice(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure payment gateways, billing rules, and administrative preferences.</p>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg border text-sm" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#15803D' }}>
          {message}
        </div>
      )}

      {/* Billing Configuration */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,212,170,0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Registration Fee Configuration</h2>
            <p className="text-sm text-slate-500">Set the dual-entity formation package price</p>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Package: {billing?.package_name}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                placeholder="499.00"
                step="0.01"
              />
            </div>
          </div>
          <button
            onClick={handleSavePrice}
            disabled={savingPrice}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#00D4AA' }}
          >
            {savingPrice ? 'Saving...' : 'Update Price'}
          </button>
        </div>
      </div>

      {/* Wallet Configuration */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,82,255,0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Crypto Payment Gateway Configuration</h2>
            <p className="text-sm text-slate-500">Set receiving wallet addresses for each blockchain network</p>
          </div>
        </div>

        {/* Current Wallets */}
        {wallets.length > 0 && (
          <div className="space-y-3 mb-6">
            {wallets.map((w) => {
              const meta = NETWORK_META[w.blockchain_network];
              return (
                <div key={w.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0]">
                  <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: meta?.color || '#64748B' }}>
                    {w.blockchain_network}
                  </span>
                  <code className="text-xs text-slate-600 font-mono flex-1 truncate">{w.receiving_address}</code>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}>Active</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Add / Update Wallet */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Network</label>
            <select
              value={editNetwork}
              onChange={(e) => setEditNetwork(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none"
            >
              {Object.entries(NETWORK_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Receiving Wallet Address</label>
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder={NETWORK_META[editNetwork]?.placeholder}
              className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] outline-none"
            />
          </div>
          <button
            onClick={handleSaveWallet}
            disabled={saving || !editAddress}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#0052FF' }}
          >
            {saving ? 'Saving...' : 'Save Destination Address'}
          </button>
        </div>
      </div>

      {/* Admin Credentials Info */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Authentication Security</h2>
            <p className="text-sm text-slate-500">Admin credentials are bcrypt-hashed with JWT session tokens</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="text-slate-500 text-xs mb-1">Password Hashing</div>
            <div className="font-medium text-slate-900">bcrypt (10 rounds)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="text-slate-500 text-xs mb-1">Session Tokens</div>
            <div className="font-medium text-slate-900">JWT (24h expiry)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="text-slate-500 text-xs mb-1">Token Storage</div>
            <div className="font-medium text-slate-900">localStorage</div>
          </div>
        </div>
      </div>
    </div>
  );
}
