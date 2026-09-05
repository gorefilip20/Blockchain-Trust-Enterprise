import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const db = getDb();
  const admin = db.prepare('SELECT id, username, password_hash, role FROM platform_administrators WHERE username = ?').get(email) as { id: string; username: string; password_hash: string; role: string } | undefined;

  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ adminId: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
  return NextResponse.json({ success: true, token, user: { email: admin.username, name: admin.username } });
}
