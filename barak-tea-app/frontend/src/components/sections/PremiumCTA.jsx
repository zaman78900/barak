import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function MagneticButton({ children, onClick, className }) {
  const buttonRef = useRef(null);
  
  // Smooth spring motion values for magnetic offset
  const x = useSpring(0, { stiffness: 120, damping: 15 });
  const y = useSpring(0, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Calculate button center coordinate
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    // Distance from mouse to button center
    const distanceX = clientX - buttonCenterX;
    const distanceY = clientY - buttonCenterY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const threshold = 120; // 120px radius trigger

    if (distance < threshold) {
      // Pull button towards cursor (35% pull intensity)
      x.set(distanceX * 0.35);
      y.set(distanceY * 0.35);
    } else {
      // Release spring
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      style={{ x, y }}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function PremiumCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 md:py-40 bg-[#050505] overflow-hidden z-20 border-t border-white/5">
      
      {/* Background Volumetric Glow & Light Leak */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-barak-gold/5 via-barak-success/2 to-transparent blur-[140px] pointer-events-none" />

      {/* Static grid background pattern overlay for fine luxury texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Tag */}
          <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.4em] mb-6 block">
            Begin the Experience
          </span>

          {/* Heading */}
          <h2 className="font-playfair text-5xl md:text-7xl lg:text-8vw font-black text-barak-cream leading-[0.95] tracking-tighter mb-12 max-w-4xl">
            ELEVATE YOUR <br /> DAILY RITUAL
          </h2>

          <p className="text-barak-muted font-inter text-sm md:text-base font-light leading-relaxed mb-14 max-w-lg">
            Experience the finest single-origin tea harvested from the heart of the Barak Valley. Embark on a premium sensory journey today.
          </p>

          {/* Magnetic CTA Button */}
          <MagneticButton
            onClick={() => navigate('/shop')}
            className="px-12 py-5 bg-barak-gold text-[#050505] rounded-full text-xs uppercase tracking-widest font-black transition-shadow duration-300 hover:shadow-gold-glow-large select-none hover:bg-white hover:text-black"
          >
            Explore the Collection
          </MagneticButton>

        </motion.div>
      </div>

      {/* Decorative horizontal gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-barak-gold/15 to-transparent" />
    </section>
  );
}
