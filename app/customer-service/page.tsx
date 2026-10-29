import InfoPage from '@/components/pages/InfoPage';

export default function CustomerServicePage() {
  return (
    <InfoPage
      eyebrow="Customer service"
      title="We are here when your shipment needs us"
      intro="Get help with a booking, a delivery, a claim or a billing question. Have your tracking number ready and we will take it from there."
      sections={[
        {
          title: 'How to reach us',
          body: ['Use the contact details below for the fastest answer. Messages sent outside support hours are answered the next business day.'],
          bullets: ['Email: support@opslogistice.com', 'Phone: listed in your booking confirmation', 'Track any shipment on our tracking page'],
        },
        {
          title: 'Common requests',
          body: ['Most questions are answered quickly with these steps:'],
          bullets: ['Change a delivery address before the parcel leaves the hub', 'Request a proof of delivery', 'Open a claim for loss or damage', 'Correct an invoice'],
        },
      ]}
      cta={{ label: 'Track a shipment', href: '/track' }}
    />
  );
}
