import InfoPage from '@/components/pages/InfoPage';

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy policy"
      intro="DRAFT - to be reviewed by legal counsel before publication. This page explains what personal information we collect and how we use it."
      sections={[
        { title: 'What we collect', body: ['Names, addresses, contact details and payment information needed to deliver your shipment and manage your account.'] },
        { title: 'How we use it', body: ['To deliver shipments, provide tracking, meet customs requirements and send service updates you have agreed to receive.'] },
        { title: 'Your choices', body: ['You can ask us to access, correct or delete your personal information, subject to the record-keeping rules that apply to shipments.'] },
      ]}
    />
  );
}
