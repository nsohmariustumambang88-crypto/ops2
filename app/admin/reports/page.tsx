'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type RevenueRow = { date: string; orders: string; revenue: string };
type ServiceRow = { service_type: string | null; count: string; avg_weight: string | null };

const input = 'h-[42px] px-3 border border-border rounded bg-white';

export default function ReportsPage() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [revenue, setRevenue] = useState<RevenueRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    const headers = { Authorization: `Bearer ${token}` };
    const params = new URLSearchParams();
    if (start) params.set('start_date', start);
    if (end) params.set('end_date', end);

    Promise.all([
      fetch(`/api/admin/reports/revenue?${params.toString()}`, { headers }).then((r) => (r.ok ? r.json() : Promise.reject(new Error('revenue')))),
      fetch('/api/admin/reports/shipments', { headers }).then((r) => (r.ok ? r.json() : Promise.reject(new Error('shipments')))),
    ])
      .then(([rev, ship]) => {
        setRevenue(Array.isArray(rev) ? rev : []);
        setServices(Array.isArray(ship) ? ship : []);
        setError('');
      })
      .catch(() => setError('Could not load the reports.'));
  }, [start, end]);

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.revenue || 0), 0);
  const totalOrders = revenue.reduce((sum, r) => sum + Number(r.orders || 0), 0);
  const totalShipments = services.reduce((sum, s) => sum + Number(s.count || 0), 0);

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
          <div>
            <h1 className='text-[36px] font-extrabold text-navy'>Reports</h1>
            <p>Paid revenue by day and shipments by service.</p>
          </div>
          <div className='flex gap-3 items-end'>
            <label className='block'>
              <span className='text-[13px] font-bold'>From</span>
              <input type='date' value={start} onChange={(e) => setStart(e.target.value)} className={`${input} block`} />
            </label>
            <label className='block'>
              <span className='text-[13px] font-bold'>To</span>
              <input type='date' value={end} onChange={(e) => setEnd(e.target.value)} className={`${input} block`} />
            </label>
          </div>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-blue-50 border border-border rounded-lg p-6'>
            <p className='text-sm text-text-secondary'>Paid revenue (selected range)</p>
            <p className='text-2xl font-bold text-text-primary'>${totalRevenue.toFixed(2)}</p>
          </div>
          <div className='bg-blue-50 border border-border rounded-lg p-6'>
            <p className='text-sm text-text-secondary'>Paid orders</p>
            <p className='text-2xl font-bold text-text-primary'>{totalOrders}</p>
          </div>
          <div className='bg-blue-50 border border-border rounded-lg p-6'>
            <p className='text-sm text-text-secondary'>Shipments registered</p>
            <p className='text-2xl font-bold text-text-primary'>{totalShipments}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white border border-border rounded-xl overflow-hidden'>
            <h2 className='px-5 py-4 text-[18px] font-extrabold text-navy border-b border-border'>Revenue by day</h2>
            <table className='w-full text-left text-[14px]'>
              <thead className='bg-light-gray'>
                <tr><th className='px-4 py-3'>Date</th><th className='px-4 py-3'>Orders</th><th className='px-4 py-3'>Revenue</th></tr>
              </thead>
              <tbody>
                {revenue.length === 0 && <tr><td className='px-4 py-6' colSpan={3}>No paid orders in this range.</td></tr>}
                {revenue.map((r) => (
                  <tr key={r.date} className='border-t border-border'>
                    <td className='px-4 py-3'>{new Date(r.date).toLocaleDateString()}</td>
                    <td className='px-4 py-3'>{r.orders}</td>
                    <td className='px-4 py-3'>${Number(r.revenue).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='bg-white border border-border rounded-xl overflow-hidden'>
            <h2 className='px-5 py-4 text-[18px] font-extrabold text-navy border-b border-border'>Shipments by service</h2>
            <table className='w-full text-left text-[14px]'>
              <thead className='bg-light-gray'>
                <tr><th className='px-4 py-3'>Service</th><th className='px-4 py-3'>Shipments</th><th className='px-4 py-3'>Average weight (kg)</th></tr>
              </thead>
              <tbody>
                {services.length === 0 && <tr><td className='px-4 py-6' colSpan={3}>No shipments yet.</td></tr>}
                {services.map((s) => (
                  <tr key={s.service_type ?? 'none'} className='border-t border-border'>
                    <td className='px-4 py-3 capitalize'>{s.service_type || 'Not set'}</td>
                    <td className='px-4 py-3'>{s.count}</td>
                    <td className='px-4 py-3'>{s.avg_weight ? Number(s.avg_weight).toFixed(1) : '—'}</td>
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
