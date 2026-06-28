import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gardenImg from '../../assets/barak_tea_garden.png';

export default function HeroCinematic() {
  const containerRef = useRef(null);

  // The container will be 300vh to allow deep scrolling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Background scales and darkens slightly as you scroll
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.4, 0]);

  // Massive typography text mask effect
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 20]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], ["0%", "50%"]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#050505]">
      {/* Sticky container that stays in view while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Cinematic Background */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ scale: bgScale, opacity: bgOpacity }}
        >
          <img 
            src={gardenImg} 
            alt="Estate" 
            className="w-full h-full object-cover object-center grayscale-[20%] brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50" />
        </motion.div>

        {/* Text Mask Layer */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center mix-blend-overlay pointer-events-none w-full"
          style={{ scale: textScale, opacity: textOpacity, y: textY }}
        >
          <h1 className="font-playfair font-black text-[15vw] leading-[0.8] tracking-tighter text-white text-center whitespace-nowrap">
            BARAK
          </h1>
          <h2 className="font-playfair font-bold text-[5vw] text-white/80 tracking-widest uppercase mt-4">
            Assam Estate
          </h2>
        </motion.div>

        {/* Ambient Foreground Lighting */}
        <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(200,146,42,0.4)_0%,transparent_70%)]" />
        
        {/* Scroll Call to Action */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          <span className="text-[9px] font-inter uppercase tracking-[0.4em] text-white/70 font-bold">Descend</span>
          <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
