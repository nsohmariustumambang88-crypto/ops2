'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Item = { uid: number; from: string; subject: string; date: string | null; seen: boolean };
type Message = { uid: number; from: string; to: string; subject: string; date: string | null; text: string };
type Sent = { id: number; to_address: string; subject: string; body: string; sent_by: string | null; created_at: string };

const addressOf = (from: string) => from.match(/<([^>]+)>/)?.[1] ?? from;

export default function InboxPage() {
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [items, setItems] = useState<Item[]>([]);
  const [sent, setSent] = useState<Sent[]>([]);
  const [open, setOpen] = useState<Message | null>(null);
  const [openSent, setOpenSent] = useState<Sent | null>(null);
  const [replies, setReplies] = useState<Sent[]>([]);
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

  const loadSent = async () => {
    setError('');
    const res = await fetch('/api/admin/inbox/sent', { headers: auth() });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not load sent messages.');
      return;
    }
    setSent(j.data ?? []);
  };

  useEffect(() => {
    load();
    loadSent();
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
    setOpenSent(null);
    const res = await fetch(`/api/admin/inbox/${uid}`, { headers: auth() });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not open this message.');
      return;
    }
    setOpen(j);
    // The replies the team sent to this customer, so the whole conversation is in one place.
    const r = await fetch(`/api/admin/inbox/sent?to=${encodeURIComponent(addressOf(j.from))}`, { headers: auth() });
    const rj = await r.json().catch(() => ({}));
    setReplies(r.ok ? rj.data ?? [] : []);
  };

  const openSentMessage = (s: Sent) => {
    setOpen(null);
    setOpenSent(s);
  };

  const send = async () => {
    if (!open || !reply.trim()) return;
    const sender = addressOf(open.from);
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
    loadSent();
    openMessage(open.uid);
  };

  const tabButton = (value: 'received' | 'sent', label: string) => (
    <button
      type='button'
      onClick={() => { setTab(value); setOpen(null); setOpenSent(null); }}
      className={`flex-1 h-[42px] font-bold text-[14px] ${tab === value ? 'bg-primary text-white' : 'bg-white text-navy'}`}
    >
      {label}
    </button>
  );

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Support inbox</h1>
          <p>Messages from customers and the replies the team has sent. {canReply ? 'You can reply from here.' : 'You can read messages. Ask an administrator for reply access.'}</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start'>
          <div className='bg-white border border-border rounded-xl overflow-hidden'>
            <div className='flex border-b border-border'>
              {tabButton('received', `Received (${items.length})`)}
              {tabButton('sent', `Sent (${sent.length})`)}
            </div>
            <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
              <p className='font-bold text-navy'>{tab === 'received' ? 'Latest messages' : 'Replies you sent'}</p>
              <button type='button' onClick={() => { load(); loadSent(); }} disabled={loading} className='text-primary font-bold text-[14px] disabled:opacity-60'>{loading ? 'Loading...' : 'Refresh'}</button>
            </div>

            {tab === 'received' && (
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
            )}

            {tab === 'sent' && (
              <ul className='divide-y divide-border max-h-[70vh] overflow-y-auto'>
                {sent.length === 0 && <li className='px-4 py-6 text-text-secondary'>No replies sent yet.</li>}
                {sent.map((s) => (
                  <li key={s.id}>
                    <button
                      type='button'
                      onClick={() => openSentMessage(s)}
                      className={`w-full text-left px-4 py-3 hover:bg-light-gray ${openSent?.id === s.id ? 'bg-light-blue' : ''}`}
                    >
                      <p className='text-[14px] font-bold text-navy truncate'>To {s.to_address}</p>
                      <p className='text-[14px] truncate'>{s.subject}</p>
                      <p className='text-[12px] text-text-secondary'>{new Date(s.created_at).toLocaleString()}{s.sent_by ? ` · by ${s.sent_by}` : ''}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='bg-white border border-border rounded-xl p-6 min-h-[300px] space-y-6'>
            {!open && !openSent && <p className='text-text-secondary'>Choose a message to read it.</p>}

            {openSent && (
              <div className='space-y-4'>
                <div>
                  <p className='text-[22px] font-extrabold text-navy break-words'>{openSent.subject}</p>
                  <p className='text-[14px] text-text-secondary break-words'>To {openSent.to_address}</p>
                  <p className='text-[14px] text-text-secondary'>{new Date(openSent.created_at).toLocaleString()}{openSent.sent_by ? ` · sent by ${openSent.sent_by}` : ''}</p>
                </div>
                <pre className='whitespace-pre-wrap break-words font-sans text-[15px] text-text-primary bg-light-blue rounded-lg p-4'>{openSent.body}</pre>
              </div>
            )}

            {open && (
              <>
                <div className='space-y-5'>
                  <div>
                    <p className='text-[22px] font-extrabold text-navy break-words'>{open.subject}</p>
                    <p className='text-[14px] text-text-secondary break-words'>From {open.from}</p>
                    <p className='text-[14px] text-text-secondary break-words'>To {open.to}</p>
                    <p className='text-[14px] text-text-secondary'>{open.date ? new Date(open.date).toLocaleString() : ''}</p>
                  </div>
                  {/* Mail is shown as plain text only, so nothing in a message can run on this page. */}
                  <pre className='whitespace-pre-wrap break-words font-sans text-[15px] text-text-primary bg-light-gray rounded-lg p-4'>{open.text || '(empty message)'}</pre>
                </div>

                {replies.length > 0 && (
                  <div className='space-y-3'>
                    <p className='text-[13px] font-bold uppercase tracking-wider text-primary'>Replies sent to this customer</p>
                    {replies.map((r) => (
                      <div key={r.id} className='border-l-4 border-primary pl-4'>
                        <p className='text-[13px] text-text-secondary'>{new Date(r.created_at).toLocaleString()}{r.sent_by ? ` · ${r.sent_by}` : ''}</p>
                        <pre className='whitespace-pre-wrap break-words font-sans text-[15px] text-text-primary'>{r.body}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {canReply && (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-[14px] font-bold'>Reply to {addressOf(open.from)}</span>
                      <button type='button' onClick={send} disabled={!reply.trim()} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-50'>Send reply</button>
                    </div>
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={6} placeholder='Type your reply' className='w-full px-3 py-2 border border-border rounded' />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
