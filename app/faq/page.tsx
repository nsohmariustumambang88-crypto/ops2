import InfoPage from '@/components/pages/InfoPage';

export default function FaqPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Frequently asked questions"
      intro="Answers to the questions we hear most often about booking, tracking, pricing and delivery."
      sections={[
        {
          title: 'Booking and pricing',
          body: [
            'Prices depend on weight, size, destination and service speed. Use the quote tool for an estimate before you book.',
            'Business accounts receive negotiated rates and monthly invoicing. Individuals pay at booking.',
          ],
        },
        {
          title: 'Tracking and delivery',
          body: [
            'Each shipment has a tracking number that shows every scan from pickup to delivery.',
            'If nobody is available at delivery, we leave a notice and attempt redelivery on the next working day.',
          ],
        },
        {
          title: 'International shipments',
          body: [
            'For cross-border shipments we prepare customs documents. Duties and taxes are paid by the recipient or sender as set by the destination country.',
          ],
        },
      ]}
      cta={{ label: 'Ask customer service', href: '/customer-service' }}
    />
  );
}
