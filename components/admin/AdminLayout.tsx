'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) router.replace('/admin/login');
  }, [router]);

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
    { label: 'Shipments', icon: '📦', href: '/admin/shipments', badge: 12 },
    { label: 'Blog Posts', icon: '📝', href: '/admin/blogs' },
    { label: 'Case Studies', icon: '🏆', href: '/admin/case-studies' },
    { label: 'Industries', icon: '🏢', href: '/admin/industries' },
    { label: 'Solutions', icon: '⚙️', href: '/admin/solutions' },
    { label: 'White Papers', icon: '📄', href: '/admin/white-papers' },
    { label: 'Tariff Updates', icon: '📊', href: '/admin/tariff-updates' },
    { label: 'Subscribers', icon: '📧', href: '/admin/subscribers' },
    { label: 'Contact Forms', icon: '💬', href: '/admin/contact-submissions' },
    { label: 'Users', icon: '👥', href: '/admin/users' },
    { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className='flex h-screen bg-light-gray'>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-navy text-white transition-all duration-300 overflow-y-auto`}
      >
        {/* Logo */}
        <div className='p-4 border-b border-navy-dark'>
          <Link href='/admin/dashboard' className='flex items-center gap-3'>
            <span className='text-2xl font-bold'>📊</span>
            {sidebarOpen && <span className='font-bold text-sm'>OPS ADMIN</span>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className='p-4 space-y-2'>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive(item.href)
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:bg-navy-dark'
              }`}
            >
              <span className='text-lg'>{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className='text-sm font-medium flex-1'>{item.label}</span>
                  {item.badge && (
                    <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-navy-dark'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-navy-dark transition-colors'
          >
            <span className='text-lg'>🚪</span>
            {sidebarOpen && <span className='text-sm font-medium'>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Top Bar */}
        <header className='bg-white border-b border-border px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='p-2 hover:bg-light-gray rounded-lg transition-colors'
            >
              {sidebarOpen ? '☰' : '→'}
            </button>
            <h1 className='text-xl font-bold text-text-primary'>Admin Dashboard</h1>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative group'>
              <button className='w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center'>
                A
              </button>
              <div className='hidden group-hover:block absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-deep z-10'>
                <div className='p-4'>
                  <p className='text-sm font-bold text-text-primary'>Admin User</p>
                  <p className='text-xs text-text-secondary'>admin@opslogistics.com</p>
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

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
