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
        className='relative overflow-hidden shadow-lg w-full flex items-center'
        style={{ backgroundColor: '#0B2C5F', minHeight: '280px' }}
      >
        {/* Left - Narrow Image Panel with Rounded Right Corners */}
        <div className='w-32 md:w-40 lg:w-48 h-full shrink-0 overflow-hidden rounded-r-3xl mr-6 md:mr-8 lg:mr-10'>
          <img
            src='/images/home/Shipping documents and parcels.webp'
            alt='OPS for Your Business'
            className='w-full h-full object-cover'
          />
        </div>

        {/* Right - Content Area */}
        <div ref={contentRef} className='flex-1 px-8 md:px-12 lg:px-16 py-10 md:py-12 text-white flex flex-col justify-center'>
          {/* Heading */}
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-6 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
            OPS for Your Business
          </h2>

          {/* Description */}
          <p className='text-xs md:text-sm lg:text-base text-white/90 mb-8 md:mb-10 leading-relaxed max-w-2xl'>
            Power your small and medium-sized business success with world-class shipping and logistics. Our team of experts can help you address the ever changing need of your customers.
          </p>

          {/* Button */}
          <button
            className='px-6 md:px-8 py-2 md:py-3 font-bold text-white rounded-lg w-fit text-xs md:text-sm lg:text-base transition-all hover:opacity-90'
            style={{ backgroundColor: '#1173D4' }}
          >
            Explore Our Business Solutions
          </button>
        </div>
      </div>
    </section>
  );
}
