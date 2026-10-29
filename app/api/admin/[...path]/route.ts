import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { authorize } from '@/lib/access';
import { GRANTABLE } from '@/lib/permissions';
import { listInbox, readInboxMessage, sendReply } from '@/lib/mail';
import { pickShipmentFields, newReferenceNumber } from '@/lib/shipments';
import { isContentKind, pickContentFields } from '@/lib/content';
import { queueMilestone, sendQueued } from '@/lib/notify';
import { isShipmentStatus } from '@/lib/status';

const ENQUIRY_STATUSES = ['new', 'in_progress', 'closed'];

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

const USER_ROLES = ['admin', 'support', 'customer'];

// Only permissions the app knows about can be saved on a user.
function cleanPermissions(value: unknown): string[] {
  const allowed = new Set<string>(GRANTABLE);
  return Array.isArray(value) ? [...new Set(value.map(String))].filter((p) => allowed.has(p)) : [];
}

export async function GET(request: Request, { params }: Ctx) {
  const path = (await params).path.join('/');
  const auth = await authorize(request, 'GET', path);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const url = new URL(request.url);

  try {
    const detail = path.match(new RegExp('^shipments\\/([^/]+)$'));
    if (detail && /^\d+$/.test(detail[1])) {
      const sh = await db.query('SELECT * FROM shipments WHERE id = $1', [detail[1]]);
      if (sh.rows.length === 0) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
      const ev = await db.query('SELECT id, status, location, notes, next_step, timestamp FROM shipment_tracking WHERE shipment_id = $1 ORDER BY timestamp DESC', [detail[1]]);
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

    if (path === 'inbox') {
      return NextResponse.json({ data: await listInbox(30) });
    }

    const inboxMessage = path.match(new RegExp('^inbox\/([0-9]+)$'));
    if (inboxMessage) {
      const message = await readInboxMessage(Number(inboxMessage[1]));
      if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      return NextResponse.json(message);
    }

    const contentList = path.match(new RegExp('^content\\/([^/]+)$'));
    if (contentList) {
      if (!isContentKind(contentList[1])) return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
      const r = await db.query('SELECT * FROM site_content WHERE kind = $1 ORDER BY sort_order, id DESC', [contentList[1]]);
      return NextResponse.json({ data: r.rows });
    }

    if (path === 'contact-submissions') {
      const status = url.searchParams.get('status');
      return listQuery(
        'SELECT id, kind, name, email, phone, company, message, payload, status, created_at FROM contact_submissions',
        status ? 'status = $1' : null, status ? [status] : [], 'created_at DESC', url
      );
    }

    if (path === 'users') {
      const r = await db.query(
        'SELECT id, email, first_name, last_name, role, status, permissions, created_at FROM users ORDER BY created_at DESC'
      );
      return NextResponse.json(r.rows);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const path = (await params).path.join('/');
  const auth = await authorize(request, 'POST', path);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

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
      const body = await request.json();
      if (!body.sender_name || !body.receiver_name) {
        return NextResponse.json({ error: 'Sender name and receiver name are required' }, { status: 400 });
      }
      const fields = pickShipmentFields(body);
      let reference = newReferenceNumber();
      for (let i = 0; i < 10; i++) {
        const taken = await db.query('SELECT 1 FROM shipments WHERE reference_number = $1 OR tracking_number = $1', [reference]);
        if (taken.rows.length === 0) break;
        reference = newReferenceNumber();
      }
      if (fields.status != null && !isShipmentStatus(fields.status)) {
        return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
      }
      fields.reference_number = reference;
      fields.tracking_number = reference;
      fields.status = fields.status ?? 'registered';
      const keys = Object.keys(fields);
      const sql = `INSERT INTO shipments (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING id, reference_number, tracking_number, status`;
      const r = await db.query(sql, Object.values(fields));
      return NextResponse.json({ message: 'Shipment registered', shipment: r.rows[0] }, { status: 201 });
    }

    const evMatch = path.match(new RegExp('^shipments\\/([^/]+)\\/events$'));
    if (evMatch && /^\d+$/.test(evMatch[1])) {
      const { status, location, notes, latitude, longitude, next_step, delivered_to } = await request.json();
      if (!isShipmentStatus(status)) return NextResponse.json({ error: 'Choose a valid status' }, { status: 400 });
      const lat = latitude === '' || latitude == null ? null : Number(latitude);
      const lng = longitude === '' || longitude == null ? null : Number(longitude);
      const nextStep = next_step ? String(next_step).trim() : null;
      await db.query(
        'UPDATE shipments SET status = $1, delivered_to = COALESCE($3, delivered_to), updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [status, evMatch[1], status === 'delivered' && delivered_to ? String(delivered_to).trim() : null]
      );
      const r = await db.query('INSERT INTO shipment_tracking (shipment_id, status, location, notes, latitude, longitude, next_step) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, status, location, notes, timestamp, latitude, longitude, next_step', [evMatch[1], status, location || null, notes || null, lat, lng, nextStep]);
      const ref = await db.query('SELECT reference_number, tracking_number FROM shipments WHERE id = $1', [evMatch[1]]);
      await queueMilestone(Number(evMatch[1]), ref.rows[0]?.reference_number || ref.rows[0]?.tracking_number, status, nextStep);
      await sendQueued();
      return NextResponse.json({ message: 'Event added', event: r.rows[0] }, { status: 201 });
    }

    const contentCreate = path.match(new RegExp('^content\\/([^/]+)$'));
    if (contentCreate) {
      if (!isContentKind(contentCreate[1])) return NextResponse.json({ error: 'Unknown content type' }, { status: 404 });
      const fields = pickContentFields(await request.json());
      if (!fields.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      const r = await db.query(
        `INSERT INTO site_content (kind, title, summary, body, image_url, link_url, published, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [contentCreate[1], fields.title, fields.summary, fields.body, fields.image_url, fields.link_url, fields.published, fields.sort_order]
      );
      return NextResponse.json({ message: 'Saved', item: r.rows[0] }, { status: 201 });
    }

    if (path === 'inbox/reply') {
      const { to, subject, text } = await request.json();
      const recipient = String(to ?? '').trim();
      if (!recipient.includes('@')) return NextResponse.json({ error: 'A valid recipient is required' }, { status: 400 });
      if (!String(text ?? '').trim()) return NextResponse.json({ error: 'Write a reply first' }, { status: 400 });
      try {
        await sendReply(recipient, String(subject ?? '(no subject)'), String(text));
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not send the reply' }, { status: 500 });
      }
      return NextResponse.json({ message: 'Reply sent' }, { status: 201 });
    }

    if (path === 'users') {
      const body = await request.json();
      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const role = String(body.role ?? 'support');
      if (!email.includes('@')) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
      if (password.length < 8) return NextResponse.json({ error: 'The password must be at least 8 characters' }, { status: 400 });
      if (!USER_ROLES.includes(role)) return NextResponse.json({ error: 'Unknown role' }, { status: 400 });
      const taken = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
      if (taken.rows.length) return NextResponse.json({ error: 'That email already has an account' }, { status: 409 });
      const passwordHash = await bcrypt.hash(password, 10);
      const r = await db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, status, permissions)
         VALUES ($1, $2, $3, $4, $5, 'active', $6) RETURNING id, email, role, permissions`,
        [email, passwordHash, body.first_name || null, body.last_name || null, role, JSON.stringify(cleanPermissions(body.permissions))]
      );
      return NextResponse.json({ message: 'User created successfully', user: r.rows[0] }, { status: 201 });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  const path = (await params).path.join('/');
  const auth = await authorize(request, 'PUT', path);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const shipmentEdit = path.match(new RegExp('^shipments\\/([0-9]+)$'));
    if (shipmentEdit) {
      const fields = pickShipmentFields(await request.json());
      if ('status' in fields && !isShipmentStatus(fields.status)) {
        return NextResponse.json({ error: 'Choose a valid status' }, { status: 400 });
      }
      delete fields.reference_number;
      // A changed origin or destination must be looked up again on the next track view.
      if ('route_origin' in fields || 'sender_city' in fields || 'sender_country' in fields) {
        Object.assign(fields, { origin_lat: null, origin_lng: null, origin_label: null });
      }
      if ('route_destination' in fields || 'receiver_city' in fields || 'receiver_country' in fields) {
        Object.assign(fields, { destination_lat: null, destination_lng: null, destination_label: null });
      }
      const keys = Object.keys(fields);
      if (keys.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
      const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
      const before = await db.query('SELECT status FROM shipments WHERE id = $1', [shipmentEdit[1]]);
      const r = await db.query(
        `UPDATE shipments SET ${set}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
        [...Object.values(fields), shipmentEdit[1]]
      );
      if (r.rows.length === 0) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });

      // A status changed on the edit page is recorded as a tracking update, so the public page and emails match.
      const newStatus = r.rows[0].status as string;
      if (before.rows[0] && before.rows[0].status !== newStatus) {
        await db.query(
          'INSERT INTO shipment_tracking (shipment_id, status, notes) VALUES ($1, $2, $3)',
          [shipmentEdit[1], newStatus, 'Status updated by the OPS team']
        );
        await queueMilestone(Number(shipmentEdit[1]), r.rows[0].reference_number || r.rows[0].tracking_number, newStatus, null);
        await sendQueued();
      }
      return NextResponse.json({ message: 'Shipment updated', shipment: r.rows[0] });
    }

    const settingMatch = path.match(new RegExp('^settings\\/([^/]+)$'));
    if (settingMatch) {
      const { value } = await request.json();
      const r = await db.query(
        'INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, now()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now() RETURNING key, value, updated_at',
        [settingMatch[1], String(value ?? '')]
      );
      return NextResponse.json({ message: 'Setting saved', setting: r.rows[0] });
    }

    const contentItem = path.match(new RegExp('^content\\/item\\/([0-9]+)$'));
    if (contentItem) {
      const fields = pickContentFields(await request.json());
      if (!fields.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      const r = await db.query(
        `UPDATE site_content SET title = $1, summary = $2, body = $3, image_url = $4, link_url = $5,
                published = $6, sort_order = $7, updated_at = now()
         WHERE id = $8 RETURNING *`,
        [fields.title, fields.summary, fields.body, fields.image_url, fields.link_url, fields.published, fields.sort_order, contentItem[1]]
      );
      if (r.rows.length === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      return NextResponse.json({ message: 'Saved', item: r.rows[0] });
    }

    const enquiryUpdate = path.match(new RegExp('^contact-submissions\\/([0-9]+)$'));
    if (enquiryUpdate) {
      const { status } = await request.json();
      if (!ENQUIRY_STATUSES.includes(status)) return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
      const r = await db.query('UPDATE contact_submissions SET status = $1 WHERE id = $2 RETURNING id, status', [status, enquiryUpdate[1]]);
      if (r.rows.length === 0) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      return NextResponse.json({ message: 'Status saved', submission: r.rows[0] });
    }

    const userEdit = path.match(new RegExp('^users\/([0-9]+)$'));
    if (userEdit) {
      const id = Number(userEdit[1]);
      const body = await request.json();
      const isSelf = id === Number(auth.user.id);
      if (isSelf && ((body.role !== undefined && body.role !== 'admin') || body.status === 'disabled')) {
        return NextResponse.json({ error: 'You cannot demote or disable your own account' }, { status: 400 });
      }
      if (body.role !== undefined && !USER_ROLES.includes(String(body.role))) {
        return NextResponse.json({ error: 'Unknown role' }, { status: 400 });
      }
      if (body.status !== undefined && !['active', 'disabled'].includes(String(body.status))) {
        return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
      }
      const sets: string[] = [];
      const values: unknown[] = [];
      const add = (col: string, val: unknown) => { values.push(val); sets.push(`${col} = $${values.length}`); };
      if (body.first_name !== undefined) add('first_name', body.first_name || null);
      if (body.last_name !== undefined) add('last_name', body.last_name || null);
      if (body.role !== undefined) add('role', body.role);
      if (body.status !== undefined) add('status', body.status);
      if (body.permissions !== undefined) add('permissions', JSON.stringify(cleanPermissions(body.permissions)));
      if (body.password) {
        if (String(body.password).length < 8) return NextResponse.json({ error: 'The password must be at least 8 characters' }, { status: 400 });
        add('password_hash', await bcrypt.hash(String(body.password), 10));
      }
      if (sets.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
      values.push(id);
      const r = await db.query(
        `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length}
         RETURNING id, email, first_name, last_name, role, status, permissions`,
        values
      );
      if (r.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json({ message: 'User updated', user: r.rows[0] });
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
  const path = (await params).path.join('/');
  const auth = await authorize(request, 'DELETE', path);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const contentDelete = path.match(new RegExp('^content\\/item\\/([0-9]+)$'));
    if (contentDelete) {
      const r = await db.query('DELETE FROM site_content WHERE id = $1 RETURNING id', [contentDelete[1]]);
      if (r.rows.length === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      return NextResponse.json({ message: 'Item deleted' });
    }

    const enquiryDelete = path.match(new RegExp('^contact-submissions\\/([0-9]+)$'));
    if (enquiryDelete) {
      const r = await db.query('DELETE FROM contact_submissions WHERE id = $1 RETURNING id', [enquiryDelete[1]]);
      if (r.rows.length === 0) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      return NextResponse.json({ message: 'Submission deleted' });
    }

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
