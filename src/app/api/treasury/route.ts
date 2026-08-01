import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const entityId = searchParams.get('entity_id');

  let accounts;
  if (entityId) {
    accounts = db.prepare(`
      SELECT ta.*, e.entity_name, e.jurisdiction
      FROM treasury_accounts ta JOIN entities e ON ta.entity_id = e.id
      WHERE ta.entity_id = ? ORDER BY ta.created_at DESC
    `).all(entityId);
  } else {
    accounts = db.prepare(`
      SELECT ta.*, e.entity_name, e.jurisdiction
      FROM treasury_accounts ta JOIN entities e ON ta.entity_id = e.id
      ORDER BY ta.created_at DESC
    `).all();
  }
  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { entity_id, account_type, provider, account_name, address, network, signature_threshold } = body;

  try {
    db.prepare(`
      INSERT INTO treasury_accounts (id, entity_id, account_type, provider, account_name, address, network, signature_threshold, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'setup')
    `).run(id, entity_id, account_type, provider, account_name || null, address || null, network || null, signature_threshold || null);

    // Update workflow step 4 if treasury
    const entity = db.prepare('SELECT client_id FROM entities WHERE id = ?').get(entity_id) as { client_id: string } | undefined;
    if (entity) {
      db.prepare(`
        UPDATE workflows SET status = 'in_progress', started_at = datetime('now')
        WHERE client_id = ? AND step_number = 4 AND status = 'pending'
      `).run(entity.client_id);
    }

    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
