import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const partners = db.prepare('SELECT * FROM partners ORDER BY partner_type, name').all();
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { name, partner_type, description, website, contact_email, contact_phone, jurisdictions, specialties, integration_type, api_endpoint } = body;

  try {
    db.prepare(`
      INSERT INTO partners (id, name, partner_type, description, website, contact_email, contact_phone, jurisdictions, specialties, integration_type, api_endpoint)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, partner_type, description || null, website || null, contact_email || null, contact_phone || null,
      JSON.stringify(jurisdictions || []), JSON.stringify(specialties || []),
      integration_type || null, api_endpoint || null);

    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
