'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ShipmentForm, { type ShipmentValues } from '@/components/admin/ShipmentForm';

export default function EditShipmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<ShipmentValues | null>(null);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken') ?? '';
    fetch(`/api/admin/shipments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j: { shipment: Record<string, unknown> }) => {
        const s = j.shipment;
        const values: ShipmentValues = {};
        Object.entries(s).forEach(([k, v]) => {
          values[k] = v === null || v === undefined ? '' : String(v);
        });
        if (s.departure_at) values.departure_at = new Date(String(s.departure_at)).toISOString();
        if (s.arrival_at) values.arrival_at = new Date(String(s.arrival_at)).toISOString();
        setReference(String(s.reference_number || s.tracking_number || ''));
        setInitial(values);
      })
      .catch(() => setError('Could not load this shipment.'));
  }, [id]);

  const save = async (values: ShipmentValues) => {
    setSaving(true);
    setError('');
    const token = localStorage.getItem('adminToken') ?? '';
    const body: Record<string, unknown> = { ...values };
    delete body.id;
    delete body.reference_number;
    delete body.created_at;
    delete body.updated_at;
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
    router.push(`/admin/shipments/${id}`);
  };

  return (
    <AdminLayout>
      <div className='space-y-6 max-w-[860px]'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Edit shipment</h1>
          <p>Every field can be changed, including dates, times and the route.</p>
        </div>

        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        {initial && (
          <ShipmentForm
            initial={initial}
            submitLabel='Save changes'
            saving={saving}
            onSubmit={save}
            referenceNumber={reference}
          />
        )}
      </div>
    </AdminLayout>
  );
}
