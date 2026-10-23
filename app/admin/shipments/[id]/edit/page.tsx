'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ShipmentForm, { type ShipmentValues } from '@/components/admin/ShipmentForm';
import ShipmentReceipt from '@/components/admin/ShipmentReceipt';
import { toFormValues } from '@/lib/shipments';

type Receipt = { values: ShipmentValues; reference: string };

export default function EditShipmentPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<ShipmentValues | null>(null);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    fetch(`/api/admin/shipments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j: { shipment: Record<string, unknown> }) => {
        const s = j.shipment;
        setReference(String(s.reference_number || s.tracking_number || ''));
        setInitial(toFormValues(s));
      })
      .catch(() => setError('Could not load this shipment.'));
  }, [id]);

  const save = async (values: ShipmentValues) => {
    setSaving(true);
    setError('');
    setMessage('');
    const token = localStorage.getItem('adminToken') ?? '';
    const body: Record<string, unknown> = { ...values };
    delete body.id;
    delete body.reference_number;
    delete body.created_at;
    delete body.updated_at;
    body.pickup_at = values.pickup_at ? new Date(values.pickup_at).toISOString() : null;
    body.departure_at = values.departure_at ? new Date(values.departure_at).toISOString() : null;
    body.arrival_at = values.arrival_at ? new Date(values.arrival_at).toISOString() : null;
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    setSaving(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not save changes.');
      return;
    }
    setMessage('Changes saved.');
    setReceipt({ values, reference });
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Edit shipment</h1>
          <p>Every field can be changed, including dates, times and the route. Press Track to validate and save.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start'>
          {initial && (
            <ShipmentForm
              initial={initial}
              submitLabel='Save changes'
              saving={saving}
              onSubmit={save}
              referenceNumber={reference}
            />
          )}
          <aside className='xl:sticky xl:top-6'>
            {receipt && <ShipmentReceipt values={receipt.values} reference={receipt.reference} />}
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
