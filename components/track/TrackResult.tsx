'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/lib/i18n';
import { copyFor } from '@/components/track/copy';

export type TrackEvent = { status: string; location: string | null; timestamp: string; notes: string | null; next_step: string | null; latitude: number | null; longitude: number | null };
export type PetChecks = { crate_inspected: boolean; documents_verified: boolean; airline_accepted: boolean; handover_confirmed: boolean };
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
  delivered_to: string | null;
  sender_city: string | null;
  sender_country: string | null;
  receiver_city: string | null;
  receiver_country: string | null;
  pet_checks: PetChecks | null;
  origin_place: Place | null;
  destination_place: Place | null;
};

export type Place = { lat: number; lng: number; label: string };

// Map pin colour for each status, so the route reads at a glance.
const pinColor: Record<string, string> = {
  registered: '#64748B',
  picked_up: '#7C3AED',
  in_transit: '#1173D4',
  held_at_customs: '#D97706',
  cleared_for_customs: '#059669',
  out_for_delivery: '#1173D4',
  delivered: '#059669',
  delayed: '#DC2626',
  exception: '#DC2626',
};

const statusStyle: Record<string, string> = {
  registered: 'bg-light-blue text-navy',
  picked_up: 'bg-light-blue text-navy',
  in_transit: 'bg-primary text-white',
  held_at_customs: 'bg-amber-100 text-amber-900',
  cleared_for_customs: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-primary text-white',
  delivered: 'bg-green-600 text-white',
  delayed: 'bg-red-100 text-red-800',
  exception: 'bg-red-600 text-white',
};

const stageKeys = ['registered', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

function dateLabel(v: string | null, lang: string) {
  return v ? new Date(v).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined) : '—';
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider ${statusStyle[status] ?? 'bg-light-gray text-navy'}`}>
      {label}
    </span>
  );
}

// Customs happens while the shipment is in transit, and a delay sits on the in-transit step too.
function ProgressBar({ status, stageNames }: { status: string; stageNames: readonly string[] }) {
  const onTransit = ['held_at_customs', 'cleared_for_customs', 'delayed'].includes(status);
  const current = onTransit ? stageKeys.indexOf('in_transit') : stageKeys.indexOf(status);
  return (
    <ol className='grid grid-cols-5 gap-2'>
      {stageKeys.map((key, i) => {
        const done = current >= 0 && i <= current;
        return (
          <li key={key} className='flex flex-col items-center text-center'>
            <span className={`w-4 h-4 rounded-full border-2 ${done ? 'bg-primary border-primary' : 'bg-white border-border'}`} aria-hidden='true' />
            <span className={`mt-2 text-[12px] md:text-[13px] font-bold ${done ? 'text-navy' : 'text-text-secondary'}`}>{stageNames[i]}</span>
          </li>
        );
      })}
    </ol>
  );
}

function LiveMap({ events, origin, destination, emptyText, title }: {
  events: TrackEvent[];
  origin: Place | null;
  destination: Place | null;
  emptyText: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const eventPoints = events.filter((e) => e.latitude != null && e.longitude != null).reverse();
  const hasPoints = Boolean(origin || destination || eventPoints.length);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    if (!ref.current || !hasPoints) return;

    import('leaflet').then((L) => {
      if (!ref.current) return;
      // Route order: origin, then each tracking point in time order, then destination.
      const track = eventPoints.map((e) => [Number(e.latitude), Number(e.longitude)] as [number, number]);
      const route: [number, number][] = [
        ...(origin ? [[origin.lat, origin.lng] as [number, number]] : []),
        ...track,
        ...(destination ? [[destination.lat, destination.lng] as [number, number]] : []),
      ];
      const m = L.map(ref.current).setView(route[0], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(m);
      if (route.length > 1) {
        L.polyline(route, { color: '#1173D4', weight: 4, opacity: 0.6, dashArray: track.length ? undefined : '8 8' }).addTo(m);
      }
      if (origin) {
        L.circleMarker([origin.lat, origin.lng], { radius: 9, color: '#FFFFFF', weight: 2, fillColor: '#059669', fillOpacity: 1 })
          .addTo(m).bindTooltip(`Origin · ${origin.label}`, { permanent: false });
      }
      if (destination) {
        L.circleMarker([destination.lat, destination.lng], { radius: 9, color: '#FFFFFF', weight: 2, fillColor: '#0B2C5F', fillOpacity: 1 })
          .addTo(m).bindTooltip(`Destination · ${destination.label}`, { permanent: false });
      }
      eventPoints.forEach((e, i) => {
        const colour = pinColor[e.status] ?? '#1173D4';
        L.circleMarker(track[i], { radius: 6, color: '#FFFFFF', weight: 2, fillColor: colour, fillOpacity: 1 })
          .addTo(m)
          .bindTooltip(`${e.status.replace(/_/g, ' ')}${e.location ? ` · ${e.location}` : ''}`);
      });
      m.fitBounds(route, { padding: [30, 30] });
      map = m;
    });

    return () => {
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, origin, destination]);

  return (
    <div className='rounded-xl border border-border overflow-hidden print:hidden' aria-label={title}>
      {hasPoints ? (
        <div ref={ref} className='h-[360px] w-full' />
      ) : (
        <div className='h-[280px] flex items-center justify-center bg-light-blue text-navy text-[15px] px-6 text-center'>{emptyText}</div>
      )}
    </div>
  );
}

function Eta({ arrival, status, c, lang }: { arrival: string | null; status: string; c: ReturnType<typeof copyFor>; lang: string }) {
  if (status === 'delivered') return <p className='text-[15px] font-bold text-green-700'>{c.delivered}</p>;
  if (!arrival) return <p className='text-[15px] text-text-secondary'>{c.estimatePending}</p>;
  const days = Math.ceil((new Date(arrival).getTime() - Date.now()) / 86400000);
  const when = new Date(arrival).toLocaleDateString(lang === 'fr' ? 'fr-FR' : undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <p className='text-[15px]'>
      <span className='text-text-secondary'>{c.estimatedArrival} </span>
      <span className='font-extrabold text-navy'>{when}</span>
      {days > 0 && <span className='ml-2 text-primary font-bold'>({days} {c.daysToGo})</span>}
    </p>
  );
}

function ShareBar({ c, reference }: { c: ReturnType<typeof copyFor>; reference: string }) {
  const [url, setUrl] = useState('');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const link = window.location.href;
    setUrl(link);
    QRCode.toDataURL(link, { margin: 1, width: 140, color: { dark: '#0B2C5F', light: '#FFFFFF' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [reference]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className='flex items-center gap-4 print:hidden'>
      {qr && (
        <div className='text-center'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={c.qrLabel} width={96} height={96} className='rounded bg-white p-1' />
          <p className='text-[11px] text-white/80 mt-1'>{c.qrLabel}</p>
        </div>
      )}
      <button type='button' onClick={copy} className='h-[40px] px-5 rounded border border-white/60 text-white font-bold text-[14px] hover:bg-white/10'>
        {copied ? c.copied : c.copyLink}
      </button>
    </div>
  );
}

export default function TrackResult({ shipment, events, lastFetched }: { shipment: TrackShipment; events: TrackEvent[]; lastFetched: Date | null }) {
  const { lang } = useLanguage();
  const c = copyFor(lang);
  const lastUpdate = events[0]?.timestamp ?? null;
  const reference = shipment.reference_number || shipment.tracking_number;
  const label = (s: string) => (c.statuses as Record<string, string>)[s] ?? s.replace(/_/g, ' ');
  const transportLabel = (m: string | null) => (m && (c.transportLabels as Record<string, string>)[m]) || '—';

  const customs = shipment.status === 'held_at_customs' || shipment.status === 'cleared_for_customs';
  const delayed = shipment.status === 'delayed';
  const latest = events[0];
  const nextStep = latest?.next_step ?? null;
  const pet = shipment.pet_checks;

  return (
    <div className='space-y-8'>
      <style>{'@media print { header, footer, nav { display: none !important; } }'}</style>

      <div className='bg-navy text-white rounded-xl p-6 md:p-8'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
          <div>
            <p className='text-[12px] font-bold uppercase tracking-widest text-white/70'>{c.reference}</p>
            <p className='text-[28px] md:text-[32px] font-extrabold break-all'>{reference}</p>
            <p className='mt-1 text-[14px] text-white/80'>
              {lastUpdate ? `${c.lastUpdated} ${new Date(lastUpdate).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined)}` : c.noUpdates}
              {lastFetched && <span className='block text-[12px] text-white/60'>{lastFetched.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : undefined)}</span>}
            </p>
            <div className='mt-4'><ShareBar c={c} reference={reference} /></div>
          </div>
          <div className='flex flex-col items-start md:items-end gap-3 print:hidden'>
            <StatusBadge status={shipment.status} label={label(shipment.status)} />
            <button type='button' onClick={() => window.print()} className='h-[40px] px-5 rounded border border-white/60 text-white font-bold text-[14px] hover:bg-white/10'>
              {c.printReceipt}
            </button>
          </div>
        </div>
        <div className='mt-8 bg-white rounded-lg p-5 text-navy'>
          <ProgressBar status={shipment.status} stageNames={c.stageNames} />
        </div>
      </div>

      {customs && (
        <div role='status' className='rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-5 py-4'>
          <p className='font-bold'>{shipment.status === 'held_at_customs' ? c.customsHeld : c.customsCleared}</p>
          <p className='text-[15px]'>{shipment.status === 'held_at_customs' ? c.customsHeldText : c.customsClearedText}</p>
        </div>
      )}

      {delayed && (
        <div role='status' className='rounded-xl border border-red-300 bg-red-50 text-red-900 px-5 py-4'>
          <p className='font-bold'>{c.delayed}</p>
          <p className='text-[15px]'>{c.delayedText}</p>
          {latest?.notes && <p className='text-[15px] mt-2'>{latest.notes}</p>}
        </div>
      )}

      {nextStep && (shipment.status !== 'delivered') && (
        <div className='rounded-xl border border-primary/30 bg-light-blue px-5 py-4'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>{c.nextStep}</p>
          <p className='text-[16px] text-navy mt-1'>{nextStep}</p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>{c.from}</p>
          <p className='text-[20px] font-extrabold text-navy'>{[shipment.sender_city, shipment.sender_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>{c.origin}: {shipment.route_origin || '—'}</p>
          <p className='text-[14px] mt-1'>{c.pickedUp}: {dateLabel(shipment.pickup_at, lang)}</p>
        </div>
        <div className='bg-white border border-border rounded-xl p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>{c.to}</p>
          <p className='text-[20px] font-extrabold text-navy'>{[shipment.receiver_city, shipment.receiver_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>{c.destination}: {shipment.route_destination || '—'}</p>
          {shipment.delivered_to && <p className='text-[14px] mt-1'>{c.receivedBy}: {shipment.delivered_to}</p>}
          <div className='mt-3'><Eta arrival={shipment.arrival_at} status={shipment.status} c={c} lang={lang} /></div>
        </div>
      </div>

      <div>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-4'>{c.liveMap}</h2>
        <LiveMap events={events} origin={shipment.origin_place} destination={shipment.destination_place} emptyText={c.mapEmpty} title={c.liveMap} />
      </div>

      <div className='bg-white border border-border rounded-xl p-6'>
        <h2 className='text-[22px] font-extrabold text-navy mb-4'>{c.details}</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[15px]'>
          <p><span className='text-text-secondary'>{c.courier}: </span><span className='font-bold'>{shipment.carrier || 'OPS Logistics'}</span></p>
          <p><span className='text-text-secondary'>{c.transport}: </span><span className='font-bold'>{transportLabel(shipment.transport_mode)}</span></p>
          <p><span className='text-text-secondary'>{c.flight}: </span><span className='font-bold'>{shipment.flight_number || '—'}</span></p>
          <p><span className='text-text-secondary'>{c.service}: </span><span className='font-bold capitalize'>{shipment.service_type || '—'}</span></p>
          <p><span className='text-text-secondary'>{c.type}: </span><span className='font-bold capitalize'>{shipment.shipment_type ? shipment.shipment_type.replace(/_/g, ' ') : '—'}</span></p>
          <p><span className='text-text-secondary'>{c.weight}: </span><span className='font-bold'>{shipment.weight ? `${shipment.weight} kg` : '—'}</span></p>
          <p><span className='text-text-secondary'>{c.departs}: </span><span className='font-bold'>{dateLabel(shipment.departure_at, lang)}</span></p>
          <p><span className='text-text-secondary'>{c.arrives}: </span><span className='font-bold'>{dateLabel(shipment.arrival_at, lang)}</span></p>
        </div>
      </div>

      {pet && (
        <div className='bg-white border border-border rounded-xl p-6'>
          <h2 className='text-[22px] font-extrabold text-navy mb-4'>{c.petWelfare}</h2>
          <ul className='grid grid-cols-1 md:grid-cols-2 gap-3 text-[15px]'>
            {[
              [pet.crate_inspected, c.crateInspected],
              [pet.documents_verified, c.documentsVerified],
              [pet.airline_accepted, c.airlineAccepted],
              [pet.handover_confirmed, c.handoverConfirmed],
            ].map(([done, text]) => (
              <li key={String(text)} className='flex items-center gap-3'>
                <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-white text-[13px] font-bold ${done ? 'bg-green-600' : 'bg-border'}`} aria-hidden='true'>{done ? '✓' : ''}</span>
                <span className={done ? 'font-bold text-navy' : 'text-text-secondary'}>{String(text)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-4'>{c.history}</h2>
        {events.length === 0 && <p className='text-text-secondary'>{c.historyEmpty}</p>}
        <ol className='space-y-5 border-l-2 border-primary pl-6'>
          {events.map((e, i) => (
            <li key={i} className='relative'>
              <span className='absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white' style={{ backgroundColor: pinColor[e.status] ?? '#0B2C5F' }} aria-hidden='true' />
              <p className='text-[17px] font-bold text-navy'>{label(e.status)}</p>
              <p className='text-[14px] text-text-secondary'>{[e.location, dateLabel(e.timestamp, lang)].filter(Boolean).join(' · ')}</p>
              {e.notes && <p className='text-[14px] mt-1'>{e.notes}</p>}
              {e.next_step && <p className='text-[14px] mt-1 text-primary font-bold'>{c.nextStep}: {e.next_step}</p>}
            </li>
          ))}
        </ol>
      </div>

      <div className='bg-light-blue border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden'>
        <div>
          <p className='text-[18px] font-extrabold text-navy'>{c.needHelp}</p>
          <p className='text-[15px]'>{c.needHelpText}</p>
        </div>
        <Link href='/contact' className='h-[42px] px-6 inline-flex items-center rounded bg-primary text-white font-bold whitespace-nowrap'>{c.contactUs}</Link>
      </div>
    </div>
  );
}
