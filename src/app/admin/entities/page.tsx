'use client';

import { useEffect, useState } from 'react';

interface Entity {
  id: string;
  client_id: string;
  entity_name: string;
  entity_type: string;
  jurisdiction: string;
  ein: string;
  status: string;
  privacy_shield: number;
  operating_agreement_signed: number;
  formed_at: string;
  created_at: string;
  client_name: string;
}

const typeLabels: Record<string, string> = {
  holding_llc: 'Holding LLC',
  operating_llc: 'Operating LLC',
  dao_llc: 'DAO LLC',
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#F1F5F9', text: '#64748B' },
  filed: { bg: '#DBEAFE', text: '#1D4ED8' },
  approved: { bg: '#FEF3C7', text: '#B45309' },
  active: { bg: '#DCFCE7', text: '#15803D' },
  dissolved: { bg: '#FEE2E2', text: '#B91C1C' },
};

export default function AdminEntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/entities').then((r) => r.json()).then(setEntities);
  }, []);

  const filtered = entities.filter((e) =>
    !search ||
    e.entity_name.toLowerCase().includes(search.toLowerCase()) ||
    e.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.jurisdiction.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entities</h1>
          <p className="text-slate-500 text-sm mt-1">{entities.length} total entities across all clients</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Entity Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Jurisdiction</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Privacy</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entity) => {
                const ss = statusStyles[entity.status] || { bg: '#F1F5F9', text: '#475569' };
                return (
                  <tr key={entity.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{entity.entity_name}</div>
                      {entity.ein && <div className="text-xs text-slate-500">EIN: {entity.ein}</div>}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{typeLabels[entity.entity_type] || entity.entity_type}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{entity.jurisdiction}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{entity.client_name}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: ss.bg, color: ss.text }}
                      >
                        {entity.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {entity.privacy_shield ? (
                        <span className="flex items-center gap-1 text-sm" style={{ color: '#00D4AA' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Shielded
                        </span>
                      ) : (
                        <span className="text-amber-600 text-sm flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          Exposed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    {entities.length === 0 ? 'No entities created yet. Start the onboarding process to create one.' : 'No entities match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
