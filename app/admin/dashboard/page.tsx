'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { SHIPMENT_STATUSES, normalizeStatus, statusLabel } from '@/lib/status';

type Stats = {
  total_shipments: string;
  in_transit: string;
  delivered: string;
  total_orders: string;
  total_revenue: string;
  total_customers: string;
  total_users: string;
  status_counts: Record<string, number>;
  recent_updates: { status: string; location: string | null; timestamp: string; shipment_id: number; reference: string }[];
};
type Support = { open_tickets: string; total_tickets: string };

type RecentShipment = {
  id: number;
  tracking_number: string;
  status: string;
  created_at: string;
};

const quickActions = [
  { label: 'New Shipment', href: '/admin/shipments/new', icon: '➕' },
  { label: 'All Shipments', href: '/admin/shipments', icon: '📦' },
  { label: 'Send Email', href: '/admin/email', icon: '✉️' },
  { label: 'Contact Forms', href: '/admin/contact-submissions', icon: '💬' },
  { label: 'Support', href: '/admin/support', icon: '🛟' },
  { label: 'Orders', href: '/admin/orders', icon: '🧾' },
  { label: 'Reports', href: '/admin/reports', icon: '📈' },
  { label: 'Blog Posts', href: '/admin/blogs', icon: '📝' },
];

const statusClass = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'in_transit':
    case 'en_route':
      return 'bg-blue-100 text-blue-800';
    case 'registered':
      return 'bg-orange-100 text-orange-800';
    case 'picked_up':
      return 'bg-purple-100 text-purple-800';
    case 'on_hold':
      return 'bg-amber-100 text-amber-900';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [support, setSupport] = useState<Support | null>(null);
  const [newEnquiries, setNewEnquiries] = useState<number | null>(null);
  const [recent, setRecent] = useState<RecentShipment[]>([]);
  const [error, setError] = useState('');

  // Reloads the numbers when the page loads and whenever the tab comes back into view,
  // so a status change made elsewhere shows up without a manual refresh.
  const load = useCallback(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    const headers = { Authorization: `Bearer ${token}` };
    const ok = (r: Response, name: string) => (r.ok ? r.json() : Promise.reject(new Error(name)));
    Promise.all([
      fetch('/api/admin/dashboard', { headers }).then((r) => ok(r, 'stats')),
      fetch('/api/admin/shipments?limit=8', { headers }).then((r) => ok(r, 'shipments')),
      fetch('/api/support/admin/stats', { headers }).then((r) => ok(r, 'support')).catch(() => null),
      fetch('/api/admin/contact-submissions?status=new&limit=200', { headers }).then((r) => ok(r, 'enquiries')).catch(() => null),
    ])
      .then(([s, list, sup, enq]) => {
        setStats(s);
        setRecent(list.data ?? []);
        setSupport(sup);
        setNewEnquiries(enq ? (enq.data ?? []).length : null);
        setError('');
      })
      .catch(() => setError('Could not load the dashboard numbers. Try refreshing the page.'));
  }, []);

  useEffect(() => {
    load();
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  const cards = stats
    ? [
        { label: 'Total shipments', value: stats.total_shipments, icon: '📦' },
        { label: 'In transit', value: stats.in_transit, icon: '🚚' },
        { label: 'Delivered', value: stats.delivered, icon: '✅' },
        { label: 'Paid revenue', value: `$${Number(stats.total_revenue || 0).toFixed(2)}`, icon: '💰' },
        { label: 'Paid orders', value: stats.total_orders, icon: '🧾' },
        { label: 'Customers', value: stats.total_customers, icon: '🏷️' },
        { label: 'Open support tickets', value: support?.open_tickets ?? '—', icon: '🛟' },
        { label: 'New enquiries', value: newEnquiries ?? '—', icon: '💬' },
      ]
    : [];

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-text-primary mb-2'>Dashboard</h1>
          <p className='text-text-secondary'>Live numbers from the shipment database. Updates when you come back to this page.</p>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {cards.map((card) => (
            <div key={card.label} className='bg-blue-50 border border-border rounded-lg p-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>{card.label}</p>
                  <p className='text-2xl font-bold text-text-primary'>{String(card.value)}</p>
                </div>
                <span className='text-3xl'>{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {stats && (
          <div className='bg-white border border-border rounded-lg p-6'>
            <h2 className='text-lg font-extrabold text-text-primary mb-4'>Shipments by status</h2>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
              {SHIPMENT_STATUSES.map((s) => (
                <Link key={s.key} href='/admin/shipments' className='rounded-lg border border-border p-3 hover:bg-light-blue'>
                  <p className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${statusClass(s.key)}`}>{statusLabel(s.key)}</p>
                  <p className='text-2xl font-bold text-text-primary mt-2'>{stats.status_counts[s.key] ?? 0}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className='bg-white border border-border rounded-lg p-6'>
          <h2 className='text-lg font-extrabold text-text-primary mb-4'>Quick actions</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className='flex flex-col items-center gap-3 p-4 bg-light-gray rounded-lg hover:bg-light-blue transition-colors text-center'
              >
                <span className='text-2xl'>{action.icon}</span>
                <span className='text-sm font-bold text-text-primary'>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {stats && (
          <div className='bg-white border border-border rounded-lg p-6'>
            <h2 className='text-lg font-extrabold text-text-primary mb-4'>Latest updates</h2>
            {stats.recent_updates.length === 0 && <p className='text-text-secondary'>No updates yet.</p>}
            <ul className='divide-y divide-border'>
              {stats.recent_updates.map((u, i) => (
                <li key={`${u.shipment_id}-${i}`} className='py-3 flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <Link href={`/admin/shipments/${u.shipment_id}`} className='font-bold text-primary hover:underline'>{u.reference}</Link>
                    <span className='text-sm text-text-secondary'> · {u.location || 'No location'}</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(u.status)}`}>{statusLabel(u.status)}</span>
                    <span className='text-xs text-text-secondary'>{new Date(u.timestamp).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className='bg-white border border-border rounded-lg overflow-x-auto'>
          <div className='p-6 border-b border-border flex items-center justify-between'>
            <h2 className='text-lg font-extrabold text-text-primary'>Recent shipments</h2>
            <Link href='/admin/shipments' className='text-primary font-bold text-sm hover:underline'>View all →</Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-light-gray border-b border-border'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Reference</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Registered</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr><td className='px-6 py-6 text-sm text-text-secondary' colSpan={4}>No shipments yet.</td></tr>
                )}
                {recent.map((s) => (
                  <tr key={s.id} className='border-b border-border hover:bg-light-gray transition-colors'>
                    <td className='px-6 py-4 text-sm font-bold text-text-primary'>{s.tracking_number}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(s.status)}`}>
                        {statusLabel(s.status)}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className='px-6 py-4 text-sm'>
                      <Link href={`/admin/shipments/${s.id}`} className='text-primary font-bold hover:underline'>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
