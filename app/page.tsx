import Hero from '@/components/sections/Hero';
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

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Three Action Cards */}
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
      <div className='bg-primary text-white py-section-lg'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          <div className='order-1 lg:order-1'>
            <div className='w-full h-64 md:h-80 bg-white/10 rounded-lg flex items-center justify-center'>
              <span className='text-white/50 text-sm'>OPS for your business Image</span>
            </div>
          </div>
          <div className='order-2 lg:order-2'>
            <h2 className='text-h2 font-bold mb-6 text-white'>OPS for your business</h2>
            <p className='text-base md:text-lg text-white/90 mb-8'>
              Boost your small and medium-sized business's success with world-class shipping and logistics services. Our team of experts can help you meet your customers' ever-changing needs.
            </p>
            <button className='px-8 py-3 bg-white text-primary font-bold rounded-button hover:bg-gray-100 transition-colors'>
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
    </>
  );
}
