'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function CTABannerSection() {
  return (
    <section className='py-section-md bg-light-gray border-t border-border border-b'>
      <Container>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-8'>
          <div className='flex-1'>
            <h2 className='text-2xl md:text-[28px] font-extrabold text-text-primary'>
              Need help with your shipment? Our team is available 24/7.
            </h2>
          </div>
          <Button variant='primary' className='whitespace-nowrap'>
            Track your shipment →
          </Button>
        </div>
      </Container>
    </section>
  );
}
