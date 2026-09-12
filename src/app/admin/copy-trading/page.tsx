'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, PauseCircle, PlayCircle, Save, UsersRound, Send, CheckCircle2 } from 'lucide-react';

type Strategy = { id: string; name: string; manager: string; risk_level: string; return_30d: string; max_drawdown: string; followers: number; status: string; description: string };
type Message = { id: string; user_name: string; user_email: string; category: string; subject: string; body: string; status: string; admin_reply: string | null; admin_reply_at: string | null; created_at: string };

export default function CopyTradingAdminPage() {
  const [data, setData] = useState<{ users: number; openMessages: number; strategies: Strategy[]; messages: Message[] }>({ users: 0, openMessages: 0, strategies: [], messages: [] });
  const [notice, setNotice] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';
  }

  async function load() {
    const response = await fetch('/api/operations', { headers: { Authorization: `Bearer ${getToken()}` } });
    if (response.ok) setData(await response.json());
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  async function patch(body: object) {
    const response = await fetch('/api/operations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      setNotice('Saved to the BTE operations database.');
      load();
    }
  }

  async function sendReply(messageId: string) {
    const text = replyTexts[messageId]?.trim();
    if (!text) return;
    setSendingReply(messageId);
    const token = getToken();
    const res = await fetch('/api/support-chat', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messageId, reply: text }),
    });
    if (res.ok) {
      setReplyTexts(prev => ({ ...prev, [messageId]: '' }));
      setNotice('Reply sent successfully.');
      load();
    } else {
      setNotice('Failed to send reply.');
    }
    setSendingReply(null);
  }

  return (
    <div className="admin-ops-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Copy trading operations</div>
          <h1>Strategy & message desk</h1>
          <p>Review customer guidance requests and control which copy strategies are published in the public marketplace.</p>
        </div>
        <a className="admin-preview-link" href="/">Preview public frontend</a>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi"><UsersRound size={20} /><span>Total demo users</span><b>{data.users}</b></div>
        <div className="admin-kpi"><MessageCircle size={20} /><span>Open messages</span><b>{data.openMessages}</b></div>
        <div className="admin-kpi"><PlayCircle size={20} /><span>Published strategies</span><b>{data.strategies.filter((s) => s.status === 'published').length}</b></div>
      </div>

      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Copy-trading strategies</h2>
            <p>Only published strategies appear in the public marketplace.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Strategy</th><th>Risk</th><th>30D return</th><th>Max drawdown</th><th>Followers</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.strategies.map((strategy) => (
                <tr key={strategy.id}>
                  <td><strong>{strategy.name}</strong><small>{strategy.manager}</small></td>
                  <td>{strategy.risk_level}</td>
                  <td className="admin-positive">{strategy.return_30d}</td>
                  <td className="admin-negative">{strategy.max_drawdown}</td>
                  <td>{strategy.followers.toLocaleString()}</td>
                  <td>
                    <select value={strategy.status} onChange={(e) => patch({ type: 'strategy', ...strategy, status: e.target.value })}>
                      <option>draft</option><option>published</option><option>paused</option><option>archived</option>
                    </select>
                  </td>
                  <td>
                    <button className="admin-small-action" onClick={() => patch({ type: 'strategy', ...strategy, status: strategy.status === 'paused' ? 'published' : 'paused' })}>
                      {strategy.status === 'paused' ? <><PlayCircle size={14} /> Publish</> : <><PauseCircle size={14} /> Pause</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>User messages</h2>
            <p>Guidance, mentorship, strategy review, and meme-market research requests. Reply directly to users via Live Chat.</p>
          </div>
        </div>
        <div className="message-list">
          {data.messages.length === 0 ? (
            <div className="admin-empty">No messages yet. New Message Admin requests will appear here.</div>
          ) : (
            data.messages.map((message) => (
              <article className="admin-message" key={message.id}>
                <div className="admin-message-top">
                  <div>
                    <strong>{message.subject}</strong>
                    <small>{message.user_name} &middot; {message.user_email} &middot; {message.category}</small>
                  </div>
                  <select value={message.status} onChange={(e) => patch({ type: 'message', id: message.id, status: e.target.value })}>
                    <option>open</option><option>in_progress</option><option>resolved</option><option>archived</option>
                  </select>
                </div>
                <p>{message.body}</p>

                {message.admin_reply && (
                  <div style={{ margin: '8px 0', padding: '10px 12px', background: '#f1ecff', border: '2px solid #e0d4fc', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <CheckCircle2 size={12} color="#6a3df0" />
                      <span style={{ fontWeight: 700, color: '#6a3df0', fontSize: 10, letterSpacing: '0.05em' }}>ADMIN REPLY</span>
                      {message.admin_reply_at && (
                        <span style={{ fontSize: 10, color: 'rgba(32,30,29,0.4)', marginLeft: 'auto' }}>
                          {new Date(message.admin_reply_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#201e1d' }}>{message.admin_reply}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'stretch' }}>
                  <input
                    type="text"
                    value={replyTexts[message.id] || ''}
                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [message.id]: e.target.value }))}
                    placeholder={message.admin_reply ? 'Update reply...' : 'Type admin reply...'}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendReply(message.id); }}
                    style={{ flex: 1, padding: '8px 10px', border: '2px solid #eae9e9', background: '#fff', fontSize: 12, fontFamily: "'Archivo', sans-serif", color: '#201e1d', outline: 'none', minWidth: 0 }}
                  />
                  <button
                    onClick={() => sendReply(message.id)}
                    disabled={!replyTexts[message.id]?.trim() || sendingReply === message.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', background: '#6a3df0', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: !replyTexts[message.id]?.trim() ? 'not-allowed' : 'pointer', opacity: !replyTexts[message.id]?.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}
                  >
                    <Send size={12} />
                    {sendingReply === message.id ? 'Sending...' : 'Reply'}
                  </button>
                </div>

                <small>{message.created_at}</small>
              </article>
            ))
          )}
        </div>
      </section>

      {notice && <div className="admin-save-notice"><Save size={15} />{notice}</div>}
    </div>
  );
}
