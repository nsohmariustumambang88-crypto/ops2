'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShipDropdownOpen, setIsShipDropdownOpen] = useState(false);

  const navigationItems = [
    { label: 'Follow', href: '#' },
    { label: 'SHIP', href: '#', hasDropdown: true },
    { label: 'Enterprise logistics services', href: '#', hasDropdown: true },
    { label: 'Service Clients', href: '#' },
  ];

  const shipOptions = [
    { label: 'Get a Quote', icon: 'quote', href: '#' },
    { label: 'Ship Now', icon: 'ship', href: '#' },
    { label: 'Request a Business Account', icon: 'account', href: '#' },
  ];

  const enterpriseOptions = {
    solutions: [
      { label: 'Contract Logistics', href: '#' },
      { label: 'E-Commerce Fulfillment', href: '#' },
      { label: 'Customs & Compliance', href: '#' },
      { label: 'Cold Chain Logistics', href: '#' },
      { label: 'Last Mile Delivery', href: '#' },
    ],
    industries: [
      { label: 'Technology', href: '#' },
      { label: 'Healthcare & Life Sciences', href: '#' },
      { label: 'Retail & Fashion', href: '#' },
      { label: 'Automotive', href: '#' },
      { label: 'Energy & Utilities', href: '#' },
    ],
    resources: [
      { label: 'Case Studies', href: '#' },
      { label: 'White Papers', href: '#' },
      { label: 'Logistics Insights Blog', href: '#' },
      { label: 'Tariff Updates', href: '#' },
    ],
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'quote':
        return (
          <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
        );
      case 'ship':
        return (
          <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
          </svg>
        );
      case 'account':
        return (
          <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className='bg-white border-b border-border'>
        <Container>
          <div className='flex items-center justify-between h-14'>
            {/* Logo */}
            <Link href='/' className='flex items-center'>
              <span className='text-2xl font-bold text-primary'>OPS<br />LOGISTICS</span>
            </Link>

            {/* Right side */}
            <div className='hidden md:flex items-center gap-6'>
              <button className='p-2 hover:bg-light-gray rounded-lg transition-colors'>
                <svg className='w-5 h-5 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2h1.055M8 16H6a2 2 0 01-2-2v-2a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2h-2.055M15 12H17' />
                </svg>
              </button>
              <button className='text-text-secondary hover:text-primary font-medium text-sm'>To research</button>
              <button className='flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-light-gray transition-colors'>
                <span className='w-4 h-4 bg-red-600 rounded-sm'></span>
                <span className='text-text-secondary text-sm font-medium'>Cameroon</span>
                <svg className='w-4 h-4 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Navigation Bar */}
      <header className='sticky top-0 z-50 bg-blue-900' style={{ backgroundColor: '#0B2C5F' }}>
        <Container>
          <div className='flex items-center justify-between h-16'>
            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center gap-8'>
              {navigationItems.map((item) => (
                <div key={item.label} className='relative group'>
                  <button
                    className='text-white hover:text-blue-400 transition-colors font-medium flex items-center gap-2 text-sm'
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg className='w-4 h-4 transition-transform group-hover:rotate-180' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                      </svg>
                    )}
                  </button>

                  {item.label === 'SHIP' && item.hasDropdown && (
                    <div className='fixed left-0 right-0 mt-0 bg-white shadow-deep opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                      <div className='max-w-7xl mx-auto'>
                        {/* Header */}
                        <div className='px-4 sm:px-6 md:px-8 py-4 border-b border-gray-200'>
                          <h3 className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Start Shipping</h3>
                        </div>

                        {/* Options */}
                        <div className='py-2'>
                          {shipOptions.map((option) => (
                            <Link
                              key={option.label}
                              href={option.href}
                              className='block px-4 sm:px-6 md:px-8 py-4 text-primary hover:bg-blue-50 transition-colors'
                            >
                              <div className='flex items-center gap-4'>
                                {getIcon(option.icon)}
                                <span className='text-sm font-medium flex-1 text-primary'>{option.label}</span>
                                <svg className='w-4 h-4 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.label === 'Enterprise logistics services' && item.hasDropdown && (
                    <div className='fixed left-0 right-0 mt-0 bg-white shadow-deep opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                      <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8'>
                        <div className='grid grid-cols-4 gap-8'>
                        {/* Left Column */}
                        <div>
                          <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-4'>Enterprise Logistics Services</h3>
                          <p className='text-sm text-gray-600 mb-6'>Our Supply Chain division creates custom solutions for enterprise-sized organizations. The perfect fit as your outsourced logistics provider (3PL).</p>
                          <button className='bg-primary text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors'>
                            Explore OPS Supply Chain
                          </button>
                        </div>

                        {/* Solutions Column */}
                        <div>
                          <h4 className='text-xs font-bold text-primary uppercase tracking-widest mb-4'>Solutions</h4>
                          <div className='space-y-3'>
                            {enterpriseOptions.solutions.map((option) => (
                              <Link
                                key={option.label}
                                href={option.href}
                                className='flex items-center justify-between text-gray-700 hover:text-primary transition-colors group/option'
                              >
                                <span className='text-sm font-medium'>{option.label}</span>
                                <svg className='w-4 h-4 text-primary opacity-0 group-hover/option:opacity-100 transition-opacity' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Industries Column */}
                        <div>
                          <h4 className='text-xs font-bold text-primary uppercase tracking-widest mb-4'>Industries</h4>
                          <div className='space-y-3'>
                            {enterpriseOptions.industries.map((option) => (
                              <Link
                                key={option.label}
                                href={option.href}
                                className='flex items-center justify-between text-gray-700 hover:text-primary transition-colors group/option'
                              >
                                <span className='text-sm font-medium'>{option.label}</span>
                                <svg className='w-4 h-4 text-primary opacity-0 group-hover/option:opacity-100 transition-opacity' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Resources Column */}
                        <div>
                          <h4 className='text-xs font-bold text-primary uppercase tracking-widest mb-4'>Resources</h4>
                          <div className='space-y-3'>
                            {enterpriseOptions.resources.map((option) => (
                              <Link
                                key={option.label}
                                href={option.href}
                                className='flex items-center justify-between text-gray-700 hover:text-primary transition-colors group/option'
                              >
                                <span className='text-sm font-medium'>{option.label}</span>
                                <svg className='w-4 h-4 text-primary opacity-0 group-hover/option:opacity-100 transition-opacity' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side - Customer Portal */}
            <button className='text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors' style={{ backgroundColor: '#1173D4' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0B5AA8'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1173D4'}>
              Customer portal logins
            </button>

            {/* Mobile Menu Button */}
            <button
              className='md:hidden p-2'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className='md:hidden py-4 border-t border-white/20'>
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsShipDropdownOpen(!isShipDropdownOpen)}
                        className='w-full text-left py-2 text-white hover:text-blue-400 transition-colors font-medium flex items-center justify-between text-sm'
                      >
                        {item.label}
                        <svg className={`w-4 h-4 transition-transform ${isShipDropdownOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                        </svg>
                      </button>
                      {isShipDropdownOpen && (
                        <div className='pl-4 py-2'>
                          {shipOptions.map((option) => (
                            <Link
                              key={option.label}
                              href={option.href}
                              className='flex items-center gap-3 py-2 text-white/80 hover:text-blue-400 transition-colors font-medium text-sm'
                            >
                              {getIcon(option.icon)}
                              {option.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className='block py-2 text-white hover:text-blue-400 transition-colors font-medium text-sm'
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          )}
        </Container>
      </header>
    </>
  );
}
