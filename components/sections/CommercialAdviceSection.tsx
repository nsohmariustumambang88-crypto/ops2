'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { animateSlideInLeft, animateSlideInRight } from '@/lib/animations';

export default function CommercialAdviceSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateSlideInLeft(imageRef.current);
    animateSlideInRight(textRef.current);
  }, []);

  return (
    <section className='py-section-lg md:py-section-lg bg-white'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Image */}
          <div ref={imageRef} className='order-1 lg:order-1'>
            <div className='relative'>
              <div className='w-full h-64 md:h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center'>
                <span className='text-gray-400 text-sm'>Commercial Advice Image</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div ref={textRef} className='order-2 lg:order-2'>
            <p className='text-primary font-bold text-sm md:text-base mb-4 uppercase tracking-wider'>Commercial Advice</p>
            <h2 className='text-h2 font-bold mb-6 text-text-primary'>Navigate the latest pricing developments</h2>
            <p className='text-body text-text-secondary mb-8'>
              Global trade is becoming increasingly complex as new US tariffs vary and reciprocal measures emerge between countries and industries. At OPS Logistics, we are committed to helping you navigate these changes.
            </p>
            <Button variant='primary'>Discover our solutions</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
