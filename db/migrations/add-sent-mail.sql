-- Replies the team sends from the support inbox, kept so they can be shown next to the customer's messages.
-- Safe to run more than once.
CREATE TABLE IF NOT EXISTS sent_mail (
  id SERIAL PRIMARY KEY,
  to_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_by TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sent_mail_to ON sent_mail (to_address, created_at);
