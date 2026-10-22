'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DocumentAndParcelSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: contentRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    }
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: imageRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    }
  }, []);

  return (
    <section className='py-16 md:py-20 lg:py-24 bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left - Content */}
          <div ref={contentRef}>
            <p className='text-xs font-bold text-primary uppercase tracking-widest mb-4' style={{ color: '#1173D4' }}>
              OPS EXPRESS
            </p>
            <h2 className='text-2xl md:text-[28px] lg:text-6xl font-extrabold mb-6 leading-tight' style={{ color: '#0B2C5F' }}>
              One envelope. One box.{' '}
              <span style={{ color: '#1173D4' }}>Same care as a container.</span>
            </h2>
            <p className='text-base md:text-lg mb-8 leading-relaxed' style={{ color: '#1A1A1A' }}>
              A signed contract, a passport, a spare part holding up a line, a sample a customer is waiting on. Small things with disproportionate consequences — collected from your door and delivered to theirs, tracked the whole way.
            </p>

            {/* Buttons */}
            <div className='flex flex-wrap gap-4 mb-8'>
              <button
                className='px-8 py-3 font-bold text-white rounded-lg text-base transition-all'
                style={{ backgroundColor: '#1173D4' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B5AA8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1173D4')}
              >
                Ship Now
              </button>
              <button
                className='px-8 py-3 font-bold rounded-lg text-base transition-all border-2'
                style={{ borderColor: '#0B2C5F', color: '#0B2C5F' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(11, 44, 95, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Get a Quote
              </button>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              {['DOCUMENTS', 'PARCELS', 'DOOR TO DOOR', 'IMPORT & EXPORT', 'TRACKED TO SIGNATURE'].map((tag) => (
                <span
                  key={tag}
                  className='text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full'
                  style={{
                    backgroundColor: '#EDF4FD',
                    color: '#1173D4',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div ref={imageRef}>
            <div className='relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg'>
              <img
                src='/images/home/Navigate the latest pricing developments.webp'
                alt='Express document and parcel shipping'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
