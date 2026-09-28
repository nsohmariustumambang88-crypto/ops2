'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { animateSlideInLeft, animateSlideInRight } from '@/lib/animations';

interface ContentSectionProps {
  title: string;
  description: string;
  content?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  cta?: {
    text: string;
    href: string;
  };
  backgroundColor?: 'white' | 'light';
}

export default function ContentSection({
  title,
  description,
  content,
  imageUrl,
  imageAlt = 'Section image',
  imagePosition = 'left',
  cta,
  backgroundColor = 'white',
}: ContentSectionProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imagePosition === 'left') {
      animateSlideInLeft(imageRef.current);
      animateSlideInRight(textRef.current);
    } else {
      animateSlideInRight(imageRef.current);
      animateSlideInLeft(textRef.current);
    }
  }, [imagePosition]);

  const bgClass = backgroundColor === 'light' ? 'bg-light-gray' : 'bg-white';
  const isImageLeft = imagePosition === 'left';

  return (
    <section className={`py-section-lg ${bgClass}`}>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Image - Left */}
          {isImageLeft && imageUrl && (
            <div ref={imageRef} className='order-1 lg:order-1'>
              <div className='relative'>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className='w-full rounded-lg shadow-medium object-cover'
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
            </div>
          )}

          {/* Text Content */}
          <div ref={textRef} className={isImageLeft ? 'order-2 lg:order-2' : 'order-1 lg:order-1'}>
            <h2 className='text-h2 font-bold mb-6 text-text-primary'>{title}</h2>

            <p className='text-body text-text-secondary mb-6 leading-relaxed'>
              {description}
            </p>

            {/* Additional content */}
            {content && <div className='mb-6'>{content}</div>}

            {/* CTA Button */}
            {cta && (
              <Button variant='primary' className='mt-2'>
                {cta.text}
              </Button>
            )}
          </div>

          {/* Image - Right */}
          {!isImageLeft && imageUrl && (
            <div className='order-1 lg:order-2'>
              <div className='relative'>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className='w-full rounded-lg shadow-medium object-cover'
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
