import React from 'react';
import { motion } from 'framer-motion';
import gardenImg from '../../assets/barak_tea_garden.png';
import pluckingImg from '../../assets/barak_tea_plucking.png';
import brewingImg from '../../assets/blog_chai_brewing.png';

export default function FeatureBento() {
  const features = [
    {
      num: '01',
      tag: 'TERROIR',
      title: 'The Silchar Terroir',
      description: 'Nurtured by the unique microclimate, acidic soil, and high humidity of Barak Valley, creating an unmistakably bold character.',
      img: gardenImg,
      size: 'large',
    },
    {
      num: '02',
      tag: 'CRAFT',
      title: 'Plucked by Hand',
      description: 'Only the top two leaves and a bud, selected by second-generation pluckers during peak harvest flushes.',
      img: pluckingImg,
      size: 'small',
    },
    {
      num: '03',
      tag: 'PURITY',
      title: 'Pure Origin CTC',
      description: 'Vacuum-sealed within hours at source. No blends, no artificial flavors, no preservatives.',
      img: brewingImg,
      size: 'small',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section className="py-24 md:py-36 px-4 bg-[#080808] relative z-10 border-t border-rgba(200,146,42,0.05)">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-3">
              Craftsmanship Standards
            </p>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-barak-cream leading-tight">
              The Tenets of Premium Quality
            </h2>
          </div>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-rgba(200,146,42,0.15) to-transparent mx-8 hidden md:block" />
          <p className="text-xs text-barak-cream text-opacity-50 max-w-[280px] font-light leading-relaxed mt-4 md:mt-0">
            Every step is designed for engineering precision and sensory perfection.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, idx) => {
            const isLarge = feature.size === 'large';
            
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative rounded-3xl overflow-hidden group border border-[rgba(255,255,255,0.05)] bg-[rgba(10,10,10,0.5)] backdrop-blur-md transition-all duration-500 hover:border-[rgba(200,146,42,0.3)] hover:shadow-glass-hover flex flex-col justify-end ${
                  isLarge 
                    ? 'md:col-span-7 h-[450px] md:h-[600px]' 
                    : 'md:col-span-5 h-[450px] md:h-[600px]'
                }`}
              >
                {/* Background Image with Zoom Parallax effect on hover */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-out opacity-45 group-hover:opacity-60"
                  />
                  {/* Luxury Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end h-full">
                  {/* Serif Luxury Index */}
                  <div className="text-[64px] font-playfair font-black text-barak-gold text-opacity-10 leading-none mb-4 group-hover:text-opacity-20 transition-all duration-500">
                    {feature.num}
                  </div>
                  
                  {/* Tagline */}
                  <span className="text-[9px] uppercase font-bold text-barak-gold tracking-[0.25em] mb-2 block">
                    {feature.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-playfair font-bold text-barak-cream mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-barak-cream text-opacity-60 leading-relaxed font-light max-w-[360px] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Volumetric Glow in Card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-barak-gold/0 via-barak-gold/0 to-barak-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

