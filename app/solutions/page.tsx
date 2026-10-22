'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const solutions = [
  {
    name: 'Contract Logistics',
    description: '3PL supply chain management tailored to your business needs',
    href: '/solutions/contract-logistics',
    icon: '📦',
  },
  {
    name: 'E-Commerce Fulfillment',
    description: 'Fast-paced order fulfillment and distribution for online retailers',
    href: '/solutions/ecommerce',
    icon: '🛒',
  },
  {
    name: 'Customs & Compliance',
    description: 'Expert clearance and regulatory compliance across borders',
    href: '/solutions/customs',
    icon: '🏛️',
  },
  {
    name: 'Cold Chain Logistics',
    description: 'Temperature-controlled shipping for pharmaceuticals and perishables',
    href: '/solutions/cold-chain',
    icon: '❄️',
  },
  {
    name: 'Last Mile Delivery',
    description: 'Final-mile delivery solutions for maximum customer satisfaction',
    href: '/solutions/last-mile',
    icon: '🚚',
  },
  {
    name: 'Freight Services',
    description: 'Air, sea, road, and rail freight with global coverage',
    href: '/solutions/freight',
    icon: '✈️',
  },
];

export default function SolutionsPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Logistics Solutions</h1>
          <p className='text-lg text-white/90'>Comprehensive shipping and logistics services designed for every business need.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {solutions.map((solution) => (
              <Button
                key={solution.name}
                href={solution.href}
                className='!p-0 !bg-transparent !text-text-primary hover:!bg-transparent group'
              >
                <div className='w-full bg-white border border-border rounded-xl p-8 hover:shadow-deep transition-all text-left'>
                  <div className='text-4xl mb-4'>{solution.icon}</div>
                  <h3 className='text-h4 font-bold mb-2 group-hover:text-primary transition-colors'>{solution.name}</h3>
                  <p className='text-text-secondary text-sm'>{solution.description}</p>
                  <div className='text-primary font-bold text-sm mt-4'>Learn More →</div>
                </div>
              </Button>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
