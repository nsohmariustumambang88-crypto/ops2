'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function EnergyPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Energy & Utilities Logistics</h1>
          <p className='text-lg text-white/90'>Specialized handling for industrial equipment, oversized cargo, and hazmat materials.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-12 mb-16'>
            <div>
              <h2 className='text-h2 font-bold mb-6 text-text-primary'>Industrial Expertise</h2>
              <p className='text-text-secondary mb-4'>Navigate complex regulations, oversized shipments, and critical infrastructure requirements with confidence.</p>
              <div className='space-y-4'>
                {['Hazmat Certified', 'Oversized Cargo', 'Heavy Equipment', 'Project Logistics', 'Emergency Response', 'Compliance Focus'].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='text-primary font-bold'>✓</span>
                    <span className='text-text-secondary'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-96 bg-light-gray rounded-card overflow-hidden flex items-center justify-center'>
              <img
                src='/images/energy/The long tail nobody plans for.webp'
                alt='Energy logistics'
                className='w-full h-full object-cover'
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          </div>
          <Button href='/solutions/contract-logistics' className='bg-primary text-white hover:bg-primary/90'>Industrial Solutions</Button>
        </Container>
      </section>

      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center'>
            <h2 className='text-h2 font-bold mb-6'>Power your industrial logistics</h2>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>Contact Us</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
