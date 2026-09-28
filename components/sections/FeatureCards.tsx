'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { animateStagger } from '@/lib/animations';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

export default function FeatureCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-card]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.15);
    }
  }, []);

  const features: Feature[] = [
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13 10V3L4 14h7v7l9-11h-7z' />
        </svg>
      ),
      title: 'Express Shipping',
      description: 'Fast and reliable document and parcel shipping to over 220 countries worldwide.',
      link: '#',
    },
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10l8-4V7m-8 4L4 11v10l8 4v-10' />
        </svg>
      ),
      title: 'Global Logistics',
      description: 'Comprehensive supply chain solutions with international reach and expertise.',
      link: '#',
    },
    {
      icon: (
        <svg className='w-12 h-12 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
        </svg>
      ),
      title: 'Analytics & Tracking',
      description: 'Real-time tracking and detailed analytics for complete supply chain visibility.',
      link: '#',
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <Card key={index} variant='default' hover className='p-8 flex flex-col' data-card>
              {/* Icon */}
              <div className='mb-6'>{feature.icon}</div>

              {/* Title */}
              <h3 className='text-h4 font-bold mb-4 text-text-primary'>{feature.title}</h3>

              {/* Description */}
              <p className='text-text-secondary mb-6 flex-grow'>{feature.description}</p>

              {/* Link */}
              <Link
                href={feature.link}
                className='text-primary font-semibold hover:underline inline-flex items-center gap-2 group'
              >
                Learn more
                <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
