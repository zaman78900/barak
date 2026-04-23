import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowRight } from 'phosphor-react';
import HeroSection from '../components/sections/HeroSection';
import FeatureBento from '../components/sections/FeatureBento';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import OriginStory from '../components/sections/OriginStory';
import BrewGuideTeaser from '../components/sections/BrewGuideTeaser';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import NewsletterSection from '../components/sections/NewsletterSection';

export default function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full">
      <HeroSection />
      <FeatureBento />
      <TrustTicker />
      <FeaturedProducts />
      <OriginStory />
      <BrewGuideTeaser />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}

function TrustTicker() {
  const items = [
    "100% Pure CTC",
    "Freshly Packed",
    "Free Delivery on ₹499+",
    "WhatsApp Support 24/7",
    "Grown in Barak Valley",
    "No Preservatives",
  ];

  return (
    <div className="bg-barak-surface overflow-hidden py-4 border-y border-barak-border">
      <motion.div 
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span 
            key={i}
            className="text-barak-gold text-xs font-bold uppercase tracking-wider"
          >
            {item}
            {i % items.length !== items.length - 1 && (
              <span className="ml-8 inline-block text-barak-gold-dim">·</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
