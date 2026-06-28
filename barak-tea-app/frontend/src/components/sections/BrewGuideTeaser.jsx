import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

export default function BrewGuideTeaser() {
  const navigate = useNavigate();
  const steps = [
    { 
      num: '01', 
      title: 'THERMAL', 
      parameter: '100°C', 
      desc: 'Heat filtered water to rolling boil to ensure optimal extraction.' 
    },
    { 
      num: '02', 
      title: 'DOSAGE', 
      parameter: '2.5 Grams', 
      desc: 'Measure exactly one teaspoon of CTC granules per cup of tea.' 
    },
    { 
      num: '03', 
      title: 'TEMPORAL', 
      parameter: '4.0 Minutes', 
      desc: 'Steep under cover to contain volatile flavor oils and aromas.' 
    },
    { 
      num: '04', 
      title: 'COMPLETION', 
      parameter: 'Slow Strain', 
      desc: 'Strain carefully into warm milk or serve black with a dash of spice.' 
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.5, ease: 'easeInOut', delay: 0.2 },
    },
  };

  return (
    <section className="py-24 md:py-36 px-4 bg-[#0a0a0a] relative z-10 border-t border-[rgba(250,243,224,0.03)]">
      
      {/* Background Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-barak-gold/1 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        
        {/* Title Block */}
        <div className="max-w-2xl mx-auto mb-16 md:mb-24">
          <p className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-3">
            The Infusion
          </p>
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-barak-cream mb-4">
            The Brew Ritual
          </h2>
          <div className="w-12 h-[1px] bg-barak-gold mx-auto mb-4" />
          <p className="text-xs md:text-sm text-barak-cream text-opacity-50 font-light leading-relaxed">
            Distilling the rich aroma and bold flavor of Assam CTC tea through strict parameters.
          </p>
        </div>

        {/* Timeline Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 md:mb-24"
        >
          {/* Horizontal connecting line (Desktop only) */}
          <motion.div 
            variants={lineVariants}
            className="absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-[rgba(200,146,42,0.05)] via-[rgba(200,146,42,0.25)] to-[rgba(200,146,42,0.05)] hidden lg:block origin-left"
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={stepVariants}
              className="flex flex-col items-center group relative px-4"
            >
              {/* Symmetrical timeline node */}
              <div className="w-20 h-20 rounded-full border border-[rgba(250,243,224,0.05)] bg-[#111111] flex items-center justify-center mb-6 group-hover:border-barak-gold group-hover:shadow-[0_0_20px_rgba(200,146,42,0.15)] transition-all duration-500 z-10">
                <span className="text-lg font-playfair font-bold text-barak-gold-light group-hover:text-barak-gold transition-colors duration-300">
                  {step.num}
                </span>
              </div>
              
              <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.2em] mb-2 block">
                {step.title}
              </span>
              
              <span className="text-sm font-playfair font-semibold text-barak-cream mb-3">
                {step.parameter}
              </span>
              
              <p className="text-xs text-barak-cream text-opacity-50 leading-relaxed font-light max-w-[220px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            onClick={() => navigate('/brew-guide')}
            className="nav-shop-now px-8 py-3.5 rounded-pill text-sm font-semibold text-barak-cream inline-flex items-center gap-2 group"
          >
            Explore the Brew Guide
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
        
      </div>
    </section>
  );
}
