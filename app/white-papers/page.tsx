'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'White Papers - OPS Logistics',
  description: 'In-depth research and insights on logistics, supply chain management, and global shipping trends.',
};

export default function WhitePapersPage() {
  const whitePapers = [
    {
      id: 1,
      title: 'Global Supply Chain Optimization: Best Practices for 2025',
      description: 'Comprehensive guide to optimizing your supply chain operations with actionable strategies for cost reduction and efficiency.',
      image: '/images/white-papers/Longer than a blog post, because the answer is..webp',
      downloadUrl: '#',
      readTime: '15 min read',
    },
    {
      id: 2,
      title: 'Cold Chain Logistics: Maintaining Quality in Healthcare Distribution',
      description: 'Explore the complexities of temperature-controlled logistics and how to ensure compliance across global shipments.',
      image: '/images/cold-chain/If it was not recorded, it did not stay cold.webp',
      downloadUrl: '#',
      readTime: '12 min read',
    },
    {
      id: 3,
      title: 'E-Commerce Fulfillment in 2025: Meeting Customer Expectations',
      description: 'Learn how to optimize last-mile delivery and customer satisfaction in the rapidly evolving e-commerce landscape.',
      image: '/images/ecommerce/Where the margin quietly leaves.webp',
      downloadUrl: '#',
      readTime: '10 min read',
    },
    {
      id: 4,
      title: 'Customs Compliance: Tariff Updates and Trade Policy Impact',
      description: 'Navigate the latest tariff changes and trade policies affecting international shipments and customs clearance.',
      image: '/images/customs/The part that saves money rather than time.webp',
      downloadUrl: '#',
      readTime: '18 min read',
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <div className='max-w-3xl'>
            <h1 className='text-h1 font-bold mb-6'>White Papers & Research</h1>
            <p className='text-lg text-white/90 mb-8'>
              Explore in-depth research, industry insights, and strategic recommendations from our logistics experts.
            </p>
          </div>
        </Container>
      </section>

      {/* White Papers Grid */}
      <section className='py-section-lg'>
        <Container>
          <div className='grid md:grid-cols-2 gap-8'>
            {whitePapers.map((paper) => (
              <div key={paper.id} className='bg-white border border-border rounded-card overflow-hidden hover:shadow-deep transition-all duration-300'>
                <div className='h-48 bg-light-gray flex items-center justify-center overflow-hidden'>
                  <img
                    src={paper.image}
                    alt={paper.title}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className='p-6'>
                  <p className='text-sm text-primary font-bold mb-2 uppercase tracking-wider'>{paper.readTime}</p>
                  <h3 className='text-h4 font-bold text-text-primary mb-4 leading-tight'>{paper.title}</h3>
                  <p className='text-text-secondary mb-6 text-sm leading-relaxed'>{paper.description}</p>
                  <Button href={paper.downloadUrl} className='w-full bg-primary text-white hover:bg-primary/90'>
                    Download White Paper
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='py-section-lg bg-light-blue'>
        <Container>
          <div className='text-center max-w-2xl mx-auto'>
            <h2 className='text-h2 font-bold mb-6 text-text-primary'>Need more insights?</h2>
            <p className='text-lg text-text-secondary mb-8'>
              Subscribe to our research newsletter for the latest supply chain insights and industry analysis.
            </p>
            <div className='flex gap-4 justify-center'>
              <input
                type='email'
                placeholder='Enter your email'
                className='px-6 py-3 border border-border rounded-lg flex-1 max-w-xs focus:outline-none focus:border-primary'
              />
              <Button className='bg-primary text-white hover:bg-primary/90'>Subscribe</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
