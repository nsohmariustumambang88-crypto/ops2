'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function WhyOPSSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('[data-feature-block]');
      animateStagger(Array.from(items) as HTMLElement[], 0.1);
    }
  }, []);

  const features: Feature[] = [
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
        </svg>
      ),
      title: 'An end-to-end network',
      description:
        'Air, ocean, road and rail under a single booking and a single point of contact, so that nothing is lost during delivery.',
    },
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
        </svg>
      ),
      title: 'Customs handled correctly',
      description:
        'Classification, documentation and customs clearance handled in-house – the main cause of delay, removed from your office.',
    },
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
        </svg>
      ),
      title: 'Monitoring allows you to take action',
      description:
        'Live milestones from collection to final delivery, with exceptions flagged early enough for you to still do something about them.',
    },
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
        </svg>
      ),
      title: 'An account team named',
      description:
        'Business accounts attract people who know your routes and your cargo, not a queue and a reference number.',
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div className='mb-16 text-center max-w-3xl mx-auto'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Why OPS Logistics</p>
          <h2 className='text-h2 font-bold mb-6 text-text-primary'>Designed for shippers who can't afford surprises</h2>
          <p className='text-body text-text-secondary'>
            Freight makes mistakes in the gaps—between carriers, between borders, between someone booking a shipment and someone who knows where it is. We built OPS to fill those gaps.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {features.map((feature, index) => (
            <div
              key={index}
              data-feature-block
              className='bg-light-gray rounded-xl p-5 border border-border hover:shadow-medium transition-all duration-300'
            >
              <div className='mb-4'>{feature.icon}</div>
              <h3 className='text-[15px] font-extrabold text-text-primary mb-4'>{feature.title}</h3>
              <p className='text-text-secondary text-sm leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
