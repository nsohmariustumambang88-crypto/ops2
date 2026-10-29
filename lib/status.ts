// The shipment statuses the team can set. Each one maps to a roadmap stage (0 to 4) or to null
// when it does not move the shipment forward on the roadmap (on hold, cancelled, returned).
export const SHIPMENT_STATUSES = [
  { key: 'registered', label: 'Registered', stage: 0 },
  { key: 'picked_up', label: 'Picked up', stage: 1 },
  { key: 'out_for_delivery', label: 'Out for delivery', stage: 3 },
  { key: 'pending', label: 'Pending', stage: 0 },
  { key: 'on_hold', label: 'On hold', stage: null },
  { key: 'en_route', label: 'En route', stage: 2 },
  { key: 'in_transit', label: 'In transit', stage: 2 },
  { key: 'delivered', label: 'Delivered', stage: 4 },
  { key: 'cancelled', label: 'Canceled', stage: null },
  { key: 'returned', label: 'Returned', stage: null },
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number]['key'];

// Statuses saved before this list existed, mapped to the closest current status so old shipments still show.
const LEGACY_STATUS: Record<string, ShipmentStatus> = {
  held_at_customs: 'on_hold',
  delayed: 'on_hold',
  exception: 'on_hold',
  cleared_for_customs: 'in_transit',
};

export function isShipmentStatus(value: unknown): value is ShipmentStatus {
  return SHIPMENT_STATUSES.some((s) => s.key === value);
}

export function normalizeStatus(value: string): string {
  return LEGACY_STATUS[value] ?? value;
}

export function statusLabel(value: string): string {
  const key = normalizeStatus(value);
  return SHIPMENT_STATUSES.find((s) => s.key === key)?.label ?? value.replace(/_/g, ' ');
}

// Roadmap stage for a status, or null when the status does not place the shipment on the roadmap.
export function stageFor(value: string): number | null {
  const key = normalizeStatus(value);
  return SHIPMENT_STATUSES.find((s) => s.key === key)?.stage ?? null;
}
