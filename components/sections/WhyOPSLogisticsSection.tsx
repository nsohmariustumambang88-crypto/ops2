'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhyOPSLogisticsSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stats animation - fade in on scroll
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Content animation - fade in on scroll
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
            end: 'top 20%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Cards animation - staggered fade in on scroll
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const stats = [
    { number: '220+', label: 'Countries and territories served worldwide' },
    { number: '4', label: 'Freight modes – air, ocean, road and rail' },
    { number: '24/7', label: 'Live shipment tracking and account support' },
    { number: '3PL', label: 'Enterprise supply chain and contract logistics' },
  ];

  const features = [
    {
      icon: '🌐',
      title: 'One network, end to end',
      description: 'Air, ocean, road and rail under a single booking and a single point of contact, so nothing is lost at the handover.',
    },
    {
      icon: '✓',
      title: 'Customs handled properly',
      description: 'Classification, documentation and clearance managed in-house – the single biggest cause of delay, taken off your desk.',
    },
    {
      icon: '📍',
      title: 'Tracking you can act on',
      description: 'Live milestones from collection to final delivery, with exceptions flagged early enough that you can still do something about them.',
    },
    {
      icon: '💬',
      title: 'A named account team',
      description: 'Business accounts get people who know your lanes and your cargo, not a queue and a reference number.',
    },
  ];

  return (
    <section className='py-0 bg-white'>
      {/* Stats Banner */}
      <div ref={statsRef} className='py-12 md:py-16 lg:py-20' style={{ backgroundColor: '#EDF4FD' }}>
        <Container>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <h3 className='text-4xl md:text-5xl font-bold text-text-primary mb-2' style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {stat.number}
                </h3>
                <p className='text-sm md:text-base text-text-secondary leading-relaxed'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <div ref={contentRef} className='py-16 md:py-24 lg:py-32 bg-white'>
        <Container>
          {/* Label */}
          <p className='text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-3 md:mb-4'>
            WHY OPS LOGISTICS
          </p>

          {/* Heading */}
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-8 md:mb-10 leading-tight max-w-3xl' style={{ fontFamily: 'Poppins, sans-serif' }}>
            Built for shippers who can't afford surprises
          </h2>

          {/* Description */}
          <p className='text-base md:text-lg text-text-secondary mb-12 md:mb-16 leading-relaxed max-w-3xl'>
            Freight goes wrong in the gaps — between carriers, between borders, between someone booking a shipment and someone knowing where it is. We built OPS to close those gaps.
          </p>

          {/* Features Grid */}
          <div ref={cardsRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='feature-card p-6 md:p-8 rounded-2xl border-2 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-2'
                style={{ borderColor: '#1173D4', backgroundColor: 'white' }}
              >
                {/* Icon */}
                <div className='text-4xl mb-4'>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className='text-lg md:text-xl font-bold text-text-primary mb-3'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='text-sm md:text-base text-text-secondary leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
