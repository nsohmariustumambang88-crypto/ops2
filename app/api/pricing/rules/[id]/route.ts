import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireUser(request, ['admin', 'support']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const { price_per_kg, price_per_shipment, surcharge } = await request.json();
    const result = await db.query(
      `UPDATE pricing_rules
       SET price_per_kg = $1, price_per_shipment = $2, surcharge = $3
       WHERE id = $4
       RETURNING id, origin_country, destination_country, price_per_kg`,
      [price_per_kg, price_per_shipment, surcharge, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pricing rule not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Pricing rule updated', rule: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update pricing rule' }, { status: 500 });
  }
}
