import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { adminId: string; username: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const campaigns = db.prepare('SELECT * FROM email_campaigns ORDER BY created_at DESC').all();
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, subject, body_preview, target_audience, status, scheduled_at } = await req.json();
  if (!name || !subject) return NextResponse.json({ error: 'Name and subject required' }, { status: 400 });
  const db = getDb();
  const id = uuidv4();
  db.prepare('INSERT INTO email_campaigns (id, name, subject, body_preview, target_audience, status, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, name, subject, body_preview || '', target_audience || 'all_users', status || 'draft', scheduled_at || null);
  return NextResponse.json({ success: true, id });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, name, subject, body_preview, target_audience, status, scheduled_at } = await req.json();
  if (!id) return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
  const db = getDb();
  db.prepare('UPDATE email_campaigns SET name = COALESCE(?, name), subject = COALESCE(?, subject), body_preview = COALESCE(?, body_preview), target_audience = COALESCE(?, target_audience), status = COALESCE(?, status), scheduled_at = COALESCE(?, scheduled_at), updated_at = datetime(\'now\') WHERE id = ?').run(name, subject, body_preview, target_audience, status, scheduled_at, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM email_campaigns WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
