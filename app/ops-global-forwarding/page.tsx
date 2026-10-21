import InfoPage from '@/components/pages/InfoPage';

export default function OpsGlobalForwardingPage() {
  return (
    <InfoPage
      eyebrow="Global forwarding"
      title="Air and sea freight, customs included"
      intro="Our forwarding division books air and ocean capacity, prepares customs paperwork and manages pallets, containers and project cargo."
      sections={[
        {
          title: 'Freight modes',
          body: ['Choose the mode that fits your deadline and budget. We advise on the trade-off for each shipment.'],
          bullets: ['Air freight for time-critical cargo', 'Ocean freight for full and part containers', 'Road and rail for regional lanes'],
        },
        { title: 'Customs and compliance', body: ['Classification, duties estimates and clearance are handled by our licensed brokers in origin and destination countries.'] },
      ]}
      cta={{ label: 'Get a freight quote', href: '/quote' }}
    />
  );
}
