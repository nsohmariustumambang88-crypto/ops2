'use client';

import Container from '@/components/ui/Container';
import Link from 'next/link';

export default function ServiceUpdatesSection() {
  const updates = [
    'Operational update in the Middle East',
    'Service announcement regarding European routes',
    'Updated customs procedures for Asia-Pacific region',
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <h2 className='text-h2 font-bold mb-4 text-text-primary'>Important service updates</h2>
        <p className='text-body text-text-secondary mb-8'>Service bulletins keep you informed of news and alerts.</p>

        <div className='space-y-3'>
          {updates.map((update, index) => (
            <Link
              key={index}
              href='#'
              className='flex items-center justify-between p-4 rounded-lg hover:bg-light-gray transition-all duration-300 group border border-transparent hover:border-border'
            >
              <span className='text-text-secondary font-medium group-hover:text-primary transition-colors text-sm md:text-base'>{update}</span>
              <svg className='w-5 h-5 text-primary flex-shrink-0 ml-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
