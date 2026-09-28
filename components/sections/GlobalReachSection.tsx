'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateFadeInUp, animateStagger } from '@/lib/animations';

export default function GlobalReachSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateFadeInUp(sectionRef.current);
    }
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('[data-stat]');
      animateStagger(Array.from(stats) as HTMLElement[], 0.15);
    }
  }, []);

  const regions = [
    { name: 'Europe', coverage: '45+' },
    { name: 'Asia Pacific', coverage: '38+' },
    { name: 'Americas', coverage: '48+' },
    { name: 'Africa', coverage: '45+' },
    { name: 'Middle East', coverage: '22+' },
    { name: 'Oceania', coverage: '12+' },
  ];

  const stats = [
    {
      number: '220+',
      label: 'Countries Served',
      description: 'Global network spanning all continents with local expertise'
    },
    {
      number: '85',
      label: 'Distribution Centers',
      description: 'Strategic locations optimizing delivery times and efficiency'
    },
    {
      number: '1,200+',
      label: 'Logistics Partners',
      description: 'Trusted network of carriers and service providers worldwide'
    },
    {
      number: '15M+',
      label: 'Shipments Annually',
      description: 'Processing millions of packages across all global regions'
    },
  ];

  return (
    <section ref={sectionRef} className='py-section-lg bg-navy text-white'>
      <Container>
        <div className='text-center mb-20'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Global Reach</p>
          <h2 className='text-h2 font-bold mb-6'>220+ Countries, One Logistics Partner</h2>
          <p className='text-body text-white/80 max-w-3xl mx-auto'>
            OPS Logistics operates the most extensive global network in shipping and logistics. From the smallest package to the largest freight, we deliver with consistency and reliability wherever you need to ship.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          {regions.map((region, index) => (
            <div key={index} className='bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all text-center'>
              <p className='text-white/70 text-sm uppercase tracking-wider mb-2'>Coverage in</p>
              <h3 className='text-2xl font-bold text-white mb-2'>{region.name}</h3>
              <p className='text-3xl font-bold text-primary'>{region.coverage} countries</p>
            </div>
          ))}
        </div>

        <div>
          <div className='text-center mb-16'>
            <h3 className='text-h3 font-bold text-white mb-2'>By The Numbers</h3>
            <p className='text-white/70'>Our global infrastructure and operational excellence</p>
          </div>

          <div ref={statsRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                data-stat
                className='bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-8 border border-primary/30 text-center hover:border-primary/60 transition-colors'
              >
                <div className='text-4xl font-bold text-primary mb-3'>{stat.number}</div>
                <h4 className='text-white font-bold text-lg mb-2'>{stat.label}</h4>
                <p className='text-white/70 text-sm'>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-20 text-center'>
          <p className='text-white/80 mb-6 max-w-2xl mx-auto'>
            With our global presence and local expertise, we deliver the world's most complex shipments. Whether you're shipping across time zones or across the street, OPS Logistics is your trusted partner.
          </p>
          <button className='px-8 py-3 bg-primary text-white font-bold rounded-button hover:bg-primary/90 transition-colors'>
            Explore Our Global Network
          </button>
        </div>
      </Container>
    </section>
  );
}
