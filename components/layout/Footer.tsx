'use client';

import Container from '@/components/ui/Container';

const OPSLogo = () => (
  <svg
    width="160"
    height="40"
    viewBox="0 0 160 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="20" r="8" fill="#0B2C5F" />
    <path d="M 8 20 Q 12 16 16 20 Q 12 24 8 20" fill="#1173D4" />
    <text
      x="35"
      y="26"
      fontSize="18"
      fontWeight="700"
      fill="#0B2C5F"
      fontFamily="Poppins, sans-serif"
    >
      OPS
    </text>
    <text
      x="35"
      y="38"
      fontSize="10"
      fontWeight="600"
      fill="#1173D4"
      fontFamily="Barlow, sans-serif"
      letterSpacing="1"
    >
      LOGISTICS
    </text>
  </svg>
);

export default function Footer() {
  const services = [
    { name: 'Express Shipping', href: '#' },
    { name: 'OPS Express', href: '#' },
    { name: 'eCommerce', href: '#' },
    { name: 'Supply chain', href: '#' },
  ];

  const company = [
    { name: 'About OPS', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Innovation', href: '#' },
    { name: 'Careers', href: '#' },
  ];

  const support = [
    { name: 'Customer Service', href: '#' },
    { name: 'mise à jour de service', href: '#' },
    { name: 'Request a Business Account', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  return (
    <>
      {/* CTA Banner */}
      <section className='py-4 md:py-6 border-b border-gray-200' style={{ borderTopColor: '#0B2C5F', borderTopWidth: '4px' }}>
        <Container>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h3 className='text-lg md:text-xl font-bold' style={{ fontFamily: 'Poppins, sans-serif', color: '#0B2C5F' }}>
              Need help with your shipment? Our team is available 24/7.
            </h3>
            <button
              className='px-6 md:px-8 py-3 font-bold text-white rounded-lg w-fit text-sm md:text-base transition-all hover:opacity-90 shrink-0'
              style={{ backgroundColor: '#0B2C5F' }}
            >
              Track your shipment →
            </button>
          </div>
        </Container>
      </section>

      {/* Main Footer */}
      <footer className='bg-white py-12 md:py-16 lg:py-20 border-b border-gray-200'>
        <Container>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8'>
            {/* Logo & Tagline */}
            <div>
              <div className='mb-6'>
                <OPSLogo />
              </div>
              <p className='text-sm md:text-base leading-relaxed' style={{ color: '#1A1A1A', fontFamily: 'Barlow, sans-serif' }}>
                Delivering excellence worldwide. Air, sea, road and rail freight to over 220 countries and territories.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className='text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8' style={{ color: '#0B2C5F', fontFamily: 'Poppins, sans-serif' }}>
                SERVICES
              </h4>
              <ul className='space-y-3 md:space-y-4'>
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href={service.href}
                      className='text-sm md:text-base transition-colors hover:opacity-70'
                      style={{ color: '#0B2C5F', fontFamily: 'Barlow, sans-serif' }}
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className='text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8' style={{ color: '#0B2C5F', fontFamily: 'Poppins, sans-serif' }}>
                COMPANY / ORGANIZATION
              </h4>
              <ul className='space-y-3 md:space-y-4'>
                {company.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className='text-sm md:text-base transition-colors hover:opacity-70'
                      style={{ color: '#0B2C5F', fontFamily: 'Barlow, sans-serif' }}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className='text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8' style={{ color: '#0B2C5F', fontFamily: 'Poppins, sans-serif' }}>
                AIDE
              </h4>
              <ul className='space-y-3 md:space-y-4'>
                {support.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className='text-sm md:text-base transition-colors hover:opacity-70'
                      style={{ color: '#0B2C5F', fontFamily: 'Barlow, sans-serif' }}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </footer>

      {/* Copyright Bar */}
      <section className='py-6 md:py-4' style={{ backgroundColor: '#0B2C5F' }}>
        <Container>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <p className='text-xs md:text-sm' style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Barlow, sans-serif' }}>
              © 2026 OPS Logistics. All rights reserved.
            </p>
            <div className='w-20'>
              <OPSLogo />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
