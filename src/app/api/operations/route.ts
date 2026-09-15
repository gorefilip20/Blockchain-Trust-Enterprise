import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.RESEND_FROM || 'Blockchain Trust <onboarding@resend.dev>', to: [to], subject, html }) });
    return response.ok;
  } catch { return false; }
}
function admin(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET) as Record<string, unknown>;
    if (!decoded.adminId && !decoded.role) return false;
    return true;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.action) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    const db = getDb();
    if (body.action === 'register') {
      const { fullName, email, password, paymentReference } = body;
      if (!fullName || !email || !password || password.length < 8) return NextResponse.json({ error: 'Full name, email, and an 8-character password are required.' }, { status: 400 });
      const existing = db.prepare('SELECT id FROM app_users WHERE email = ?').get(String(email).toLowerCase());
      if (existing) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
      const id = uuidv4();
      const hash = bcrypt.hashSync(password, 10);
      const verificationToken = uuidv4();
      db.prepare('INSERT INTO app_users (id, full_name, email, password_hash, verification_token) VALUES (?, ?, ?, ?, ?)').run(id, fullName, String(email).toLowerCase(), hash, verificationToken);
      if (paymentReference) { try { db.prepare('UPDATE app_users SET registration_fee_reference = ? WHERE id = ?').run(paymentReference, id); } catch {} }
      const notifStmt = db.prepare('INSERT OR IGNORE INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
      notifStmt.run(uuidv4(), id, 'system', 'Welcome to BTE', 'Your BTE account has been created successfully. Open your dashboard to review the $150 registration payment instructions and submit your transaction hash when ready.', 0, new Date().toISOString());
      if (paymentReference) {
        const txId = uuidv4();
        db.prepare('INSERT INTO user_transactions (id, user_id, type, amount, description, payment_reference, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(txId, id, 'registration_fee', 150, 'Account registration fee', paymentReference, 'pending');
      }
      const token = jwt.sign({ userId: id, email: String(email).toLowerCase(), name: fullName }, JWT_SECRET, { expiresIn: '30d' });
      const verifyUrl = `${APP_URL}/account?verify=${verificationToken}`;
      const emailSent = await sendEmail(String(email).toLowerCase(), 'Verify your BTE email', `<p>Welcome to Blockchain Trust Enterprise, ${fullName}.</p><p>Confirm your email address to keep your account details current.</p><p><a href="${verifyUrl}">Verify my email</a></p>`);
      const response = NextResponse.json({ success: true, token, emailSent, user: { id, fullName, email: String(email).toLowerCase() }, registrationFee: { amount: 150, status: 'awaiting_payment' } }, { status: 201 });
      response.cookies.set('bte-session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' });
      return response;
    }
    if (body.action === 'verify-email') {
      const account = db.prepare('SELECT id FROM app_users WHERE verification_token = ?').get(body.token) as { id: string } | undefined;
      if (!account) return NextResponse.json({ error: 'This verification link is invalid or has already been used.' }, { status: 400 });
      db.prepare('UPDATE app_users SET email_verified = 1, verification_token = NULL WHERE id = ?').run(account.id);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'forgot-password') {
      const email = String(body.email || '').toLowerCase();
      const account = db.prepare('SELECT id, full_name, email FROM app_users WHERE email = ?').get(email) as { id: string; full_name: string; email: string } | undefined;
      if (account) {
        const token = uuidv4(); db.prepare("UPDATE app_users SET reset_token = ?, reset_expires_at = datetime('now', '+1 hour') WHERE id = ?").run(token, account.id);
        const emailSent = await sendEmail(account.email, 'Reset your BTE password', `<p>Hi ${account.full_name},</p><p><a href="${APP_URL}/account?reset=${token}">Reset your password</a></p><p>This link expires in one hour.</p>`);
        if (!emailSent && process.env.NODE_ENV === 'production') {
          console.error('[BTE] Password reset email was not sent. Configure RESEND_API_KEY and RESEND_FROM on the host.');
        }
        return NextResponse.json({ success: true, emailSent, message: emailSent ? 'A password reset email has been sent. Check your inbox and spam folder.' : 'Your reset request was recorded, but email delivery is not configured yet. Please contact support or configure the email provider.' });
      }
      return NextResponse.json({ success: true, emailSent: false, message: 'If an account exists for that email, a reset email will be sent.' });
    }
    if (body.action === 'reset-password') {
      if (!body.token || !body.password || String(body.password).length < 8) return NextResponse.json({ error: 'A valid reset link and password of at least 8 characters are required.' }, { status: 400 });
      const account = db.prepare("SELECT id FROM app_users WHERE reset_token = ? AND reset_expires_at > datetime('now')").get(body.token) as { id: string } | undefined;
      if (!account) return NextResponse.json({ error: 'This reset link is invalid or expired.' }, { status: 400 });
      db.prepare('UPDATE app_users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?').run(bcrypt.hashSync(body.password, 10), account.id);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'login') {
      const { email, password } = body;
      const user = db.prepare('SELECT * FROM app_users WHERE email = ?').get(String(email || '').toLowerCase()) as { id: string; full_name: string; email: string; password_hash: string; status: string } | undefined;
      if (!user || !bcrypt.compareSync(password || '', user.password_hash)) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      db.prepare("UPDATE app_users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);
      const token = jwt.sign({ userId: user.id, email: user.email, name: user.full_name }, JWT_SECRET, { expiresIn: '30d' });
      const response = NextResponse.json({ success: true, token, user: { id: user.id, fullName: user.full_name, email: user.email } });
      response.cookies.set('bte-session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' });
      return response;
    }
    if (body.action === 'message') {
      const { userId, userName, userEmail, category = 'Guidance', subject = 'BTE guidance request', message } = body;
      if (!userName || !userEmail || !message) return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
      const id = uuidv4();
      db.prepare('INSERT INTO admin_messages (id, user_id, user_name, user_email, category, subject, body) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, userId || null, userName, userEmail, category, subject, message);
      return NextResponse.json({ success: true, messageId: id }, { status: 201 });
    }
    return NextResponse.json({ error: 'Unsupported operation.' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Operations API error:', msg, err);
    return NextResponse.json({ error: `Registration failed: ${msg}` }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const db = getDb();
  const users = db.prepare('SELECT COUNT(*) as count FROM app_users').get() as { count: number };
  const openMessages = db.prepare("SELECT COUNT(*) as count FROM admin_messages WHERE status IN ('open','in_progress')").get() as { count: number };
  const strategies = db.prepare("SELECT * FROM copy_strategies WHERE status != 'archived' ORDER BY created_at DESC").all();
  const messages = db.prepare('SELECT * FROM admin_messages ORDER BY created_at DESC LIMIT 50').all();
  return NextResponse.json({ users: users.count, openMessages: openMessages.count, strategies, messages });
}

export async function PATCH(req: NextRequest) {
  try {
    if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    const db = getDb();
    if (body.type === 'message') {
      if (body.reply) {
        db.prepare("UPDATE admin_messages SET admin_reply = ?, admin_reply_at = datetime('now'), status = ?, assigned_to = ?, updated_at = datetime('now') WHERE id = ?").run(body.reply, body.status || 'resolved', body.assignedTo || null, body.id);
      } else {
        db.prepare("UPDATE admin_messages SET status = ?, assigned_to = ?, updated_at = datetime('now') WHERE id = ?").run(body.status, body.assignedTo || null, body.id);
      }
    }
    if (body.type === 'strategy') db.prepare("UPDATE copy_strategies SET name = ?, risk_level = ?, status = ?, description = ?, updated_at = datetime('now') WHERE id = ?").run(body.name, body.riskLevel, body.status, body.description, body.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Operations PATCH error:', err);
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 500 });
  }
}
