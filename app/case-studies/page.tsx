'use client';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: 1,
      title: '40% Reduction in Shipping Costs',
      company: 'Global E-Commerce Retailer',
      result: '$2.3M annual savings',
      description: 'By consolidating shipments and optimizing routes through our logistics platform, this major retailer reduced per-shipment costs while maintaining faster delivery times.',
      image: '/images/case-studies/54414110-760f-460c-8337-7ec8b07718cd 4th pic place holder.webp',
      industry: 'E-Commerce',
      challenges: ['High shipping costs', 'Inefficient routing', 'Limited visibility'],
      solutions: ['Route optimization', 'Shipment consolidation', 'Real-time tracking'],
    },
    {
      id: 2,
      title: '99.7% On-Time Delivery Rate',
      company: 'European Healthcare Distributor',
      result: 'Achieved compliance excellence',
      description: 'Through specialized cold chain management and real-time tracking, we ensured pharmaceutical shipments arrived exactly on schedule with complete chain-of-custody documentation.',
      image: '/images/case-studies/dbe36e5e-f829-411c-aaac-4ed575de54e7 2nd pic holder.webp',
      industry: 'Healthcare',
      challenges: ['Temperature control', 'Compliance requirements', 'Time-sensitive deliveries'],
      solutions: ['Cold chain logistics', 'Compliance tracking', '24/7 monitoring'],
    },
    {
      id: 3,
      title: 'Scaled to 50+ Countries in 18 Months',
      company: 'Technology Hardware Manufacturer',
      result: 'Entered new markets rapidly',
      description: 'Our global forwarding network and customs expertise enabled rapid market expansion with zero customs delays or compliance issues across new territories.',
      image: '/images/case-studies/Three problems we were brought in on.webp',
      industry: 'Technology',
      challenges: ['Global expansion', 'Customs complexity', 'Market entry risk'],
      solutions: ['Global network', 'Customs expertise', 'Market entry support'],
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='py-section-lg bg-gradient-to-b from-navy to-navy/80 text-white'>
        <Container>
          <div className='max-w-3xl'>
            <h1 className='text-h1 font-bold mb-6'>Success Stories</h1>
            <p className='text-lg text-white/90 mb-8'>
              Discover how leading companies across industries have transformed their supply chains with OPS Logistics solutions.
            </p>
          </div>
        </Container>
      </section>

      {/* Case Studies Grid */}
      <section className='py-section-lg'>
        <Container>
          <div className='space-y-16'>
            {caseStudies.map((study, idx) => (
              <div key={study.id} className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:[&>*]:order-1' : ''}`}>
                {/* Image */}
                <div className='h-80 bg-light-gray rounded-xl overflow-hidden flex items-center justify-center'>
                  <img
                    src={study.image}
                    alt={study.title}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <span className='inline-block px-4 py-2 bg-light-blue rounded-full text-primary font-bold text-sm mb-4'>
                    {study.industry}
                  </span>
                  <h2 className='text-h2 font-bold mb-2 text-text-primary'>{study.title}</h2>
                  <p className='text-lg font-bold text-primary mb-4'>{study.result}</p>
                  <p className='text-text-secondary mb-6 leading-relaxed'>{study.description}</p>

                  {/* Challenges and Solutions */}
                  <div className='grid md:grid-cols-2 gap-6 mb-8'>
                    <div>
                      <h4 className='font-bold text-text-primary mb-3'>Challenges</h4>
                      <ul className='space-y-2'>
                        {study.challenges.map((challenge, i) => (
                          <li key={i} className='flex items-start gap-2 text-text-secondary'>
                            <span className='text-primary font-bold mt-1'>•</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className='font-bold text-text-primary mb-3'>Our Solutions</h4>
                      <ul className='space-y-2'>
                        {study.solutions.map((solution, i) => (
                          <li key={i} className='flex items-start gap-2 text-text-secondary'>
                            <span className='text-primary font-bold mt-1'>✓</span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h4 className='font-bold text-text-primary mb-2'>Client</h4>
                  <p className='text-text-secondary mb-6'>{study.company}</p>

                  <Button href='#' className='bg-primary text-white hover:bg-primary/90'>
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className='py-section-lg bg-navy text-white'>
        <Container>
          <div className='grid md:grid-cols-4 gap-8 text-center'>
            {[
              { number: '50+', label: 'Case Studies' },
              { number: '$2.3B', label: 'Total Savings' },
              { number: '200+', label: 'Companies Helped' },
              { number: '99.7%', label: 'Success Rate' },
            ].map((stat, i) => (
              <div key={i}>
                <p className='text-4xl font-bold text-primary mb-2'>{stat.number}</p>
                <p className='text-white/80'>{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='py-section-lg bg-primary text-white'>
        <Container>
          <div className='text-center max-w-2xl mx-auto'>
            <h2 className='text-h2 font-bold mb-6'>Ready to transform your supply chain?</h2>
            <p className='text-lg mb-8 text-white/90'>
              Join hundreds of leading companies optimizing their logistics with OPS.
            </p>
            <Button href='/' className='bg-white text-primary hover:bg-gray-100'>
              Get Started Today
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
