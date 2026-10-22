import Hero from '@/components/sections/Hero';
import TradeAdvisorySection from '@/components/sections/TradeAdvisorySection';
import ShippingContainersForSaleSection from '@/components/sections/ShippingContainersForSaleSection';
import DocumentAndParcelSection from '@/components/sections/DocumentAndParcelSection';
import RetailerVolumeShippingSection from '@/components/sections/RetailerVolumeShippingSection';
import CargoShippingSection from '@/components/sections/CargoShippingSection';
import EnterpriseLogisticsSection from '@/components/sections/EnterpriseLogisticsSection';
import OPSForYourBusinessBanner from '@/components/sections/OPSForYourBusinessBanner';
import ServiceUpdatesSection from '@/components/sections/ServiceUpdatesSection';
import WhyOPSLogisticsSection from '@/components/sections/WhyOPSLogisticsSection';
import SupplyChainSolutionsSection from '@/components/sections/SupplyChainSolutionsSection';
import NewsCardsSection from '@/components/sections/NewsCardsSection';
import StatsSection from '@/components/sections/StatsSection';

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

      {/* 10. News Cards */}
      <NewsCardsSection />

      {/* 11. Stats Band */}
      <StatsSection />

      {/* 12. Why OPS Logistics */}
      <WhyOPSLogisticsSection />

      {/* 13. Supply Chain Solutions */}
      <SupplyChainSolutionsSection />
    </>
  );
}
