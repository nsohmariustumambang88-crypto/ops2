'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TradeAdvisorySection() {
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

  return (
    <section className='py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-12 lg:px-20' style={{ backgroundColor: '#0B2C5F' }}>
      <Container>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Left - Image */}
          <div ref={imageRef} className='order-2 md:order-1'>
            <div className='relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-deep'>
              <img
                src='/images/home/3d63aa55-573e-4d41-b574-81235d3ca999.webp'
                alt='Trade Advisory'
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Right - Content */}
          <div ref={contentRef} className='order-1 md:order-2 text-white'>
            {/* Label */}
            <p className='text-xs md:text-sm font-bold uppercase tracking-widest mb-3 md:mb-4' style={{ color: '#1173D4' }}>
              TRADE ADVISORY
            </p>

            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-5 md:mb-6 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
              Navigating Latest Tariff Developments
            </h2>

            {/* Description */}
            <p className='text-sm md:text-base text-white/90 mb-6 md:mb-8 leading-relaxed'>
              Global trade is becoming increasingly complex as new U.S. tariffs and varying reciprocal measures emerge across countries and industries. At OPS Logistics, we are committed to helping you navigate these changes.
            </p>

            {/* Button */}
            <button
              className='px-8 md:px-10 py-3 md:py-4 font-bold text-white rounded-lg text-sm md:text-base transition-all hover:opacity-90'
              style={{ backgroundColor: '#1173D4' }}
            >
              Explore Our Solutions
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
