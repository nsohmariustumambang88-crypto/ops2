'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type User = { id: number; email: string; first_name: string | null; last_name: string | null; role: string; created_at: string };

const roles = ['admin', 'support', 'customer'];

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'support' });

  const token = () => localStorage.getItem('adminToken') ?? '';

  const load = () =>
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j: User[] | { data: User[] }) => setRows(Array.isArray(j) ? j : j.data))
      .catch(() => setError('Could not load users.'));

  useEffect(() => {
    load();
  }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not create the user.');
      return;
    }
    setForm({ email: '', password: '', first_name: '', last_name: '', role: 'support' });
    setMessage('User created.');
    load();
  };

  const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Users</h1>
          <p>Staff and customer accounts. Admins can sign in to this panel.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <form onSubmit={add} className='bg-white border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <label><span className='text-[14px] font-bold'>Email</span>
            <input type='email' required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
          </label>
          <label><span className='text-[14px] font-bold'>Temporary password</span>
            <input type='password' required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
          </label>
          <label><span className='text-[14px] font-bold'>First name</span>
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={input} />
          </label>
          <label><span className='text-[14px] font-bold'>Last name</span>
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={input} />
          </label>
          <label className='md:col-span-2'><span className='text-[14px] font-bold'>Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={input}>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <div className='md:col-span-2'>
            <button type='submit' className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Create user</button>
          </div>
        </form>

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-[14px]'>
            <thead className='bg-light-gray'>
              <tr className='text-left'>
                <th className='px-5 py-3'>Name</th>
                <th className='px-5 py-3'>Email</th>
                <th className='px-5 py-3'>Role</th>
                <th className='px-5 py-3'>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={4} className='px-5 py-6 text-center'>No users found.</td></tr>}
              {rows.map((u) => (
                <tr key={u.id} className='border-t border-border'>
                  <td className='px-5 py-3'>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '-'}</td>
                  <td className='px-5 py-3'>{u.email}</td>
                  <td className='px-5 py-3 capitalize'>{u.role}</td>
                  <td className='px-5 py-3'>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
