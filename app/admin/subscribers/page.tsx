'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Subscriber = { id: number; email: string; created_at: string };

export default function SubscribersPage() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';

  const load = () =>
    fetch('/api/admin/subscribers', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j: { data: Subscriber[] }) => setRows(j.data))
      .catch(() => setError('Could not load subscribers.'));

  useEffect(() => {
    load();
  }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ email }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not add the subscriber.');
      return;
    }
    setEmail('');
    setMessage('Subscriber added.');
    load();
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      setError('Could not remove the subscriber.');
      return;
    }
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Subscribers</h1>
          <p>People who signed up for the newsletter.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <form onSubmit={add} className='bg-white border border-border rounded-xl p-5 flex flex-col md:flex-row gap-3'>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='name@example.com'
            className='flex-1 h-[42px] px-3 border border-border rounded text-[15px]'
          />
          <button type='submit' className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Add subscriber</button>
        </form>

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-[14px]'>
            <thead className='bg-light-gray'>
              <tr className='text-left'>
                <th className='px-5 py-3'>Email</th>
                <th className='px-5 py-3'>Subscribed</th>
                <th className='px-5 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={3} className='px-5 py-6 text-center'>No subscribers yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.id} className='border-t border-border'>
                  <td className='px-5 py-3'>{r.email}</td>
                  <td className='px-5 py-3'>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className='px-5 py-3 text-right'>
                    <button type='button' onClick={() => remove(r.id)} className='text-red-700 font-bold hover:underline'>Remove</button>
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
