import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

export default function BrewGuideTeaser() {
  const navigate = useNavigate();
  const steps = [
    { icon: '💧', label: 'Boil' },
    { icon: '☕', label: 'Add' },
    { icon: '⏱️', label: 'Steep' },
    { icon: '🫖', label: 'Pour' },
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-barak-surface relative">
      {/* Background Glow */}
      <div
        className="absolute top-20 right-10 w-96 h-96 rounded-full bg-barak-gold/5 blur-3xl"
        style={{ pointerEvents: 'none' }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-barak-cream mb-12 md:mb-16"
        >
          Brew the Perfect Cup
        </motion.h2>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 glass rounded-full flex items-center justify-center text-3xl md:text-4xl mb-4 group hover:shadow-gold-glow transition-all">
                {step.icon}
              </div>
              <span className="text-sm md:text-base font-semibold text-barak-cream">
                {step.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/brew-guide')}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-barak-gold text-barak-bg px-8 py-4 rounded-lg font-semibold hover:bg-barak-gold-light transition-colors inline-flex items-center gap-2 group"
        >
          See Full Brew Guide
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
}
