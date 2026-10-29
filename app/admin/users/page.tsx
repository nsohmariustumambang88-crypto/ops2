'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { GRANTABLE, PERMISSIONS, PRESETS, type Permission } from '@/lib/permissions';

type User = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status: string;
  permissions: string[] | null;
  created_at: string;
};

const roles = ['admin', 'support', 'customer'];
const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';
const groups = [...new Set(PERMISSIONS.map((p) => p.group))];

// Checkbox list for permissions, grouped by area, with select all and clear.
function PermissionPicker({ value, onChange, disabled }: { value: string[]; onChange: (next: string[]) => void; disabled?: boolean }) {
  const toggle = (key: Permission) =>
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        <button type='button' disabled={disabled} onClick={() => onChange([...GRANTABLE])} className='h-[34px] px-4 rounded border border-primary text-primary font-bold text-[13px] disabled:opacity-50'>Select all</button>
        <button type='button' disabled={disabled} onClick={() => onChange([])} className='h-[34px] px-4 rounded border border-border font-bold text-[13px] disabled:opacity-50'>Clear all</button>
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button key={key} type='button' disabled={disabled} onClick={() => onChange([...preset.keys])} className='h-[34px] px-4 rounded bg-light-blue text-navy font-bold text-[13px] disabled:opacity-50'>
            {preset.label}
          </button>
        ))}
      </div>
      {groups.map((group) => (
        <fieldset key={group}>
          <legend className='text-[13px] font-bold uppercase tracking-wider text-primary mb-2'>{group}</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {PERMISSIONS.filter((p) => p.group === group).map((p) => (
              <label key={p.key} className='flex items-start gap-3 text-[14px]'>
                <input type='checkbox' disabled={disabled} checked={value.includes(p.key)} onChange={() => toggle(p.key)} className='mt-1 w-4 h-4' />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'support' });
  const [newPermissions, setNewPermissions] = useState<string[]>(PRESETS.support.keys as unknown as string[]);
  const [editing, setEditing] = useState<User | null>(null);
  const [editDraft, setEditDraft] = useState<{ role: string; status: string; permissions: string[]; password: string; first_name: string; last_name: string } | null>(null);

  const token = () => localStorage.getItem('adminToken') ?? '';
  const auth = () => ({ Authorization: `Bearer ${token()}` });

  const load = async () => {
    const res = await fetch('/api/admin/users', { headers: auth() });
    if (!res.ok) {
      setError('Could not load users.');
      return;
    }
    setUsers(await res.json());
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth() },
      body: JSON.stringify({ ...form, permissions: form.role === 'admin' ? [] : newPermissions }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not create the user.');
      return;
    }
    setMessage(`Team member created. Share the password with them securely; they can change it later.`);
    setForm({ email: '', password: '', first_name: '', last_name: '', role: 'support' });
    setNewPermissions([...PRESETS.support.keys]);
    load();
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEditDraft({
      role: u.role,
      status: u.status,
      permissions: u.permissions ?? [],
      password: '',
      first_name: u.first_name ?? '',
      last_name: u.last_name ?? '',
    });
    setMessage('');
    setError('');
  };

  const saveEdit = async () => {
    if (!editing || !editDraft) return;
    setError('');
    setMessage('');
    const body: Record<string, unknown> = {
      role: editDraft.role,
      status: editDraft.status,
      permissions: editDraft.role === 'admin' ? [] : editDraft.permissions,
      first_name: editDraft.first_name,
      last_name: editDraft.last_name,
    };
    if (editDraft.password) body.password = editDraft.password;
    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth() },
      body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not save the changes.');
      return;
    }
    setMessage(`Saved changes for ${editing.email}.`);
    setEditing(null);
    setEditDraft(null);
    load();
  };

  const summary = (u: User) => {
    if (u.role === 'admin') return 'All permissions';
    const n = (u.permissions ?? []).length;
    return n ? `${n} of ${GRANTABLE.length} permissions` : 'No permissions';
  };

  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Team and users</h1>
          <p>Add team members, choose what each one can do, and turn accounts off when they leave.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <form onSubmit={create} className='bg-white border border-border rounded-xl p-6 space-y-6'>
          <h2 className='text-[22px] font-extrabold text-navy'>Add a team member</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label><span className='text-[14px] font-bold'>First name</span><input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={input} /></label>
            <label><span className='text-[14px] font-bold'>Last name</span><input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={input} /></label>
            <label><span className='text-[14px] font-bold'>Email</span><input type='email' required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder='name@opslogistice.com' className={input} /></label>
            <label><span className='text-[14px] font-bold'>Temporary password (at least 8 characters)</span><input type='password' required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} /></label>
            <label>
              <span className='text-[14px] font-bold'>Role</span>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={input}>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
          </div>
          {form.role === 'admin'
            ? <p className='text-[14px] text-text-secondary'>Admins have every permission and can manage other users.</p>
            : <PermissionPicker value={newPermissions} onChange={setNewPermissions} />}
          <button type='submit' className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Create team member</button>
        </form>

        <div className='bg-white border border-border rounded-xl overflow-x-auto'>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'>
              <tr>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3'>Role</th>
                <th className='px-4 py-3'>Access</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className='border-t border-border'>
                  <td className='px-4 py-3'>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</td>
                  <td className='px-4 py-3'>{u.email}</td>
                  <td className='px-4 py-3 capitalize'>{u.role}</td>
                  <td className='px-4 py-3'>{summary(u)}</td>
                  <td className='px-4 py-3 capitalize'>{u.status}</td>
                  <td className='px-4 py-3 text-right'>
                    <button type='button' onClick={() => startEdit(u)} className='font-bold text-primary'>Edit</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td className='px-4 py-6' colSpan={6}>No users yet.</td></tr>}
            </tbody>
          </table>
        </div>

        {editing && editDraft && (
          <div className='bg-white border border-border rounded-xl p-6 space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-[22px] font-extrabold text-navy'>Edit {editing.email}</h2>
              <button type='button' onClick={() => { setEditing(null); setEditDraft(null); }} className='font-bold text-text-secondary'>Close</button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <label><span className='text-[14px] font-bold'>First name</span><input value={editDraft.first_name} onChange={(e) => setEditDraft({ ...editDraft, first_name: e.target.value })} className={input} /></label>
              <label><span className='text-[14px] font-bold'>Last name</span><input value={editDraft.last_name} onChange={(e) => setEditDraft({ ...editDraft, last_name: e.target.value })} className={input} /></label>
              <label>
                <span className='text-[14px] font-bold'>Role</span>
                <select value={editDraft.role} onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value })} className={input}>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label>
                <span className='text-[14px] font-bold'>Status</span>
                <select value={editDraft.status} onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value })} className={input}>
                  <option value='active'>Active</option>
                  <option value='disabled'>Disabled (cannot sign in)</option>
                </select>
              </label>
              <label className='md:col-span-2'><span className='text-[14px] font-bold'>New password (leave blank to keep the current one)</span><input type='password' minLength={8} value={editDraft.password} onChange={(e) => setEditDraft({ ...editDraft, password: e.target.value })} className={input} /></label>
            </div>
            {editDraft.role === 'admin'
              ? <p className='text-[14px] text-text-secondary'>Admins have every permission.</p>
              : <PermissionPicker value={editDraft.permissions} onChange={(next) => setEditDraft({ ...editDraft, permissions: next })} />}
            <button type='button' onClick={saveEdit} className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Save changes</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
