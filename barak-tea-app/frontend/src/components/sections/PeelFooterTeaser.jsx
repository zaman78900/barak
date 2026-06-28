import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PeelFooterTeaser() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // The content of the footer stays fixed at the bottom
  // The overlay scales down/peels away to reveal it
  const overlayScaleY = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  return (
    <section ref={containerRef} className="h-[200vh] relative bg-[#050505]">
      {/* Sticky Bottom Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0602]">
        
        {/* Real Content (Hidden under overlay initially) */}
        <div className="relative z-0 text-center px-4">
          <p className="text-barak-gold text-[10px] tracking-[0.5em] uppercase font-bold mb-6">
            Join The Legacy
          </p>
          <h2 className="text-6xl md:text-8xl lg:text-[120px] font-playfair font-black text-barak-cream mb-10 leading-[0.8] tracking-tighter">
            ELEVATE <br/> YOUR RITUAL.
          </h2>
          <button className="bg-barak-gold text-black px-12 py-5 rounded-full hover:bg-white transition-colors duration-300 uppercase tracking-widest text-xs font-bold">
            Subscribe & Discover
          </button>
        </div>

        {/* The Peel Overlay (Starts full screen, scales to 0 height) */}
        <motion.div 
          className="absolute inset-0 bg-[#050505] z-10 origin-bottom border-t border-white/5"
          style={{ scaleY: overlayScaleY }}
        />
        
      </div>
    </section>
  );
}
