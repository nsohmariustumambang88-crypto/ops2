'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function HealthcarePage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Healthcare & Pharma Logistics</h1>
          <p className='text-lg text-white/90'>FDA-compliant cold chain solutions with complete chain-of-custody documentation.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Pharma-Grade Standards</h2>
              <p className='text-text-secondary mb-4'>99.7% on-time delivery with temperature-controlled handling for critical pharmaceutical shipments.</p>
              <div className='space-y-4'>
                {['2-8°C Control', 'Real-time Monitoring', 'FDA Compliant', 'Chain of Custody', 'Emergency Response', 'Global Coverage'].map((item, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-xl overflow-hidden flex items-center justify-center'>
              <img
                src='/images/healthcare/The shipment is the evidence..webp'
                alt='Healthcare logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>

          <div className='bg-light-blue rounded-xl p-8 md:p-12'>
            <h3 className='text-h3 font-bold text-text-primary mb-4'>99.7% On-Time Delivery</h3>
            <p className='text-text-secondary mb-6'>European healthcare distributor achieved perfect compliance with specialized cold chain management and real-time tracking.</p>
            <Button href='/case-studies' className='bg-primary text-white hover:bg-primary/90'>See Case Study</Button>
          </div>
        </Container>
      </section>

      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center max-w-2xl mx-auto'>
            <h2 className='text-h2 font-extrabold mb-6'>Trust us with your pharmaceuticals</h2>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>Contact Sales</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
