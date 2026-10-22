'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Shipment = {
  id: string;
  tracking_number: string;
  customer_id: string | null;
  status: string;
  weight: string | number | null;
  created_at: string;
};

const statuses = ['registered', 'picked_up', 'in_transit', 'held_at_customs', 'cleared_for_customs', 'out_for_delivery', 'delivered', 'exception'];

const statusStyle: Record<string, string> = {
  registered: 'bg-yellow-100 text-yellow-800',
  picked_up: 'bg-purple-100 text-purple-800',
  in_transit: 'bg-cyan-100 text-cyan-800',
  held_at_customs: 'bg-red-100 text-red-800',
  cleared_for_customs: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  exception: 'bg-red-100 text-red-800',
};

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    const params = new URLSearchParams({ limit: '50' });
    if (status !== 'all') params.set('status', status);
    setLoading(true);
    fetch(`/api/admin/shipments?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? 'Please sign in again.' : 'Could not load shipments.');
        return res.json();
      })
      .then((json) => setShipments(json.data ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = shipments.filter((s) => s.tracking_number.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Shipments</h1>
          <p className='text-text-primary'>Live shipments from the database.</p>
        </div>

        <div className='bg-white border border-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search tracking number'
            className='h-[42px] px-3 border border-border rounded text-[15px]'
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='h-[42px] px-3 border border-border rounded text-[15px]'
          >
            <option value='all'>All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-[14px]'>
            <thead className='bg-light-gray'>
              <tr className='text-left'>
                <th className='px-5 py-3'>Tracking number</th>
                <th className='px-5 py-3'>Status</th>
                <th className='px-5 py-3'>Weight</th>
                <th className='px-5 py-3'>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} className='px-5 py-6 text-center'>Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={4} className='px-5 py-6 text-center'>No shipments found.</td></tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} className='border-t border-border'>
                  <td className='px-5 py-3 font-bold text-navy'>{s.tracking_number}</td>
                  <td className='px-5 py-3'>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${statusStyle[s.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className='px-5 py-3'>{s.weight ?? '-'}</td>
                  <td className='px-5 py-3'>{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
