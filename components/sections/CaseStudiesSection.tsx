'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface CaseStudy {
  title: string;
  company: string;
  result: string;
  description: string;
  image: string;
}

export default function CaseStudiesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-case-study]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.15);
    }
  }, []);

  const caseStudies: CaseStudy[] = [
    {
      title: '40% Reduction in Shipping Costs',
      company: 'Global E-Commerce Retailer',
      result: '$2.3M annual savings',
      description: 'By consolidating shipments and optimizing routes through our logistics platform, this major retailer reduced per-shipment costs while maintaining faster delivery times.',
      image: '/images/case-studies/54414110-760f-460c-8337-7ec8b07718cd 4th pic place holder.webp',
    },
    {
      title: '99.7% On-Time Delivery Rate',
      company: 'European Healthcare Distributor',
      result: 'Achieved compliance excellence',
      description: 'Through specialized cold chain management and real-time tracking, we ensured pharmaceutical shipments arrived exactly on schedule with complete chain-of-custody documentation.',
      image: '/images/case-studies/dbe36e5e-f829-411c-aaac-4ed575de54e7 2nd pic holder.webp',
    },
    {
      title: 'Scaled to 50+ Countries in 18 Months',
      company: 'Technology Hardware Manufacturer',
      result: 'Entered new markets rapidly',
      description: 'Our global forwarding network and customs expertise enabled rapid market expansion with zero customs delays or compliance issues across new territories.',
      image: '/images/case-studies/Three problems we were brought in on.webp',
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div className='mb-16 text-center max-w-3xl mx-auto'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Success Stories</p>
          <h2 className='text-h2 font-bold mb-6 text-text-primary'>Real results from real partners</h2>
          <p className='text-body text-text-secondary'>
            See how companies across industries have optimized their supply chains with our logistics solutions.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {caseStudies.map((study, index) => (
            <div key={index} data-case-study className='bg-light-gray rounded-card overflow-hidden hover:shadow-deep transition-all duration-300'>
              <div className='h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden'>
                <img
                  src={study.image}
                  alt={study.title}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className='p-8'>
                <div className='mb-4'>
                  <p className='text-primary font-bold text-sm uppercase tracking-wider'>{study.company}</p>
                  <h3 className='text-h4 font-bold text-text-primary mt-2'>{study.title}</h3>
                </div>
                <p className='text-lg font-bold text-primary mb-4'>{study.result}</p>
                <p className='text-text-secondary text-sm leading-relaxed'>{study.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
