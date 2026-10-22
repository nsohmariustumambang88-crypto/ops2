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
    const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const itemsResult = await db.query('SELECT * FROM invoice_items WHERE order_id = $1', [id]);
    return NextResponse.json({ order: orderResult.rows[0], items: itemsResult.rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
