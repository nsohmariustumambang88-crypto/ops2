import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ENQUIRY_KINDS } from '@/lib/content';

// Public form submissions: contact, quote, ship-now and business account requests.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send the form as JSON' }, { status: 400 });
  }

  const kind = String(body.kind ?? '');
  if (!(ENQUIRY_KINDS as readonly string[]).includes(kind)) {
    return NextResponse.json({ error: 'Unknown form type' }, { status: 400 });
  }

  const text = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim());
  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone);
  const company = text(body.company);
  const message = text(body.message);
  const payload = typeof body.payload === 'object' && body.payload !== null ? body.payload : {};

  if (!name) return NextResponse.json({ error: 'Your name is required' }, { status: 400 });
  if (!email.includes('@')) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });

  try {
    const r = await db.query(
      `INSERT INTO contact_submissions (kind, name, email, phone, company, message, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
      [kind, name, email, phone || null, company || null, message || null, JSON.stringify(payload)]
    );
    return NextResponse.json({ message: 'Thank you. We have received your request.', submission: r.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Your request could not be sent. Please try again.' }, { status: 500 });
  }
}
