import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getTokenUser(request)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const { id } = await params;

  try {
    const shipmentResult = await db.query('SELECT * FROM shipments WHERE id = $1', [id]);
    if (shipmentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const itemsResult = await db.query('SELECT * FROM shipment_items WHERE shipment_id = $1', [id]);
    const trackingResult = await db.query(
      'SELECT * FROM shipment_tracking WHERE shipment_id = $1 ORDER BY timestamp DESC',
      [id]
    );

    return NextResponse.json({
      shipment: shipmentResult.rows[0],
      items: itemsResult.rows,
      tracking: trackingResult.rows,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shipment details' }, { status: 500 });
  }
}
