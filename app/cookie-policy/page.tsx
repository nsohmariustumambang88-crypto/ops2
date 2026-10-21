import InfoPage from '@/components/pages/InfoPage';

export default function CookiePolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Cookie policy"
      intro="DRAFT - to be reviewed by legal counsel before publication. Cookies help the site work and remember your preferences."
      sections={[
        { title: 'Essential cookies', body: ['Needed for the site to load, keep you signed in and protect forms from misuse. These cannot be switched off.'] },
        { title: 'Analytics cookies', body: ['Help us understand which pages are useful so we can improve them. You can decline these in your browser settings.'] },
      ]}
    />
  );
}
