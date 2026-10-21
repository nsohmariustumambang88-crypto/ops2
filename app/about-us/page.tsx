import InfoPage from '@/components/pages/InfoPage';

export default function AboutUsPage() {
  return (
    <InfoPage
      eyebrow="About OPS"
      title="Logistics built around the shipper"
      intro="OPS Logistics moves documents, parcels, containers and freight for individuals, online sellers and enterprises across more than 220 countries and territories."
      sections={[
        {
          title: 'What we do',
          body: [
            'We combine express delivery, global forwarding and contract logistics under one account. You book the way you need, whether that is a single parcel or a warehouse program.',
          ],
          bullets: [
            'Express documents and parcels, door to door',
            'Air, sea, road and rail freight',
            'Customs clearance and trade compliance',
            'Third-party logistics for enterprises',
          ],
        },
        {
          title: 'How we work',
          body: [
            'Every shipment has a named owner on our side. We publish clear rates, tell you about delays early, and keep one tracking record from pickup to signature.',
          ],
        },
      ]}
      cta={{ label: 'Talk to our team', href: '/quote' }}
    />
  );
}
