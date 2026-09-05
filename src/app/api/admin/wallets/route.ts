import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';
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

export async function GET(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const db = getDb();
  const wallets = db.prepare('SELECT * FROM administrative_wallets WHERE is_active = 1').all();
  return NextResponse.json(wallets);
}

export async function POST(req: NextRequest) {
  if (!admin(req)) return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  const { network, walletAddress } = await req.json();

  if (!network || !walletAddress) {
    return NextResponse.json({ error: 'Network and wallet address required' }, { status: 400 });
  }

  if (!['BEP20', 'TRC20', 'ERC20'].includes(network)) {
    return NextResponse.json({ error: 'Invalid network type' }, { status: 400 });
  }

  if (network === 'TRC20' && !walletAddress.startsWith('T')) {
    return NextResponse.json({ error: 'Invalid TRC20 address format' }, { status: 400 });
  }
  if ((network === 'BEP20' || network === 'ERC20') && !walletAddress.startsWith('0x')) {
    return NextResponse.json({ error: `Invalid ${network} address format` }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM administrative_wallets WHERE blockchain_network = ?').get(network) as { id: string } | undefined;

  if (existing) {
    db.prepare('UPDATE administrative_wallets SET receiving_address = ?, updated_at = datetime(\'now\') WHERE blockchain_network = ?')
      .run(walletAddress, network);
  } else {
    db.prepare('INSERT INTO administrative_wallets (id, blockchain_network, receiving_address) VALUES (?, ?, ?)')
      .run(uuidv4(), network, walletAddress);
  }

  return NextResponse.json({ success: true });
}
