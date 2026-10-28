'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Order = {
  id: number;
  order_number: string;
  customer_id: number;
  total_amount: string;
  payment_status: string;
  order_status: string | null;
  created_at: string;
};

const paymentFilters = ['', 'paid', 'pending', 'failed', 'refunded'];

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    const params = new URLSearchParams({ limit: '200' });
    if (filter) params.set('payment_status', filter);
    fetch(`/api/admin/orders?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('orders'))))
      .then((j) => { setItems(j.data ?? []); setError(''); })
      .catch(() => setError('Could not load orders.'));
  }, [filter]);

  const total = items.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-[36px] font-extrabold text-navy'>Orders</h1>
            <p>Customer orders and their payment status. Showing {items.length} order{items.length === 1 ? '' : 's'}, totalling ${total.toFixed(2)}.</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className='h-[42px] px-3 border border-border rounded bg-white capitalize'>
            {paymentFilters.map((p) => <option key={p} value={p}>{p || 'All payments'}</option>)}
          </select>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'>
              <tr>
                <th className='px-4 py-3'>Order</th>
                <th className='px-4 py-3'>Customer</th>
                <th className='px-4 py-3'>Total</th>
                <th className='px-4 py-3'>Payment</th>
                <th className='px-4 py-3'>Order status</th>
                <th className='px-4 py-3'>Placed</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td className='px-4 py-6' colSpan={6}>No orders yet.</td></tr>}
              {items.map((o) => (
                <tr key={o.id} className='border-t border-border'>
                  <td className='px-4 py-3 font-bold text-navy'>{o.order_number}</td>
                  <td className='px-4 py-3'>#{o.customer_id}</td>
                  <td className='px-4 py-3'>${Number(o.total_amount).toFixed(2)}</td>
                  <td className='px-4 py-3 capitalize'>{o.payment_status}</td>
                  <td className='px-4 py-3 capitalize'>{(o.order_status || '—').replace(/_/g, ' ')}</td>
                  <td className='px-4 py-3'>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
