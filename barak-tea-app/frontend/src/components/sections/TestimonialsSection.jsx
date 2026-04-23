import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'The aroma is incredible. Perfect for morning chai. Very fresh.',
      headline: 'Best chai ever!',
      author: 'Priya S.',
      location: 'Silchar',
      rating: 5,
      product: 'Classic CTC Dust',
    },
    {
      quote: 'Nice spice balance. Could be a bit stronger but very satisfying.',
      headline: 'Great masala blend',
      author: 'Rashed A.',
      location: 'Guwahati',
      rating: 4,
      product: 'Morning Masala Blend',
    },
    {
      quote: 'Gorgeous packaging. Sent to my parents and they loved it.',
      headline: 'Perfect gift!',
      author: 'Anjali D.',
      location: 'Kolkata',
      rating: 5,
      product: 'Gift Box Collection',
    },
    {
      quote: 'Quality is excellent. Became a regular customer.',
      headline: 'Consistent excellence',
      author: 'Rahul K.',
      location: 'Delhi',
      rating: 5,
      product: 'Premium Leaf Grade',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 md:py-32 px-4 bg-barak-bg">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-barak-cream text-center mb-16 md:mb-20"
        >
          What Our Customers Say
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass p-8 rounded-glass"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-barak-gold">★</span>
                ))}
              </div>

              {/* Quote */}
              <div className="mb-4">
                <span className="text-5xl text-barak-gold/30 leading-none">"</span>
                <p className="italic text-barak-muted mb-3">{testimonial.quote}</p>
              </div>

              {/* Headline */}
              <h4 className="text-lg font-bold text-barak-cream mb-4">
                {testimonial.headline}
              </h4>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-barak-cream">{testimonial.author}</p>
                  <p className="text-sm text-barak-muted">{testimonial.location}</p>
                </div>
                <span className="text-xs bg-barak-success/20 text-barak-success px-3 py-1 rounded-pill font-semibold">
                  Verified Buyer
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
