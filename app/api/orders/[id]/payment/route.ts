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
    const { payment_status } = await request.json();
    const result = await db.query(
      'UPDATE orders SET payment_status = $1, paid_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, payment_status',
      [payment_status, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Payment status updated', order: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
