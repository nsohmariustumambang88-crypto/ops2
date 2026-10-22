'use client';

import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { animateFadeInUp } from '@/lib/animations';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateFadeInUp(sectionRef.current);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section ref={sectionRef} className='py-section-lg bg-white'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-16'>
            <p className='text-primary font-bold text-sm mb-4 uppercase tracking-wider'>Get In Touch</p>
            <h2 className='text-h2 font-extrabold mb-6 text-text-primary'>Request a Free Consultation</h2>
            <p className='text-body text-text-secondary max-w-2xl mx-auto'>
              Have questions about our logistics solutions? Our team of experts is ready to help optimize your supply chain. Fill out the form below and we'll be in touch within 24 hours.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12'>
            <div className='text-center'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <h3 className='font-bold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base'>Email</h3>
              <p className='text-text-secondary text-xs sm:text-sm'>contact@opslogistics.com</p>
            </div>

            <div className='text-center'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <h3 className='font-bold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base'>Phone</h3>
              <p className='text-text-secondary text-xs sm:text-sm'>+1 (800) 555-0123</p>
            </div>

            <div className='text-center sm:col-span-2 lg:col-span-1'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <h3 className='font-bold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base'>Headquarters</h3>
              <p className='text-text-secondary text-xs sm:text-sm'>1234 Logistics Drive<br />Global City, GC 12345</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='bg-light-blue rounded-lg p-6 sm:p-8 md:p-12 border border-gray-200'>
            {submitted && (
              <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-green-800 font-semibold'>✓ Thank you! We've received your message and will be in touch shortly.</p>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
              <div>
                <label className='block text-xs sm:text-sm font-bold text-text-primary mb-1 sm:mb-2'>Full Name *</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  placeholder='Your name'
                />
              </div>

              <div>
                <label className='block text-xs sm:text-sm font-bold text-text-primary mb-1 sm:mb-2'>Email Address *</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  placeholder='your@email.com'
                />
              </div>

              <div>
                <label className='block text-xs sm:text-sm font-bold text-text-primary mb-1 sm:mb-2'>Company</label>
                <input
                  type='text'
                  name='company'
                  value={formData.company}
                  onChange={handleChange}
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  placeholder='Your company'
                />
              </div>

              <div>
                <label className='block text-xs sm:text-sm font-bold text-text-primary mb-1 sm:mb-2'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  placeholder='+1 (800) 555-0123'
                />
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-xs sm:text-sm font-bold text-text-primary mb-1 sm:mb-2'>Subject *</label>
              <select
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                required
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
              >
                <option value=''>Select a subject...</option>
                <option value='shipping'>Shipping Solutions</option>
                <option value='cold-chain'>Cold Chain Logistics</option>
                <option value='customs'>Customs & Compliance</option>
                <option value='last-mile'>Last Mile Delivery</option>
                <option value='partnership'>Partnership Opportunity</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className='mb-8'>
              <label className='block text-xs sm:text-sm font-bold text-text-primary mb-1 sm:mb-2'>Message *</label>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                placeholder='Tell us about your logistics needs...'
              />
            </div>

            <button
              type='submit'
              className='w-full px-6 sm:px-8 py-2 sm:py-3 bg-primary text-white font-bold text-sm sm:text-base rounded-button hover:bg-primary/90 transition-colors'
            >
              Send Message
            </button>

            <p className='text-xs sm:text-xs text-text-secondary text-center mt-4'>
              * Required fields. We respect your privacy and will only use your information to respond to your inquiry.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
