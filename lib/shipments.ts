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
  const a = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  const b = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `OPS${a}-${b}`;
}
