import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@bte.com';
const ADMIN_PASSWORD = 'admin123';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return NextResponse.json({ success: true, token, user: { email, name: 'Admin' } });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
