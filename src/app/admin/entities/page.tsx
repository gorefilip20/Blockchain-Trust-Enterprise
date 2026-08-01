'use client';

import { useEffect, useState } from 'react';

interface Entity {
  id: string;
  client_id: string;
  entity_name: string;
  entity_type: string;
  jurisdiction: string;
  tier_type: string;
  parent_entity_id: string | null;
  parent_entity_name: string | null;
  member_type: string;
  tax_classification: string;
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

const tierLabels: Record<string, { label: string; bg: string; text: string }> = {
  parent: { label: 'Parent', bg: 'rgba(0,82,255,0.1)', text: '#0052FF' },
  subsidiary: { label: 'Subsidiary', bg: 'rgba(0,212,170,0.1)', text: '#00A080' },
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
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    fetch('/api/entities').then((r) => r.json()).then(setEntities);
  }, []);

  const filtered = entities.filter((e) => {
    const matchesSearch = !search ||
      e.entity_name.toLowerCase().includes(search.toLowerCase()) ||
      e.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === 'all' || e.tier_type === tierFilter;
    return matchesSearch && matchesTier;
  });

  const parentEntities = entities.filter((e) => e.tier_type === 'parent');
  const subsidiaryEntities = entities.filter((e) => e.tier_type === 'subsidiary');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Corporate Entities</h1>
        <p className="text-slate-500 text-sm mt-1">Two-tier parent-subsidiary entity structures and filing status.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Entities', value: entities.length.toString(), color: '#0052FF' },
          { label: 'Parent (Delaware)', value: parentEntities.length.toString(), color: '#0052FF' },
          { label: 'Subsidiary (Wyoming)', value: subsidiaryEntities.length.toString(), color: '#00D4AA' },
          { label: 'Active', value: entities.filter((e) => e.status === 'active').length.toString(), color: '#15803D' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E2E8F0', borderLeft: `4px solid ${card.color}` }}>
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text" placeholder="Search entities..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'parent', 'subsidiary'].map((tier) => (
            <button key={tier} onClick={() => setTierFilter(tier)} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={tierFilter === tier ? { backgroundColor: '#0A1628', color: '#FFFFFF' } : { backgroundColor: '#F1F5F9', color: '#64748B' }}
            >
              {tier === 'all' ? 'All' : tier === 'parent' ? 'Parents' : 'Subsidiaries'}
            </button>
          ))}
        </div>
      </div>

      {/* Corporate Tree View */}
      {parentEntities.length > 0 && tierFilter === 'all' && !search && (
        <div className="mb-8 space-y-4">
          <h2 className="font-semibold text-slate-900">Corporate Trees</h2>
          {parentEntities.map((parent) => {
            const children = entities.filter((e) => e.parent_entity_id === parent.id);
            const pss = statusStyles[parent.status] || { bg: '#F1F5F9', text: '#475569' };
            return (
              <div key={parent.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,82,255,0.1)', color: '#0052FF' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /></svg>
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{parent.entity_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: tierLabels.parent.bg, color: tierLabels.parent.text }}>Parent</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: pss.bg, color: pss.text }}>{parent.status}</span>
                    </div>
                    <div className="text-xs text-slate-500">{parent.jurisdiction} &middot; {parent.member_type === 'multi_member' ? 'Multi-Member' : 'Single-Member'} &middot; {parent.client_name}</div>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="ml-8 border-l-2 pl-4 space-y-2" style={{ borderColor: '#00D4AA' }}>
                    {children.map((child) => {
                      const css = statusStyles[child.status] || { bg: '#F1F5F9', text: '#475569' };
                      return (
                        <div key={child.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                          <span className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-slate-900">{child.entity_name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: tierLabels.subsidiary.bg, color: tierLabels.subsidiary.text }}>Subsidiary</span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: css.bg, color: css.text }}>{child.status}</span>
                              {child.privacy_shield === 1 && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>Privacy Shield</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{child.jurisdiction} &middot; Single-Member &middot; Disregarded Entity</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Entity</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Tier</th>
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
                const tier = tierLabels[entity.tier_type] || { label: entity.tier_type, bg: '#F1F5F9', text: '#475569' };
                return (
                  <tr key={entity.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 text-sm">{entity.entity_name}</div>
                      {entity.parent_entity_name && <div className="text-xs text-slate-500">Owned by: {entity.parent_entity_name}</div>}
                      {entity.ein && <div className="text-xs text-slate-500">EIN: {entity.ein}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: tier.bg, color: tier.text }}>{tier.label}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{typeLabels[entity.entity_type] || entity.entity_type}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{entity.jurisdiction}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{entity.client_name}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ss.bg, color: ss.text }}>{entity.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      {entity.privacy_shield ? (
                        <span className="flex items-center gap-1 text-sm" style={{ color: '#00D4AA' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          Shielded
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    {entities.length === 0 ? 'No entities created yet.' : 'No matching entities.'}
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
