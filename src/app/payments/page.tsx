'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, Shield, Wallet, AlertCircle } from 'lucide-react';

const wallets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1q9wpc4zrnly0qk7rcvx8ezv84p6dypfljgnr9ej',
    color: '#f7931a',
    bg: '#fef3e2',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#f7931a" />
        <path d="M22.5 14.2c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.7-.4-.7 2.7c-.4-.1-.7-.2-1-.2l-2.3-.6-.4 1.8s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 .1.1.1.1.1l-.1 0-1.1 4.5c-.1.2-.3.5-.7.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.7 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.7c2.8.5 5 .3 5.9-2.2.7-2-.1-3.2-1.5-3.9 1.1-.3 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2-4 .9-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.4c-.5 1.8-3.4.9-4.3.7l.8-3.3c1 .2 4 .7 3.5 2.6z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xb7e86182f7F9FdD59160D199e84a068330E8Ae2D',
    color: '#627eea',
    bg: '#eef0fb',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#627eea" />
        <path d="M16 4v8.87l7.5 3.35L16 4z" fill="#fff" fillOpacity=".6" />
        <path d="M16 4l-7.5 12.22L16 12.87V4z" fill="#fff" />
        <path d="M16 21.97v6.03l7.5-10.38L16 21.97z" fill="#fff" fillOpacity=".6" />
        <path d="M16 28v-6.03l-7.5-4.35L16 28z" fill="#fff" />
        <path d="M16 20.57l7.5-4.35L16 12.87v7.7z" fill="#fff" fillOpacity=".2" />
        <path d="M8.5 16.22l7.5 4.35v-7.7l-7.5 3.35z" fill="#fff" fillOpacity=".6" />
      </svg>
    ),
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    address: 'rfSTS7Nj6P2sNXf7wfchGhrZxkhc8BZdkk',
    color: '#23292f',
    bg: '#edf0f2',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#23292f" />
        <path d="M22.7 8h2.2l-5.4 5.3a5 5 0 0 1-7 0L7.1 8h2.2l4.3 4.2a3.3 3.3 0 0 0 4.8 0L22.7 8zm-15.4 16h-2.2l5.5-5.4a5 5 0 0 1 7 0l5.5 5.4h-2.2l-4.4-4.3a3.3 3.3 0 0 0-4.8 0L7.3 24z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    address: '0xb7e86182f7F9FdD59160D199e84a068330E8Ae2D',
    color: '#f3ba2f',
    bg: '#fef8e8',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#f3ba2f" />
        <path d="M16 5.6l3.2 3.2-1.9 1.8L16 9.3l-1.3 1.3-1.9-1.8L16 5.6zm-6.7 6.7l1.9 1.8-1.9 1.9-1.9-1.9 1.9-1.8zm13.4 0l1.9 1.8-1.9 1.9-1.9-1.9 1.9-1.8zM16 14.1l1.9 1.9-1.9 1.9-1.9-1.9 1.9-1.9zm0 7.6l-3.2-3.2 1.9-1.8 1.3 1.3 1.3-1.3 1.9 1.8L16 21.7z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    address: 'BucK5Cy9p2pkQLTWhsXnsjDSWUPomfQJQSGnvuzKrtQn',
    color: '#9945ff',
    bg: '#f3ecff',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="url(#sol)" />
        <defs><linearGradient id="sol" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#9945ff" /><stop offset="1" stopColor="#14f195" /></linearGradient></defs>
        <path d="M9.3 20.2a.6.6 0 0 1 .4-.2h13.8c.3 0 .4.3.2.5l-2.4 2.4a.6.6 0 0 1-.4.2H7.1c-.3 0-.4-.3-.2-.5l2.4-2.4zm0-11.3a.6.6 0 0 1 .4-.2h13.8c.3 0 .4.3.2.5l-2.4 2.4a.6.6 0 0 1-.4.2H7.1c-.3 0-.4-.3-.2-.5l2.4-2.4zm13.4 5.5a.6.6 0 0 0-.4-.2H8.5c-.3 0-.4.3-.2.5l2.4 2.4a.6.6 0 0 0 .4.2h13.8c.3 0 .4-.3.2-.5l-2.4-2.4z" fill="white" />
      </svg>
    ),
  },
];

export default function PaymentsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyAddress(address: string, symbol: string) {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(symbol);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <main className="terminal-shell">
      <div className="payments-page">
        <div className="payments-hero">
          <p className="eyebrow"><span className="eyebrow-line" />CRYPTO PAYMENTS</p>
          <h1>Fund your account securely with cryptocurrency.</h1>
          <p className="payments-hero-sub">
            Send payments directly to our verified wallet addresses below.
            All transactions are processed on-chain for full transparency and security.
          </p>
        </div>

        <div className="payments-notice">
          <Shield size={18} />
          <div>
            <strong>Important:</strong> Only send the specified cryptocurrency to its corresponding address.
            Sending the wrong token to an address may result in permanent loss of funds.
            Double-check the network before sending.
          </div>
        </div>

        <div className="wallet-grid">
          {wallets.map((w) => (
            <div className="wallet-card" key={w.symbol} style={{ borderTopColor: w.color }}>
              <div className="wallet-card-header">
                <div className="wallet-icon">{w.icon}</div>
                <div>
                  <h3>{w.name}</h3>
                  <span className="wallet-symbol">{w.symbol}</span>
                </div>
              </div>
              <div className="wallet-address-wrap">
                <label>Deposit Address</label>
                <div className="wallet-address-box" style={{ borderColor: `${w.color}40` }}>
                  <code className="wallet-address">{w.address}</code>
                  <button
                    className="wallet-copy-btn"
                    style={{ background: copied === w.symbol ? '#0fa987' : w.color }}
                    onClick={() => copyAddress(w.address, w.symbol)}
                  >
                    {copied === w.symbol ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
              </div>
              <div className="wallet-network-tag" style={{ background: w.bg, color: w.color }}>
                <Wallet size={12} /> {w.name} Network
              </div>
            </div>
          ))}
        </div>

        <div className="payments-info-grid">
          <div className="payments-info-card">
            <h4>How Payments Work</h4>
            <ol>
              <li>Choose your preferred cryptocurrency from the options above</li>
              <li>Copy the wallet address (double-check it matches)</li>
              <li>Send the exact payment amount from your wallet</li>
              <li>Transactions are confirmed within 1-30 minutes depending on network</li>
              <li>Your account is credited once the transaction is confirmed on-chain</li>
            </ol>
          </div>
          <div className="payments-info-card">
            <h4>Need Help?</h4>
            <p>If you have questions about payments, use the <strong>live chat</strong> button in the bottom-right corner of the screen to speak with our support team.</p>
            <div className="payments-support-note">
              <AlertCircle size={14} />
              <span>For payment confirmations, please have your transaction hash ready.</span>
            </div>
          </div>
        </div>

        <div className="payments-disclaimer">
          <p>
            All cryptocurrency payments are final and non-reversible. Ensure you are sending from a wallet you control.
            BTE is not responsible for funds sent to incorrect addresses or on incorrect networks.
            Processing times vary by network congestion.
          </p>
        </div>
      </div>
    </main>
  );
}
