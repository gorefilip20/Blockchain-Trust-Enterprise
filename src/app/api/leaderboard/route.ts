import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

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

type StrategyRow = {
  id: string;
  name: string;
  manager: string;
  risk_level: string;
  return_30d: string;
  max_drawdown: string;
  followers: number;
  status: string;
  description: string;
};

export async function GET(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });

  const db = getDb();
  const strategies = db.prepare("SELECT * FROM copy_strategies WHERE status != 'archived' ORDER BY followers DESC").all() as StrategyRow[];

  // Compute additional leaderboard metrics (demo/computed values)
  const leaderboard = strategies.map((strategy, index) => {
    const return30d = parseFloat(strategy.return_30d.replace('%', '').replace('+', ''));
    const drawdown = parseFloat(strategy.max_drawdown.replace('%', '').replace('+', ''));

    // Compute demo metrics based on existing data
    const return90d = +(return30d * 2.4 + (Math.random() * 4 - 2)).toFixed(1);
    const volatility = Math.abs(drawdown) * 1.3 + Math.random() * 2;
    const sharpeRatio = +(return30d / (volatility || 1)).toFixed(2);
    const aum = strategy.followers * (45000 + Math.floor(Math.random() * 25000));

    return {
      rank: index + 1,
      id: strategy.id,
      name: strategy.name,
      manager: strategy.manager,
      risk_level: strategy.risk_level,
      return_30d: strategy.return_30d,
      return_90d: `${return90d >= 0 ? '+' : ''}${return90d}%`,
      max_drawdown: strategy.max_drawdown,
      sharpe_ratio: sharpeRatio,
      followers: strategy.followers,
      aum,
      status: strategy.status,
      description: strategy.description,
    };
  });

  // Sort by 30D return descending by default
  leaderboard.sort((a, b) => {
    const aReturn = parseFloat(a.return_30d.replace('%', '').replace('+', ''));
    const bReturn = parseFloat(b.return_30d.replace('%', '').replace('+', ''));
    return bReturn - aReturn;
  });

  // Re-rank after sort
  leaderboard.forEach((entry, idx) => { entry.rank = idx + 1; });

  return NextResponse.json({ leaderboard });
}
