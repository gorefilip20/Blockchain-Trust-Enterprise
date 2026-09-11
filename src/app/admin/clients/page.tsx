'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  client_type: string;
  status: string;
  entity_type: string;
  jurisdiction: string;
  crypto_holdings_usd: number;
  created_at: string;
  entity_count: number;
  completed_steps: number;
  total_steps: number;
}

const C = { bg: '#f3f2f2', surface: '#eae9e9', text: '#201e1d', accent: '#6a3df0', accentHover: '#5a2fd6', accentLight: '#f1ecff' };
const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

const typeLabels: Record<string, string> = {
  hnw_investor: 'HNW Investor', web3_founder: 'Web3 Founder', dao_member: 'DAO Member',
  crypto_miner: 'Crypto Miner', staking_operator: 'Staking Operator',
};

const statusTag: Record<string, { bg: string; color: string }> = {
  active: { bg: C.accentLight, color: C.accent },
  onboarding: { bg: '#fff', color: C.text },
  lead: { bg: C.surface, color: 'rgba(32,30,29,0.6)' },
  inactive: { bg: C.surface, color: 'rgba(32,30,29,0.4)' },
};

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,0.5)', borderBottom: `2px solid ${C.surface}` };
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${C.surface}` };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 20;

  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then(setClients);
  }, []);

  const filtered = clients.filter((c) => {
    const matchesSearch = !search || `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const segmented = (value: string, label: string) => {
    const active = filterStatus === value;
    return (
      <button
        key={value}
        onClick={() => { setFilterStatus(value); setPage(0); }}
        style={{
          padding: '8px 16px', fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase',
          border: 'none', cursor: 'pointer', fontFamily: FONT,
          background: active ? C.accent : 'transparent', color: active ? '#fff' : 'rgba(32,30,29,0.6)',
          transition: 'all 0.15s',
        }}
      >{label}</button>
    );
  };

  return (
    <div style={{ fontFamily: FONT, color: C.text }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Clients</h1>
        <Link href="/admin/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accent, color: '#fff', padding: '10px 20px', fontSize: 13, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', textDecoration: 'none' }}>
          + New client
        </Link>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="bte-clients-search"
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: `2px solid rgba(32,30,29,0.25)`, background: '#fff', fontSize: 13, fontFamily: FONT, color: C.text }}
        />
        <div style={{ display: 'inline-flex', border: `2px solid ${C.surface}` }}>
          {segmented('', 'All')}
          {segmented('active', 'Active')}
          {segmented('onboarding', 'Onboarding')}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `2px solid ${C.surface}`, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Client</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Entity</th>
              <th style={thStyle}>Jurisdiction</th>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((client) => {
              const st = statusTag[client.status] || statusTag.lead;
              return (
                <tr key={client.id}>
                  <td style={tdStyle}>
                    <Link href={`/admin/clients/${client.id}`} style={{ textDecoration: 'none', color: C.text }}>
                      <div style={{ fontWeight: 600 }}>{client.first_name} {client.last_name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(32,30,29,0.5)' }}>{client.email}</div>
                    </Link>
                  </td>
                  <td style={tdStyle}>{typeLabels[client.client_type] || client.client_type}</td>
                  <td style={tdStyle}>{client.entity_count || 0} entities</td>
                  <td style={tdStyle}>{client.jurisdiction || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '3px 8px', background: st.bg, color: st.color, border: client.status === 'onboarding' ? `2px solid ${C.surface}` : 'none' }}>
                      {client.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: 'rgba(32,30,29,0.5)' }}>{new Date(client.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', padding: '48px 16px', color: 'rgba(32,30,29,0.4)' }}>
                  {clients.length === 0 ? 'No clients yet. Start by creating one.' : 'No clients match your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <span style={{ fontSize: 12, color: 'rgba(32,30,29,0.5)' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', border: `2px solid ${C.surface}`, background: '#fff', fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}>← Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', border: `2px solid ${C.surface}`, background: '#fff', fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1 }}>Next →</button>
          </div>
        )}
      </div>

      <style>{`
        .bte-clients-search::placeholder { color: rgba(32,30,29,0.35); }
        .bte-clients-search:focus { outline: none; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px rgba(106,61,240,0.18); }
      `}</style>
    </div>
  );
}
