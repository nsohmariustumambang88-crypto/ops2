'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function RetailerVolumeShippingSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: imageRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    if (contentRef.current) gsap.fromTo(contentRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: contentRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
  }, []);

  const divisions = [
    {
      icon: '📦',
      title: 'OPS eCommerce',
      description: 'Connecting businesses to consumers with standard domestic and international residential delivery and returns solutions',
    },
    {
      icon: '✈️',
      title: 'OPS Express',
      description: 'Fast, door-to-door, courier delivered. Time definite delivery to 220+ countries',
    },
  ];

  return (
    <section className='py-16 md:py-24 lg:py-32 bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Left - Image */}
          <div ref={imageRef} className='h-80 sm:h-96 md:h-full md:min-h-96 rounded-3xl overflow-hidden shadow-md'>
            <img
              src='/images/home/Bulk shipping or shipping by retailer.webp'
              alt='Retailer or Volume Shipping'
              className='w-full h-full object-cover'
            />
          </div>

          {/* Right - Content */}
          <div ref={contentRef}>
            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-3 leading-tight' style={{ fontFamily: 'Poppins, sans-serif' }}>
              Retailer or Volume Shipping
            </h2>

            {/* Subheading */}
            <p className='text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-6'>
              BUSINESS ONLY
            </p>

            {/* Description */}
            <p className='text-sm md:text-base text-text-secondary mb-8 leading-relaxed'>
              We have two divisions that offer reliable business shipping for e-commerce, supplier or manufacturing companies.
            </p>

            {/* Divisions Cards */}
            <div className='space-y-4'>
              {divisions.map((division, index) => (
                <div key={index} className='bg-white border border-gray-200 rounded-lg p-6 md:p-7 hover:shadow-md transition-all cursor-pointer group'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-start gap-4 flex-1'>
                      {/* Icon */}
                      <div className='text-3xl flex-shrink-0'>
                        {division.icon}
                      </div>

                      {/* Content */}
                      <div className='flex-1'>
                        <h3 className='text-lg md:text-xl font-bold text-text-primary mb-2'>
                          {division.title}
                        </h3>
                        <p className='text-sm md:text-base text-text-secondary leading-relaxed'>
                          {division.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className='text-primary text-xl flex-shrink-0 group-hover:translate-x-1 transition-transform'>
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
