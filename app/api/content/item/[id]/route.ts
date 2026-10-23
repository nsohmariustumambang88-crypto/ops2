import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

// Public single published item.
export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const r = await db.query(
      `SELECT id, kind, title, summary, body, image_url, link_url, created_at
       FROM site_content WHERE id = $1 AND published = true`,
      [id]
    );
    if (r.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(r.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Could not load this item' }, { status: 500 });
  }
}
