'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const fields = [
  { key: 'site_name', label: 'Site name', placeholder: 'OPS Logistics' },
  { key: 'support_email', label: 'Support email', placeholder: 'support@opslogistics.com' },
  { key: 'support_phone', label: 'Support phone', placeholder: '+1 000 000 0000' },
  { key: 'default_language', label: 'Default language (en or fr)', placeholder: 'en' },
  { key: 'default_country', label: 'Default country', placeholder: 'United States' },
  { key: 'tracking_notice', label: 'Tracking notice on the homepage', placeholder: '' },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';

  useEffect(() => {
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((j: { data: { key: string; value: string }[] }) => {
        const map: Record<string, string> = {};
        j.data.forEach((row) => (map[row.key] = row.value));
        setValues(map);
      })
      .catch(() => setError('Could not load settings.'));
  }, []);

  const save = async (key: string) => {
    setSavingKey(key);
    setError('');
    setMessage('');
    const res = await fetch(`/api/admin/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ value: values[key] ?? '' }),
    });
    setSavingKey('');
    if (!res.ok) {
      setError(`Could not save ${key}.`);
      return;
    }
    setMessage(`Saved ${key.replace(/_/g, ' ')}.`);
  };

  return (
    <AdminLayout>
      <div className='space-y-6 max-w-[760px]'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Settings</h1>
          <p>Site-wide values. Each field saves on its own.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <div className='bg-white border border-border rounded-xl p-6 space-y-5'>
          {fields.map((f) => (
            <div key={f.key} className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end'>
              <label>
                <span className='text-[14px] font-bold'>{f.label}</span>
                <input
                  value={values[f.key] ?? ''}
                  placeholder={f.placeholder}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className='mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]'
                />
              </label>
              <button
                type='button'
                onClick={() => save(f.key)}
                disabled={savingKey === f.key}
                className='h-[42px] px-5 rounded bg-primary text-white font-bold disabled:opacity-60'
              >
                {savingKey === f.key ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
