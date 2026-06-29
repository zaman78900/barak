import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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

function StoryRow({ stage, idx }) {
  const rowRef = useRef(null);
  const isEven = idx % 2 === 0;

  // Track scroll position for this specific row
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });

  const sp = useSpring(scrollYProgress, { stiffness: 45, damping: 15 });

  // High-fidelity parallax values (using spring-smoothed sp)
  const yImg = useTransform(sp, [0, 1], ["-12%", "12%"]);
  const scaleImg = useTransform(sp, [0, 1], [1.18, 1.02]);
  const yText = useTransform(sp, [0, 1], ["6%", "-6%"]);
  
  // Row reveal transforms (using spring-smoothed sp for ultra fluid motion)
  const rowOpacity = useTransform(sp, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rowY = useTransform(sp, [0, 0.2, 0.8, 1], ["50px", "0px", "0px", "-50px"]);

  // Left border draw effect
  const borderScaleY = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  // Large background number slide-in
  const numberX = useTransform(scrollYProgress, [0, 0.45], [isEven ? -60 : 60, 0]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 0.08]);

  const titleWords = stage.title.split(" ");

  return (
    <motion.div 
      ref={rowRef}
      style={{ opacity: rowOpacity, y: rowY }}
      className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative w-full py-8 md:py-16"
    >
      
      {/* Media Card with Parallax Image */}
      <div className={`w-full lg:w-3/5 aspect-[16/10] rounded-3xl overflow-hidden relative group border border-white/5 shadow-glass bg-white/2 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B08]/80 via-transparent to-transparent z-10 pointer-events-none" />
        
        {/* Shiver shine sheen on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none z-10" />

        <motion.img 
          style={{ y: yImg, scale: scaleImg }}
          src={stage.img} 
          alt={stage.title} 
          className="w-full h-[124%] absolute top-[-12%] object-cover grayscale-[15%] brightness-90 transition-[filter,brightness] duration-700 group-hover:grayscale-0 group-hover:brightness-100"
        />
        
        {/* Floating Tag */}
        <div className="absolute top-6 left-6 z-20 bg-[#070B08]/70 backdrop-blur-glass border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#C49A44]">
            {stage.tag}
          </span>
        </div>
      </div>

      {/* Text Editorial Content */}
      <div className={`w-full lg:w-2/5 flex flex-col justify-center relative pl-0 lg:pl-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <motion.div
          style={{ y: yText }}
          className="relative pl-8 md:pl-10 py-4"
        >
          {/* Dynamically drawing gold line marker */}
          <motion.div 
            style={{ scaleY: borderScaleY }}
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C49A44] via-[#183328] to-transparent origin-top"
          />

          {/* Staggered Number Counter */}
          <motion.span 
            style={{ x: numberX, opacity: numberOpacity }}
            className="font-playfair text-[100px] md:text-[150px] font-black absolute -top-24 left-2 pointer-events-none select-none text-[#C49A44] leading-none font-bold"
          >
            {stage.phase}
          </motion.span>

          {/* Staggered Word Reveal for Title */}
          <h3 className="text-3xl md:text-4xl font-playfair font-black text-[#F8F6F2] mb-4 relative z-10 leading-tight flex flex-wrap gap-x-2">
            {titleWords.map((word, wIdx) => (
              <span key={wIdx} className="relative overflow-hidden inline-block py-0.5">
                <motion.span
                  initial={{ y: "105%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 1.1,
                    delay: wIdx * 0.08,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h3>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
            className="text-[#F8F6F2]/70 font-inter text-sm md:text-base font-light leading-relaxed relative z-10"
          >
            {stage.description}
          </motion.p>
        </motion.div>
      </div>

    </motion.div>
  );
}

export default function AssamStory() {
  const headingWords = "The Journey from Estate to Cup".split(" ");

  return (
    <section className="py-28 md:py-40 bg-[#070B08] relative overflow-hidden z-20">
      {/* Background Volumetric Ambience */}
      <div className="absolute top-1/4 left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#0D1B16]/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#C49A44]/3 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-left relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[#C49A44] text-[10px] uppercase font-bold tracking-[0.45em] mb-4 block"
        >
          A Cinematic Legacy
        </motion.span>

        <h2 className="text-4xl md:text-6xl font-playfair font-black text-[#F8F6F2] max-w-3xl leading-tight flex flex-wrap gap-x-4">
          {headingWords.map((word, idx) => (
            <span key={idx} className="relative overflow-hidden inline-block py-1">
              <motion.span
                initial={{ y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 1.2,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 144 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-[1px] bg-[#C49A44]/35 mt-8"
        />
      </div>

      {/* Story Sections */}
      <div className="flex flex-col gap-24 md:gap-36 max-w-7xl mx-auto px-6 relative z-10">
        {storyStages.map((stage, idx) => (
          <StoryRow key={idx} stage={stage} idx={idx} />
        ))}
      </div>
    </section>
  );
}
