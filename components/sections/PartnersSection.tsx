'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

interface Partner {
  name: string;
  category: string;
  description: string;
}

export default function PartnersSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const logos = containerRef.current.querySelectorAll('[data-partner]');
      animateStagger(Array.from(logos) as HTMLElement[], 0.08);
    }
  }, []);

  const partners: Partner[] = [
    { name: 'TMS Integration', category: 'Software', description: 'Seamless integration with major transportation management systems' },
    { name: 'ERP Connectors', category: 'Enterprise', description: 'Direct API integration with SAP, Oracle, and NetSuite' },
    { name: 'E-Commerce Platforms', category: 'Retail', description: 'Native integration with Shopify, Magento, and WooCommerce' },
    { name: 'Customs Brokers', category: 'Compliance', description: 'Partnership with licensed customs brokers in 50+ countries' },
    { name: 'Warehousing Partners', category: 'Fulfillment', description: 'Network of 85+ strategically located distribution centers' },
    { name: 'Regional Carriers', category: 'Transportation', description: 'Preferred rates with leading carriers worldwide' },
    { name: 'Insurance Providers', category: 'Coverage', description: 'Cargo insurance partnerships for complete protection' },
    { name: 'Port Operators', category: 'Maritime', description: 'Direct relationships with major container ports globally' },
    { name: 'Technology Partners', category: 'Innovation', description: 'Integration with IoT tracking and AI optimization tools' },
  ];

  return (
    <section className='py-section-lg bg-white'>
      <Container>
        <div className='text-center mb-16'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Our Ecosystem</p>
          <h2 className='text-h2 font-bold mb-6 text-text-primary'>Strategic Partnerships</h2>
          <p className='text-body text-text-secondary max-w-3xl mx-auto'>
            OPS Logistics partners with industry leaders to deliver comprehensive solutions. Our integrations streamline your operations and maximize efficiency.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {partners.map((partner, index) => (
            <div
              key={index}
              data-partner
              className='bg-light-blue rounded-lg p-8 border border-gray-200 hover:border-primary hover:shadow-md transition-all'
            >
              <div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <p className='text-primary text-xs font-bold uppercase tracking-wider mb-2'>{partner.category}</p>
              <h3 className='text-lg font-bold text-text-primary mb-3'>{partner.name}</h3>
              <p className='text-text-secondary text-sm'>{partner.description}</p>
            </div>
          ))}
        </div>

        <div className='mt-16 text-center'>
          <p className='text-text-secondary mb-6 max-w-2xl mx-auto'>
            Our extensive partner network ensures you have access to best-in-class services and seamless integrations with your existing systems.
          </p>
          <button className='px-8 py-3 bg-primary text-white font-bold rounded-button hover:bg-primary/90 transition-colors'>
            View Integration Documentation
          </button>
        </div>
      </Container>
    </section>
  );
}
