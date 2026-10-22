'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

type Customer = { id: number; business_name: string | null; email: string | null };

const statuses = ['registered', 'picked_up', 'in_transit', 'held_at_customs', 'cleared_for_customs', 'out_for_delivery', 'delivered', 'exception'];

const newTrackingNumber = () => `OPS${Date.now().toString(36).toUpperCase()}`;

export default function NewShipmentPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_id: '',
    tracking_number: newTrackingNumber(),
    shipment_type: 'parcel',
    service_type: 'express',
    weight: '',
    dimensions: '',
    contents: '',
    status: 'registered',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    fetch('/api/admin/customers?limit=200', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j) => setCustomers(j.data ?? []))
      .catch(() => setError('Could not load customers.'));
  }, []);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const token = localStorage.getItem('adminToken') ?? '';
    const res = await fetch('/api/admin/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, customer_id: Number(form.customer_id), weight: form.weight || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Could not create the shipment.');
      return;
    }
    const j = await res.json();
    router.push(`/admin/shipments/${j.shipment.id}`);
  };

  const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';

  return (
    <AdminLayout>
      <div className='space-y-6 max-w-[760px]'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Add shipment</h1>
          <p>Create a shipment for a customer. You can add tracking updates after it's created.</p>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <form onSubmit={submit} className='bg-white border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
          <label className='md:col-span-2'>
            <span className='text-[14px] font-bold'>Customer</span>
            <select required value={form.customer_id} onChange={set('customer_id')} className={input}>
              <option value=''>Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.business_name || c.email || `Customer ${c.id}`}</option>
              ))}
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Tracking number</span>
            <input required value={form.tracking_number} onChange={set('tracking_number')} className={input} />
          </label>
          <label>
            <span className='text-[14px] font-bold'>Status</span>
            <select value={form.status} onChange={set('status')} className={input}>
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Shipment type</span>
            <select value={form.shipment_type} onChange={set('shipment_type')} className={input}>
              <option value='parcel'>Parcel</option>
              <option value='document'>Document</option>
              <option value='pallet'>Pallet</option>
              <option value='container'>Container</option>
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Service</span>
            <select value={form.service_type} onChange={set('service_type')} className={input}>
              <option value='express'>Express</option>
              <option value='standard'>Standard</option>
              <option value='economy'>Economy</option>
              <option value='freight'>Freight</option>
            </select>
          </label>
          <label>
            <span className='text-[14px] font-bold'>Weight (kg)</span>
            <input type='number' min='0' step='0.01' value={form.weight} onChange={set('weight')} className={input} />
          </label>
          <label>
            <span className='text-[14px] font-bold'>Dimensions (L x W x H cm)</span>
            <input value={form.dimensions} onChange={set('dimensions')} className={input} />
          </label>
          <label className='md:col-span-2'>
            <span className='text-[14px] font-bold'>Contents</span>
            <textarea rows={3} value={form.contents} onChange={set('contents')} className='mt-1 w-full px-3 py-2 border border-border rounded' />
          </label>
          <div className='md:col-span-2 flex gap-3'>
            <button type='submit' disabled={saving} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
              {saving ? 'Creating...' : 'Create shipment'}
            </button>
            <button type='button' onClick={() => router.push('/admin/shipments')} className='h-[42px] px-6 rounded border border-border font-bold'>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
