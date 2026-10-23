'use client';

import { Fragment, useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Submission = {
  id: number;
  kind: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  payload: Record<string, unknown> | null;
  status: string;
  created_at: string;
};

const kindLabels: Record<string, string> = {
  contact: 'Contact',
  quote: 'Quote request',
  ship_now: 'Ship now',
  business_account: 'Business account',
};

const statuses = ['new', 'in_progress', 'closed'];

export default function ContactSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  const token = () => localStorage.getItem('adminToken') ?? '';

  const load = async () => {
    const params = new URLSearchParams({ limit: '200' });
    if (filter) params.set('status', filter);
    const res = await fetch(`/api/admin/contact-submissions?${params.toString()}`, { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      setError('Could not load the submissions.');
      return;
    }
    const j = await res.json();
    setItems(j.data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/contact-submissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError('Could not update the status.');
      return;
    }
    load();
  };

  const remove = async (id: number) => {
    if (!window.confirm('Delete this submission?')) return;
    const res = await fetch(`/api/admin/contact-submissions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) {
      setError('Could not delete the submission.');
      return;
    }
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-[36px] font-extrabold text-navy'>Contact forms</h1>
            <p>Messages and requests sent from the public site.</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className='h-[42px] px-3 border border-border rounded bg-white'>
            <option value=''>All</option>
            {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='bg-white border border-border rounded-xl overflow-hidden'>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'>
              <tr>
                <th className='px-4 py-3'>Received</th>
                <th className='px-4 py-3'>Type</th>
                <th className='px-4 py-3'>From</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td className='px-4 py-6' colSpan={5}>Nothing here yet.</td></tr>
              )}
              {items.map((s) => (
                <Fragment key={s.id}>
                  <tr className='border-t border-border'>
                    <td className='px-4 py-3'>{new Date(s.created_at).toLocaleString()}</td>
                    <td className='px-4 py-3'>{kindLabels[s.kind] ?? s.kind}</td>
                    <td className='px-4 py-3'>
                      <span className='font-bold text-navy'>{s.name}</span>
                      <br />
                      <span className='text-text-secondary'>{s.email}{s.company ? ` · ${s.company}` : ''}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <select value={s.status} onChange={(e) => setStatus(s.id, e.target.value)} className='h-[34px] px-2 border border-border rounded bg-white'>
                        {statuses.map((st) => <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <button type='button' onClick={() => setOpenId(openId === s.id ? null : s.id)} className='mr-4 font-bold text-primary'>
                        {openId === s.id ? 'Hide' : 'View'}
                      </button>
                      <button type='button' onClick={() => remove(s.id)} className='font-bold text-red-600'>Delete</button>
                    </td>
                  </tr>
                  {openId === s.id && (
                    <tr className='bg-light-gray'>
                      <td className='px-4 py-4' colSpan={5}>
                        {s.phone && <p><span className='font-bold'>Phone:</span> {s.phone}</p>}
                        {s.message && <p className='mt-2 whitespace-pre-line'><span className='font-bold'>Message:</span> {s.message}</p>}
                        {s.payload && Object.keys(s.payload).length > 0 && (
                          <dl className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2'>
                            {Object.entries(s.payload).map(([k, v]) => (
                              <div key={k}>
                                <dt className='text-[12px] font-bold uppercase tracking-wider text-primary'>{k}</dt>
                                <dd className='whitespace-pre-line'>{String(v) || '—'}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
