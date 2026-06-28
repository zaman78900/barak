import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "A masterclass in single-origin tea. The CTC granules brew into an incredibly robust cup, carrying the exact rich malty taste that defines authentic Barak tea.",
    author: "Pritha Sen",
    role: "Tea Sommelier & Food Historian",
    rating: 5
  },
  {
    quote: "Barak has completely elevated my morning tea ritual. The visual storytelling of their estate is beautiful, but the purity and flavor of the leaf is where they truly shine.",
    author: "Aditya Roy",
    role: "Ritual Enthusiast & Collector",
    rating: 5
  },
  {
    quote: "Uncompromising quality. The vacuum sealing at source makes a noticeable difference in color and aroma. It's bold, rich, and feels incredibly premium.",
    author: "Ananya Barua",
    role: "Hospitality Consultant",
    rating: 5
  }
];

export default function TrustSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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

  return (
    <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden z-20 border-t border-white/5">
      
      {/* Glow overlays */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-barak-gold/2 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
          <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-4 block">
            Accolades & Rituals
          </span>
          <h2 className="text-4xl md:text-6xl font-playfair font-black text-barak-cream leading-tight">
            Trusted by Connoisseurs
          </h2>
        </div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className="relative p-10 bg-white/2 border border-white/5 rounded-3xl overflow-hidden shadow-glass flex flex-col justify-between"
            >
              
              <div>
                {/* Rating Star Indicators */}
                <div className="flex items-center gap-1 mb-6 text-barak-gold text-xs tracking-widest">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p className="font-playfair font-light italic text-base md:text-lg text-barak-cream leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-white/5 pt-6">
                <h4 className="font-playfair font-bold text-barak-cream text-base">
                  {t.author}
                </h4>
                <p className="font-inter text-[10px] uppercase font-bold text-barak-gold tracking-widest mt-1">
                  {t.role}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
