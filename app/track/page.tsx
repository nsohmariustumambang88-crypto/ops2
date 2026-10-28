'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/Container';
import TrackResult, { type TrackEvent, type TrackShipment } from '@/components/track/TrackResult';
import { useLanguage } from '@/lib/i18n';

type Result = { shipment: TrackShipment; tracking_history: TrackEvent[] };

const pageCopy = {
  en: {
    kicker: 'Track a shipment',
    title: 'Where is my parcel?',
    intro: 'Enter the reference number from your receipt, for example OPS75983-895.',
    label: 'Reference number',
    track: 'Track',
    tracking: 'Tracking...',
    notFound: 'No shipment found with that reference. Check the number and try again.',
    unavailable: 'We could not load this shipment right now. Please try again in a few minutes.',
    network: 'Network error. Check your connection and try again.',
    refresh: 'Refresh',
    refreshNote: 'Press Refresh to see the latest update.',
  },
  fr: {
    kicker: 'Suivre un envoi',
    title: 'Où est mon colis ?',
    intro: 'Saisissez le numéro de référence de votre reçu, par exemple OPS75983-895.',
    label: 'Numéro de référence',
    track: 'Suivre',
    tracking: 'Recherche...',
    notFound: 'Aucun envoi trouvé avec cette référence. Vérifiez le numéro et réessayez.',
    unavailable: 'Nous ne pouvons pas afficher cet envoi pour le moment. Réessayez dans quelques minutes.',
    network: 'Erreur réseau. Vérifiez votre connexion et réessayez.',
    refresh: 'Actualiser',
    refreshNote: 'Appuyez sur Actualiser pour voir la dernière mise à jour.',
  },
} as const;

export default function TrackPage() {
  const { lang } = useLanguage();
  const t = pageCopy[lang] ?? pageCopy.en;
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const currentRef = useRef('');

  // Looks up a reference. A silent refresh keeps the current result on screen while it loads.
  const lookup = useCallback(async (raw: string, silent = false) => {
    const number = raw.trim();
    if (!number) return;
    currentRef.current = number;

    if (!silent) {
      setLoading(true);
      setError('');
      setResult(null);
    }
    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(number)}`);
      if (currentRef.current !== number) return;
      if (res.status === 404) {
        setError(t.notFound);
        setResult(null);
      } else if (!res.ok) {
        if (!silent) setError(t.unavailable);
      } else {
        setResult(await res.json());
        setError('');
        setLastFetched(new Date());
      }
    } catch {
      if (!silent) setError(t.network);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [t]);

  // The home page sends the reference as ?ref=... so the result shows straight away.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref') ?? '';
    if (ref) {
      setTrackingNumber(ref);
      lookup(ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No background timer: the page only asks the server when someone looks up a reference or presses Refresh.
  const refresh = () => lookup(currentRef.current);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    lookup(trackingNumber);
  }

  return (
    <div className='bg-white text-black'>
      <section
        className='py-16 md:py-24 text-white bg-navy'
        style={{
          backgroundImage: "linear-gradient(rgba(11,44,95,0.88), rgba(11,44,95,0.94)), url('/images/home/bulk%20maritime%20transport.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container>
          <div className='mx-auto max-w-[720px] text-center'>
            <p className='text-xs font-bold uppercase tracking-widest text-white/80 mb-3'>{t.kicker}</p>
            <h1 className='text-[40px] md:text-[50px] font-extrabold mb-4'>{t.title}</h1>
            <p className='text-white/90 mb-8'>{t.intro}</p>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-3 bg-white rounded-2xl shadow-deep p-3 md:p-4 text-left'>
              <label htmlFor='tracking' className='sr-only'>{t.label}</label>
              <input
                id='tracking'
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder='OPS75983-895'
                autoComplete='off'
                className='flex-1 h-[42px] px-4 text-[17px] rounded-lg !text-black !bg-white border border-border focus:outline-none focus:border-primary'
              />
              <button
                type='submit'
                disabled={loading}
                className='h-[42px] px-8 text-[18px] font-bold rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-60'
              >
                {loading ? t.tracking : t.track}
              </button>
            </form>
          </div>
        </Container>
      </section>

      <section className='py-12 md:py-16'>
        <Container>
          <div className='mx-auto max-w-[1107px]'>
            {error && (
              <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>
                {error}
              </div>
            )}
            {result && (
              <>
                <TrackResult shipment={result.shipment} events={result.tracking_history} lastFetched={lastFetched} />
                <div className='mt-6 flex items-center gap-4 print:hidden'>
                  <button type='button' onClick={refresh} disabled={loading} className='h-[40px] px-5 rounded border border-primary text-primary font-bold disabled:opacity-60'>
                    {loading ? t.tracking : t.refresh}
                  </button>
                  <p className='text-[13px] text-text-secondary'>{t.refreshNote}</p>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
