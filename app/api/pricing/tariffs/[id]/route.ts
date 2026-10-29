import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authorize } from '@/lib/access';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorize(request, 'PUT', 'pricing/tariffs');
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const { duty_percentage, tax_percentage, restrictions } = await request.json();
    const result = await db.query(
      `UPDATE tariff_rates
       SET duty_percentage = $1, tax_percentage = $2, restrictions = $3, last_updated = NOW()
       WHERE id = $4
       RETURNING id, country_code, hs_code, duty_percentage, tax_percentage`,
      [duty_percentage, tax_percentage, restrictions, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Tariff rate not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tariff rate updated', tariff: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update tariff rate' }, { status: 500 });
  }
}
