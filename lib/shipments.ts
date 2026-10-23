export const SHIPMENT_FIELDS = [
  'tracking_number', 'status', 'transport_mode', 'carrier', 'flight_number',
  'route_origin', 'route_destination', 'pickup_at', 'departure_at', 'arrival_at',
  'shipment_type', 'service_type', 'weight', 'dimensions', 'contents', 'priority',
  'sender_name', 'sender_email', 'sender_phone', 'sender_address', 'sender_city', 'sender_country', 'sender_postal_code',
  'receiver_name', 'receiver_email', 'receiver_phone', 'receiver_address', 'receiver_city', 'receiver_country', 'receiver_postal_code',
  'pet_name', 'pet_species', 'pet_breed', 'pet_sex', 'pet_date_of_birth', 'pet_weight', 'pet_microchip',
  'pet_travel_purpose', 'pet_cabin_or_cargo', 'pet_crate_type', 'pet_crate_size', 'pet_health_certificate',
  'pet_rabies_vaccination_date', 'pet_import_permit', 'pet_vet_name', 'pet_vet_phone', 'pet_handling_notes',
] as const;

export const TRANSPORT_MODES = ['land', 'air', 'sea'] as const;

export const COURIER_NAME = 'OPS Logistics';

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

// Converts a stored shipment row into the string values the form and receipt use.
export function toFormValues(shipment: Record<string, unknown>) {
  const values: Record<string, string> = {};
  Object.entries(shipment).forEach(([k, v]) => {
    values[k] = v === null || v === undefined ? '' : String(v);
  });
  for (const key of ['pickup_at', 'departure_at', 'arrival_at']) {
    if (shipment[key]) values[key] = new Date(String(shipment[key])).toISOString();
  }
  return values;
}

export function newReferenceNumber() {
  const a = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  const b = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `OPS${a}-${b}`;
}
