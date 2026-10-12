import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getTokenUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const result = await db.query(
      `SELECT id, tracking_number, shipment_type, service_type, status, weight,
              created_at, pickup_date, delivery_date
       FROM shipments
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getTokenUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  if (user.role !== 'customer' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Customer access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      origin_address_id,
      destination_address_id,
      shipment_type,
      service_type,
      weight,
      dimensions,
      contents,
      items,
    } = body;

    const trackingNumber =
      'OPS' + Date.now() + Math.random().toString(36).substring(2, 11).toUpperCase();

    const shipmentResult = await db.query(
      `INSERT INTO shipments
        (tracking_number, customer_id, origin_address_id, destination_address_id,
         shipment_type, service_type, weight, dimensions, contents)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, tracking_number, created_at`,
      [
        trackingNumber,
        user.id,
        origin_address_id,
        destination_address_id,
        shipment_type,
        service_type,
        weight,
        dimensions,
        contents,
      ]
    );
    const shipmentId = shipmentResult.rows[0].id;

    if (Array.isArray(items)) {
      for (const item of items) {
        await db.query(
          'INSERT INTO shipment_items (shipment_id, description, quantity, weight, value, hs_code) VALUES ($1, $2, $3, $4, $5, $6)',
          [shipmentId, item.description, item.quantity, item.weight, item.value, item.hs_code]
        );
      }
    }

    await db.query(
      'INSERT INTO shipment_tracking (shipment_id, status, location, notes) VALUES ($1, $2, $3, $4)',
      [shipmentId, 'pending', 'Origin', 'Shipment created']
    );

    return NextResponse.json(
      { message: 'Shipment created successfully', shipment: shipmentResult.rows[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}
