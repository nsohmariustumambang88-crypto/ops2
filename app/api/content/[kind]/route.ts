import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isContentKind } from '@/lib/content';

type Ctx = { params: Promise<{ kind: string }> };

// Public list of published items for one content kind.
export async function GET(_request: Request, { params }: Ctx) {
  const { kind } = await params;
  if (!isContentKind(kind)) return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });

  try {
    const r = await db.query(
      `SELECT id, kind, title, summary, image_url, link_url, created_at
       FROM site_content WHERE kind = $1 AND published = true
       ORDER BY sort_order, created_at DESC`,
      [kind]
    );
    // Cached at Vercel's edge for a minute, so repeat visits don't query the database.
    return NextResponse.json({ data: r.rows }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } });
  } catch {
    return NextResponse.json({ error: 'Could not load content' }, { status: 500 });
  }
}
