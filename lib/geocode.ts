import { db } from '@/lib/db';

export type Place = { lat: number; lng: number; label: string };

const USER_AGENT = 'OPS-Logistics-Tracking/1.0 (support@opslogistice.com)';

// One lookup against OpenStreetMap's Nominatim search. Returns null when nothing matches.
async function search(query: string): Promise<Place | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' } });
    if (!res.ok) return null;
    const rows = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    if (!rows.length) return null;
    return { lat: Number(rows[0].lat), lng: Number(rows[0].lon), label: rows[0].display_name };
  } catch {
    return null;
  }
}

// Tries the entered place first, then drops back to looser forms so an imperfect entry still
// lands somewhere sensible. The caller marks which level was used.
export async function geocodePlace(place: string | null, city: string | null, country: string | null): Promise<Place | null> {
  const attempts = [
    [place, country],
    [city, country],
    [place],
    [country],
  ]
    .map((parts) => parts.filter((p) => p && String(p).trim()).join(', '))
    .filter((q, i, all) => q && all.indexOf(q) === i);

  for (const q of attempts) {
    const found = await search(q);
    if (found) return found;
  }
  return null;
}

// Returns the stored coordinates for a shipment's origin and destination, geocoding any that are
// missing and saving the result, so each place is looked up once rather than on every page view.
export async function ensureShipmentPlaces(shipmentId: number) {
  const r = await db.query(
    `SELECT route_origin, route_destination, sender_city, sender_country, receiver_city, receiver_country,
            origin_lat, origin_lng, destination_lat, destination_lng, origin_label, destination_label
     FROM shipments WHERE id = $1`,
    [shipmentId]
  );
  if (r.rows.length === 0) return null;
  const s = r.rows[0];

  // A label of null means "not looked up yet". An empty label means the lookup ran and found nothing,
  // so it is not repeated until the address changes (the admin update clears these fields).
  let origin: Place | null = s.origin_lat != null ? { lat: s.origin_lat, lng: s.origin_lng, label: s.origin_label ?? '' } : null;
  let destination: Place | null = s.destination_lat != null ? { lat: s.destination_lat, lng: s.destination_lng, label: s.destination_label ?? '' } : null;

  if (s.origin_label === null) {
    const found = await geocodePlace(s.route_origin, s.sender_city, s.sender_country);
    origin = found;
    await db.query(
      'UPDATE shipments SET origin_lat = $1, origin_lng = $2, origin_label = $3 WHERE id = $4',
      [found?.lat ?? null, found?.lng ?? null, found?.label ?? '', shipmentId]
    );
  }
  if (s.destination_label === null) {
    const found = await geocodePlace(s.route_destination, s.receiver_city, s.receiver_country);
    destination = found;
    await db.query(
      'UPDATE shipments SET destination_lat = $1, destination_lng = $2, destination_label = $3 WHERE id = $4',
      [found?.lat ?? null, found?.lng ?? null, found?.label ?? '', shipmentId]
    );
  }
  return { origin, destination };
}
