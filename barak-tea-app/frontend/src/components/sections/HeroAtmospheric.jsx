import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Beat 1 — Arrival / Hero
 * Full-viewport atmospheric scene. NO product photography.
 * Animated wordmark reveal (mask-wipe letter stagger).
 * Animated scroll-hint breathing cue.
 * Color palette shifts cool mist → warm gold as user scrolls (Beat 2 merged here via parallax).
 */
export default function HeroAtmospheric() {
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms on scroll
  const yContent    = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const yBg         = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  // Color shift: overlay fades from dark mist to warm gold tint
  const warmOverlay = useTransform(scrollYProgress, [0, 0.8], [0, 0.18]);

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const headline   = 'BARAK';
  const subline    = ['From the', 'Mist of', 'Barak Valley'];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#0D0905' }}
    >
      {/* ── Parallax atmospheric background layers ── */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Deep valley mist radial gradient — primary atmosphere */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
                rgba(15,40,25,0.85) 0%,
                rgba(10,20,15,0.5) 40%,
                rgba(8,8,8,0) 80%
              ),
              radial-gradient(ellipse 100% 100% at 50% 50%,
                #0d1810 0%, #08070a 65%, #050505 100%
              )
            `,
          }}
        />

        {/* Mist layer — animated slow drift */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 30% 60%, rgba(20,80,50,0.12) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 75% 30%, rgba(12,35,22,0.15) 0%, transparent 70%)
            `,
            animation: 'mistDrift 18s ease-in-out infinite alternate',
            willChange: 'transform, opacity',
          }}
        />

        {/* Warm gold horizon glow — appears via scroll (driven by JS) */}
        <motion.div
          style={{
            opacity: warmOverlay,
            background: 'linear-gradient(to top, rgba(200,146,42,0.18) 0%, transparent 60%)',
          }}
          className="absolute inset-0"
        />
        <motion.div
          style={{
            opacity: warmOverlay,
            background: 'linear-gradient(to top, rgba(180,120,20,0.20) 0%, transparent 100%)',
          }}
          className="absolute bottom-0 left-0 right-0 h-1/3"
        />
      </motion.div>

      {/* ── Interactive spotlight following cursor ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(200,146,42,0.07), transparent 70%)`,
        }}
      />

      {/* ── Decorative misty horizontal lines (depth cue) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-10">
        {[30, 45, 62, 78].map((pct, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${pct}%`,
              background: 'linear-gradient(to right, transparent, rgba(200,146,42,0.3), transparent)',
              animation: `lineFade ${6 + i * 2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 1.2}s`,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* ── Main hero content ── */}
      <motion.div
        style={{ y: yContent, opacity: opacityHero }}
        className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-6xl mx-auto pt-20"
      >
        {/* Overline label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="block h-px w-10 bg-barak-gold opacity-60" />
          <span
            className="font-inter text-[10px] uppercase tracking-[0.45em] text-barak-gold font-bold"
          >
            Single Origin · Barak Valley, Assam
          </span>
          <span className="block h-px w-10 bg-barak-gold opacity-60" />
        </motion.div>

        {/* Giant masked headline — letter stagger */}
        <h1
          className="font-playfair font-black text-barak-cream leading-none tracking-tighter mb-0 overflow-hidden"
          style={{ fontSize: 'clamp(80px, 18vw, 200px)', lineHeight: 0.88 }}
          aria-label="BARAK Tea — Premium Assam CTC Tea"
        >
          {headline.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 1.0,
                delay: 0.5 + i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block origin-bottom"
              style={{ willChange: 'transform, opacity' }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Elegant subheadline — 3 word-lines revealed with mask */}
        <div className="mt-6 flex flex-col items-center gap-1 overflow-hidden">
          {subline.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 1.0 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-cormorant text-barak-cream/70 text-center"
                style={{
                  fontSize: 'clamp(22px, 4.5vw, 52px)',
                  fontStyle: 'italic',
                  letterSpacing: '0.02em',
                  willChange: 'transform, opacity',
                }}
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Fragment tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="mt-10 font-inter text-barak-muted text-xs md:text-sm tracking-[0.25em] uppercase"
        >
          Hand-plucked · Single estate · Premium CTC Tea
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.9 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <a
            href="/shop"
            data-cursor="Shop"
            className="px-9 py-4 bg-barak-gold text-[#050505] rounded-full text-[11px] uppercase tracking-widest font-black transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(200,146,42,0.5)] hover:scale-105"
          >
            Shop the Collection
          </a>
          <a
            href="/our-story"
            data-cursor="Story"
            className="px-9 py-4 border border-white/10 hover:border-barak-gold/40 bg-white/4 backdrop-blur-sm rounded-full text-[11px] uppercase tracking-widest font-bold text-barak-cream transition-all duration-300 hover:bg-white/8"
          >
            Our Valley Story
          </a>
        </motion.div>
      </motion.div>

      {/* ── Animated scroll cue — breathing pulse, not static arrow ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        style={{ opacity: opacityHero }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        aria-label="Scroll to explore"
      >
        <motion.span
          className="font-inter text-[9px] uppercase tracking-[0.35em] text-barak-gold/60"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll
        </motion.span>
        {/* Breathing scroll pill */}
        <div className="relative w-[1px] h-12 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-barak-gold to-transparent"
            animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Bottom edge fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #0D0905 100%)',
        }}
      />
    </section>
  );
}
