import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const result = await db.query('DELETE FROM addresses WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
