'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Customer = {
  id: number;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  volume_tier: string | null;
  total_shipments: number | null;
  total_spending: string | null;
  created_at: string;
};

const tiers = ['standard', 'silver', 'gold', 'platinum'];

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';

  const load = async () => {
    const res = await fetch('/api/admin/customers?limit=200', { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      setError('Could not load customers.');
      return;
    }
    setItems((await res.json()).data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeTier = async (id: number, volume_tier: string) => {
    setError('');
    setMessage('');
    const res = await fetch(`/api/admin/customers/${id}/tier`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ volume_tier }),
    });
    if (!res.ok) {
      setError('Could not change the tier.');
      return;
    }
    setMessage('Tier updated.');
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Customers</h1>
          <p>Business accounts, their volume tier and shipping totals.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'>
              <tr>
                <th className='px-4 py-3'>Business</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3'>Phone</th>
                <th className='px-4 py-3'>Tier</th>
                <th className='px-4 py-3'>Shipments</th>
                <th className='px-4 py-3'>Spending</th>
                <th className='px-4 py-3'>Joined</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td className='px-4 py-6' colSpan={7}>No customer accounts yet.</td></tr>}
              {items.map((c) => (
                <tr key={c.id} className='border-t border-border'>
                  <td className='px-4 py-3 font-bold text-navy'>{c.business_name || '—'}</td>
                  <td className='px-4 py-3'>{c.email || '—'}</td>
                  <td className='px-4 py-3'>{c.phone || '—'}</td>
                  <td className='px-4 py-3'>
                    <select value={c.volume_tier ?? 'standard'} onChange={(e) => changeTier(c.id, e.target.value)} className='h-[34px] px-2 border border-border rounded bg-white capitalize'>
                      {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className='px-4 py-3'>{c.total_shipments ?? 0}</td>
                  <td className='px-4 py-3'>{c.total_spending ? `$${Number(c.total_spending).toFixed(2)}` : '$0.00'}</td>
                  <td className='px-4 py-3'>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
