'use client';

import { useEffect, useState } from 'react';
import { Shield, UserCheck, Plus, X, Save, Edit2, Users } from 'lucide-react';

type Role = { id: string; name: string; description: string | null; permissions: string; created_at: string };
type Admin = { id: string; username: string; legacy_role: string; created_at: string; assigned_roles: string | null; role_ids: string | null };

const ALL_PERMISSIONS = [
  'all', 'view_clients', 'manage_clients', 'view_entities', 'manage_entities',
  'view_payments', 'manage_payments', 'view_analytics', 'manage_messages',
  'view_documents', 'manage_documents', 'manage_strategies', 'manage_roles',
  'manage_settings', 'manage_partners',
];

const PERMISSION_COLORS: Record<string, string> = {
  all: '#ef4444', view_clients: '#3b82f6', manage_clients: '#2563eb',
  view_entities: '#8b5cf6', manage_entities: '#7c3aed',
  view_payments: '#10b981', manage_payments: '#059669',
  view_analytics: '#f59e0b', manage_messages: '#ec4899',
  view_documents: '#6366f1', manage_documents: '#4f46e5',
  manage_strategies: '#14b8a6', manage_roles: '#e11d48',
  manage_settings: '#9333ea', manage_partners: '#0891b2',
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [notice, setNotice] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; description: string; permissions: string[] }>({ name: '', description: '', permissions: [] });
  const [showCreate, setShowCreate] = useState(false);
  const [newRole, setNewRole] = useState<{ name: string; description: string; permissions: string[] }>({ name: '', description: '', permissions: [] });
  const token = typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';

  async function load() {
    const res = await fetch('/api/admin/roles', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setRoles(data.roles);
      setAdmins(data.admins);
    }
  }

  useEffect(() => { load(); }, []);

  function showNotice(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  }

  async function createRole() {
    if (!newRole.name.trim()) return;
    const res = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newRole),
    });
    if (res.ok) {
      showNotice('Role created successfully.');
      setShowCreate(false);
      setNewRole({ name: '', description: '', permissions: [] });
      load();
    } else {
      const err = await res.json();
      showNotice(err.error || 'Failed to create role.');
    }
  }

  async function saveEdit() {
    if (!editingRole) return;
    const res = await fetch('/api/admin/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: editingRole, ...editForm }),
    });
    if (res.ok) {
      showNotice('Role updated.');
      setEditingRole(null);
      load();
    }
  }

  function startEdit(role: Role) {
    setEditingRole(role.id);
    const perms = JSON.parse(role.permissions || '[]');
    setEditForm({ name: role.name, description: role.description || '', permissions: perms });
  }

  async function assignRole(adminId: string, roleId: string) {
    const res = await fetch('/api/admin/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: roleId, assignAdminId: adminId }),
    });
    if (res.ok) { showNotice('Role assigned.'); load(); }
    else {
      const err = await res.json();
      showNotice(err.error || 'Failed to assign role.');
    }
  }

  async function unassignRole(adminId: string, roleId: string) {
    const res = await fetch('/api/admin/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: roleId, unassignAdminId: adminId }),
    });
    if (res.ok) { showNotice('Role removed.'); load(); }
  }

  function togglePermission(perms: string[], perm: string): string[] {
    return perms.includes(perm) ? perms.filter(p => p !== perm) : [...perms, perm];
  }

  return (
    <div className="admin-ops-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Access management</div>
          <h1>Roles & Access Control</h1>
          <p>Manage admin roles, permissions, and user assignments for the BTE platform.</p>
        </div>
        <button
          className="admin-preview-link"
          onClick={() => setShowCreate(!showCreate)}
          style={{ cursor: 'pointer', border: '1px solid #b7ded5', background: '#f0fbf8' }}
        >
          <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          New Role
        </button>
      </div>

      {/* KPI */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi">
          <Shield size={20} />
          <span>Total Roles</span>
          <b>{roles.length}</b>
        </div>
        <div className="admin-kpi">
          <Users size={20} />
          <span>Admin Users</span>
          <b>{admins.length}</b>
        </div>
        <div className="admin-kpi">
          <UserCheck size={20} />
          <span>Active Assignments</span>
          <b>{admins.reduce((s, a) => s + (a.role_ids ? a.role_ids.split(',').length : 0), 0)}</b>
        </div>
      </div>

      {/* Create Role Form */}
      {showCreate && (
        <section className="admin-ops-card" style={{ marginBottom: '18px' }}>
          <div className="admin-section-title">
            <div><h2>Create New Role</h2></div>
            <button className="admin-small-action" onClick={() => setShowCreate(false)}><X size={14} /> Cancel</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#718896', marginBottom: '6px' }}>Role Name</label>
              <input
                value={newRole.name}
                onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="e.g. Analyst"
                style={{ width: '100%', padding: '0 12px', border: '1px solid #d4e3e8', borderRadius: '8px', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#718896', marginBottom: '6px' }}>Description</label>
              <input
                value={newRole.description}
                onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Brief description of this role"
                style={{ width: '100%', padding: '0 12px', border: '1px solid #d4e3e8', borderRadius: '8px', fontSize: '12px' }}
              />
            </div>
          </div>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#718896', marginBottom: '8px' }}>Permissions</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {ALL_PERMISSIONS.map(p => (
              <button
                key={p}
                onClick={() => setNewRole({ ...newRole, permissions: togglePermission(newRole.permissions, p) })}
                style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${newRole.permissions.includes(p) ? PERMISSION_COLORS[p] || '#94a3b8' : '#dce7ee'}`,
                  background: newRole.permissions.includes(p) ? `${PERMISSION_COLORS[p] || '#94a3b8'}18` : '#fff',
                  color: newRole.permissions.includes(p) ? PERMISSION_COLORS[p] || '#94a3b8' : '#94a3b8',
                }}
              >
                {p.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <button className="admin-small-action" onClick={createRole} style={{ padding: '9px 16px' }}>
            <Save size={14} /> Create Role
          </button>
        </section>
      )}

      {/* Roles List */}
      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Defined Roles</h2>
            <p>Each role bundles a set of permissions that can be assigned to admin users.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => {
                const perms: string[] = JSON.parse(role.permissions || '[]');
                const isEditing = editingRole === role.id;
                return (
                  <tr key={role.id}>
                    <td>
                      {isEditing ? (
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          style={{ width: '100%', padding: '0 8px', border: '1px solid #d4e3e8', borderRadius: '6px', fontSize: '11px', minHeight: '34px' }}
                        />
                      ) : (
                        <><strong>{role.name}</strong><small>{role.id}</small></>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          style={{ width: '100%', padding: '0 8px', border: '1px solid #d4e3e8', borderRadius: '6px', fontSize: '11px', minHeight: '34px' }}
                        />
                      ) : (
                        <span style={{ color: '#718896', fontSize: '11px' }}>{role.description || '--'}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {ALL_PERMISSIONS.map(p => (
                            <button
                              key={p}
                              onClick={() => setEditForm({ ...editForm, permissions: togglePermission(editForm.permissions, p) })}
                              style={{
                                padding: '3px 7px', borderRadius: '5px', fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                                border: `1px solid ${editForm.permissions.includes(p) ? PERMISSION_COLORS[p] || '#94a3b8' : '#e2ebef'}`,
                                background: editForm.permissions.includes(p) ? `${PERMISSION_COLORS[p] || '#94a3b8'}18` : '#fff',
                                color: editForm.permissions.includes(p) ? PERMISSION_COLORS[p] || '#94a3b8' : '#cbd5e1',
                              }}
                            >
                              {p.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {perms.map(p => (
                            <span
                              key={p}
                              style={{
                                padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 600,
                                background: `${PERMISSION_COLORS[p] || '#94a3b8'}18`,
                                color: PERMISSION_COLORS[p] || '#94a3b8',
                              }}
                            >
                              {p.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="admin-small-action" onClick={saveEdit}><Save size={12} /> Save</button>
                          <button className="admin-small-action" onClick={() => setEditingRole(null)} style={{ color: '#94a3b8', background: '#f8fafc', borderColor: '#e2ebef' }}><X size={12} /></button>
                        </div>
                      ) : (
                        <button className="admin-small-action" onClick={() => startEdit(role)}><Edit2 size={12} /> Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {roles.length === 0 && (
                <tr><td colSpan={4}><div className="admin-empty">No roles defined yet.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admin Users & Assignments */}
      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Admin Users & Assignments</h2>
            <p>Assign or remove roles from platform administrators.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Legacy Role</th>
                <th>Assigned Roles</th>
                <th>Assign / Remove</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => {
                const assignedIds = admin.role_ids ? admin.role_ids.split(',') : [];
                return (
                  <tr key={admin.id}>
                    <td>
                      <strong>{admin.username}</strong>
                      <small>{admin.id}</small>
                    </td>
                    <td>
                      <span style={{ padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 600, background: '#0fa98718', color: '#0fa987' }}>
                        {admin.legacy_role}
                      </span>
                    </td>
                    <td>
                      {admin.assigned_roles ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {admin.assigned_roles.split(', ').map((r, i) => (
                            <span key={i} style={{ padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 600, background: '#3b82f618', color: '#3b82f6' }}>
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '10px' }}>No roles assigned</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {roles.map(role => {
                          const isAssigned = assignedIds.includes(role.id);
                          return (
                            <button
                              key={role.id}
                              className="admin-small-action"
                              onClick={() => isAssigned ? unassignRole(admin.id, role.id) : assignRole(admin.id, role.id)}
                              style={{
                                fontSize: '9px', padding: '4px 7px',
                                color: isAssigned ? '#ef4444' : '#078d73',
                                background: isAssigned ? '#fef2f2' : '#effaf7',
                                borderColor: isAssigned ? '#fecaca' : '#c4e9df',
                              }}
                            >
                              {isAssigned ? <><X size={10} /> {role.name}</> : <><Plus size={10} /> {role.name}</>}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {admins.length === 0 && (
                <tr><td colSpan={4}><div className="admin-empty">No admin users found.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {notice && <div className="admin-save-notice"><Save size={15} />{notice}</div>}
    </div>
  );
}
