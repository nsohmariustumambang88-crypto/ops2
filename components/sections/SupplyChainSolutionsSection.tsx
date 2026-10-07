'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SupplyChainSolutionsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.solution-card');
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
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const solutions = [
    {
      icon: '💼',
      title: 'Contract Logistics',
      description: 'Warehousing, inventory management and value-added services are performed on your behalf.',
    },
    {
      icon: '🛒',
      title: 'E-commerce execution',
      description: 'Choose, pack, ship and return items for online merchants who sell across borders.',
    },
    {
      icon: '📋',
      title: 'Customs & Compliance',
      description: 'Classification, task management and customs clearance are handled by our own brokers.',
    },
    {
      icon: '❄️',
      title: 'Cold Chain Logistics',
      description: 'Temperature-controlled handling for pharmaceutical, food and life science cargo.',
    },
    {
      icon: '🚚',
      title: 'Last Mile Delivery',
      description: 'Final residential and commercial delivery with planning and returns.',
    },
    {
      icon: '📦',
      title: 'Gestion des services de fret',
      description: 'Pallets, containers and project freight with OPS Global Forwarding.',
    },
  ];

  return (
    <section className='py-12 md:py-16 lg:py-20 bg-white px-4 sm:px-6 md:px-12 lg:px-20'>
      <Container>
        {/* Header Section */}
        <div ref={headerRef} className='mb-12 md:mb-16 text-center'>
          {/* Label */}
          <p className='text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6' style={{ color: '#1173D4', fontFamily: 'Barlow, sans-serif' }}>
            SUPPLY CHAIN SOLUTIONS
          </p>

          {/* Heading */}
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
            Outsource the parts that are slowing you down
          </h2>

          {/* Description */}
          <p className='text-sm md:text-base leading-relaxed' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
            Our supply chain division functions as your third-party logistics provider – warehousing, fulfillment, customs clearance and delivery, built around how your business already operates.
          </p>
        </div>

        {/* Solutions Grid */}
        <div ref={cardsRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {solutions.map((solution, index) => (
            <div
              key={index}
              className='solution-card bg-white border border-gray-200 rounded-lg p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 text-center flex flex-col items-center'
            >
              {/* Icon */}
              <div
                className='w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl mb-6'
                style={{ backgroundColor: '#0B2C5F' }}
              >
                {solution.icon}
              </div>

              {/* Title */}
              <h3 className='text-lg md:text-xl font-bold mb-3' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
                {solution.title}
              </h3>

              {/* Description */}
              <p className='text-sm md:text-base leading-relaxed mb-4 flex-grow' style={{ color: '#4A5A73', fontFamily: 'Barlow, sans-serif' }}>
                {solution.description}
              </p>

              {/* Arrow */}
              <div style={{ color: '#1173D4' }}>
                →
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
