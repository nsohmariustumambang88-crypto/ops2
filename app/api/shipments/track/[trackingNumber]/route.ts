import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  try {
    const shipmentResult = await db.query(
      `SELECT id, tracking_number, shipment_type, service_type, status, weight, dimensions,
              origin_address_id, destination_address_id, created_at, pickup_date, delivery_date
       FROM shipments
       WHERE tracking_number = $1`,
      [trackingNumber]
    );
    if (shipmentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const shipment = shipmentResult.rows[0];
    const trackingResult = await db.query(
      `SELECT status, location, timestamp, notes
       FROM shipment_tracking
       WHERE shipment_id = $1
       ORDER BY timestamp DESC`,
      [shipment.id]
    );

    return NextResponse.json({ shipment, tracking_history: trackingResult.rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shipment' }, { status: 500 });
  }
}
