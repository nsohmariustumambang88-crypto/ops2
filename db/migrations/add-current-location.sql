-- Where the package is right now, shown on the map. Additive; safe to run more than once.
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_location TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_lat DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_lng DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_location_at TIMESTAMP;
