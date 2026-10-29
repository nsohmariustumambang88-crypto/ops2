'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Desktop: the sidebar can collapse to icons. Phones: it opens as a drawer over the page.
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [access, setAccess] = useState<{ role: string; permissions: string[] } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) router.replace('/admin/login');
  }, [router]);

  // Who is signed in decides which sections appear. The server still checks every request.
  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => { if (me) setAccess({ role: me.role, permissions: me.permissions ?? [] }); });
  }, []);

  // Close the drawer whenever the page changes, so a tapped link does not leave it open.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  type Item = { label: string; icon: string; href: string; perm?: string; adminOnly?: boolean };
  const menuItems: Item[] = [
    { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
    { label: 'Shipments', icon: '📦', href: '/admin/shipments', perm: 'shipments_view' },
    { label: 'Notifications', icon: '🔔', href: '/admin/notifications', perm: 'shipments_view' },
    { label: 'Blog Posts', icon: '📝', href: '/admin/blogs', perm: 'content_manage' },
    { label: 'Case Studies', icon: '🏆', href: '/admin/case-studies', perm: 'content_manage' },
    { label: 'Industries', icon: '🏢', href: '/admin/industries', perm: 'content_manage' },
    { label: 'Solutions', icon: '⚙️', href: '/admin/solutions', perm: 'content_manage' },
    { label: 'White Papers', icon: '📄', href: '/admin/white-papers', perm: 'content_manage' },
    { label: 'Tariff Updates', icon: '📊', href: '/admin/tariff-updates', perm: 'content_manage' },
    { label: 'Subscribers', icon: '📧', href: '/admin/subscribers', perm: 'subscribers_manage' },
    { label: 'Send Email', icon: '✉️', href: '/admin/email', perm: 'subscribers_manage' },
    { label: 'Inbox', icon: '📥', href: '/admin/inbox', perm: 'inbox_view' },
    { label: 'Contact Forms', icon: '💬', href: '/admin/contact-submissions', perm: 'enquiries_manage' },
    { label: 'Customers', icon: '🏷️', href: '/admin/customers', perm: 'customers_manage' },
    { label: 'Orders', icon: '🧾', href: '/admin/orders', perm: 'orders_view' },
    { label: 'Reports', icon: '📈', href: '/admin/reports', perm: 'reports_view' },
    { label: 'Pricing', icon: '💲', href: '/admin/pricing', perm: 'pricing_manage' },
    { label: 'Support', icon: '🛟', href: '/admin/support', perm: 'support_manage' },
    { label: 'Users', icon: '👥', href: '/admin/users', adminOnly: true },
    { label: 'Settings', icon: '⚙️', href: '/admin/settings', perm: 'settings_manage' },
  ];

  const visibleItems = menuItems.filter((item) => {
    if (!access) return !item.perm && !item.adminOnly;
    if (access.role === 'admin') return true;
    if (item.adminOnly) return false;
    return !item.perm || access.permissions.includes(item.perm);
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const isActive = (href: string) => pathname === href;

  const sidebar = (
    <>
      <div className='p-4 border-b border-navy-dark'>
        <Link href='/admin/dashboard' className='flex items-center gap-3'>
          <span className='text-2xl font-bold'>📊</span>
          {!collapsed && <span className='font-bold text-sm'>OPS ADMIN</span>}
        </Link>
      </div>

      <nav className='flex-1 min-h-0 p-4 space-y-2 overflow-y-auto'>
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
              isActive(item.href) ? 'bg-primary text-white' : 'text-white/80 hover:bg-navy-dark'
            }`}
          >
            <span className='text-lg'>{item.icon}</span>
            {!collapsed && <span className='text-sm font-medium flex-1'>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className='shrink-0 p-4 border-t border-navy-dark bg-navy'>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-navy-dark transition-colors'
        >
          <span className='text-lg'>🚪</span>
          {!collapsed && <span className='text-sm font-medium'>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className='flex h-[100dvh] bg-light-gray overflow-hidden'>
      {/* Phone backdrop, behind the open drawer */}
      {drawerOpen && (
        <button
          type='button'
          aria-label='Close menu'
          onClick={() => setDrawerOpen(false)}
          className='fixed inset-0 z-30 bg-black/40 md:hidden'
        />
      )}

      {/* Sidebar: a drawer on phones, a fixed column from tablet width up */}
      <aside
        className={`flex flex-col bg-navy text-white transition-all duration-300 z-40
          fixed inset-y-0 left-0 w-64 md:static md:shrink-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {sidebar}
      </aside>

      <div className='flex-1 min-w-0 flex flex-col'>
        {/* Top bar */}
        <header className='bg-white border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3 min-w-0'>
            <button
              type='button'
              aria-label='Open menu'
              onClick={() => setDrawerOpen(true)}
              className='md:hidden p-2 hover:bg-light-gray rounded-lg transition-colors'
            >
              ☰
            </button>
            <button
              type='button'
              aria-label='Collapse menu'
              onClick={() => setCollapsed(!collapsed)}
              className='hidden md:inline-flex p-2 hover:bg-light-gray rounded-lg transition-colors'
            >
              {collapsed ? '→' : '☰'}
            </button>
            <h1 className='text-base md:text-xl font-bold text-text-primary truncate'>Admin</h1>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative group'>
              <button type='button' className='w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center'>
                A
              </button>
              <div className='hidden group-hover:block absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-deep z-10'>
                <div className='p-4'>
                  <p className='text-sm font-bold text-text-primary'>Admin User</p>
                  <p className='text-xs text-text-secondary'>support@opslogistice.com</p>
                </div>
                <div className='border-t border-border p-2'>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-4 md:p-6 min-w-0'>{children}</main>
      </div>
    </div>
  );
}
