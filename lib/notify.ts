import nodemailer from 'nodemailer';
import { db } from '@/lib/db';
import { SERVICE_EMAIL } from '@/lib/site';

// Statuses that send an email to the sender and receiver.
const MILESTONES: Record<string, string> = {
  picked_up: 'has been picked up',
  en_route: 'is on its way',
  in_transit: 'is in transit',
  on_hold: 'is on hold',
  out_for_delivery: 'is out for delivery',
  delivered: 'has been delivered',
  cancelled: 'has been canceled',
  returned: 'is being returned to the sender',
};

export function isMilestone(status: string) {
  return status in MILESTONES;
}

// Queue one email per address on the shipment. Sending happens in sendQueued().
export async function queueMilestone(shipmentId: number, reference: string, status: string, nextStep: string | null) {
  if (!isMilestone(status)) return;
  const s = await db.query('SELECT sender_name, sender_email, receiver_name, receiver_email FROM shipments WHERE id = $1', [shipmentId]);
  if (s.rows.length === 0) return;
  const row = s.rows[0];
  const recipients = [
    { email: row.sender_email, name: row.sender_name },
    { email: row.receiver_email, name: row.receiver_name },
  ].filter((r) => r.email && String(r.email).includes('@'));

  const subject = `Shipment ${reference} ${MILESTONES[status]}`;
  for (const r of recipients) {
    const lines = [
      `Hello ${r.name || ''},`,
      '',
      `Your shipment ${reference} ${MILESTONES[status]}.`,
    ];
    if (nextStep) lines.push('', `What happens next: ${nextStep}`);
    lines.push('', `Track it at any time with your reference number: ${reference}.`, '', 'OPS Logistics');
    const body = lines.join('\n');
    await db.query(
      'INSERT INTO shipment_notifications (shipment_id, recipient_email, subject, body) VALUES ($1, $2, $3, $4)',
      [shipmentId, r.email, subject, body]
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
    "SELECT id, recipient_email, subject, body FROM shipment_notifications WHERE status = 'queued' ORDER BY id LIMIT $1",
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
      });
      await db.query("UPDATE shipment_notifications SET status = 'sent', sent_at = now() WHERE id = $1", [n.id]);
      sent += 1;
    } catch (err) {
      await db.query("UPDATE shipment_notifications SET status = 'failed', error = $2 WHERE id = $1", [n.id, String(err)]);
    }
  }
  return { sent, configured: true };
}
