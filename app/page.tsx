import Hero from '@/components/sections/Hero';
import TradeAdvisorySection from '@/components/sections/TradeAdvisorySection';
import ShippingContainersForSaleSection from '@/components/sections/ShippingContainersForSaleSection';
import DocumentAndParcelSection from '@/components/sections/DocumentAndParcelSection';
import RetailerVolumeShippingSection from '@/components/sections/RetailerVolumeShippingSection';
import CargoShippingSection from '@/components/sections/CargoShippingSection';
import EnterpriseLogisticsSection from '@/components/sections/EnterpriseLogisticsSection';
import OPSForYourBusinessBanner from '@/components/sections/OPSForYourBusinessBanner';
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

      {/* 7. Enterprise Logistics Services */}
      <EnterpriseLogisticsSection />

      {/* 8. OPS for Your Business Banner */}
      <OPSForYourBusinessBanner />

      {/* 9. Service Updates */}
      <ServiceUpdatesSection />

      {/* 10. Three Action Cards */}
      <FeatureCards />

      {/* 11. Commercial Advice */}
      <CommercialAdviceSection />


      {/* Footer */}
      <footer className='py-12 md:py-16 lg:py-20 bg-navy text-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-center'>
          <p className='text-sm md:text-base text-white/80'>© 2026 OPS Logistics. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
