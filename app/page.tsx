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

      {/* 10. Why OPS Logistics */}
      <WhyOPSLogisticsSection />

      {/* Footer */}
      <footer className='py-12 md:py-16 lg:py-20 bg-navy text-white'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-center'>
          <p className='text-sm md:text-base text-white/80'>© 2026 OPS Logistics. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
