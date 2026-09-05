'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

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
      <div className="admin-portal">
        <AdminSidebar />
        <main className="admin-main">
          <header className="admin-topbar">
            <div>
              <span className="admin-topbar-kicker">BTE operations</span>
              <div className="admin-breadcrumb"><span>Workspace</span><span>/</span><strong>{pageName}</strong></div>
            </div>
            <div className="admin-topbar-actions">
              <span className="admin-system-status"><i /> All systems operational</span>
              <Link href="/" className="admin-view-site">View public site</Link>
            </div>
          </header>
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
