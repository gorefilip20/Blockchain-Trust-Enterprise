import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function verifyAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  try { jwt.verify(authHeader.slice(7), JWT_SECRET); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const roles = db.prepare('SELECT * FROM admin_roles ORDER BY created_at ASC').all() as {
    id: string; name: string; description: string | null; permissions: string; created_at: string;
  }[];

  const admins = db.prepare(`
    SELECT pa.id, pa.username, pa.role as legacy_role, pa.created_at,
      GROUP_CONCAT(ar.name, ', ') as assigned_roles,
      GROUP_CONCAT(ar.id, ',') as role_ids
    FROM platform_administrators pa
    LEFT JOIN admin_role_assignments ara ON ara.admin_id = pa.id
    LEFT JOIN admin_roles ar ON ar.id = ara.role_id
    GROUP BY pa.id
    ORDER BY pa.created_at ASC
  `).all() as {
    id: string; username: string; legacy_role: string; created_at: string;
    assigned_roles: string | null; role_ids: string | null;
  }[];

  return NextResponse.json({ roles, admins });
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, permissions } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
  }

  const db = getDb();
  const id = `role-${uuidv4().slice(0, 8)}`;
  const perms = JSON.stringify(permissions || []);

  try {
    db.prepare('INSERT INTO admin_roles (id, name, description, permissions) VALUES (?, ?, ?, ?)').run(id, name, description || null, perms);
    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('UNIQUE')) {
      return NextResponse.json({ error: 'A role with that name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, description, permissions, assignAdminId, unassignAdminId } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Role id is required' }, { status: 400 });
  }

  const db = getDb();

  // Assign admin to role
  if (assignAdminId) {
    const assignId = uuidv4();
    try {
      db.prepare('INSERT INTO admin_role_assignments (id, admin_id, role_id) VALUES (?, ?, ?)').run(assignId, assignAdminId, id);
      return NextResponse.json({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.includes('UNIQUE')) {
        return NextResponse.json({ error: 'Already assigned' }, { status: 409 });
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // Unassign admin from role
  if (unassignAdminId) {
    db.prepare('DELETE FROM admin_role_assignments WHERE admin_id = ? AND role_id = ?').run(unassignAdminId, id);
    return NextResponse.json({ success: true });
  }

  // Update role fields
  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (permissions !== undefined) { updates.push('permissions = ?'); params.push(JSON.stringify(permissions)); }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  params.push(id);
  db.prepare(`UPDATE admin_roles SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  return NextResponse.json({ success: true });
}
