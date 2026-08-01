'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  {
    title: 'Intake & Identity Masking',
    description: 'Collect founder identities, allocation parameters, and desired asset classifications.',
  },
  {
    title: 'Dual State Filing & Agreements',
    description: 'File in Delaware and Wyoming. Generate cross-linked Operating Agreements with Web3 clauses.',
  },
  {
    title: 'IRS EIN Processing',
    description: 'Submit twin IRS Form SS-4 packets for parent partnership and subsidiary disregarded entity.',
  },
  {
    title: 'Treasury Banking & Exchange KYB',
    description: 'Onboard corporate bank, submit KYB to exchanges under the Wyoming subsidiary.',
  },
  {
    title: 'Web3 Custody & Governance',
    description: 'Deploy multi-sig vault, map signer threshold, and link to Operating Agreement.',
  },
  {
    title: 'Sub-Ledger Sync & Tax',
    description: 'Connect accounting tools, map flow-through tax architecture, and generate documents.',
  },
];

const clientTypes = [
  { value: 'hnw_investor', label: 'HNW Crypto Investor / Trader', desc: 'Tax optimization, capital gains shielding, liability protection' },
  { value: 'web3_founder', label: 'Web3 Founder', desc: 'Corporate governance, liability isolation, payment compliance' },
  { value: 'crypto_miner', label: 'Crypto Miner', desc: 'Deductible CapEx/OpEx structures against mined revenue' },
  { value: 'dao_member', label: 'DAO Member', desc: 'Multi-sig governance and liability isolation' },
  { value: 'staking_operator', label: 'Staking Operator', desc: 'Staking revenue structuring and expense deductions' },
];

const entityTypes = [
  { value: 'holding_llc', label: 'Holding LLC', desc: 'Passive long-term asset protection and estate isolation', recommended: ['hnw_investor'] },
  { value: 'operating_llc', label: 'Operating LLC', desc: 'Active trading, staking, or mining with deductible expenses', recommended: ['crypto_miner', 'staking_operator'] },
  { value: 'dao_llc', label: 'DAO LLC (Wyoming)', desc: 'Decentralized governance with legal entity protection', recommended: ['web3_founder', 'dao_member'] },
];

const stepIcons = [
  <svg key="s1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  <svg key="s2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  <svg key="s3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  <svg key="s4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /></svg>,
  <svg key="s5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  <svg key="s6" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
];

export default function AdminOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Stage 1: Intake
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientType, setClientType] = useState('');
  const [revenue, setRevenue] = useState('');
  const [cryptoHoldings, setCryptoHoldings] = useState('');
  const [notes, setNotes] = useState('');

  // Stage 2: Dual Filing
  const [entityType, setEntityType] = useState('');
  const [parentName, setParentName] = useState('');
  const [subsidiaryName, setSubsidiaryName] = useState('');
  const [privacyShield, setPrivacyShield] = useState(true);
  const [registeredAgent, setRegisteredAgent] = useState('Wyoming Corporate Services');

  // Stage 3: EIN
  const [parentTaxClass, setParentTaxClass] = useState('partnership_1065');
  const [responsibleParty, setResponsibleParty] = useState('');

  // Stage 4: Treasury
  const [bankProvider, setBankProvider] = useState('');
  const [exchangeProvider, setExchangeProvider] = useState('');
  const [exchangeNetwork, setExchangeNetwork] = useState('multi-chain');

  // Stage 5: Custody
  const [multisigProvider, setMultisigProvider] = useState('Safe (Gnosis)');
  const [sigThreshold, setSigThreshold] = useState('2-of-3');
  const [vaultNetwork, setVaultNetwork] = useState('ethereum');

  // Stage 6: Accounting
  const [accountingTool, setAccountingTool] = useState('');
  const [connectApi, setConnectApi] = useState(true);

  function updateEntityNames() {
    if (!parentName && firstName && lastName) {
      setParentName(`${lastName} ${firstName} Enterprise LLC`);
    }
    if (!subsidiaryName && firstName && lastName) {
      setSubsidiaryName(`${lastName} ${firstName} Holdings LLC`);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    try {
      // 1. Create client
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
      if (!client.id) throw new Error(client.error || 'Failed to create client');

      // 2. Create Delaware parent entity
      const parentRes = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          entity_name: parentName || `${firstName} ${lastName} Enterprise LLC`,
          entity_type: entityType,
          jurisdiction: 'Delaware',
          tier_type: 'parent',
          member_type: 'multi_member',
          tax_classification: parentTaxClass,
          privacy_shield: false,
        }),
      });
      const parentEntity = await parentRes.json();

      // 3. Create Wyoming subsidiary entity
      const subRes = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          entity_name: subsidiaryName || `${firstName} ${lastName} Holdings LLC`,
          entity_type: entityType,
          jurisdiction: 'Wyoming',
          tier_type: 'subsidiary',
          parent_entity_id: parentEntity.id,
          member_type: 'single_member',
          tax_classification: 'disregarded_entity',
          privacy_shield: privacyShield,
          registered_agent: registeredAgent,
          registered_agent_address: registeredAgent === 'Wyoming Corporate Services'
            ? '1712 Pioneer Ave, Suite 500, Cheyenne, WY 82001'
            : registeredAgent === 'Northwest Registered Agent'
            ? '5830 E 2nd St, #7008, Casper, WY 82609'
            : '30 N Gould St, Suite R, Sheridan, WY 82801',
        }),
      });
      const subEntity = await subRes.json();

      // 4. Create treasury accounts under Wyoming subsidiary
      if (bankProvider) {
        await fetch('/api/treasury', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: parentEntity.id,
            account_type: 'fiat_bank',
            provider: bankProvider,
            account_name: `${bankProvider} Corporate Operating`,
          }),
        });
      }

      if (exchangeProvider) {
        await fetch('/api/treasury', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: subEntity.id,
            account_type: 'exchange_account',
            provider: exchangeProvider,
            account_name: `${exchangeProvider} Corporate KYB`,
            network: exchangeNetwork,
          }),
        });
      }

      // 5. Create multi-sig vault under subsidiary
      if (multisigProvider) {
        const [m, n] = sigThreshold.split('-of-').map(Number);
        await fetch('/api/treasury', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: subEntity.id,
            account_type: 'multisig_wallet',
            provider: multisigProvider,
            account_name: `${multisigProvider} Treasury Vault`,
            signature_threshold: sigThreshold,
            network: vaultNetwork,
          }),
        });

        await fetch('/api/vaults', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: subEntity.id,
            vault_address: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            network: vaultNetwork,
            network_id: vaultNetwork === 'ethereum' ? 1 : vaultNetwork === 'polygon' ? 137 : vaultNetwork === 'arbitrum' ? 42161 : 1,
            required_signatures: m || 2,
            total_signers: n || 3,
          }),
        });
      }

      // 6. Generate documents
      const docTypes = [
        { doc_type: 'operating_agreement', name: `${parentName || firstName + ' Enterprise LLC'} - Operating Agreement`, entity_id: parentEntity.id },
        { doc_type: 'operating_agreement', name: `${subsidiaryName || firstName + ' Holdings LLC'} - Operating Agreement`, entity_id: subEntity.id },
        { doc_type: 'articles_of_organization', name: `${parentName || firstName + ' Enterprise LLC'} - Articles of Organization`, entity_id: parentEntity.id },
        { doc_type: 'articles_of_organization', name: `${subsidiaryName || firstName + ' Holdings LLC'} - Articles of Organization`, entity_id: subEntity.id },
        { doc_type: 'subscription_agreement', name: `${parentName || firstName + ' Enterprise LLC'} - Investor Subscription Agreement`, entity_id: parentEntity.id },
        { doc_type: 'corporate_tree', name: 'Corporate Structure Certification', entity_id: parentEntity.id },
      ];

      for (const doc of docTypes) {
        await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: client.id,
            entity_id: doc.entity_id,
            doc_type: doc.doc_type,
            name: doc.name,
          }),
        });
      }

      // 7. Complete all workflow steps
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
      setError(err instanceof Error ? err.message : 'Onboarding failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none';

  function SelectionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        onClick={onClick}
        className="p-4 rounded-lg border-2 text-left transition-all w-full"
        style={
          selected
            ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
            : { borderColor: '#E2E8F0', backgroundColor: 'transparent' }
        }
      >
        {children}
      </button>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Two-Tier Entity Onboarding</h1>
        <p className="text-slate-500 text-sm mt-1">6-stage process: Delaware Parent + Wyoming Subsidiary with full Web3 infrastructure.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-10 overflow-x-auto pb-2">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center shrink-0">
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
              <span className="hidden lg:inline">{step.title}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="w-6 h-0.5 mx-1" style={{ backgroundColor: i < currentStep ? '#00D4AA' : '#E2E8F0' }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
          <p className="text-sm" style={{ color: '#991B1B' }}>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ color: '#00D4AA' }}>{stepIcons[currentStep]}</span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Stage {currentStep + 1}: {STEPS[currentStep].title}</h2>
            <p className="text-sm text-slate-500">{STEPS[currentStep].description}</p>
          </div>
        </div>

        {/* Stage 1: Intake, Profiling & Identity Masking */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} placeholder="Doe" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clientTypes.map((ct) => (
                  <SelectionCard key={ct.value} selected={clientType === ct.value} onClick={() => setClientType(ct.value)}>
                    <div className="font-medium text-sm text-slate-900">{ct.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{ct.desc}</div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Revenue (USD)</label>
                <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className={inputClass} placeholder="500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crypto Holdings (USD)</label>
                <input type="number" value={cryptoHoldings} onChange={(e) => setCryptoHoldings(e.target.value)} className={inputClass} placeholder="2000000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass + ' resize-none'} placeholder="Specific requirements, investment thesis, risk tolerance..." />
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,82,255,0.03)', borderColor: 'rgba(0,82,255,0.15)' }}>
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1E40AF' }}>Privacy Injection</p>
                  <p className="text-xs mt-1" style={{ color: '#3B82F6' }}>
                    RegisteredAgentPrivacy = True for the Wyoming tier. Founder identities will be dropped from Wyoming public search vectors and replaced with the professional Registered Agent&apos;s corporate address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Dual Legal State Filing */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entity Type *</label>
              <div className="space-y-3">
                {entityTypes.map((et) => (
                  <SelectionCard key={et.value} selected={entityType === et.value} onClick={() => setEntityType(et.value)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{et.label}</div>
                        <div className="text-sm text-slate-500 mt-1">{et.desc}</div>
                      </div>
                      {et.recommended.includes(clientType) && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}>Recommended</span>
                      )}
                    </div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            {/* Two-Tier Structure Visualization */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#0A1628' }}>
              <h3 className="text-sm font-semibold text-white mb-4">Two-Tier Parent-Subsidiary Architecture</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,82,255,0.1)', borderColor: 'rgba(0,82,255,0.3)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#60A5FA' }}>TIER 1: DELAWARE PARENT (Multi-Member)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,82,255,0.2)', color: '#93C5FD' }}>Fundraising Hub</span>
                  </div>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    onFocus={updateEntityNames}
                    placeholder={`${firstName || 'Name'} ${lastName || ''} Enterprise LLC`}
                    className="w-full bg-transparent text-white text-sm px-0 py-1 border-b border-blue-800 focus:border-blue-400 outline-none placeholder:text-slate-600"
                  />
                  <p className="text-xs mt-2" style={{ color: '#64748B' }}>Receives VC capital, issues Class A Membership Interests, files Form 1065</p>
                </div>

                <div className="flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4" style={{ backgroundColor: '#00D4AA' }} />
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,212,170,0.15)', color: '#00D4AA' }}>100% Owner &amp; Manager</span>
                    <div className="w-0.5 h-4" style={{ backgroundColor: '#00D4AA' }} />
                  </div>
                </div>

                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,212,170,0.05)', borderColor: 'rgba(0,212,170,0.3)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#34D399' }}>TIER 2: WYOMING SUBSIDIARY (Single-Member)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.2)', color: '#6EE7B7' }}>Privacy &amp; Asset Vault</span>
                  </div>
                  <input
                    type="text"
                    value={subsidiaryName}
                    onChange={(e) => setSubsidiaryName(e.target.value)}
                    onFocus={updateEntityNames}
                    placeholder={`${firstName || 'Name'} ${lastName || ''} Holdings LLC`}
                    className="w-full bg-transparent text-white text-sm px-0 py-1 border-b border-emerald-900 focus:border-emerald-400 outline-none placeholder:text-slate-600"
                  />
                  <p className="text-xs mt-2" style={{ color: '#64748B' }}>Holds multi-sig wallets, exchange KYB accounts, anonymous filing</p>
                </div>
              </div>
            </div>

            {/* Registered Agent */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Wyoming Registered Agent</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Wyoming Corporate Services', addr: '1712 Pioneer Ave, Suite 500, Cheyenne, WY 82001', preferred: true },
                  { name: 'Northwest Registered Agent', addr: '5830 E 2nd St, #7008, Casper, WY 82609', preferred: false },
                  { name: 'CT Corporation', addr: '30 N Gould St, Suite R, Sheridan, WY 82801', preferred: false },
                ].map((ra) => (
                  <SelectionCard key={ra.name} selected={registeredAgent === ra.name} onClick={() => setRegisteredAgent(ra.name)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-slate-900">{ra.name}</div>
                      {ra.preferred && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>Preferred</span>}
                    </div>
                    <div className="text-xs text-slate-500">{ra.addr}</div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input type="checkbox" id="privacy" checked={privacyShield} onChange={(e) => setPrivacyShield(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#00D4AA' }} />
              <label htmlFor="privacy" className="text-sm text-slate-700">
                <span className="font-medium">Enable Privacy Shielding</span> &mdash; Omit member/manager details from Wyoming public state records. Registered Agent&apos;s corporate address replaces founder&apos;s personal address.
              </label>
            </div>

            {/* Web3 Operating Agreement Clauses */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <h4 className="text-sm font-medium mb-2" style={{ color: '#92400E' }}>Web3 Clauses Auto-Injected into Operating Agreements</h4>
              <div className="space-y-1.5 text-xs" style={{ color: '#92400E' }}>
                <p><strong>Section 3.1 Capital Contributions:</strong> All digital asset deposits log txhash, timestamp, and USD FMV under IRC Section 721.</p>
                <p><strong>Section 4.2 Private Key Fiduciary Duty:</strong> Seed phrase access does not convey personal ownership. Unauthorized use = unlawful conversion.</p>
                <p><strong>Section 5.3 Multi-Sig Resolutions:</strong> On-chain transactions passing signature threshold = binding corporate actions without paper.</p>
                <p><strong>Section 6.1 Derivative Allocations:</strong> Hardforks, airdrops, staking rewards belong 100% to the LLC.</p>
                <p><strong>Section 9.4 Emergency Succession:</strong> Dead-man&apos;s switch logic and shard escrow prevent asset loss on key holder incapacitation.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: IRS EIN Processing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>EIN #1</span>
                  <span className="text-sm font-semibold text-slate-900">Delaware Parent</span>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500">Entity:</span><span className="font-medium">{parentName || `${firstName} ${lastName} Enterprise LLC`}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">IRS Form:</span><span>SS-4 (Automated Processing)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Classification:</span>
                    <select value={parentTaxClass} onChange={(e) => setParentTaxClass(e.target.value)} className="text-sm border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#00D4AA]">
                      <option value="partnership_1065">Partnership (Form 1065)</option>
                      <option value="c_corp_1120">C-Corp (Form 1120)</option>
                      <option value="s_corp_1120s">S-Corp (Form 1120-S)</option>
                    </select>
                  </div>
                  <div className="flex justify-between"><span className="text-slate-500">Annual Filing:</span><span>Form 1065 + Schedule K-1</span></div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}>EIN #2</span>
                  <span className="text-sm font-semibold text-slate-900">Wyoming Subsidiary</span>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500">Entity:</span><span className="font-medium">{subsidiaryName || `${firstName} ${lastName} Holdings LLC`}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">IRS Form:</span><span>SS-4 (Automated Processing)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Classification:</span><span>Disregarded Entity</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Owner:</span><span>Corporate Partnership (DE Parent)</span></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsible Party (for IRS records)</label>
              <input type="text" value={responsibleParty} onChange={(e) => setResponsibleParty(e.target.value)} className={inputClass} placeholder={`${firstName} ${lastName}`} />
              <p className="text-xs text-slate-500 mt-1">SSN/ITIN of the responsible party. Encrypted via AES-256 at rest, air-gapped from state public lookups.</p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)' }}>
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-slate-800">Data Security</p>
                  <p className="text-xs text-slate-600 mt-1">Responsible party records (SSN/ITIN) are encrypted via AES-256 at rest and remain confidential within federal servers, completely air-gapped from state public lookups.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Corporate Treasury Banking & Exchange KYB */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                <strong>Critical:</strong> All accounts must be opened under the entity&apos;s EIN and legal name &mdash; never personal SSNs. This preserves the corporate liability shield.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-1">Fiat Engine &mdash; Delaware Parent</h3>
              <p className="text-xs text-slate-500 mb-3">Corporate bank account for outside investor wire intake under the Delaware entity.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Mercury', desc: 'Startup-friendly, API-first banking', badge: 'Recommended' },
                  { name: 'Relay Financial', desc: 'No-fee business banking', badge: null },
                  { name: 'First Citizens Bank', desc: 'Traditional corporate banking', badge: null },
                ].map((bank) => (
                  <SelectionCard key={bank.name} selected={bankProvider === bank.name} onClick={() => setBankProvider(bank.name)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-slate-900">{bank.name}</div>
                      {bank.badge && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}>{bank.badge}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{bank.desc}</div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-1">Crypto Engine &mdash; Wyoming Subsidiary (KYB)</h3>
              <p className="text-xs text-slate-500 mb-3">Institutional exchange account under the Wyoming entity name for asset operations.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Kraken Institutional', desc: 'Full KYB + staking + fiat gateway', badge: 'Preferred' },
                  { name: 'Coinbase Prime', desc: 'Cold storage + OTC trading', badge: null },
                  { name: 'Coinpass', desc: 'UK-focused, GBP pairs', badge: null },
                ].map((ex) => (
                  <SelectionCard key={ex.name} selected={exchangeProvider === ex.name} onClick={() => setExchangeProvider(ex.name)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-slate-900">{ex.name}</div>
                      {ex.badge && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>{ex.badge}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{ex.desc}</div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Network Preference</label>
              <select value={exchangeNetwork} onChange={(e) => setExchangeNetwork(e.target.value)} className={inputClass}>
                <option value="multi-chain">Multi-Chain (EVM + Bitcoin + Solana)</option>
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="solana">Solana</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-2">KYB Compliance Package (Auto-Generated)</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p>The system provides exchange compliance desks with an automated, visual corporate tree proving:</p>
                <ul className="list-disc ml-4 space-y-0.5 mt-1">
                  <li>Delaware parent handles investor relationships</li>
                  <li>Wyoming subsidiary handles asset operations</li>
                  <li>Articles of Organization for both entities</li>
                  <li>Operating Agreements with Web3 clauses</li>
                  <li>EIN verification letters</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: Web3 Custody & Governance */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Multi-Signature Wallet Provider</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Safe (Gnosis)', desc: 'Industry standard, battle-tested, EVM native', badge: 'Recommended' },
                  { name: 'Fireblocks', desc: 'MPC custody, institutional grade', badge: null },
                  { name: 'MPC Wallet', desc: 'Multi-party computation, keyless', badge: null },
                ].map((w) => (
                  <SelectionCard key={w.name} selected={multisigProvider === w.name} onClick={() => setMultisigProvider(w.name)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-slate-900">{w.name}</div>
                      {w.badge && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }}>{w.badge}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{w.desc}</div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Signer Threshold (M-of-N)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['1-of-1', '2-of-3', '3-of-5', '4-of-7'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSigThreshold(t)}
                    className="p-3 rounded-lg border-2 text-center text-sm font-mono transition-all"
                    style={
                      sigThreshold === t
                        ? { borderColor: '#00D4AA', backgroundColor: 'rgba(0,212,170,0.05)' }
                        : { borderColor: '#E2E8F0' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Recommended: 2-of-3 for most entities. Higher thresholds for treasuries over $1M.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deployment Network</label>
              <select value={vaultNetwork} onChange={(e) => setVaultNetwork(e.target.value)} className={inputClass}>
                <option value="ethereum">Ethereum Mainnet (Chain ID: 1)</option>
                <option value="polygon">Polygon (Chain ID: 137)</option>
                <option value="arbitrum">Arbitrum One (Chain ID: 42161)</option>
                <option value="base">Base (Chain ID: 8453)</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Governance Configuration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Spending over $10K requires multi-sig approval</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Emergency key recovery protocol documented</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>On-chain txns bind to Operating Agreement</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Dead-man&apos;s switch after 90 days inactivity</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,82,255,0.03)', borderColor: 'rgba(0,82,255,0.15)' }}>
              <p className="text-sm" style={{ color: '#1E40AF' }}>
                <strong>Resolution Binding:</strong> On-chain multi-sig wallets are linked to the Stage 2 Operating Agreement. All signed transactions automatically write to the digital corporate minute book.
              </p>
            </div>
          </div>
        )}

        {/* Stage 6: Sub-Ledger Sync & Tax */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Accounting Software</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Recap.io', desc: 'Real-time cost basis via API, crypto-native', preferred: true },
                  { name: 'CoinTracker', desc: 'Portfolio tracking + tax filing', preferred: false },
                  { name: 'TokenTax', desc: 'Automated tax report generation', preferred: false },
                ].map((tool) => (
                  <SelectionCard key={tool.name} selected={accountingTool === tool.name} onClick={() => setAccountingTool(tool.name)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-slate-900">{tool.name}</div>
                      {tool.preferred && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>Preferred</span>}
                    </div>
                    <div className="text-xs text-slate-500">{tool.desc}</div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(0,82,255,0.03)', borderColor: 'rgba(0,82,255,0.15)' }}>
              <input type="checkbox" id="api" checked={connectApi} onChange={(e) => setConnectApi(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#0052FF' }} />
              <label htmlFor="api" className="text-sm" style={{ color: '#1E40AF' }}>
                <span className="font-medium">Enable Auto-Sync</span> &mdash; Connect read-only APIs and wallet public keys to map directly to {accountingTool || 'accounting software'} for real-time cost-basis tracking
              </label>
            </div>

            {/* Tax Flow-Through Architecture */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#0A1628' }}>
              <h3 className="text-sm font-semibold text-white mb-4">Flow-Through Tax Architecture</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}>
                  <p className="text-xs" style={{ color: '#6EE7B7' }}>
                    <strong>On-Chain Activity</strong> &mdash; {subsidiaryName || `${firstName} ${lastName} Holdings LLC`} (WY)
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3" style={{ backgroundColor: '#00D4AA' }} />
                    <span className="text-xs px-2 py-0.5 rounded" style={{ color: '#94A3B8' }}>Disregarded entity pass-through</span>
                    <div className="w-0.5 h-3" style={{ backgroundColor: '#00D4AA' }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.2)' }}>
                  <p className="text-xs" style={{ color: '#93C5FD' }}>
                    <strong>Form 1065 + Schedule K-1</strong> &mdash; {parentName || `${firstName} ${lastName} Enterprise LLC`} (DE)
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3" style={{ backgroundColor: '#F59E0B' }} />
                    <span className="text-xs px-2 py-0.5 rounded" style={{ color: '#94A3B8' }}>K-1 distribution to members</span>
                    <div className="w-0.5 h-3" style={{ backgroundColor: '#F59E0B' }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="text-xs" style={{ color: '#FCD34D' }}>
                    <strong>Individual Members / Investors</strong> &mdash; Personal tax returns
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-3">What Gets Tracked</h4>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                {[
                  'FIFO / LIFO / HIFO inventory methods',
                  'Fair market value at time of receipt',
                  'Per-wallet cost basis isolation',
                  'Cross-exchange aggregation',
                  'Form 1065 partnership inputs',
                  'Schedule K-1 generation',
                  'Form 8949 capital gains export',
                  '6-year mandatory transaction log',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-generated documents */}
            <div className="p-4 rounded-lg border border-[#E2E8F0]">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Documents Auto-Generated on Completion</h4>
              <div className="space-y-2">
                {[
                  { name: 'Delaware Operating Agreement (Multi-Member)', type: 'operating_agreement' },
                  { name: 'Wyoming Operating Agreement (Single-Member)', type: 'operating_agreement' },
                  { name: 'Delaware Articles of Organization', type: 'articles_of_organization' },
                  { name: 'Wyoming Articles of Organization', type: 'articles_of_organization' },
                  { name: 'Investor Subscription Agreement', type: 'subscription_agreement' },
                  { name: 'Corporate Structure Certification', type: 'corporate_tree' },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center gap-2 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-slate-700">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                <strong>Compliance:</strong> Maintain 6-year mandatory transaction logs. Track fair market value at the time of mined/staked rewards. File corporation tax reports annually (Form 1065 for LLCs). Document all capital contributions and distributions with board resolutions.
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
              onClick={() => {
                if (currentStep === 0) updateEntityNames();
                setCurrentStep(currentStep + 1);
              }}
              disabled={
                (currentStep === 0 && (!firstName || !lastName || !email || !clientType)) ||
                (currentStep === 1 && !entityType)
              }
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#0A1628' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E293B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0A1628'; }}
            >
              Next Stage &rarr;
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
              {submitting ? 'Deploying Two-Tier Structure...' : 'Complete Onboarding & Generate Documents'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
