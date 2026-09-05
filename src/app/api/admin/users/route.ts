import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function admin(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET) as Record<string, unknown>;
    if (!decoded.adminId && !decoded.role) return false;
    return true;
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const db = getDb();

  const userId = req.nextUrl.searchParams.get('userId');

  if (userId) {
    const user = db.prepare('SELECT id, full_name, email, status, registration_fee_paid, registration_fee_reference, created_at, last_login_at FROM app_users WHERE id = ?').get(userId);
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    const balance = db.prepare('SELECT * FROM user_balances WHERE user_id = ?').get(userId);
    const transactions = db.prepare('SELECT * FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(userId);
    const investments = db.prepare(`
      SELECT ui.*, ip.name as plan_name, ip.tier
      FROM user_investments ui
      JOIN investment_plans ip ON ui.plan_id = ip.id
      WHERE ui.user_id = ?
      ORDER BY ui.created_at DESC
    `).all(userId);
    return NextResponse.json({ user, balance: balance || { available_balance: 0, total_deposited: 0, total_withdrawn: 0, interest_earned: 0 }, transactions, investments });
  }

  const users = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.status, u.registration_fee_paid, u.created_at, u.last_login_at,
      COALESCE(b.available_balance, 0) as balance
    FROM app_users u
    LEFT JOIN user_balances b ON b.user_id = u.id
    ORDER BY u.created_at DESC
  `).all();

  const stats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM app_users) as total_users,
      (SELECT COUNT(*) FROM app_users WHERE registration_fee_paid = 1) as paid_users,
      (SELECT COUNT(*) FROM app_users WHERE registration_fee_paid = 0) as unpaid_users,
      (SELECT COALESCE(SUM(available_balance), 0) FROM user_balances) as total_balances,
      (SELECT COUNT(*) FROM user_transactions WHERE status = 'pending') as pending_transactions
  `).get();

  return NextResponse.json({ users, stats });
}

export async function POST(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const body = await req.json();
  const db = getDb();

  if (body.action === 'approve-registration-fee') {
    db.prepare("UPDATE app_users SET registration_fee_paid = 1, registration_fee_reference = ? WHERE id = ?")
      .run(body.paymentReference || 'Admin approved', body.userId);
    const notifId = uuidv4();
    db.prepare('INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(notifId, body.userId, 'payment_confirmed', 'Registration Fee Confirmed', 'Your $150 registration fee has been confirmed. Welcome to BTE!', 0, new Date().toISOString());
    return NextResponse.json({ success: true });
  }

  if (body.action === 'add-deposit') {
    const { userId, amount, description, paymentReference, network } = body;
    if (!userId || !amount || amount <= 0) return NextResponse.json({ error: 'User ID and positive amount required.' }, { status: 400 });
    const txId = uuidv4();
    db.prepare('INSERT INTO user_transactions (id, user_id, type, amount, description, payment_reference, network, status, approved_by, approved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(txId, userId, 'deposit', amount, description || 'Deposit', paymentReference || null, network || null, 'approved', 'admin', new Date().toISOString());

    const existing = db.prepare('SELECT * FROM user_balances WHERE user_id = ?').get(userId);
    if (existing) {
      db.prepare("UPDATE user_balances SET available_balance = available_balance + ?, total_deposited = total_deposited + ?, updated_at = datetime('now') WHERE user_id = ?")
        .run(amount, amount, userId);
    } else {
      db.prepare('INSERT INTO user_balances (id, user_id, available_balance, total_deposited) VALUES (?, ?, ?, ?)')
        .run(uuidv4(), userId, amount, amount);
    }

    const notifId = uuidv4();
    db.prepare('INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(notifId, userId, 'payment_confirmed', 'Deposit Confirmed', `Your deposit of $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} has been confirmed and added to your account.`, 0, new Date().toISOString());

    return NextResponse.json({ success: true, transactionId: txId });
  }

  if (body.action === 'add-interest') {
    const { userId, amount, description } = body;
    if (!userId || !amount || amount <= 0) return NextResponse.json({ error: 'User ID and positive amount required.' }, { status: 400 });
    const txId = uuidv4();
    db.prepare('INSERT INTO user_transactions (id, user_id, type, amount, description, status, approved_by, approved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(txId, userId, 'interest', amount, description || 'Interest earned', 'approved', 'admin', new Date().toISOString());

    const existing = db.prepare('SELECT * FROM user_balances WHERE user_id = ?').get(userId);
    if (existing) {
      db.prepare("UPDATE user_balances SET available_balance = available_balance + ?, interest_earned = interest_earned + ?, updated_at = datetime('now') WHERE user_id = ?")
        .run(amount, amount, userId);
    } else {
      db.prepare('INSERT INTO user_balances (id, user_id, available_balance, interest_earned) VALUES (?, ?, ?, ?)')
        .run(uuidv4(), userId, amount, amount);
    }

    const notifId = uuidv4();
    db.prepare('INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(notifId, userId, 'system', 'Interest Added', `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} interest has been credited to your account.`, 0, new Date().toISOString());

    return NextResponse.json({ success: true, transactionId: txId });
  }

  if (body.action === 'adjust-balance') {
    const { userId, newBalance, reason } = body;
    if (!userId || newBalance === undefined || newBalance < 0) return NextResponse.json({ error: 'User ID and valid balance required.' }, { status: 400 });

    const existing = db.prepare('SELECT * FROM user_balances WHERE user_id = ?').get(userId) as { available_balance: number } | undefined;
    const currentBalance = existing?.available_balance || 0;
    const diff = newBalance - currentBalance;

    if (diff !== 0) {
      const txId = uuidv4();
      db.prepare('INSERT INTO user_transactions (id, user_id, type, amount, description, status, approved_by, approved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(txId, userId, diff > 0 ? 'bonus' : 'withdrawal', Math.abs(diff), reason || `Admin balance adjustment`, 'approved', 'admin', new Date().toISOString());
    }

    if (existing) {
      db.prepare("UPDATE user_balances SET available_balance = ?, updated_at = datetime('now') WHERE user_id = ?")
        .run(newBalance, userId);
    } else {
      db.prepare('INSERT INTO user_balances (id, user_id, available_balance, total_deposited) VALUES (?, ?, ?, ?)')
        .run(uuidv4(), userId, newBalance, newBalance > 0 ? newBalance : 0);
    }

    if (diff !== 0) {
      const notifId = uuidv4();
      db.prepare('INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(notifId, userId, 'system', 'Account Updated', `Your account balance has been updated to $${Number(newBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}.`, 0, new Date().toISOString());
    }

    return NextResponse.json({ success: true });
  }

  if (body.action === 'approve-transaction') {
    const { transactionId } = body;
    const tx = db.prepare('SELECT * FROM user_transactions WHERE id = ?').get(transactionId) as { user_id: string; type: string; amount: number; status: string } | undefined;
    if (!tx) return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    if (tx.status !== 'pending') return NextResponse.json({ error: 'Transaction already processed.' }, { status: 400 });

    db.prepare("UPDATE user_transactions SET status = 'approved', approved_by = 'admin', approved_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(transactionId);

    if (tx.type === 'deposit') {
      const existing = db.prepare('SELECT * FROM user_balances WHERE user_id = ?').get(tx.user_id);
      if (existing) {
        db.prepare("UPDATE user_balances SET available_balance = available_balance + ?, total_deposited = total_deposited + ?, updated_at = datetime('now') WHERE user_id = ?")
          .run(tx.amount, tx.amount, tx.user_id);
      } else {
        db.prepare('INSERT INTO user_balances (id, user_id, available_balance, total_deposited) VALUES (?, ?, ?, ?)')
          .run(uuidv4(), tx.user_id, tx.amount, tx.amount);
      }
    }

    const notifId = uuidv4();
    db.prepare('INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(notifId, tx.user_id, 'payment_confirmed', 'Transaction Approved', `Your ${tx.type} of $${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been approved.`, 0, new Date().toISOString());

    return NextResponse.json({ success: true });
  }

  if (body.action === 'reject-transaction') {
    const { transactionId } = body;
    db.prepare("UPDATE user_transactions SET status = 'rejected', approved_by = 'admin', updated_at = datetime('now') WHERE id = ?").run(transactionId);
    const tx = db.prepare('SELECT user_id, type, amount FROM user_transactions WHERE id = ?').get(transactionId) as { user_id: string; type: string; amount: number } | undefined;
    if (tx) {
      db.prepare('INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(uuidv4(), tx.user_id, 'payment_rejected', 'Transaction Rejected', `Your ${tx.type} of $${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been rejected. Please contact support for details.`, 0, new Date().toISOString());
    }
    return NextResponse.json({ success: true });
  }

  if (body.action === 'update-status') {
    db.prepare("UPDATE app_users SET status = ? WHERE id = ?").run(body.status, body.userId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
}
