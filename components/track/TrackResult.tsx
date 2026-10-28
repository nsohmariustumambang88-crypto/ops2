'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/lib/i18n';
import { copyFor } from '@/components/track/copy';

export type TrackEvent = { status: string; location: string | null; timestamp: string; notes: string | null; next_step: string | null; latitude: number | null; longitude: number | null };
export type PetChecks = { crate_inspected: boolean; documents_verified: boolean; airline_accepted: boolean; handover_confirmed: boolean };
export type Place = { lat: number; lng: number; label: string };
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

type Copy = ReturnType<typeof copyFor>;

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

// The delivery stages shown on the roadmap, in order.
const stageKeys = ['registered', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

const card = 'bg-white rounded-2xl border border-border shadow-deep p-6 md:p-8';

function dateLabel(v: string | null, lang: string) {
  return v ? new Date(v).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined) : '—';
}

// Where the shipment sits on the roadmap. Customs and delays happen while in transit.
function currentStage(status: string) {
  if (['held_at_customs', 'cleared_for_customs', 'delayed'].includes(status)) return stageKeys.indexOf('in_transit');
  return stageKeys.indexOf(status);
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wider ${statusStyle[status] ?? 'bg-light-gray text-navy'}`}>
      {label}
    </span>
  );
}

function ProgressBar({ status, stageNames }: { status: string; stageNames: readonly string[] }) {
  const current = currentStage(status);
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

// The roadmap: each stage with the time it was reached, the current stage highlighted, and the
// stages still to come shown in grey.
function Roadmap({ status, events, c, lang }: { status: string; events: TrackEvent[]; c: Copy; lang: string }) {
  const current = currentStage(status);
  const reached = (key: string) => events.find((e) => e.status === key);
  return (
    <ol className='relative space-y-6 pl-10'>
      <span className='absolute left-[15px] top-2 bottom-2 w-0.5 bg-border' aria-hidden='true' />
      {stageKeys.map((key, i) => {
        const done = current >= 0 && i < current;
        const now = current >= 0 && i === current;
        const event = reached(key);
        return (
          <li key={key} className='relative'>
            <span
              className={`absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-bold ${
                done || (now && status === 'delivered') ? 'bg-primary border-primary text-white'
                  : now ? 'bg-white border-primary text-primary ring-4 ring-primary/20'
                  : 'bg-white border-border text-text-secondary'
              }`}
              aria-hidden='true'
            >
              {done || (now && status === 'delivered') ? '✓' : i + 1}
            </span>
            <p className={`text-[17px] font-bold ${now || done ? 'text-navy' : 'text-text-secondary'}`}>{c.stageNames[i]}</p>
            <p className='text-[14px] text-text-secondary'>
              {event ? [event.location, dateLabel(event.timestamp, lang)].filter(Boolean).join(' · ') : now ? c.statusNow : c.upcoming}
            </p>
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
          .addTo(m).bindTooltip(`Origin · ${origin.label}`);
      }
      if (destination) {
        L.circleMarker([destination.lat, destination.lng], { radius: 9, color: '#FFFFFF', weight: 2, fillColor: '#0B2C5F', fillOpacity: 1 })
          .addTo(m).bindTooltip(`Destination · ${destination.label}`);
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

function Eta({ arrival, status, c, lang }: { arrival: string | null; status: string; c: Copy; lang: string }) {
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

export default function TrackResult({ shipment, events, lastFetched }: { shipment: TrackShipment; events: TrackEvent[]; lastFetched: Date | null }) {
  const { lang } = useLanguage();
  const c = copyFor(lang);
  const [copied, setCopied] = useState(false);
  const lastUpdate = events[0]?.timestamp ?? null;
  const reference = shipment.reference_number || shipment.tracking_number;
  const label = (s: string) => (c.statuses as Record<string, string>)[s] ?? s.replace(/_/g, ' ');
  const transportLabel = (m: string | null) => (m && (c.transportLabels as Record<string, string>)[m]) || '—';

  const customs = shipment.status === 'held_at_customs' || shipment.status === 'cleared_for_customs';
  const delayed = shipment.status === 'delayed';
  const latest = events[0];
  const nextStep = latest?.next_step ?? null;
  const pet = shipment.pet_checks;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Printed receipts show every section, so the page is not cut down for paper. */}
      <style>{'@media print { header, footer, nav { display: none !important; } .print-card { box-shadow: none !important; break-inside: avoid; } }'}</style>

      {/* Header card: reference, status and actions */}
      <div className='print-card bg-navy text-white rounded-2xl shadow-deep p-6 md:p-8'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
          <div>
            <p className='text-[12px] font-bold uppercase tracking-widest text-white/70'>{c.reference}</p>
            <p className='text-[28px] md:text-[32px] font-extrabold break-all'>{reference}</p>
            <p className='mt-1 text-[14px] text-white/80'>
              {lastUpdate ? `${c.lastUpdated} ${new Date(lastUpdate).toLocaleString(lang === 'fr' ? 'fr-FR' : undefined)}` : c.noUpdates}
              {lastFetched && <span className='block text-[12px] text-white/60'>{lastFetched.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : undefined)}</span>}
            </p>
          </div>
          <div className='flex flex-col items-start md:items-end gap-3 print:hidden'>
            <StatusBadge status={shipment.status} label={label(shipment.status)} />
            <div className='flex gap-3'>
              <button type='button' onClick={copyLink} className='h-[40px] px-5 rounded border border-white/60 text-white font-bold text-[14px] hover:bg-white/10'>
                {copied ? c.copied : c.copyLink}
              </button>
              <button type='button' onClick={() => window.print()} className='h-[40px] px-5 rounded bg-white text-navy font-bold text-[14px] hover:bg-light-blue'>
                {c.printReceipt}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress card */}
      <div className='print-card bg-white rounded-2xl border border-border shadow-deep p-6 md:p-8'>
        <p className='text-[12px] font-bold uppercase tracking-wider text-primary mb-4'>{c.progress}</p>
        <ProgressBar status={shipment.status} stageNames={c.stageNames} />
        <div className='mt-6'><Eta arrival={shipment.arrival_at} status={shipment.status} c={c} lang={lang} /></div>
      </div>

      {customs && (
        <div role='status' className='print-card flex flex-col md:flex-row gap-5 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 p-4 md:p-5 shadow-deep'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/images/customs/What%20clearance%20actually%20involves.webp' alt='' loading='lazy' className='w-full md:w-[200px] h-[140px] object-cover rounded-lg print:hidden' />
          <div className='flex-1 py-1'>
            <p className='font-bold text-[17px]'>{shipment.status === 'held_at_customs' ? c.customsHeld : c.customsCleared}</p>
            <p className='text-[15px]'>{shipment.status === 'held_at_customs' ? c.customsHeldText : c.customsClearedText}</p>
          </div>
        </div>
      )}

      {delayed && (
        <div role='status' className='print-card rounded-2xl border border-red-300 bg-red-50 text-red-900 px-5 py-4 shadow-deep'>
          <p className='font-bold'>{c.delayed}</p>
          <p className='text-[15px]'>{c.delayedText}</p>
          {latest?.notes && <p className='text-[15px] mt-2'>{latest.notes}</p>}
        </div>
      )}

      {nextStep && shipment.status !== 'delivered' && (
        <div className='print-card rounded-2xl border border-primary/30 bg-light-blue px-5 py-4 shadow-deep'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>{c.nextStep}</p>
          <p className='text-[16px] text-navy mt-1'>{nextStep}</p>
        </div>
      )}

      {/* From and To cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='print-card bg-white rounded-2xl border border-border shadow-deep p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>{c.from}</p>
          <p className='text-[20px] font-extrabold text-navy'>{[shipment.sender_city, shipment.sender_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>{c.origin}: {shipment.route_origin || '—'}</p>
          <p className='text-[14px] mt-1'>{c.pickedUp}: {dateLabel(shipment.pickup_at, lang)}</p>
        </div>
        <div className='print-card bg-white rounded-2xl border border-border shadow-deep p-6'>
          <p className='text-[12px] font-bold uppercase tracking-wider text-primary'>{c.to}</p>
          <p className='text-[20px] font-extrabold text-navy'>{[shipment.receiver_city, shipment.receiver_country].filter(Boolean).join(', ') || '—'}</p>
          <p className='text-[14px] mt-1'>{c.destination}: {shipment.route_destination || '—'}</p>
          {shipment.delivered_to && <p className='text-[14px] mt-1'>{c.receivedBy}: {shipment.delivered_to}</p>}
          <div className='mt-3'><Eta arrival={shipment.arrival_at} status={shipment.status} c={c} lang={lang} /></div>
        </div>
      </div>

      {/* Delivery roadmap card */}
      <div className={card + ' print-card'}>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-6'>{c.roadmap}</h2>
        <Roadmap status={shipment.status} events={events} c={c} lang={lang} />
      </div>

      {/* Map card */}
      <div className={card + ' print-card'}>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-4'>{c.liveMap}</h2>
        <LiveMap events={events} origin={shipment.origin_place} destination={shipment.destination_place} emptyText={c.mapEmpty} title={c.liveMap} />
      </div>

      {/* Details card */}
      <div className={card + ' print-card'}>
        <h2 className='text-[22px] font-extrabold text-navy mb-4'>{c.details}</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[15px]'>
          <p><span className='text-text-secondary'>{c.reference}: </span><span className='font-bold'>{reference}</span></p>
          <p><span className='text-text-secondary'>{c.status}: </span><span className='font-bold'>{label(shipment.status)}</span></p>
          <p><span className='text-text-secondary'>{c.courier}: </span><span className='font-bold'>{shipment.carrier || 'OPS Logistics'}</span></p>
          <p><span className='text-text-secondary'>{c.transport}: </span><span className='font-bold'>{transportLabel(shipment.transport_mode)}</span></p>
          <p><span className='text-text-secondary'>{c.flight}: </span><span className='font-bold'>{shipment.flight_number || '—'}</span></p>
          <p><span className='text-text-secondary'>{c.service}: </span><span className='font-bold capitalize'>{shipment.service_type || '—'}</span></p>
          <p><span className='text-text-secondary'>{c.type}: </span><span className='font-bold capitalize'>{shipment.shipment_type ? shipment.shipment_type.replace(/_/g, ' ') : '—'}</span></p>
          <p><span className='text-text-secondary'>{c.weight}: </span><span className='font-bold'>{shipment.weight ? `${shipment.weight} kg` : '—'}</span></p>
          <p><span className='text-text-secondary'>{c.pickedUp}: </span><span className='font-bold'>{dateLabel(shipment.pickup_at, lang)}</span></p>
          <p><span className='text-text-secondary'>{c.departs}: </span><span className='font-bold'>{dateLabel(shipment.departure_at, lang)}</span></p>
          <p><span className='text-text-secondary'>{c.arrives}: </span><span className='font-bold'>{dateLabel(shipment.arrival_at, lang)}</span></p>
          <p><span className='text-text-secondary'>{c.origin}: </span><span className='font-bold'>{shipment.route_origin || '—'}</span></p>
          <p><span className='text-text-secondary'>{c.destination}: </span><span className='font-bold'>{shipment.route_destination || '—'}</span></p>
        </div>
      </div>

      {pet && (
        <div className={card + ' print-card'}>
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

      {/* History card: every update, newest first */}
      <div className={card + ' print-card'}>
        <h2 className='text-[26px] md:text-[28px] font-extrabold text-navy mb-6'>{c.history}</h2>
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

      {/* Support card */}
      <div className='print-card bg-light-blue border border-border rounded-2xl shadow-deep p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/images/home/3d63aa55-573e-4d41-b574-81235d3ca999.webp' alt='' loading='lazy' className='w-full md:w-[180px] h-[120px] object-cover rounded-lg' />
        <div className='flex-1'>
          <p className='text-[18px] font-extrabold text-navy'>{c.needHelp}</p>
          <p className='text-[15px]'>{c.needHelpText}</p>
        </div>
        <Link href='/contact' className='h-[42px] px-6 inline-flex items-center rounded bg-primary text-white font-bold whitespace-nowrap'>{c.contactUs}</Link>
      </div>
    </div>
  );
}
