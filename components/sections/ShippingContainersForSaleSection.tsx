'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateSlideInLeft, animateSlideInRight } from '@/lib/animations';

export default function ShippingContainersForSaleSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leftRef.current) animateSlideInLeft(leftRef.current);
    if (rightRef.current) animateSlideInRight(rightRef.current);
  }, []);

  const features = [
    {
      number: '01',
      title: 'New & Used Containers',
      description: 'Explore multiple container conditions suitable for storage, commercial and project applications.',
    },
    {
      number: '02',
      title: 'Multiple Sizes',
      description: 'Choose from popular container sizes and configurations for different space requirements.',
    },
    {
      number: '03',
      title: 'Secure Storage',
      description: 'Practical container solutions for equipment, inventory, materials and general storage needs.',
    },
    {
      number: '04',
      title: 'Flexible Applications',
      description: 'Suitable for commercial use, personal storage, construction and container conversions.',
    },
  ];

  return (
    <section className='py-16 md:py-24 lg:py-32 bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
          {/* Left Column - Navy Background */}
          <div
            ref={leftRef}
            className='p-8 md:p-12 lg:p-16 text-white flex flex-col justify-center'
            style={{ backgroundColor: '#0B2C5F' }}
          >
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6 w-fit'>
              <span className='text-lg'>⭐</span>
              <span className='text-xs md:text-sm font-bold uppercase tracking-wider'>Quality Containers Available</span>
            </div>

            {/* Heading */}
            <h2 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
              Shipping Containers For Sale
            </h2>

            {/* Description 1 */}
            <p className='text-base md:text-lg text-white/90 mb-6 leading-relaxed'>
              Shop reliable shipping containers for sale for storage, commercial use, transportation, construction projects, equipment storage, and container conversions.
            </p>

            {/* Description 2 */}
            <p className='text-sm md:text-base text-white/80 mb-8 leading-relaxed'>
              Explore a selection of new and used shipping containers in popular sizes and configurations. Whether you need a container for secure storage, business operations, a building project, or a custom conversion, find practical options designed for a wide range of applications.
            </p>

            {/* Button */}
            <button
              className='inline-flex items-center gap-3 px-8 py-4 font-bold text-white rounded-lg w-fit text-sm md:text-base transition-all hover:opacity-90'
              style={{ backgroundColor: '#0B2C5F', border: '2px solid white' }}
            >
              <span>Shop Shipping Containers</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column - Beige/Cream Background */}
          <div
            ref={rightRef}
            className='p-8 md:p-12 lg:p-16 flex flex-col justify-center'
            style={{ backgroundColor: '#F5F7FA' }}
          >
            {/* Label */}
            <p className='text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-4 md:mb-6'>
              CONTAINER SOLUTIONS
            </p>

            {/* Heading */}
            <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-12 text-text-primary leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built Around Your Storage & Project Needs
            </h3>

            {/* Features Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8'>
              {features.map((feature) => (
                <div key={feature.number} className='flex flex-col'>
                  {/* Number Badge */}
                  <div
                    className='w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg mb-4'
                    style={{ backgroundColor: '#0B2C5F' }}
                  >
                    {feature.number}
                  </div>

                  {/* Title */}
                  <h4 className='text-lg md:text-xl font-bold text-text-primary mb-2'>
                    {feature.title}
                  </h4>

                  {/* Description */}
                  <p className='text-sm md:text-base text-text-secondary leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
