import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import pluckingImg from '../../assets/barak_tea_plucking.png';
import brewingImg from '../../assets/blog_chai_brewing.png';
import terroirImg from '../../assets/blog_soil_terroir.png';

export default function HorizontalScrollShowcase() {
  const targetRef = useRef(null);

  // The section is 300vh tall to allow scrolling space
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transform scroll progress (0 to 1) into horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  const cards = [
    {
      title: "Silchar Terroir",
      desc: "Nurtured by the unique microclimate, acidic soil, and high humidity of the Barak Valley. Every leaf tells the story of its origin.",
      img: terroirImg,
      num: "01"
    },
    {
      title: "Hand-Plucked",
      desc: "Only the top two leaves and a bud, selected by second-generation pluckers during peak harvest flushes for maximum flavor.",
      img: pluckingImg,
      num: "02"
    },
    {
      title: "Pure Extraction",
      desc: "Vacuum-sealed within hours at source. No blends, no artificial flavors. Uncompromising purity from garden to cup.",
      img: brewingImg,
      num: "03"
    }
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#0A0A0A]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">

        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-barak-gold/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

        <motion.div style={{ x }} className="flex gap-12 px-[10vw]">

          {/* Intro Text Card (Static in horizontal layout) */}
          <div className="w-[80vw] md:w-[40vw] shrink-0 flex flex-col justify-center pr-12">
            <h2 className="text-5xl md:text-7xl font-playfair font-bold text-barak-cream leading-[1.1] mb-6">
              The <br /> Anatomy of <br /> <span className="gradient-gold">Perfection</span>
            </h2>
            <p className="text-barak-cream/60 font-light text-lg max-w-md">
              A journey through the craftsmanship that defines our legacy. Slide to explore our tenets.
            </p>
          </div>

          {/* Cards */}
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 h-[65vh] glass-panel-ultra group relative flex flex-col justify-end p-10 overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-barak-gold text-[80px] font-playfair font-black opacity-20 absolute -top-24 -left-4">
                  {card.num}
                </div>
                <h3 className="text-3xl font-playfair font-bold text-barak-cream mb-4">{card.title}</h3>
                <p className="text-barak-cream/70 font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Gold border pulse on hover */}
              <div className="absolute inset-0 border-2 border-barak-gold/0 group-hover:border-barak-gold/20 rounded-3xl transition-colors duration-700 pointer-events-none" />
            </div>
          ))}

          {/* Outro space */}
          <div className="w-[20vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
