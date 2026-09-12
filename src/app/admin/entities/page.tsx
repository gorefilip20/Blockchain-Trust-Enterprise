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

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentLight: '#f1ecff', ink: '#2d2b2b' };

const typeLabels: Record<string, string> = {
  holding_llc: 'Holding LLC',
  operating_llc: 'Operating LLC',
  dao_llc: 'DAO LLC',
};

const tierLabels: Record<string, { label: string; color: string }> = {
  parent: { label: 'Parent', color: C.accent },
  subsidiary: { label: 'Subsidiary', color: '#2f9e58' },
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)' },
  filed: { bg: '#dbeafe', color: '#1d4ed8' },
  approved: { bg: '#fef3c7', color: '#b45309' },
  active: { bg: '#dcfce7', color: '#15803d' },
  dissolved: { bg: '#fee2e2', color: '#b91c1c' },
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
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Corporate Entities</h1>
        <p style={{ color: 'rgba(32,30,29,0.5)', fontSize: 13, margin: '6px 0 0' }}>Two-tier parent-subsidiary entity structures and filing status.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 8, marginBottom: 28 }}>
        {[
          { label: 'Total Entities', value: entities.length.toString(), color: C.accent },
          { label: 'Parent (Delaware)', value: parentEntities.length.toString(), color: C.accent },
          { label: 'Subsidiary (Wyoming)', value: subsidiaryEntities.length.toString(), color: '#2f9e58' },
          { label: 'Active', value: entities.filter((e) => e.status === 'active').length.toString(), color: '#15803D' },
        ].map((card) => (
          <div key={card.label} style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.5)', fontWeight: 600 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: card.color, marginTop: 4 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(32,30,29,0.3)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text" placeholder="Search entities..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 32, paddingRight: 10, padding: '9px 10px 9px 32px', border: `2px solid ${C.surface}`, background: '#fff', fontSize: 13, color: C.text, outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 0, border: `2px solid ${C.surface}` }}>
          {['all', 'parent', 'subsidiary'].map((tier) => (
            <button key={tier} onClick={() => setTierFilter(tier)}
              style={{ padding: '8px 14px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: tierFilter === tier ? C.text : 'transparent', color: tierFilter === tier ? C.bg : 'rgba(32,30,29,0.5)' }}
            >
              {tier === 'all' ? 'All' : tier === 'parent' ? 'Parents' : 'Subsidiaries'}
            </button>
          ))}
        </div>
      </div>

      {parentEntities.length > 0 && tierFilter === 'all' && !search && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Corporate Trees</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {parentEntities.map((parent) => {
              const children = entities.filter((e) => e.parent_entity_id === parent.id);
              const pss = statusStyles[parent.status] || { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)' };
              return (
                <div key={parent.id} style={{ background: '#fff', border: `2px solid ${C.surface}`, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: children.length > 0 ? 12 : 0, flexWrap: 'wrap' }}>
                    <div style={{ width: 32, height: 32, background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="0" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{parent.entity_name}</span>
                        <span style={{ fontSize: 9, padding: '2px 6px', fontWeight: 700, background: C.accentLight, color: C.accent, letterSpacing: '0.04em' }}>PARENT</span>
                        <span style={{ fontSize: 9, padding: '2px 6px', fontWeight: 700, background: pss.bg, color: pss.color, letterSpacing: '0.04em' }}>{parent.status.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.4)', marginTop: 2 }}>{parent.jurisdiction} &middot; {parent.member_type === 'multi_member' ? 'Multi-Member' : 'Single-Member'} &middot; {parent.client_name}</div>
                    </div>
                  </div>
                  {children.length > 0 && (
                    <div style={{ marginLeft: 24, borderLeft: `2px solid ${C.accent}`, paddingLeft: 14 }}>
                      {children.map((child) => {
                        const css = statusStyles[child.status] || { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)' };
                        return (
                          <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: C.bg, marginBottom: 4, flexWrap: 'wrap' }}>
                            <div style={{ width: 26, height: 26, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2f9e58' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="0" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 600, fontSize: 12 }}>{child.entity_name}</span>
                                <span style={{ fontSize: 9, padding: '2px 6px', fontWeight: 700, background: '#dcfce7', color: '#2f9e58', letterSpacing: '0.04em' }}>SUB</span>
                                <span style={{ fontSize: 9, padding: '2px 6px', fontWeight: 700, background: css.bg, color: css.color, letterSpacing: '0.04em' }}>{child.status.toUpperCase()}</span>
                                {child.privacy_shield === 1 && (
                                  <span style={{ fontSize: 9, padding: '2px 6px', fontWeight: 700, background: C.accentLight, color: C.accent, letterSpacing: '0.04em' }}>SHIELD</span>
                                )}
                              </div>
                              <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)' }}>{child.jurisdiction} &middot; Single-Member &middot; Disregarded Entity</div>
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
        </div>
      )}

      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.surface}` }}>
                {['Entity', 'Tier', 'Type', 'Jurisdiction', 'Client', 'Status', 'Privacy'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10, fontWeight: 700, color: 'rgba(32,30,29,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entity) => {
                const ss = statusStyles[entity.status] || { bg: 'rgba(32,30,29,0.06)', color: 'rgba(32,30,29,0.5)' };
                const tier = tierLabels[entity.tier_type] || { label: entity.tier_type, color: 'rgba(32,30,29,0.5)' };
                return (
                  <tr key={entity.id} style={{ borderBottom: `1px solid ${C.surface}` }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{entity.entity_name}</div>
                      {entity.parent_entity_name && <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)' }}>Owned by: {entity.parent_entity_name}</div>}
                      {entity.ein && <div style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)' }}>EIN: {entity.ein}</div>}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', background: `${tier.color}14`, color: tier.color, letterSpacing: '0.04em' }}>{tier.label.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: C.ink }}>{typeLabels[entity.entity_type] || entity.entity_type}</td>
                    <td style={{ padding: '10px 12px', color: C.ink }}>{entity.jurisdiction}</td>
                    <td style={{ padding: '10px 12px', color: C.ink }}>{entity.client_name}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: ss.bg, color: ss.color, letterSpacing: '0.04em' }}>{entity.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {entity.privacy_shield ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.accent }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="0" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          Shielded
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: 'rgba(32,30,29,0.3)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: 'rgba(32,30,29,0.4)' }}>
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
