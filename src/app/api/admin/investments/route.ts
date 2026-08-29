import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';
function admin(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  try { jwt.verify(header.slice(7), JWT_SECRET); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const db = getDb();
  const investments = db.prepare(`
    SELECT ui.*, ip.name as plan_name, ip.tier, ip.min_return_pct, ip.max_return_pct, ip.risk_level
    FROM user_investments ui JOIN investment_plans ip ON ui.plan_id = ip.id
    ORDER BY ui.created_at DESC
  `).all();
  const plans = db.prepare('SELECT * FROM investment_plans ORDER BY amount_usd ASC').all();
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_investments,
      SUM(CASE WHEN ui.status = 'active' THEN 1 ELSE 0 END) as active_count,
      SUM(CASE WHEN ui.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
      SUM(ui.amount_usd) as total_aum,
      AVG(ui.actual_return_pct) as avg_return
    FROM user_investments ui
  `).get();
  return NextResponse.json({ investments, plans, stats });
}

export async function PATCH(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const body = await req.json();
  const db = getDb();

  if (body.type === 'investment') {
    const updates: string[] = [];
    const params: (string | number)[] = [];
    if (body.status) { updates.push("status = ?"); params.push(body.status); }
    if (body.actual_return_pct !== undefined) { updates.push("actual_return_pct = ?"); params.push(body.actual_return_pct); }
    if (body.current_value !== undefined) { updates.push("current_value = ?"); params.push(body.current_value); }
    if (body.status === 'active' && !body.started_at) { updates.push("started_at = datetime('now')"); }
    updates.push("updated_at = datetime('now')");
    params.push(body.id);
    db.prepare(`UPDATE user_investments SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    return NextResponse.json({ success: true });
  }

  if (body.type === 'plan') {
    db.prepare("UPDATE investment_plans SET status = ?, updated_at = datetime('now') WHERE id = ?").run(body.status, body.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid update type.' }, { status: 400 });
}
