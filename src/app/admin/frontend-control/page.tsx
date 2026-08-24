'use client';

import { useCallback, useEffect, useState } from 'react';
import { Eye, Flag, Globe2, Save, ShieldCheck, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';

type Config = Record<string, string | boolean | number>;
type ConfigField = { key: string; label: string; description: string; type: 'text' | 'boolean' | 'number' };

const fields: ConfigField[] = [
  { key: 'hero_headline', label: 'Workspace headline', description: 'The primary headline shown on the client markets workspace.', type: 'text' },
  { key: 'hero_subtitle', label: 'Workspace subtitle', description: 'Supporting copy shown beneath the main workspace headline.', type: 'text' },
  { key: 'trust_message', label: 'Trust and environment message', description: 'Shown in the client workspace footer to communicate the current operating mode.', type: 'text' },
  { key: 'workspace_mode', label: 'Workspace mode', description: 'Use demo until the BTE live provider stack is authorized and connected.', type: 'text' },
  { key: 'max_order_notional_demo', label: 'Demo order notional limit', description: 'Upper bound for simulated order tickets, in USD.', type: 'number' },
];

const flags = [
  { key: 'show_bte_copilot', label: 'BTE Copilot', description: 'AI-assisted research summaries with informational disclosure.', icon: Sparkles },
  { key: 'show_recurring_investments', label: 'Recurring investments', description: 'Show recurring investment planning entry points.', icon: ToggleRight },
  { key: 'show_market_alerts', label: 'Market alerts', description: 'Show alert and notification management entry points.', icon: Flag },
];

export default function FrontendControlPage() {
  const [config, setConfig] = useState<Config>({});
  const [savingKey, setSavingKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const response = await fetch('/api/platform-config');
    if (!response.ok) throw new Error('Unable to load frontend configuration');
    setConfig(await response.json());
  }, []);

  useEffect(() => { load().catch((err) => setError(err.message)); }, [load]);

  async function save(key: string, value: string | boolean | number) {
    setSavingKey(key); setMessage(''); setError('');
    const response = await fetch('/api/platform-config', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bte-admin-token') || ''}` }, body: JSON.stringify({ key, value }) });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'Unable to save configuration');
    else { setConfig((current) => ({ ...current, [key]: value })); setMessage(`${key} updated. Changes are live on the frontend.`); }
    setSavingKey('');
  }

  return <div className="max-w-5xl mx-auto">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#00A080' }}><Globe2 size={15} /> Frontend operations</div><h1 className="text-2xl font-bold text-slate-900 mt-2">BTE Frontend Control Center</h1><p className="text-slate-500 text-sm mt-1 max-w-2xl">Control client-facing messaging, operating mode, feature exposure, and demo safety limits without changing code. Every save is persisted to the platform database.</p></div><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#0A1628' }}><Eye size={16} /> Preview frontend</a></div>
    {message && <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
    {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6"><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,212,170,.12)', color: '#00A080' }}><Globe2 size={20} /></div><div><h2 className="text-lg font-semibold text-slate-900">Client workspace content</h2><p className="text-sm text-slate-500">Edit the words and environment labels clients see.</p></div></div><div className="space-y-5">{fields.map((field) => <div key={field.key} className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_auto] gap-3 items-end"><div><label className="block text-sm font-semibold text-slate-800">{field.label}</label><p className="text-xs text-slate-500 mt-1">{field.description}</p></div><input type={field.type === 'number' ? 'number' : 'text'} value={String(config[field.key] ?? '')} onChange={(event) => setConfig((current) => ({ ...current, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value }))} className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none" /><button disabled={savingKey === field.key} onClick={() => save(field.key, config[field.key] ?? '')} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: '#E6FFFA', color: '#087F6B' }}><Save size={15} />{savingKey === field.key ? 'Saving' : 'Save'}</button></div>)}</div></section>
    <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6"><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,.1)', color: '#7C3AED' }}><Flag size={20} /></div><div><h2 className="text-lg font-semibold text-slate-900">Differentiator feature flags</h2><p className="text-sm text-slate-500">Roll out BTE capabilities gradually with operational control.</p></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{flags.map((flag) => { const Icon = flag.icon; const enabled = Boolean(config[flag.key]); return <div key={flag.key} className="rounded-xl border border-[#E2E8F0] p-4"><div className="flex items-start justify-between gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: enabled ? 'rgba(0,212,170,.12)' : '#F1F5F9', color: enabled ? '#00A080' : '#64748B' }}><Icon size={18} /></div><button aria-label={`Toggle ${flag.label}`} onClick={() => save(flag.key, !enabled)} className="text-slate-500 hover:text-[#00A080]">{enabled ? <ToggleRight size={27} color="#00A080" /> : <ToggleLeft size={27} />}</button></div><h3 className="font-semibold text-slate-900 mt-4 text-sm">{flag.label}</h3><p className="text-xs text-slate-500 mt-1 leading-relaxed">{flag.description}</p><div className="mt-4 text-[11px] font-semibold" style={{ color: enabled ? '#00A080' : '#64748B' }}>{enabled ? 'Enabled for clients' : 'Hidden from clients'}</div></div> })}</div></section>
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-3"><ShieldCheck size={20} className="text-amber-700 shrink-0" /><div><h2 className="font-semibold text-amber-900 text-sm">Safety checkpoint</h2><p className="text-xs text-amber-800 mt-1 leading-relaxed">This control center manages presentation and demo behavior. Live trading, custody, KYC/KYB, money movement, and regulated disclosures must remain behind authorized provider integrations and compliance review.</p></div></section>
  </div>;
}
