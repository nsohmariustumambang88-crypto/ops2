'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { animateSlideInRight, animateSlideInLeft, animateStagger } from '@/lib/animations';

export default function LastMileSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) animateSlideInRight(imageRef.current);
    if (contentRef.current) animateSlideInLeft(contentRef.current);
    if (solutionsRef.current) {
      const solutions = solutionsRef.current.querySelectorAll('[data-solution]');
      animateStagger(Array.from(solutions) as HTMLElement[], 0.1);
    }
  }, []);

  const solutions = [
    {
      title: 'Residential Delivery',
      description: 'Doorstep delivery with time windows, signatures, and handling instructions for home recipients'
    },
    {
      title: 'Commercial Delivery',
      description: 'Business-to-business delivery with dock scheduling, freight handling, and documentation'
    },
    {
      title: 'Returns Management',
      description: 'Seamless reverse logistics for product returns, exchanges, and refunds'
    },
    {
      title: 'Proof of Delivery',
      description: 'Digital confirmation with photos, signatures, and real-time customer notifications'
    },
    {
      title: 'White Glove Service',
      description: 'Premium delivery with unpacking, setup, and installation services available'
    },
    {
      title: 'Same-Day Delivery',
      description: 'Express last-mile options for urgent shipments in major metropolitan areas'
    },
  ];

  return (
    <section className='py-section-lg bg-light-blue'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20'>
          <div ref={contentRef} className='order-1'>
            <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Last Mile Delivery</p>
            <h2 className='text-h2 font-bold mb-6 text-text-primary'>Get It There, Perfect and On Time</h2>
            <p className='text-body text-text-secondary mb-8'>
              The final mile of delivery is where customer satisfaction is made or broken. OPS Logistics provides comprehensive last-mile solutions that combine reliability, flexibility, and real-time visibility to ensure your packages arrive in perfect condition.
            </p>

            <div className='space-y-4 mb-8'>
              {[
                'Real-time tracking and customer notifications',
                'Flexible delivery windows (2-hour, 4-hour, or all-day)',
                'Professional, trained delivery personnel',
                'Damage-free delivery guarantee',
                'Seamless integration with your systems'
              ].map((item, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-primary flex-shrink-0 mt-1' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                  <span className='text-text-secondary'>{item}</span>
                </div>
              ))}
            </div>

            <button className='px-8 py-3 bg-primary text-white font-bold rounded-button hover:bg-primary/90 transition-colors'>
              Explore Last Mile Solutions
            </button>
          </div>

          <div ref={imageRef} className='order-2'>
            <div className='relative h-80 md:h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden'>
              <img
                src='/images/lastmile/placeholder-lastmile.webp'
                alt='Last Mile Delivery'
                className='w-full h-full object-cover'
                onError={(e) => {
                  (e.target as HTMLImageElement).innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">Last Mile Delivery</div>';
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className='text-center mb-12'>
            <h3 className='text-h3 font-bold text-text-primary mb-2'>Delivery Solutions</h3>
            <p className='text-text-secondary'>Comprehensive options for every delivery need</p>
          </div>

          <div ref={solutionsRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {solutions.map((solution, index) => (
              <Card key={index} variant='light' hover className='p-8' data-solution>
                <div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4'>
                  <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <h4 className='text-lg font-bold text-text-primary mb-3'>{solution.title}</h4>
                <p className='text-text-secondary text-sm'>{solution.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
