import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function PetShippingSection() {
  return (
    <section className='py-12 md:py-16 bg-white'>
      <Container>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-light-blue border border-border rounded-xl p-8'>
          <div className='max-w-[620px]'>
            <p className='text-xs font-bold uppercase tracking-widest text-primary mb-2'>Pet shipping</p>
            <h2 className='text-[28px] md:text-[32px] font-extrabold text-navy mb-3'>Shipping a pet or animal?</h2>
            <p className='text-[16px] text-text-primary'>
              We transport all animals. Crate rules, microchip and rabies timing, health certificates and airline checks, explained before we book.
            </p>
          </div>
          <Link href='/pet-shipping' className='h-[42px] px-8 inline-flex items-center rounded bg-primary text-white font-bold whitespace-nowrap'>
            Pet shipping
          </Link>
        </div>
      </Container>
    </section>
  );
}
