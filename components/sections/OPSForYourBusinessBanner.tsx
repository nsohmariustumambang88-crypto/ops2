'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';

export default function OPSForYourBusinessBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <section className='py-12 md:py-16 lg:py-20 bg-white' style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div
        ref={bannerRef}
        className='relative overflow-hidden shadow-lg w-full'
        style={{ backgroundColor: '#0B2C5F' }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-0 items-center'>
          {/* Left - Image */}
          <div className='h-64 md:h-80 rounded-l-2xl overflow-hidden'>
            <img
              src='/images/home/Bulk shipping or shipping by retailer.webp'
              alt='OPS for Your Business'
              className='w-full h-full object-cover'
            />
          </div>

          {/* Right - Content */}
          <div ref={contentRef} className='p-8 md:p-10 text-white flex flex-col justify-center'>
            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
              OPS for Your Business
            </h2>

            {/* Description */}
            <p className='text-sm md:text-base text-white/90 mb-8 leading-relaxed'>
              Power your small and medium-sized business success with world-class shipping and logistics. Our team of experts can help you address the ever changing need of your customers.
            </p>

            {/* Button */}
            <button
              className='px-8 py-3 md:py-4 font-bold text-white rounded-lg w-fit text-sm md:text-base transition-all hover:opacity-90'
              style={{ backgroundColor: '#1173D4' }}
            >
              Explore Our Business Solutions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
