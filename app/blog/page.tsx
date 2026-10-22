'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: 'Navigating Global Trade Policy Changes in 2025',
      excerpt: 'Explore how recent tariff updates and trade policy shifts are impacting international logistics and supply chains.',
      category: 'Trade Policy',
      date: 'October 5, 2025',
      readTime: '5 min',
      image: '/images/customs/Send us a code you are unsure about..webp',
      slug: 'trade-policy-2025',
    },
    {
      id: 2,
      title: 'Cold Chain Innovation: Technology Trends Transforming Healthcare Logistics',
      excerpt: 'Discover cutting-edge technologies and best practices keeping pharmaceutical shipments in perfect condition.',
      category: 'Healthcare',
      date: 'October 1, 2025',
      readTime: '7 min',
      image: '/images/healthcare/Stock that circulates instead of selling.webp',
      slug: 'cold-chain-innovation',
    },
    {
      id: 3,
      title: 'E-Commerce Shipping: Meeting Customer Expectations in the Last Mile',
      excerpt: 'How to optimize last-mile delivery and provide the seamless experience modern customers demand.',
      category: 'E-Commerce',
      date: 'September 28, 2025',
      readTime: '6 min',
      image: '/images/ecommerce/Your customer is judging us, and blaming you..webp',
      slug: 'ecommerce-last-mile',
    },
    {
      id: 4,
      title: 'Automotive Supply Chain Resilience: Managing Complex Global Networks',
      excerpt: 'Strategies for building robust automotive supply chains in an increasingly complex global environment.',
      category: 'Automotive',
      date: 'September 25, 2025',
      readTime: '8 min',
      image: '/images/automotive/Batteries are the hardest thing in the vehicle to move.webp',
      slug: 'automotive-resilience',
    },
    {
      id: 5,
      title: 'Retail Logistics: From Warehouse to Customer in 24 Hours',
      excerpt: 'Achieving rapid fulfillment speeds while maintaining cost efficiency in modern retail logistics.',
      category: 'Retail',
      date: 'September 20, 2025',
      readTime: '6 min',
      image: '/images/retail/Fashion returns are not an exception, they are the model.webp',
      slug: 'retail-logistics',
    },
    {
      id: 6,
      title: 'Sustainability in Logistics: Green Solutions for Global Shipping',
      excerpt: 'How companies are reducing their carbon footprint while maintaining competitive shipping speeds.',
      category: 'Sustainability',
      date: 'September 15, 2025',
      readTime: '9 min',
      image: '/images/energy/The long tail nobody plans for.webp',
      slug: 'sustainability-logistics',
    },
  ];

  const categories = ['All', 'Supply Chain', 'Technology', 'Trade Policy', 'Healthcare', 'E-Commerce', 'Automotive', 'Retail'];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <div className='max-w-3xl'>
            <h1 className='text-h1 font-bold mb-6'>Logistics Insights</h1>
            <p className='text-lg text-white/90'>
              Stay updated with the latest trends, insights, and best practices in global supply chain management.
            </p>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className='py-section-lg'>
        <Container>
          {/* Category Filter */}
          <div className='mb-12 flex flex-wrap gap-3'>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  cat === 'All'
                    ? 'bg-primary text-white'
                    : 'bg-light-gray text-text-secondary hover:bg-light-blue hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className='grid md:grid-cols-3 gap-5 mb-12'>
            {articles.map((article) => (
              <div
                key={article.id}
                className='bg-white border border-border rounded-xl overflow-hidden hover:shadow-deep transition-all duration-300 group cursor-pointer'
              >
                <div className='aspect-[3/2] bg-light-gray overflow-hidden'>
                  <img
                    src={article.image}
                    alt={article.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className='px-6 pt-6 pb-7'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='px-3 py-1 bg-light-blue text-primary rounded-full text-xs font-bold uppercase tracking-wider'>
                      {article.category}
                    </span>
                    <span className='text-xs text-text-secondary'>{article.readTime}</span>
                  </div>
                  <h3 className='text-[15px] font-extrabold text-text-primary mb-3 leading-snug group-hover:text-primary transition-colors'>
                    {article.title}
                  </h3>
                  <p className='text-text-secondary text-sm mb-4 leading-relaxed'>{article.excerpt}</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-text-secondary'>{article.date}</span>
                    <svg className='w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className='text-center'>
            <Button href='#' className='bg-primary text-white hover:bg-primary/90'>
              Load More Articles
            </Button>
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className='py-section-lg bg-navy text-white'>
        <Container>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-h2 font-bold mb-4'>Subscribe to Our Newsletter</h2>
            <p className='text-white/80 mb-8'>Get weekly insights delivered to your inbox on logistics trends and supply chain best practices.</p>
            <div className='flex gap-3 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-4 py-3 rounded-lg text-text-primary focus:outline-none focus:border-primary'
              />
              <Button className='bg-primary text-white hover:bg-primary/90'>Subscribe</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
