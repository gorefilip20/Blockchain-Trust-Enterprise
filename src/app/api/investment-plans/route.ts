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

export async function GET() {
  const db = getDb();
  const plans = db.prepare("SELECT * FROM investment_plans WHERE status = 'active' ORDER BY amount_usd ASC").all();
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { planId } = await req.json();
  if (!planId) return NextResponse.json({ error: 'Plan ID is required.' }, { status: 400 });

  const db = getDb();
  const plan = db.prepare("SELECT * FROM investment_plans WHERE id = ? AND status = 'active'").get(planId) as {
    id: string; amount_usd: number; min_return_pct: number; max_return_pct: number; duration_months: number;
  } | undefined;
  if (!plan) return NextResponse.json({ error: 'Investment plan not found or unavailable.' }, { status: 404 });

  const existing = db.prepare("SELECT id FROM user_investments WHERE user_id = ? AND plan_id = ? AND status IN ('pending','active')").get(user.userId, planId);
  if (existing) return NextResponse.json({ error: 'You already have an active subscription to this plan.' }, { status: 409 });

  const projectedReturn = +(plan.min_return_pct + (plan.max_return_pct - plan.min_return_pct) * 0.5).toFixed(1);
  const id = uuidv4();
  const now = new Date();
  const maturesAt = new Date(now);
  maturesAt.setMonth(maturesAt.getMonth() + plan.duration_months);

  db.prepare(
    'INSERT INTO user_investments (id, user_id, user_name, user_email, plan_id, amount_usd, projected_return_pct, current_value, status, started_at, matures_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, user.userId, user.name, user.email, planId, plan.amount_usd, projectedReturn, plan.amount_usd, 'pending', now.toISOString(), maturesAt.toISOString());

  return NextResponse.json({ success: true, investmentId: id, message: 'Investment plan subscription created. Our team will review and activate your portfolio.' }, { status: 201 });
}
