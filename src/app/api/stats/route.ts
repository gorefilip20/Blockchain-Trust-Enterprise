import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();

  const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
  const activeClients = db.prepare("SELECT COUNT(*) as count FROM clients WHERE status IN ('active', 'onboarding')").get() as { count: number };
  const totalEntities = db.prepare('SELECT COUNT(*) as count FROM entities').get() as { count: number };
  const activeEntities = db.prepare("SELECT COUNT(*) as count FROM entities WHERE status = 'active'").get() as { count: number };
  const totalPartners = db.prepare("SELECT COUNT(*) as count FROM partners WHERE status != 'inactive'").get() as { count: number };
  const totalTreasury = db.prepare('SELECT COUNT(*) as count FROM treasury_accounts').get() as { count: number };

  const clientsByType = db.prepare(`
    SELECT client_type, COUNT(*) as count FROM clients GROUP BY client_type
  `).all();

  const clientsByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM clients GROUP BY status
  `).all();

  const entitiesByJurisdiction = db.prepare(`
    SELECT jurisdiction, COUNT(*) as count FROM entities GROUP BY jurisdiction
  `).all();

  const workflowProgress = db.prepare(`
    SELECT step_name, 
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      COUNT(*) as total
    FROM workflows GROUP BY step_number, step_name ORDER BY step_number
  `).all();

  const recentActivity = db.prepare(`
    SELECT 'client' as type, first_name || ' ' || last_name as description, created_at
    FROM clients ORDER BY created_at DESC LIMIT 5
  `).all();

  // Total treasury value
  const totalTreasuryValue = db.prepare(
    'SELECT COALESCE(SUM(balance_usd), 0) as total FROM treasury_accounts'
  ).get() as { total: number };

  return NextResponse.json({
    totalClients: totalClients.count,
    activeClients: activeClients.count,
    totalEntities: totalEntities.count,
    activeEntities: activeEntities.count,
    totalPartners: totalPartners.count,
    totalTreasuryAccounts: totalTreasury.count,
    totalTreasuryValue: totalTreasuryValue.total,
    clientsByType,
    clientsByStatus,
    entitiesByJurisdiction,
    workflowProgress,
    recentActivity,
  });
}
