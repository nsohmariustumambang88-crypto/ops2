import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  try {
    const s = await db.query(
      `SELECT id, tracking_number, reference_number, status, transport_mode, carrier, flight_number,
              route_origin, route_destination, pickup_at, departure_at, arrival_at, service_type, shipment_type, weight,
              sender_city, sender_country, receiver_city, receiver_country
       FROM shipments WHERE tracking_number = $1 OR reference_number = $1`,
      [trackingNumber]
    );
    if (s.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const shipment = s.rows[0];
    const ev = await db.query(
      `SELECT status, location, timestamp, notes, latitude, longitude
       FROM shipment_tracking WHERE shipment_id = $1 ORDER BY timestamp DESC`,
      [shipment.id]
    );

    return NextResponse.json({ shipment, tracking_history: ev.rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shipment' }, { status: 500 });
  }
}
