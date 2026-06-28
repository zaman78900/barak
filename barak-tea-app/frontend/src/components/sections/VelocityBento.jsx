import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import gardenImg from '../../assets/barak_tea_garden.png';
import pluckingImg from '../../assets/barak_tea_plucking.png';
import brewingImg from '../../assets/blog_chai_brewing.png';

export default function VelocityBento() {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setScrollRange(scrollRef.current.scrollWidth - window.innerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(handleResize);
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);
  
  // Horizontal scroll
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Velocity-based physical tilt
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Convert scroll velocity to a skew/rotation degree
  const skewVelocity = useTransform(smoothVelocity, [-1000, 0, 1000], [5, 0, -5]);

  const cards = [
    { num: '01', title: 'Terroir', desc: 'The rich, acidic soil of the Barak Valley.', img: gardenImg },
    { num: '02', title: 'Craft', desc: 'Two leaves and a bud, plucked by hand.', img: pluckingImg },
    { num: '03', title: 'Purity', desc: 'Vacuum-sealed at source immediately.', img: brewingImg },
  ];

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-[#0a0a0a]">
        
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,146,42,0.1),transparent_50%)] pointer-events-none" />

        <motion.div ref={scrollRef} style={{ x }} className="flex gap-16 px-[10vw]">
          
          <div className="w-[80vw] md:w-[40vw] shrink-0 flex flex-col justify-center">
            <p className="text-barak-gold text-xs tracking-[0.4em] uppercase font-bold mb-4">
              The Blueprint
            </p>
            <h2 className="text-5xl md:text-7xl font-playfair font-black text-white leading-[1.1]">
              Engineered <br/> for the <br/> <span className="italic text-barak-gold/80">Senses.</span>
            </h2>
          </div>

          {cards.map((card, i) => (
            <motion.div 
              key={i}
              style={{ skewX: skewVelocity }}
              className="w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 h-[65vh] relative rounded-3xl overflow-hidden group cursor-pointer border border-white/5 bg-black/40 backdrop-blur-xl"
            >
              <div className="absolute inset-0 z-0">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 p-10 h-full flex flex-col justify-end transform group-hover:-translate-y-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <span className="text-[100px] font-playfair font-black text-barak-gold/20 absolute top-4 right-8 pointer-events-none">
                  {card.num}
                </span>
                <h3 className="text-3xl font-playfair font-bold text-white mb-4">{card.title}</h3>
                <p className="text-white/60 font-light leading-relaxed max-w-sm">
                  {card.desc}
                </p>
              </div>

              <div className="absolute inset-0 border-[1.5px] border-barak-gold/0 group-hover:border-barak-gold/30 rounded-3xl transition-colors duration-700 pointer-events-none" />
            </motion.div>
          ))}
          
          <div className="w-[10vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
