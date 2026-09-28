'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateSlideInLeft, animateSlideInRight } from '@/lib/animations';

export default function ServiceUpdatesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) animateSlideInLeft(headerRef.current);
    if (cardsRef.current) animateSlideInRight(cardsRef.current);
  }, []);

  const updates = [
    {
      image: '/images/home/Bulk shipping or shipping by retailer.webp',
      title: 'Sustainability',
      description: 'Sustainable business begins with low carbon supply chains. Find out what we have to offer and how we integrate sustainability into our operations to reduce environmental impacts for your supply chain.',
    },
    {
      image: '/images/home/Navigate the latest pricing developments.webp',
      title: 'Innovation',
      description: 'Discover the future of logistics through customer-centric innovation. industry-leading trend research and next generation solutions.',
    },
    {
      image: '/images/home/Globalization is holding strong at a record level.webp',
      title: 'Globalization Holds Firm at a Record Level',
      description: 'The OPS Global Connectedness Report 2026 offers the most comprehensive view of globalization available.',
      isExternal: true,
    },
  ];

  return (
    <section className='py-16 md:py-24 lg:py-32 bg-white'>
      <Container>
        {/* Header Section */}
        <div ref={headerRef} className='mb-12 md:mb-16 pb-8 md:pb-12 border-b border-gray-200'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-3 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
            Important Service Updates
          </h2>
          <p className='text-sm md:text-base text-text-secondary mb-8'>
            Service bulletins keep you up to date with news and alerts
          </p>

          {/* Featured Update Link */}
          <a href='#' className='inline-flex items-center gap-2 font-bold text-sm md:text-base hover:underline transition-colors' style={{ color: '#1173D4' }}>
            <span className='w-2 h-2 rounded-full' style={{ backgroundColor: '#1173D4' }}></span>
            Operational Update Middle East
            <span>›</span>
          </a>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {updates.map((update, index) => (
            <div key={index} className='rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-2' style={{ borderColor: '#D5DFEC' }}>
              {/* Image */}
              <div className='h-48 md:h-56 overflow-hidden bg-gray-200'>
                <img
                  src={update.image}
                  alt={update.title}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                />
              </div>

              {/* Content */}
              <div className='p-6 md:p-8'>
                {/* Title */}
                <h3 className='text-lg md:text-xl font-bold mb-3 flex items-center gap-2' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
                  {update.title}
                  {update.isExternal && <span className='text-sm'>↗</span>}
                  {!update.isExternal && <span style={{ color: '#1173D4' }}>›</span>}
                </h3>

                {/* Description */}
                <p className='text-sm md:text-base leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
                  {update.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
