'use client';

import Container from '@/components/ui/Container';

export default function TariffUpdatesPage() {
  const updates = [
    {
      date: 'October 2025',
      title: 'New tariff rates on electronics',
      description: 'Updated HS codes and rates affecting computer equipment and components',
      region: 'Global',
    },
    {
      date: 'September 2025',
      title: 'Healthcare exemptions announced',
      description: 'Pharmaceutical and medical device tariff relief for 90 days',
      region: 'US/EU',
    },
    {
      date: 'August 2025',
      title: 'Trade agreement amendments',
      description: 'Bilateral trade deal updates affecting automotive and apparel',
      region: 'USMCA',
    },
    {
      date: 'July 2025',
      title: 'Sustainability tariff credits',
      description: 'New tariff reduction program for eco-friendly logistics',
      region: 'EU',
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Tariff Updates</h1>
          <p className='text-lg text-white/90'>Stay informed on the latest trade policy changes and tariff announcements affecting your shipments.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='max-w-3xl'>
            {updates.map((update, i) => (
              <div key={i} className='border-l-4 border-primary pl-6 pb-8 last:pb-0'>
                <div className='flex items-start justify-between mb-2'>
                  <h3 className='text-h4 font-bold text-text-primary'>{update.title}</h3>
                  <span className='px-3 py-1 bg-light-blue text-primary rounded-full text-xs font-bold'>{update.region}</span>
                </div>
                <p className='text-text-secondary mb-2'>{update.description}</p>
                <p className='text-sm text-text-secondary'>{update.date}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center'>
            <h2 className='text-h2 font-bold mb-4'>Subscribe to tariff alerts</h2>
            <p className='mb-6 text-white/90'>Get notified about trade policy changes affecting your shipments</p>
            <div className='flex gap-3 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-3 rounded-lg text-text-primary focus:outline-none'
              />
              <button className='bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors'>Subscribe</button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
