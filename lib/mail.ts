import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { SERVICE_EMAIL } from '@/lib/site';
import { transporter } from '@/lib/notify';

// The support mailbox. Uses the same mailbox login as sending unless IMAP settings are given.
function imapClient() {
  return new ImapFlow({
    host: process.env.IMAP_HOST ?? 'imap.hostinger.com',
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: true,
    auth: {
      user: process.env.IMAP_USER ?? process.env.SMTP_USER ?? SERVICE_EMAIL,
      pass: process.env.IMAP_PASS ?? process.env.SMTP_PASS ?? '',
    },
    logger: false,
  });
}

export type InboxItem = { uid: number; from: string; subject: string; date: string | null; seen: boolean };

// The newest messages in the inbox. Opens a connection only when called.
export async function listInbox(limit = 30): Promise<InboxItem[]> {
  const client = imapClient();
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    const total = client.mailbox && typeof client.mailbox === 'object' ? client.mailbox.exists : 0;
    if (!total) return [];
    const first = Math.max(1, total - limit + 1);
    const items: InboxItem[] = [];
    for await (const msg of client.fetch(`${first}:*`, { envelope: true, uid: true, flags: true, internalDate: true })) {
      const sender = msg.envelope?.from?.[0];
      items.push({
        uid: msg.uid,
        from: sender ? (sender.name ? `${sender.name} <${sender.address}>` : String(sender.address)) : 'Unknown sender',
        subject: msg.envelope?.subject || '(no subject)',
        date: msg.internalDate ? new Date(msg.internalDate).toISOString() : null,
        seen: msg.flags?.has('\Seen') ?? false,
      });
    }
    return items.sort((a, b) => b.uid - a.uid);
  } finally {
    lock.release();
    await client.logout();
  }
}

export type InboxMessage = { uid: number; from: string; to: string; subject: string; date: string | null; text: string };

// One message as plain text. HTML is not returned, so the admin page never renders mail markup.
export async function readInboxMessage(uid: number): Promise<InboxMessage | null> {
  const client = imapClient();
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    const download = await client.download(String(uid), undefined, { uid: true });
    if (!download.content) return null;
    const parsed = await simpleParser(download.content);
    return {
      uid,
      from: parsed.from?.text ?? '',
      to: parsed.to ? (Array.isArray(parsed.to) ? parsed.to.map((t) => t.text).join(', ') : parsed.to.text) : '',
      subject: parsed.subject ?? '(no subject)',
      date: parsed.date ? parsed.date.toISOString() : null,
      text: (parsed.text ?? '').slice(0, 20000),
    };
  } catch {
    return null;
  } finally {
    lock.release();
    await client.logout();
  }
}

// Sends a reply from the support mailbox.
export async function sendReply(to: string, subject: string, text: string) {
  const mail = transporter();
  if (!mail) throw new Error('Mail sending is not configured');
  await mail.sendMail({
    from: process.env.SMTP_FROM ?? `OPS Logistics <${SERVICE_EMAIL}>`,
    to,
    subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
    text,
  });
}
