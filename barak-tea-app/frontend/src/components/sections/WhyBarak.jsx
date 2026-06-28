import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ value, duration = 2, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-playfair text-4xl md:text-5xl lg:text-6xl font-black text-barak-gold">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function WhyBarak() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
    }
  };

  const features = [
    {
      title: "Estate Single Origin",
      description: "Cultivated exclusively within the microclimate of our private valley in Silchar. Never blended, never compromised.",
      icon: (
        <svg className="w-8 h-8 text-barak-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "The Golden Tippy Pluck",
      description: "Harvested only during peak second-flush hours. Our expert pluckers choose only the top two leaves and a tender golden bud.",
      icon: (
        <svg className="w-8 h-8 text-barak-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Freshness Sealed at Source",
      description: "Vacuum sealed in custom gold foil within 3 hours of plucking to lock in the rich aromatic essential oils and robust color.",
      icon: (
        <svg className="w-8 h-8 text-barak-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden z-20">
      
      {/* Subtle Amber Glow Background */}
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-barak-gold/2 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-barak-success/2 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
          <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-4 block">
            Crafted Beyond Standards
          </span>
          <h2 className="text-4xl md:text-6xl font-playfair font-black text-barak-cream leading-tight">
            The Pillars of Barak Craftsmanship
          </h2>
          <p className="text-barak-muted font-inter text-base mt-6 font-light max-w-xl mx-auto leading-relaxed">
            Every sip is an invitation to explore a century-old heritage of luxury tea processing, single-estate purity, and precise sensory orchestration.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className="relative p-10 bg-white/2 border border-white/5 hover:border-barak-gold/20 rounded-3xl transition-all duration-500 overflow-hidden group shadow-glass"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Hover Radial Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Icon Pedestal */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-barak-gold/30 transition-all duration-500">
                {feature.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-playfair font-bold text-barak-cream mb-4 group-hover:text-barak-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-barak-muted font-inter font-light text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-barak-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stat counters block */}
        <div className="relative border-t border-white/5 pt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="flex flex-col items-center">
              <Counter value="100" suffix="%" />
              <span className="text-[10px] uppercase font-bold text-barak-cream/60 tracking-[0.2em] mt-4">
                Single Origin Purity
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Counter value="4" suffix=".9" prefix="★" />
              <span className="text-[10px] uppercase font-bold text-barak-cream/60 tracking-[0.2em] mt-4">
                Customer Rating
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Counter value="3" suffix=" hrs" />
              <span className="text-[10px] uppercase font-bold text-barak-cream/60 tracking-[0.2em] mt-4">
                Harvest to Seal
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Counter value="12" suffix=" flushes" />
              <span className="text-[10px] uppercase font-bold text-barak-cream/60 tracking-[0.2em] mt-4">
                Peak flushes selected
              </span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
