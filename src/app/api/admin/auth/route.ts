import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }

  const db = getDb();
  const admin = db.prepare('SELECT * FROM platform_administrators WHERE username = ?').get(username) as {
    id: string;
    username: string;
    password_hash: string;
    role: string;
  } | undefined;

  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { adminId: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return NextResponse.json({ token, username: admin.username, role: admin.role });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET) as { adminId: string; username: string; role: string };
    return NextResponse.json({ authenticated: true, username: payload.username, role: payload.role });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
