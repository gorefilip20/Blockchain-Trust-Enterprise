import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const clients = db.prepare(`
    SELECT c.*,
      (SELECT COUNT(*) FROM entities WHERE client_id = c.id) as entity_count,
      (SELECT COUNT(*) FROM workflows WHERE client_id = c.id AND status = 'completed') as completed_steps,
      (SELECT COUNT(*) FROM workflows WHERE client_id = c.id) as total_steps
    FROM clients c ORDER BY c.created_at DESC
  `).all();
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { first_name, last_name, email, phone, client_type, notes, annual_revenue_usd, crypto_holdings_usd } = body;

  try {
    db.prepare(`
      INSERT INTO clients (id, first_name, last_name, email, phone, client_type, notes, annual_revenue_usd, crypto_holdings_usd)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, first_name, last_name, email, phone || null, client_type, notes || null, annual_revenue_usd || null, crypto_holdings_usd || null);

    const steps = [
      { num: 1, name: 'Intake, Profiling & Identity Masking' },
      { num: 2, name: 'Dual Legal State Filing & Operating Agreements' },
      { num: 3, name: 'Two-Tier IRS EIN Processing' },
      { num: 4, name: 'Corporate Treasury Banking & Exchange KYB' },
      { num: 5, name: 'Web3 Custody Deployment & Governance' },
      { num: 6, name: 'Sub-Ledger Sync & Tax Integration' },
    ];
    const insertWorkflow = db.prepare(
      'INSERT INTO workflows (id, client_id, step_number, step_name, status) VALUES (?, ?, ?, ?, ?)'
    );
    for (const step of steps) {
      insertWorkflow.run(uuidv4(), id, step.num, step.name, step.num === 1 ? 'in_progress' : 'pending');
    }

    db.prepare("UPDATE clients SET status = 'onboarding' WHERE id = ?").run(id);

    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
