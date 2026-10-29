'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Item = { uid: number; from: string; subject: string; date: string | null; seen: boolean };
type Message = { uid: number; from: string; to: string; subject: string; date: string | null; text: string };

export default function InboxPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState<Message | null>(null);
  const [canReply, setCanReply] = useState(false);
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = () => localStorage.getItem('adminToken') ?? '';
  const auth = () => ({ Authorization: `Bearer ${token()}` });

  const load = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/inbox', { headers: auth() });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(j.error || 'Could not load the inbox.');
      return;
    }
    setItems(j.data ?? []);
  };

  useEffect(() => {
    load();
    fetch('/api/auth/me', { headers: auth() })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        const perms: string[] = me?.permissions ?? [];
        setCanReply(me?.role === 'admin' || perms.includes('inbox_reply'));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openMessage = async (uid: number) => {
    setError('');
    setMessage('');
    setReply('');
    const res = await fetch(`/api/admin/inbox/${uid}`, { headers: auth() });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not open this message.');
      return;
    }
    setOpen(j);
  };

  const send = async () => {
    if (!open || !reply.trim()) return;
    const sender = open.from.match(/<([^>]+)>/)?.[1] ?? open.from;
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/inbox/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth() },
      body: JSON.stringify({ to: sender, subject: open.subject, text: reply }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'The reply could not be sent.');
      return;
    }
    setMessage(`Reply sent to ${sender}.`);
    setReply('');
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Support inbox</h1>
          <p>Messages sent to the support mailbox. {canReply ? 'You can reply from here.' : 'You can read messages. Ask an administrator for reply access.'}</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start'>
          <div className='bg-white border border-border rounded-xl overflow-hidden'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
              <p className='font-bold text-navy'>Latest messages</p>
              <button type='button' onClick={load} disabled={loading} className='text-primary font-bold text-[14px] disabled:opacity-60'>{loading ? 'Loading...' : 'Refresh'}</button>
            </div>
            <ul className='divide-y divide-border max-h-[70vh] overflow-y-auto'>
              {items.length === 0 && !loading && <li className='px-4 py-6 text-text-secondary'>No messages.</li>}
              {items.map((it) => (
                <li key={it.uid}>
                  <button
                    type='button'
                    onClick={() => openMessage(it.uid)}
                    className={`w-full text-left px-4 py-3 hover:bg-light-gray ${open?.uid === it.uid ? 'bg-light-blue' : ''}`}
                  >
                    <p className={`text-[14px] truncate ${it.seen ? 'text-text-primary' : 'font-bold text-navy'}`}>{it.from}</p>
                    <p className='text-[14px] truncate'>{it.subject}</p>
                    <p className='text-[12px] text-text-secondary'>{it.date ? new Date(it.date).toLocaleString() : ''}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className='bg-white border border-border rounded-xl p-6 min-h-[300px]'>
            {!open && <p className='text-text-secondary'>Choose a message to read it.</p>}
            {open && (
              <div className='space-y-5'>
                <div>
                  <p className='text-[22px] font-extrabold text-navy break-words'>{open.subject}</p>
                  <p className='text-[14px] text-text-secondary break-words'>From {open.from}</p>
                  <p className='text-[14px] text-text-secondary break-words'>To {open.to}</p>
                  <p className='text-[14px] text-text-secondary'>{open.date ? new Date(open.date).toLocaleString() : ''}</p>
                </div>
                {/* Mail is shown as plain text only, so nothing in a message can run on this page. */}
                <pre className='whitespace-pre-wrap break-words font-sans text-[15px] text-text-primary bg-light-gray rounded-lg p-4'>{open.text || '(empty message)'}</pre>

                {canReply && (
                  <div className='space-y-3'>
                    <label className='block'>
                      <span className='text-[14px] font-bold'>Reply</span>
                      <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={6} className='mt-1 w-full px-3 py-2 border border-border rounded' />
                    </label>
                    <button type='button' onClick={send} disabled={!reply.trim()} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-50'>Send reply</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
