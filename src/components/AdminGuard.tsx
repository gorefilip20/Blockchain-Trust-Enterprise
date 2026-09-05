'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('bte-admin-token');

    if (!token) {
      router.replace('/admin/login');
      return () => { cancelled = true; };
    }

    fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Invalid session');
        return response.json();
      })
      .then(() => {
        if (!cancelled) {
          setAuthenticated(true);
          setChecking(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('bte-admin-token');
        localStorage.removeItem('bte-admin-user');
        if (!cancelled) {
          setAuthenticated(false);
          setChecking(false);
          router.replace('/admin/login');
        }
      });

    return () => { cancelled = true; };
  }, [router]);

  if (checking) {
    return <div className="admin-session-loading"><span className="admin-session-spinner" /><span>Verifying secure session…</span></div>;
  }

  if (!authenticated) return null;
  return <>{children}</>;
}
