import InfoPage from '@/components/pages/InfoPage';

export default function RefundEscrowPage() {
  return (
    <InfoPage
      eyebrow="Payments"
      title="Refunds and escrow"
      intro="DRAFT - confirm these terms with your finance team before publication. This page explains how refunds work and how escrow protects both sides of a shipment."
      sections={[
        { title: 'Refunds', body: ['Cancellations made before pickup are refunded in full. After pickup, refunds depend on the service and how far the shipment has travelled.'] },
        { title: 'Escrow', body: ['For high-value freight, payment can be held in escrow and released when delivery is confirmed by the recipient.'] },
      ]}
    />
  );
}
