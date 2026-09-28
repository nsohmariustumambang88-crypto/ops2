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
    <section className='py-8 md:py-12 lg:py-16 bg-white px-6 sm:px-8 md:px-10 lg:px-12'>
      <div
        ref={bannerRef}
        className='relative overflow-hidden shadow-lg w-full flex items-center gap-4 md:gap-6 lg:gap-8 rounded-2xl'
        style={{ backgroundColor: '#0B2C5F', minHeight: '240px', maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Left - Narrow Image Panel with Rounded Right Corners */}
        <div className='w-24 md:w-32 lg:w-40 h-full shrink-0 overflow-hidden rounded-l-2xl'>
          <img
            src='/images/home/Shipping documents and parcels.webp'
            alt='OPS for Your Business'
            className='w-full h-full object-cover'
          />
        </div>

        {/* Right - Content Area */}
        <div ref={contentRef} className='flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-10 text-white flex flex-col justify-center'>
          {/* Heading */}
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
            OPS for Your Business
          </h2>

          {/* Description */}
          <p className='text-xs md:text-sm text-white/90 mb-6 md:mb-8 leading-relaxed max-w-2xl'>
            Power your small and medium-sized business success with world-class shipping and logistics. Our team of experts can help you address the ever changing need of your customers.
          </p>

          {/* Button */}
          <button
            className='px-5 md:px-6 py-2 md:py-3 font-bold text-white rounded-lg w-fit text-xs md:text-sm transition-all hover:opacity-90'
            style={{ backgroundColor: '#1173D4' }}
          >
            Explore Our Business Solutions
          </button>
        </div>
      </div>
    </section>
  );
}
