'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function FreightPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Freight Services</h1>
          <p className='text-lg text-white/90'>Air, sea, road, and rail freight with global coverage and competitive rates.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-8 mb-12'>
            {[
              { title: 'Air Freight', desc: 'Fast international shipping', icon: '✈️' },
              { title: 'Ocean Freight', desc: 'Cost-effective sea transport', icon: '⛴️' },
              { title: 'Road Transport', desc: 'Reliable ground delivery', icon: '🚚' },
              { title: 'Rail Logistics', desc: 'Efficient bulk transport', icon: '🚂' },
            ].map((mode) => (
              <div key={mode.title} className='bg-light-gray rounded-xl p-8 text-center'>
                <div className='text-4xl mb-4'>{mode.icon}</div>
                <h3 className='text-h4 font-bold text-text-primary mb-2'>{mode.title}</h3>
                <p className='text-text-secondary'>{mode.desc}</p>
              </div>
            ))}
          </div>
          <Button href='/solutions/contract-logistics' className='bg-primary text-white hover:bg-primary/90'>Contract Logistics</Button>
        </Container>
      </section>
    </div>
  );
}
