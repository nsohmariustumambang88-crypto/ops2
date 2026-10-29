// Permissions for team users. Admin accounts always have every permission. Support and other
// team roles get only what is ticked for them. "users_manage" is never granted to anyone but admins.

export const PERMISSIONS = [
  { key: 'shipments_view', label: 'View shipments', group: 'Shipments' },
  { key: 'shipments_edit', label: 'Register, edit and update shipments', group: 'Shipments' },
  { key: 'enquiries_manage', label: 'View and update contact forms and quotes', group: 'Customers' },
  { key: 'customers_manage', label: 'View and change customer tiers', group: 'Customers' },
  { key: 'orders_view', label: 'View orders', group: 'Customers' },
  { key: 'support_manage', label: 'View and reply to support tickets', group: 'Customers' },
  { key: 'inbox_view', label: 'Open the support inbox', group: 'Inbox' },
  { key: 'inbox_reply', label: 'Reply from the support inbox', group: 'Inbox' },
  { key: 'content_manage', label: 'Blog, case studies, industries, solutions, white papers, tariffs', group: 'Content' },
  { key: 'subscribers_manage', label: 'Manage email subscribers', group: 'Content' },
  { key: 'pricing_manage', label: 'Edit lane rates, discounts and tariffs', group: 'Business' },
  { key: 'reports_view', label: 'View reports', group: 'Business' },
  { key: 'settings_manage', label: 'Change site settings', group: 'Business' },
] as const;

export type Permission = (typeof PERMISSIONS)[number]['key'];

// Users who can be given permissions. Managing other users is admin only and is not listed.
export const GRANTABLE: Permission[] = PERMISSIONS.map((p) => p.key);

export const PRESETS: Record<string, { label: string; keys: Permission[] }> = {
  support: {
    label: 'Support agent',
    keys: ['shipments_view', 'enquiries_manage', 'support_manage', 'inbox_view', 'inbox_reply', 'orders_view'],
  },
  editor: {
    label: 'Content editor',
    keys: ['content_manage', 'subscribers_manage', 'inbox_view'],
  },
  viewer: {
    label: 'Read only',
    keys: ['shipments_view', 'orders_view', 'reports_view', 'inbox_view'],
  },
};

// Which permission each admin request needs. Anything not listed needs an admin account.
export function permissionFor(method: string, path: string): Permission | 'users_manage' | null {
  const read = method === 'GET';
  if (path === 'dashboard') return null; // open to every signed-in team member
  if (path.startsWith('admin/')) return 'support_manage'; // support routes
  if (path.startsWith('pricing')) return 'pricing_manage';
  if (path.startsWith('shipments')) return read ? 'shipments_view' : 'shipments_edit';
  if (path === 'contact-submissions' || path.startsWith('contact-submissions/')) return 'enquiries_manage';
  if (path.startsWith('customers')) return 'customers_manage';
  if (path === 'orders') return 'orders_view';
  if (path.startsWith('reports')) return 'reports_view';
  if (path.startsWith('content')) return 'content_manage';
  if (path === 'subscribers' || path.startsWith('subscribers/')) return 'subscribers_manage';
  if (path === 'settings' || path.startsWith('settings/')) return 'settings_manage';
  if (path.startsWith('inbox')) return path === 'inbox/reply' ? 'inbox_reply' : 'inbox_view';
  if (path === 'users' || path.startsWith('users/')) return 'users_manage';
  return null;
}

export function hasPermission(role: string, granted: string[] | null | undefined, needed: string | null) {
  if (role === 'admin') return true;
  if (needed === null) return true;
  if (needed === 'users_manage') return false;
  return (granted ?? []).includes(needed);
}
