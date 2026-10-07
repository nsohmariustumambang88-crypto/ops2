'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function TechnologyPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <div className='max-w-3xl'>
            <h1 className='text-h1 font-bold mb-6'>Technology Logistics Solutions</h1>
            <p className='text-lg text-white/90'>Secure, reliable shipping for electronics and sensitive components worldwide.</p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-bold mb-6 text-text-primary'>Expert Technology Logistics</h2>
              <p className='text-text-secondary mb-4'>We specialize in the complex requirements of technology shipments, from semiconductors to consumer electronics.</p>
              <div className='space-y-4'>
                {['Anti-static handling', 'Temperature control', 'Real-time tracking', 'Insurance coverage', 'Customs expertise', 'Last-mile delivery'].map((item, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <span className='text-primary font-bold mt-1'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-card overflow-hidden flex items-center justify-center'>
              <img
                src='/images/technology/Most tech ships more than once.webp'
                alt='Technology logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>

          {/* Case Study */}
          <div className='bg-light-blue rounded-card p-8 md:p-12'>
            <h3 className='text-h3 font-bold text-text-primary mb-4'>Scaling Global Tech Distribution</h3>
            <p className='text-text-secondary mb-6'>A technology manufacturer scaled to 50+ countries in 18 months using our global forwarding network and customs expertise.</p>
            <Button href='/case-studies' className='bg-primary text-white hover:bg-primary/90'>Read Full Case Study</Button>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center max-w-2xl mx-auto'>
            <h2 className='text-h2 font-bold mb-6'>Ready to streamline your tech logistics?</h2>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>Get Started</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
