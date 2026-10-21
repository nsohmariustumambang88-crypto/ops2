import InfoPage from '@/components/pages/InfoPage';

export default function BusinessOfferingsPage() {
  return (
    <InfoPage
      eyebrow="For your business"
      title="Shipping partners for growing businesses"
      intro="Whether you are a start-up sending your first export or a medium-sized company going international, we set up the shipping you need."
      sections={[
        {
          title: 'What is included',
          body: ['Business accounts give you one login, one invoice and a named account manager.'],
          bullets: ['Saved addresses and shipment history', 'Monthly invoicing', 'Discounted rates on regular volume', 'Dedicated support contact'],
        },
      ]}
      cta={{ label: 'Request a business account', href: '/request-business-account' }}
    />
  );
}
