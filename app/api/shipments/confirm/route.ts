import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readConfirmToken } from '@/lib/confirm';

const NO_STORE = { 'Cache-Control': 'no-store' };

// The shipment summary the receiver sees on the confirm page. Contact details are never returned.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  const id = readConfirmToken(token);
  if (!id) return NextResponse.json({ error: 'This link is not valid or has expired.' }, { status: 404, headers: NO_STORE });

  const r = await db.query(
    `SELECT COALESCE(reference_number, tracking_number) AS reference, status, carrier, transport_mode, service_type,
            shipment_type, weight, route_origin, route_destination, sender_city, sender_country,
            receiver_city, receiver_country, pickup_at, departure_at, arrival_at, pet_name, pet_species,
            receiver_response, receiver_response_note, receiver_responded_at
     FROM shipments WHERE id = $1`,
    [id]
  );
  if (r.rows.length === 0) return NextResponse.json({ error: 'This link is not valid or has expired.' }, { status: 404, headers: NO_STORE });
  return NextResponse.json({ shipment: r.rows[0] }, { headers: NO_STORE });
}

// Saves the receiver's answer: "confirm", or "issue" with a note describing the problem.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const id = readConfirmToken(String(body.token ?? ''));
  if (!id) return NextResponse.json({ error: 'This link is not valid or has expired.' }, { status: 404, headers: NO_STORE });

  const answer = body.answer;
  if (answer !== 'confirm' && answer !== 'issue') {
    return NextResponse.json({ error: 'Choose confirm or report a problem.' }, { status: 400, headers: NO_STORE });
  }
  const note = answer === 'issue' ? String(body.note ?? '').trim().slice(0, 2000) : null;
  if (answer === 'issue' && !note) {
    return NextResponse.json({ error: 'Tell us what is wrong so we can fix it.' }, { status: 400, headers: NO_STORE });
  }

  const r = await db.query(
    `UPDATE shipments SET receiver_response = $2, receiver_response_note = $3, receiver_responded_at = now()
     WHERE id = $1 RETURNING id`,
    [id, answer, note]
  );
  if (r.rows.length === 0) return NextResponse.json({ error: 'Shipment not found' }, { status: 404, headers: NO_STORE });
  return NextResponse.json({ message: 'Thank you. Your answer has been sent to the OPS team.' }, { headers: NO_STORE });
}
