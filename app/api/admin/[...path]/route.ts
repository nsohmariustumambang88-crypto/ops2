import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

type Ctx = { params: Promise<{ path: string[] }> };

function page(url: URL) {
  const page = Number(url.searchParams.get('page') || 1);
  const limit = Number(url.searchParams.get('limit') || 20);
  return { page, limit, offset: (page - 1) * limit };
}

async function listQuery(base: string, where: string | null, whereParams: unknown[], order: string, url: URL) {
  const { page: p, limit, offset } = page(url);
  const params = [...whereParams, limit, offset];
  const sql = `${base}${where ? ` WHERE ${where}` : ''} ORDER BY ${order} LIMIT $${whereParams.length + 1} OFFSET $${whereParams.length + 2}`;
  const result = await db.query(sql, params);
  return NextResponse.json({ data: result.rows, pagination: { page: p, limit } });
}

export async function GET(request: Request, { params }: Ctx) {
  const auth = requireUser(request, ['admin', 'support']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const path = (await params).path.join('/');
  const url = new URL(request.url);

  try {
    const detail = path.match(new RegExp('^shipments\\/([^/]+)$'));
    if (detail && /^\d+$/.test(detail[1])) {
      const sh = await db.query('SELECT * FROM shipments WHERE id = $1', [detail[1]]);
      if (sh.rows.length === 0) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
      const ev = await db.query('SELECT id, status, location, notes, timestamp FROM shipment_tracking WHERE shipment_id = $1 ORDER BY timestamp DESC', [detail[1]]);
      return NextResponse.json({ shipment: sh.rows[0], events: ev.rows });
    }

    if (path === 'settings') {
      const r = await db.query('SELECT key, value, updated_at FROM site_settings ORDER BY key');
      return NextResponse.json({ data: r.rows });
    }

    if (path === 'subscribers') {
      const r = await db.query('SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC LIMIT 500');
      return NextResponse.json({ data: r.rows });
    }

    if (path === 'dashboard') {
      const r = await db.query(`SELECT
        (SELECT COUNT(*) FROM shipments) AS total_shipments,
        (SELECT COUNT(*) FROM shipments WHERE status = 'delivered') AS delivered,
        (SELECT COUNT(*) FROM shipments WHERE status = 'in_transit') AS in_transit,
        (SELECT COUNT(*) FROM shipments WHERE status = 'failed') AS failed,
        (SELECT COUNT(*) FROM orders WHERE payment_status = 'paid') AS total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'paid') AS total_revenue,
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM users) AS total_users`);
      return NextResponse.json(r.rows[0]);
    }

    if (path === 'shipments') {
      const status = url.searchParams.get('status');
      return listQuery(
        'SELECT id, tracking_number, customer_id, status, weight, created_at FROM shipments',
        status ? 'status = $1' : null, status ? [status] : [], 'created_at DESC', url
      );
    }

    if (path === 'customers') {
      const tier = url.searchParams.get('volume_tier');
      return listQuery(
        `SELECT c.id, c.business_name, c.phone, c.volume_tier, c.total_shipments, c.total_spending, u.email, c.created_at
         FROM customers c JOIN users u ON c.user_id = u.id`,
        tier ? 'c.volume_tier = $1' : null, tier ? [tier] : [], 'c.created_at DESC', url
      );
    }

    const customerMatch = path.match(/^customers\/([^/]+)$/);
    if (customerMatch) {
      const r = await db.query(
        `SELECT c.id, c.business_name, c.phone, c.industry, c.volume_tier, c.total_shipments, c.total_spending,
                u.email, u.first_name, u.last_name
         FROM customers c JOIN users u ON c.user_id = u.id WHERE c.id = $1`,
        [customerMatch[1]]
      );
      if (r.rows.length === 0) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      return NextResponse.json(r.rows[0]);
    }

    if (path === 'orders') {
      const status = url.searchParams.get('payment_status');
      return listQuery(
        `SELECT o.id, o.order_number, o.customer_id, o.total_amount, o.payment_status, o.order_status, o.created_at FROM orders o`,
        status ? 'o.payment_status = $1' : null, status ? [status] : [], 'o.created_at DESC', url
      );
    }

    if (path === 'reports/revenue') {
      const start = url.searchParams.get('start_date');
      const end = url.searchParams.get('end_date');
      const params: unknown[] = [];
      let sql = `SELECT DATE(created_at) AS date, COUNT(*) AS orders, COALESCE(SUM(total_amount), 0) AS revenue
                 FROM orders WHERE payment_status = 'paid'`;
      if (start) { params.push(start); sql += ` AND created_at >= $${params.length}`; }
      if (end) { params.push(end); sql += ` AND created_at <= $${params.length}`; }
      sql += ' GROUP BY DATE(created_at) ORDER BY date DESC';
      const r = await db.query(sql, params);
      return NextResponse.json(r.rows);
    }

    if (path === 'reports/shipments') {
      const r = await db.query(
        'SELECT service_type, COUNT(*) AS count, AVG(weight) AS avg_weight FROM shipments GROUP BY service_type ORDER BY count DESC'
      );
      return NextResponse.json(r.rows);
    }

    if (path === 'users') {
      const r = await db.query(
        'SELECT id, email, first_name, last_name, role, status, created_at FROM users ORDER BY created_at DESC'
      );
      return NextResponse.json(r.rows);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const auth = requireUser(request, ['admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const path = (await params).path.join('/');

  try {
    if (path === 'subscribers') {
      const { email } = await request.json();
      if (!email || !String(email).includes('@')) {
        return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
      }
      const r = await db.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id, email, created_at', [String(email).trim().toLowerCase()]);
      if (r.rows.length === 0) return NextResponse.json({ error: 'That email is already subscribed' }, { status: 409 });
      return NextResponse.json({ message: 'Subscriber added', subscriber: r.rows[0] }, { status: 201 });
    }

    if (path === 'shipments') {
      const b = await request.json();
      if (!b.customer_id || !b.tracking_number) {
        return NextResponse.json({ error: 'Customer and tracking number are required' }, { status: 400 });
      }
      const r = await db.query(
        `INSERT INTO shipments (tracking_number, customer_id, shipment_type, service_type, weight, dimensions, contents, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, tracking_number, status`,
        [b.tracking_number, b.customer_id, b.shipment_type || null, b.service_type || null, b.weight || null, b.dimensions || null, b.contents || null, b.status || 'registered']
      );
      return NextResponse.json({ message: 'Shipment created', shipment: r.rows[0] }, { status: 201 });
    }

    const evMatch = path.match(new RegExp('^shipments\\/([^/]+)\\/events$'));
    if (evMatch && /^\d+$/.test(evMatch[1])) {
      const { status, location, notes } = await request.json();
      if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });
      await db.query('UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, evMatch[1]]);
      const r = await db.query('INSERT INTO shipment_tracking (shipment_id, status, location, notes) VALUES ($1, $2, $3, $4) RETURNING id, status, location, notes, timestamp', [evMatch[1], status, location || null, notes || null]);
      return NextResponse.json({ message: 'Event added', event: r.rows[0] }, { status: 201 });
    }

    if (path === 'users') {
      const { email, password, first_name, last_name, role } = await request.json();
      const passwordHash = await bcrypt.hash(password, 10);
      const r = await db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role`,
        [email, passwordHash, first_name, last_name, role]
      );
      return NextResponse.json({ message: 'User created successfully', user: r.rows[0] }, { status: 201 });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  const auth = requireUser(request, ['admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const path = (await params).path.join('/');

  try {
    const settingMatch = path.match(new RegExp('^settings\\/([^/]+)$'));
    if (settingMatch) {
      const { value } = await request.json();
      const r = await db.query(
        'INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, now()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now() RETURNING key, value, updated_at',
        [settingMatch[1], String(value ?? '')]
      );
      return NextResponse.json({ message: 'Setting saved', setting: r.rows[0] });
    }

    const tierMatch = path.match(/^customers\/([^/]+)\/tier$/);
    if (tierMatch) {
      const { volume_tier } = await request.json();
      const r = await db.query(
        'UPDATE customers SET volume_tier = $1 WHERE id = $2 RETURNING id, volume_tier',
        [volume_tier, tierMatch[1]]
      );
      if (r.rows.length === 0) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      return NextResponse.json({ message: 'Customer tier updated', customer: r.rows[0] });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  const auth = requireUser(request, ['admin']);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const path = (await params).path.join('/');

  try {
    const m = path.match(new RegExp('^subscribers\/([0-9]+)$'));
    if (m) {
      const r = await db.query('DELETE FROM subscribers WHERE id = $1 RETURNING id', [m[1]]);
      if (r.rows.length === 0) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
      return NextResponse.json({ message: 'Subscriber removed' });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
