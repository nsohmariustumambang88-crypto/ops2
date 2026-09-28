'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import gsap from 'gsap';

export default function Hero() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const trackingBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0.2
      )
      .fromTo(
        trackingBoxRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
        0.4
      );
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      console.log('Tracking:', trackingNumber);
    }
  };

  return (
    <section className='relative w-full text-white overflow-hidden' style={{ minHeight: '70vh' }}>
      {/* Background Image with Overlay */}
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: 'url(/images/home/3d63aa55-573e-4d41-b574-81235d3ca999.webp)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Navy Overlay */}
        <div className='absolute inset-0 bg-navy/60'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 w-full h-full flex items-center'>
        <Container>
          <div className='text-center max-w-4xl mx-auto py-12 md:py-20'>
            {/* Label */}
            <p className='text-sm md:text-base font-bold uppercase tracking-widest text-white/90 mb-6'>
              PROVIDING EXCELLENCE WORLDWIDE
            </p>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tight'
            >
              Track your parcel
            </h1>

            {/* Subheading */}
            <p ref={subtitleRef} className='text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto'>
              Track your shipments in real-time and manage your logistics with ease
            </p>

            {/* Tracking Box */}
            <div
              ref={trackingBoxRef}
              className='bg-white rounded-card p-6 md:p-8 shadow-deep max-w-2xl mx-auto'
            >
              <form onSubmit={handleTrack}>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <input
                    type='text'
                    placeholder='Enter your tracking number(s)'
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className='flex-1 px-6 py-4 md:py-5 rounded-button border-none text-text-primary text-base md:text-lg placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all'
                  />
                  <Button
                    type='submit'
                    variant='primary'
                    className='sm:w-auto px-8 py-4 md:py-5 font-bold whitespace-nowrap text-base md:text-lg'
                  >
                    Delivery tracking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
