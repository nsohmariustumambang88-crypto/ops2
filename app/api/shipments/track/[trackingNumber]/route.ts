import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public tracking lookup by reference or numeric ID. Contact details are never returned here.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  try {
    const s = await db.query(
      `SELECT id, tracking_number, reference_number, status, transport_mode, carrier, flight_number,
              route_origin, route_destination, pickup_at, departure_at, arrival_at, service_type, shipment_type, weight,
              sender_city, sender_country, receiver_city, receiver_country, delivered_to, pet_document_checks
       FROM shipments WHERE tracking_number = $1 OR reference_number = $1 OR id = $2`,
      [trackingNumber, /^\d{1,9}$/.test(trackingNumber) ? Number(trackingNumber) : -1]
    );
    if (s.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const row = s.rows[0];
    const ev = await db.query(
      `SELECT status, location, timestamp, notes, next_step, latitude, longitude
       FROM shipment_tracking WHERE shipment_id = $1 ORDER BY timestamp DESC`,
      [row.id]
    );

    // Pet welfare checkpoints shown to the customer, taken from the team's document checklist.
    const checks = (row.pet_document_checks ?? {}) as Record<string, boolean>;
    const petChecks = row.shipment_type === 'pet'
      ? {
          crate_inspected: Boolean(checks.crate),
          documents_verified: Boolean(checks.microchip && checks.rabies_window && checks.health_certificate),
          airline_accepted: Boolean(checks.airline),
          handover_confirmed: Boolean(checks.handover),
        }
      : null;

    const { pet_document_checks: _omit, ...shipment } = row;
    void _omit;

    // Cached at Vercel's edge for 2 minutes, so repeated lookups don't run the function or the database each time.
    return NextResponse.json(
      { shipment: { ...shipment, pet_checks: petChecks }, tracking_history: ev.rows },
      { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=120, stale-while-revalidate=300' } }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shipment' }, { status: 500 });
  }
}
