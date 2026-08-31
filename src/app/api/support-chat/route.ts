import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function admin(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  try { jwt.verify(header.slice(7), JWT_SECRET); return true; } catch { return false; }
}

interface UserPayload { userId: string; email: string; name: string }

function getUser(req: NextRequest): UserPayload | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try { return jwt.verify(header.slice(7), JWT_SECRET) as UserPayload; } catch { return null; }
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

  const user = getUser(req);
  const db = getDb();
  const id = uuidv4();

  db.prepare(
    'INSERT INTO admin_messages (id, user_id, user_name, user_email, category, subject, body) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    id,
    user?.userId || 'anonymous',
    user?.name || 'Live Chat Visitor',
    user?.email || 'anonymous@chat',
    'Live Chat',
    'Live chat support message',
    message
  );

  return NextResponse.json({ success: true, messageId: id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const db = getDb();
  const messages = db.prepare("SELECT * FROM admin_messages WHERE category = 'Live Chat' ORDER BY created_at DESC LIMIT 100").all();
  return NextResponse.json({ messages });
}
