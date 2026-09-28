'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { animateStagger } from '@/lib/animations';

interface Solution {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function SupplyChainSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-solution]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.1);
    }
  }, []);

  const solutions: Solution[] = [
    {
      icon: <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 24 24'><path d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' /></svg>,
      title: 'CONTRACT LOGISTICS',
      description: 'Warehousing, inventory management and value-added services are performed on your behalf.',
    },
    {
      icon: <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 24 24'><path d='M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z' /></svg>,
      title: 'E-commerce execution',
      description: 'Choose, pack, ship and return items for online merchants who sell across borders.',
    },
    {
      icon: <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 24 24'><path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' /></svg>,
      title: 'Customs and compliance',
      description: 'Classification, duties management and customs clearance are handled by our own brokers.',
    },
    {
      icon: <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 24 24'><path d='M5 13c0 1.65.67 3.14 1.76 4.24L2.5 20.5l3 3 4.24-4.24C11.86 20.33 13.35 21 15 21c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5zm8-6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8-2h-8v2h8V5zm0 4h-8v2h8V9z' /></svg>,
      title: 'Cold chain logistics',
      description: 'Temperature-controlled handling for pharmaceutical, food and life science cargo.',
    },
    {
      icon: <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 24 24'><path d='M18 13h-5v5h5v-5zm-2-6h-3V4h3v3zm6-3v6h3V4h-3zm-6 12h-3v3h3v-3zM9 4H6v3h3V4zm0 12H6v3h3v-3zm0-6H6v3h3v-3zm12 0h-3v3h3v-3zm-6 0h-3v3h3v-3z' /></svg>,
      title: 'Last mile delivery',
      description: 'Final residential and commercial delivery with scheduling and returns.',
    },
    {
      icon: <svg className='w-8 h-8 text-primary' fill='currentColor' viewBox='0 0 24 24'><path d='M18.85 8.75l-4.15-4.15c-.78-.78-2.05-.78-2.83 0l-9.86 9.86c-.78.78-.78 2.05 0 2.83l4.15 4.15c.78.78 2.05.78 2.83 0l9.86-9.86c.78-.78.78-2.05 0-2.83zM13.5 15.5L8.5 10.5l2.12-2.12 5 5-2.12 2.12z' /></svg>,
      title: 'Freight service management',
      description: 'Pallets, containers and project freight with OPS Global Forwarding.',
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div className='mb-16'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Supply Chain Solutions</p>
          <h2 className='text-h2 font-bold mb-6 text-text-primary'>Outsource the parts that are slowing you down</h2>
          <p className='text-body text-text-secondary max-w-3xl'>
            Our supply chain division functions as your third-party logistics provider – warehousing, fulfillment, customs clearance and delivery, built around how your business already operates.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {solutions.map((solution, index) => (
            <Card key={index} variant='light' hover className='p-8' data-solution>
              <div className='mb-6'>{solution.icon}</div>
              <h3 className='text-h4 font-bold text-text-primary mb-4 uppercase text-sm tracking-wider'>
                {solution.title}
              </h3>
              <p className='text-text-secondary text-sm leading-relaxed'>{solution.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
