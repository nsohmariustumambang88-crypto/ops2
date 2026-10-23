'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

type Stats = {
  total_shipments: string;
  in_transit: string;
  delivered: string;
  total_users: string;
};

type RecentShipment = {
  id: number;
  tracking_number: string;
  status: string;
  created_at: string;
};

const quickActions = [
  { label: 'New Shipment', href: '/admin/shipments/new', icon: '➕' },
  { label: 'All Shipments', href: '/admin/shipments', icon: '📦' },
  { label: 'New Blog Post', href: '/admin/blogs', icon: '📝' },
  { label: 'Contact Forms', href: '/admin/contact-submissions', icon: '💬' },
];

const statusClass = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'in_transit':
      return 'bg-blue-100 text-blue-800';
    case 'registered':
      return 'bg-orange-100 text-orange-800';
    case 'picked_up':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentShipment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/admin/dashboard', { headers }).then((r) => (r.ok ? r.json() : Promise.reject(new Error('stats')))),
      fetch('/api/admin/shipments?limit=8', { headers }).then((r) => (r.ok ? r.json() : Promise.reject(new Error('shipments')))),
    ])
      .then(([s, list]) => {
        setStats(s);
        setRecent(list.data ?? []);
      })
      .catch(() => setError('Could not load the dashboard numbers. Try refreshing the page.'));
  }, []);

  const cards = stats
    ? [
        { label: 'Total shipments', value: stats.total_shipments, icon: '📦' },
        { label: 'In transit', value: stats.in_transit, icon: '🚚' },
        { label: 'Delivered', value: stats.delivered, icon: '✅' },
        { label: 'Users', value: stats.total_users, icon: '👥' },
      ]
    : [];

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-text-primary mb-2'>Dashboard</h1>
          <p className='text-text-secondary'>Live numbers from the shipment database.</p>
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

        <div className='bg-white border border-border rounded-lg overflow-hidden'>
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
                        {s.status.replace(/_/g, ' ')}
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
