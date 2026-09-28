import Hero from '@/components/sections/Hero';
import TradeAdvisorySection from '@/components/sections/TradeAdvisorySection';
import ShippingContainersForSaleSection from '@/components/sections/ShippingContainersForSaleSection';
import DocumentAndParcelSection from '@/components/sections/DocumentAndParcelSection';
import RetailerVolumeShippingSection from '@/components/sections/RetailerVolumeShippingSection';
import CargoShippingSection from '@/components/sections/CargoShippingSection';
import FeatureCards from '@/components/sections/FeatureCards';
import CommercialAdviceSection from '@/components/sections/CommercialAdviceSection';
import ShippingContainersSection from '@/components/sections/ShippingContainersSection';
import ContentSection from '@/components/sections/ContentSection';
import NewsCardsSection from '@/components/sections/NewsCardsSection';
import ServiceUpdatesSection from '@/components/sections/ServiceUpdatesSection';
import StatsSection from '@/components/sections/StatsSection';
import WhyOPSSection from '@/components/sections/WhyOPSSection';
import SupplyChainSection from '@/components/sections/SupplyChainSection';
import CTABannerSection from '@/components/sections/CTABannerSection';
import IndustrySolutionsSection from '@/components/sections/IndustrySolutionsSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import ColdChainSection from '@/components/sections/ColdChainSection';
import LastMileSection from '@/components/sections/LastMileSection';
import GlobalReachSection from '@/components/sections/GlobalReachSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import TrustSignalsSection from '@/components/sections/TrustSignalsSection';
import PartnersSection from '@/components/sections/PartnersSection';
import ContactFormSection from '@/components/sections/ContactFormSection';

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trade Advisory */}
      <TradeAdvisorySection />

      {/* 3. Shipping Containers For Sale */}
      <ShippingContainersForSaleSection />

      {/* 4. Document and Parcel Shipping */}
      <DocumentAndParcelSection />

      {/* 5. Retailer or Volume Shipping */}
      <RetailerVolumeShippingSection />

      {/* 6. Cargo Shipping */}
      <CargoShippingSection />

      {/* 7. Three Action Cards */}
      <FeatureCards />

      {/* 3. Commercial Advice */}
      <CommercialAdviceSection />

      {/* 4. Shipping Containers */}
      <ShippingContainersSection />

      {/* 5. Express Shipping - Shipping Documents and Parcels */}
      <ContentSection
        title="Shipping documents and parcels"
        description="For all shippers: Learn more about OPS Express - the undisputed global leader in international express shipping."
        imageUrl="https://images.unsplash.com/photo-1578194587220-8c58ee13c3d7?w=600&h=450&fit=crop"
        imagePosition="right"
        backgroundColor="white"
        cta={{ text: 'Explore OPS Express', href: '#' }}
      />

      {/* 6. E-Commerce Shipping */}
      <ContentSection
        title="Shipping to the retailer or in bulk"
        description="FOR PROFESSIONAL USE ONLY: We have two divisions that offer reliable commercial shipping for e-commerce, supplier, or manufacturing companies."
        imageUrl="https://images.unsplash.com/photo-1586528116039-c48148d8e98f?w=600&h=450&fit=crop"
        imagePosition="left"
        backgroundColor="light"
        cta={{ text: 'Learn More', href: '#' }}
      />

      {/* 7. Bulk Maritime Transport */}
      <ContentSection
        title="bulk maritime transport"
        description="FOR PROFESSIONAL USE ONLY: Discover the shipping and logistics service options of OPS Global Forwarding."
        imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=450&fit=crop"
        imagePosition="right"
        backgroundColor="white"
        cta={{ text: 'Explore OPS Global Forwarding', href: '#' }}
      />

      {/* 8. Enterprise Logistics Services */}
      <ContentSection
        title="Enterprise Logistics Services"
        description="FOR PROFESSIONAL USE ONLY: Discover how OPS Supply Chain can revolutionize your business as a 3PL provider."
        imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=450&fit=crop"
        imagePosition="left"
        backgroundColor="light"
        cta={{ text: 'Explore the OPS supply chain', href: '#' }}
      />

      {/* 9. OPS for Your Business */}
      <div className='bg-primary text-white py-16 sm:py-20 md:py-24 lg:py-32'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center'>
          <div className='order-1 lg:order-1'>
            <div className='w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-white/10 rounded-lg flex items-center justify-center'>
              <span className='text-white/50 text-xs sm:text-sm'>OPS for your business Image</span>
            </div>
          </div>
          <div className='order-2 lg:order-2'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white'>OPS for your business</h2>
            <p className='text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed'>
              Boost your small and medium-sized business's success with world-class shipping and logistics services. Our team of experts can help you meet your customers' ever-changing needs.
            </p>
            <button className='px-6 sm:px-8 py-2 sm:py-3 bg-white text-primary font-bold text-sm sm:text-base rounded-button hover:bg-gray-100 transition-colors'>
              Discover our business solutions
            </button>
          </div>
        </div>
      </div>

      {/* 10. Service Updates */}
      <ServiceUpdatesSection />

      {/* 11. News Cards */}
      <NewsCardsSection />

      {/* 12. Stats Section */}
      <StatsSection />

      {/* 13. Why OPS Logistics */}
      <WhyOPSSection />

      {/* 14. Supply Chain Solutions */}
      <SupplyChainSection />

      {/* 15. CTA Banner */}
      <CTABannerSection />

      {/* 16. Industry Solutions */}
      <IndustrySolutionsSection />

      {/* 17. Case Studies */}
      <CaseStudiesSection />

      {/* 18. Cold Chain Specialty */}
      <ColdChainSection />

      {/* 19. Last Mile Delivery */}
      <LastMileSection />

      {/* 20. Global Reach */}
      <GlobalReachSection />

      {/* 21. Testimonials */}
      <TestimonialsSection />

      {/* 22. Trust Signals */}
      <TrustSignalsSection />

      {/* 23. Integration Partners */}
      <PartnersSection />

      {/* 24. FAQ Section */}
      <FAQSection />

      {/* 25. Contact Form */}
      <ContactFormSection />

      {/* 26. Features/Benefits Section */}
      <section className='py-16 sm:py-20 md:py-24 lg:py-32 bg-navy text-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10'>
          <div className='text-center mb-12 sm:mb-16 max-w-3xl mx-auto'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4'>Why logistics partners choose us</h2>
            <p className='text-xs sm:text-sm md:text-base lg:text-lg text-white/80'>Industry-leading reliability, transparency, and expertise</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8'>
            {[
              { title: '220+ Countries', desc: 'Global network reach' },
              { title: '24/7 Support', desc: 'Round-the-clock assistance' },
              { title: '99.2% On-Time', desc: 'Delivery reliability' },
              { title: 'Real-Time Tracking', desc: 'Complete visibility' },
              { title: '4 Freight Modes', desc: 'Air, sea, road, rail' },
              { title: 'Custom Solutions', desc: 'Tailored to your needs' },
            ].map((item, i) => (
              <div key={i} className='text-center'>
                <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-2'>{item.title}</h3>
                <p className='text-white/70 text-xs sm:text-sm md:text-base'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 27. Final CTA */}
      <section className='py-16 sm:py-20 md:py-24 lg:py-32 bg-primary text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-center'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>Ready to optimize your supply chain?</h2>
          <p className='text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto'>
            Join thousands of companies using OPS Logistics to streamline their shipping operations.
          </p>
          <button className='px-6 sm:px-8 py-2 sm:py-3 md:py-4 bg-white text-primary font-bold text-sm sm:text-base rounded-button hover:bg-gray-100 transition-all'>
            Get Started Today
          </button>
        </div>
      </section>
    </>
  );
}
