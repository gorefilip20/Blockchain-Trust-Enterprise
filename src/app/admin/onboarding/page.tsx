'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  {
    title: 'Discovery & Structural Scoping',
    description: 'Assess client needs and determine the optimal entity type.',
  },
  {
    title: 'Entity Formation',
    description: 'File Articles of Organization and establish legal entity.',
  },
  {
    title: 'Financial Infrastructure',
    description: 'Set up corporate bank and exchange accounts.',
  },
  {
    title: 'Treasury & Governance',
    description: 'Deploy multi-sig wallets and define security protocols.',
  },
  {
    title: 'Accounting Integration',
    description: 'Connect sub-ledger tools for tax-ready records.',
  },
];

const clientTypes = [
  { value: 'hnw_investor', label: 'HNW Crypto Investor / Trader', desc: 'Tax optimization, capital gains shielding, liability protection' },
  { value: 'web3_founder', label: 'Web3 Founder / DAO Member', desc: 'Corporate governance, liability isolation, payment compliance' },
  { value: 'crypto_miner', label: 'Crypto Miner / Staking Operator', desc: 'Deductible CapEx/OpEx structures against mined revenue' },
  { value: 'dao_member', label: 'DAO Member', desc: 'Multi-sig governance and liability isolation' },
  { value: 'staking_operator', label: 'Staking Operator', desc: 'Staking revenue structuring and expense deductions' },
];

const entityTypes = [
  { value: 'holding_llc', label: 'Holding LLC', desc: 'Passive long-term asset protection and estate isolation', recommended: ['hnw_investor'] },
  { value: 'operating_llc', label: 'Operating LLC', desc: 'Active trading, staking, or mining with deductible expenses', recommended: ['crypto_miner', 'staking_operator'] },
  { value: 'dao_llc', label: 'DAO LLC (Wyoming)', desc: 'Decentralized governance with legal entity protection', recommended: ['web3_founder', 'dao_member'] },
];

const jurisdictions = [
  { value: 'Wyoming', label: 'Wyoming', features: ['Privacy-forward filings', 'Charging order protection', 'DAO LLC statute', 'No state income tax'] },
  { value: 'Delaware', label: 'Delaware', features: ['Strong case law', 'Chancery Court', 'Business-friendly', 'Series LLC available'] },
  { value: 'Nevada', label: 'Nevada', features: ['No state income tax', 'Asset protection', 'Privacy', 'Strong charging order protection'] },
];

const stepIcons = [
  <svg key="s1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  <svg key="s2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  <svg key="s3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /></svg>,
  <svg key="s4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  <svg key="s5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
];

export default function AdminOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Client Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientType, setClientType] = useState('');
  const [revenue, setRevenue] = useState('');
  const [cryptoHoldings, setCryptoHoldings] = useState('');
  const [notes, setNotes] = useState('');

  // Step 2: Entity
  const [entityType, setEntityType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Wyoming');
  const [privacyShield, setPrivacyShield] = useState(true);

  // Step 3: Financial
  const [bankProvider, setBankProvider] = useState('');
  const [exchangeProvider, setExchangeProvider] = useState('');
  const [exchangeNetwork, setExchangeNetwork] = useState('');

  // Step 4: Treasury
  const [multisigProvider, setMultisigProvider] = useState('Safe (Gnosis)');
  const [sigThreshold, setSigThreshold] = useState('2-of-3');

  // Step 5: Accounting
  const [accountingTool, setAccountingTool] = useState('');
  const [connectApi, setConnectApi] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);

    try {
      // Create client
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          client_type: clientType,
          annual_revenue_usd: revenue ? parseFloat(revenue) : null,
          crypto_holdings_usd: cryptoHoldings ? parseFloat(cryptoHoldings) : null,
          notes,
        }),
      });
      const client = await clientRes.json();

      // Create entity
      await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          entity_name: `${firstName} ${lastName} ${entityType === 'holding_llc' ? 'Holdings' : entityType === 'dao_llc' ? 'DAO' : 'Trading'}`,
          entity_type: entityType,
          jurisdiction,
          privacy_shield: privacyShield,
        }),
      });

      // Create treasury accounts
      if (exchangeProvider) {
        await fetch('/api/treasury', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: client.id,
            account_type: 'exchange_account',
            provider: exchangeProvider,
            account_name: `${exchangeProvider} Corporate`,
            network: exchangeNetwork || 'multi-chain',
          }),
        });
      }

      if (multisigProvider) {
        await fetch('/api/treasury', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: client.id,
            account_type: 'multisig_wallet',
            provider: multisigProvider,
            account_name: `${multisigProvider} Treasury`,
            signature_threshold: sigThreshold,
          }),
        });
      }

      // Complete all workflow steps
      const workflowsRes = await fetch(`/api/workflows?client_id=${client.id}`);
      const workflows = await workflowsRes.json();
      for (const wf of workflows) {
        await fetch('/api/workflows', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: wf.id, status: 'completed' }),
        });
      }

      router.push(`/admin/clients/${client.id}`);
    } catch (err) {
      console.error('Onboarding failed:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Client Onboarding</h1>
        <p className="text-slate-500 text-sm mt-1">Complete the five-step process to set up a new client entity.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center">
            <button
              onClick={() => setCurrentStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                i === currentStep
                  ? { backgroundColor: '#00D4AA', color: '#FFFFFF' }
                  : i < currentStep
                  ? { backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }
                  : { backgroundColor: '#F1F5F9', color: '#94A3B8' }
              }
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={
                  i === currentStep
                    ? { backgroundColor: 'rgba(255,255,255,0.2)' }
                    : i < currentStep
                    ? { backgroundColor: 'rgba(0,212,170,0.2)' }
                    : { backgroundColor: 'rgba(0,0,0,0.05)' }
                }
              >
                {i < currentStep ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="w-8 h-0.5 mx-1"
                style={{ backgroundColor: i < currentStep ? '#00D4AA' : '#E2E8F0' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ color: '#00D4AA' }}>
            {stepIcons[currentStep]}
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{STEPS[currentStep].title}</h2>
            <p className="text-sm text-slate-500">{STEPS[currentStep].description}</p>
          </div>
        </div>

        {/* Step 1: Discovery */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clientTypes.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setClientType(ct.value)}
                    className="p-3 rounded-lg border-2 text-left transition-all"
                    style={
                      clientType === ct.value
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="font-medium text-sm text-slate-900">{ct.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{ct.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Revenue (USD)</label>
                <input
                  type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                  placeholder="500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crypto Holdings (USD)</label>
                <input
                  type="number" value={cryptoHoldings} onChange={(e) => setCryptoHoldings(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
                  placeholder="2000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none resize-none"
                placeholder="Any specific requirements or context about this client..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Entity Formation */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entity Type *</label>
              <div className="space-y-3">
                {entityTypes.map((et) => (
                  <button
                    key={et.value}
                    onClick={() => setEntityType(et.value)}
                    className="w-full p-4 rounded-lg border-2 text-left transition-all"
                    style={
                      entityType === et.value
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{et.label}</div>
                        <div className="text-sm text-slate-500 mt-1">{et.desc}</div>
                      </div>
                      {et.recommended.includes(clientType) && (
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Jurisdiction *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {jurisdictions.map((j) => (
                  <button
                    key={j.value}
                    onClick={() => setJurisdiction(j.value)}
                    className="p-4 rounded-lg border-2 text-left transition-all"
                    style={
                      jurisdiction === j.value
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="font-medium text-slate-900">{j.label}</div>
                    <ul className="mt-2 space-y-1">
                      {j.features.map((f) => (
                        <li key={f} className="text-xs text-slate-500 flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox" id="privacy" checked={privacyShield} onChange={(e) => setPrivacyShield(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#00D4AA' }}
              />
              <label htmlFor="privacy" className="text-sm text-slate-700">
                <span className="font-medium">Enable Privacy Shielding</span> &mdash; Omit member/manager details from public state records (Wyoming recommended)
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Financial Infrastructure */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                <strong>Note:</strong> All accounts must be opened under the entity&apos;s EIN and legal name &mdash; never personal SSNs. This preserves the liability shield.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Corporate Bank Account</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Mercury', 'Silicon Valley Bank', 'First Citizens Bank'].map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setBankProvider(bank)}
                    className="p-3 rounded-lg border-2 text-left text-sm transition-all"
                    style={
                      bankProvider === bank
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="font-medium text-slate-900">{bank}</div>
                    <div className="text-xs text-slate-500">Crypto-friendly banking</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Institutional Exchange Account (KYB) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Kraken Institutional', desc: 'Full KYB + staking' },
                  { name: 'Coinbase Prime', desc: 'Cold storage + fiat' },
                  { name: 'Coinpass', desc: 'UK-focused, GBP pairs' },
                ].map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => setExchangeProvider(ex.name)}
                    className="p-3 rounded-lg border-2 text-left text-sm transition-all"
                    style={
                      exchangeProvider === ex.name
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="font-medium text-slate-900">{ex.name}</div>
                    <div className="text-xs text-slate-500">{ex.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Network Preference</label>
              <select
                value={exchangeNetwork}
                onChange={(e) => setExchangeNetwork(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
              >
                <option value="">Select network...</option>
                <option value="multi-chain">Multi-Chain (EVM + Bitcoin + Solana)</option>
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="solana">Solana</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Treasury & Governance */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Multi-Signature Wallet Provider</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Safe (Gnosis)', desc: 'Industry standard, battle-tested' },
                  { name: 'MPC Wallet', desc: 'Multi-party computation' },
                  { name: 'Fireblocks', desc: 'Institutional custody' },
                ].map((w) => (
                  <button
                    key={w.name}
                    onClick={() => setMultisigProvider(w.name)}
                    className="p-3 rounded-lg border-2 text-left text-sm transition-all"
                    style={
                      multisigProvider === w.name
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="font-medium text-slate-900">{w.name}</div>
                    <div className="text-xs text-slate-500">{w.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Signature Threshold</label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {['1-of-1', '2-of-3', '3-of-5', '4-of-7'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSigThreshold(t)}
                    className="p-3 rounded-lg border-2 text-center text-sm font-mono transition-all"
                    style={
                      sigThreshold === t
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Recommended: 2-of-3 for most entities. Higher thresholds for larger treasuries.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Governance Configuration</h4>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Signing Authority:</strong> Defined in Operating Agreement</p>
                <p><strong>Spending Thresholds:</strong> Transactions over $10K require multi-sig approval</p>
                <p><strong>Emergency Recovery:</strong> Key recovery protocol documented for estate continuity</p>
                <p><strong>Capital Calls:</strong> Majority vote required for capital contributions</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Accounting Integration */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Accounting Software</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Recap.io', desc: 'Crypto-native, real-time cost basis', preferred: true },
                  { name: 'CoinTracker', desc: 'Portfolio tracking + tax filing', preferred: false },
                  { name: 'TokenTax', desc: 'Automated tax reports', preferred: false },
                ].map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => setAccountingTool(tool.name)}
                    className="p-4 rounded-lg border-2 text-left text-sm transition-all"
                    style={
                      accountingTool === tool.name
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">{tool.name}</div>
                      {tool.preferred && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}
                        >
                          Preferred
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{tool.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,82,255,0.03)', borderColor: 'rgba(0,82,255,0.2)' }}>
              <input
                type="checkbox" id="api" checked={connectApi} onChange={(e) => setConnectApi(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#0052FF' }}
              />
              <label htmlFor="api" className="text-sm" style={{ color: '#1E40AF' }}>
                <span className="font-medium">Enable Auto-Sync</span> &mdash; Connect exchange read-only APIs and wallet public keys for real-time cost-basis tracking
              </label>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-3">What Gets Tracked</h4>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                {[
                  'Cost basis per transaction',
                  'Real-time gain/loss calculations',
                  'Fair market value at receipt',
                  'Inventory pooling method',
                  'Form 1065 / Corp tax inputs',
                  'Audit-ready transaction log',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                <strong>Compliance Note:</strong> Maintain 6-year mandatory transaction logs. Track fair market value at the time of mined/staked rewards. File corporation tax reports annually.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 0 && (!firstName || !lastName || !email || !clientType)) ||
                (currentStep === 1 && !entityType)
              }
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#0A1628' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E293B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0A1628'; }}
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !accountingTool}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#00D4AA' }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#00BF99'; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#00D4AA'; }}
            >
              {submitting ? 'Creating...' : 'Complete Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
