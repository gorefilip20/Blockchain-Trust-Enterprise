'use client';

import { useEffect, useState } from 'react';
import { Trophy, ArrowUpDown, TrendingUp, Users, DollarSign } from 'lucide-react';

type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  manager: string;
  risk_level: string;
  return_30d: string;
  return_90d: string;
  max_drawdown: string;
  sharpe_ratio: number;
  followers: number;
  aum: number;
  status: string;
};

type SortKey = 'return_30d' | 'return_90d' | 'max_drawdown' | 'sharpe_ratio' | 'followers' | 'aum';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('return_30d');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const token = typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';

  async function load() {
    const response = await fetch('/api/leaderboard', { headers: { Authorization: `Bearer ${token}` } });
    if (response.ok) {
      const data = await response.json();
      setEntries(data.leaderboard || []);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...entries].sort((a, b) => {
    let aVal: number, bVal: number;
    switch (sortKey) {
      case 'return_30d':
        aVal = parseFloat(a.return_30d.replace('%', '').replace('+', ''));
        bVal = parseFloat(b.return_30d.replace('%', '').replace('+', ''));
        break;
      case 'return_90d':
        aVal = parseFloat(a.return_90d.replace('%', '').replace('+', ''));
        bVal = parseFloat(b.return_90d.replace('%', '').replace('+', ''));
        break;
      case 'max_drawdown':
        aVal = parseFloat(a.max_drawdown.replace('%', '').replace('+', ''));
        bVal = parseFloat(b.max_drawdown.replace('%', '').replace('+', ''));
        break;
      case 'sharpe_ratio': aVal = a.sharpe_ratio; bVal = b.sharpe_ratio; break;
      case 'followers': aVal = a.followers; bVal = b.followers; break;
      case 'aum': aVal = a.aum; bVal = b.aum; break;
      default: aVal = 0; bVal = 0;
    }
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  }).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const totalFollowers = entries.reduce((sum, e) => sum + e.followers, 0);
  const totalAum = entries.reduce((sum, e) => sum + e.aum, 0);
  const topReturn = entries.length > 0 ? entries.reduce((best, e) => {
    const v = parseFloat(e.return_30d.replace('%', '').replace('+', ''));
    return v > best ? v : best;
  }, -Infinity) : 0;

  return (
    <div className="admin-ops-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Performance analytics</div>
          <h1>Strategy Leaderboard</h1>
          <p>Ranked performance metrics across all published copy-trading strategies.</p>
        </div>
        <a className="admin-preview-link" href="/">Preview public frontend</a>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi">
          <TrendingUp size={20} />
          <span>Top 30D Return</span>
          <b>{topReturn >= 0 ? '+' : ''}{topReturn.toFixed(1)}%</b>
        </div>
        <div className="admin-kpi">
          <Users size={20} />
          <span>Total Followers</span>
          <b>{totalFollowers.toLocaleString()}</b>
        </div>
        <div className="admin-kpi">
          <DollarSign size={20} />
          <span>Total AUM</span>
          <b>${(totalAum / 1_000_000).toFixed(1)}M</b>
        </div>
      </div>

      <section className="admin-ops-card">
        <div className="admin-section-title">
          <div>
            <h2>Strategy Rankings</h2>
            <p>Click column headers to sort. Performance data is simulated for demo purposes.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={sortKey}
              onChange={(e) => { setSortKey(e.target.value as SortKey); setSortDir('desc'); }}
              style={{ minHeight: '32px', border: '1px solid #d4e3e8', color: '#456271', background: '#fff', borderRadius: '7px', padding: '0 10px', fontSize: '10px' }}
            >
              <option value="return_30d">Sort: 30D Return</option>
              <option value="return_90d">Sort: 90D Return</option>
              <option value="max_drawdown">Sort: Max Drawdown</option>
              <option value="sharpe_ratio">Sort: Sharpe Ratio</option>
              <option value="followers">Sort: Followers</option>
              <option value="aum">Sort: AUM</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Rank</th>
                <th>Strategy</th>
                <th>Manager</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('return_30d')}>
                  30D Return {sortKey === 'return_30d' && <ArrowUpDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('return_90d')}>
                  90D Return {sortKey === 'return_90d' && <ArrowUpDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('max_drawdown')}>
                  Max Drawdown {sortKey === 'max_drawdown' && <ArrowUpDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('sharpe_ratio')}>
                  Sharpe {sortKey === 'sharpe_ratio' && <ArrowUpDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('followers')}>
                  Followers {sortKey === 'followers' && <ArrowUpDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('aum')}>
                  AUM {sortKey === 'aum' && <ArrowUpDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => {
                const is30dPositive = entry.return_30d.startsWith('+');
                const is90dPositive = entry.return_90d.startsWith('+');
                return (
                  <tr key={entry.id}>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '28px', height: '28px', borderRadius: '8px', fontWeight: 700, fontSize: '12px',
                        background: entry.rank === 1 ? '#fff7e5' : entry.rank === 2 ? '#f0f5f8' : entry.rank === 3 ? '#fef5ee' : '#f8fafc',
                        color: entry.rank === 1 ? '#a66d0b' : entry.rank === 2 ? '#5a7080' : entry.rank === 3 ? '#9a5b2a' : '#718896',
                      }}>
                        {entry.rank <= 3 ? <Trophy size={14} /> : entry.rank}
                      </span>
                    </td>
                    <td>
                      <strong>{entry.name}</strong>
                      <small>{entry.risk_level}</small>
                    </td>
                    <td>{entry.manager}</td>
                    <td className={is30dPositive ? 'admin-positive' : 'admin-negative'}>{entry.return_30d}</td>
                    <td className={is90dPositive ? 'admin-positive' : 'admin-negative'}>{entry.return_90d}</td>
                    <td className="admin-negative">{entry.max_drawdown}</td>
                    <td style={{ color: entry.sharpe_ratio >= 1 ? '#078d73' : '#456271' }}>{entry.sharpe_ratio}</td>
                    <td>{entry.followers.toLocaleString()}</td>
                    <td>${(entry.aum / 1_000_000).toFixed(1)}M</td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr><td colSpan={9}><div className="admin-empty">No strategies found. Create strategies from the Copy Operations page.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
