import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const client = db.prepare(`
    SELECT c.*,
      (SELECT COUNT(*) FROM entities WHERE client_id = c.id) as entity_count,
      (SELECT COUNT(*) FROM workflows WHERE client_id = c.id AND status = 'completed') as completed_steps,
      (SELECT COUNT(*) FROM workflows WHERE client_id = c.id) as total_steps
    FROM clients c WHERE c.id = ?
  `).get(id);

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const entities = db.prepare('SELECT * FROM entities WHERE client_id = ? ORDER BY created_at DESC').all(id);
  const workflows = db.prepare('SELECT * FROM workflows WHERE client_id = ? ORDER BY step_number').all(id);
  const documents = db.prepare('SELECT * FROM documents WHERE client_id = ? ORDER BY created_at DESC').all(id);
  const assignments = db.prepare(`
    SELECT pa.*, p.name as partner_name, p.partner_type 
    FROM partner_assignments pa JOIN partners p ON pa.partner_id = p.id 
    WHERE pa.client_id = ?
  `).all(id);
  const treasuries = db.prepare(`
    SELECT ta.* FROM treasury_accounts ta 
    JOIN entities e ON ta.entity_id = e.id 
    WHERE e.client_id = ?
  `).all(id);

  return NextResponse.json({ ...client, entities, workflows, documents, assignments, treasuries });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  const fields = ['first_name', 'last_name', 'email', 'phone', 'client_type', 'status', 'entity_type', 'jurisdiction', 'notes', 'annual_revenue_usd', 'crypto_holdings_usd'];
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const field of fields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  updates.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
