'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { animateSlideInRight, animateSlideInLeft } from '@/lib/animations';

export default function ShippingContainersSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateSlideInLeft(textRef.current);
    animateSlideInRight(featuresRef.current);
  }, []);

  return (
    <section className='py-section-lg md:py-section-lg bg-light-gray'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
          {/* Text Content */}
          <div ref={textRef} className='order-1 lg:order-1'>
            <p className='text-primary font-bold text-xs md:text-sm mb-4 uppercase tracking-wider'>Quality Containers Available</p>
            <h2 className='text-2xl md:text-[28px] md:text-h2 font-bold mb-6 text-text-primary'>Shipping containers for sale</h2>
            <p className='text-body text-text-secondary mb-4'>
              Shop reliable shipping containers for sale for storage, commercial use, transportation, construction projects, equipment storage and container conversions.
            </p>
            <p className='text-body text-text-secondary mb-8'>
              Explore a selection of new and used shipping containers in popular sizes and configurations. Whether you need a container for secure storage, business operations, a construction project, or a custom conversion, find practical options designed for a wide range of applications.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 mb-8'>
              <Button variant='primary'>Buy shipping containers</Button>
              <p className='text-sm text-text-secondary self-center'>Browse the available container sizes, conditions, and configurations.</p>
            </div>
          </div>

          {/* Features Grid */}
          <div ref={featuresRef} className='order-2 lg:order-2'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              {/* Feature 1 */}
              <div className='bg-white rounded-xl p-5'>
                <div className='text-primary font-bold text-2xl mb-3'>01</div>
                <h3 className='font-bold text-text-primary mb-3'>New and used containers</h3>
                <p className='text-sm text-text-secondary'>Explore several container conditions suitable for storage, commercial, and project applications.</p>
              </div>

              {/* Feature 2 */}
              <div className='bg-white rounded-xl p-5'>
                <div className='text-primary font-bold text-2xl mb-3'>02</div>
                <h3 className='font-bold text-text-primary mb-3'>Multiple sizes</h3>
                <p className='text-sm text-text-secondary'>Choose from popular container sizes and configurations for different space requirements.</p>
              </div>

              {/* Feature 3 */}
              <div className='bg-white rounded-xl p-5'>
                <div className='text-primary font-bold text-2xl mb-3'>03</div>
                <h3 className='font-bold text-text-primary mb-3'>Secure storage</h3>
                <p className='text-sm text-text-secondary'>Practical container solutions for equipment, inventory, materials and general storage needs.</p>
              </div>

              {/* Feature 4 */}
              <div className='bg-white rounded-xl p-5'>
                <div className='text-primary font-bold text-2xl mb-3'>04</div>
                <h3 className='font-bold text-text-primary mb-3'>Applications flexibles</h3>
                <p className='text-sm text-text-secondary'>Suitable for commercial use, personal storage, container construction and conversion.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
