import Link from 'next/link';
import Container from '@/components/ui/Container';

const tags = ['DOCUMENTS', 'PARCELS', 'DOOR TO DOOR', 'IMPORT & EXPORT', 'TRACKED TO SIGNATURE'];

const steps = [
  {
    title: 'Book online',
    text: 'Enter the sender and recipient addresses, the weight and size of the package, and the service you need.',
  },
  {
    title: 'We collect',
    text: 'A driver collects from your door, or you drop the parcel at a partner location.',
  },
  {
    title: 'Moved by air or road',
    text: 'Documents and parcels travel on the fastest available network, with customs paperwork prepared in advance.',
  },
  {
    title: 'Delivered and signed',
    text: 'The recipient signs on delivery, and you receive the proof of delivery in your account.',
  },
];

const sendItems = [
  'Contracts, passports, legal papers and certificates',
  'Samples, spare parts and small machine components',
  'Electronics and accessories in retail packaging',
  'Medical supplies that do not need temperature control',
];

const restricted = [
  'Dangerous goods, batteries and aerosols need a special declaration before booking',
  'Cash, precious metals and other high-value items must be declared at booking',
  'Perishable food needs our cold-chain service',
];

const faqs = [
  {
    q: 'What is the difference between a document and a parcel?',
    a: 'Documents are flat, unpacked papers that fit in an envelope. Parcels are any boxed or packaged item. Both use the same tracking and delivery service.',
  },
  {
    q: 'How do I know where my parcel is?',
    a: 'Every shipment gets a tracking number. Enter it on the tracking page to see each scan from pickup to delivery.',
  },
  {
    q: 'Can I ship to another country?',
    a: 'Yes. For international shipments we prepare the customs documents, and you pay any duties the destination country charges.',
  },
  {
    q: 'What if my parcel is delayed or lost?',
    a: 'Contact our support team with your tracking number. We investigate every delay and handle claims under the terms of your service.',
  },
];

export default function ExpressDocumentParcelPage() {
  return (
    <div className="bg-white text-black">
      {/* Hero */}
      <section className="py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">OPS Express</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-navy">
                One envelope. One box.{' '}
                <span className="text-primary">Same care as a container.</span>
              </h1>
              <p className="text-base md:text-lg mb-8 leading-relaxed text-black">
                A signed contract, a passport, a spare part holding up a production line, a sample a customer is waiting on.
                Small shipments with big consequences, collected from your door and delivered to theirs, tracked the whole way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/ship-now"
                  className="text-center px-8 py-3 font-bold text-white rounded-lg bg-primary hover:bg-primary-dark transition-colors"
                >
                  Ship Now
                </Link>
                <Link
                  href="/quote"
                  className="text-center px-8 py-3 font-bold rounded-lg border-2 border-navy text-navy hover:bg-light-blue transition-colors"
                >
                  Get a Quote
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-light-blue text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-deep">
              <img
                src="/images/home/Shipping documents and parcels.webp"
                alt="Shipping documents and parcels with OPS Express"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-light-blue">
        <Container>
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-2xl md:text-[28px] font-bold text-navy mb-4">From booking to signature in four steps</h2>
            <p className="text-black leading-relaxed">
              You do not need an account to send a one-off shipment, but a business account gives you saved addresses,
              invoices and shipment history.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-white rounded-xl p-5 border border-border">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold mb-4">
                  {i + 1}
                </span>
                <h3 className="text-[15px] font-extrabold text-navy mb-2">{step.title}</h3>
                <p className="text-black text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What you can send */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">What you can send</p>
              <h2 className="text-2xl md:text-[28px] font-bold text-navy mb-6">Documents and parcels for individuals and businesses</h2>
              <ul className="space-y-4">
                {sendItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-black">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-light-gray rounded-xl p-8">
              <h3 className="text-lg font-bold text-navy mb-4">Before you book</h3>
              <ul className="space-y-4">
                {restricted.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-black text-sm leading-relaxed">
                    <span className="text-navy font-bold mt-0.5">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-light-blue">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 text-center">Questions</p>
            <h2 className="text-2xl md:text-[28px] font-bold text-navy mb-10 text-center">Express shipping FAQ</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="bg-white rounded-xl border border-border p-6 group">
                  <summary className="cursor-pointer font-bold text-navy list-none flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-black leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-[28px] font-bold mb-4">Ready to send your first shipment?</h2>
            <p className="text-white/90 mb-8">Book online in a few minutes, or talk to our team about regular shipments.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ship-now" className="px-8 py-3 font-bold rounded-lg bg-white text-primary hover:bg-gray-100 transition-colors">
                Ship Now
              </Link>
              <Link href="/request-business-account" className="px-8 py-3 font-bold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors">
                Open a Business Account
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
