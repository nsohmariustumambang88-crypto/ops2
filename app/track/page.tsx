'use client';

import { FormEvent, useState } from 'react';
import Container from '@/components/ui/Container';
import TrackResult, { type TrackEvent, type TrackShipment } from '@/components/track/TrackResult';

type Result = { shipment: TrackShipment; tracking_history: TrackEvent[] };

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const number = trackingNumber.trim();
    if (!number) return;

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(number)}`);
      if (res.status === 404) {
        setError('No shipment found with that reference. Check the number and try again.');
      } else if (!res.ok) {
        setError('We could not load this shipment right now. Please try again in a few minutes.');
      } else {
        setResult(await res.json());
      }
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-white text-black'>
      <section className='py-16 md:py-20 bg-navy text-white'>
        <Container>
          <div className='mx-auto max-w-[720px] text-center'>
            <p className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>Track a shipment</p>
            <h1 className='text-[40px] md:text-[50px] font-extrabold mb-4'>Where is my parcel?</h1>
            <p className='text-white/90 mb-8'>Enter the reference number from your receipt, for example OPS75983-895.</p>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-3'>
              <label htmlFor='tracking' className='sr-only'>Reference number</label>
              <input
                id='tracking'
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder='OPS75983-895'
                className='flex-1 h-[42px] px-4 text-[17px] rounded-lg text-black bg-white border border-border focus:outline-none focus:border-primary'
              />
              <button
                type='submit'
                disabled={loading}
                className='h-[42px] px-8 text-[18px] font-bold rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-60'
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </form>
          </div>
        </Container>
      </section>

      <section className='py-12 md:py-16'>
        <Container>
          <div className='mx-auto max-w-[1107px]'>
            {error && (
              <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>
                {error}
              </div>
            )}
            {result && <TrackResult shipment={result.shipment} events={result.tracking_history} />}
          </div>
        </Container>
      </section>
    </div>
  );
}
