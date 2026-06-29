import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

/**
 * Beat 6 — Proof / Trust
 * Kinetic: animated stats + auto-scrolling testimonial marquee.
 * Never static — always moving.
 */

// ──── Marquee primitive ────────────────────────────────────────
function InfiniteMarquee({ items, speed = 40, direction = 1 }) {
  const x = useMotionValue(0);
  const baseWidth = useRef(0);
  const trackRef  = useRef(null);

  useAnimationFrame((_, delta) => {
    const next = x.get() + (delta / 1000) * speed * -direction;
    if (trackRef.current) {
      baseWidth.current = trackRef.current.scrollWidth / 2;
    }
    if (baseWidth.current > 0 && Math.abs(next) >= baseWidth.current) {
      x.set(next + baseWidth.current);
    } else {
      x.set(next);
    }
  });

  return (
    <div className="overflow-hidden w-full" aria-hidden="true">
      <motion.div
        ref={trackRef}
        style={{ x, willChange: 'transform' }}
        className="flex gap-0 whitespace-nowrap"
      >
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center gap-8 px-8"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const testimonials = [
  {
    quote: 'A masterclass in single-origin tea. The CTC granules brew into an incredibly robust cup.',
    author: 'Pritha Sen',
    role: 'Tea Sommelier & Food Historian',
  },
  {
    quote: 'Barak has completely elevated my morning ritual. Bold, rich, and unmistakably premium.',
    author: 'Aditya Roy',
    role: 'Ritual Enthusiast & Collector',
  },
  {
    quote: 'Vacuum sealed at source — you can taste the freshness in every single sip.',
    author: 'Ananya Barua',
    role: 'Hospitality Consultant',
  },
  {
    quote: "The depth of flavour from Barak Valley is unlike any Assam tea I've had before.",
    author: 'Krishnendu Das',
    role: 'Executive Chef, Kolkata',
  },
];

const stats = [
  { value: '100%',   label: 'Single Origin' },
  { value: '★ 4.9', label: 'Customer Rating' },
  { value: '3 hrs',  label: 'Harvest to Seal' },
  { value: '12+',    label: 'Estate Flushes/yr' },
  { value: '2000+',  label: 'Happy Connoisseurs' },
  { value: '1 Estate', label: 'Barak Valley, Assam' },
];

const statsMarqueeItems = stats.map((s, i) => (
  <div key={i} className="flex items-center gap-5">
    <span className="font-playfair font-black text-barak-gold text-2xl md:text-3xl">{s.value}</span>
    <span className="font-inter text-[9px] uppercase tracking-[0.35em] text-barak-cream/40">{s.label}</span>
    <span className="text-barak-gold/20 text-2xl font-thin select-none">·</span>
  </div>
));

const testimonialsMarqueeItems = testimonials.map((t, i) => (
  <div
    key={i}
    className="flex-shrink-0 w-[360px] md:w-[440px] bg-white/2 border border-white/5 rounded-2xl p-7 flex flex-col gap-4"
    style={{ backdropFilter: 'blur(8px)' }}
  >
    <div className="flex gap-0.5 text-barak-gold text-xs">{'★★★★★'}</div>
    <p className="font-playfair italic text-barak-cream/90 text-sm md:text-base leading-relaxed">
      "{t.quote}"
    </p>
    <div className="border-t border-white/5 pt-4">
      <p className="font-playfair font-bold text-barak-cream text-sm">{t.author}</p>
      <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-barak-gold mt-0.5">{t.role}</p>
    </div>
  </div>
));

export default function ProofMarquee() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(180deg, #0D0905 0%, #111009 50%, #0D0905 100%)' }}
    >
      {/* Top/bottom edge blends */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #0D0905 0%, transparent 100%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0D0905 0%, transparent 100%)' }}
      />

      {/* Left/right fade masks on marquees */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, #0D0905 0%, transparent 8%, transparent 92%, #0D0905 100%)',
        }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 px-6 relative z-20"
      >
        <span className="font-inter text-[10px] uppercase tracking-[0.45em] text-barak-gold block mb-4">
          Accolades & Rituals
        </span>
        <h2
          className="font-playfair font-black text-barak-cream tracking-tight leading-tight"
          style={{ fontSize: 'clamp(28px, 4.5vw, 54px)' }}
        >
          Trusted by Connoisseurs
        </h2>
      </motion.div>

      {/* Stats marquee — moving right */}
      <div className="relative z-20 mb-14">
        <div className="flex items-center mb-4 px-6">
          <div className="h-px flex-grow bg-white/5" />
          <span className="font-inter text-[9px] uppercase tracking-[0.4em] text-barak-cream/20 mx-4">The Numbers</span>
          <div className="h-px flex-grow bg-white/5" />
        </div>
        <InfiniteMarquee items={statsMarqueeItems} speed={35} direction={1} />
      </div>

      {/* Testimonials marquee — moving left */}
      <div className="relative z-20">
        <div className="flex items-center mb-6 px-6">
          <div className="h-px flex-grow bg-white/5" />
          <span className="font-inter text-[9px] uppercase tracking-[0.4em] text-barak-cream/20 mx-4">The People</span>
          <div className="h-px flex-grow bg-white/5" />
        </div>
        <InfiniteMarquee items={testimonialsMarqueeItems} speed={28} direction={-1} />
      </div>
    </section>
  );
}
