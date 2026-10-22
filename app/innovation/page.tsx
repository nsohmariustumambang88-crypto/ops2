import InfoPage from '@/components/pages/InfoPage';

export default function InnovationPage() {
  return (
    <InfoPage titleClass="text-[44px] md:text-[65px]"
      eyebrow="Innovation"
      title="Technology that makes logistics simpler"
      intro="We build the tools behind our services: live tracking, digital customs paperwork and faster quotes for every kind of shipment."
      sections={[
        {
          title: 'What we are building',
          body: ['Our platform connects booking, customs and delivery data so that customers and our teams see the same information at the same time.'],
          bullets: ['Live tracking with proof of delivery', 'Digital customs documents', 'Instant quotes for express and freight'],
        },
      ]}
      cta={{ label: 'Get a quote', href: '/quote' }}
    />
  );
}
