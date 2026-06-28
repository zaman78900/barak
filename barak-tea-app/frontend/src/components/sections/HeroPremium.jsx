import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gardenImg from '../../assets/barak_tea_garden.png';

export default function HeroPremium() {
  const containerRef = useRef(null);
  
  // Track scroll within this section for parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Typography Parallax & Opacity
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // Background Parallax & Blur
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const blurValue = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"]);

  // Overlay Darkness
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.8]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[100dvh] w-full overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          y: bgY,
          scale: bgScale,
          filter: blurValue
        }}
      >
        <img 
          src={gardenImg} 
          alt="Barak Tea Garden" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Dynamic Dark Overlay */}
      <motion.div 
        className="absolute inset-0 z-1 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Typography Layer */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto w-full"
        style={{
          y: textY,
          opacity: textOpacity,
          scale: textScale
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-barak-gold uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-6"
        >
          The Zenith of Assam
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="font-playfair font-black text-6xl md:text-8xl lg:text-[140px] leading-[0.85] text-barak-cream tracking-tighter"
        >
          BARAK
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="font-playfair font-bold text-3xl md:text-5xl lg:text-7xl text-barak-cream text-opacity-90 mt-2 tracking-tight"
        >
          Premium <span className="text-barak-gold italic">Estate</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 text-sm md:text-base max-w-lg text-barak-cream text-opacity-70 font-light leading-relaxed"
        >
          Grown in the legendary Silchar Terroir. Plucked by hand. Vacuum-sealed at the source for uncompromising purity.
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: textOpacity }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-barak-gold font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-barak-gold bg-opacity-30 overflow-hidden relative">
          <motion.div 
            className="w-full h-full bg-barak-gold absolute top-0 left-0"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
