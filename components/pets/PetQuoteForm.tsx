'use client';

import { useState, type FormEvent } from 'react';

const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';
const area = 'mt-1 w-full px-3 py-2 border border-border rounded text-[15px]';

type Status = { type: 'sending' | 'sent' | 'error'; text: string } | null;

function Field({ label, required, children, wide }: { label: string; required?: boolean; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={wide ? 'md:col-span-2 block' : 'block'}>
      <span className='text-[14px] font-bold'>{label}{required && <span className='text-red-600'> *</span>}</span>
      {children}
    </label>
  );
}

export default function PetQuoteForm() {
  const [status, setStatus] = useState<Status>(null);
  const [form, setForm] = useState<Record<string, string>>({
    name: '', company: '', email: '', phone: '',
    pet_name: '', species: '', breed: '', sex: 'unknown', date_of_birth: '', weight: '', microchip: '',
    crate_type: 'hard_crate', crate_size: '', crate_photo_note: '',
    collect_from: '', deliver_to: '', pickup_date: '', travel_in: 'cargo', purpose: 'relocation',
    health_certificate: 'no', rabies_date: '', permit: '', vet: '',
    care_notes: '', pickup_access: '', agree_policy: '', agree_airline: '',
  });

  const set = (key: string) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'sending', text: 'Sending...' });
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'pet',
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        message: [form.care_notes, form.pickup_access].filter(Boolean).join('\n\n'),
        payload: form,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ type: 'error', text: j.error || 'Your request could not be sent. Please try again.' });
      return;
    }
    setStatus({ type: 'sent', text: 'Thank you. A member of our team will confirm what your pet needs and whether the airline will accept your crate. This is a request, not a booking.' });
    setForm({ ...form, name: '', company: '', email: '', phone: '', pet_name: '', breed: '', microchip: '', care_notes: '', pickup_access: '' });
  };

  return (
    <form onSubmit={submit} className='space-y-8 bg-white border border-border rounded-xl p-6 md:p-8'>
      <fieldset className='space-y-4'>
        <legend className='text-[20px] font-extrabold text-navy mb-2'>1. Your details</legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field label='Full name' required><input required value={form.name} onChange={set('name')} className={input} /></Field>
          <Field label='Company'><input value={form.company} onChange={set('company')} className={input} /></Field>
          <Field label='Email' required><input type='email' required value={form.email} onChange={set('email')} className={input} /></Field>
          <Field label='Phone' required><input type='tel' required value={form.phone} onChange={set('phone')} className={input} /></Field>
        </div>
      </fieldset>

      <fieldset className='space-y-4'>
        <legend className='text-[20px] font-extrabold text-navy mb-2'>2. Your pet</legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field label="Pet's name" required><input required value={form.pet_name} onChange={set('pet_name')} className={input} /></Field>
          <Field label='Species' required>
            <select required value={form.species} onChange={set('species')} className={input}>
              <option value=''>Select a species</option>
              <option value='dog'>Dog</option>
              <option value='cat'>Cat</option>
              <option value='bird'>Bird</option>
              <option value='reptile'>Reptile</option>
              <option value='small_mammal'>Small mammal</option>
              <option value='other'>Other (describe in notes)</option>
            </select>
          </Field>
          <Field label='Breed'><input value={form.breed} onChange={set('breed')} className={input} /></Field>
          <Field label='Sex'>
            <select value={form.sex} onChange={set('sex')} className={input}>
              <option value='unknown'>Unknown</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
          </Field>
          <Field label='Date of birth'><input type='date' value={form.date_of_birth} onChange={set('date_of_birth')} className={input} /></Field>
          <Field label='Weight (kg)' required><input type='number' step='0.1' min='0' required value={form.weight} onChange={set('weight')} className={input} /></Field>
          <Field label='Microchip number'><input value={form.microchip} onChange={set('microchip')} placeholder='15 digits, if known' className={input} /></Field>
          <Field label='Crate type' required>
            <select required value={form.crate_type} onChange={set('crate_type')} className={input}>
              <option value='hard_crate'>Hard-sided IATA-style crate</option>
              <option value='soft_carrier'>Soft carrier (cabin only)</option>
              <option value='other_enclosure'>Other enclosure (we confirm)</option>
              <option value='supplied_by_us'>We supply the crate</option>
            </select>
          </Field>
          <Field label='Crate size (L x W x H cm)' required><input required value={form.crate_size} onChange={set('crate_size')} className={input} /></Field>
          <Field label='Crate photo or description' wide><input value={form.crate_photo_note} onChange={set('crate_photo_note')} placeholder='Describe the crate, or send a photo after we reply' className={input} /></Field>
        </div>
      </fieldset>

      <fieldset className='space-y-4'>
        <legend className='text-[20px] font-extrabold text-navy mb-2'>3. The journey</legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field label='Collect from (address and city)' required><input required value={form.collect_from} onChange={set('collect_from')} className={input} /></Field>
          <Field label='Deliver to (address, city and country)' required><input required value={form.deliver_to} onChange={set('deliver_to')} className={input} /></Field>
          <Field label='Preferred pickup date' required><input type='date' required value={form.pickup_date} onChange={set('pickup_date')} className={input} /></Field>
          <Field label='Travel in' required>
            <select required value={form.travel_in} onChange={set('travel_in')} className={input}>
              <option value='cargo'>Cargo (hold)</option>
              <option value='cabin'>Cabin (small pets, on request)</option>
            </select>
          </Field>
          <Field label='Purpose' required>
            <select required value={form.purpose} onChange={set('purpose')} className={input}>
              <option value='relocation'>Relocation</option>
              <option value='adoption'>Adoption</option>
              <option value='show_or_breeding'>Show or breeding</option>
              <option value='medical'>Medical</option>
              <option value='other'>Other</option>
            </select>
          </Field>
          <Field label='Health certificate' required>
            <select required value={form.health_certificate} onChange={set('health_certificate')} className={input}>
              <option value='no'>Not yet</option>
              <option value='yes'>Yes</option>
            </select>
          </Field>
          <Field label='Rabies vaccination date'><input type='date' value={form.rabies_date} onChange={set('rabies_date')} className={input} /></Field>
          <Field label='Import or export permit number'><input value={form.permit} onChange={set('permit')} className={input} /></Field>
          <Field label='Veterinarian name and phone' wide><input value={form.vet} onChange={set('vet')} className={input} /></Field>
        </div>
      </fieldset>

      <fieldset className='space-y-4'>
        <legend className='text-[20px] font-extrabold text-navy mb-2'>4. Care notes</legend>
        <Field label='Feeding, medication and temperament' wide>
          <textarea rows={3} value={form.care_notes} onChange={set('care_notes')} className={area} />
        </Field>
        <Field label='Pickup access (gate code, parking, stairs)' wide>
          <textarea rows={2} value={form.pickup_access} onChange={set('pickup_access')} className={area} />
        </Field>
      </fieldset>

      <fieldset className='space-y-3'>
        <legend className='text-[20px] font-extrabold text-navy mb-2'>5. Agreement</legend>
        <label className='flex items-start gap-3 text-[15px]'>
          <input type='checkbox' required checked={form.agree_policy === 'yes'} onChange={(e) => setForm({ ...form, agree_policy: e.target.checked ? 'yes' : '' })} className='mt-1 w-5 h-5' />
          I have read the Pet shipping policy.
        </label>
        <label className='flex items-start gap-3 text-[15px]'>
          <input type='checkbox' required checked={form.agree_airline === 'yes'} onChange={(e) => setForm({ ...form, agree_airline: e.target.checked ? 'yes' : '' })} className='mt-1 w-5 h-5' />
          I understand that airlines can refuse a pet at check-in and that destination rules apply.
        </label>
      </fieldset>

      {status && (
        <p role='status' className={status.type === 'error' ? 'text-red-700 font-bold' : 'text-primary font-bold'}>{status.text}</p>
      )}

      <button type='submit' disabled={status?.type === 'sending'} className='h-[42px] px-8 rounded bg-primary text-white font-bold disabled:opacity-60'>
        Send pet request
      </button>
    </form>
  );
}
