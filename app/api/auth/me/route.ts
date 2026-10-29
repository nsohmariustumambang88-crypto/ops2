import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getTokenUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role, status, permissions FROM users WHERE id = $1',
      [user.id]
    );
    if (result.rows.length === 0 || result.rows[0].status !== 'active') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
