import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');

  if (clientId) {
    const workflows = db.prepare(
      'SELECT * FROM workflows WHERE client_id = ? ORDER BY step_number'
    ).all(clientId);
    return NextResponse.json(workflows);
  }

  const all = db.prepare(`
    SELECT w.*, c.first_name || ' ' || c.last_name as client_name
    FROM workflows w JOIN clients c ON w.client_id = c.id
    ORDER BY w.client_id, w.step_number
  `).all();
  return NextResponse.json(all);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const { id, status, notes } = body;

  if (!id) return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 });

  const updates: string[] = [];
  const values: unknown[] = [];

  if (status) {
    updates.push('status = ?');
    values.push(status);
    if (status === 'completed') {
      updates.push("completed_at = datetime('now')");
    }
    if (status === 'in_progress') {
      updates.push("started_at = datetime('now')");
    }
  }
  if (notes !== undefined) {
    updates.push('notes = ?');
    values.push(notes);
  }

  if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  values.push(id);
  db.prepare(`UPDATE workflows SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  // Auto-advance: if current step completed, activate next
  if (status === 'completed') {
    const current = db.prepare('SELECT * FROM workflows WHERE id = ?').get(id) as { client_id: string; step_number: number } | undefined;
    if (current) {
      db.prepare(`
        UPDATE workflows SET status = 'in_progress', started_at = datetime('now')
        WHERE client_id = ? AND step_number = ? AND status = 'pending'
      `).run(current.client_id, current.step_number + 1);
    }
  }

  return NextResponse.json({ success: true });
}
