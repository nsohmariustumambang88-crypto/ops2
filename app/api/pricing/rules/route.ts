import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authorize } from '@/lib/access';

export async function GET() {
  try {
    const result = await db.query(
      `SELECT id, origin_country, destination_country, service_type, weight_min, weight_max,
              price_per_kg, price_per_shipment, surcharge, effective_from, effective_to
       FROM pricing_rules
       WHERE effective_to IS NULL OR effective_to > NOW()
       ORDER BY origin_country, destination_country`
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await authorize(request, 'POST', 'pricing/rules');
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const {
      origin_country,
      destination_country,
      service_type,
      weight_min,
      weight_max,
      price_per_kg,
      price_per_shipment,
      surcharge,
    } = await request.json();

    const result = await db.query(
      `INSERT INTO pricing_rules
        (origin_country, destination_country, service_type, weight_min, weight_max,
         price_per_kg, price_per_shipment, surcharge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, origin_country, destination_country, service_type, price_per_kg`,
      [origin_country, destination_country, service_type, weight_min, weight_max,
        price_per_kg, price_per_shipment, surcharge]
    );
    return NextResponse.json({ message: 'Pricing rule created', rule: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create pricing rule' }, { status: 500 });
  }
}
