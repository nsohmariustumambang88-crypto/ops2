'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function ContractLogisticsPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Contract Logistics</h1>
          <p className='text-lg text-white/90'>3PL supply chain management solutions customized to your business requirements.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-bold mb-6 text-text-primary'>Custom Solutions</h2>
              <p className='text-text-secondary mb-4'>Scale your operations without the overhead. Our 3PL services handle warehousing, distribution, and supply chain optimization.</p>
              <div className='space-y-4'>
                {['Warehousing', 'Inventory Management', 'Distribution', 'Packaging', 'Returns Processing', 'Analytics'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-card overflow-hidden flex items-center justify-center'>
              <img
                src='/images/contract-logistics/Send us twelve months of order data..webp'
                alt='Contract logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/contact' className='bg-primary text-white hover:bg-primary/90'>Schedule Consultation</Button>
        </Container>
      </section>
    </div>
  );
}
