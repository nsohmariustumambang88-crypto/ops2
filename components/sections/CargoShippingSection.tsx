'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CargoShippingSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  const services = [
    {
      icon: '✈️',
      title: 'Air Freight',
    },
    {
      icon: '🚢',
      title: 'Ocean Freight',
    },
    {
      icon: '🚚',
      title: 'Road Freight',
    },
    {
      icon: '🚂',
      title: 'Rail Freight',
    },
  ];

  return (
    <section className='py-16 md:py-24 lg:py-32 bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Left - Content Card */}
          <div ref={contentRef} className='bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-sm'>
            {/* Heading */}
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
              Cargo Shipping
            </h2>

            {/* Subheading */}
            <p className='text-base md:text-lg font-bold mb-4' style={{ color: '#1173D4' }}>
              BUSINESS ONLY
            </p>

            {/* Description */}
            <p className='text-sm md:text-base mb-8 leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
              Discover shipping and logistics service options from OPS Global Forwarding.
            </p>

            {/* Services Section */}
            <div className='bg-light-blue rounded-xl p-6 md:p-8 mb-8'>
              {/* Services Label */}
              <p className='text-xs md:text-sm font-bold uppercase tracking-widest mb-6' style={{ color: '#1173D4' }}>
                SERVICES AVAILABLE
              </p>

              {/* Services Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {services.map((service, index) => (
                  <div key={index} className='flex items-start gap-4'>
                    {/* Icon */}
                    <div className='w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shrink-0' style={{ backgroundColor: '#0B2C5F' }}>
                      {service.icon}
                    </div>

                    {/* Title */}
                    <h4 className='text-sm md:text-base font-bold leading-snug' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
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
              Explore OPS Global Forwarding
            </button>
          </div>

          {/* Right - Image */}
          <div ref={imageRef} className='h-80 sm:h-96 md:h-full md:min-h-96 rounded-lg overflow-hidden shadow-md'>
            <img
              src='/images/home/Enterprise logistics services.webp'
              alt='Cargo Shipping'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
