'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Save, Trash2, X } from 'lucide-react';

type Post = { id: string; title: string; slug: string; excerpt: string; content: string; author: string; category: string; status: string; created_at: string; updated_at: string };

const emptyPost = { id: '', title: '', excerpt: '', content: '', author: 'BTE Research', category: 'Insights', status: 'draft' };

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyPost);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';

  async function load() {
    const r = await fetch('/api/admin/blog', { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) setPosts(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const method = editing ? 'PATCH' : 'POST';
    const r = await fetch('/api/admin/blog', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    if (r.ok) { setNotice(editing ? 'Post updated.' : 'Post created.'); setModal(false); setForm(emptyPost); setEditing(false); load(); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    const r = await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
    if (r.ok) { setNotice('Post deleted.'); load(); }
  }

  function openEdit(post: Post) { setForm({ id: post.id, title: post.title, excerpt: post.excerpt, content: post.content, author: post.author, category: post.category, status: post.status }); setEditing(true); setModal(true); }
  function openNew() { setForm(emptyPost); setEditing(false); setModal(true); }

  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="admin-ops-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Content management</div>
          <h1>Blog & insights</h1>
          <p>Create, edit, and publish blog posts for the public BTE blog.</p>
        </div>
        <button className="admin-preview-link" onClick={openNew} style={{ cursor: 'pointer' }}><Plus size={14} /> New post</button>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi"><FileText size={20} /><span>Total posts</span><b>{posts.length}</b></div>
        <div className="admin-kpi"><FileText size={20} /><span>Published</span><b>{published}</b></div>
        <div className="admin-kpi"><FileText size={20} /><span>Drafts</span><b>{drafts}</b></div>
      </div>

      <section className="admin-ops-card">
        <div className="admin-section-title"><div><h2>All posts</h2><p>Manage blog content. Published posts appear on the public blog.</p></div></div>
        <div className="admin-table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong><small>{post.slug}</small></td>
                  <td>{post.category}</td>
                  <td>{post.author}</td>
                  <td><span className={`admin-status-badge admin-status-${post.status}`}>{post.status}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="admin-small-action" onClick={() => openEdit(post)}><FileText size={13} /> Edit</button>{' '}
                    <button className="admin-small-action" onClick={() => remove(post.id)} style={{ color: '#c94e5e', background: '#fef2f2', borderColor: '#f3cbd0' }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={6}><div className="admin-empty">No blog posts yet. Click "New post" to create one.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <div className="admin-modal-backdrop" onClick={() => setModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>{editing ? 'Edit post' : 'New post'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'transparent', color: '#718896' }}><X size={20} /></button>
            </div>
            <div className="admin-form-grid">
              <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" /></label>
              <label>Author<input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
              <label>Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>Insights</option><option>Legal</option><option>Web3</option><option>Market Analysis</option><option>Product Updates</option>
                </select>
              </label>
              <label>Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                </select>
              </label>
            </div>
            <label className="admin-form-full-label">Excerpt<input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary" /></label>
            <label className="admin-form-full-label">Content<textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full article content..." /></label>
            <button className="admin-form-submit" onClick={save}><Save size={15} /> {editing ? 'Update post' : 'Create post'}</button>
          </div>
        </div>
      )}

      {notice && <div className="admin-save-notice"><Save size={15} />{notice}<button onClick={() => setNotice('')} style={{ background: 'transparent', color: '#8aa0ac', marginLeft: 8 }}><X size={14} /></button></div>}
    </div>
  );
}
