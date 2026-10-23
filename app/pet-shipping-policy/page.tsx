import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { PET_CANCELLATION, SERVICE_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pet Shipping Policy | OPS Logistics',
  description: 'Cancellation, refund, health and liability terms for shipping pets and animals with OPS Logistics.',
};

export default function PetShippingPolicyPage() {
  const c = PET_CANCELLATION;

  return (
    <div className='bg-white'>
      <section className='py-16 md:py-20'>
        <Container>
          <div className='max-w-[820px]'>
            <p className='text-xs font-bold uppercase tracking-widest text-primary mb-3'>Policy</p>
            <h1 className='text-[40px] md:text-[52px] font-extrabold text-navy mb-6'>Pet shipping policy</h1>

            <div className='space-y-8 text-[17px] leading-relaxed'>
              <section>
                <h2 className='text-[24px] font-extrabold text-navy mb-2'>1. What a request is</h2>
                <p>A pet shipping request is an enquiry, not a booking. We confirm each shipment in writing after we check destination requirements, airline acceptance and the crate.</p>
              </section>

              <section>
                <h2 className='text-[24px] font-extrabold text-navy mb-2'>2. Airline and destination rules</h2>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>Airlines and destination countries set their own rules. We cannot override them.</li>
                  <li>An airline may refuse a pet, crate or booking at check-in or before departure. If this happens, we will rebook where possible, and refund any amount you paid for services we did not deliver.</li>
                  <li>Health certificates and permits must be issued by the veterinarian or authority named in the destination&apos;s rules. We check paperwork before dispatch, but we are not responsible for the content of documents a veterinarian issues.</li>
                </ul>
              </section>

              <section>
                <h2 className='text-[24px] font-extrabold text-navy mb-2'>3. Cancellations and refunds</h2>
                <div className='overflow-hidden border border-border rounded-xl'>
                  <table className='w-full text-left text-[15px]'>
                    <thead className='bg-light-gray'>
                      <tr>
                        <th className='px-4 py-3'>When you cancel</th>
                        <th className='px-4 py-3'>What happens</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-t border-border'>
                        <td className='px-4 py-3'>More than {c.fullRefundDays} days before pickup</td>
                        <td className='px-4 py-3'>Full refund, less a ${c.fee} fee</td>
                      </tr>
                      <tr className='border-t border-border'>
                        <td className='px-4 py-3'>{c.partialRefundDays} to {c.fullRefundDays} days before pickup</td>
                        <td className='px-4 py-3'>Refund of 50% of the booking, less costs already spent (crate, veterinary, testing)</td>
                      </tr>
                      <tr className='border-t border-border'>
                        <td className='px-4 py-3'>Less than {c.partialRefundDays} days before pickup, or after the pet is collected</td>
                        <td className='px-4 py-3'>Costs already spent are kept. No further refund.</td>
                      </tr>
                      <tr className='border-t border-border'>
                        <td className='px-4 py-3'>We cancel, or the airline cancels, or the flight is delayed by more than {c.delayHoursForFullRefund} hours</td>
                        <td className='px-4 py-3'>Full refund, or rebooking at no extra charge</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ul className='list-disc pl-6 space-y-2 mt-4'>
                  <li>Cancel in writing to <a href={`mailto:${SERVICE_EMAIL}`} className='text-primary font-bold'>{SERVICE_EMAIL}</a>.</li>
                  <li>Refunds are paid within {c.refundBusinessDays} business days to the original payment method.</li>
                </ul>
              </section>

              <section>
                <h2 className='text-[24px] font-extrabold text-navy mb-2'>4. Health and welfare</h2>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>We do not recommend sedation for air travel. Sedatives can affect breathing and body temperature. If you give your pet sedation, tell us in advance so we can record it.</li>
                  <li>Pets with breathing problems (snub-nosed breeds) may be refused by airlines for cargo travel. We will tell you before you pay.</li>
                  <li>You are responsible for your pet&apos;s health, vaccinations and fitness to travel.</li>
                </ul>
              </section>

              <section>
                <h2 className='text-[24px] font-extrabold text-navy mb-2'>5. Liability</h2>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>Our liability for loss, injury or death of an animal is limited as set out in your booking confirmation, and applies only where we or our agents were negligent, as far as the law allows.</li>
                  <li>We are not liable for delays, refusals or losses caused by airlines, border authorities or veterinarians, except where the law requires us to be.</li>
                </ul>
              </section>

              <section>
                <h2 className='text-[24px] font-extrabold text-navy mb-2'>6. Your information</h2>
                <p>We use the details you send only to arrange the shipment. See our <Link href='/privacy-policy' className='text-primary font-bold'>privacy policy</Link>.</p>
              </section>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
