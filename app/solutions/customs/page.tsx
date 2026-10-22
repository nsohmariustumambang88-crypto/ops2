'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function CustomsPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Customs & Compliance</h1>
          <p className='text-lg text-white/90'>Expert customs clearance and regulatory compliance across 220+ countries and territories.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Expert Clearance Services</h2>
              <p className='text-text-secondary mb-4'>Navigate complex tariff codes, documentation requirements, and regulatory changes with our specialized team.</p>
              <div className='space-y-4'>
                {['HS Code Expertise', 'Documentation', 'Tariff Optimization', 'Compliance Audits', 'Broker Network', 'Trade Compliance'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-xl overflow-hidden flex items-center justify-center'>
              <img
                src='/images/customs/The part that saves money rather than time.webp'
                alt='Customs compliance'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/tariff-updates' className='bg-primary text-white hover:bg-primary/90'>View Tariff Updates</Button>
        </Container>
      </section>
    </div>
  );
}
