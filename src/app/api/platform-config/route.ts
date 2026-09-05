import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

const PUBLIC_KEYS = new Set([
  'hero_headline',
  'hero_subtitle',
  'workspace_mode',
  'show_bte_copilot',
  'show_recurring_investments',
  'show_market_alerts',
  'trust_message',
  'max_order_notional_demo',
]);

function asPublicConfig(rows: Array<{ key: string; value: string; value_type: string }>) {
  return Object.fromEntries(rows.filter((row) => PUBLIC_KEYS.has(row.key)).map((row) => {
    if (row.value_type === 'boolean') return [row.key, row.value === 'true'];
    if (row.value_type === 'number') return [row.key, Number(row.value)];
    try { return [row.key, row.value_type === 'json' ? JSON.parse(row.value) : row.value]; } catch { return [row.key, row.value]; }
  }));
}

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT key, value, value_type FROM platform_config ORDER BY key').all() as Array<{ key: string; value: string; value_type: string }>;
  return NextResponse.json(asPublicConfig(rows));
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as Record<string, unknown>;
    if (!decoded.adminId && !decoded.role) return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  } catch { return NextResponse.json({ error: 'Invalid admin session' }, { status: 401 }); }

  const body = await request.json().catch(() => null) as { key?: string; value?: unknown } | null;
  if (!body?.key || !PUBLIC_KEYS.has(body.key)) return NextResponse.json({ error: 'Unsupported configuration key' }, { status: 400 });

  const db = getDb();
  const current = db.prepare('SELECT value_type FROM platform_config WHERE key = ?').get(body.key) as { value_type: string } | undefined;
  if (!current) return NextResponse.json({ error: 'Configuration key not found' }, { status: 404 });

  let value = '';
  if (current.value_type === 'boolean') {
    if (typeof body.value !== 'boolean') return NextResponse.json({ error: 'Boolean value required' }, { status: 400 });
    value = body.value ? 'true' : 'false';
  } else if (current.value_type === 'number') {
    const numeric = Number(body.value);
    if (!Number.isFinite(numeric) || numeric < 0) return NextResponse.json({ error: 'Non-negative number required' }, { status: 400 });
    value = String(numeric);
  } else {
    value = typeof body.value === 'string' ? body.value.trim() : JSON.stringify(body.value);
    if (!value || value.length > 5000) return NextResponse.json({ error: 'Text value is required and must be under 5,000 characters' }, { status: 400 });
  }

  db.prepare("UPDATE platform_config SET value = ?, updated_at = datetime('now'), updated_by = ? WHERE key = ?").run(value, 'admin-session', body.key);
  return NextResponse.json({ success: true, key: body.key, value });
}
