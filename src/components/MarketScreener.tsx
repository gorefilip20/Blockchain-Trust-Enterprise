'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown, Filter, Search, SlidersHorizontal } from 'lucide-react';

type Instrument = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  sector: string;
  assetClass: string;
};

const instruments: Instrument[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 228.45, change: 1.24, volume: '$8.2B', marketCap: '$3.5T', sector: 'Technology', assetClass: 'Equity' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 445.12, change: 0.87, volume: '$5.4B', marketCap: '$3.3T', sector: 'Technology', assetClass: 'Equity' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.93, change: -0.42, volume: '$4.1B', marketCap: '$2.2T', sector: 'Technology', assetClass: 'Equity' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 196.84, change: 1.68, volume: '$6.7B', marketCap: '$2.0T', sector: 'Consumer Cyclical', assetClass: 'Equity' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 182.06, change: -0.77, volume: '$21.6B', marketCap: '$4.5T', sector: 'Technology', assetClass: 'Equity' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 232.18, change: 0.53, volume: '$2.8B', marketCap: '$670B', sector: 'Financial', assetClass: 'Equity' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 164.32, change: -0.31, volume: '$1.9B', marketCap: '$395B', sector: 'Healthcare', assetClass: 'Equity' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 112.76, change: -1.15, volume: '$3.1B', marketCap: '$475B', sector: 'Energy', assetClass: 'Equity' },
  { symbol: 'BTC', name: 'Bitcoin / USD', price: 108492.00, change: 2.05, volume: '$38.4B', marketCap: '$2.1T', sector: 'Digital Asset', assetClass: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum / USD', price: 3942.18, change: 2.50, volume: '$17.9B', marketCap: '$474B', sector: 'Digital Asset', assetClass: 'Crypto' },
  { symbol: 'SOL', name: 'Solana / USD', price: 186.42, change: 4.12, volume: '$4.8B', marketCap: '$86B', sector: 'Digital Asset', assetClass: 'Crypto' },
  { symbol: 'XRP', name: 'XRP / USD', price: 2.34, change: -0.85, volume: '$3.2B', marketCap: '$134B', sector: 'Digital Asset', assetClass: 'Crypto' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 568.91, change: 0.31, volume: '$24.5B', marketCap: '$530B', sector: 'Broad Market', assetClass: 'ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 502.34, change: 0.62, volume: '$12.1B', marketCap: '$265B', sector: 'Technology', assetClass: 'ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', price: 238.62, change: -0.18, volume: '$2.4B', marketCap: '$72B', sector: 'Commodities', assetClass: 'ETF' },
  { symbol: 'EUR.USD', name: 'Euro / US Dollar', price: 1.1704, change: 0.18, volume: '$4.1T', marketCap: '--', sector: 'Major', assetClass: 'FX' },
  { symbol: 'GBP.USD', name: 'British Pound / US Dollar', price: 1.3412, change: 0.22, volume: '$2.8T', marketCap: '--', sector: 'Major', assetClass: 'FX' },
  { symbol: 'USD.JPY', name: 'US Dollar / Japanese Yen', price: 143.26, change: -0.34, volume: '$3.5T', marketCap: '--', sector: 'Major', assetClass: 'FX' },
];

type SortKey = 'symbol' | 'name' | 'price' | 'change' | 'sector';

export default function MarketScreener({ onNotify }: { onNotify: (message: string) => void }) {
  const [query, setQuery] = useState('');
  const [assetClass, setAssetClass] = useState('All');
  const [sector, setSector] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sectors = useMemo(() => ['All', ...Array.from(new Set(instruments.map((i) => i.sector))).sort()], []);
  const assetClasses = useMemo(() => ['All', ...Array.from(new Set(instruments.map((i) => i.assetClass))).sort()], []);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir(key === 'price' || key === 'change' ? 'desc' : 'asc');
    }
  }

  const filtered = useMemo(() => {
    let result = instruments.filter((i) => {
      if (query && !`${i.symbol} ${i.name}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (assetClass !== 'All' && i.assetClass !== assetClass) return false;
      if (sector !== 'All' && i.sector !== sector) return false;
      if (minPrice && i.price < parseFloat(minPrice)) return false;
      if (maxPrice && i.price > parseFloat(maxPrice)) return false;
      return true;
    });

    result.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      switch (sortKey) {
        case 'symbol': aVal = a.symbol; bVal = b.symbol; break;
        case 'name': aVal = a.name; bVal = b.name; break;
        case 'price': aVal = a.price; bVal = b.price; break;
        case 'change': aVal = a.change; bVal = b.change; break;
        case 'sector': aVal = a.sector; bVal = b.sector; break;
        default: aVal = a.symbol; bVal = b.symbol;
      }
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [query, assetClass, sector, minPrice, maxPrice, sortKey, sortDir]);

  const formatPrice = (price: number) => {
    if (price < 10) return `$${price.toFixed(4)}`;
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="screener-wrap">
      <div className="screener-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />Market screener</div>
          <h2>Instrument Scanner</h2>
          <p>Filter and sort across equities, crypto, ETFs, and FX. All data is simulated for demo purposes.</p>
        </div>
      </div>

      <div className="screener-filters">
        <div className="feature-search screener-search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search symbol or name" />
        </div>
        <select value={assetClass} onChange={(e) => setAssetClass(e.target.value)}>
          {assetClasses.map((ac) => <option key={ac} value={ac}>{ac === 'All' ? 'All asset classes' : ac}</option>)}
        </select>
        <select value={sector} onChange={(e) => setSector(e.target.value)}>
          {sectors.map((s) => <option key={s} value={s}>{s === 'All' ? 'All sectors' : s}</option>)}
        </select>
        <div className="screener-price-range">
          <Filter size={13} />
          <input type="number" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span>-</span>
          <input type="number" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <div className="screener-count">{filtered.length} instrument{filtered.length !== 1 ? 's' : ''} found</div>

      <section className="panel feature-card">
        <div className="holdings-table screener-table">
          <div className="holdings-row holdings-header screener-row">
            <span className="screener-col-sort" onClick={() => handleSort('symbol')}>
              Symbol {sortKey === 'symbol' && <ArrowUpDown size={9} />}
            </span>
            <span className="screener-col-sort" onClick={() => handleSort('name')}>
              Name {sortKey === 'name' && <ArrowUpDown size={9} />}
            </span>
            <span className="screener-col-sort" onClick={() => handleSort('price')}>
              Price {sortKey === 'price' && <ArrowUpDown size={9} />}
            </span>
            <span className="screener-col-sort" onClick={() => handleSort('change')}>
              Change% {sortKey === 'change' && <ArrowUpDown size={9} />}
            </span>
            <span>Volume</span>
            <span>Market Cap</span>
            <span className="screener-col-sort" onClick={() => handleSort('sector')}>
              Sector {sortKey === 'sector' && <ArrowUpDown size={9} />}
            </span>
          </div>
          {filtered.map((inst) => (
            <button
              className="holdings-row screener-row market-row"
              key={inst.symbol}
              onClick={() => onNotify(`${inst.symbol} - ${inst.name} selected. ${formatPrice(inst.price)} (${inst.change >= 0 ? '+' : ''}${inst.change.toFixed(2)}%)`)}
            >
              <span><b>{inst.symbol}</b></span>
              <span className="screener-name">{inst.name}</span>
              <span>{formatPrice(inst.price)}</span>
              <span className={inst.change >= 0 ? 'positive' : 'negative'}>
                {inst.change >= 0 ? '+' : ''}{inst.change.toFixed(2)}%
              </span>
              <span>{inst.volume}</span>
              <span>{inst.marketCap}</span>
              <span className="screener-sector-badge">{inst.sector}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="empty-state">No instruments match your filters. Try adjusting the criteria.</div>}
        </div>
      </section>
    </div>
  );
}
