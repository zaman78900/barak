import React, { useEffect } from 'react';
import HeroCinematic from '../components/sections/HeroCinematic';
import TextRevealStory from '../components/sections/TextRevealStory';
import GardenWalkthrough from '../components/sections/GardenWalkthrough';
import VelocityBento from '../components/sections/VelocityBento';
import EditorialCarousel from '../components/sections/EditorialCarousel';
import PeelFooterTeaser from '../components/sections/PeelFooterTeaser';

export default function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[#050505] text-barak-cream">
      <HeroCinematic />
      <TextRevealStory />
      <GardenWalkthrough />
      <VelocityBento />
      <EditorialCarousel />
      <PeelFooterTeaser /> 
    </main>
  );
}

