-- The receiver's answer to the registration email: confirmed, or a problem with a note. Additive; safe to run more than once.
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_response TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_response_note TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_responded_at TIMESTAMP;
