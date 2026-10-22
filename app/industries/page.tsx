'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const industries = [
  {
    name: 'Automotive',
    description: 'Specialized logistics for vehicle components and finished automobiles',
    href: '/industries/automotive',
    icon: '🚗',
  },
  {
    name: 'Healthcare',
    description: 'Pharma-grade cold chain logistics for life sciences',
    href: '/industries/healthcare',
    icon: '⚕️',
  },
  {
    name: 'Retail',
    description: 'High-volume distribution and e-commerce fulfillment',
    href: '/industries/retail',
    icon: '🛍️',
  },
  {
    name: 'Energy & Utilities',
    description: 'Specialized handling for industrial equipment and hazmat materials',
    href: '/industries/energy',
    icon: '⚡',
  },
  {
    name: 'Technology',
    description: 'Secure logistics for electronics and sensitive components',
    href: '/industries/technology',
    icon: '💻',
  },
];

export default function IndustriesPage() {
  return (
    <div className='min-h-screen bg-white'>
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <h1 className='text-h1 font-bold mb-6'>Industry Solutions</h1>
          <p className='text-lg text-white/90'>Specialized logistics solutions tailored to your industry's unique requirements.</p>
        </Container>
      </section>

      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {industries.map((industry) => (
              <Button
                key={industry.name}
                href={industry.href}
                className='!p-0 !bg-transparent !text-text-primary hover:!bg-transparent group'
              >
                <div className='w-full bg-white border border-border rounded-xl p-8 hover:shadow-deep transition-all text-left'>
                  <div className='text-4xl mb-4'>{industry.icon}</div>
                  <h3 className='text-h4 font-bold mb-2 group-hover:text-primary transition-colors'>{industry.name}</h3>
                  <p className='text-text-secondary text-sm'>{industry.description}</p>
                  <div className='text-primary font-bold text-sm mt-4'>Explore →</div>
                </div>
              </Button>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
