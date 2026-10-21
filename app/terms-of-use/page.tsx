import InfoPage from '@/components/pages/InfoPage';

export default function TermsOfUsePage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of use"
      intro="DRAFT - to be reviewed by legal counsel before publication. These terms govern your use of the OPS Logistics website and services."
      sections={[
        { title: 'Using the website', body: ['You agree to use the site for lawful purposes and to provide accurate information when you book, track or contact us.'] },
        { title: 'Bookings and liability', body: ['Liability for loss or damage depends on the service you choose and the declared value of the shipment. Declare the true value and contents when you book.'] },
        { title: 'Changes to these terms', body: ['We may update these terms. The date of the latest version is shown on this page.'] },
      ]}
    />
  );
}
