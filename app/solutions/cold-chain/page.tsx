'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Cold Chain Logistics - OPS Logistics',
  description: 'Temperature-controlled shipping solutions for pharmaceuticals, healthcare, and perishables.',
};

export default function ColdChainPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Cold Chain Logistics</h1>
          <p className='text-lg text-white/90'>Precision temperature control for every shipment, every destination.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-bold mb-6 text-text-primary'>Precision Control</h2>
              <div className='space-y-4'>
                {['2-8°C Pharmaceutical Grade', 'Real-time Temperature Monitoring', 'Backup Systems & Contingencies', 'FDA & Health Authority Compliant', 'Chain of Custody Documentation', 'Global Temperature-Controlled Network'].map((item, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-card overflow-hidden flex items-center justify-center'>
              <img
                src='/images/cold-chain/The chain breaks at the joins.webp'
                alt='Cold chain logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>

          <Button href='/' className='bg-primary text-white hover:bg-primary/90 w-full md:w-auto'>Start Cold Chain Shipment</Button>
        </Container>
      </section>

      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center'>
            <h2 className='text-h2 font-bold mb-6'>Ready to trust us with your shipment?</h2>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>Get Quote</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
