'use client';

import { useState, type FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';
const area = 'mt-1 w-full px-3 py-2 border border-border rounded text-[15px]';

type Result = { sent: number; failed: string[] };

export default function EmailPage() {
  const [subscribers, setSubscribers] = useState(false);
  const [admins, setAdmins] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [subject, setSubject] = useState('');
  const [heading, setHeading] = useState('');
  const [message, setMessage] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [sending, setSending] = useState(false);

  const token = () => localStorage.getItem('adminToken') ?? '';

  const paragraphs = message.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const addressCount = addresses.split(/[\s,;]+/).filter((a) => a.includes('@')).length;

  const send = async (test: boolean) => {
    setError('');
    setNotice('');
    setResult(null);
    if (!test) {
      const count = addressCount + (subscribers ? 1 : 0) + (admins ? 1 : 0);
      if (count === 0) {
        setError('Add at least one address, or tick an audience.');
        return;
      }
      if (!window.confirm('Send this email now to the addresses and audience you chose?')) return;
    }
    setSending(true);
    const res = await fetch('/api/admin/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({
        test,
        subscribers,
        admins,
        addresses,
        subject,
        heading,
        message,
        button_label: buttonLabel,
        button_url: buttonUrl,
      }),
    });
    const j = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setError(j.error || 'The email could not be sent.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setResult({ sent: j.sent ?? 0, failed: j.failed ?? [] });
    setNotice(test ? 'Test email sent to your address.' : `Email sent to ${j.sent ?? 0} address(es).`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(false);
  };

  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Send email</h1>
          <p>Write an email to subscribers, the admin team, or any addresses you type in. Send a test to yourself first.</p>
        </div>

        {notice && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{notice}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}
        {result && result.failed.length > 0 && (
          <div role='alert' className='rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-5 py-4'>
            <p className='font-bold mb-1'>Not sent to {result.failed.length} address(es):</p>
            <p className='text-[14px] break-words'>{result.failed.join(', ')}</p>
          </div>
        )}

        <form onSubmit={submit} className='bg-white border border-border rounded-xl p-6 space-y-6'>
          <fieldset>
            <legend className='text-[14px] font-bold mb-2'>Audience</legend>
            <div className='flex flex-col sm:flex-row gap-4'>
              <label className='flex items-center gap-2 text-[15px]'>
                <input type='checkbox' checked={subscribers} onChange={(e) => setSubscribers(e.target.checked)} className='w-4 h-4' />
                All email subscribers
              </label>
              <label className='flex items-center gap-2 text-[15px]'>
                <input type='checkbox' checked={admins} onChange={(e) => setAdmins(e.target.checked)} className='w-4 h-4' />
                All active admin accounts
              </label>
            </div>
          </fieldset>

          <label className='block'>
            <span className='text-[14px] font-bold'>Addresses (separate with commas, spaces or new lines)</span>
            <textarea rows={3} value={addresses} onChange={(e) => setAddresses(e.target.value)} placeholder='name@example.com, another@example.com' className={area} />
            <span className='text-[12px] text-text-secondary'>{addressCount} valid address(es) typed. Up to 300 per send.</span>
          </label>

          <label className='block'>
            <span className='text-[14px] font-bold'>Subject (what the reader sees in the inbox)<span className='text-red-600'> *</span></span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder='New tariffs from 1 November' className={input} />
          </label>

          <label className='block'>
            <span className='text-[14px] font-bold'>Heading (large title inside the email)<span className='text-red-600'> *</span></span>
            <input value={heading} onChange={(e) => setHeading(e.target.value)} required placeholder='Our new rates are ready' className={input} />
          </label>

          <label className='block'>
            <span className='text-[14px] font-bold'>Message</span>
            <textarea rows={8} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={'Write the message. Leave a blank line to start a new paragraph.'} className={area} />
          </label>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label className='block'>
              <span className='text-[14px] font-bold'>Button text (optional)</span>
              <input value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} placeholder='Track your shipment' className={input} />
            </label>
            <label className='block'>
              <span className='text-[14px] font-bold'>Button link (optional)</span>
              <input type='url' value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} placeholder='https://opslogistice.com/track' className={input} />
            </label>
          </div>

          <div className='flex flex-col sm:flex-row sm:justify-end gap-3'>
            <button type='button' disabled={sending || !subject || !heading} onClick={() => send(true)} className='h-[42px] px-6 rounded border border-primary text-primary font-bold disabled:opacity-50'>
              Send test to me
            </button>
            <button type='submit' disabled={sending} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
              {sending ? 'Sending...' : 'Send email'}
            </button>
          </div>
        </form>

        <section className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary mb-4'>Preview</p>
          <div className='max-w-[560px] mx-auto border border-border rounded-xl overflow-hidden'>
            <div className='bg-navy text-white text-center py-3'>
              <p className='text-[14px] font-extrabold tracking-widest'>OPS LOGISTICS</p>
            </div>
            <div className='p-6'>
              <h2 className='text-[24px] font-extrabold text-navy break-words'>{heading || 'Heading'}</h2>
              {paragraphs.length === 0 && <p className='text-text-secondary'>Your message appears here.</p>}
              {paragraphs.map((p, i) => <p key={i} className='text-[15px] whitespace-pre-line break-words mt-3'>{p}</p>)}
              {buttonLabel && buttonUrl && (
                <p className='mt-5 text-center'>
                  <span className='inline-block bg-primary text-white font-bold px-5 py-2.5 rounded-lg'>{buttonLabel}</span>
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
