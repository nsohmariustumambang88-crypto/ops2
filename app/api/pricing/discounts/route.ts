import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = requireUser(request, ['admin', 'support']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const result = await db.query(
      `SELECT id, customer_id, shipment_count_min, shipment_count_max, discount_percentage
       FROM volume_discounts
       WHERE effective_to IS NULL OR effective_to > NOW()
       ORDER BY customer_id`
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = requireUser(request, ['admin', 'support']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { customer_id, shipment_count_min, shipment_count_max, discount_percentage } = await request.json();
    const result = await db.query(
      `INSERT INTO volume_discounts
        (customer_id, shipment_count_min, shipment_count_max, discount_percentage, effective_from)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, customer_id, discount_percentage`,
      [customer_id, shipment_count_min, shipment_count_max, discount_percentage]
    );
    return NextResponse.json({ message: 'Volume discount created', discount: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}
