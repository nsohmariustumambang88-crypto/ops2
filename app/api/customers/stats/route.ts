import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const result = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM shipments WHERE customer_id = c.id) AS total_shipments,
        (SELECT COUNT(*) FROM shipments WHERE customer_id = c.id AND status = 'delivered') AS delivered_shipments,
        c.total_spending,
        (SELECT COUNT(*) FROM orders WHERE customer_id = c.id AND payment_status = 'paid') AS paid_orders
       FROM customers c
       WHERE c.user_id = $1`,
      [auth.user.id]
    );
    return NextResponse.json(result.rows[0] ?? {});
  } catch {
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
