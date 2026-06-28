import React, { useEffect } from 'react';
import LuxuryHero from '../components/sections/LuxuryHero';
import WhyBarak from '../components/sections/WhyBarak';
import AssamStory from '../components/sections/AssamStory';
import PremiumProducts from '../components/sections/PremiumProducts';
import TrustSection from '../components/sections/TrustSection';
import PremiumCTA from '../components/sections/PremiumCTA';

export default function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[#050505] text-barak-cream overflow-hidden">
      <LuxuryHero />
      <WhyBarak />
      <AssamStory />
      <PremiumProducts />
      <TrustSection />
      <PremiumCTA /> 
    </main>
  );
}


