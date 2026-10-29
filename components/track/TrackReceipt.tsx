'use client';

import type { Lang } from '@/lib/i18n';
import { copyFor } from '@/components/track/copy';
import { normalizeStatus, statusLabel } from '@/lib/status';
import type { TrackEvent, TrackShipment } from '@/components/track/TrackResult';

// Printed receipt for a shipment: the details that matter, in the same layout as the admin receipt.
export default function TrackReceipt({ shipment, events, reference, lang }: { shipment: TrackShipment; events: TrackEvent[]; reference: string; lang: Lang }) {
  const c = copyFor(lang);
  const locale = lang === 'fr' ? 'fr-FR' : undefined;
  const fmt = (v: string | null) => (v ? new Date(v).toLocaleString(locale) : '—');
  const or = (v: string | null | undefined) => (v && String(v).trim() ? String(v) : '—');
  const status = normalizeStatus(shipment.status);
  const latest = events[0];
  const transport = shipment.transport_mode ? (c.transportLabels as Record<string, string>)[shipment.transport_mode] ?? '—' : '—';
  const place = (city: string | null, country: string | null) => [city, country].filter(Boolean).join(', ') || '—';
  const pet = shipment.pet_checks;

  const row = (label: string, value: string) => (
    <div className='flex justify-between gap-4 py-1.5 text-[13px]'>
      <span className='text-text-secondary'>{label}</span>
      <span className='text-right font-bold text-navy break-words max-w-[60%]'>{value}</span>
    </div>
  );

  return (
    <div className='bg-white border border-border rounded-xl overflow-hidden font-mono max-w-[420px] mx-auto'>
      <div className='bg-navy text-white text-center py-4'>
        <p className='text-[16px] font-extrabold tracking-widest text-white'>OPS LOGISTICS</p>
        <p className='text-[11px] tracking-wider text-white opacity-80'>SHIPMENT RECEIPT</p>
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        {row(c.reference, reference)}
        {row('Issued', new Date().toLocaleString(locale))}
        {row(c.status, (c.statuses as Record<string, string>)[status] ?? statusLabel(status))}
        {row(c.lastUpdated, fmt(latest?.timestamp ?? null))}
        {row(c.courier, shipment.carrier || 'OPS Logistics')}
        {row(c.transport, transport)}
        {row(c.flight, or(shipment.flight_number))}
        {row(c.service, or(shipment.service_type).toUpperCase())}
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>{c.from.toUpperCase()}</p>
        {row(c.origin, place(shipment.sender_city, shipment.sender_country))}
        {row(c.pickedUp, fmt(shipment.pickup_at))}
        {row(c.departs, fmt(shipment.departure_at))}
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>{c.to.toUpperCase()}</p>
        {row(c.destination, place(shipment.receiver_city, shipment.receiver_country))}
        {row(c.arrives, fmt(shipment.arrival_at))}
        {shipment.delivered_to && row(c.receivedBy, or(shipment.delivered_to))}
      </div>

      {latest && (
        <div className='px-5 py-4 border-b border-dashed border-border'>
          <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>LATEST UPDATE</p>
          {row(c.status, (c.statuses as Record<string, string>)[normalizeStatus(latest.status)] ?? statusLabel(latest.status))}
          {row(c.lastUpdated, fmt(latest.timestamp))}
          {row(lang === 'fr' ? 'Lieu' : 'Location', or(latest.location))}
          {latest.next_step && row(c.nextStep, latest.next_step)}
        </div>
      )}

      {pet && (
        <div className='px-5 py-4 border-b border-dashed border-border'>
          <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>{c.petWelfare.toUpperCase()}</p>
          {row(c.crateInspected, pet.crate_inspected ? 'Yes' : 'No')}
          {row(c.documentsVerified, pet.documents_verified ? 'Yes' : 'No')}
          {row(c.airlineAccepted, pet.airline_accepted ? 'Yes' : 'No')}
          {row(c.handoverConfirmed, pet.handover_confirmed ? 'Yes' : 'No')}
        </div>
      )}

      <div className='px-5 py-5 text-center'>
        <p className='text-[10px] text-text-secondary leading-snug'>
          Keep this receipt. Track your shipment with the reference above.
        </p>
      </div>
    </div>
  );
}
