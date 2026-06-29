import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gardenImg   from '../../assets/barak_tea_garden.png';
import pluckingImg from '../../assets/barak_tea_plucking.png';
import cupImg      from '../../assets/barak_brewed_cup.png';

/**
 * Beat 4 — The Valley (Brand Story)
 * Large cinematic parallax imagery of gardens/river/mist.
 * Story told in 2–3 short animated lines.
 * Deep-green palette transition.
 */
export default function ValleyStory() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const yBg1   = useTransform(scrollYProgress, [0, 1], ['5%',   '-12%']);
  const yBg2   = useTransform(scrollYProgress, [0, 1], ['10%',  '-8%']);
  const yText  = useTransform(scrollYProgress, [0, 1], ['8%',   '-8%']);

  const panels = [
    {
      img: gardenImg,
      tag: 'The Garden',
      alt: 'Lush tea garden in Barak Valley, Assam India in morning mist',
      lines: ['"Where morning fog', 'writes poetry', 'on the leaf."'],
      y: yBg1,
      align: 'left',
    },
    {
      img: pluckingImg,
      tag: 'The Harvest',
      alt: 'Expert pluckers hand-picking top two leaves and a bud in Barak Valley tea estate',
      lines: ['"Thousands of', 'hand-plucks for', 'one perfect cup."'],
      y: yBg2,
      align: 'right',
    },
    {
      img: cupImg,
      tag: 'The Ritual',
      alt: 'Freshly brewed Barak Valley Assam CTC tea in a cup',
      lines: ['"From valley to', 'vessel — a single', 'unbroken thread."'],
      y: yBg1,
      align: 'left',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: '#080c0a' }}
    >
      {/* Edge gradient from previous section */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #0D0905 0%, transparent 100%)' }}
      />
      {/* Edge gradient to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0D0905 0%, transparent 100%)' }}
      />

      {/* Deep forest volumetric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(15,55,35,0.25) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-24 md:mb-36"
        >
          <span className="font-inter text-[10px] uppercase tracking-[0.45em] text-barak-gold block mb-5">
            A Cinematic Legacy
          </span>
          <h2
            className="font-playfair font-black text-barak-cream tracking-tight leading-tight"
            style={{ fontSize: 'clamp(32px, 5.5vw, 68px)' }}
          >
            The Valley. The Leaf. The Cup.
          </h2>
        </motion.div>

        {/* Cinematic panels */}
        <div className="flex flex-col gap-20 md:gap-36">
          {panels.map((panel, idx) => {
            const isLeft = panel.align === 'left';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-20`}
              >
                {/* Image — cinematic parallax */}
                <div className="relative w-full lg:w-[58%] overflow-hidden rounded-2xl">
                  {/* Image aspect */}
                  <div className="aspect-[16/10] relative">
                    <motion.img
                      src={panel.img}
                      alt={panel.alt}
                      className="absolute inset-0 w-full h-[120%] object-cover grayscale-[15%] brightness-75"
                      style={{ y: panel.y, top: '-10%' }}
                      loading="lazy"
                    />
                    {/* Cinematic grade overlay */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        background: isLeft
                          ? 'linear-gradient(to right, rgba(8,12,10,0.5) 0%, transparent 60%)'
                          : 'linear-gradient(to left, rgba(8,12,10,0.5) 0%, transparent 60%)',
                      }}
                    />
                    {/* Film grain texture */}
                    <div
                      className="absolute inset-0 z-10 opacity-30 mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px',
                      }}
                    />
                    {/* Tag pill */}
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-barak-gold" />
                      <span className="font-inter text-[10px] uppercase tracking-[0.4em] text-barak-gold">
                        {panel.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial text */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[42%]"
                  style={{ y: yText }}
                >
                  {/* Big italic quote lines */}
                  <div className="flex flex-col gap-1 mb-8">
                    {panel.lines.map((line, li) => (
                      <div key={li} className="overflow-hidden">
                        <motion.p
                          initial={{ y: '100%', opacity: 0 }}
                          whileInView={{ y: '0%', opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.9,
                            delay: li * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="font-cormorant text-barak-cream leading-tight font-medium italic"
                          style={{
                            fontSize: 'clamp(24px, 4vw, 52px)',
                            lineHeight: 1.15,
                          }}
                        >
                          {line}
                        </motion.p>
                      </div>
                    ))}
                  </div>
                  {/* Gold accent rule */}
                  <div className="h-px w-16 bg-barak-gold/40 mb-6" />
                  {/* Index number */}
                  <span
                    className="font-playfair font-black text-barak-gold/15 select-none pointer-events-none"
                    style={{ fontSize: 'clamp(60px, 10vw, 120px)', lineHeight: 1 }}
                  >
                    0{idx + 1}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
