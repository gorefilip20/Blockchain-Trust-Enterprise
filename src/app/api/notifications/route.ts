import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function getUserId(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { userId: string };
    return payload.userId || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const db = getDb();
  const notifications = db
    .prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50')
    .all(userId);

  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, type, title, message } = body;

  if (!user_id || !type || !title || !message) {
    return NextResponse.json(
      { error: 'user_id, type, title, and message are required.' },
      { status: 400 }
    );
  }

  const validTypes = ['price_alert', 'order_fill', 'document_ready', 'payment_confirmed', 'system'];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `type must be one of: ${validTypes.join(', ')}` },
      { status: 400 }
    );
  }

  const db = getDb();
  const id = uuidv4();
  db.prepare(
    'INSERT INTO notifications (id, user_id, type, title, message) VALUES (?, ?, ?, ?, ?)'
  ).run(id, user_id, type, title, message);

  return NextResponse.json({ success: true, id }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const body = await req.json();
  const db = getDb();

  if (body.markAllRead) {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(userId);
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(
      body.id,
      userId
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Provide id or markAllRead.' }, { status: 400 });
}
