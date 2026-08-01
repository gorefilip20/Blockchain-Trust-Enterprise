import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');

  let entities;
  if (clientId) {
    entities = db.prepare(`
      SELECT e.*, c.first_name || ' ' || c.last_name as client_name
      FROM entities e JOIN clients c ON e.client_id = c.id
      WHERE e.client_id = ? ORDER BY e.created_at DESC
    `).all(clientId);
  } else {
    entities = db.prepare(`
      SELECT e.*, c.first_name || ' ' || c.last_name as client_name
      FROM entities e JOIN clients c ON e.client_id = c.id
      ORDER BY e.created_at DESC
    `).all();
  }
  return NextResponse.json(entities);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { client_id, entity_name, entity_type, jurisdiction, privacy_shield } = body;

  try {
    db.prepare(`
      INSERT INTO entities (id, client_id, entity_name, entity_type, jurisdiction, privacy_shield, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).run(id, client_id, entity_name, entity_type, jurisdiction || 'Wyoming', privacy_shield ? 1 : 0);

    // Update client entity_type
    db.prepare('UPDATE clients SET entity_type = ? WHERE id = ?').run(entity_type, client_id);

    // Update workflow step 2 to in_progress
    db.prepare(`
      UPDATE workflows SET status = 'in_progress', started_at = datetime('now')
      WHERE client_id = ? AND step_number = 2 AND status = 'pending'
    `).run(client_id);

    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const { id, status, ein, operating_agreement_signed, registered_agent } = body;

  if (!id) return NextResponse.json({ error: 'Entity ID required' }, { status: 400 });

  const updates: string[] = [];
  const values: unknown[] = [];

  if (status) {
    updates.push('status = ?');
    values.push(status);
    if (status === 'active') {
      updates.push("formed_at = datetime('now')");
    }
  }
  if (ein !== undefined) {
    updates.push('ein = ?');
    values.push(ein);
  }
  if (operating_agreement_signed !== undefined) {
    updates.push('operating_agreement_signed = ?');
    values.push(operating_agreement_signed ? 1 : 0);
  }
  if (registered_agent !== undefined) {
    updates.push('registered_agent = ?');
    values.push(registered_agent);
  }

  if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  updates.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE entities SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return NextResponse.json({ success: true });
}
