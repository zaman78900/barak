import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import gardenImg from '../../assets/barak_cinematic_hero_bg.png';

export default function HeroCinematic() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Deep scroll target for continuous narrative transition
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 1. Slow camera push-in animation (starts at 1.0 and slowly zooms to 1.15 over 35 seconds)
  const entryBgScale = useMotionValue(1.0);
  const contentOpacity = useMotionValue(0);
  const contentScale = useMotionValue(1.05);

  useEffect(() => {
    // Camera push-in
    animate(entryBgScale, 1.15, {
      duration: 35,
      ease: [0.25, 0.1, 0.25, 1] // cubic bezier for smooth, unhurried ease
    });

    // Content fade in and subtle zoom out (scaling down to fit)
    animate(contentOpacity, 1.0, {
      duration: 2.2,
      ease: "easeOut",
      delay: 0.3
    });

    animate(contentScale, 1.0, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      delay: 0.3
    });
  }, [entryBgScale, contentOpacity, contentScale]);

  // 2. Parallax scroll transforms
  const scrollBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const finalBgScale = useTransform(
    [entryBgScale, scrollBgScale],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.3, 0]);

  // Content scroll transforms (translates up and fades out)
  const scrollContentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const finalContentOpacity = useTransform(
    [contentOpacity, scrollContentOpacity],
    ([latestEntry, latestScroll]) => latestEntry * latestScroll
  );
  
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-10%"]);

  // 3. Canvas Simulation: Gold Dust + Floating Tea Leaves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight;

    const setCanvasSize = () => {
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    setCanvasSize();

    const handleResize = () => {
      if (!canvas) return;
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    // Gold dust - glowing tiny particles rising up
    class GoldDust {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        // Pre-warm on screen if initial
        this.y = initial ? Math.random() * height : height + Math.random() * 50;
        
        const scale = width > 768 ? 1.5 : 1;
        const speedScale = height / 800; // normalized speed based on standard height
        
        this.size = (Math.random() * 1.5 + 0.5) * scale;
        this.speedY = (Math.random() * 0.6 + 0.2) * speedScale;
        this.speedX = (Math.random() * 0.2 - 0.1) * scale;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.015 + 0.003;
      }
      update() {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.2;
        
        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 154, 68, ${this.opacity})`; // Tea Gold
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = 'rgba(196, 154, 68, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Tea leaves - dark green silhouettes drifting/spinning
    class FloatingLeaf {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        // Pre-warm on screen if initial
        this.y = initial ? Math.random() * height : -50 - Math.random() * 100;
        
        const scale = width > 768 ? 1.3 : 1;
        const speedScale = height / 800;
        
        this.w = (Math.random() * 6 + 4) * scale;
        this.h = this.w * 1.6;
        this.speedY = (Math.random() * 0.4 + 0.2) * speedScale;
        this.speedX = (Math.random() * 0.5 - 0.25) * scale;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.015 - 0.007;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;
        if (this.y > height + 50 || this.x < -50 || this.x > width + 50) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -this.h / 2);
        ctx.quadraticCurveTo(this.w, 0, 0, this.h / 2);
        ctx.quadraticCurveTo(-this.w, 0, 0, -this.h / 2);
        ctx.fillStyle = `rgba(24, 51, 40, ${this.opacity})`; // Dark Emerald
        ctx.strokeStyle = `rgba(196, 154, 68, ${this.opacity * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    const goldDust = Array.from({ length: 45 }, () => new GoldDust());
    const leaves = Array.from({ length: 8 }, () => new FloatingLeaf());

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      goldDust.forEach(p => {
        p.update();
        p.draw();
      });

      leaves.forEach(l => {
        l.update();
        l.draw();
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const headingWords = "The Spirit of Assam".split(" ");

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full bg-[#070B08] overflow-hidden select-none">
      {/* Self-contained style block for high-fidelity overlays (Film grain noise + Sunlight Rays) */}
      <style dangerouslySetInnerHTML={{__html: `
        .cinematic-grain {
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200%;
          background: transparent url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E') repeat;
          opacity: 0.035;
          pointer-events: none;
          animation: grainShift 10s steps(10) infinite;
          z-index: 15;
        }

        .volumetric-rays {
          background: linear-gradient(135deg, rgba(196, 154, 68, 0.08) 0%, rgba(13, 27, 22, 0.03) 50%, transparent 100%);
          filter: blur(50px);
          animation: lightShimmer 15s ease-in-out infinite alternate;
          pointer-events: none;
        }

        @keyframes grainShift {
          0%, 100% { transform:translate(0, 0); }
          10% { transform:translate(-2%, -5%); }
          20% { transform:translate(-6%, 3%); }
          30% { transform:translate(4%, -10%); }
          40% { transform:translate(-2%, 8%); }
          50% { transform:translate(-7%, 4%); }
          60% { transform:translate(6%, 0%); }
          70% { transform:translate(0%, 5%); }
          80% { transform:translate(2%, 12%); }
          90% { transform:translate(-4%, 4%); }
        }

        @keyframes lightShimmer {
          0% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.7; transform: scale(1.08) rotate(1.5deg); }
          100% { opacity: 0.5; transform: scale(0.96) rotate(-1deg); }
        }
      `}} />

      {/* Cinematic Background Layer */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center w-full h-full"
        style={{ scale: finalBgScale, y: bgY, opacity: bgOpacity }}
      >
        <img 
          src={gardenImg} 
          alt="Assam Tea Estate at Sunrise" 
          className="w-full h-full object-cover object-center grayscale-[15%] brightness-[60%] contrast-[105%]"
        />
        {/* Natural Vignette and Ambient Color Grading Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B08] via-transparent to-[#070B08]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B08]/30 via-transparent to-[#070B08]/30" />
        {/* Deep Forest Green ambient filter */}
        <div className="absolute inset-0 bg-[#0D1B16]/15 mix-blend-color-burn pointer-events-none" />
      </motion.div>

      {/* Volumetric Sunlight Rays overlay */}
      <div className="absolute inset-0 z-1 volumetric-rays mix-blend-screen" />

      {/* Shifting Morning Mist (Semi-transparent drifting layers) */}
      <motion.div 
        className="absolute inset-0 z-2 pointer-events-none opacity-20 mix-blend-lighten"
        style={{ x: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
      >
        <div className="absolute bottom-[20%] left-[-20%] w-[140%] h-[30%] bg-gradient-to-r from-transparent via-[#F8F6F2]/10 to-transparent blur-[60px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[120%] h-[25%] bg-gradient-to-r from-transparent via-[#0D1B16]/20 to-transparent blur-[80px]" />
      </motion.div>

      {/* Active Organic Particle Canvas - Fades with scroll progress to prevent sharp cuts */}
      <motion.canvas 
        ref={canvasRef}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.75], [0.8, 0]) }}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Subtle Film Grain Noise */}
      <div className="cinematic-grain" />

      {/* Core Content Layer */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full text-center"
          style={{ opacity: finalContentOpacity, scale: contentScale, y: contentY }}
        >
          {/* Organic Breathing/Floating wrapper for the editorial text */}
          <motion.div
            className="flex flex-col items-center justify-center"
            animate={{
              y: [-6, 6, -6],
              rotate: [-0.15, 0.15, -0.15]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Small Label */}
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="text-[#C49A44] font-inter text-xs md:text-sm tracking-[0.45em] uppercase font-bold text-center block mb-4"
            >
              From the Heart of Assam
            </motion.span>

            {/* Large Heading - Mask Reveal & Elegant Editorial Font */}
            <h1 className="font-playfair text-[8vw] md:text-[5.5vw] font-black text-[#F8F6F2] leading-[1.05] tracking-tight text-center max-w-4xl flex justify-center flex-wrap gap-x-4 gap-y-1">
              {headingWords.map((word, idx) => (
                <span key={idx} className="relative overflow-hidden inline-block py-1">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.3,
                      delay: 0.4 + idx * 0.12,
                      ease: [0.16, 1, 0.3, 1] // Premium cubic bezier deceleration
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 1.1 }}
              className="text-[#F8F6F2]/75 font-inter text-sm md:text-base font-light leading-relaxed max-w-xl mt-6 text-center"
            >
              Crafted in the mist-covered gardens of Assam, every leaf carries generations of craftsmanship, purity, and unforgettable flavor.
            </motion.p>
          </motion.div>

          {/* Premium Non-salesy CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-10 pointer-events-auto"
          >
            <Link
              to="/shop"
              className="px-8 py-4 bg-[#C49A44] hover:bg-[#F8F6F2] text-[#070B08] rounded-full text-xs uppercase tracking-[0.25em] font-black transition-all duration-350 hover:shadow-[0_0_30px_rgba(196,154,68,0.35)] hover:scale-[1.03] inline-block cursor-pointer"
            >
              Begin the Journey
            </Link>
            <Link
              to="/our-story"
              className="px-8 py-4 border border-[#F8F6F2]/20 hover:border-[#C49A44]/40 bg-[#F8F6F2]/3 hover:bg-[#C49A44]/5 backdrop-blur-glass rounded-full text-xs uppercase tracking-[0.25em] font-bold text-[#F8F6F2] hover:text-[#C49A44] transition-all duration-350 inline-block cursor-pointer"
            >
              Explore Our Story
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient Bottom Gradient to blend into the next section */}
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-[#070B08] to-transparent z-2 pointer-events-none" />

      {/* Scroll Call to Action */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]) }}
      >
        <span className="text-[9px] font-inter uppercase tracking-[0.45em] text-[#F8F6F2]/50 font-bold">Descend</span>
        <div className="w-[1px] h-14 bg-[#F8F6F2]/15 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-[#C49A44]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
