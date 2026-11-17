-- Indexes for the email log and the shipment lists. Safe to run more than once.
CREATE INDEX IF NOT EXISTS idx_shipment_notifications_shipment ON shipment_notifications (shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_notifications_status ON shipment_notifications (status, created_at);
CREATE INDEX IF NOT EXISTS idx_shipments_created ON shipments (created_at);
CREATE INDEX IF NOT EXISTS idx_shipments_reference ON shipments (reference_number);
