'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateStagger } from '@/lib/animations';

export default function TrustSignalsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const badges = containerRef.current.querySelectorAll('[data-badge]');
      animateStagger(Array.from(badges) as HTMLElement[], 0.1);
    }
  }, []);

  const certifications = [
    {
      icon: '✓',
      title: 'ISO 9001:2015',
      description: 'Quality Management certified for operational excellence',
      category: 'Quality'
    },
    {
      icon: '🔒',
      title: 'ISO 27001',
      description: 'Information Security Management System certified',
      category: 'Security'
    },
    {
      icon: '🌿',
      title: 'ISO 14001',
      description: 'Environmental Management System certified',
      category: 'Sustainability'
    },
    {
      icon: '💼',
      title: 'FDA Compliance',
      description: 'Fully compliant with FDA regulations for pharmaceutical transport',
      category: 'Regulatory'
    },
    {
      icon: '✈️',
      title: 'IATA & IMDG',
      description: 'Licensed for hazardous materials and air cargo handling',
      category: 'Certification'
    },
    {
      icon: '📋',
      title: 'C-TPAT Certified',
      description: 'Customs-Trade Partnership Against Terrorism approved',
      category: 'Security'
    },
    {
      icon: '🏆',
      title: 'Industry Awards',
      description: '12+ years recognized as top logistics provider in customer satisfaction',
      category: 'Recognition'
    },
    {
      icon: '🔐',
      title: 'SOC 2 Type II',
      description: 'Third-party audited security and reliability standards',
      category: 'Compliance'
    },
  ];

  return (
    <section className='py-section-lg bg-light-blue'>
      <Container>
        <div className='text-center mb-16'>
          <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Trust & Security</p>
          <h2 className='text-h2 font-bold mb-6 text-text-primary'>Industry-Leading Certifications</h2>
          <p className='text-body text-text-secondary max-w-3xl mx-auto'>
            OPS Logistics maintains the highest standards of quality, security, and compliance. Our extensive certifications and partnerships demonstrate our commitment to excellence.
          </p>
        </div>

        <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {certifications.map((cert, index) => (
            <div
              key={index}
              data-badge
              className='bg-white rounded-lg p-8 border border-gray-200 hover:border-primary hover:shadow-md transition-all text-center group'
            >
              <div className='text-5xl mb-4 group-hover:scale-110 transition-transform duration-300'>{cert.icon}</div>
              <p className='text-primary text-xs font-bold uppercase tracking-wider mb-2'>{cert.category}</p>
              <h3 className='text-lg font-bold text-text-primary mb-3'>{cert.title}</h3>
              <p className='text-text-secondary text-sm leading-relaxed'>{cert.description}</p>
            </div>
          ))}
        </div>

        <div className='mt-16 bg-white rounded-lg border border-gray-200 p-12'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-4xl font-bold text-primary mb-2'>99.2%</div>
              <p className='text-text-secondary'>On-time Delivery Rate</p>
            </div>
            <div>
              <div className='text-4xl font-bold text-primary mb-2'>24/7</div>
              <p className='text-text-secondary'>Customer Support Available</p>
            </div>
            <div>
              <div className='text-4xl font-bold text-primary mb-2'>100%</div>
              <p className='text-text-secondary'>Data Encryption & Security</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
