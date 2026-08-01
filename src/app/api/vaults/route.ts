import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const entityId = searchParams.get('entity_id');

  let vaults;
  if (entityId) {
    vaults = db.prepare(`
      SELECT v.*, e.entity_name, e.jurisdiction
      FROM web3_vaults v JOIN entities e ON v.entity_id = e.id
      WHERE v.entity_id = ? ORDER BY v.created_at DESC
    `).all(entityId);
  } else {
    vaults = db.prepare(`
      SELECT v.*, e.entity_name, e.jurisdiction
      FROM web3_vaults v JOIN entities e ON v.entity_id = e.id
      ORDER BY v.created_at DESC
    `).all();
  }
  return NextResponse.json(vaults);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { entity_id, vault_address, network, network_id, required_signatures, total_signers } = body;

  try {
    db.prepare(`
      INSERT INTO web3_vaults (id, entity_id, vault_address, network, network_id, required_signatures, total_signers, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'deployed')
    `).run(
      id, entity_id,
      vault_address,
      network || 'ethereum',
      network_id || 1,
      required_signatures || 2,
      total_signers || 3
    );

    const entity = db.prepare('SELECT client_id FROM entities WHERE id = ?').get(entity_id) as { client_id: string } | undefined;
    if (entity) {
      db.prepare(`
        UPDATE workflows SET status = 'in_progress', started_at = datetime('now')
        WHERE client_id = ? AND step_number = 5 AND status = 'pending'
      `).run(entity.client_id);
    }

    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
