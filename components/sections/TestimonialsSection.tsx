'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-testimonial]');
      animateStagger(Array.from(cards) as HTMLElement[], 0.15);
    }
  }, []);

  const testimonials: Testimonial[] = [
    {
      quote: 'OPS Logistics transformed our supply chain operations. Their real-time tracking and reliable delivery have allowed us to improve customer satisfaction while reducing shipping costs by 30%.',
      author: 'Sarah Mitchell',
      role: 'Chief Operations Officer',
      company: 'Global Tech Solutions',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      quote: 'The cold chain expertise at OPS is unmatched. For our pharmaceutical shipments, we need precision and reliability - they deliver both consistently. Our compliance rate has reached 100%.',
      author: 'Dr. James Chen',
      role: 'Supply Chain Director',
      company: 'MedCare Pharmaceuticals',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      quote: 'Managing international e-commerce shipping was complex until we partnered with OPS. Their customs expertise and last-mile delivery solutions have simplified everything across our 45-country operation.',
      author: 'Emma Rodriguez',
      role: 'Logistics Manager',
      company: 'EuroShop Retail',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      quote: 'With 24/7 support and 220+ countries covered, OPS gives us confidence in every shipment. Their team goes above and beyond to solve problems. This is true partnership.',
      author: 'Michael Torres',
      role: 'Procurement Manager',
      company: 'Industrial Manufacturing Corp',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
  ];

  return (
    <section className='py-section-lg bg-navy text-white'>
      <Container>
        <div className='text-center mb-16'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Customer Testimonials</p>
          <h2 className='text-h2 font-bold mb-6'>What our partners say</h2>
          <p className='text-body text-white/80 max-w-3xl mx-auto'>
            Hear from logistics leaders who have transformed their operations with OPS Logistics solutions.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-testimonial
              className='bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all duration-300'
            >
              <div className='mb-6'>
                <div className='flex gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className='w-5 h-5 text-primary fill-current' viewBox='0 0 20 20'>
                      <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
                    </svg>
                  ))}
                </div>
                <p className='text-white/90 text-lg leading-relaxed italic'>"{testimonial.quote}"</p>
              </div>

              <div className='flex items-center gap-4 pt-6 border-t border-white/10'>
                <div className='w-12 h-12 rounded-full bg-primary/20 overflow-hidden flex-shrink-0'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <p className='font-bold text-white'>{testimonial.author}</p>
                  <p className='text-white/70 text-sm'>{testimonial.role}</p>
                  <p className='text-primary text-sm font-semibold'>{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
