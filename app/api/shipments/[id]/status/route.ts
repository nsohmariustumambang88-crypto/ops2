import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getTokenUser(request)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const { id } = await params;

  try {
    const { status, location, notes } = await request.json();

    const shipmentResult = await db.query(
      'UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status',
      [status, id]
    );
    if (shipmentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    await db.query(
      'INSERT INTO shipment_tracking (shipment_id, status, location, notes) VALUES ($1, $2, $3, $4)',
      [id, status, location, notes]
    );

    return NextResponse.json({
      message: 'Shipment status updated',
      shipment: shipmentResult.rows[0],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
  }
}
