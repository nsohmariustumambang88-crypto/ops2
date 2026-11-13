import jwt from 'jsonwebtoken';

// A signed link the receiver uses to confirm their shipment details. It names only the shipment and
// expires after 60 days, so it cannot be guessed or used to read other shipments.
const PURPOSE = 'receiver-confirm';

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET is not set');
  return value;
}

export function confirmToken(shipmentId: number) {
  return jwt.sign({ sid: shipmentId, purpose: PURPOSE }, secret(), { expiresIn: '60d' });
}

export function readConfirmToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, secret()) as { sid?: number; purpose?: string };
    if (payload.purpose !== PURPOSE || typeof payload.sid !== 'number') return null;
    return payload.sid;
  } catch {
    return null;
  }
}

export function confirmUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opslogistice.com';
  return `${base}/confirm?token=${encodeURIComponent(token)}`;
}
