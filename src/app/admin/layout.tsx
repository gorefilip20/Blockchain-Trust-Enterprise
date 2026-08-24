'use client';

import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login screen must remain outside AdminGuard, otherwise an unauthenticated
  // visitor is redirected back to the same route while the guard renders null.
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <AdminGuard>
      <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
