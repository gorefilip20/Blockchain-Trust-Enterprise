'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface ClientDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  client_type: string;
  status: string;
  entity_type: string;
  jurisdiction: string;
  annual_revenue_usd: number;
  crypto_holdings_usd: number;
  notes: string;
  created_at: string;
  entities: Array<{
    id: string;
    entity_name: string;
    entity_type: string;
    jurisdiction: string;
    ein: string;
    status: string;
    privacy_shield: number;
    operating_agreement_signed: number;
    formed_at: string;
  }>;
  workflows: Array<{
    id: string;
    step_number: number;
    step_name: string;
    status: string;
    started_at: string;
    completed_at: string;
  }>;
  treasuries: Array<{
    id: string;
    account_type: string;
    provider: string;
    account_name: string;
    status: string;
    balance_usd: number;
    signature_threshold: string;
  }>;
  documents: Array<{
    id: string;
    doc_type: string;
    name: string;
    status: string;
    created_at: string;
  }>;
  assignments: Array<{
    id: string;
    partner_name: string;
    partner_type: string;
    role: string;
    status: string;
  }>;
}

const typeLabels: Record<string, string> = {
  hnw_investor: 'HNW Crypto Investor',
  web3_founder: 'Web3 Founder',
  dao_member: 'DAO Member',
  crypto_miner: 'Crypto Miner',
  staking_operator: 'Staking Operator',
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  lead: { bg: '#F1F5F9', text: '#475569' },
  onboarding: { bg: '#DBEAFE', text: '#1D4ED8' },
  active: { bg: '#DCFCE7', text: '#15803D' },
  inactive: { bg: '#FEE2E2', text: '#B91C1C' },
  pending: { bg: '#F1F5F9', text: '#64748B' },
  filed: { bg: '#DBEAFE', text: '#1D4ED8' },
  approved: { bg: '#DCFCE7', text: '#15803D' },
};

export default function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [updatingWorkflow, setUpdatingWorkflow] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/clients/${id}`).then((r) => r.json()).then(setClient);
  }, [id]);

  async function updateWorkflow(workflowId: string, status: string) {
    setUpdatingWorkflow(workflowId);
    await fetch('/api/workflows', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: workflowId, status }),
    });
    const updated = await fetch(`/api/clients/${id}`).then((r) => r.json());
    setClient(updated);
    setUpdatingWorkflow(null);
  }

  async function updateClientStatus(status: string) {
    await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const updated = await fetch(`/api/clients/${id}`).then((r) => r.json());
    setClient(updated);
  }

  async function updateEntityStatus(entityId: string, status: string) {
    await fetch('/api/entities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: entityId, status }),
    });
    const updated = await fetch(`/api/clients/${id}`).then((r) => r.json());
    setClient(updated);
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5" style={{ color: '#00D4AA' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-400 text-sm">Loading client...</span>
        </div>
      </div>
    );
  }

  const completedSteps = client.workflows?.filter((w) => w.status === 'completed').length || 0;
  const totalSteps = client.workflows?.length || 5;
  const workflowPct = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  function getStatusStyle(status: string) {
    const s = statusStyles[status] || { bg: '#F1F5F9', text: '#475569' };
    return { backgroundColor: s.bg, color: s.text };
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin/clients" className="text-sm hover:underline mb-2 inline-flex items-center gap-1" style={{ color: '#00D4AA' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Clients
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{client.first_name} {client.last_name}</h1>
          <p className="text-slate-500 text-sm mt-1">{client.email} &middot; {typeLabels[client.client_type]}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={getStatusStyle(client.status)}>
              {client.status}
            </span>
            {client.entity_type && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {client.entity_type.replace('_', ' ')} &middot; {client.jurisdiction}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {client.status === 'onboarding' && (
            <button
              onClick={() => updateClientStatus('active')}
              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#00D4AA' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00BF99'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00D4AA'; }}
            >
              Activate
            </button>
          )}
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Onboarding Workflow</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-slate-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${workflowPct}%`, backgroundColor: '#00D4AA' }}
            />
          </div>
          <span className="text-sm font-medium text-slate-700">{completedSteps}/{totalSteps}</span>
        </div>
        <div className="space-y-3">
          {client.workflows?.sort((a, b) => a.step_number - b.step_number).map((wf) => (
            <div key={wf.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    backgroundColor: wf.status === 'completed' ? '#00D4AA' : wf.status === 'in_progress' ? '#0052FF' : '#CBD5E1',
                    color: wf.status === 'pending' ? '#64748B' : '#FFFFFF',
                  }}
                >
                  {wf.status === 'completed' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    wf.step_number
                  )}
                </span>
                <span className="text-sm text-slate-700">{wf.step_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={
                    wf.status === 'completed'
                      ? { backgroundColor: 'rgba(0,212,170,0.1)', color: '#00A080' }
                      : wf.status === 'in_progress'
                      ? { backgroundColor: '#DBEAFE', color: '#1D4ED8' }
                      : { backgroundColor: '#F1F5F9', color: '#64748B' }
                  }
                >
                  {wf.status.replace('_', ' ')}
                </span>
                {wf.status === 'pending' && (
                  <button
                    onClick={() => updateWorkflow(wf.id, 'in_progress')}
                    disabled={updatingWorkflow === wf.id}
                    className="text-xs font-medium hover:underline disabled:opacity-50"
                    style={{ color: '#0052FF' }}
                  >
                    Start
                  </button>
                )}
                {wf.status === 'in_progress' && (
                  <button
                    onClick={() => updateWorkflow(wf.id, 'completed')}
                    disabled={updatingWorkflow === wf.id}
                    className="text-xs font-medium hover:underline disabled:opacity-50"
                    style={{ color: '#00D4AA' }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entity Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Entities</h2>
          {client.entities?.length > 0 ? (
            <div className="space-y-3">
              {client.entities.map((entity) => (
                <div key={entity.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-slate-900">{entity.entity_name}</div>
                      <div className="text-xs text-slate-500">{entity.entity_type.replace('_', ' ')} &middot; {entity.jurisdiction}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={getStatusStyle(entity.status)}>
                        {entity.status}
                      </span>
                      {entity.status === 'pending' && (
                        <button onClick={() => updateEntityStatus(entity.id, 'filed')} className="text-xs font-medium hover:underline" style={{ color: '#0052FF' }}>
                          File
                        </button>
                      )}
                      {entity.status === 'filed' && (
                        <button onClick={() => updateEntityStatus(entity.id, 'approved')} className="text-xs font-medium hover:underline" style={{ color: '#00D4AA' }}>
                          Approve
                        </button>
                      )}
                      {entity.status === 'approved' && (
                        <button onClick={() => updateEntityStatus(entity.id, 'active')} className="text-xs font-medium hover:underline" style={{ color: '#00D4AA' }}>
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                  {entity.ein && <div className="text-xs text-slate-500 mt-1">EIN: {entity.ein}</div>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    {entity.privacy_shield ? (
                      <span className="flex items-center gap-1" style={{ color: '#00D4AA' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Privacy Shielded
                      </span>
                    ) : (
                      <span className="text-amber-600">No Privacy Shield</span>
                    )}
                    {entity.operating_agreement_signed ? (
                      <span style={{ color: '#00D4AA' }}>OA Signed</span>
                    ) : (
                      <span className="text-amber-600">OA Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No entities created yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Treasury Accounts</h2>
          {client.treasuries?.length > 0 ? (
            <div className="space-y-3">
              {client.treasuries.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-slate-900">{t.account_name || t.provider}</div>
                      <div className="text-xs text-slate-500">{t.account_type.replace('_', ' ')} &middot; {t.provider}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={getStatusStyle(t.status)}>
                      {t.status}
                    </span>
                  </div>
                  {t.signature_threshold && (
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      {t.signature_threshold} multi-sig
                    </div>
                  )}
                  {t.balance_usd > 0 && (
                    <div className="text-sm font-medium text-slate-900 mt-1">${t.balance_usd.toLocaleString()}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No treasury accounts set up yet.</p>
          )}
        </div>
      </div>

      {/* Partner Assignments & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Assigned Partners</h2>
          {client.assignments?.length > 0 ? (
            <div className="space-y-2">
              {client.assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{a.partner_name}</div>
                    <div className="text-xs text-slate-500">{a.partner_type.replace('_', ' ')}</div>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No partners assigned yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Documents</h2>
          {client.documents?.length > 0 ? (
            <div className="space-y-2">
              {client.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{d.name}</div>
                    <div className="text-xs text-slate-500">{d.doc_type.replace(/_/g, ' ')}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={getStatusStyle(d.status)}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No documents yet.</p>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ borderLeft: '4px solid #00D4AA' }}>
          <div className="text-sm text-slate-500">Annual Revenue</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {client.annual_revenue_usd ? `$${client.annual_revenue_usd.toLocaleString()}` : '—'}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ borderLeft: '4px solid #0052FF' }}>
          <div className="text-sm text-slate-500">Crypto Holdings</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {client.crypto_holdings_usd ? `$${client.crypto_holdings_usd.toLocaleString()}` : '—'}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div className="text-sm text-slate-500">Client Since</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {new Date(client.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {client.notes && (
        <div className="mt-6 bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-slate-900 mb-2">Notes</h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}
    </div>
  );
}
