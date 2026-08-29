'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, MessageCircle, BarChart3, Users, Save, AlertCircle, Loader2 } from 'lucide-react';

type Message = { id: string; user_name: string; subject: string; status: string; created_at: string };
type Strategy = { id: string; name: string; manager: string; status: string };
type Client = { id: string; first_name: string; last_name: string; email: string; status: string };

type BulkResult = { success: boolean; type: string; action: string; total: number; successCount: number; failCount: number } | null;

export default function BulkOpsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());

  const [messageAction, setMessageAction] = useState('resolved');
  const [strategyAction, setStrategyAction] = useState('published');
  const [clientAction, setClientAction] = useState('active');

  const [confirming, setConfirming] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<BulkResult>(null);
  const [notice, setNotice] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';

  async function loadData() {
    const res = await fetch('/api/operations', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
      setStrategies(data.strategies || []);
    }

    // Load clients
    try {
      const cRes = await fetch('/api/clients', { headers: { Authorization: `Bearer ${token}` } });
      if (cRes.ok) {
        const cData = await cRes.json();
        setClients(Array.isArray(cData) ? cData : cData.clients || []);
      }
    } catch {
      // clients endpoint may not exist yet
    }
  }

  useEffect(() => { loadData(); }, []);

  function showNotice(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  }

  function toggleSelection(set: Set<string>, id: string, setter: (s: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setter(next);
  }

  function toggleAll(items: { id: string }[], set: Set<string>, setter: (s: Set<string>) => void) {
    if (set.size === items.length) setter(new Set());
    else setter(new Set(items.map(i => i.id)));
  }

  async function executeBulk(type: string, ids: string[], action: string) {
    setProcessing(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type, ids, action }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        showNotice(`Bulk ${type} update: ${data.successCount} succeeded, ${data.failCount} failed.`);
        loadData();
        // Clear selections
        if (type === 'messages') setSelectedMessages(new Set());
        if (type === 'strategies') setSelectedStrategies(new Set());
        if (type === 'clients') setSelectedClients(new Set());
      } else {
        const err = await res.json();
        showNotice(err.error || 'Bulk operation failed.');
      }
    } finally {
      setProcessing(false);
      setConfirming(null);
    }
  }

  return (
    <div className="admin-ops-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Mass actions</div>
          <h1>Bulk Operations</h1>
          <p>Select multiple items and apply status changes in bulk. All updates run in a single transaction.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi">
          <MessageCircle size={20} />
          <span>Messages</span>
          <b>{messages.length}</b>
        </div>
        <div className="admin-kpi">
          <BarChart3 size={20} />
          <span>Strategies</span>
          <b>{strategies.length}</b>
        </div>
        <div className="admin-kpi">
          <Users size={20} />
          <span>Clients</span>
          <b>{clients.length}</b>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '10px', marginBottom: '16px',
          background: result.failCount === 0 ? '#f0fbf8' : '#fef9ee',
          border: `1px solid ${result.failCount === 0 ? '#b7ded5' : '#fcd34d'}`,
        }}>
          <CheckSquare size={16} style={{ color: result.failCount === 0 ? '#078d73' : '#d97706' }} />
          <span style={{ fontSize: '12px', color: '#173247' }}>
            <b>Bulk {result.type} update complete:</b> {result.successCount} of {result.total} items updated to &quot;{result.action}&quot;.
            {result.failCount > 0 && <span style={{ color: '#dc2626' }}> {result.failCount} failed.</span>}
          </span>
        </div>
      )}

      {/* Bulk Messages */}
      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Bulk Message Status</h2>
            <p>Select messages and change their status in bulk.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={messageAction}
              onChange={e => setMessageAction(e.target.value)}
              style={{ minHeight: '34px', border: '1px solid #d4e3e8', borderRadius: '7px', padding: '0 8px', fontSize: '11px', color: '#456271', background: '#fff' }}
            >
              <option value="open">Set Open</option>
              <option value="in_progress">Set In Progress</option>
              <option value="resolved">Set Resolved</option>
              <option value="archived">Set Archived</option>
            </select>
            {confirming === 'messages' ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="admin-small-action"
                  onClick={() => executeBulk('messages', Array.from(selectedMessages), messageAction)}
                  disabled={processing}
                  style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                >
                  {processing ? <Loader2 size={12} className="spin" /> : <AlertCircle size={12} />}
                  Confirm ({selectedMessages.size})
                </button>
                <button className="admin-small-action" onClick={() => setConfirming(null)} style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#e2ebef' }}>Cancel</button>
              </div>
            ) : (
              <button
                className="admin-small-action"
                onClick={() => selectedMessages.size > 0 && setConfirming('messages')}
                disabled={selectedMessages.size === 0}
                style={{ opacity: selectedMessages.size === 0 ? 0.5 : 1 }}
              >
                <CheckSquare size={12} /> Apply ({selectedMessages.size})
              </button>
            )}
          </div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" checked={messages.length > 0 && selectedMessages.size === messages.length} onChange={() => toggleAll(messages, selectedMessages, setSelectedMessages)} />
                </th>
                <th>Subject</th>
                <th>From</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty">No messages.</div></td></tr>
              ) : messages.map(m => (
                <tr key={m.id} style={{ background: selectedMessages.has(m.id) ? '#f0fbf8' : undefined }}>
                  <td><input type="checkbox" checked={selectedMessages.has(m.id)} onChange={() => toggleSelection(selectedMessages, m.id, setSelectedMessages)} /></td>
                  <td><strong>{m.subject}</strong></td>
                  <td>{m.user_name}</td>
                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 600, background: m.status === 'open' ? '#dbeafe' : m.status === 'resolved' ? '#d1fae5' : '#fef3c7', color: m.status === 'open' ? '#2563eb' : m.status === 'resolved' ? '#059669' : '#d97706' }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '10px', color: '#8aa0ac' }}>{m.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bulk Strategies */}
      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Bulk Strategy Management</h2>
            <p>Pause, publish, or archive multiple strategies at once.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={strategyAction}
              onChange={e => setStrategyAction(e.target.value)}
              style={{ minHeight: '34px', border: '1px solid #d4e3e8', borderRadius: '7px', padding: '0 8px', fontSize: '11px', color: '#456271', background: '#fff' }}
            >
              <option value="draft">Set Draft</option>
              <option value="published">Set Published</option>
              <option value="paused">Set Paused</option>
              <option value="archived">Set Archived</option>
            </select>
            {confirming === 'strategies' ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="admin-small-action"
                  onClick={() => executeBulk('strategies', Array.from(selectedStrategies), strategyAction)}
                  disabled={processing}
                  style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                >
                  {processing ? <Loader2 size={12} /> : <AlertCircle size={12} />}
                  Confirm ({selectedStrategies.size})
                </button>
                <button className="admin-small-action" onClick={() => setConfirming(null)} style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#e2ebef' }}>Cancel</button>
              </div>
            ) : (
              <button
                className="admin-small-action"
                onClick={() => selectedStrategies.size > 0 && setConfirming('strategies')}
                disabled={selectedStrategies.size === 0}
                style={{ opacity: selectedStrategies.size === 0 ? 0.5 : 1 }}
              >
                <CheckSquare size={12} /> Apply ({selectedStrategies.size})
              </button>
            )}
          </div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" checked={strategies.length > 0 && selectedStrategies.size === strategies.length} onChange={() => toggleAll(strategies, selectedStrategies, setSelectedStrategies)} />
                </th>
                <th>Strategy</th>
                <th>Manager</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {strategies.length === 0 ? (
                <tr><td colSpan={4}><div className="admin-empty">No strategies.</div></td></tr>
              ) : strategies.map(s => (
                <tr key={s.id} style={{ background: selectedStrategies.has(s.id) ? '#f0fbf8' : undefined }}>
                  <td><input type="checkbox" checked={selectedStrategies.has(s.id)} onChange={() => toggleSelection(selectedStrategies, s.id, setSelectedStrategies)} /></td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.manager}</td>
                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 600, background: s.status === 'published' ? '#d1fae5' : s.status === 'paused' ? '#fef3c7' : '#f1f5f9', color: s.status === 'published' ? '#059669' : s.status === 'paused' ? '#d97706' : '#64748b' }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bulk Clients */}
      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Bulk Client Status</h2>
            <p>Update the status of multiple clients simultaneously.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={clientAction}
              onChange={e => setClientAction(e.target.value)}
              style={{ minHeight: '34px', border: '1px solid #d4e3e8', borderRadius: '7px', padding: '0 8px', fontSize: '11px', color: '#456271', background: '#fff' }}
            >
              <option value="lead">Set Lead</option>
              <option value="onboarding">Set Onboarding</option>
              <option value="active">Set Active</option>
              <option value="inactive">Set Inactive</option>
            </select>
            {confirming === 'clients' ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="admin-small-action"
                  onClick={() => executeBulk('clients', Array.from(selectedClients), clientAction)}
                  disabled={processing}
                  style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                >
                  {processing ? <Loader2 size={12} /> : <AlertCircle size={12} />}
                  Confirm ({selectedClients.size})
                </button>
                <button className="admin-small-action" onClick={() => setConfirming(null)} style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#e2ebef' }}>Cancel</button>
              </div>
            ) : (
              <button
                className="admin-small-action"
                onClick={() => selectedClients.size > 0 && setConfirming('clients')}
                disabled={selectedClients.size === 0}
                style={{ opacity: selectedClients.size === 0 ? 0.5 : 1 }}
              >
                <CheckSquare size={12} /> Apply ({selectedClients.size})
              </button>
            )}
          </div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" checked={clients.length > 0 && selectedClients.size === clients.length} onChange={() => toggleAll(clients, selectedClients, setSelectedClients)} />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr><td colSpan={4}><div className="admin-empty">No clients found.</div></td></tr>
              ) : clients.map(c => (
                <tr key={c.id} style={{ background: selectedClients.has(c.id) ? '#f0fbf8' : undefined }}>
                  <td><input type="checkbox" checked={selectedClients.has(c.id)} onChange={() => toggleSelection(selectedClients, c.id, setSelectedClients)} /></td>
                  <td><strong>{c.first_name} {c.last_name}</strong></td>
                  <td style={{ fontSize: '10px', color: '#718896' }}>{c.email}</td>
                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 600, background: c.status === 'active' ? '#d1fae5' : c.status === 'onboarding' ? '#fef3c7' : c.status === 'lead' ? '#dbeafe' : '#f1f5f9', color: c.status === 'active' ? '#059669' : c.status === 'onboarding' ? '#d97706' : c.status === 'lead' ? '#2563eb' : '#64748b' }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {notice && <div className="admin-save-notice"><Save size={15} />{notice}</div>}
    </div>
  );
}
