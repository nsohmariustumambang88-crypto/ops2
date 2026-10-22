import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { shipment_id, total_amount, discount_amount, payment_method } = await request.json();
    const customerId = auth.user.id;
    const orderNumber = 'ORD' + Date.now();

    const taxAmount = total_amount * 0.1;
    const finalAmount = total_amount + taxAmount - (discount_amount || 0);

    const result = await db.query(
      `INSERT INTO orders
        (order_number, customer_id, shipment_id, total_amount, tax_amount, discount_amount, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, order_number, total_amount, tax_amount, discount_amount, created_at`,
      [orderNumber, customerId, shipment_id, total_amount, taxAmount, discount_amount || 0, payment_method]
    );

    await db.query(
      'UPDATE customers SET total_spending = total_spending + $1 WHERE user_id = $2',
      [finalAmount, customerId]
    );

    return NextResponse.json(
      { message: 'Order created successfully', order: result.rows[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const result = await db.query(
      `SELECT id, order_number, total_amount, payment_status, order_status, created_at
       FROM orders
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [auth.user.id]
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
