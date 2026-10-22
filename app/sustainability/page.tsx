import InfoPage from '@/components/pages/InfoPage';

export default function SustainabilityPage() {
  return (
    <InfoPage titleClass="text-[44px] md:text-[61px]"
      eyebrow="Sustainability"
      title="Lower emissions, same reliable delivery"
      intro="We measure the emissions of every shipment and give customers the choice of lower-carbon routes where they are available."
      sections={[
        {
          title: 'Our approach',
          body: ['Consolidating shipments, choosing rail and sea where time allows, and planning routes to avoid empty miles all reduce emissions without slowing down priority freight.'],
          bullets: ['Emissions reporting per shipment', 'Consolidated pickups for business accounts', 'Route planning for last-mile fleets'],
        },
      ]}
      cta={{ label: 'Request a business account', href: '/request-business-account' }}
    />
  );
}
