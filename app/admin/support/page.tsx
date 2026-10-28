'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Stats = { total_tickets: string; open_tickets: string; in_progress: string; urgent_tickets: string; avg_resolution_hours: string | null };
type Ticket = {
  id: number;
  ticket_number: string;
  subject: string;
  name: string | null;
  email: string | null;
  status: string;
  priority: string | null;
  message: string;
  created_at: string;
};

const statuses = ['', 'open', 'in_progress', 'closed'];

export default function SupportPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState('');
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';
  const auth = () => ({ Authorization: `Bearer ${token()}` });

  const load = async () => {
    const params = new URLSearchParams({ limit: '100' });
    if (filter) params.set('status', filter);
    const [s, t] = await Promise.all([
      fetch('/api/support/admin/stats', { headers: auth() }).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/support/admin/tickets?${params.toString()}`, { headers: auth() }).then((r) => (r.ok ? r.json() : null)),
    ]);
    setStats(s);
    setTickets(t?.data ?? []);
    if (!s && !t) setError('Could not load support.');
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const reply = async (id: number) => {
    const text = (replies[id] ?? '').trim();
    if (!text) return;
    setError('');
    setMessage('');
    const res = await fetch(`/api/support/admin/tickets/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth() },
      body: JSON.stringify({ message: text }),
    });
    if (!res.ok) {
      setError('Could not send the reply.');
      return;
    }
    setReplies({ ...replies, [id]: '' });
    setMessage('Reply sent.');
    load();
  };

  const cards = stats
    ? [
        { label: 'Total tickets', value: stats.total_tickets },
        { label: 'Open', value: stats.open_tickets },
        { label: 'In progress', value: stats.in_progress },
        { label: 'Urgent', value: stats.urgent_tickets },
      ]
    : [];

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-[36px] font-extrabold text-navy'>Support</h1>
            <p>Customer support tickets and replies.</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className='h-[42px] px-3 border border-border rounded bg-white capitalize'>
            {statuses.map((s) => <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All tickets'}</option>)}
          </select>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {cards.map((c) => (
            <div key={c.label} className='bg-blue-50 border border-border rounded-lg p-5'>
              <p className='text-sm text-text-secondary'>{c.label}</p>
              <p className='text-2xl font-bold text-text-primary'>{c.value}</p>
            </div>
          ))}
        </div>

        <div className='space-y-4'>
          {tickets.length === 0 && <p className='bg-white border border-border rounded-xl p-6'>No tickets here.</p>}
          {tickets.map((t) => (
            <div key={t.id} className='bg-white border border-border rounded-xl p-5'>
              <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-2'>
                <div>
                  <p className='text-[13px] font-bold text-primary'>{t.ticket_number}</p>
                  <p className='text-[18px] font-extrabold text-navy'>{t.subject}</p>
                  <p className='text-[14px] text-text-secondary'>{t.name || 'Customer'}{t.email ? ` · ${t.email}` : ''} · {new Date(t.created_at).toLocaleString()}</p>
                </div>
                <div className='flex gap-2 text-[13px] font-bold capitalize'>
                  <span className='px-3 py-1 rounded-full bg-light-gray'>{t.status.replace(/_/g, ' ')}</span>
                  {t.priority && <span className='px-3 py-1 rounded-full bg-light-gray'>{t.priority}</span>}
                </div>
              </div>
              <p className='mt-3 whitespace-pre-line text-[15px]'>{t.message}</p>
              <div className='mt-4 flex flex-col md:flex-row gap-3'>
                <textarea
                  rows={2}
                  value={replies[t.id] ?? ''}
                  onChange={(e) => setReplies({ ...replies, [t.id]: e.target.value })}
                  placeholder='Write a reply'
                  className='flex-1 px-3 py-2 border border-border rounded'
                />
                <button type='button' onClick={() => reply(t.id)} className='h-[42px] px-6 rounded bg-primary text-white font-bold md:self-start'>Send reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
