import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function isAdmin(req: NextRequest) {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET) as { adminId?: string; role?: string };
    return Boolean(decoded.adminId || decoded.role);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });

  const db = getDb();
  const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
  const activeClients = db.prepare("SELECT COUNT(*) as count FROM clients WHERE status IN ('active', 'onboarding')").get() as { count: number };
  const totalEntities = db.prepare('SELECT COUNT(*) as count FROM entities').get() as { count: number };
  const activeEntities = db.prepare("SELECT COUNT(*) as count FROM entities WHERE status = 'active'").get() as { count: number };
  const totalPartners = db.prepare("SELECT COUNT(*) as count FROM partners WHERE status != 'inactive'").get() as { count: number };
  const totalTreasury = db.prepare('SELECT COUNT(*) as count FROM treasury_accounts').get() as { count: number };
  const totalDocuments = db.prepare('SELECT COUNT(*) as count FROM documents').get() as { count: number };
  const totalVaults = db.prepare('SELECT COUNT(*) as count FROM web3_vaults').get() as { count: number };
  const parentEntities = db.prepare("SELECT COUNT(*) as count FROM entities WHERE tier_type = 'parent'").get() as { count: number };
  const subsidiaryEntities = db.prepare("SELECT COUNT(*) as count FROM entities WHERE tier_type = 'subsidiary'").get() as { count: number };
  const clientsByType = db.prepare('SELECT client_type, COUNT(*) as count FROM clients GROUP BY client_type').all();
  const clientsByStatus = db.prepare('SELECT status, COUNT(*) as count FROM clients GROUP BY status').all();
  const entitiesByJurisdiction = db.prepare('SELECT jurisdiction, COUNT(*) as count FROM entities GROUP BY jurisdiction').all();
  const entitiesByTier = db.prepare('SELECT tier_type, COUNT(*) as count FROM entities GROUP BY tier_type').all();
  const workflowProgress = db.prepare(`
    SELECT step_name,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      COUNT(*) as total
    FROM workflows GROUP BY step_number, step_name ORDER BY step_number
  `).all();
  const recentActivity = db.prepare(`
    SELECT 'client' as type, 'New client: ' || first_name || ' ' || last_name as description, created_at FROM clients
    UNION ALL SELECT 'entity' as type, 'Entity formed: ' || entity_name as description, created_at FROM entities
    UNION ALL SELECT 'document' as type, 'Document: ' || name as description, created_at FROM documents
    ORDER BY created_at DESC LIMIT 10
  `).all();
  const totalTreasuryValue = db.prepare('SELECT COALESCE(SUM(balance_usd), 0) as total FROM treasury_accounts').get() as { total: number };
  const documentsByStatus = db.prepare('SELECT status, COUNT(*) as count FROM documents GROUP BY status').all();
  const totalPayments = db.prepare('SELECT COUNT(*) as count FROM payments').get() as { count: number };
  const pendingPayments = db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'processing_verification'").get() as { count: number };
  const confirmedPayments = db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'confirmed_active'").get() as { count: number };
  const paymentsByNetwork = db.prepare('SELECT target_network, COUNT(*) as count FROM payments GROUP BY target_network').all();

  return NextResponse.json({
    totalClients: totalClients.count,
    activeClients: activeClients.count,
    totalEntities: totalEntities.count,
    activeEntities: activeEntities.count,
    totalPartners: totalPartners.count,
    totalTreasuryAccounts: totalTreasury.count,
    totalTreasuryValue: totalTreasuryValue.total,
    totalDocuments: totalDocuments.count,
    totalVaults: totalVaults.count,
    parentEntities: parentEntities.count,
    subsidiaryEntities: subsidiaryEntities.count,
    clientsByType,
    clientsByStatus,
    entitiesByJurisdiction,
    entitiesByTier,
    workflowProgress,
    recentActivity,
    documentsByStatus,
    totalPayments: totalPayments.count,
    pendingPayments: pendingPayments.count,
    confirmedPayments: confirmedPayments.count,
    paymentsByNetwork,
  });
}
