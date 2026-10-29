import nodemailer from 'nodemailer';
import { db } from '@/lib/db';
import { SERVICE_EMAIL } from '@/lib/site';
import { COURIER_NAME } from '@/lib/shipments';
import { renderEmail, type EmailSection } from '@/lib/email-template';
import { statusLabel } from '@/lib/status';

// What each status says in the email. Every status in the shipment list sends one.
const MILESTONES: Record<string, string> = {
  registered: 'has been registered',
  pending: 'is pending',
  picked_up: 'has been picked up',
  en_route: 'is on its way',
  in_transit: 'is in transit',
  on_hold: 'is on hold',
  out_for_delivery: 'is out for delivery',
  delivered: 'has been delivered',
  cancelled: 'has been canceled',
  returned: 'is being returned to the sender',
};

const TRANSPORT: Record<string, string> = { land: 'Land', air: 'Air', sea: 'Sea' };

export function isMilestone(status: string) {
  return status in MILESTONES;
}

export function trackUrl(reference: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opslogistice.com';
  return `${base}/track?ref=${encodeURIComponent(reference)}`;
}

function when(value: string | Date | null | undefined) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return `${d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC`;
}

function place(city: string | null, country: string | null) {
  return [city, country].filter(Boolean).join(', ') || '—';
}

type ShipmentRow = Record<string, string | number | Date | null> & { id: number; reference_number: string | null; tracking_number: string };

// The shipment details shown in every status email. Same content as the printed receipt.
function receiptSections(s: ShipmentRow, latest: { status: string; location: string | null; notes: string | null; nextStep: string | null; timestamp: Date }): EmailSection[] {
  const str = (k: string) => (s[k] == null ? '—' : String(s[k]));
  const sections: EmailSection[] = [
    {
      title: 'Shipment',
      rows: [
        ['Reference', s.reference_number || s.tracking_number],
        ['Status', statusLabel(latest.status)],
        ['Courier', str('carrier') === '—' ? COURIER_NAME : str('carrier')],
        ['Transport', TRANSPORT[str('transport_mode')] ?? '—'],
        ['Flight, vessel or truck', str('flight_number')],
        ['Service', str('service_type')],
        ['Type', str('shipment_type')],
        ['Weight', s.weight ? `${s.weight} kg` : '—'],
      ],
    },
    {
      title: 'From and to',
      rows: [
        ['From', place(str('sender_city'), str('sender_country'))],
        ['Origin', str('route_origin')],
        ['Picked up', when(s.pickup_at as string | null)],
        ['To', place(str('receiver_city'), str('receiver_country'))],
        ['Destination', str('route_destination')],
        ['Estimated arrival', when(s.arrival_at as string | null)],
        ['Received by', str('delivered_to')],
      ],
    },
    {
      title: 'Latest update',
      rows: [
        ['Status', statusLabel(latest.status)],
        ['Location', latest.location ?? '—'],
        ['Time', when(latest.timestamp)],
        ['Notes', latest.notes ?? '—'],
        ['What happens next', latest.nextStep ?? '—'],
      ],
    },
  ];

  if (s.shipment_type === 'pet') {
    sections.push({
      title: 'Pet',
      rows: [
        ['Name', str('pet_name')],
        ['Species', str('pet_species')],
        ['Breed', str('pet_breed')],
        ['Colour and markings', str('pet_colour')],
        ['Weight', s.pet_weight ? `${s.pet_weight} kg` : '—'],
        ['Microchip', str('pet_microchip')],
        ['Travel in', str('pet_cabin_or_cargo')],
        ['Crate', str('pet_crate_type')],
        ['Health certificate', str('pet_health_certificate')],
        ['Quarantine at destination', str('pet_quarantine_required')],
        ['Travel insurance', str('pet_insurance')],
        ['Airline booking', str('pet_airline_booking')],
      ],
    });
  }
  return sections;
}

// Queues one email per address for this status: the sender and receiver, plus every active admin.
// Sending happens in sendQueued().
export async function queueMilestone(
  shipmentId: number,
  status: string,
  event: { location?: string | null; notes?: string | null; nextStep?: string | null } = {}
) {
  if (!isMilestone(status)) return;
  const r = await db.query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);
  if (r.rows.length === 0) return;
  const s = r.rows[0] as ShipmentRow;
  const reference = s.reference_number || s.tracking_number;
  const latest = {
    status,
    location: event.location ?? null,
    notes: event.notes ?? null,
    nextStep: event.nextStep ?? null,
    timestamp: new Date(),
  };
  const sections = receiptSections(s, latest);
  const action = MILESTONES[status];

  const customers = [
    { email: s.sender_email, name: s.sender_name, audience: 'customer' },
    { email: s.receiver_email, name: s.receiver_name, audience: 'customer' },
  ].filter((x) => x.email && String(x.email).includes('@')) as { email: string; name: string | null; audience: string }[];

  // Every active admin gets the same details, unless the address is already a customer.
  const admins = await db.query("SELECT email, first_name FROM users WHERE role = 'admin' AND status = 'active' AND email IS NOT NULL");
  const seen = new Set(customers.map((c) => String(c.email).toLowerCase()));
  const adminRecipients = admins.rows
    .filter((a) => a.email && !seen.has(String(a.email).toLowerCase()))
    .map((a) => ({ email: String(a.email), name: a.first_name as string | null, audience: 'admin' }));

  for (const to of [...customers, ...adminRecipients]) {
    const isAdmin = to.audience === 'admin';
    const subject = `${isAdmin ? '[Admin copy] ' : ''}Shipment ${reference} ${action}`;
    const { html, text } = renderEmail({
      heading: `Shipment ${reference} ${action}`,
      intro: [
        `Hello ${to.name || ''},`,
        isAdmin ? `This is the update sent to the customer for shipment ${reference}.` : `Your shipment ${reference} ${action}.`,
        ...(latest.nextStep ? [`What happens next: ${latest.nextStep}`] : []),
      ],
      sections,
      button: { label: 'Track this shipment', url: trackUrl(reference) },
      footer: isAdmin
        ? `OPS Logistics · Admin copy · ${SERVICE_EMAIL}`
        : `OPS Logistics · ${SERVICE_EMAIL}`,
    });
    await db.query(
      'INSERT INTO shipment_notifications (shipment_id, recipient_email, subject, body, html, audience) VALUES ($1, $2, $3, $4, $5, $6)',
      [shipmentId, to.email, subject, text, html, to.audience]
    );
  }
}

export function transporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

// Sends queued emails when SMTP is configured. Returns how many were sent.
export async function sendQueued(limit = 50) {
  const mail = transporter();
  if (!mail) return { sent: 0, configured: false };

  const queued = await db.query(
    "SELECT id, recipient_email, subject, body, html FROM shipment_notifications WHERE status = 'queued' ORDER BY id LIMIT $1",
    [limit]
  );
  let sent = 0;
  for (const n of queued.rows) {
    try {
      await mail.sendMail({
        from: process.env.SMTP_FROM ?? `OPS Logistics <${SERVICE_EMAIL}>`,
        to: n.recipient_email,
        subject: n.subject,
        text: n.body,
        html: n.html ?? undefined,
      });
      await db.query("UPDATE shipment_notifications SET status = 'sent', sent_at = now() WHERE id = $1", [n.id]);
      sent += 1;
    } catch (err) {
      await db.query("UPDATE shipment_notifications SET status = 'failed', error = $2 WHERE id = $1", [n.id, String(err)]);
    }
  }
  return { sent, configured: true };
}
