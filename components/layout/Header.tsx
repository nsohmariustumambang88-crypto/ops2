'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Track', href: '#' },
    { label: 'Ship', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Customer Service', href: '#' },
  ];

  return (
    <header className='sticky top-0 z-50 bg-white border-b border-border shadow-light'>
      <Container>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center font-bold text-xl text-primary'>
            <span className='text-2xl font-bold'>OPS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className='text-text-secondary hover:text-primary transition-colors font-medium'
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className='hidden md:flex items-center gap-4'>
            <button className='p-2 hover:bg-light-gray rounded-lg transition-colors'>
              {/* Search Icon */}
              <svg className='w-5 h-5 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </button>
            <button className='text-primary font-medium hover:underline'>
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className='w-6 h-6 text-text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className='md:hidden py-4 border-t border-border'>
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className='block py-2 text-text-secondary hover:text-primary transition-colors font-medium'
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
