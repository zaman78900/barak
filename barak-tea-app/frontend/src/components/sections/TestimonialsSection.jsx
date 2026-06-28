import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'The dry leaf release is outstanding. A full-bodied brew that carries rich molasses and warm malty tones. Simply perfect for our daily morning chai.',
      headline: 'molasses & malt profile',
      author: 'Priya S.',
      location: 'Silchar, Assam',
      rating: 5,
    },
    {
      quote: 'Excellent cut and density. The spice profile is robust, creating a deep crimson liqueur that holds its own when brewed with heavy milk.',
      headline: 'deep crimson liqueur',
      author: 'Rashed A.',
      location: 'Guwahati, Assam',
      rating: 5,
    },
    {
      quote: 'Museum-quality packaging. The nitrogen-sealed packet keeps the leaves fresh as if they were just flush-processed yesterday. A beautiful gift.',
      headline: 'nitrogen-fresh seal',
      author: 'Anjali D.',
      location: 'Kolkata, WB',
      rating: 5,
    },
    {
      quote: 'Incredibly consistent CTC granules. Zero dust residue, yielding an incredibly clean, rich, and energetic infusion that we have come to love.',
      headline: 'energetic daily cup',
      author: 'Rahul K.',
      location: 'New Delhi, DL',
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section className="py-24 md:py-36 px-4 bg-[#080808] relative z-10 border-t border-[rgba(250,243,224,0.03)]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Title */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-24">
          <p className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-3">
            Accolades
          </p>
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-barak-cream mb-4">
            Patron Voices
          </h2>
          <div className="w-12 h-[1px] bg-barak-gold mx-auto mb-4" />
          <p className="text-xs md:text-sm text-barak-cream text-opacity-50 font-light leading-relaxed">
            Words of appreciation from our community of tea connoisseurs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="relative p-8 md:p-10 border border-[rgba(250,243,224,0.04)] bg-[rgba(13,9,5,0.25)] rounded-glass hover:border-[rgba(200,146,42,0.15)] transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & verified tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-xs text-barak-gold">★</span>
                    ))}
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.2em] bg-barak-gold/10 text-barak-gold-light border border-barak-gold/20 px-2 py-0.5 rounded-pill font-bold">
                    Verified Buyer
                  </span>
                </div>

                {/* Quote Title */}
                <h4 className="text-xs uppercase tracking-[0.15em] text-barak-gold-light font-bold mb-4">
                  {testimonial.headline}
                </h4>

                {/* Quote Body */}
                <p className="text-base md:text-lg font-playfair italic text-barak-cream text-opacity-80 leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-[rgba(250,243,224,0.03)] pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-barak-cream">{testimonial.author}</p>
                  <p className="text-xs text-barak-cream text-opacity-40">{testimonial.location}</p>
                </div>
                <span className="text-[18px] font-playfair font-semibold text-barak-gold text-opacity-10">
                  BARAK
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
