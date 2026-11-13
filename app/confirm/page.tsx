'use client';

import { useEffect, useState } from 'react';

type Summary = {
  reference: string;
  status: string;
  carrier: string | null;
  transport_mode: string | null;
  service_type: string | null;
  shipment_type: string | null;
  weight: string | number | null;
  route_origin: string | null;
  route_destination: string | null;
  sender_city: string | null;
  sender_country: string | null;
  receiver_city: string | null;
  receiver_country: string | null;
  pickup_at: string | null;
  arrival_at: string | null;
  pet_name: string | null;
  pet_species: string | null;
  receiver_response: string | null;
  receiver_responded_at: string | null;
};

const dt = (v: string | null) => (v ? new Date(v).toLocaleString() : '—');
const place = (city: string | null, country: string | null) => [city, country].filter(Boolean).join(', ') || '—';

export default function ConfirmPage() {
  const [token, setToken] = useState('');
  const [shipment, setShipment] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [note, setNote] = useState('');
  const [done, setDone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token') ?? '';
    setToken(t);
    if (!t) {
      setError('This link is not valid. Use the link from your shipment email.');
      setLoading(false);
      return;
    }
    fetch(`/api/shipments/confirm?token=${encodeURIComponent(t)}`, { cache: 'no-store' })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'This link is not valid or has expired.');
        setShipment(j.shipment);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const send = async (answer: 'confirm' | 'issue') => {
    setError('');
    setSaving(true);
    const res = await fetch('/api/shipments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answer, note }),
    });
    const j = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(j.error || 'Your answer could not be saved. Please try again.');
      return;
    }
    setDone(j.message);
    setReporting(false);
  };

  return (
    <main className='bg-light-gray min-h-[70vh] py-10 px-4'>
      <div className='max-w-[560px] mx-auto bg-white rounded-2xl border border-border shadow-deep p-6 md:p-8 space-y-6'>
        <div>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>OPS Logistics</p>
          <h1 className='text-[28px] font-extrabold text-navy'>Confirm your shipment</h1>
        </div>

        {loading && <p className='text-text-secondary'>Loading your shipment...</p>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        {shipment && !done && (
          <>
            <div className='rounded-xl border border-border p-5 space-y-2 text-[15px]'>
              <p><span className='text-text-secondary'>Reference: </span><span className='font-bold text-navy'>{shipment.reference}</span></p>
              <p><span className='text-text-secondary'>Courier: </span><span className='font-bold'>{shipment.carrier || 'OPS Logistics'}</span></p>
              <p><span className='text-text-secondary'>Transport: </span><span className='font-bold capitalize'>{shipment.transport_mode || '—'}</span></p>
              <p><span className='text-text-secondary'>From: </span><span className='font-bold'>{place(shipment.sender_city, shipment.sender_country)}</span></p>
              <p><span className='text-text-secondary'>Origin: </span><span className='font-bold'>{shipment.route_origin || '—'}</span></p>
              <p><span className='text-text-secondary'>To: </span><span className='font-bold'>{place(shipment.receiver_city, shipment.receiver_country)}</span></p>
              <p><span className='text-text-secondary'>Destination: </span><span className='font-bold'>{shipment.route_destination || '—'}</span></p>
              <p><span className='text-text-secondary'>Picked up: </span><span className='font-bold'>{dt(shipment.pickup_at)}</span></p>
              <p><span className='text-text-secondary'>Estimated arrival: </span><span className='font-bold'>{dt(shipment.arrival_at)}</span></p>
              <p><span className='text-text-secondary'>Weight: </span><span className='font-bold'>{shipment.weight ? `${shipment.weight} kg` : '—'}</span></p>
              {shipment.shipment_type === 'pet' && (
                <p><span className='text-text-secondary'>Pet: </span><span className='font-bold'>{[shipment.pet_name, shipment.pet_species].filter(Boolean).join(', ') || '—'}</span></p>
              )}
            </div>

            {shipment.receiver_response && (
              <p className='rounded-xl bg-light-blue px-5 py-4 text-navy text-[15px]'>
                You already answered this shipment
                {shipment.receiver_response === 'issue' ? ' and reported a problem.' : ' and confirmed the details.'} You can answer again below if anything changes.
              </p>
            )}

            {!reporting && (
              <div className='flex flex-col sm:flex-row gap-3'>
                <button type='button' disabled={saving} onClick={() => send('confirm')} className='h-[46px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
                  {saving ? 'Saving...' : 'Yes, the details are correct'}
                </button>
                <button type='button' disabled={saving} onClick={() => setReporting(true)} className='h-[46px] px-6 rounded border border-primary text-primary font-bold disabled:opacity-60'>
                  Something is wrong
                </button>
              </div>
            )}

            {reporting && (
              <div className='space-y-3'>
                <label className='block'>
                  <span className='text-[14px] font-bold'>What is wrong?</span>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='For example: the delivery address or the receiver name is wrong.'
                    className='mt-1 w-full px-3 py-2 border border-border rounded'
                  />
                </label>
                <div className='flex gap-3'>
                  <button type='button' disabled={saving || !note.trim()} onClick={() => send('issue')} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
                    {saving ? 'Sending...' : 'Send to OPS'}
                  </button>
                  <button type='button' onClick={() => setReporting(false)} className='h-[42px] px-6 rounded border border-border font-bold'>Back</button>
                </div>
              </div>
            )}
          </>
        )}

        {done && <p role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{done}</p>}
      </div>
    </main>
  );
}
