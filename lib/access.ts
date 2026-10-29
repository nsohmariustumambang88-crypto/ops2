import { db } from '@/lib/db';
import { requireUser, type AuthResult } from '@/lib/auth';
import { hasPermission, permissionFor } from '@/lib/permissions';

const TEAM_ROLES = ['admin', 'support'];

// Checks a signed-in team member against the permission their request needs. Permissions are read
// from the database on every request, so a change applies straight away, and a disabled account is
// refused even with a valid token.
export async function authorize(request: Request, method: string, path: string): Promise<AuthResult> {
  const auth = requireUser(request, TEAM_ROLES);
  if ('error' in auth) return auth;
  if (auth.user.role === 'admin') return auth;

  const r = await db.query('SELECT permissions, status FROM users WHERE id = $1', [auth.user.id]);
  if (r.rows.length === 0 || r.rows[0].status !== 'active') {
    return { error: 'This account is disabled', status: 403 };
  }
  const needed = permissionFor(method, path);
  if (!hasPermission(auth.user.role, r.rows[0].permissions, needed)) {
    return { error: 'You do not have permission for this', status: 403 };
  }
  return auth;
}
