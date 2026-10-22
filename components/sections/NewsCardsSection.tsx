'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface NewsCard {
  title: string;
  description: string;
  category: string;
  image: string;
}

const newsCards: NewsCard[] = [
  {
    title: 'Lower-carbon supply chains',
    description:
      'We measure the emissions of every shipment and offer lower-carbon routes wherever they are available.',
    category: 'Sustainability',
    image: '/images/home/Sustainable development ›.webp',
  },
  {
    title: 'New tools for shippers',
    description:
      'Live tracking, digital customs paperwork and faster quotes, all built on one shared record for each shipment.',
    category: 'Technology',
    image: '/images/home/Innovation ›.webp',
  },
  {
    title: 'Trade reaches record levels',
    description:
      'Our network covers more than 220 countries and territories, with air, sea, road and rail under one booking.',
    category: 'Global',
    image: '/images/home/Globalization is holding strong at a record level.webp',
  },
];

export default function NewsCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-news-card]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.15);
    }
  }, []);

  return (
    <section className='py-16 md:py-20 bg-white'>
      <Container>
        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {newsCards.map((card) => (
            <article
              key={card.title}
              data-news-card
              className='bg-white rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-medium'
              style={{ border: '0.67px solid rgb(213, 223, 236)' }}
            >
              <div className='relative w-full aspect-[3/2] overflow-hidden'>
                <img src={card.image} alt={card.title} className='w-full h-full object-cover' />
              </div>

              <div className='px-6 pt-6 pb-7 text-left'>
                <p className='text-[12px] font-bold uppercase tracking-wider text-primary mb-2'>{card.category}</p>
                <h3 className='text-[15px] font-extrabold text-navy mb-3 leading-snug' style={{ color: '#002660' }}>
                  {card.title}
                </h3>
                <p className='text-[15px] leading-[26px] text-text-primary mb-4'>{card.description}</p>
                <a href='#' className='inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline'>
                  Read more
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
