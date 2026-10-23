'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ShipmentForm, { type ShipmentValues } from '@/components/admin/ShipmentForm';
import ShipmentReceipt from '@/components/admin/ShipmentReceipt';

type Receipt = { values: ShipmentValues; reference: string };

export default function NewShipmentPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const save = async (values: ShipmentValues) => {
    setSaving(true);
    setError('');
    const token = localStorage.getItem('adminToken') ?? '';
    const body = {
      ...values,
      pickup_at: values.pickup_at ? new Date(values.pickup_at).toISOString() : null,
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
    setReceipt({ values, reference: j.shipment.reference_number });
    router.replace(`/admin/shipments/${j.shipment.id}`);
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Register shipment</h1>
          <p>Sender first, then receiver. Press Track to validate and register. The receipt appears on the right.</p>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start'>
          <ShipmentForm
            initial={{ transport_mode: 'air', status: 'registered', shipment_type: 'parcel', service_type: 'express', priority: 'standard' }}
            submitLabel='Register shipment'
            saving={saving}
            onSubmit={save}
          />
          <aside className='xl:sticky xl:top-6'>
            {receipt && <ShipmentReceipt values={receipt.values} reference={receipt.reference} />}
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
