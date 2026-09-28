'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';

export default function Hero() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const trackingBoxRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0
    )
      .fromTo(
        trackingBoxRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
        0.4
      )
      .fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.6
      );
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      console.log('Tracking:', trackingNumber);
    }
  };

  const actionCards = [
    {
      icon: '📦',
      title: 'Ship Now',
      description: 'Find the right service',
    },
    {
      icon: '📋',
      title: 'Get a Quote',
      description: 'Estimate cost to share and compare',
    },
    {
      icon: '📊',
      title: 'Request a Business Account',
      description: 'Shipping regularly? Learn about volume discounts',
    },
  ];

  return (
    <section className='relative w-full text-white overflow-visible' style={{ minHeight: '100vh', paddingTop: '80px' }}>
      {/* Background Image with Overlay */}
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: 'url(/images/home/3d63aa55-573e-4d41-b574-81235d3ca999.webp)',
          backgroundAttachment: 'fixed',
          top: '-80px',
          height: 'calc(100% + 80px)',
        }}
      >
        {/* Dark Navy Overlay */}
        <div className='absolute inset-0' style={{ backgroundColor: 'rgba(11, 44, 95, 0.5)' }}></div>
      </div>

      {/* Content Container */}
      <div className='relative z-10 w-full h-full'>
        {/* Top Section - Tagline and Heading */}
        <div className='flex flex-col items-center justify-start pt-8 md:pt-12 pb-12 md:pb-16'>
          <Container>
            <div className='text-center max-w-4xl mx-auto'>
              {/* Label */}
              <p className='text-xs md:text-sm font-bold uppercase tracking-widest text-white/95 mb-6 md:mb-8'>
                DELIVERING EXCELLENCE WORLDWIDE
              </p>

              {/* Main Headline */}
              <h1
                ref={headlineRef}
                className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Track Your Shipment
              </h1>
            </div>
          </Container>
        </div>

        {/* Middle Section - Tracking Box and Cards */}
        <div className='relative flex flex-col items-center justify-center py-16 md:py-24'>
          <Container>
            <div className='w-full'>
              {/* Tracking Box */}
              <div
                ref={trackingBoxRef}
                className='bg-white rounded-lg p-4 md:p-6 shadow-deep max-w-2xl mx-auto mb-8 md:mb-12'
              >
                <form onSubmit={handleTrack}>
                  <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                    <input
                      type='text'
                      placeholder='Enter your tracking number(s)'
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className='flex-1 px-4 md:px-6 py-3 md:py-4 rounded-lg border-none text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all'
                    />
                    <button
                      type='submit'
                      className='px-6 md:px-8 py-3 md:py-4 font-bold text-white rounded-lg whitespace-nowrap text-sm md:text-base transition-all hover:opacity-90'
                      style={{ backgroundColor: '#1173D4' }}
                    >
                      Track Shipment
                    </button>
                  </div>
                </form>
              </div>

              {/* Action Cards */}
              <div ref={cardsRef} className='w-full'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-0'>
                  {actionCards.map((card, index) => (
                    <div key={index} className='bg-white rounded-lg p-6 md:p-8 text-center shadow-deep'>
                      <div className='text-4xl md:text-5xl mb-4'>{card.icon}</div>
                      <h3 className='text-lg md:text-xl font-bold mb-2' style={{ color: '#1173D4' }}>
                        {card.title}
                      </h3>
                      <p className='text-sm md:text-base' style={{ color: '#4A5A73' }}>
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
