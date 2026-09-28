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
    { label: 'Estimation', icon: 'calendar', href: '#' },
    { label: 'Ship now', icon: 'bolt', href: '#' },
    { label: 'Request a business account', icon: 'bolt', href: '#' },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'calendar':
        return (
          <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
        );
      case 'bolt':
        return (
          <svg className='w-5 h-5 text-primary' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M13 10V3L4 14h7v7l9-11h-7z' />
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
      <header className='sticky top-0 z-50 bg-navy text-white'>
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
                    <div className='absolute left-0 mt-0 w-72 bg-white rounded-lg shadow-deep opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden'>
                      {/* Header */}
                      <div className='bg-white px-6 py-4 border-b border-gray-200'>
                        <h3 className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Delivery Start Date</h3>
                      </div>

                      {/* Options */}
                      <div className='py-2'>
                        {shipOptions.map((option) => (
                          <Link
                            key={option.label}
                            href={option.href}
                            className='flex items-center gap-4 px-6 py-4 text-primary hover:bg-blue-50 transition-colors group/option'
                          >
                            {getIcon(option.icon)}
                            <span className='text-sm font-medium flex-1 text-primary'>{option.label}</span>
                            <svg className='w-4 h-4 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side - Customer Portal */}
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors'>
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
