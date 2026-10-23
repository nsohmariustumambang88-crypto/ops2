import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Lookup by tracking or reference number. Same data as /api/shipments/track, kept for older callers.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  try {
    const shipmentResult = await db.query(
      `SELECT id, tracking_number, reference_number, shipment_type, service_type, status, weight, dimensions,
              created_at, pickup_at, arrival_at
       FROM shipments
       WHERE tracking_number = $1 OR reference_number = $1`,
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
    const latest = trackingResult.rows[0] || {};

    return NextResponse.json({
      tracking_number: shipment.tracking_number,
      status: shipment.status,
      current_location: latest.location,
      last_update: latest.timestamp,
      estimated_delivery: shipment.arrival_at,
      shipment_type: shipment.shipment_type,
      service_type: shipment.service_type,
      weight: shipment.weight,
      tracking_history: trackingResult.rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch tracking information' }, { status: 500 });
  }
}
