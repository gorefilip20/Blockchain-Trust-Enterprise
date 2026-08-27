import { NextRequest, NextResponse } from 'next/server';

const fallback = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 108492, price_change_percentage_24h: 2.05, total_volume: 38400000000, last_updated: null, source: 'demo_fallback' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3942.18, price_change_percentage_24h: 2.5, total_volume: 17900000000, last_updated: null, source: 'demo_fallback' },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 182.44, price_change_percentage_24h: 1.72, total_volume: 3200000000, last_updated: null, source: 'demo_fallback' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.21, price_change_percentage_24h: -1.18, total_volume: 850000000, last_updated: null, source: 'demo_fallback' },
  { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', current_price: 0.000014, price_change_percentage_24h: 0.84, total_volume: 280000000, last_updated: null, source: 'demo_fallback' },
  { id: 'xrp', symbol: 'xrp', name: 'XRP', current_price: 2.41, price_change_percentage_24h: 3.1, total_volume: 1900000000, last_updated: null, source: 'demo_fallback' },
];

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids') || 'bitcoin,ethereum,solana,dogecoin,shiba-inu,xrp';
  const currency = (req.nextUrl.searchParams.get('vs_currency') || 'usd').toLowerCase();
  try {
    const headers: HeadersInit = { Accept: 'application/json' };
    if (process.env.COINGECKO_API_KEY) headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(currency)}&ids=${encodeURIComponent(ids)}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`, { headers, next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    const data = await response.json();
    return NextResponse.json({ currency, source: 'coingecko', fetchedAt: new Date().toISOString(), stale: false, quotes: data });
  } catch {
    return NextResponse.json({ currency, source: 'demo_fallback', fetchedAt: new Date().toISOString(), stale: true, providerMessage: 'Live provider unavailable; showing clearly labeled demo values.', quotes: fallback.filter((quote) => ids.split(',').includes(quote.id)) });
  }
}
