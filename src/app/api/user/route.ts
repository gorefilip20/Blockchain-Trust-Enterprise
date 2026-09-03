import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

interface UserPayload { userId: string; email: string; name: string }

function getUser(req: NextRequest): UserPayload | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try { return jwt.verify(header.slice(7), JWT_SECRET) as UserPayload; } catch { return null; }
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const db = getDb();
  const section = req.nextUrl.searchParams.get('section');

  if (section === 'dashboard') {
    const profile = db.prepare('SELECT id, full_name, email, status, registration_fee_paid, created_at, last_login_at FROM app_users WHERE id = ?').get(user.userId) as Record<string, unknown> | undefined;
    if (!profile) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const balance = db.prepare('SELECT * FROM user_balances WHERE user_id = ?').get(user.userId) as Record<string, unknown> | undefined;
    const transactions = db.prepare('SELECT * FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(user.userId);
    const investments = db.prepare(`
      SELECT ui.*, ip.name as plan_name, ip.tier, ip.risk_level
      FROM user_investments ui
      JOIN investment_plans ip ON ui.plan_id = ip.id
      WHERE ui.user_id = ?
      ORDER BY ui.created_at DESC
    `).all(user.userId);
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(user.userId);

    return NextResponse.json({
      profile,
      balance: balance || { available_balance: 0, total_deposited: 0, total_withdrawn: 0, interest_earned: 0 },
      transactions,
      investments,
      notifications,
    });
  }

  return NextResponse.json({ error: 'Invalid section.' }, { status: 400 });
}
