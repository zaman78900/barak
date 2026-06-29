import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Beat 2 — Origin Reveal
 * Scroll-linked parallax. Color grade shifts dark → warm gold.
 * "Hand-plucked. Single estate. Barak Valley, Assam." revealed mid-scroll.
 * 
 * Beat 3 — CTC Process
 * Three pinned beats: Crush → Tear → Curl with large animated labels + descriptions.
 */
export default function OriginAndProcess() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const y1       = useTransform(sp, [0, 1], ['0%',  '-15%']);
  const y2       = useTransform(sp, [0, 1], ['10%', '-10%']);
  const opacity1 = useTransform(sp, [0, 0.15, 0.5, 0.85, 1], [0, 1, 1, 1, 0.4]);
  const warmBg   = useTransform(sp, [0, 0.4, 1], [
    'rgba(8,8,8,1)',
    'rgba(20,12,5,1)',
    'rgba(28,18,6,1)',
  ]);
  const goldOpacity = useTransform(sp, [0, 0.3, 0.7, 1], [0, 0.08, 0.14, 0.06]);

  const steps = [
    {
      label: 'Crush',
      abbr: 'C',
      description: 'Freshly plucked leaves are passed through rollers, breaking cellular walls and releasing natural enzymes for a bold flavour foundation.',
      accent: '#C8922A',
    },
    {
      label: 'Tear',
      abbr: 'T',
      description: 'The crushed leaves are torn into fine fragments — creating the characteristic open structure that steeps rich colour in minutes.',
      accent: '#2D7A4F',
    },
    {
      label: 'Curl',
      abbr: 'C',
      description: 'Fragments are curled into tight granules through precision rollers, locking in aromatic compounds and delivering BARAK\'s signature malty finish.',
      accent: '#E8B84B',
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* ── Scrolling background color-grade ── */}
      <motion.div
        style={{ backgroundColor: warmBg }}
        className="absolute inset-0 pointer-events-none"
      />
      {/* Gold atmospheric overlay growing with scroll */}
      <motion.div
        style={{
          opacity: goldOpacity,
          background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(200,146,42,0.6) 0%, transparent 70%)',
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* ═══════════════════════════════════════
          BEAT 2 — Origin Reveal
      ═══════════════════════════════════════ */}
      <div className="relative z-10 py-36 md:py-52 flex flex-col items-center text-center px-6 overflow-hidden">
        {/* Section spine line */}
        <motion.div
          style={{ y: y2, opacity: opacity1 }}
          className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-barak-gold/20 to-transparent"
        />

        {/* The BIG reveal line */}
        <motion.div style={{ y: y1, opacity: opacity1 }}>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-inter text-[10px] uppercase tracking-[0.5em] text-barak-gold mb-10"
          >
            The Origin
          </motion.p>

          {/* Staggered words — each word a separate reveal line */}
          {[
            { word: 'Hand-plucked.', size: 'clamp(32px, 6vw, 76px)', delay: 0   },
            { word: 'Single estate.', size: 'clamp(32px, 6vw, 76px)', delay: 0.15 },
            { word: 'Barak Valley,', size: 'clamp(28px, 5vw, 64px)', delay: 0.3  },
            { word: 'Assam.',        size: 'clamp(28px, 5vw, 64px)', delay: 0.45 },
          ].map(({ word, size, delay }) => (
            <div key={word} className="overflow-hidden">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
                className="font-playfair font-black text-barak-cream leading-tight tracking-tight block"
                style={{ fontSize: size, willChange: 'transform, opacity' }}
              >
                {word}
              </motion.p>
            </div>
          ))}

          {/* SEO crawlable supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-10 font-inter text-barak-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light"
          >
            Every batch of BARAK Assam tea is sourced from a single private garden in the
            Barak Valley microclimate — altitude, river mist, and mineral-rich soil
            converge to produce a CTC tea of unmatched character.
          </motion.p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          BEAT 3 — CTC Process (Crush · Tear · Curl)
      ═══════════════════════════════════════ */}
      <div className="relative z-10 py-24 md:py-36 px-6 border-t border-white/5">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-inter text-[10px] uppercase tracking-[0.45em] text-barak-gold block mb-4"
          >
            The Craft
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair font-black text-barak-cream leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            The CTC Method
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-4 font-inter text-barak-muted text-sm leading-relaxed"
          >
            Crush. Tear. Curl. — A precise trilogy of force and rhythm that transforms
            the finest Assam leaf into BARAK's signature premium CTC tea granule.
          </motion.p>
        </div>

        {/* Process steps — large type, animated */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {/* Connecting line between steps */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-barak-gold/15 to-transparent hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center px-8 py-12 group"
            >
              {/* Step number */}
              <div
                className="text-[9px] font-inter font-bold uppercase tracking-[0.4em] mb-6"
                style={{ color: step.accent, opacity: 0.7 }}
              >
                0{i + 1}
              </div>

              {/* GIANT single-letter emblem */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative mb-8 flex items-center justify-center"
                style={{
                  width: 'clamp(80px, 12vw, 140px)',
                  height: 'clamp(80px, 12vw, 140px)',
                  borderRadius: '50%',
                  border: `1px solid ${step.accent}30`,
                  background: `radial-gradient(circle, ${step.accent}08, transparent 70%)`,
                  boxShadow: `0 0 40px ${step.accent}10`,
                }}
              >
                <span
                  className="font-playfair font-black select-none"
                  style={{
                    fontSize: 'clamp(52px, 8vw, 96px)',
                    lineHeight: 1,
                    color: step.accent,
                    opacity: 0.9,
                    textShadow: `0 0 30px ${step.accent}40`,
                  }}
                >
                  {step.abbr}
                </span>
              </motion.div>

              {/* Label */}
              <h3
                className="font-playfair font-black text-barak-cream mb-4 tracking-tight"
                style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
              >
                {step.label}
              </h3>

              {/* Description — crawlable SEO copy */}
              <p className="font-inter text-barak-muted text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>

              {/* Separator line (mobile) */}
              {i < steps.length - 1 && (
                <div className="w-20 h-px bg-barak-gold/15 mt-12 md:hidden" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
