import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const result = await db.query('SELECT * FROM quotes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
