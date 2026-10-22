import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { tracking_numbers } = await request.json();
    if (!Array.isArray(tracking_numbers)) {
      return NextResponse.json({ error: 'tracking_numbers must be an array' }, { status: 400 });
    }

    const result = await db.query(
      `SELECT id, tracking_number, status, created_at
       FROM shipments
       WHERE tracking_number = ANY($1)`,
      [tracking_numbers]
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tracking information' }, { status: 500 });
  }
}
