'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateSlideInLeft, animateSlideInRight } from '@/lib/animations';

export default function DocumentAndParcelSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) animateSlideInLeft(contentRef.current);
    if (imageRef.current) animateSlideInRight(imageRef.current);
  }, []);

  const services = [
    {
      icon: '🕐',
      title: 'Next Possible Business Day',
    },
    {
      icon: '🔒',
      title: 'Tailored Business Solutions',
    },
    {
      icon: '🌍',
      title: 'Flexible Import/Export Options',
    },
    {
      icon: '✓',
      title: 'Wide Variety of Optional Services',
    },
  ];

  return (
    <section className='py-16 md:py-24 lg:py-32 bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Left - Content Card */}
          <div ref={contentRef} className='bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-sm'>
            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-3 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
              Document and Parcel Shipping
            </h2>

            {/* Subheading */}
            <p className='text-base md:text-lg font-bold text-primary mb-4'>
              For All Shippers
            </p>

            {/* Description */}
            <p className='text-sm md:text-base text-text-secondary mb-8 leading-relaxed'>
              Learn about OPS Express - the undisputed global leader in international express shipping.
            </p>

            {/* Services Section */}
            <div className='bg-light-blue rounded-xl p-6 md:p-8 mb-8'>
              {/* Services Label */}
              <p className='text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-6'>
                SERVICES AVAILABLE
              </p>

              {/* Services Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {services.map((service, index) => (
                  <div key={index} className='flex items-start gap-4'>
                    {/* Icon */}
                    <div className='w-12 h-12 rounded-lg bg-text-primary flex items-center justify-center text-white text-xl flex-shrink-0'>
                      {service.icon}
                    </div>

                    {/* Title */}
                    <h4 className='text-sm md:text-base font-bold text-text-primary leading-snug'>
                      {service.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Button */}
            <button
              className='w-full px-8 py-4 font-bold text-white rounded-lg text-sm md:text-base transition-all hover:opacity-90'
              style={{ backgroundColor: '#1173D4' }}
            >
              Explore OPS Express
            </button>
          </div>

          {/* Right - Image */}
          <div ref={imageRef} className='h-80 sm:h-96 md:h-full md:min-h-96 rounded-lg overflow-hidden shadow-md'>
            <img
              src='/images/home/Shipping documents and parcels.webp'
              alt='Document and Parcel Shipping'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
