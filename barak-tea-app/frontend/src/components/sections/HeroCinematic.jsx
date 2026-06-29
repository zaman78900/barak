import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import gardenImg from '../../assets/barak_tea_garden.png';

export default function HeroCinematic() {
  const containerRef = useRef(null);

  // The container will be 250vh to allow deep scrolling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Entrance motion values
  const entryBgScale = useMotionValue(1.8);
  const entryTextScale = useMotionValue(1.5);
  const entryOpacity = useMotionValue(0);

  useEffect(() => {
    // Zoom out background from 1.8 to 1.0 on mount
    animate(entryBgScale, 1.0, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1] // smooth deceleration (easeOutExpo)
    });

    // Zoom out text/button container from 1.5 to 1.0 on mount
    animate(entryTextScale, 1.0, {
      duration: 2.0,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.15
    });

    // Fade in text elements
    animate(entryOpacity, 1.0, {
      duration: 1.8,
      ease: "easeOut",
      delay: 0.15
    });
  }, [entryBgScale, entryTextScale, entryOpacity]);

  // Background scales and darkens slightly as you scroll
  const scrollBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const finalBgScale = useTransform(
    [entryBgScale, scrollBgScale],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.4, 0]);

  // Massive typography text mask effect
  const scrollTextScale = useTransform(scrollYProgress, [0, 0.4], [1, 20]);
  const finalTextScale = useTransform(
    [entryTextScale, scrollTextScale],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );

  const scrollTextOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const finalTextOpacity = useTransform(
    [entryOpacity, scrollTextOpacity],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );

  const textY = useTransform(scrollYProgress, [0, 0.4], ["0%", "50%"]);

  // Separate button animation so it fades out faster before the text becomes massive
  const scrollBtnOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const btnOpacity = useTransform(
    [entryOpacity, scrollBtnOpacity],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );

  const scrollBtnScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);
  const btnScale = useTransform(
    [entryTextScale, scrollBtnScale],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#050505]">
      {/* Sticky container that stays in view while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Cinematic Background */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ scale: finalBgScale, opacity: bgOpacity }}
        >
          <img 
            src={gardenImg} 
            alt="Estate" 
            className="w-full h-full object-cover object-center grayscale-[20%] brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50" />
        </motion.div>

        {/* Text & Button Layer */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center w-full"
          style={{ scale: finalTextScale, opacity: finalTextOpacity, y: textY }}
        >
          {/* Floating Wrapper for Text */}
          <motion.div
            className="flex flex-col items-center justify-center pointer-events-none"
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="font-playfair font-black text-[15vw] leading-[0.8] tracking-tighter text-white text-center whitespace-nowrap mix-blend-overlay drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
              BARAK
            </h1>
            <h2 className="font-playfair font-bold text-[4vw] text-white/80 tracking-[0.3em] uppercase mt-4 mix-blend-overlay">
              Assam Estate
            </h2>
          </motion.div>

          {/* Floating Wrapper for Button (Out of phase floating for realistic effect) */}
          <motion.div
            className="mt-8 pointer-events-auto"
            style={{ opacity: btnOpacity, scale: btnScale }}
            animate={{ y: [6, -6, 6] }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Link
              to="/shop"
              className="px-8 py-4 bg-barak-gold hover:bg-barak-cream text-barak-bg hover:text-barak-bg rounded-full text-xs uppercase tracking-[0.25em] font-black transition-all duration-350 hover:shadow-gold-glow-large hover:scale-[1.05] inline-block cursor-pointer"
            >
              Shop the Collection
            </Link>
          </motion.div>
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
