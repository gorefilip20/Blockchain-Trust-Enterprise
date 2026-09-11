'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Activity, BarChart3, BookOpen, Building2, ChevronRight, CircleDollarSign, FileText, LayoutDashboard, LogOut, Mail, Menu, Settings2, ShieldCheck, Sparkles, Users, WalletCards, X } from 'lucide-react';

type NavItem = { href: string; label: string; icon: React.ReactNode };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  { label: 'Overview', items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> }, { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={17} /> }] },
  { label: 'People & accounts', items: [{ href: '/admin/clients', label: 'Clients', icon: <Users size={17} /> }, { href: '/admin/users', label: 'App users', icon: <Users size={17} /> }, { href: '/admin/partners', label: 'Partners', icon: <ShieldCheck size={17} /> }, { href: '/admin/onboarding', label: 'New client', icon: <Sparkles size={17} /> }] },
  { label: 'Operations', items: [{ href: '/admin/entities', label: 'Entities', icon: <Building2 size={17} /> }, { href: '/admin/investments', label: 'Investments', icon: <Activity size={17} /> }, { href: '/admin/copy-trading', label: 'Copy operations', icon: <Users size={17} /> }, { href: '/admin/leaderboard', label: 'Leaderboard', icon: <BarChart3 size={17} /> }] },
  { label: 'Money & records', items: [{ href: '/admin/treasury', label: 'Treasury', icon: <WalletCards size={17} /> }, { href: '/admin/payments', label: 'Payments', icon: <CircleDollarSign size={17} /> }, { href: '/admin/accounting', label: 'Accounting', icon: <BarChart3 size={17} /> }, { href: '/admin/documents', label: 'Documents', icon: <FileText size={17} /> }] },
  { label: 'Growth & settings', items: [{ href: '/admin/blog', label: 'Blog', icon: <BookOpen size={17} /> }, { href: '/admin/campaigns', label: 'Campaigns', icon: <Mail size={17} /> }, { href: '/admin/mentorship', label: 'Mentorship', icon: <BookOpen size={17} /> }, { href: '/admin/frontend-control', label: 'Frontend control', icon: <Settings2 size={17} /> }, { href: '/admin/roles', label: 'Roles & access', icon: <ShieldCheck size={17} /> }, { href: '/admin/bulk-ops', label: 'Bulk operations', icon: <Activity size={17} /> }, { href: '/admin/settings', label: 'Settings', icon: <Settings2 size={17} /> }] },
];

const C = { ink: '#2d2b2b', accent: '#6a3df0', text: '#201e1d' };
const FONT = "'Archivo', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

function getAdminName() {
  if (typeof window === 'undefined') return 'Admin';
  try {
    const raw = localStorage.getItem('bte-admin-user');
    if (!raw) return 'Admin';
    const parsed = JSON.parse(raw);
    return (typeof parsed === 'object' && parsed?.username) || raw || 'Admin';
  } catch {
    return localStorage.getItem('bte-admin-user') || 'Admin';
  }
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('bte-admin-token');
    localStorage.removeItem('bte-admin-user');
    router.push('/admin/login');
  }

  const adminName = getAdminName();

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: FONT }}>
      <div style={{ padding: '24px 20px 16px' }}>
        <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#fff' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="1" width="30" height="30" stroke="#ffffff" strokeWidth="2" />
            <rect x="10" y="10" width="12" height="12" fill={C.accent} />
          </svg>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blockchain Trust</div>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Admin operations</div>
          </div>
        </Link>
        <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent }}>
          Control room
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }} aria-label="Admin navigation">
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            <span style={{ display: 'block', padding: '0 8px', marginBottom: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{group.label}</span>
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bte-sidebar-item"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                    background: active ? C.accent : 'transparent',
                    textDecoration: 'none', marginBottom: 1,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.75 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: C.accent, color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
            {adminName.charAt(0)}
          </span>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{adminName}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Administrator</div>
          </div>
        </div>
        <button className="bte-sidebar-logout" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', padding: '6px 0' }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );

  const sidebarBase: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: 260, height: '100vh', background: C.ink, color: '#fff', zIndex: 100, overflowY: 'auto' };

  return (
    <>
      <style>{`
        .bte-sidebar-item:hover { background: rgba(255,255,255,0.08) !important; }
        .bte-sidebar-logout:hover { color: #fff !important; }
        .bte-sidebar-mobile { display: none; }
        .bte-sidebar-desktop { display: block; }
        .bte-mobile-toggle { display: none !important; }
        @media (max-width: 860px) {
          .bte-sidebar-desktop { display: none !important; }
          .bte-sidebar-mobile.open { display: block !important; }
          .bte-mobile-toggle { display: flex !important; }
        }
      `}</style>
      <button className="bte-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle admin navigation" style={{ position: 'fixed', top: 12, left: 12, zIndex: 200, alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: C.ink, color: '#fff', border: 'none', cursor: 'pointer' }}>
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}
      <aside className={`bte-sidebar-mobile ${mobileOpen ? 'open' : ''}`} style={sidebarBase}>{sidebarContent}</aside>
      <aside className="bte-sidebar-desktop" style={sidebarBase}>{sidebarContent}</aside>
    </>
  );
}
