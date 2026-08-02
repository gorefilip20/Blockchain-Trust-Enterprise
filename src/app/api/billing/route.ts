import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const rule = db.prepare('SELECT * FROM billing_rules LIMIT 1').get() as {
    id: string;
    package_name: string;
    price_usd: number;
  } | undefined;

  return NextResponse.json(rule || { package_name: 'Dual-Entity Formation Package', price_usd: 499.00 });
}

export async function PUT(req: NextRequest) {
  const { price_usd } = await req.json();

  if (typeof price_usd !== 'number' || price_usd < 0) {
    return NextResponse.json({ error: 'Valid price required' }, { status: 400 });
  }

  const db = getDb();
  db.prepare('UPDATE billing_rules SET price_usd = ?, updated_at = datetime(\'now\') WHERE id = \'billing-default\'')
    .run(price_usd);

  return NextResponse.json({ success: true, price_usd });
}
