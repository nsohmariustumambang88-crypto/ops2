'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CONTENT_KINDS, type ContentKind } from '@/lib/content';

type Item = {
  id: number;
  title: string;
  summary: string | null;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
  published: boolean;
  sort_order: number;
  updated_at: string;
};

type Form = Omit<Item, 'id' | 'updated_at'>;

const empty: Form = { title: '', summary: '', body: '', image_url: '', link_url: '', published: true, sort_order: 0 };

const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';

export default function ContentAdmin({ kind, heading }: { kind: ContentKind; heading: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem('adminToken') ?? '';

  const load = async () => {
    const res = await fetch(`/api/admin/content/${kind}`, { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      setError(`Could not load ${heading.toLowerCase()}.`);
      return;
    }
    const j = await res.json();
    setItems(j.data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const startNew = () => {
    setEditingId(null);
    setCreating(true);
    setForm(empty);
    setMessage('');
    setError('');
  };

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setCreating(true);
    setForm({
      title: item.title,
      summary: item.summary ?? '',
      body: item.body ?? '',
      image_url: item.image_url ?? '',
      link_url: item.link_url ?? '',
      published: item.published,
      sort_order: item.sort_order,
    });
    setMessage('');
    setError('');
  };

  const set = (key: keyof Form) => (e: { target: { value: string; checked?: boolean; type: string } }) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    const url = editingId ? `/api/admin/content/item/${editingId}` : `/api/admin/content/${kind}`;
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ...form, sort_order: Number(form.sort_order) || 0 }),
    });
    setSaving(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not save.');
      return;
    }
    setMessage('Saved. The public site shows it straight away when published.');
    setCreating(false);
    setEditingId(null);
    load();
  };

  const remove = async (item: Item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch(`/api/admin/content/item/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) {
      setError('Could not delete this item.');
      return;
    }
    setMessage('Deleted.');
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-[36px] font-extrabold text-navy'>{heading}</h1>
            <p>{CONTENT_KINDS[kind]} entries. Unpublished entries stay hidden from the public site.</p>
          </div>
          <button type='button' onClick={startNew} className='h-[42px] px-6 rounded bg-primary text-white font-bold'>
            Add new
          </button>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        {creating && (
          <form onSubmit={save} className='bg-white border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <h2 className='md:col-span-2 text-[24px] font-extrabold text-navy'>{editingId ? 'Edit entry' : 'New entry'}</h2>
            <label className='md:col-span-2'>
              <span className='text-[14px] font-bold'>Title</span>
              <input required value={form.title} onChange={set('title')} className={input} />
            </label>
            <label className='md:col-span-2'>
              <span className='text-[14px] font-bold'>Summary</span>
              <textarea rows={2} value={form.summary ?? ''} onChange={set('summary')} className='mt-1 w-full px-3 py-2 border border-border rounded' />
            </label>
            <label className='md:col-span-2'>
              <span className='text-[14px] font-bold'>Body</span>
              <textarea rows={8} value={form.body ?? ''} onChange={set('body')} placeholder='Separate paragraphs with a blank line' className='mt-1 w-full px-3 py-2 border border-border rounded' />
            </label>
            <label>
              <span className='text-[14px] font-bold'>Image URL</span>
              <input value={form.image_url ?? ''} onChange={set('image_url')} placeholder='/images/...' className={input} />
            </label>
            <label>
              <span className='text-[14px] font-bold'>Link URL (optional)</span>
              <input value={form.link_url ?? ''} onChange={set('link_url')} placeholder='https://...' className={input} />
            </label>
            <label>
              <span className='text-[14px] font-bold'>Display order</span>
              <input type='number' value={form.sort_order} onChange={set('sort_order')} className={input} />
            </label>
            <label className='flex items-center gap-3 mt-6'>
              <input type='checkbox' checked={form.published} onChange={set('published')} className='w-5 h-5' />
              <span className='text-[14px] font-bold'>Published</span>
            </label>
            <div className='md:col-span-2 flex gap-3'>
              <button type='submit' disabled={saving} className='h-[42px] px-6 rounded bg-primary text-white font-bold disabled:opacity-60'>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type='button' onClick={() => { setCreating(false); setEditingId(null); }} className='h-[42px] px-6 rounded border border-border font-bold'>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'>
              <tr>
                <th className='px-4 py-3'>Title</th>
                <th className='px-4 py-3'>Order</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'>Updated</th>
                <th className='px-4 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td className='px-4 py-6' colSpan={5}>No entries yet. Press Add new to create one.</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className='border-t border-border'>
                  <td className='px-4 py-3 font-bold text-navy'>{item.title}</td>
                  <td className='px-4 py-3'>{item.sort_order}</td>
                  <td className='px-4 py-3'>{item.published ? 'Published' : 'Hidden'}</td>
                  <td className='px-4 py-3'>{new Date(item.updated_at).toLocaleDateString()}</td>
                  <td className='px-4 py-3 text-right'>
                    <button type='button' onClick={() => startEdit(item)} className='mr-4 font-bold text-primary'>Edit</button>
                    <button type='button' onClick={() => remove(item)} className='font-bold text-red-600'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
