import Link from 'next/link';
import InfoPage from '@/components/pages/InfoPage';

export default function ServiceUpdatesPage() {
  const updates = [
    { date: 'October 2026', title: 'Operational update: Middle East routes', summary: 'Some routes have longer transit times while carriers adjust schedules. Tracking stays live throughout.' },
    { date: 'September 2026', title: 'Holiday schedule for express services', summary: 'Pickups and deliveries follow the published holiday calendar for each country.' },
  ];

  return (
    <div>
      <InfoPage titleClass="text-[40px] md:text-[56px]"
        eyebrow="Service updates"
        title="Important updates for your shipments"
        intro="Delays, schedule changes and new services are posted here as they happen."
        sections={updates.map((u) => ({ title: u.title, body: [`${u.date}. ${u.summary}`] }))}
      />
      <div className="container mx-auto px-6 pb-16">
        <Link href="/tariff-updates" className="text-primary font-bold hover:underline">See tariff updates →</Link>
      </div>
    </div>
  );
}
