import { NextResponse } from 'next/server';
import { processPendingPayments } from '@/lib/verify-payments';

export async function POST() {
  const results = await processPendingPayments();
  return NextResponse.json(results);
}
