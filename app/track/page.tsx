'use client';

import { FormEvent, useState } from 'react';
import Container from '@/components/ui/Container';

type TrackingEvent = { status: string; location: string | null; timestamp: string; notes: string | null };
type TrackResult = {
  shipment: { tracking_number: string; status: string; shipment_type: string; service_type: string; created_at: string };
  tracking_history: TrackingEvent[];
};

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);
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
        setError('No shipment found with that tracking number. Check the number and try again.');
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
    <div className="bg-white text-black">
      <section className="py-16 md:py-20 bg-navy text-white">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-3">Track a shipment</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Where is my parcel?</h1>
            <p className="text-white/90 mb-8">Enter the tracking number from your booking confirmation to see every scan.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="tracking" className="sr-only">Tracking number</label>
              <input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. OPS1717000000ABC123"
                className="flex-1 px-4 py-3 rounded-lg text-black bg-white border border-border focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 font-bold rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </form>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {error && (
              <div role="alert" className="rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-8">
                <div className="rounded-xl border border-border p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Tracking number</p>
                  <p className="text-xl font-bold text-navy break-all">{result.shipment.tracking_number}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm">
                    <div>
                      <p className="font-bold text-navy">Status</p>
                      <p className="capitalize">{result.shipment.status}</p>
                    </div>
                    <div>
                      <p className="font-bold text-navy">Service</p>
                      <p className="capitalize">{result.shipment.service_type}</p>
                    </div>
                    <div>
                      <p className="font-bold text-navy">Booked</p>
                      <p>{new Date(result.shipment.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-navy mb-4">Tracking history</h2>
                  {result.tracking_history.length === 0 ? (
                    <p>No scans yet. Updates appear here as the parcel moves.</p>
                  ) : (
                    <ol className="space-y-4 border-l-2 border-primary pl-6">
                      {result.tracking_history.map((event, i) => (
                        <li key={i}>
                          <p className="font-bold capitalize">{event.status}</p>
                          <p className="text-sm">
                            {event.location ? `${event.location} · ` : ''}
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.notes && <p className="text-sm mt-1">{event.notes}</p>}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
