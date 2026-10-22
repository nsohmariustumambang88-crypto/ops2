'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

type Event = { id: string; status: string; location: string | null; notes: string | null; timestamp: string };
type Detail = { shipment: { id: string; tracking_number: string; status: string; weight: string | number | null; created_at: string }; events: Event[] };

const statuses = ['registered', 'picked_up', 'in_transit', 'held_at_customs', 'cleared_for_customs', 'out_for_delivery', 'delivered', 'exception'];

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('in_transit');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [trackMsg, setTrackMsg] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';

  const trackRegistration = async () => {
    if (!detail) return;
    const ref = detail.shipment.tracking_number;
    setTrackMsg('Checking...');
    const res = await fetch(`/api/tracking/${encodeURIComponent(ref)}`);
    if (!res.ok) {
      setTrackMsg(`Registration ${ref} was not found.`);
      return;
    }
    const j = await res.json();
    setTrackMsg(`Registration ${ref} is valid. Current status: ${String(j.status).replace(/_/g, ' ')}.`);
  };

  const load = async () => {
    const res = await fetch(`/api/admin/shipments/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      setError(res.status === 404 ? 'Shipment not found.' : 'Could not load this shipment.');
      return;
    }
    setDetail(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch(`/api/admin/shipments/${id}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status, location, notes }),
    });
    setSaving(false);
    if (!res.ok) {
      setError('Could not save the update.');
      return;
    }
    setLocation('');
    setNotes('');
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        {detail && (
          <>
            <div>
              <div className='flex items-center justify-between gap-4'>
                <h1 className='text-[36px] font-extrabold text-navy'>{detail.shipment.tracking_number}</h1>
                <div className='flex gap-3'>
                  <button type='button' onClick={trackRegistration} className='h-[42px] px-5 rounded border border-primary text-primary font-bold'>Track</button>
                  <Link href={`/admin/shipments/${id}/edit`} className='h-[42px] px-5 inline-flex items-center rounded border border-border font-bold'>Edit shipment</Link>
                </div>
              </div>
              <p className='text-text-primary'>Current status: <span className='font-bold capitalize'>{detail.shipment.status.replace(/_/g, ' ')}</span></p>
              {trackMsg && <p role='status' className='mt-2 text-primary font-bold'>{trackMsg}</p>}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <section className='bg-white border border-border rounded-xl p-6'>
                <h2 className='text-[28px] font-extrabold text-navy mb-4'>Timeline</h2>
                {detail.events.length === 0 && <p>No updates yet.</p>}
                <ol className='space-y-4 border-l-2 border-primary pl-6'>
                  {detail.events.map((ev) => (
                    <li key={ev.id}>
                      <p className='font-bold capitalize'>{ev.status.replace(/_/g, ' ')}</p>
                      <p className='text-[14px]'>{ev.location ? `${ev.location} · ` : ''}{new Date(ev.timestamp).toLocaleString()}</p>
                      {ev.notes && <p className='text-[14px] mt-1'>{ev.notes}</p>}
                    </li>
                  ))}
                </ol>
              </section>

              <section className='bg-white border border-border rounded-xl p-6'>
                <h2 className='text-[28px] font-extrabold text-navy mb-4'>Add an update</h2>
                <form onSubmit={addEvent} className='space-y-4'>
                  <label className='block'>
                    <span className='text-[14px] font-bold'>Status</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className='mt-1 w-full h-[42px] px-3 border border-border rounded'>
                      {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </label>
                  <label className='block'>
                    <span className='text-[14px] font-bold'>Location</span>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                  </label>
                  <label className='block'>
                    <span className='text-[14px] font-bold'>Notes</span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className='mt-1 w-full px-3 py-2 border border-border rounded' />
                  </label>
                  <button type='submit' disabled={saving} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
                    {saving ? 'Saving...' : 'Save update'}
                  </button>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
