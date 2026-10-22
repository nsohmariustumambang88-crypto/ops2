'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function LastMilePage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Last Mile Delivery</h1>
          <p className='text-lg text-white/90'>Final-mile solutions designed to exceed customer expectations and drive satisfaction.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-bold mb-6 text-text-primary'>Delivery Excellence</h2>
              <p className='text-text-secondary mb-4'>From urban centers to remote locations, we deliver with speed, reliability, and customer care.</p>
              <div className='space-y-4'>
                {['Same-Day Delivery', 'Proof of Delivery', 'Customer Communication', 'Flexible Options', 'Eco-Friendly Fleet', 'Real-Time Tracking'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-xl overflow-hidden flex items-center justify-center'>
              <img
                src='/images/lastmile/The van is already there.webp'
                alt='Last mile delivery'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/contact' className='bg-primary text-white hover:bg-primary/90'>Start Delivering</Button>
        </Container>
      </section>
    </div>
  );
}
