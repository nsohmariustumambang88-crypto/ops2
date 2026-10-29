-- HTML version and audience (customer or admin copy) for shipment emails. Additive; safe to run more than once.
ALTER TABLE shipment_notifications ADD COLUMN IF NOT EXISTS html TEXT;
ALTER TABLE shipment_notifications ADD COLUMN IF NOT EXISTS audience TEXT NOT NULL DEFAULT 'customer';
