'use client';

import { useEffect, useState, type FormEvent } from 'react';

export type ShipmentValues = Record<string, string>;

type Customer = { id: number; business_name: string | null; email: string | null };

const statuses = ['registered', 'picked_up', 'in_transit', 'held_at_customs', 'cleared_for_customs', 'out_for_delivery', 'delivered', 'exception'];

const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';

function toLocal(value: string) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ShipmentForm({
  initial,
  customers,
  showCustomer,
  submitLabel,
  saving,
  onSubmit,
  referenceNumber,
  onChange,
}: {
  initial: ShipmentValues;
  customers?: Customer[];
  showCustomer?: boolean;
  submitLabel: string;
  saving: boolean;
  onSubmit: (values: ShipmentValues) => void;
  referenceNumber?: string;
  onChange?: (values: ShipmentValues) => void;
}) {
  const [v, setV] = useState<ShipmentValues>({
    ...initial,
    departure_at: toLocal(initial.departure_at ?? ''),
    arrival_at: toLocal(initial.arrival_at ?? ''),
  });

  useEffect(() => {
    onChange?.(v);
  }, [v, onChange]);
  const set = (key: string) => (e: { target: { value: string } }) => setV({ ...v, [key]: e.target.value });

  const [problems, setProblems] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const validate = () => {
    const issues: string[] = [];
    if (showCustomer && !v.customer_id) issues.push('Select a customer account.');
    if (!v.sender_name?.trim()) issues.push('Sender name is required.');
    if (!v.receiver_name?.trim()) issues.push('Receiver name is required.');
    if (!v.transport_mode) issues.push('Choose how the shipment is transported (land, air or sea).');
    if (!v.route_origin?.trim()) issues.push('Route origin is required.');
    if (!v.route_destination?.trim()) issues.push('Route destination is required.');
    if (v.departure_at && v.arrival_at && new Date(v.arrival_at) < new Date(v.departure_at)) {
      issues.push('Arrival must be after departure.');
    }
    if (v.sender_email && !v.sender_email.includes('@')) issues.push('Sender email looks invalid.');
    if (v.receiver_email && !v.receiver_email.includes('@')) issues.push('Receiver email looks invalid.');
    setProblems(issues);
    setChecked(true);
    return issues.length === 0;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(v);
  };

  const field = (key: string, label: string, type = 'text', required = false) => (
    <label key={key}>
      <span className='text-[14px] font-bold'>{label}</span>
      <input type={type} required={required} value={v[key] ?? ''} onChange={set(key)} className={input} />
    </label>
  );

  return (
    <form onSubmit={submit} className='space-y-6'>
      {referenceNumber && (
        <div className='bg-light-blue border border-border rounded-xl px-5 py-4'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>Reference number</p>
          <p className='text-[20px] font-extrabold text-navy'>{referenceNumber}</p>
        </div>
      )}

      <section className='bg-white border border-border rounded-xl p-6'>
        <h2 className='text-[24px] font-extrabold text-navy mb-4'>Sender</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {showCustomer && (
            <label className='md:col-span-2'>
              <span className='text-[14px] font-bold'>Customer account</span>
              <select required value={v.customer_id ?? ''} onChange={set('customer_id')} className={input}>
                <option value=''>Select a customer</option>
                {(customers ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.business_name || c.email || `Customer ${c.id}`}</option>
                ))}
              </select>
            </label>
          )}
          {field('sender_name', 'Full name or company', 'text', true)}
          {field('sender_email', 'Email', 'email')}
          {field('sender_phone', 'Phone')}
          {field('sender_address', 'Street address')}
          {field('sender_city', 'City')}
          {field('sender_country', 'Country')}
          {field('sender_postal_code', 'Postal code')}
        </div>
      </section>

      <section className='bg-white border border-border rounded-xl p-6'>
        <h2 className='text-[24px] font-extrabold text-navy mb-4'>Receiver</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {field('receiver_name', 'Full name or company', 'text', true)}
          {field('receiver_email', 'Email', 'email')}
          {field('receiver_phone', 'Phone')}
          {field('receiver_address', 'Street address')}
          {field('receiver_city', 'City')}
          {field('receiver_country', 'Country')}
          {field('receiver_postal_code', 'Postal code')}
        </div>
      </section>

      <section className='bg-white border border-border rounded-xl p-6'>
        <h2 className='text-[24px] font-extrabold text-navy mb-4'>Transport and route</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <label>
            <span className='text-[14px] font-bold'>Transport by</span>
            <select value={v.transport_mode ?? 'air'} onChange={set('transport_mode')} className={input}>
              <option value='land'>Land (road or rail)</option>
              <option value='air'>Air (flight)</option>
              <option value='sea'>Sea (water)</option>
            </select>
          </label>
          {field('carrier', 'Carrier or vessel name')}
          {field('flight_number', 'Flight, vessel or truck number')}
          {field('route_origin', 'Route origin (airport, port or city)')}
          {field('route_destination', 'Route destination (airport, port or city)')}
          <label>
            <span className='text-[14px] font-bold'>Departure date and time</span>
            <input type='datetime-local' value={v.departure_at ?? ''} onChange={set('departure_at')} className={input} />
          </label>
          <label>
            <span className='text-[14px] font-bold'>Arrival date and time</span>
            <input type='datetime-local' value={v.arrival_at ?? ''} onChange={set('arrival_at')} className={input} />
          </label>
        </div>
      </section>

      <section className='bg-white border border-border rounded-xl p-6'>
        <h2 className='text-[24px] font-extrabold text-navy mb-4'>Parcel</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <label>
            <span className='text-[14px] font-bold'>Status</span>
            <select value={v.status ?? 'registered'} onChange={set('status')} className={input}>
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Type</span>
            <select value={v.shipment_type ?? 'parcel'} onChange={set('shipment_type')} className={input}>
              <option value='parcel'>Parcel</option>
              <option value='document'>Document</option>
              <option value='pallet'>Pallet</option>
              <option value='container'>Container</option>
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Service</span>
            <select value={v.service_type ?? 'express'} onChange={set('service_type')} className={input}>
              <option value='express'>Express</option>
              <option value='standard'>Standard</option>
              <option value='economy'>Economy</option>
              <option value='freight'>Freight</option>
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Priority</span>
            <select value={v.priority ?? 'standard'} onChange={set('priority')} className={input}>
              <option value='standard'>Standard</option>
              <option value='urgent'>Urgent</option>
            </select>
          </label>
          {field('weight', 'Weight (kg)', 'number')}
          {field('dimensions', 'Dimensions (L x W x H cm)')}
          <label className='md:col-span-2'>
            <span className='text-[14px] font-bold'>Contents</span>
            <textarea rows={3} value={v.contents ?? ''} onChange={set('contents')} className='mt-1 w-full px-3 py-2 border border-border rounded' />
          </label>
        </div>
      </section>

      {checked && problems.length > 0 && (
        <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>
          <p className='font-bold mb-2'>Fix these before saving:</p>
          <ul className='list-disc pl-5 space-y-1'>
            {problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      )}
      {checked && problems.length === 0 && (
        <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>All required details are valid.</div>
      )}

      <div className='flex gap-3'>
        <button type='button' disabled={saving} onClick={() => { if (validate()) onSubmit(v); }} className='h-[42px] px-6 rounded border border-primary text-primary font-bold disabled:opacity-60'>
          Track
        </button>
        <button type='submit' disabled={saving} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
