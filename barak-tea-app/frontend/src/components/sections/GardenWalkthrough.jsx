import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gardenImg from '../../assets/barak_tea_garden.png';
import handsImg from '../../assets/blog_plucker_hands.png';
import soilImg from '../../assets/blog_soil_terroir.png';

export default function GardenWalkthrough() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background layer (Slowest)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  // Midground layer (Medium)
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  // Foreground layer (Fastest)
  const fgY = useTransform(scrollYProgress, [0, 1], ["20%", "-80%"]);
  // Foreground Blur (comes into focus)
  const fgBlur = useTransform(scrollYProgress, [0, 0.5, 1], ["blur(10px)", "blur(0px)", "blur(10px)"]);

  // Overlay text
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.9, 1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-[#050505] overflow-hidden">
      
      {/* Container for sticky Parallax effect */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#050505]">
        
        {/* Layer 1: Background Mountains/Garden */}
        <motion.div 
          style={{ y: bgY }}
          className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] opacity-40 mix-blend-luminosity"
        >
          <img src={gardenImg} alt="Background Garden" className="w-full h-full object-cover" />
        </motion.div>

        {/* Layer 2: Midground Soil/Detail */}
        <motion.div 
          style={{ y: midY }}
          className="absolute top-1/4 right-0 w-[60%] h-[80%] opacity-60 mix-blend-screen"
        >
          <img src={soilImg} alt="Midground Detail" className="w-full h-full object-cover rounded-l-full blur-[2px]" />
        </motion.div>

        {/* Layer 3: Foreground Plucking Hands */}
        <motion.div 
          style={{ y: fgY, filter: fgBlur }}
          className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[90%] z-20"
        >
          <img src={handsImg} alt="Foreground Plucking" className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* Text Overlay */}
        <motion.div 
          style={{ opacity: textOpacity, scale: textScale }}
          className="relative z-30 max-w-2xl text-center px-4"
        >
          <h2 className="text-5xl md:text-7xl font-playfair font-black text-barak-cream mb-6 leading-tight drop-shadow-2xl">
            Immersed in <br/> <span className="text-barak-gold italic">Nature</span>
          </h2>
          <p className="text-lg md:text-xl font-light text-white/80 drop-shadow-md">
            Step into the estate. Feel the texture of the soil, the humidity of the air, and witness the generations of craft.
          </p>
        </motion.div>
        
        {/* Vignette */}
        <div className="absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_100%)] pointer-events-none" />
      </div>

    </section>
  );
}
