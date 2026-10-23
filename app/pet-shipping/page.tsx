import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import PetQuoteForm from '@/components/pets/PetQuoteForm';

export const metadata: Metadata = {
  title: 'Pet Shipping and Pet Relocation | OPS Logistics',
  description: 'Ship your pet or animal internationally. Crate rules, microchip and rabies timing, health certificates and airline checks, with a clear quote request.',
};

const faqs = [
  ['How long before travel should I start?', '6 to 12 months for strict destinations, 1 to 3 months for simpler moves.'],
  ['Can my dog fly in the cabin?', 'Only small dogs and cats, and only if the airline allows it. We quote this per request.'],
  ['Do you ship birds or reptiles?', 'Yes. Each species is reviewed before we confirm, because crate and permit rules differ.'],
  ['Do you give sedation?', 'We do not recommend it for air travel. See the pet shipping policy.'],
  ['What if my destination changes its rules?', 'We check the rules again before we confirm, and tell you if anything changes.'],
];

const crateRules = [
  'Your pet must be able to stand, turn around and lie down comfortably.',
  'The floor must be solid and leakproof, with handles on the long side.',
  'The door must lock securely on all sides.',
  'Food and water containers must be reachable from outside the crate.',
  'Snub-nosed breeds (such as bulldogs and pugs) usually need a larger crate, and some airlines will not carry them as cargo.',
  'One pet per crate. Two small pets under 14 kg may share a crate, but the airline decides.',
];

const paperwork = [
  ['Microchip.', 'A 15-digit ISO microchip, fitted before any rabies vaccination.'],
  ['Rabies vaccination.', 'At least 30 days before travel, or longer if your destination requires it. Some countries also need a blood test (titer) and a waiting period after it.'],
  ['Health certificate.', 'Issued by a licensed veterinarian close to departure. For US exports the vet must be USDA-accredited, and APHIS endorses the certificate.'],
  ['Import or export permits.', 'Required by some countries, and protected species need permits. We confirm which apply.'],
  ['Airline acceptance.', 'Each airline adds its own rules. We check this before we confirm.'],
];

export default function PetShippingPage() {
  return (
    <div className='bg-white'>
      <section className='py-16 md:py-20'>
        <Container>
          <div className='max-w-[760px]'>
            <p className='text-xs font-bold uppercase tracking-widest text-primary mb-3'>Pet shipping</p>
            <h1 className='text-[40px] md:text-[56px] font-extrabold text-navy mb-6'>Ship your pet with OPS Logistics</h1>
            <p className='text-[18px] text-text-primary'>
              Moving an animal across a border takes planning. We transport all animals, and we handle transport, crate checks and tracking.
              The paperwork depends on your destination, and we confirm exactly what it needs before we book.
            </p>
          </div>
        </Container>
      </section>

      <section className='py-12 bg-light-gray'>
        <Container>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-white border border-border rounded-xl p-6'>
              <h2 className='text-[26px] font-extrabold text-navy mb-4'>What we carry</h2>
              <ul className='space-y-3 text-[16px] list-disc pl-5'>
                <li>All animals, by air cargo. Dogs and cats are the most common and have the most established rules.</li>
                <li>Other species (birds, reptiles, small mammals and more) are reviewed one by one before we confirm, because each has its own crate, enclosure and permit rules.</li>
                <li>Cabin travel on request, for small dogs and cats, if the airline allows it.</li>
                <li>International moves from our origin hubs. Domestic moves: not at launch.</li>
              </ul>
            </div>
            <div className='bg-white border border-border rounded-xl p-6'>
              <h2 className='text-[26px] font-extrabold text-navy mb-4'>Crate requirements</h2>
              <ul className='space-y-3 text-[16px] list-disc pl-5'>
                {crateRules.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <p className='mt-4 text-[15px] text-text-secondary'>Not sure your crate qualifies? Send a photo and its measurements with your request.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className='py-12'>
        <Container>
          <div className='max-w-[860px]'>
            <h2 className='text-[30px] font-extrabold text-navy mb-6'>Paperwork checklist</h2>
            <ol className='space-y-4 list-decimal pl-6 text-[17px]'>
              {paperwork.map(([title, text]) => (
                <li key={title}><span className='font-bold'>{title}</span> {text}</li>
              ))}
            </ol>
            <p className='mt-6 text-[17px]'>Start early. Some destinations need 6 to 12 months of preparation.</p>
            <p className='mt-4 text-[17px]'>
              Read more in our <Link href='/blog' className='text-primary font-bold'>blog</Link>, including a guide to preparing your pet for international shipping.
            </p>
          </div>
        </Container>
      </section>

      <section id='quote' className='py-12 bg-light-gray'>
        <Container>
          <div className='max-w-[860px]'>
            <h2 className='text-[30px] font-extrabold text-navy mb-2'>Get a pet shipping quote</h2>
            <p className='text-[16px] text-text-secondary mb-8'>
              Tell us about your pet and your journey. This is a request, not a booking. Before you send it, please read the{' '}
              <Link href='/pet-shipping-policy' className='text-primary font-bold'>pet shipping policy</Link>.
            </p>
            <PetQuoteForm />
          </div>
        </Container>
      </section>

      <section className='py-12'>
        <Container>
          <div className='max-w-[760px]'>
            <h2 className='text-[30px] font-extrabold text-navy mb-6'>Frequently asked questions</h2>
            <div className='space-y-6'>
              {faqs.map(([q, a]) => (
                <div key={q}>
                  <h3 className='text-[18px] font-bold text-navy'>{q}</h3>
                  <p className='text-[16px] mt-1'>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
