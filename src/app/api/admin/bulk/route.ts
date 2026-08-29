import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function verifyAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  try { jwt.verify(authHeader.slice(7), JWT_SECRET); return true; } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, ids, action } = await req.json();

  if (!type || !ids || !Array.isArray(ids) || ids.length === 0 || !action) {
    return NextResponse.json({ error: 'type, ids (non-empty array), and action are required' }, { status: 400 });
  }

  const db = getDb();
  let successCount = 0;
  let failCount = 0;

  const validActions: Record<string, string[]> = {
    messages: ['open', 'in_progress', 'resolved', 'archived'],
    strategies: ['draft', 'published', 'paused', 'archived'],
    clients: ['lead', 'onboarding', 'active', 'inactive'],
  };

  if (!validActions[type]) {
    return NextResponse.json({ error: `Invalid type: ${type}. Must be messages, strategies, or clients` }, { status: 400 });
  }

  if (!validActions[type].includes(action)) {
    return NextResponse.json({ error: `Invalid action '${action}' for type '${type}'. Valid: ${validActions[type].join(', ')}` }, { status: 400 });
  }

  const tableMap: Record<string, string> = {
    messages: 'admin_messages',
    strategies: 'copy_strategies',
    clients: 'clients',
  };

  const table = tableMap[type];

  const txn = db.transaction(() => {
    for (const id of ids) {
      try {
        const result = db.prepare(`UPDATE ${table} SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(action, id);
        if (result.changes > 0) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }
  });

  txn();

  return NextResponse.json({
    success: true,
    type,
    action,
    total: ids.length,
    successCount,
    failCount,
  });
}
