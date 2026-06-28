import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TextRevealStory() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const text = "True luxury is born in the soil. It is nurtured by the mist of the Barak Valley, plucked by generations of masterful hands, and delivered to your cup without compromise.";
  const words = text.split(" ");

  return (
    <section ref={containerRef} className="h-[200vh] bg-[#050505] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-20 max-w-7xl mx-auto">
        <p className="flex flex-wrap justify-center text-center text-4xl md:text-6xl lg:text-[80px] font-playfair font-bold leading-[1.2]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            // Each word lights up based on scroll progress
            const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
            const color = useTransform(scrollYProgress, [start, end], ["#FAF3E0", "#C8922A"]);

            return (
              <motion.span 
                key={i} 
                style={{ opacity, color }}
                className="mr-3 md:mr-5 mb-2 md:mb-4 transition-colors duration-300"
              >
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
