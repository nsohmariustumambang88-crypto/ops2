'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function EnterpriseLogisticsSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const solutions = [
    {
      icon: '💼',
      title: 'Warehousing',
    },
    {
      icon: '📦',
      title: 'Packaging',
    },
    {
      icon: '🏢',
      title: 'Real Estate',
    },
    {
      icon: '🚚',
      title: 'Transport',
    },
    {
      icon: '👥',
      title: 'Service Logistics',
    },
    {
      icon: '➕',
      title: 'And more!',
    },
  ];

  return (
    <section className='py-12 md:py-16 lg:py-20 bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Left - Image */}
          <div ref={imageRef} className='h-64 sm:h-80 md:h-80 rounded-2xl overflow-hidden shadow-md'>
            <img
              src='/images/home/bulk maritime transport.webp'
              alt='Enterprise Logistics Services'
              className='w-full h-full object-cover'
            />
          </div>

          {/* Right - Content Card */}
          <div ref={contentRef} className='bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-sm'>
            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
              Enterprise Logistics Services
            </h2>

            {/* Subheading */}
            <p className='text-base md:text-lg font-bold mb-4' style={{ color: '#1173D4' }}>
              BUSINESS ONLY
            </p>

            {/* Description */}
            <p className='text-sm md:text-base mb-8 leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
              Find out how OPS Supply Chain can revolutionize your business as a 3PL provider.
            </p>

            {/* Solutions Section */}
            <div className='bg-light-blue rounded-xl p-6 md:p-8 mb-8'>
              {/* Solutions Label */}
              <p className='text-xs md:text-sm font-bold uppercase tracking-widest mb-6' style={{ color: '#1173D4' }}>
                SOLUTIONS AVAILABLE
              </p>

              {/* Solutions Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {solutions.map((solution, index) => (
                  <div key={index} className='flex flex-col items-center text-center gap-3'>
                    {/* Icon */}
                    <div className='w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl' style={{ backgroundColor: '#0B2C5F' }}>
                      {solution.icon}
                    </div>

                    {/* Title */}
                    <h4 className='text-sm md:text-base font-bold' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
                      {solution.title}
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
              Explore OPS Supply Chain
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
