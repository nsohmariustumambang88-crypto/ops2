'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ShipmentForm, { type ShipmentValues } from '@/components/admin/ShipmentForm';
import ShipmentReceipt from '@/components/admin/ShipmentReceipt';

type Customer = { id: number; business_name: string | null; email: string | null };

export default function NewShipmentPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [live, setLive] = useState<ShipmentValues>({});

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    fetch('/api/admin/customers?limit=200', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j) => setCustomers(j.data ?? []))
      .catch(() => setError('Could not load customers.'));
  }, []);

  const save = async (values: ShipmentValues) => {
    setSaving(true);
    setError('');
    const token = localStorage.getItem('adminToken') ?? '';
    const body = {
      ...values,
      customer_id: Number(values.customer_id),
      departure_at: values.departure_at ? new Date(values.departure_at).toISOString() : null,
      arrival_at: values.arrival_at ? new Date(values.arrival_at).toISOString() : null,
    };
    const res = await fetch('/api/admin/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    setSaving(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not register the shipment.');
      return;
    }
    router.push(`/admin/shipments/${j.shipment.id}`);
  };

  return (
    <AdminLayout>
      <div className='space-y-6 max-w-[860px]'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Register shipment</h1>
          <p>Sender first, then receiver. A reference number is created when you save.</p>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start'>
          <aside className='lg:sticky lg:top-6'>
            <ShipmentReceipt values={live} />
          </aside>
          <ShipmentForm
            initial={{ transport_mode: 'air', status: 'registered', shipment_type: 'parcel', service_type: 'express', priority: 'standard' }}
            customers={customers}
            showCustomer
            submitLabel='Register shipment'
            saving={saving}
            onSubmit={save}
            onChange={setLive}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
