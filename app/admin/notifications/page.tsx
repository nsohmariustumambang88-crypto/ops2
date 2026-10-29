'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

type Notification = {
  id: number;
  shipment_id: number | null;
  reference: string | null;
  recipient_email: string;
  audience: string;
  subject: string;
  status: string;
  error: string | null;
  created_at: string;
  sent_at: string | null;
};

const statusStyle: Record<string, string> = {
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  queued: 'bg-amber-100 text-amber-900',
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const token = () => localStorage.getItem('adminToken') ?? '';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ limit: '200' });
    if (status !== 'all') params.set('status', status);
    const res = await fetch(`/api/admin/notifications?${params.toString()}`, { headers: { Authorization: `Bearer ${token()}` } });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(j.error || 'Could not load the notifications.');
      return;
    }
    setItems(j.data ?? []);
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  // Delete is only shown to admins and to team members granted the delete permission.
  useEffect(() => {
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => setCanDelete(me?.role === 'admin' || (me?.permissions ?? []).includes('shipments_delete')));
  }, []);

  const retry = async () => {
    setError('');
    setMessage('Retrying failed emails...');
    const res = await fetch('/api/admin/notifications/retry', { method: 'POST', headers: { Authorization: `Bearer ${token()}` } });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage('');
      setError(j.error || 'The retry could not run.');
      return;
    }
    if (!j.configured) {
      setMessage('');
      setError('Email is not configured yet. Add the SMTP settings in Vercel first.');
      return;
    }
    setMessage(`Retried ${j.retried} email(s). ${j.sent} sent.`);
    load();
  };

  const failedCount = items.filter((i) => i.status === 'failed').length;

  // Removes the record from this list only. An email that was already sent cannot be recalled.
  const removeOne = async (id: number) => {
    if (!window.confirm('Delete this email record? It does not recall an email that was already sent.')) return;
    const res = await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Could not delete this record.');
      return;
    }
    setMessage('Email record deleted.');
    load();
  };

  const removeFailed = async () => {
    if (!window.confirm(`Delete all ${failedCount} failed email records? This cannot be undone.`)) return;
    const res = await fetch('/api/admin/notifications?status=failed', { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not delete the failed records.');
      return;
    }
    setMessage(`Deleted ${j.deleted ?? 0} failed email record(s).`);
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Notifications</h1>
          <p>Every email sent for a shipment update, with its delivery result. Failed emails show the reason.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between'>
          <label className='flex items-center gap-3'>
            <span className='text-[14px] font-bold'>Show</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className='h-[42px] px-3 border border-border rounded text-[15px]'>
              <option value='all'>All emails</option>
              <option value='sent'>Sent</option>
              <option value='failed'>Failed</option>
              <option value='queued'>Waiting to send</option>
            </select>
          </label>
          <div className='flex gap-3'>
            <button type='button' onClick={load} disabled={loading} className='h-[42px] px-5 rounded border border-border font-bold disabled:opacity-60'>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button type='button' onClick={retry} disabled={failedCount === 0 && status !== 'failed'} className='h-[42px] px-5 rounded bg-primary text-white font-bold disabled:opacity-50'>
              Retry failed
            </button>
            {canDelete && (
              <button type='button' onClick={removeFailed} disabled={failedCount === 0 && status !== 'failed'} className='h-[42px] px-5 rounded border border-red-300 text-red-700 font-bold disabled:opacity-50'>
                Delete failed
              </button>
            )}
          </div>
        </div>

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'>
              <tr>
                <th className='px-4 py-3'>Time</th>
                <th className='px-4 py-3'>Shipment</th>
                <th className='px-4 py-3'>To</th>
                <th className='px-4 py-3'>Copy</th>
                <th className='px-4 py-3'>Subject</th>
                <th className='px-4 py-3'>Result</th>
                <th className='px-4 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading && <tr><td className='px-4 py-6' colSpan={7}>No emails yet.</td></tr>}
              {items.map((n) => (
                <tr key={n.id} className='border-t border-border align-top'>
                  <td className='px-4 py-3 whitespace-nowrap'>{new Date(n.created_at).toLocaleString()}</td>
                  <td className='px-4 py-3 font-bold text-navy'>
                    {n.shipment_id ? <Link href={`/admin/shipments/${n.shipment_id}`} className='hover:underline'>{n.reference}</Link> : '—'}
                  </td>
                  <td className='px-4 py-3 break-all'>{n.recipient_email}</td>
                  <td className='px-4 py-3 capitalize'>{n.audience === 'admin' ? 'Admin copy' : 'Customer'}</td>
                  <td className='px-4 py-3 break-words max-w-[280px]'>{n.subject}</td>
                  <td className='px-4 py-3'>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold capitalize ${statusStyle[n.status] ?? 'bg-gray-100 text-gray-800'}`}>{n.status}</span>
                    {n.sent_at && <p className='text-[12px] text-text-secondary mt-1'>Sent {new Date(n.sent_at).toLocaleString()}</p>}
                    {n.error && <p className='text-[12px] text-red-700 mt-1 break-words max-w-[260px]'>{n.error}</p>}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    {canDelete && <button type='button' onClick={() => removeOne(n.id)} className='font-bold text-red-700'>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
