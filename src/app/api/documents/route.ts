import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');

  if (clientId) {
    const docs = db.prepare(
      'SELECT * FROM documents WHERE client_id = ? ORDER BY created_at DESC'
    ).all(clientId);
    return NextResponse.json(docs);
  }

  const all = db.prepare(`
    SELECT d.*, c.first_name || ' ' || c.last_name as client_name
    FROM documents d JOIN clients c ON d.client_id = c.id
    ORDER BY d.created_at DESC
  `).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { client_id, entity_id, doc_type, name, file_path } = body;

  try {
    db.prepare(`
      INSERT INTO documents (id, client_id, entity_id, doc_type, name, file_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, client_id, entity_id || null, doc_type, name, file_path || null);

    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
