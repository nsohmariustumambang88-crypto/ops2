-- Extra pet transport details on shipments. Additive only; safe to run more than once.
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_colour TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_owner_id TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_emergency_contact TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_airline_booking TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_medication TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_other_vaccinations TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_insurance TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pet_quarantine_required TEXT;
