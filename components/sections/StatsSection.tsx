'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface Stat {
  number: string;
  label: string;
}

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const statItems = containerRef.current.querySelectorAll('[data-stat]');
      animateStagger(Array.from(statItems) as HTMLElement[], 0.15);
    }
  }, []);
  const stats: Stat[] = [
    {
      number: '220+',
      label: 'Countries Served',
    },
    {
      number: '24/7',
      label: 'Customer Support',
    },
    {
      number: '4',
      label: 'Freight Modes',
    },
    {
      number: '15+',
      label: 'Years Experience',
    },
  ];

  return (
    <section className='py-section-lg bg-navy text-white'>
      <Container>
        <div ref={containerRef} className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center' data-stat>
              <div className='text-4xl md:text-5xl font-bold mb-2 text-accent-blue'>
                {stat.number}
              </div>
              <p className='text-white/80 text-sm md:text-base'>{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
