import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

export default function OriginStory() {
  const navigate = useNavigate();
  return (
    <section className="py-20 md:py-32 px-4 bg-barak-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6"
          >
            <div className="relative w-full aspect-square bg-gradient-to-br from-barak-gold/10 to-barak-surface rounded-glass overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center text-9xl p-8">
                🍃
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6"
          >
            <div className="glass p-8 md:p-12 rounded-glass">
              <p className="text-xs md:text-sm uppercase font-bold text-barak-gold mb-4 tracking-wider">
                Our Story
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-barak-cream mb-6">
                From the Heart of Barak Valley
              </h2>
              <p className="text-base md:text-lg text-barak-muted leading-relaxed mb-6">
                For three generations, the tea gardens of Barak Valley have been our family's passion. We source only the finest CTC leaves from sustainable farms, ensuring every cup carries the heritage and soul of Silchar, Assam.
              </p>
              <p className="text-base text-barak-gold font-semibold mb-8">
                "From our valley to your cup"
              </p>
              <button 
                onClick={() => navigate('/our-story')}
                className="glass px-6 py-3 rounded-lg font-semibold text-barak-cream hover:text-barak-gold inline-flex items-center gap-2 group"
              >
                Read Our Story
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
