import React from 'react';
import { motion } from 'framer-motion';
import gardenImg from '../../assets/barak_tea_garden.png';
import pluckingImg from '../../assets/barak_tea_plucking.png';
import handsImg from '../../assets/blog_plucker_hands.png';
import terroirImg from '../../assets/blog_soil_terroir.png';
import cupImg from '../../assets/barak_brewed_cup.png';

const storyStages = [
  {
    phase: "01",
    tag: "Terroir",
    title: "Morning Mist of Silchar",
    description: "Our garden is blanketed by thick morning fog rising off the Barak River. This unique microclimate preserves natural leaf oils and nurtures a slower, richer growing cycle.",
    img: gardenImg
  },
  {
    phase: "02",
    tag: "The Harvest",
    title: "Second-Flush Harvest",
    description: "During the peak summer flushes, our pluckers selectively gather leaves at their absolute zenith of maturity. It takes thousands of hand-plucks to fill a single golden basket.",
    img: pluckingImg
  },
  {
    phase: "03",
    tag: "Craftsmanship",
    title: "The Plucker's Touch",
    description: "Taught by generations before them, our craftspeople inspect every single sprig. Purity is maintained entirely by human touch, weeding out any imperfections at source.",
    img: handsImg
  },
  {
    phase: "04",
    tag: "Terroir",
    title: "Soil and Acidic Clay",
    description: "The distinct, mineral-dense acidic soil of the Barak Valley imparts a bold, full-bodied CTC character, leading to a deep amber infusion with a brisk, malty finish.",
    img: terroirImg
  },
  {
    phase: "05",
    tag: "Delivery",
    title: "The Finished Ritual",
    description: "From our private processing house directly to your table. Packed, sealed, and shipped worldwide to deliver a piece of the valley's soul to your daily cup.",
    img: cupImg
  }
];

export default function AssamStory() {
  return (
    <section className="py-24 md:py-36 bg-[#050505] relative overflow-hidden z-20">
      
      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-left">
        <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-4 block">
          A Cinematic Legacy
        </span>
        <h2 className="text-4xl md:text-6xl font-playfair font-black text-barak-cream max-w-2xl leading-tight">
          The Journey from Estate to Cup
        </h2>
        <div className="h-[1px] w-36 bg-barak-gold/30 mt-8" />
      </div>

      {/* Story Sections */}
      <div className="flex flex-col gap-32 md:gap-48 max-w-7xl mx-auto px-6">
        {storyStages.map((stage, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 relative w-full`}
            >
              
              {/* Media Card with Parallax Scale */}
              <div className="w-full lg:w-3/5 aspect-[16/10] rounded-3xl overflow-hidden relative group border border-white/5 shadow-glass bg-white/2">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <motion.img 
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                  src={stage.img} 
                  alt={stage.title} 
                  className="w-full h-full object-cover grayscale-[20%] brightness-90 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-6 left-6 z-20 bg-[#050505]/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                  <span className="text-[9px] uppercase tracking-widest font-black text-barak-gold">
                    {stage.tag}
                  </span>
                </div>
              </div>

              {/* Text Editorial Content */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  className="relative pl-6 md:pl-8 border-l border-barak-gold/20"
                >
                  {/* Phase Counter */}
                  <span className="font-playfair text-[80px] font-black opacity-10 absolute -top-16 left-2 pointer-events-none select-none text-barak-gold">
                    {stage.phase}
                  </span>

                  <h3 className="text-2xl md:text-3.5xl font-playfair font-bold text-barak-cream mb-4 relative z-10 leading-snug">
                    {stage.title}
                  </h3>
                  
                  <p className="text-barak-muted font-inter text-sm md:text-base font-light leading-relaxed relative z-10">
                    {stage.description}
                  </p>
                </motion.div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
