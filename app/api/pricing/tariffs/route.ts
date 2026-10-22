import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(
      `SELECT id, country_code, hs_code, duty_percentage, tax_percentage, last_updated
       FROM tariff_rates
       ORDER BY country_code, hs_code`
    );
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tariff rates' }, { status: 500 });
  }
}
