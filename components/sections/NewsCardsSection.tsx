'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface NewsCard {
  title: string;
  description: string;
  category?: string;
}

export default function NewsCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-news-card]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.15);
    }
  }, []);

  const newsCards: NewsCard[] = [
    {
      title: 'Sustainable development',
      description:
        'Sustainable businesses start with low-carbon supply chains. Discover what we have to offer and how we integrate sustainability into our operations to reduce the environmental impact of your supply chain.',
      category: 'Sustainability',
    },
    {
      title: 'Innovation',
      description:
        'Discover the future of logistics through customer-centric innovation, cutting-edge trend research, and next-generation solutions.',
      category: 'Technology',
    },
    {
      title: 'Globalization is holding strong at a record level',
      description:
        'The PAHO Global Connectivity Report 2026 offers the most comprehensive view of globalization available.',
      category: 'Global',
    },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {newsCards.map((card, index) => (
            <div key={index} data-news-card className='bg-white border border-border rounded-card overflow-hidden hover:shadow-medium transition-all duration-300'>
              {/* Image Placeholder */}
              <div className='w-full h-48 md:h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                <span className='text-gray-500 text-sm'>News Image</span>
              </div>

              {/* Content */}
              <div className='p-6'>
                {card.category && (
                  <p className='text-primary text-xs font-bold uppercase tracking-wider mb-3'>{card.category}</p>
                )}
                <h3 className='text-h4 font-bold text-text-primary mb-3'>{card.title}</h3>
                <p className='text-text-secondary text-sm mb-4'>{card.description}</p>
                <a href='#' className='text-primary font-semibold hover:underline text-sm inline-flex items-center gap-2'>
                  Read more
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
