import InfoPage from '@/components/pages/InfoPage';

export default function RetailerVolumeShipperPage() {
  return (
    <InfoPage
      eyebrow="Retailers and volume shippers"
      title="Shipping options for high-volume senders"
      intro="For online retailers and businesses shipping in bulk, we offer negotiated rates, batch uploads and dedicated pickups."
      sections={[
        {
          title: 'Options',
          body: ['Pick the option that matches your volume and delivery promise.'],
          bullets: ['Negotiated rates by volume tier', 'Batch shipment upload from your store or spreadsheet', 'Scheduled pickups from your warehouse', 'Returns handling for fashion and retail'],
        },
      ]}
      cta={{ label: 'Open a business account', href: '/request-business-account' }}
    />
  );
}
