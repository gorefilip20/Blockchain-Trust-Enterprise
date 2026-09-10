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
    const wallets = db.prepare('SELECT blockchain_network, receiving_address FROM administrative_wallets WHERE is_active = 1').all();

    return NextResponse.json({
      profile,
      balance: balance || { available_balance: 0, total_deposited: 0, total_withdrawn: 0, interest_earned: 0 },
      transactions,
      investments,
      notifications,
      wallets,
    });
  }

  return NextResponse.json({ error: 'Invalid section.' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  try {
    const { action, transactionHash, network, notes } = await req.json();

    if (action === 'submit-payment') {
      if (!transactionHash || !transactionHash.trim()) {
        return NextResponse.json({ error: 'Transaction hash is required.' }, { status: 400 });
      }

      const db = getDb();
      const id = uuidv4();

      db.prepare(
        `INSERT INTO user_transactions (id, user_id, type, amount, description, payment_reference, network, status)
         VALUES (?, ?, 'registration_fee', 150, 'Registration fee payment', ?, ?, 'pending')`
      ).run(id, user.userId, transactionHash.trim(), network || 'Unknown');

      db.prepare(
        `UPDATE app_users SET registration_fee_reference = ? WHERE id = ?`
      ).run(transactionHash.trim(), user.userId);

      db.prepare(
        `INSERT INTO admin_messages (id, user_id, user_name, user_email, category, subject, body)
         VALUES (?, ?, ?, ?, 'Payment Verification', 'Registration Fee - Transaction Submitted', ?)`
      ).run(
        uuidv4(),
        user.userId,
        user.name || 'User',
        user.email,
        `User submitted registration fee payment.\n\nTransaction Hash: ${transactionHash.trim()}\nNetwork: ${network || 'Not specified'}\nNotes: ${notes || 'None'}`
      );

      return NextResponse.json({ success: true, transactionId: id }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
