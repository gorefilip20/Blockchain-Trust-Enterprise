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

  const sidebarContent = (
    <>
      <div className="admin-brand-block">
        <Link href="/admin/dashboard" className="admin-brand" onClick={() => setMobileOpen(false)}>
          <span className="admin-brand-mark">BTE</span>
          <span><b>Blockchain Trust</b><small>Admin operations</small></span>
        </Link>
        <span className="admin-environment">CONTROL ROOM</span>
      </div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {groups.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <span className="admin-nav-label">{group.label}</span>
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return <Link key={item.href} href={item.href} className={`admin-nav-item ${active ? 'active' : ''}`} onClick={() => setMobileOpen(false)}><span className="admin-nav-icon">{item.icon}</span><span>{item.label}</span>{active && <ChevronRight size={14} className="admin-nav-arrow" />}</Link>;
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-profile"><span className="admin-avatar">A</span><span><b>{getAdminName()}</b><small>Administrator</small></span></div>
        <button className="admin-logout" onClick={handleLogout}><LogOut size={15} /> Sign out</button>
      </div>
    </>
  );

  return (
    <>
      <button className="admin-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle admin navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      {mobileOpen && <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`admin-sidebar admin-sidebar-mobile ${mobileOpen ? 'open' : ''}`}>{sidebarContent}</aside>
      <aside className="admin-sidebar admin-sidebar-desktop">{sidebarContent}</aside>
    </>
  );
}
