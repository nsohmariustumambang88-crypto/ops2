'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function RetailPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Retail & Fashion Logistics</h1>
          <p className='text-lg text-white/90'>High-volume distribution and e-commerce fulfillment with rapid processing capabilities.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Fast-Fashion Expertise</h2>
              <p className='text-text-secondary mb-4'>Handle seasonal peaks, returns management, and rapid distribution with our proven retail solutions.</p>
              <div className='space-y-4'>
                {['24-48hr Delivery', 'Returns Management', 'Stock Optimization', 'Multi-Channel', 'Real-time Visibility', 'Cost Efficiency'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-xl overflow-hidden flex items-center justify-center'>
              <img
                src='/images/retail/Fashion returns are not an exception they are the model.webp'
                alt='Retail logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/solutions/ecommerce' className='bg-primary text-white hover:bg-primary/90'>E-Commerce Solutions</Button>
        </Container>
      </section>

      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center'>
            <h2 className='text-h2 font-extrabold mb-6'>Scale your retail operations globally</h2>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>Request Quote</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
