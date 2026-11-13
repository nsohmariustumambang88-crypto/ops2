'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import type { ShipmentValues } from '@/components/admin/ShipmentForm';
import { PET_DOCUMENT_CHECKS, toFormValues } from '@/lib/shipments';
import { SHIPMENT_STATUSES, normalizeStatus, statusLabel } from '@/lib/status';
import ShipmentReceipt from '@/components/admin/ShipmentReceipt';

type Event = { id: string; status: string; location: string | null; notes: string | null; timestamp: string };
type Detail = { shipment: Record<string, unknown> & { id: string; tracking_number: string; status: string; created_at: string }; events: Event[] };
type Receipt = { values: ShipmentValues; reference: string };

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);
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
  const [locForm, setLocForm] = useState({ place: '', lat: '', lng: '' });
  const [locMsg, setLocMsg] = useState('');

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
    setTrackMsg(`Registration ${ref} is valid. Current status: ${statusLabel(String(j.shipment.status))}.`);
  };

  const load = async () => {
    const res = await fetch(`/api/admin/shipments/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      setError(res.status === 404 ? 'Shipment not found.' : 'Could not load this shipment.');
      return;
    }
    const data: Detail = await res.json();
    setDetail(data);
    setStatus(normalizeStatus(data.shipment.status));
    setLocForm({
      place: String(data.shipment.current_location ?? ''),
      lat: data.shipment.current_lat == null ? '' : String(data.shipment.current_lat),
      lng: data.shipment.current_lng == null ? '' : String(data.shipment.current_lng),
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Delete is only shown to admins and to team members granted the delete permission.
  useEffect(() => {
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => setCanDelete(me?.role === 'admin' || (me?.permissions ?? []).includes('shipments_delete')));
  }, []);

  // Saves where the package is now. Empty coordinates are looked up from the place name.
  const saveLocation = async (clear: boolean) => {
    setLocMsg('Saving...');
    const body = clear
      ? { current_location: '', current_lat: '', current_lng: '' }
      : { current_location: locForm.place, current_lat: locForm.lat, current_lng: locForm.lng };
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setLocMsg('Could not save the current location.');
      return;
    }
    setLocMsg(clear ? 'Current location cleared.' : 'Current location saved. The track page map has been updated.');
    load();
  };

  const deleteShipment = async () => {
    if (!detail) return;
    const ref = detail.shipment.tracking_number;
    if (!window.confirm(`Delete shipment ${ref}? Its updates and emails will be removed too. This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/shipments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Could not delete this shipment.');
      return;
    }
    router.push('/admin/shipments');
  };

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
                  {canDelete && <button type='button' onClick={deleteShipment} className='h-[42px] px-5 rounded border border-red-300 text-red-700 font-bold'>Delete</button>}
                </div>
              </div>
              <p className='text-text-primary'>Current status: <span className='font-bold'>{statusLabel(detail.shipment.status)}</span></p>
              {trackMsg && <p role='status' className='mt-2 text-primary font-bold'>{trackMsg}</p>}
              {Boolean(detail.shipment.receiver_responded_at) && (
                <div className={`mt-4 rounded-xl border px-5 py-4 ${detail.shipment.receiver_response === 'issue' ? 'border-red-300 bg-red-50 text-red-900' : 'border-green-300 bg-green-50 text-green-900'}`}>
                  <p className='font-bold'>
                    {detail.shipment.receiver_response === 'issue' ? 'The receiver reported a problem' : 'The receiver confirmed the details'}
                    <span className='font-normal'> · {new Date(String(detail.shipment.receiver_responded_at)).toLocaleString()}</span>
                  </p>
                  {Boolean(detail.shipment.receiver_response_note) && <p className='text-[15px] mt-1 whitespace-pre-line'>{String(detail.shipment.receiver_response_note)}</p>}
                </div>
              )}
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
                <h2 className='text-[28px] font-extrabold text-navy mb-2'>Current location</h2>
                <p className='text-[14px] text-text-secondary mb-4'>Where the package is right now. It appears on the track page map. Leave the coordinates empty and the place is looked up for you.</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <label className='md:col-span-3'>
                    <span className='text-[14px] font-bold'>Place (city, airport, port or address)</span>
                    <input value={locForm.place} onChange={(e) => setLocForm({ ...locForm, place: e.target.value })} placeholder='e.g. Atlanta, Hartsfield-Jackson Airport' className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                  </label>
                  <label>
                    <span className='text-[13px] font-bold'>Latitude (optional)</span>
                    <input type='number' step='any' value={locForm.lat} onChange={(e) => setLocForm({ ...locForm, lat: e.target.value })} className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                  </label>
                  <label>
                    <span className='text-[13px] font-bold'>Longitude (optional)</span>
                    <input type='number' step='any' value={locForm.lng} onChange={(e) => setLocForm({ ...locForm, lng: e.target.value })} className='mt-1 w-full h-[42px] px-3 border border-border rounded' />
                  </label>
                </div>
                <div className='mt-4 flex flex-wrap items-center gap-3'>
                  <button type='button' onClick={() => saveLocation(false)} className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Save location</button>
                  <button type='button' onClick={() => saveLocation(true)} className='h-[42px] px-6 rounded border border-border font-bold'>Clear</button>
                  {locMsg && <span role='status' className='text-primary font-bold'>{locMsg}</span>}
                </div>
              </section>

              <section className='bg-white border border-border rounded-xl p-6'>
                <h2 className='text-[28px] font-extrabold text-navy mb-4'>Timeline</h2>
                {detail.events.length === 0 && <p>No updates yet.</p>}
                <ol className='space-y-4 border-l-2 border-primary pl-6'>
                  {detail.events.map((ev) => (
                    <li key={ev.id}>
                      <p className='font-bold'>{statusLabel(ev.status)}</p>
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
                      {SHIPMENT_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
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
