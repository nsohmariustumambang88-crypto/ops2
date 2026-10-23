'use client';

import { useState, type FormEvent } from 'react';
import Container from '@/components/ui/Container';

const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<{ type: 'sending' | 'sent' | 'error'; text: string } | null>(null);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'sending', text: 'Sending...' });
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'contact', ...form, payload: form }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ type: 'error', text: j.error || 'Your message could not be sent. Please try again.' });
      return;
    }
    setStatus({ type: 'sent', text: j.message });
    setForm({ name: '', company: '', email: '', phone: '', message: '' });
  };

  return (
    <div className='bg-white'>
      <section className='py-16 md:py-20'>
        <Container>
          <div className='mx-auto max-w-[720px]'>
            <p className='text-xs font-bold uppercase tracking-widest text-primary mb-3'>Contact us</p>
            <h1 className='text-[40px] md:text-[50px] font-extrabold text-navy mb-4'>Talk to a person</h1>
            <p className='text-text-primary mb-8'>
              Send us a message and a member of our team will reply. For a shipment that is moving now, call +1 856-428-7703, open around the clock.
            </p>

            <form onSubmit={submit} className='space-y-5 bg-white border border-border rounded-xl p-6 md:p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <label>
                  <span className='text-[14px] font-bold'>Name</span>
                  <input required value={form.name} onChange={set('name')} className={input} />
                </label>
                <label>
                  <span className='text-[14px] font-bold'>Company</span>
                  <input value={form.company} onChange={set('company')} className={input} />
                </label>
                <label>
                  <span className='text-[14px] font-bold'>Email</span>
                  <input type='email' required value={form.email} onChange={set('email')} className={input} />
                </label>
                <label>
                  <span className='text-[14px] font-bold'>Phone</span>
                  <input type='tel' value={form.phone} onChange={set('phone')} className={input} />
                </label>
              </div>
              <label className='block'>
                <span className='text-[14px] font-bold'>Message</span>
                <textarea required rows={6} value={form.message} onChange={set('message')} className='mt-1 w-full px-3 py-2 border border-border rounded' />
              </label>

              {status && (
                <p role='status' className={status.type === 'error' ? 'text-red-700 font-bold' : 'text-primary font-bold'}>{status.text}</p>
              )}

              <button type='submit' disabled={status?.type === 'sending'} className='h-[42px] px-8 rounded bg-primary text-white font-bold disabled:opacity-60'>
                Send message
              </button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
}
