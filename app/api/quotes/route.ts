import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function POST(request: Request) {
  const auth = requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const {
      origin_country,
      destination_country,
      weight,
      dimensions,
      service_type,
      shipment_type,
      items,
    } = await request.json();

    if (!origin_country || !destination_country || !weight || !service_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customerId = auth.user.role === 'customer' ? auth.user.id : null;
    const quoteNumber = 'QT' + Date.now();

    const pricing = await db.query(
      `SELECT price_per_kg, price_per_shipment, surcharge FROM pricing_rules
       WHERE origin_country = $1 AND destination_country = $2 AND service_type = $3
       ORDER BY effective_from DESC LIMIT 1`,
      [origin_country, destination_country, service_type]
    );

    let basePrice = weight * 10;
    if (pricing.rows.length > 0) {
      const rule = pricing.rows[0];
      basePrice = weight * rule.price_per_kg + (rule.price_per_shipment || 0) + (rule.surcharge || 0);
    }

    let tariffCost = 0;
    if (Array.isArray(items)) {
      for (const item of items) {
        const tariff = await db.query(
          'SELECT duty_percentage FROM tariff_rates WHERE country_code = $1 AND hs_code = $2',
          [destination_country, item.hs_code]
        );
        if (tariff.rows.length > 0) {
          tariffCost += (item.value || 0) * (tariff.rows[0].duty_percentage / 100);
        }
      }
    }

    const tax = (basePrice + tariffCost) * 0.1;
    const totalPrice = basePrice + tariffCost + tax;

    const result = await db.query(
      `INSERT INTO quotes
        (quote_number, customer_id, origin_country, destination_country, weight, dimensions,
         service_type, shipment_type, base_price, tariff_cost, tax, total_price, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW() + INTERVAL '7 days')
       RETURNING id, quote_number, total_price, valid_until`,
      [quoteNumber, customerId, origin_country, destination_country, weight, dimensions,
        service_type, shipment_type, basePrice, tariffCost, tax, totalPrice]
    );

    return NextResponse.json({
      quote: result.rows[0],
      breakdown: { base_price: basePrice, tariff_cost: tariffCost, tax, total_price: totalPrice },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate quote' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const auth = requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const result = await db.query(
      `SELECT id, quote_number, origin_country, destination_country, total_price,
              valid_until, created_at
       FROM quotes
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [auth.user.id]
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
