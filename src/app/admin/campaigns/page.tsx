'use client';

import { useEffect, useState } from 'react';
import { Mail, Plus, Save, Send, Trash2, X } from 'lucide-react';

type Campaign = { id: string; name: string; subject: string; body_preview: string; target_audience: string; status: string; scheduled_at: string | null; sent_count: number; open_rate: number; click_rate: number; created_at: string };

const emptyCampaign = { id: '', name: '', subject: '', body_preview: '', target_audience: 'all_users', status: 'draft', scheduled_at: '' };

export default function CampaignsAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyCampaign);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';

  async function load() {
    const r = await fetch('/api/admin/campaigns', { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) setCampaigns(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const method = editing ? 'PATCH' : 'POST';
    const body = { ...form, scheduled_at: form.scheduled_at || null };
    const r = await fetch('/api/admin/campaigns', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
    if (r.ok) { setNotice(editing ? 'Campaign updated.' : 'Campaign created.'); setModal(false); setForm(emptyCampaign); setEditing(false); load(); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this campaign?')) return;
    const r = await fetch('/api/admin/campaigns', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
    if (r.ok) { setNotice('Campaign deleted.'); load(); }
  }

  function openEdit(c: Campaign) { setForm({ id: c.id, name: c.name, subject: c.subject, body_preview: c.body_preview, target_audience: c.target_audience, status: c.status, scheduled_at: c.scheduled_at || '' }); setEditing(true); setModal(true); }
  function openNew() { setForm(emptyCampaign); setEditing(false); setModal(true); }

  const sent = campaigns.filter((c) => c.status === 'sent').length;
  const avgOpen = campaigns.filter((c) => c.open_rate > 0).reduce((sum, c, _, arr) => sum + c.open_rate / arr.length, 0);

  return (
    <div className="admin-ops-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Email marketing</div>
          <h1>Drip campaigns</h1>
          <p>Create and manage email campaigns for user engagement and retention.</p>
        </div>
        <button className="admin-preview-link" onClick={openNew} style={{ cursor: 'pointer' }}><Plus size={14} /> New campaign</button>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi"><Mail size={20} /><span>Total campaigns</span><b>{campaigns.length}</b></div>
        <div className="admin-kpi"><Send size={20} /><span>Sent</span><b>{sent}</b></div>
        <div className="admin-kpi"><Mail size={20} /><span>Avg. open rate</span><b>{avgOpen > 0 ? avgOpen.toFixed(1) + '%' : '--'}</b></div>
      </div>

      <section className="admin-ops-card">
        <div className="admin-section-title"><div><h2>All campaigns</h2><p>Track performance and manage campaign lifecycle.</p></div></div>
        <div className="admin-table-wrap">
          <table>
            <thead><tr><th>Campaign</th><th>Status</th><th>Audience</th><th>Sent</th><th>Open rate</th><th>Click rate</th><th>Actions</th></tr></thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong><small>{c.subject}</small></td>
                  <td><span className={`admin-status-badge admin-status-${c.status}`}>{c.status}</span></td>
                  <td>{c.target_audience.replace(/_/g, ' ')}</td>
                  <td>{c.sent_count.toLocaleString()}</td>
                  <td>{c.open_rate > 0 ? c.open_rate.toFixed(1) + '%' : '--'}</td>
                  <td>{c.click_rate > 0 ? c.click_rate.toFixed(1) + '%' : '--'}</td>
                  <td>
                    <button className="admin-small-action" onClick={() => openEdit(c)}><Mail size={13} /> Edit</button>{' '}
                    <button className="admin-small-action" onClick={() => remove(c.id)} style={{ color: '#c94e5e', background: '#fef2f2', borderColor: '#f3cbd0' }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && <tr><td colSpan={7}><div className="admin-empty">No campaigns yet. Click "New campaign" to create one.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <div className="admin-modal-backdrop" onClick={() => setModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>{editing ? 'Edit campaign' : 'New campaign'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'transparent', color: '#718896' }}><X size={20} /></button>
            </div>
            <div className="admin-form-grid">
              <label>Campaign name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome Series" /></label>
              <label>Subject line<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Email subject" /></label>
              <label>Target audience
                <select value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })}>
                  <option value="all_users">All users</option><option value="active_traders">Active traders</option><option value="new_signups">New signups</option><option value="inactive_users">Inactive users</option>
                </select>
              </label>
              <label>Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="sent">Sent</option><option value="paused">Paused</option>
                </select>
              </label>
            </div>
            <label className="admin-form-full-label">Body preview<textarea rows={4} value={form.body_preview} onChange={(e) => setForm({ ...form, body_preview: e.target.value })} placeholder="Email body preview..." /></label>
            <label className="admin-form-full-label">Schedule date<input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} /></label>
            <button className="admin-form-submit" onClick={save}><Save size={15} /> {editing ? 'Update campaign' : 'Create campaign'}</button>
          </div>
        </div>
      )}

      {notice && <div className="admin-save-notice"><Save size={15} />{notice}<button onClick={() => setNotice('')} style={{ background: 'transparent', color: '#8aa0ac', marginLeft: 8 }}><X size={14} /></button></div>}
    </div>
  );
}
