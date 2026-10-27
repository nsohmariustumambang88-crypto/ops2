'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

export type TrackEvent = { status: string; location: string | null; timestamp: string; notes: string | null; latitude: number | null; longitude: number | null };
export type TrackShipment = {
  reference_number?: string | null;
  tracking_number: string;
  status: string;
  transport_mode: string | null;
  carrier: string | null;
  flight_number: string | null;
  route_origin: string | null;
  route_destination: string | null;
  pickup_at: string | null;
  departure_at: string | null;
  arrival_at: string | null;
  service_type: string | null;
  shipment_type: string | null;
  weight: string | number | null;
  sender_city: string | null;
  sender_country: string | null;
  receiver_city: string | null;
  receiver_country: string | null;
};

const modeLabel: Record<string, string> = { land: 'Land', air: 'Air', sea: 'Sea' };
const label = (s: string) => s.replace(/_/g, ' ');
const dt = (v: string | null) => (v ? new Date(v).toLocaleString() : '—');

// Stages shown in the progress bar, in order. Customs and exceptions are shown as notices, not stages.
const stages = [
  { key: 'registered', text: 'Registered' },
  { key: 'picked_up', text: 'Picked up' },
  { key: 'in_transit', text: 'In transit' },
  { key: 'out_for_delivery', text: 'Out for delivery' },
  { key: 'delivered', text: 'Delivered' },
];

const statusStyle: Record<string, string> = {
  registered: 'bg-light-blue text-navy',
  picked_up: 'bg-light-blue text-navy',
  in_transit: 'bg-primary text-white',
  held_at_customs: 'bg-amber-100 text-amber-900',
  cleared_for_customs: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-primary text-white',
  delivered: 'bg-green-600 text-white',
  exception: 'bg-red-600 text-white',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider ${statusStyle[status] ?? 'bg-light-gray text-navy'}`}>
      {label(status)}
    </span>
  );
}

// Customs happens while the shipment is in transit, so both customs states sit on the in-transit step.
function ProgressBar({ status }: { status: string }) {
  const customsStep = status === 'held_at_customs' || status === 'cleared_for_customs';
  const current = customsStep ? stages.findIndex((s) => s.key === 'in_transit') : stages.findIndex((s) => s.key === status);
  const exception = status === 'exception';
  return (
    <ol className='grid grid-cols-5 gap-2' aria-label='Shipment progress'>
      {stages.map((s, i) => {
        const done = current >= 0 && i <= current;
        return (
          <li key={s.key} className='flex flex-col items-center text-center'>
            <span className={`w-4 h-4 rounded-full border-2 ${done ? 'bg-primary border-primary' : 'bg-white border-border'}`} aria-hidden='true' />
            <span className={`mt-2 text-[12px] md:text-[13px] font-bold ${done ? 'text-navy' : 'text-text-secondary'}`}>{s.text}</span>
          </li>
        );
      })}
      {exception && (
        <li className='col-span-5 text-[13px] text-text-secondary text-center mt-1'>
          Current step: {label(status)}. See the update below for details.
        </li>
      )}
    </ol>
  );
}

function LiveMap({ events }: { events: TrackEvent[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    const points = events
      .filter((e) => e.latitude != null && e.longitude != null)
      .map((e) => [Number(e.latitude), Number(e.longitude)] as [number, number])
      .reverse();
    if (!ref.current || points.length === 0) return;

    import('leaflet').then((L) => {
      if (!ref.current) return;
      const m = L.map(ref.current).setView(points[points.length - 1], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(m);
      L.polyline(points, { color: '#1173D4', weight: 4 }).addTo(m);
      points.forEach((p, i) => L.circleMarker(p, { radius: 6, color: '#0B2C5F', fillColor: '#1173D4', fillOpacity: 1 }).addTo(m).bindTooltip(i === points.length - 1 ? 'Latest' : `Point ${i + 1}`));
      m.fitBounds(points, { padding: [30, 30] });
      map = m;
    });

    return () => {
      map?.remove();
    };
  }, [events]);

  const hasPoints = events.some((e) => e.latitude != null && e.longitude != null);
  return (
    <div className='rounded-xl border border-border overflow-hidden print:hidden'>
      {hasPoints ? (
        <div ref={ref} className='h-[360px] w-full' />
      ) : (
        <div className='h-[280px] flex items-center justify-center bg-light-blue text-navy text-[15px] px-6 text-center'>
          The live map shows the shipment&apos;s position once a location is reported.
        </div>
      )}
    </div>
  );
}

function Eta({ arrival, status }: { arrival: string | null; status: string }) {
  if (status === 'delivered') return <p className='text-[15px] font-bold text-green-700'>Delivered</p>;
  if (!arrival) return <p className='text-[15px] text-text-secondary'>Estimated arrival will appear once the route is confirmed.</p>;
  const days = Math.ceil((new Date(arrival).getTime() - Date.now()) / 86400000);
  const when = new Date(arrival).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <p className='text-[15px]'>
      <span className='text-text-secondary'>Estimated arrival </span>
      <span className='font-extrabold text-navy'>{when}</span>
      {days > 0 && <span className='ml-2 text-primary font-bold'>({days} day{days === 1 ? '' : 's'} to go)</span>}
    </p>
  );
}

export default function TrackResult({ shipment, events }: { shipment: TrackShipment; events: TrackEvent[] }) {
  const lastUpdate = events[0]?.timestamp ?? null;
  const customs = shipment.status === 'held_at_customs' || shipment.status === 'cleared_for_customs';
  const reference = shipment.reference_number || shipment.tracking_number;

  return (
    <div className='space-y-8'>
      <style>{'@media print { header, footer, nav { display: none !important; } }'}</style>

      {/* Header: reference, status and actions */}
      <div className='bg-navy text-white rounded-xl p-6 md:p-8'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
          <div>
            <p className='text-[12px] font-bold uppercase tracking-widest text-white/70'>Reference</p>
            <p className='text-[28px] md:text-[32px] font-extrabold break-all'>{reference}</p>
            <p className='mt-1 text-[14px] text-white/80'>
              {lastUpdate ? `Last updated ${new Date(lastUpdate).toLocaleString()}` : 'No updates yet'}
            </p>
          </div>
          <div className='flex flex-col items-start md:items-end gap-3 print:hidden'>
            <StatusBadge status={shipment.status} />
            <button type='button' onClick={() => window.print()} className='h-[40px] px-5 rounded border border-white/60 text-white font-bold text-[14px] hover:bg-white/10'>
              Print receipt
            </button>
          </div>
        </div>
        <div className='mt-8 bg-white rounded-lg p-5 text-navy'>
          <ProgressBar status={shipment.status} />
        </div>
      </div>

      {customs && (
        <div role='status' className='rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-5 py-4'>
          <p className='font-bold'>{shipment.status === 'held_at_customs' ? 'Held at customs' : 'Cleared by customs'}</p>
          <p className='text-[15px]'>
            {shipment.status === 'held_at_customs'
              ? 'Your shipment is being checked by customs. We will update this page as soon as it moves again.'
              : 'Customs has released your shipment. It continues on its route.'}
          </p>
        </div>
      )}

      {/* Route cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>From</p>
          <p className='text-[20px] font-extrabold text-navy'>{[shipment.sender_city, shipment.sender_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>Origin: {shipment.route_origin || '—'}</p>
          <p className='text-[14px] mt-1'>Picked up: {dt(shipment.pickup_at)}</p>
        </div>
        <div className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>To</p>
          <p className='text-[20px] font-extrabold text-navy'>{[shipment.receiver_city, shipment.receiver_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>Destination: {shipment.route_destination || '—'}</p>
          <div className='mt-3'><Eta arrival={shipment.arrival_at} status={shipment.status} /></div>
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-4'>Live map</h2>
        <LiveMap events={events} />
      </div>

      {/* Shipment details */}
      <div className='bg-white border border-border rounded-xl p-6'>
        <h2 className='text-[22px] font-extrabold text-navy mb-4'>Shipment details</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[15px]'>
          <p><span className='text-text-secondary'>Courier: </span><span className='font-bold'>{shipment.carrier || 'OPS Logistics'}</span></p>
          <p><span className='text-text-secondary'>Transport: </span><span className='font-bold'>{modeLabel[shipment.transport_mode ?? ''] ?? '—'}</span></p>
          <p><span className='text-text-secondary'>Flight, vessel or truck: </span><span className='font-bold'>{shipment.flight_number || '—'}</span></p>
          <p><span className='text-text-secondary'>Service: </span><span className='font-bold capitalize'>{shipment.service_type || '—'}</span></p>
          <p><span className='text-text-secondary'>Type: </span><span className='font-bold capitalize'>{shipment.shipment_type ? label(shipment.shipment_type) : '—'}</span></p>
          <p><span className='text-text-secondary'>Weight: </span><span className='font-bold'>{shipment.weight ? `${shipment.weight} kg` : '—'}</span></p>
          <p><span className='text-text-secondary'>Departs: </span><span className='font-bold'>{dt(shipment.departure_at)}</span></p>
          <p><span className='text-text-secondary'>Arrives: </span><span className='font-bold'>{dt(shipment.arrival_at)}</span></p>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-4'>Shipment history</h2>
        {events.length === 0 && <p className='text-text-secondary'>No updates yet. Check back soon.</p>}
        <ol className='space-y-5 border-l-2 border-primary pl-6'>
          {events.map((e, i) => (
            <li key={i} className='relative'>
              <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${i === 0 ? 'bg-primary' : 'bg-navy/40'}`} aria-hidden='true' />
              <p className='text-[17px] font-bold capitalize text-navy'>{label(e.status)}</p>
              <p className='text-[14px] text-text-secondary'>{[e.location, dt(e.timestamp)].filter(Boolean).join(' · ')}</p>
              {e.notes && <p className='text-[14px] mt-1'>{e.notes}</p>}
            </li>
          ))}
        </ol>
      </div>

      {/* Support */}
      <div className='bg-light-blue border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden'>
        <div>
          <p className='text-[18px] font-extrabold text-navy'>Need help with this shipment?</p>
          <p className='text-[15px]'>Our team is available 24/7. Quote your reference when you contact us.</p>
        </div>
        <Link href='/contact' className='h-[42px] px-6 inline-flex items-center rounded bg-primary text-white font-bold whitespace-nowrap'>Contact us</Link>
      </div>
    </div>
  );
}
