'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function AutomotivePage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Automotive Logistics</h1>
          <p className='text-lg text-white/90'>Specialized logistics for vehicle components and finished automobiles worldwide.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-bold mb-6 text-text-primary'>Global Automotive Expertise</h2>
              <p className='text-text-secondary mb-4'>We understand the complex requirements of automotive supply chains, from component delivery to finished vehicle distribution.</p>
              <div className='space-y-4'>
                {['JIT Delivery', 'Secure Transport', 'Global Network', 'Compliance', 'Tracking', 'Consolidation'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-card overflow-hidden flex items-center justify-center'>
              <img
                src='/images/automotive/Batteries are the hardest thing in the vehicle to move.webp'
                alt='Automotive logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/solutions/contract-logistics' className='bg-primary text-white hover:bg-primary/90'>Learn More</Button>
        </Container>
      </section>

      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center'>
            <h2 className='text-h2 font-bold mb-6'>Ready to optimize your automotive logistics?</h2>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>Get Started</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
