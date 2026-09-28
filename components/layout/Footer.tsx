import Container from '@/components/ui/Container';
import Link from 'next/link';

export default function Footer() {
  const footerSections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog'],
    },
    {
      title: 'Services',
      links: ['OPS Express', 'OPS eCommerce', 'Global Forwarding', 'Supply Chain'],
    },
    {
      title: 'Support',
      links: ['Help & FAQ', 'Contact Us', 'Service Updates', 'Support Portal'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookies', 'Accessibility'],
    },
  ];

  return (
    <footer className='bg-navy text-white py-16'>
      <Container>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          {/* Company Info */}
          <div>
            <h3 className='text-xl font-bold mb-4'>OPS Logistics</h3>
            <p className='text-white/70 text-sm leading-relaxed'>
              Delivering excellence worldwide with reliable logistics solutions for businesses of all sizes.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className='text-base font-semibold mb-4'>{section.title}</h4>
              <ul className='space-y-2'>
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href='#'
                      className='text-white/70 hover:text-white transition-colors text-sm'
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-white/70 text-sm'>
            &copy; 2024 OPS Logistics. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <Link href='#' className='text-white/70 hover:text-white transition-colors'>
              {/* LinkedIn Icon */}
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
              </svg>
            </Link>
            <Link href='#' className='text-white/70 hover:text-white transition-colors'>
              {/* Twitter Icon */}
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z' />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
