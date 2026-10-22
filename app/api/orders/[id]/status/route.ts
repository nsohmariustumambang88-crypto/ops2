import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const { status } = await request.json();
    const result = await db.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING id, order_status',
      [status, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Order status updated', order: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
