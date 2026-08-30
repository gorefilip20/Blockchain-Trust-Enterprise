import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

interface UserPayload { userId: string; email: string; name: string }

function getUser(req: NextRequest): UserPayload | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try { return jwt.verify(header.slice(7), JWT_SECRET) as UserPayload; } catch { return null; }
}

function admin(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  try { jwt.verify(header.slice(7), JWT_SECRET); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  const db = getDb();
  const section = req.nextUrl.searchParams.get('section');

  if (section === 'admin') {
    if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
    const mentors = db.prepare('SELECT * FROM mentors ORDER BY created_at DESC').all();
    const applications = db.prepare('SELECT * FROM mentor_applications ORDER BY applied_at DESC').all();
    const strategies = db.prepare('SELECT * FROM trading_strategies ORDER BY created_at DESC').all();
    const stats = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM mentors) as total_mentors,
        (SELECT COUNT(*) FROM mentors WHERE status = 'active') as active_mentors,
        (SELECT COUNT(*) FROM mentors WHERE status = 'pending') as pending_mentors,
        (SELECT SUM(fee_amount) FROM mentors WHERE fee_paid = 1) as total_fees_collected,
        (SELECT COUNT(*) FROM trading_strategies) as total_strategies
    `).get();
    return NextResponse.json({ mentors, applications, strategies, stats });
  }

  const strategies = db.prepare("SELECT * FROM trading_strategies WHERE status = 'active' ORDER BY created_at DESC").all();
  const mentors = db.prepare("SELECT id, name, specialty, bio, experience_years, markets, telegram_handle, total_students, rating FROM mentors WHERE status = 'active' ORDER BY rating DESC").all();
  return NextResponse.json({ strategies, mentors });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  if (body.action === 'apply-mentor') {
    const { name, email, specialty, bio, experienceYears, markets, telegramHandle } = body;
    if (!name || !email || !specialty || !bio) {
      return NextResponse.json({ error: 'Name, email, specialty, and bio are required.' }, { status: 400 });
    }
    const existing = db.prepare('SELECT id FROM mentors WHERE email = ?').get(String(email).toLowerCase());
    if (existing) return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 });

    const mentorId = uuidv4();
    const appId = uuidv4();
    db.prepare(
      'INSERT INTO mentors (id, name, email, specialty, bio, experience_years, markets, telegram_handle) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(mentorId, name, String(email).toLowerCase(), specialty, bio, experienceYears || 1, markets || 'Stocks', telegramHandle || null);

    const user = getUser(req);
    db.prepare(
      'INSERT INTO mentor_applications (id, mentor_id, user_id, user_name, user_email) VALUES (?, ?, ?, ?, ?)'
    ).run(appId, mentorId, user?.userId || null, name, String(email).toLowerCase());

    return NextResponse.json({
      success: true, mentorId, applicationId: appId,
      message: 'Mentor application submitted. Please complete the $150 registration fee payment to activate your account. Contact admin via Telegram for payment instructions.',
    }, { status: 201 });
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const body = await req.json();
  const db = getDb();

  if (body.type === 'mentor') {
    const updates: string[] = [];
    const params: (string | number)[] = [];
    if (body.status) { updates.push('status = ?'); params.push(body.status); }
    if (body.fee_paid !== undefined) { updates.push('fee_paid = ?'); params.push(body.fee_paid ? 1 : 0); }
    updates.push("updated_at = datetime('now')");
    params.push(body.id);
    db.prepare(`UPDATE mentors SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    return NextResponse.json({ success: true });
  }

  if (body.type === 'application') {
    db.prepare("UPDATE mentor_applications SET payment_status = ?, payment_reference = ?, approved_at = datetime('now') WHERE id = ?")
      .run(body.payment_status, body.payment_reference || null, body.id);
    return NextResponse.json({ success: true });
  }

  if (body.type === 'strategy') {
    db.prepare("UPDATE trading_strategies SET status = ? WHERE id = ?").run(body.status, body.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid update type.' }, { status: 400 });
}
