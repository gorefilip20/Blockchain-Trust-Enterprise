'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

const C = { bg: '#f3f2f2', text: '#201e1d', accent: '#6a3df0', surface: '#eae9e9' };
const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

const pageNames: Record<string, string> = {
  '/admin/dashboard': 'Overview',
  '/admin/clients': 'Clients',
  '/admin/users': 'App users',
  '/admin/entities': 'Entities',
  '/admin/partners': 'Partners',
  '/admin/treasury': 'Treasury',
  '/admin/payments': 'Payments',
  '/admin/documents': 'Documents',
  '/admin/accounting': 'Accounting',
  '/admin/onboarding': 'New client',
  '/admin/frontend-control': 'Frontend control',
  '/admin/blog': 'Blog',
  '/admin/campaigns': 'Campaigns',
  '/admin/copy-trading': 'Copy operations',
  '/admin/leaderboard': 'Leaderboard',
  '/admin/analytics': 'Analytics',
  '/admin/roles': 'Roles & access',
  '/admin/mentorship': 'Mentorship',
  '/admin/investments': 'Investments',
  '/admin/bulk-ops': 'Bulk operations',
  '/admin/settings': 'Settings',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') return <>{children}</>;

  const pageName = pageNames[pathname] || 'Operations';

  return (
    <AdminGuard>
      <style>{`
        .bte-admin-viewsite:hover { background: ${C.text} !important; color: ${C.bg} !important; }
        @media (max-width: 860px) {
          .bte-admin-main { margin-left: 0 !important; }
          .bte-admin-topbar { padding-left: 60px !important; }
          .bte-admin-wrap { padding: 16px !important; }
          .bte-admin-topbar-right { display: none !important; }
        }
        /* Mobile-friendly admin tables */
        .bte-admin-wrap table { font-size: 12px; }
        .bte-admin-wrap th, .bte-admin-wrap td { padding: 10px 12px !important; white-space: nowrap; }
        @media (max-width: 640px) {
          .bte-admin-wrap table { font-size: 11px; }
          .bte-admin-wrap th, .bte-admin-wrap td { padding: 8px !important; }
          .bte-admin-wrap h1 { font-size: 20px !important; }
        }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: FONT, background: C.bg, color: C.text }}>
        <AdminSidebar />
        <main className="bte-admin-main" style={{ flex: 1, marginLeft: 260 }}>
          <header className="bte-admin-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 56, borderBottom: `2px solid ${C.surface}`, background: C.bg }}>
            <div style={{ fontSize: 13, color: 'rgba(32,30,29,0.5)' }}>
              <span>Workspace</span>
              <span style={{ margin: '0 6px' }}>/</span>
              <strong style={{ color: C.text }}>{pageName}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="bte-admin-topbar-right" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(32,30,29,0.6)' }}>
                <i style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#6d43d8' }} />
                All systems operational
              </span>
              <Link href="/" className="bte-admin-viewsite bte-admin-topbar-right" style={{ fontSize: 12, fontWeight: 600, color: C.text, textDecoration: 'none', border: `2px solid ${C.text}`, padding: '6px 14px', letterSpacing: '0.03em', transition: 'all 0.15s' }}>
                View public site
              </Link>
            </div>
          </header>
          <div className="bte-admin-wrap" style={{ padding: 32 }}>{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
