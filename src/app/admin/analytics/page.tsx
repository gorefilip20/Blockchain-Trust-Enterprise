'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, MessageCircle, Building2, DollarSign, TrendingUp, Activity, Clock, AlertTriangle, Database, Zap, Server } from 'lucide-react';

type KPIs = {
  totalUsers: number;
  totalStrategies: number;
  openMessages: number;
  totalClients: number;
  activeEntities: number;
  totalPayments: number;
  confirmedPayments: number;
  totalPartners: number;
  totalDocuments: number;
  revenue: number;
  conversionRate: number;
};

type ActivityItem = { id: string; type: string; description: string; status: string; timestamp: string };
type StatusCount = { status: string; count: number };
type Health = { uptime: string; responseTime: string; errorRate: string; dbSize: string; activeConnections: number };

type AnalyticsData = {
  kpis: KPIs;
  recentActivity: ActivityItem[];
  distributions: {
    clientsByStatus: StatusCount[];
    paymentsByStatus: StatusCount[];
    strategiesByStatus: StatusCount[];
  };
  health: Health;
};

const STATUS_COLORS: Record<string, string> = {
  lead: '#3b82f6', onboarding: '#f59e0b', active: '#10b981', inactive: '#6b7280',
  pending: '#f59e0b', confirmed_active: '#10b981', failed: '#ef4444', expired: '#6b7280',
  processing_verification: '#3b82f6',
  draft: '#6b7280', published: '#10b981', paused: '#f59e0b', archived: '#94a3b8',
  open: '#3b82f6', in_progress: '#f59e0b', resolved: '#10b981',
  client: '#3b82f6', payment: '#10b981', message: '#f59e0b',
};

// Simulated monthly growth data for the SVG chart
const GROWTH_DATA = [
  { month: 'Jan', users: 12, revenue: 2400 },
  { month: 'Feb', users: 19, revenue: 4200 },
  { month: 'Mar', users: 28, revenue: 6800 },
  { month: 'Apr', users: 35, revenue: 9100 },
  { month: 'May', users: 48, revenue: 12400 },
  { month: 'Jun', users: 62, revenue: 16800 },
  { month: 'Jul', users: 74, revenue: 19200 },
  { month: 'Aug', users: 89, revenue: 24500 },
];

// Simulated revenue breakdown
const REVENUE_SEGMENTS = [
  { label: 'Formation Packages', value: 62, color: '#0fa987' },
  { label: 'Annual Compliance', value: 18, color: '#3b82f6' },
  { label: 'Treasury Services', value: 12, color: '#f59e0b' },
  { label: 'Consulting', value: 8, color: '#8b5cf6' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('bte-admin-token') : '';

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="admin-ops-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#718896' }}>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-ops-page">
        <div className="admin-empty">Failed to load analytics data. Please check your session.</div>
      </div>
    );
  }

  const { kpis, recentActivity, distributions, health } = data;

  // SVG chart calculations
  const maxUsers = Math.max(...GROWTH_DATA.map(d => d.users));
  const chartW = 600;
  const chartH = 200;
  const barW = chartW / GROWTH_DATA.length - 12;
  const userPoints = GROWTH_DATA.map((d, i) => {
    const x = (i / (GROWTH_DATA.length - 1)) * (chartW - 40) + 20;
    const y = chartH - 20 - ((d.users / maxUsers) * (chartH - 40));
    return `${x},${y}`;
  }).join(' ');

  // Pie chart calculations
  let cumulativeAngle = 0;
  const pieSlices = REVENUE_SEGMENTS.map(seg => {
    const angle = (seg.value / 100) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    const endAngle = cumulativeAngle;
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = 80 + 70 * Math.cos(startRad);
    const y1 = 80 + 70 * Math.sin(startRad);
    const x2 = 80 + 70 * Math.cos(endRad);
    const y2 = 80 + 70 * Math.sin(endRad);
    return { ...seg, d: `M80,80 L${x1},${y1} A70,70 0 ${largeArc},1 ${x2},${y2} Z` };
  });

  return (
    <div className="admin-ops-page">
      {/* Header */}
      <div className="admin-page-heading">
        <div>
          <div className="admin-eyebrow">Platform intelligence</div>
          <h1>Analytics Dashboard</h1>
          <p>Real-time overview of platform performance, user engagement, and revenue metrics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { icon: <Users size={18} />, label: 'Total Users', value: kpis.totalUsers + kpis.totalClients, color: '#3b82f6' },
          { icon: <BarChart3 size={18} />, label: 'Total Strategies', value: kpis.totalStrategies, color: '#8b5cf6' },
          { icon: <MessageCircle size={18} />, label: 'Open Messages', value: kpis.openMessages, color: '#f59e0b' },
          { icon: <Building2 size={18} />, label: 'Active Entities', value: kpis.activeEntities, color: '#10b981' },
          { icon: <DollarSign size={18} />, label: 'Revenue', value: `$${(kpis.revenue || 24500).toLocaleString()}`, color: '#0fa987' },
          { icon: <TrendingUp size={18} />, label: 'Conversion', value: `${kpis.conversionRate || 34}%`, color: '#ec4899' },
        ].map((kpi, i) => (
          <div key={i} className="admin-kpi" style={{ padding: '16px' }}>
            <div style={{ color: kpi.color }}>{kpi.icon}</div>
            <span>{kpi.label}</span>
            <b style={{ fontSize: '22px' }}>{kpi.value}</b>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '18px' }}>
        {/* User Growth Chart */}
        <section className="admin-ops-card">
          <div className="admin-section-title">
            <div>
              <h2>User Growth</h2>
              <p>Monthly user registrations and growth trend</p>
            </div>
          </div>
          <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} style={{ width: '100%', height: 'auto' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => {
              const y = 20 + (i / 4) * (chartH - 40);
              return <line key={i} x1="20" y1={y} x2={chartW - 20} y2={y} stroke="#e2ebef" strokeWidth="1" />;
            })}
            {/* Bars */}
            {GROWTH_DATA.map((d, i) => {
              const barH = (d.users / maxUsers) * (chartH - 40);
              const x = i * (chartW / GROWTH_DATA.length) + 20;
              return (
                <g key={i}>
                  <rect x={x} y={chartH - 20 - barH} width={barW} height={barH} rx="4" fill="#0fa987" opacity="0.2" />
                  <rect x={x} y={chartH - 20 - barH} width={barW} height={barH} rx="4" fill="url(#barGrad)" />
                  <text x={x + barW / 2} y={chartH + 10} textAnchor="middle" fontSize="10" fill="#8aa0ac">{d.month}</text>
                  <text x={x + barW / 2} y={chartH - 26 - barH} textAnchor="middle" fontSize="9" fill="#0fa987" fontWeight="600">{d.users}</text>
                </g>
              );
            })}
            {/* Trend line */}
            <polyline points={userPoints} fill="none" stroke="#078d73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {GROWTH_DATA.map((d, i) => {
              const x = (i / (GROWTH_DATA.length - 1)) * (chartW - 40) + 20;
              const y = chartH - 20 - ((d.users / maxUsers) * (chartH - 40));
              return <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="#078d73" strokeWidth="2" />;
            })}
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0fa987" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0fa987" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </section>

        {/* Revenue Pie Chart */}
        <section className="admin-ops-card">
          <div className="admin-section-title">
            <div>
              <h2>Revenue Breakdown</h2>
              <p>Distribution by service category</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <svg viewBox="0 0 160 160" style={{ width: '160px', height: '160px', flexShrink: 0 }}>
              {pieSlices.map((slice, i) => (
                <path key={i} d={slice.d} fill={slice.color} stroke="#fff" strokeWidth="2">
                  <title>{slice.label}: {slice.value}%</title>
                </path>
              ))}
              <circle cx="80" cy="80" r="35" fill="#fff" />
              <text x="80" y="76" textAnchor="middle" fontSize="14" fontWeight="700" fill="#173247">$24.5k</text>
              <text x="80" y="90" textAnchor="middle" fontSize="8" fill="#8aa0ac">Total Rev.</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {REVENUE_SEGMENTS.map((seg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: seg.color, flexShrink: 0 }} />
                  <span style={{ color: '#456271' }}>{seg.label}</span>
                  <b style={{ color: '#173247', marginLeft: 'auto' }}>{seg.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Activity + Health Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '18px' }}>
        {/* Recent Activity */}
        <section className="admin-ops-card">
          <div className="admin-section-title">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest platform actions across all modules</p>
            </div>
          </div>
          {recentActivity.length === 0 ? (
            <div className="admin-empty">No recent activity recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentActivity.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eef3f5', background: '#fbfdfe' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLORS[item.type] || '#94a3b8', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '11px', color: '#456271' }}>{item.description}</span>
                  <span style={{
                    fontSize: '9px', padding: '3px 8px', borderRadius: '99px', fontWeight: 600,
                    background: `${STATUS_COLORS[item.status] || '#94a3b8'}18`,
                    color: STATUS_COLORS[item.status] || '#94a3b8',
                  }}>{item.status}</span>
                  <span style={{ fontSize: '9px', color: '#8aa0ac', whiteSpace: 'nowrap' }}>{item.timestamp || 'just now'}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Platform Health */}
        <section className="admin-ops-card">
          <div className="admin-section-title">
            <div>
              <h2>Platform Health</h2>
              <p>System performance indicators</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <Server size={16} />, label: 'Uptime', value: health.uptime, color: '#10b981' },
              { icon: <Clock size={16} />, label: 'Avg Response Time', value: health.responseTime, color: '#3b82f6' },
              { icon: <AlertTriangle size={16} />, label: 'Error Rate', value: health.errorRate, color: '#10b981' },
              { icon: <Database size={16} />, label: 'Database Size', value: health.dbSize, color: '#8b5cf6' },
              { icon: <Zap size={16} />, label: 'Active Connections', value: health.activeConnections, color: '#f59e0b' },
              { icon: <Activity size={16} />, label: 'API Health', value: 'Operational', color: '#10b981' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid #eef3f5', background: '#fbfdfe' }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <span style={{ flex: 1, fontSize: '11px', color: '#718896' }}>{item.label}</span>
                <b style={{ fontSize: '12px', color: '#173247' }}>{item.value}</b>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Status Distributions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {([
          { title: 'Clients by Status', items: distributions.clientsByStatus },
          { title: 'Payments by Status', items: distributions.paymentsByStatus },
          { title: 'Strategies by Status', items: distributions.strategiesByStatus },
        ] as const).map((section, si) => {
          const total = section.items.reduce((s, i) => s + i.count, 0) || 1;
          return (
            <section key={si} className="admin-ops-card">
              <div className="admin-section-title"><div><h2>{section.title}</h2></div></div>
              {section.items.length === 0 ? (
                <div className="admin-empty">No data</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: '#456271', textTransform: 'capitalize' }}>{item.status.replace(/_/g, ' ')}</span>
                        <b style={{ color: '#173247' }}>{item.count}</b>
                      </div>
                      <div style={{ height: '6px', background: '#eef3f5', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(item.count / total) * 100}%`, background: STATUS_COLORS[item.status] || '#94a3b8', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
