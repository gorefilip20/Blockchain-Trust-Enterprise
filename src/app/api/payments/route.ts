import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const clientId = req.nextUrl.searchParams.get('client_id');

  let payments;
  if (clientId) {
    payments = db.prepare(`
      SELECT p.*, c.first_name || ' ' || c.last_name as client_name
      FROM payments p
      LEFT JOIN clients c ON c.id = p.client_id
      WHERE p.client_id = ?
      ORDER BY p.created_at DESC
    `).all(clientId);
  } else {
    payments = db.prepare(`
      SELECT p.*, c.first_name || ' ' || c.last_name as client_name
      FROM payments p
      LEFT JOIN clients c ON c.id = p.client_id
      ORDER BY p.created_at DESC
    `).all();
  }

  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  const {
    client_id,
    target_network,
    submitted_tx_hash,
    assigned_destination_wallet,
    expected_amount_usd,
  } = body;

  if (!client_id || !target_network || !assigned_destination_wallet || !expected_amount_usd) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const id = uuidv4();

  db.prepare(`
    INSERT INTO payments (id, client_id, target_network, submitted_tx_hash, assigned_destination_wallet, expected_amount_usd, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    client_id,
    target_network,
    submitted_tx_hash || null,
    assigned_destination_wallet,
    expected_amount_usd,
    submitted_tx_hash ? 'processing_verification' : 'pending'
  );

  return NextResponse.json({ id, status: 'created' });
}

export async function PUT(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { id, submitted_tx_hash, status } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
  }

  if (submitted_tx_hash) {
    db.prepare(
      "UPDATE payments SET submitted_tx_hash = ?, status = 'processing_verification', processing_stage = 'unprocessed', rpc_retry_attempts = 0 WHERE id = ?"
    ).run(submitted_tx_hash, id);
  }

  if (status) {
    db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, id);
  }

  return NextResponse.json({ success: true });
}
