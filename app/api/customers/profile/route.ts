import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const result = await db.query(
      `SELECT c.id, c.business_name, c.phone, c.industry, c.volume_tier,
              c.total_shipments, c.total_spending, u.email, u.first_name, u.last_name
       FROM customers c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = $1`,
      [auth.user.id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customer profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = requireUser(request, ['customer', 'admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { business_name, phone, industry } = await request.json();
    const result = await db.query(
      `UPDATE customers SET business_name = $1, phone = $2, industry = $3
       WHERE user_id = $4
       RETURNING id, business_name, phone, industry`,
      [business_name, phone, industry, auth.user.id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Profile updated successfully', customer: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
