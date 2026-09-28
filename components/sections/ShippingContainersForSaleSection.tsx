'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WavyBorderSVG = ({ color }: { color: string }) => (
  <svg
    className='absolute inset-0 w-full h-full'
    viewBox='0 0 400 600'
    preserveAspectRatio='none'
    style={{ pointerEvents: 'none' }}
  >
    <path
      d='M 10 30 Q 50 10, 100 20 T 200 15 T 300 25 T 390 20 L 390 590 Q 350 570, 300 580 T 200 585 T 100 580 T 10 590 Z'
      fill='none'
      stroke={color}
      strokeWidth='4'
    />
  </svg>
);

export default function ShippingContainersForSaleSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Left column scroll animation
    if (leftRef.current) {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: leftRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Right column scroll animation
    if (rightRef.current) {
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rightRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6'>
          {/* Left Column - Light Gray Background with Blue Wavy Border */}
          <div
            ref={leftRef}
            className='relative p-8 md:p-12 lg:p-16 flex flex-col justify-center rounded-3xl overflow-hidden'
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <WavyBorderSVG color='#3B82F6' />
            <div className='relative z-10'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 w-fit shadow-sm'>
                <span className='text-yellow-500 text-lg'>●</span>
                <span className='text-xs md:text-sm font-bold uppercase tracking-wider' style={{ color: '#0B2C5F', fontFamily: 'Barlow, sans-serif' }}>Quality Containers Available</span>
              </div>

              {/* Heading */}
              <h2 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
                Shipping Containers For Sale
              </h2>

              {/* Description 1 */}
              <p className='text-base md:text-lg mb-6 leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
                Shop reliable shipping containers for sale for storage, commercial use, transportation, construction projects, equipment storage, and container conversions.
              </p>

              {/* Description 2 */}
              <p className='text-sm md:text-base mb-8 leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
                Explore a selection of new and used shipping containers in popular sizes and configurations. Whether you need a container for secure storage, business operations, a building project, or a custom conversion, find practical options designed for a wide range of applications.
              </p>

              {/* Button */}
              <button
                className='inline-flex items-center gap-3 px-8 py-4 font-bold text-white rounded-lg w-fit text-sm md:text-base transition-all hover:opacity-90'
                style={{ backgroundColor: '#0B2C5F' }}
              >
                <span>Shop Shipping Containers</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column - Light Blue Background with Red Wavy Border */}
          <div
            ref={rightRef}
            className='relative p-8 md:p-12 lg:p-16 flex flex-col justify-center rounded-3xl overflow-hidden'
            style={{ backgroundColor: '#EDF2F7' }}
          >
            <WavyBorderSVG color='#EF4444' />
            <div className='relative z-10'>
              {/* Label */}
              <p className='text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6' style={{ color: '#1173D4' }}>
                CONTAINER SOLUTIONS
              </p>

              {/* Heading */}
              <h3 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-12 leading-tight' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
                Built Around Your Storage & Project Needs
              </h3>

              {/* Features Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8'>
                {features.map((feature) => (
                  <div key={feature.number} className='flex flex-col bg-white p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2'>
                    {/* Number Badge */}
                    <div
                      className='w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg mb-4'
                      style={{ backgroundColor: '#0B2C5F' }}
                    >
                      {feature.number}
                    </div>

                    {/* Title */}
                    <h4 className='text-lg md:text-xl font-bold mb-2' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
                      {feature.title}
                    </h4>

                    {/* Description */}
                    <p className='text-sm md:text-base leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
