import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

async function customerIdFor(userId: string) {
  const r = await db.query('SELECT id FROM customers WHERE user_id = $1', [userId]);
  return r.rows[0]?.id as string | undefined;
}

export async function GET(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const customerId = await customerIdFor(auth.user.id);
    if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const result = await db.query(
      `SELECT id, street, city, state, postal_code, country, address_type, is_default
       FROM addresses
       WHERE customer_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [customerId]
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { street, city, state, postal_code, country, address_type, is_default } = await request.json();
    const customerId = await customerIdFor(auth.user.id);
    if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const result = await db.query(
      `INSERT INTO addresses
        (customer_id, street, city, state, postal_code, country, address_type, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, street, city, country`,
      [customerId, street, city, state, postal_code, country, address_type, is_default || false]
    );
    return NextResponse.json(
      { message: 'Address added successfully', address: result.rows[0] },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}
