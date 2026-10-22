export const SHIPMENT_FIELDS = [
  'customer_id', 'tracking_number', 'status', 'transport_mode', 'carrier', 'flight_number',
  'route_origin', 'route_destination', 'departure_at', 'arrival_at',
  'shipment_type', 'service_type', 'weight', 'dimensions', 'contents', 'priority',
  'sender_name', 'sender_email', 'sender_phone', 'sender_address', 'sender_city', 'sender_country', 'sender_postal_code',
  'receiver_name', 'receiver_email', 'receiver_phone', 'receiver_address', 'receiver_city', 'receiver_country', 'receiver_postal_code',
] as const;

export const TRANSPORT_MODES = ['land', 'air', 'sea'] as const;

export function pickShipmentFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of SHIPMENT_FIELDS) {
    if (key in body) {
      const v = body[key];
      out[key] = v === '' || v === undefined ? null : v;
    }
  }
  return out;
}

export function newReferenceNumber() {
  const d = new Date();
  const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OPS-${stamp}-${rand}`;
}
