'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { animateStagger } from '@/lib/animations';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

export default function ServiceGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-service]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.1);
    }
  }, []);
  const services: Service[] = [
    {
      icon: (
        <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
        </svg>
      ),
      title: 'Contract Logistics',
      description: 'Flexible 3PL services tailored to your business needs',
      link: '#',
    },
    {
      icon: (
        <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm0-4H4c-.55 0-1 .45-1 1v2h18V10c0-.55-.45-1-1-1zm0-4H4c-.55 0-1 .45-1 1v2h18V3c0-.55-.45-1-1-1z' />
        </svg>
      ),
      title: 'E-Commerce Fulfillment',
      description: 'Complete order fulfillment and warehouse management',
      link: '#',
    },
    {
      icon: (
        <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
        </svg>
      ),
      title: 'Customs & Compliance',
      description: 'Expert handling of international regulations',
      link: '#',
    },
    {
      icon: (
        <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
        </svg>
      ),
      title: 'Cold Chain Logistics',
      description: 'Temperature-controlled transportation solutions',
      link: '#',
    },
    {
      icon: (
        <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm0-4H4c-.55 0-1 .45-1 1v2h18V10c0-.55-.45-1-1-1zm0-4H4c-.55 0-1 .45-1 1v2h18V3c0-.55-.45-1-1-1z' />
        </svg>
      ),
      title: 'Last Mile Delivery',
      description: 'Efficient final-mile delivery solutions',
      link: '#',
    },
    {
      icon: (
        <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M18.36 6.64c-1.23-1.23-2.87-1.9-4.62-1.9-1.75 0-3.39.67-4.62 1.9l1.06 1.06c.98-.98 2.28-1.52 3.56-1.52s2.58.54 3.56 1.52c1.96 1.96 1.96 5.15 0 7.11L12 16.69l-7.78-7.78c-1.96-1.96-1.96-5.15 0-7.11 1.95-1.95 5.16-1.95 7.11 0l.78.78.78-.78c1.23-1.23 2.87-1.9 4.62-1.9s3.39.67 4.62 1.9c2.05 2.05 2.05 5.36 0 7.41l-8.78 8.78-1.06-1.06 8.78-8.78c1.49-1.49 2.31-3.47 2.31-5.58 0-2.1-.82-4.08-2.31-5.57z' />
        </svg>
      ),
      title: 'Supply Chain Solutions',
      description: 'Comprehensive supply chain optimization',
      link: '#',
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        {/* Section Title */}
        <div className='mb-16 text-center max-w-3xl mx-auto'>
          <h2 className='text-h2 font-extrabold mb-4 text-text-primary'>
            Our Services
          </h2>
          <p className='text-body text-text-secondary'>
            Comprehensive logistics solutions designed to meet your business needs
          </p>
        </div>

        {/* Service Grid */}
        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <Card key={index} variant='light' hover className='p-8' data-service>
              {/* Icon */}
              <div className='mb-6'>{service.icon}</div>

              {/* Title */}
              <h3 className='text-h4 font-bold mb-3 text-text-primary'>
                {service.title}
              </h3>

              {/* Description */}
              <p className='text-text-secondary mb-6'>{service.description}</p>

              {/* Arrow Link */}
              <Link
                href={service.link}
                className='text-primary font-semibold inline-flex items-center gap-2 group hover:gap-3 transition-all'
              >
                Explore
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
