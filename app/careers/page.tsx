import InfoPage from '@/components/pages/InfoPage';

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="Careers"
      title="Work where shipments matter"
      intro="We hire operations, customer service, sales and technology people who want to keep global supply chains moving."
      sections={[
        {
          title: 'Why join us',
          body: ['Our teams work across time zones, on real problems, with clear ownership of results.'],
          bullets: ['Hands-on training for every role', 'Clear growth paths across operations and sales', 'Modern tools and a supportive team'],
        },
        {
          title: 'Open roles',
          body: ['We post current openings as they come up. If you do not see your role, send us your CV and tell us what you would like to work on.'],
        },
      ]}
      cta={{ label: 'Send your CV', href: '/customer-service' }}
    />
  );
}
