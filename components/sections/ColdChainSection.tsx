'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { animateSlideInLeft, animateSlideInRight, animateStagger } from '@/lib/animations';

export default function ColdChainSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) animateSlideInLeft(imageRef.current);
    if (contentRef.current) animateSlideInRight(contentRef.current);
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('[data-feature]');
      animateStagger(Array.from(features) as HTMLElement[], 0.1);
    }
  }, []);

  const features = [
    {
      icon: '❄️',
      title: 'Precise Temperature Control',
      description: 'Maintain exact climate requirements with real-time monitoring and automated alerts'
    },
    {
      icon: '📦',
      title: 'Specialized Packaging',
      description: 'Industry-compliant insulated containers and protective materials for sensitive cargo'
    },
    {
      icon: '✓',
      title: 'Chain of Custody',
      description: 'Complete documentation and traceability from origin to final destination'
    },
    {
      icon: '🔬',
      title: 'Certified Facilities',
      description: 'FDA, GxP, and ISTA certified warehouses and transportation vehicles'
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20'>
          <div ref={imageRef} className='order-2 lg:order-1'>
            <div className='relative h-80 md:h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden'>
              <img
                src='/images/cold-chain/The chain breaks at the joins.webp'
                alt='Cold Chain Logistics'
                className='w-full h-full object-cover'
                onError={(e) => {
                  (e.target as HTMLImageElement).innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">Cold Chain Facility</div>';
                }}
              />
            </div>
          </div>

          <div ref={contentRef} className='order-1 lg:order-2'>
            <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Cold Chain Logistics</p>
            <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Temperature-Controlled Shipping Excellence</h2>
            <p className='text-body text-text-secondary mb-8'>
              OPS Logistics specializes in cold chain management for pharmaceutical, food, and life science cargo. Our temperature-controlled network ensures product integrity across every mile of your shipment journey.
            </p>

            <div className='space-y-4 mb-8'>
              {[
                'Real-time temperature and humidity monitoring',
                'Automated alert systems for any deviation',
                'Climate-controlled storage facilities worldwide',
                'Validated packaging and handling procedures'
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
              Learn About Cold Chain Solutions
            </button>
          </div>
        </div>

        <div>
          <div className='text-center mb-12'>
            <h3 className='text-h3 font-bold text-text-primary mb-2'>Core Capabilities</h3>
            <p className='text-text-secondary'>Everything needed for reliable temperature-controlled logistics</p>
          </div>

          <div ref={featuresRef} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {features.map((feature, index) => (
              <Card key={index} variant='light' hover className='p-8' data-feature>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h4 className='text-lg font-bold text-text-primary mb-3'>{feature.title}</h4>
                <p className='text-text-secondary text-sm'>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
