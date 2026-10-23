'use client';

import { useEffect, useRef } from 'react';
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
  departure_at: string | null;
  arrival_at: string | null;
  service_type: string | null;
  sender_city: string | null;
  sender_country: string | null;
  receiver_city: string | null;
  receiver_country: string | null;
};

const modeLabel: Record<string, string> = { land: 'Land', air: 'Air', sea: 'Sea' };
const label = (s: string) => s.replace(/_/g, ' ');
const dt = (v: string | null) => (v ? new Date(v).toLocaleString() : '—');

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
    <div className='rounded-xl border border-border overflow-hidden'>
      {hasPoints ? (
        <div ref={ref} className='h-[360px] w-full' />
      ) : (
        <div className='h-[360px] flex items-center justify-center bg-light-blue text-text-secondary text-[15px] px-6 text-center'>
          The live map will show the shipment's position once the carrier reports a location.
        </div>
      )}
    </div>
  );
}

export default function TrackResult({ shipment, events }: { shipment: TrackShipment; events: TrackEvent[] }) {
  return (
    <div className='space-y-8'>
      <div className='bg-white border border-border rounded-xl p-6'>
        <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>Reference</p>
        <p className='text-[26px] font-extrabold text-navy break-all'>{shipment.reference_number || shipment.tracking_number}</p>
        <p className='mt-2 text-[15px]'>Status: <span className='font-bold capitalize'>{label(shipment.status)}</span></p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>From</p>
          <p className='text-[18px] font-bold text-navy'>{[shipment.sender_city, shipment.sender_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>Origin: {shipment.route_origin || '—'}</p>
        </div>
        <div className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>To</p>
          <p className='text-[18px] font-bold text-navy'>{[shipment.receiver_city, shipment.receiver_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>Destination: {shipment.route_destination || '—'}</p>
        </div>
      </div>

      <div>
        <h2 className='text-[28px] font-extrabold text-navy mb-4'>Live map</h2>
        <LiveMap events={events} />
      </div>

      <div className='bg-white border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[15px]'>
        <p><span className='text-text-secondary'>Transport: </span><span className='font-bold'>{modeLabel[shipment.transport_mode ?? ''] ?? '—'}</span></p>
        <p><span className='text-text-secondary'>Carrier: </span><span className='font-bold'>{shipment.carrier || '—'}</span></p>
        <p><span className='text-text-secondary'>Flight, vessel or truck: </span><span className='font-bold'>{shipment.flight_number || '—'}</span></p>
        <p><span className='text-text-secondary'>Service: </span><span className='font-bold capitalize'>{shipment.service_type || '—'}</span></p>
        <p><span className='text-text-secondary'>Departs: </span><span className='font-bold'>{dt(shipment.departure_at)}</span></p>
        <p><span className='text-text-secondary'>Arrives: </span><span className='font-bold'>{dt(shipment.arrival_at)}</span></p>
      </div>

      <div>
        <h2 className='text-[28px] font-extrabold text-navy mb-4'>Roadmap</h2>
        {events.length === 0 && <p>No updates yet.</p>}
        <ol className='space-y-5 border-l-2 border-primary pl-6'>
          {events.map((e, i) => (
            <li key={i}>
              <p className='text-[17px] font-bold capitalize text-navy'>{label(e.status)}</p>
              <p className='text-[14px]'>{[e.location, dt(e.timestamp)].filter(Boolean).join(' · ')}</p>
              {e.notes && <p className='text-[14px] mt-1'>{e.notes}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
