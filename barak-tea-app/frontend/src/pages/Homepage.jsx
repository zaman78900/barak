import React, { useEffect } from 'react';
import HeroPremium from '../components/sections/HeroPremium';
import HorizontalScrollShowcase from '../components/sections/HorizontalScrollShowcase';
import GlassProducts from '../components/sections/GlassProducts';
import { motion } from 'framer-motion';

export default function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[#050505]">
      <HeroPremium />
      <HorizontalScrollShowcase />
      <GlassProducts />
      
      {/* Cinematic Footer Teaser */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0a0602] z-0" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10"
        >
          <p className="text-barak-gold text-[10px] tracking-[0.4em] font-bold uppercase mb-6">
            Join The Legacy
          </p>
          <h2 className="text-4xl md:text-6xl font-playfair font-black text-barak-cream mb-8">
            Elevate Your <br/> Daily Ritual.
          </h2>
          <button className="glass-panel-ultra px-10 py-4 rounded-full text-barak-cream hover:text-barak-gold hover:border-barak-gold transition-all duration-300 uppercase tracking-widest text-xs font-bold">
            Subscribe & Discover
          </button>
        </motion.div>
      </section>
    </main>
  );
}
