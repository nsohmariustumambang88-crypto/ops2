'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface Industry {
  name: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

export default function IndustrySolutionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-industry]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.1);
    }
  }, []);

  const industries: Industry[] = [
    {
      name: 'Automotive',
      description: 'Specialized logistics for vehicle components and finished automobiles with secure, temperature-monitored transport.',
      image: '/images/automotive/96080ec0-e549-496d-932b-3aa421fde99b.webp',
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z' />
        </svg>
      ),
    },
    {
      name: 'Healthcare',
      description: 'Pharma-grade cold chain logistics with compliance tracking and temperature-controlled handling for life sciences.',
      image: '/images/healthcare/Stock that circulates instead of selling.webp',
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z' />
        </svg>
      ),
    },
    {
      name: 'Retail',
      description: 'High-volume distribution and e-commerce fulfillment with rapid processing and flexible inventory management.',
      image: '/images/retail/96080ec0-e549-496d-932b-3aa421fde99b.webp',
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' />
        </svg>
      ),
    },
    {
      name: 'Energy & Utilities',
      description: 'Specialized handling for industrial equipment, oversized cargo, and hazmat materials with expert compliance.',
      image: '/images/energy/The last two kilometres.webp',
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 19.35c-3.13 0-5.68-2.55-5.68-5.7 0-1.42.56-2.78 1.57-3.76l.19 2.39C8.22 13.75 9.69 15 11.63 15c1.66 0 3.05-1.02 3.58-2.45h.01c.3.93.48 1.92.48 2.95 0 3.15-2.55 5.7-5.68 5.7z' />
        </svg>
      ),
    },
    {
      name: 'Technology',
      description: 'Secure logistics for electronics and sensitive components with anti-static handling and tracking capabilities.',
      image: '/images/technology/96080ec0-e549-496d-932b-3aa421fde99b.webp',
      icon: (
        <svg className='w-12 h-12 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
        </svg>
      ),
    },
  ];

  return (
    <section className='py-section-lg bg-light-blue'>
      <Container>
        <div className='mb-16'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Industry Solutions</p>
          <h2 className='text-h2 font-bold mb-6 text-text-primary'>Specialized logistics for every industry</h2>
          <p className='text-body text-text-secondary max-w-3xl'>
            From automotive to healthcare, energy to technology, we provide industry-specific solutions tailored to your unique operational requirements.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
          {industries.map((industry, index) => (
            <div
              key={index}
              data-industry
              className='bg-white rounded-card p-6 border border-border hover:shadow-medium transition-all duration-300'
            >
              <div className='mb-4'>{industry.icon}</div>
              <h3 className='text-h4 font-bold text-text-primary mb-3'>{industry.name}</h3>
              <p className='text-text-secondary text-sm leading-relaxed'>{industry.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
