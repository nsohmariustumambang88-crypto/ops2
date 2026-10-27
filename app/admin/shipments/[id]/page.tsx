'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import type { ShipmentValues } from '@/components/admin/ShipmentForm';
import { PET_DOCUMENT_CHECKS, toFormValues } from '@/lib/shipments';
import ShipmentReceipt from '@/components/admin/ShipmentReceipt';

type Event = { id: string; status: string; location: string | null; notes: string | null; timestamp: string };
type Detail = { shipment: Record<string, unknown> & { id: string; tracking_number: string; status: string; created_at: string }; events: Event[] };
type Receipt = { values: ShipmentValues; reference: string };

const statuses = ['registered', 'picked_up', 'in_transit', 'held_at_customs', 'cleared_for_customs', 'out_for_delivery', 'delivered', 'delayed', 'exception'];

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('in_transit');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [deliveredTo, setDeliveredTo] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [saving, setSaving] = useState(false);

  const [trackMsg, setTrackMsg] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean> | null>(null);
  const [checksMsg, setChecksMsg] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';

  const savedChecks = (detail?.shipment.pet_document_checks ?? {}) as Record<string, boolean>;
  const currentChecks = checks ?? savedChecks;

  const saveChecks = async () => {
    setChecksMsg('Saving...');
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ pet_document_checks: currentChecks }),
    });
    if (!res.ok) {
      setChecksMsg('Could not save the checklist.');
      return;
    }
    setChecksMsg('Checklist saved.');
    setChecks(null);
    load();
  };

  const trackRegistration = async () => {
    if (!detail) return;
    const ref = detail.shipment.tracking_number;
    setTrackMsg('Checking...');
    const res = await fetch(`/api/shipments/track/${encodeURIComponent(ref)}`);
    if (!res.ok) {
      setReceipt(null);
      setTrackMsg(`Registration ${ref} was not found.`);
      return;
    }
    const j = await res.json();
    setReceipt({ values: toFormValues(detail.shipment), reference: ref });
    setTrackMsg(`Registration ${ref} is valid. Current status: ${String(j.shipment.status).replace(/_/g, ' ')}.`);
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
      body: JSON.stringify({ status, location, notes, latitude, longitude, next_step: nextStep, delivered_to: deliveredTo }),
    });
    setSaving(false);
    if (!res.ok) {
      setError('Could not save the update.');
      return;
    }
    setLocation('');
    setNotes('');
    setNextStep('');
    setDeliveredTo('');
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

            <div className='grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start'>
              <div className='space-y-6'>
              {detail.shipment.shipment_type === 'pet' && (
                <section className='bg-white border border-border rounded-xl p-6'>
                  <h2 className='text-[28px] font-extrabold text-navy mb-2'>Pet document checklist</h2>
                  <p className='text-[14px] text-text-secondary mb-4'>Tick each check as it is confirmed. Dispatch only when all are ticked.</p>
                  <ul className='space-y-3'>
                    {PET_DOCUMENT_CHECKS.map(([key, text]) => (
                      <li key={key}>
                        <label className='flex items-start gap-3 text-[15px]'>
                          <input
                            type='checkbox'
                            checked={Boolean(currentChecks[key])}
                            onChange={(e) => setChecks({ ...currentChecks, [key]: e.target.checked })}
                            className='mt-1 w-5 h-5'
                          />
                          {text}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div className='mt-4 flex items-center gap-4'>
                    <button type='button' onClick={saveChecks} className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Save checklist</button>
                    {checksMsg && <span role='status' className='text-primary font-bold'>{checksMsg}</span>}
                  </div>
                </section>
              )}

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
                    <div className='grid grid-cols-2 gap-3 mt-3'>
                      <label><span className='text-[13px] font-bold'>Latitude</span>
                        <input type='number' step='any' value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder='e.g. 29.76' className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                      </label>
                      <label><span className='text-[13px] font-bold'>Longitude</span>
                        <input type='number' step='any' value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder='e.g. -95.37' className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                      </label>
                    </div>
                  </label>
                  <label className='block'>
                    <span className='text-[14px] font-bold'>What happens next (shown to the customer)</span>
                    <textarea value={nextStep} onChange={(e) => setNextStep(e.target.value)} rows={2} placeholder='For example: a new flight leaves Thursday, and the delivery date moves by one day.' className='mt-1 w-full px-3 py-2 border border-border rounded' />
                  </label>
                  {status === 'delivered' && (
                    <label className='block'>
                      <span className='text-[14px] font-bold'>Received by</span>
                      <input value={deliveredTo} onChange={(e) => setDeliveredTo(e.target.value)} placeholder='Name of the person who signed for it' className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                    </label>
                  )}
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
              <aside className='xl:sticky xl:top-6'>
                {receipt && <ShipmentReceipt values={receipt.values} reference={receipt.reference} />}
              </aside>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
