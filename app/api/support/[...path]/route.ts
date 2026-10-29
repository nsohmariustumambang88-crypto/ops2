import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authorize } from '@/lib/access';

type Ctx = { params: Promise<{ path: string[] }> };

const fail = (msg: string, status = 500) => NextResponse.json({ error: msg }, { status });

async function adminGet(request: Request, path: string) {
  const auth = await authorize(request, 'GET', path);
  if ('error' in auth) return fail(auth.error, auth.status);
  const url = new URL(request.url);

  try {
    if (path === 'admin/tickets') {
      const status = url.searchParams.get('status');
      const priority = url.searchParams.get('priority');
      const page = Number(url.searchParams.get('page') || 1);
      const limit = Number(url.searchParams.get('limit') || 20);
      const conditions: string[] = [];
      const params: unknown[] = [];
      if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
      if (priority) { params.push(priority); conditions.push(`priority = $${params.length}`); }
      let sql = 'SELECT * FROM support_tickets';
      if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
      params.push(limit, (page - 1) * limit);
      sql += ` ORDER BY updated_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
      const r = await db.query(sql, params);
      return NextResponse.json({ data: r.rows, pagination: { page, limit } });
    }

    const ticketMatch = path.match(/^admin\/tickets\/([^/]+)$/);
    if (ticketMatch) {
      const t = await db.query('SELECT * FROM support_tickets WHERE id = $1', [ticketMatch[1]]);
      if (t.rows.length === 0) return fail('Ticket not found', 404);
      const m = await db.query('SELECT * FROM support_messages WHERE ticket_id = $1 ORDER BY created_at ASC', [ticketMatch[1]]);
      return NextResponse.json({ ticket: t.rows[0], messages: m.rows });
    }

    if (path === 'admin/articles') {
      const r = await db.query(
        `SELECT a.id, a.title, a.slug, a.status, a.featured, c.name AS category, a.created_at
         FROM support_articles a JOIN support_categories c ON a.category_id = c.id
         ORDER BY a.created_at DESC`
      );
      return NextResponse.json(r.rows);
    }

    if (path === 'admin/stats') {
      const r = await db.query(`SELECT
        (SELECT COUNT(*) FROM support_tickets) AS total_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') AS open_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'in_progress') AS in_progress,
        (SELECT COUNT(*) FROM support_tickets WHERE priority = 'urgent') AS urgent_tickets,
        (SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) FROM support_tickets WHERE status = 'closed') AS avg_resolution_hours`);
      return NextResponse.json(r.rows[0]);
    }

    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}

async function adminPost(request: Request, path: string) {
  const auth = await authorize(request, 'POST', path);
  if ('error' in auth) return fail(auth.error, auth.status);

  try {
    const msgMatch = path.match(/^admin\/tickets\/([^/]+)\/messages$/);
    if (msgMatch) {
      const { message, is_internal } = await request.json();
      if (!message) return fail('Message is required', 400);
      await db.query(
        `INSERT INTO support_messages (ticket_id, user_id, sender_type, message, is_internal)
         VALUES ($1, $2, $3, $4, $5)`,
        [msgMatch[1], auth.user.id, 'support', message, is_internal || false]
      );
      await db.query(
        `UPDATE support_tickets SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND status = 'open'`,
        [msgMatch[1]]
      );
      return NextResponse.json({ message: 'Message added successfully' }, { status: 201 });
    }

    if (path === 'admin/articles') {
      const { category_id, title, slug, content, keywords, featured } = await request.json();
      const r = await db.query(
        `INSERT INTO support_articles (category_id, title, slug, content, keywords, featured, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'published') RETURNING id, title, slug`,
        [category_id, title, slug, content, keywords, featured || false]
      );
      return NextResponse.json({ message: 'Article created successfully', article: r.rows[0] }, { status: 201 });
    }

    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}

export async function GET(request: Request, { params }: Ctx) {
  const path = (await params).path.join('/');
  if (path.startsWith('admin/')) return adminGet(request, path);
  const url = new URL(request.url);

  try {
    if (path === 'categories') {
      const r = await db.query(
        'SELECT id, name, slug, icon, description FROM support_categories ORDER BY order_index ASC'
      );
      return NextResponse.json(r.rows);
    }

    if (path === 'articles/featured') {
      const r = await db.query(
        `SELECT id, title, slug, description, views FROM support_articles
         WHERE featured = true AND status = 'published' ORDER BY views DESC LIMIT 5`
      );
      return NextResponse.json(r.rows);
    }

    const categoryMatch = path.match(/^articles\/category\/([^/]+)$/);
    if (categoryMatch) {
      const r = await db.query(
        `SELECT a.id, a.title, a.slug, a.content, a.views, a.helpful_count, a.unhelpful_count
         FROM support_articles a JOIN support_categories c ON a.category_id = c.id
         WHERE c.slug = $1 AND a.status = 'published' ORDER BY a.helpful_count DESC`,
        [categoryMatch[1]]
      );
      return NextResponse.json(r.rows);
    }

    const articleMatch = path.match(/^articles\/([^/]+)$/);
    if (articleMatch) {
      const r = await db.query(
        `SELECT * FROM support_articles WHERE slug = $1 AND status = 'published'`,
        [articleMatch[1]]
      );
      if (r.rows.length === 0) return fail('Article not found', 404);
      const article = r.rows[0];
      await db.query('UPDATE support_articles SET views = views + 1 WHERE id = $1', [article.id]);
      return NextResponse.json(article);
    }

    if (path === 'search') {
      const query = url.searchParams.get('query') || '';
      if (query.length < 2) return fail('Query too short', 400);
      const r = await db.query(
        `SELECT id, title, slug, description FROM support_articles
         WHERE (LOWER(title) LIKE $1 OR LOWER(content) LIKE $1 OR LOWER(keywords) LIKE $1)
           AND status = 'published'
         ORDER BY helpful_count DESC LIMIT 10`,
        [`%${query.toLowerCase()}%`]
      );
      return NextResponse.json(r.rows);
    }

    if (path === 'faqs') {
      const r = await db.query(
        'SELECT id, question, answer, category FROM support_faqs ORDER BY order_index ASC'
      );
      return NextResponse.json(r.rows);
    }

    const faqCategoryMatch = path.match(/^faqs\/([^/]+)$/);
    if (faqCategoryMatch) {
      const r = await db.query(
        'SELECT id, question, answer FROM support_faqs WHERE category = $1 ORDER BY order_index ASC',
        [faqCategoryMatch[1]]
      );
      return NextResponse.json(r.rows);
    }

    const ticketMatch = path.match(/^tickets\/([^/]+)$/);
    if (ticketMatch) {
      const r = await db.query(
        'SELECT id, ticket_number, subject, status, created_at, updated_at FROM support_tickets WHERE ticket_number = $1',
        [ticketMatch[1]]
      );
      if (r.rows.length === 0) return fail('Ticket not found', 404);
      const ticket = r.rows[0];
      const messages = await db.query(
        `SELECT id, sender_type, sender_name, message, created_at FROM support_messages
         WHERE ticket_id = $1 AND is_internal = false ORDER BY created_at ASC`,
        [ticket.id]
      );
      return NextResponse.json({ ticket, messages: messages.rows });
    }

    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const path = (await params).path.join('/');
  if (path.startsWith('admin/')) return adminPost(request, path);

  try {
    if (path === 'tickets') {
      const { email, name, phone, subject, category, priority, message, customer_id } = await request.json();
      if (!email || !subject || !message) return fail('Missing required fields', 400);
      const ticketNumber = 'TKT' + Date.now();
      const r = await db.query(
        `INSERT INTO support_tickets
          (ticket_number, customer_id, email, name, phone, subject, category, priority, message)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, ticket_number, created_at`,
        [ticketNumber, customer_id || null, email, name, phone, subject, category, priority, message]
      );
      return NextResponse.json({ message: 'Support ticket created successfully', ticket: r.rows[0] }, { status: 201 });
    }

    const ticketMessageMatch = path.match(/^tickets\/([^/]+)\/messages$/);
    if (ticketMessageMatch) {
      const { sender_name, message } = await request.json();
      if (!message) return fail('Message is required', 400);
      const t = await db.query('SELECT id FROM support_tickets WHERE ticket_number = $1', [ticketMessageMatch[1]]);
      if (t.rows.length === 0) return fail('Ticket not found', 404);
      const ticketId = t.rows[0].id;
      await db.query(
        `INSERT INTO support_messages (ticket_id, sender_type, sender_name, message) VALUES ($1, $2, $3, $4)`,
        [ticketId, 'customer', sender_name, message]
      );
      await db.query('UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [ticketId]);
      return NextResponse.json({ message: 'Message added successfully' }, { status: 201 });
    }

    const rateMatch = path.match(/^articles\/([^/]+)\/rate$/);
    if (rateMatch) {
      const { helpful } = await request.json();
      if (helpful === true) {
        await db.query('UPDATE support_articles SET helpful_count = helpful_count + 1 WHERE id = $1', [rateMatch[1]]);
      } else if (helpful === false) {
        await db.query('UPDATE support_articles SET unhelpful_count = unhelpful_count + 1 WHERE id = $1', [rateMatch[1]]);
      }
      return NextResponse.json({ message: 'Thank you for your feedback' });
    }

    const feedbackMatch = path.match(/^tickets\/([^/]+)\/feedback$/);
    if (feedbackMatch) {
      const { rating, feedback, would_recommend } = await request.json();
      await db.query(
        `INSERT INTO support_feedback (ticket_id, rating, feedback, would_recommend) VALUES ($1, $2, $3, $4)`,
        [feedbackMatch[1], rating, feedback, would_recommend]
      );
      await db.query("UPDATE support_tickets SET status = 'closed' WHERE id = $1", [feedbackMatch[1]]);
      return NextResponse.json({ message: 'Feedback submitted successfully' });
    }

    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  const auth = await authorize(request, 'PUT', (await params).path.join('/'));
  if ('error' in auth) return fail(auth.error, auth.status);
  const path = (await params).path.join('/');

  try {
    const m = path.match(/^admin\/tickets\/([^/]+)$/);
    if (m) {
      const { status, priority, assigned_to } = await request.json();
      const r = await db.query(
        `UPDATE support_tickets
         SET status = COALESCE($1, status), priority = COALESCE($2, priority), assigned_to = COALESCE($3, assigned_to)
         WHERE id = $4 RETURNING id, status, priority`,
        [status, priority, assigned_to, m[1]]
      );
      if (r.rows.length === 0) return fail('Ticket not found', 404);
      return NextResponse.json({ message: 'Ticket updated', ticket: r.rows[0] });
    }
    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}
