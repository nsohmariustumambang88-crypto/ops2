'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateFadeInUp } from '@/lib/animations';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateFadeInUp(sectionRef.current);
    }
  }, []);

  const faqs: FAQItem[] = [
    {
      question: 'How does OPS Logistics ensure on-time delivery?',
      answer: 'We maintain a 99.2% on-time delivery rate through real-time tracking, optimized routing, and our global network of 220+ countries. Our advanced logistics platform continuously monitors shipments and adjusts routes to ensure timely arrival.'
    },
    {
      question: 'What shipping options do you offer?',
      answer: 'OPS Logistics provides four main freight modes: air, sea, road, and rail. We also offer specialized services including express shipping, bulk maritime transport, e-commerce fulfillment, and cold chain logistics for temperature-sensitive cargo.'
    },
    {
      question: 'How can I track my shipment?',
      answer: 'All shipments include real-time tracking through our online portal. You can monitor your cargo from pickup to delivery with detailed status updates, location information, and estimated arrival times. Our 24/7 support team is also available for tracking assistance.'
    },
    {
      question: 'Do you offer cold chain logistics?',
      answer: 'Yes, we specialize in temperature-controlled handling for pharmaceutical, food, and life science cargo. Our cold chain logistics include controlled environment transportation, climate monitoring, and chain-of-custody documentation to maintain product integrity.'
    },
    {
      question: 'What is your customs clearance process?',
      answer: 'Our experienced customs brokers handle all aspects of international customs clearance. We manage classification, duties, and compliance documentation, ensuring smooth cross-border movement with zero delays. Our service is available for shipments across all 220+ countries we serve.'
    },
    {
      question: 'Can OPS Logistics handle last-mile delivery?',
      answer: 'Absolutely. We provide comprehensive last-mile delivery services for both residential and commercial locations, including scheduled delivery windows, handling instructions, and seamless returns management.'
    },
    {
      question: 'How do I get pricing and a quote?',
      answer: 'Visit our website to use our online estimation tool for instant quotes, or contact our sales team directly. We provide customized pricing based on your specific shipping requirements, volume, and service needs.'
    },
    {
      question: 'What support is available if I need help?',
      answer: 'OPS Logistics provides 24/7 customer support across multiple channels. Our expert team can assist with shipment planning, tracking, customs questions, or any logistics needs. Contact us via phone, email, or our online support portal.'
    },
  ];

  return (
    <section ref={sectionRef} className='py-section-lg bg-light-blue'>
      <Container>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-16'>
            <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Frequently Asked Questions</p>
            <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Find answers to common questions</h2>
            <p className='text-body text-text-secondary'>
              Learn more about our services, shipping options, and how OPS Logistics can help optimize your supply chain.
            </p>
          </div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary transition-colors'
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className='w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex items-start sm:items-center justify-between hover:bg-light-blue transition-colors gap-4'
                >
                  <h3 className='text-left text-sm sm:text-base md:text-lg font-bold text-text-primary'>
                    {faq.question}
                  </h3>
                  <div className='flex-shrink-0'>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-300 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 14l-7 7m0 0l-7-7m7 7V3'
                      />
                    </svg>
                  </div>
                </button>

                {openIndex === index && (
                  <div className='px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white border-t border-gray-100'>
                    <p className='text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed'>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
