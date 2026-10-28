'use client';

import { useState, type FormEvent } from 'react';
import { COURIER_NAME } from '@/lib/shipments';
import { worldCountries } from '@/lib/countries';

export type ShipmentValues = Record<string, string>;

const statuses = ['registered', 'picked_up', 'in_transit', 'held_at_customs', 'cleared_for_customs', 'out_for_delivery', 'delivered', 'delayed', 'exception'];

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
  submitLabel,
  saving,
  onSubmit,
  referenceNumber,
}: {
  initial: ShipmentValues;
  submitLabel: string;
  saving: boolean;
  onSubmit: (values: ShipmentValues) => void;
  referenceNumber?: string;
}) {
  const [v, setV] = useState<ShipmentValues>({
    ...initial,
    carrier: COURIER_NAME,
    pickup_at: toLocal(initial.pickup_at ?? ''),
    departure_at: toLocal(initial.departure_at ?? ''),
    arrival_at: toLocal(initial.arrival_at ?? ''),
  });

  const set = (key: string) => (e: { target: { value: string } }) => setV({ ...v, [key]: e.target.value });

  const [problems, setProblems] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const isPet = v.shipment_type === 'pet';

  const validate = () => {
    const issues: string[] = [];
    if (!v.sender_name?.trim()) issues.push('Sender name is required.');
    if (!v.receiver_name?.trim()) issues.push('Receiver name is required.');
    if (!v.transport_mode) issues.push('Choose how the shipment is transported (land, air or sea).');
    if (!v.sender_city?.trim()) issues.push('Sender city is required.');
    if (!v.sender_country) issues.push('Choose the sender country.');
    if (!v.receiver_city?.trim()) issues.push('Receiver city is required.');
    if (!v.receiver_country) issues.push('Choose the receiver country.');
    if (!v.route_origin?.trim()) issues.push('Origin is required (city, airport or port).');
    if (!v.route_destination?.trim()) issues.push('Destination is required (city, airport or port).');
    if (v.pickup_at && v.departure_at && new Date(v.departure_at) < new Date(v.pickup_at)) {
      issues.push('Departure must be after pickup.');
    }
    if (v.departure_at && v.arrival_at && new Date(v.arrival_at) < new Date(v.departure_at)) {
      issues.push('Arrival must be after departure.');
    }
    if (v.sender_email && !v.sender_email.includes('@')) issues.push('Sender email looks invalid.');
    if (v.receiver_email && !v.receiver_email.includes('@')) issues.push('Receiver email looks invalid.');
    if (isPet) {
      if (!v.pet_name?.trim()) issues.push('Pet name is required.');
      if (!v.pet_species) issues.push('Choose the pet species.');
      if (!v.pet_weight) issues.push('Pet weight is required.');
    }
    setProblems(issues);
    setChecked(true);
    return issues.length === 0;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...v, carrier: COURIER_NAME });
  };

  const field = (key: string, label: string, type = 'text', required = false) => (
    <label key={key}>
      <span className='text-[14px] font-bold'>{label}</span>
      <input type={type} required={required} value={v[key] ?? ''} onChange={set(key)} className={input} />
    </label>
  );

  const select = (key: string, label: string, options: [string, string][], fallback: string) => (
    <label key={key}>
      <span className='text-[14px] font-bold'>{label}</span>
      <select value={v[key] || fallback} onChange={set(key)} className={input}>
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  );

  const countrySelect = (key: string, label: string) => (
    <label key={key}>
      <span className='text-[14px] font-bold'>{label}<span className='text-red-600'> *</span></span>
      <select required value={v[key] ?? ''} onChange={set(key)} className={input}>
        <option value=''>Select a country</option>
        {worldCountries.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
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
          {field('sender_name', 'Full name or company', 'text', true)}
          {field('sender_email', 'Email', 'email')}
          {field('sender_phone', 'Phone')}
          {field('sender_address', 'Street address')}
          {field('sender_city', 'City', 'text', true)}
          {countrySelect('sender_country', 'Country')}
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
          {field('receiver_city', 'City', 'text', true)}
          {countrySelect('receiver_country', 'Country')}
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
          <label>
            <span className='text-[14px] font-bold'>Courier</span>
            <input value={COURIER_NAME} readOnly className={`${input} bg-light-blue text-navy font-bold`} />
          </label>
          {field('flight_number', 'Flight, vessel or truck number')}
          <label>
            <span className='text-[14px] font-bold'>Origin (city, airport or port)</span>
            <input required value={v.route_origin ?? ''} onChange={set('route_origin')} placeholder='e.g. Nairobi, Jomo Kenyatta Airport' className={input} />
            <span className='text-[12px] text-text-secondary'>Used to place the map. Keep it to the city or airport name.</span>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Destination (city, airport or port)</span>
            <input required value={v.route_destination ?? ''} onChange={set('route_destination')} placeholder='e.g. Dubai, Dubai International' className={input} />
            <span className='text-[12px] text-text-secondary'>Used to place the map. Keep it to the city or airport name.</span>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Pickup date and time</span>
            <input type='datetime-local' value={v.pickup_at ?? ''} onChange={set('pickup_at')} className={input} />
          </label>
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
          {select('shipment_type', 'Type', [
            ['parcel', 'Parcel'],
            ['document', 'Document'],
            ['pallet', 'Pallet'],
            ['container', 'Container'],
            ['pet', 'Pet'],
          ], 'parcel')}
          {select('service_type', 'Service', [
            ['express', 'Express'],
            ['standard', 'Standard'],
            ['economy', 'Economy'],
            ['freight', 'Freight'],
          ], 'express')}
          {select('priority', 'Priority', [
            ['standard', 'Standard'],
            ['urgent', 'Urgent'],
          ], 'standard')}
          {field('weight', 'Weight (kg)', 'number')}
          {field('dimensions', 'Dimensions (L x W x H cm)')}
          <label className='md:col-span-2'>
            <span className='text-[14px] font-bold'>Contents</span>
            <textarea rows={3} value={v.contents ?? ''} onChange={set('contents')} className='mt-1 w-full px-3 py-2 border border-border rounded' />
          </label>
        </div>

        {isPet && (
          <div className='mt-6 pt-6 border-t border-border'>
            <h3 className='text-[20px] font-extrabold text-navy mb-1'>Pet details</h3>
            <p className='text-[14px] text-text-secondary mb-4'>
              Live animal shipments follow IATA live animal rules. Sedation is not recommended for air travel.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {field('pet_name', 'Pet name', 'text', true)}
              {select('pet_species', 'Species', [
                ['', 'Select a species'],
                ['dog', 'Dog'],
                ['cat', 'Cat'],
                ['bird', 'Bird'],
                ['reptile', 'Reptile'],
                ['other', 'Other'],
              ], '')}
              {field('pet_breed', 'Breed')}
              {select('pet_sex', 'Sex', [
                ['unknown', 'Unknown'],
                ['male', 'Male'],
                ['female', 'Female'],
              ], 'unknown')}
              {field('pet_date_of_birth', 'Date of birth', 'date')}
              {field('pet_weight', 'Weight (kg)', 'number', true)}
              {field('pet_microchip', 'Microchip number')}
              {select('pet_travel_purpose', 'Purpose of travel', [
                ['relocation', 'Relocation'],
                ['adoption', 'Adoption'],
                ['show_or_breeding', 'Show or breeding'],
                ['medical', 'Medical or veterinary'],
                ['other', 'Other'],
              ], 'relocation')}
              {select('pet_cabin_or_cargo', 'Travel in', [
                ['cargo', 'Cargo (hold)'],
                ['cabin', 'Cabin (small pets only)'],
              ], 'cargo')}
              {select('pet_crate_type', 'Crate', [
                ['hard_crate', 'Hard-sided IATA crate'],
                ['soft_carrier', 'Soft carrier (cabin only)'],
                ['supplied_by_ops', 'Supplied by OPS Logistics'],
              ], 'hard_crate')}
              {field('pet_crate_size', 'Crate size (L x W x H cm)')}
              {select('pet_health_certificate', 'Health certificate', [
                ['no', 'Not yet'],
                ['yes', 'Yes'],
              ], 'no')}
              {field('pet_rabies_vaccination_date', 'Rabies vaccination date', 'date')}
              {field('pet_import_permit', 'Import or export permit number')}
              {field('pet_vet_name', 'Veterinarian name')}
              {field('pet_vet_phone', 'Veterinarian phone')}
              <label className='md:col-span-2'>
                <span className='text-[14px] font-bold'>Handling and care notes</span>
                <textarea
                  rows={3}
                  value={v.pet_handling_notes ?? ''}
                  onChange={set('pet_handling_notes')}
                  placeholder='Feeding, medication, temperament, pickup access instructions'
                  className='mt-1 w-full px-3 py-2 border border-border rounded'
                />
              </label>
            </div>
          </div>
        )}
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

      <div className='flex justify-end items-center gap-3'>
        <button
          type='button'
          disabled={saving}
          onClick={() => { if (validate()) onSubmit({ ...v, carrier: COURIER_NAME }); }}
          className='h-[42px] px-6 rounded border border-primary bg-white text-primary font-bold disabled:opacity-60 shadow-[0_0_0_4px_rgba(17,115,212,0.2),0_0_22px_rgba(17,115,212,0.75)] animate-pulse'
        >
          Track
        </button>
        <button type='submit' disabled={saving} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
