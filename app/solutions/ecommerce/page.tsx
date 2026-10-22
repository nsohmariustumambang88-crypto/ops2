'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function EcommercePage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>E-Commerce Fulfillment</h1>
          <p className='text-lg text-white/90'>Fast, reliable order fulfillment and last-mile delivery for online retailers worldwide.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Scale Your E-Commerce</h2>
              <p className='text-text-secondary mb-4'>From order placement to customer delivery, we handle every step with speed and precision.</p>
              <div className='space-y-4'>
                {['Same-Day Dispatch', 'Multi-Channel Integration', 'Returns Handling', 'Inventory Management', 'Real-time Tracking', 'Cost Optimization'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-xl overflow-hidden flex items-center justify-center'>
              <img
                src='/images/ecommerce/Where the margin quietly leaves.webp'
                alt='E-Commerce fulfillment'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/contact' className='bg-primary text-white hover:bg-primary/90'>Start Fulfilling</Button>
        </Container>
      </section>
    </div>
  );
}
