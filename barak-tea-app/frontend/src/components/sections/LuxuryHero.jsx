import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import productPacketImg from '../../assets/product_packet.png';

export default function LuxuryHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Spring animation values for cursor-based parallax
  const mouseXSpring = useSpring(0, { stiffness: 60, damping: 15 });
  const mouseYSpring = useSpring(0, { stiffness: 60, damping: 15 });

  // Transform values for the floating tea packet based on cursor position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);
  const packetTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]);
  const packetTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]);

  // Transform values for light/glow parallax
  const glowTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], [-40, 40]);
  const glowTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], [-40, 40]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
      
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });

      mouseXSpring.set(x);
      mouseYSpring.set(y);
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseXSpring, mouseYSpring]);

  // Canvas particle logic (Tea leaves, golden dust, aroma smoke)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Classes
    class GoldDust {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.fadeSpeed = 0.002;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        // Dissolve as it rises
        if (this.y < canvas.height * 0.1) {
          this.opacity -= this.fadeSpeed;
        }

        if (this.y < 0 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 146, 42, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(200, 146, 42, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      }
    }

    class TeaLeafParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : -20;
        this.width = Math.random() * 12 + 6;
        this.height = this.width * 1.8;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
        this.speedY = Math.random() * 0.6 + 0.4;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;

        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        
        // Draw stylized vector tea leaf
        ctx.moveTo(0, -this.height / 2);
        ctx.quadraticCurveTo(this.width, 0, 0, this.height / 2);
        ctx.quadraticCurveTo(-this.width, 0, 0, -this.height / 2);
        
        ctx.fillStyle = `rgba(32, 85, 54, ${this.opacity})`;
        ctx.strokeStyle = `rgba(200, 146, 42, ${this.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // Instantiation
    const dustCount = 45;
    const leafCount = 12;
    const dustParticles = [];
    const leafParticles = [];

    for (let i = 0; i < dustCount; i++) dustParticles.push(new GoldDust());
    for (let i = 0; i < leafCount; i++) leafParticles.push(new TeaLeafParticle());

    // Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw
      dustParticles.forEach(p => {
        p.update();
        p.draw();
      });
      
      leafParticles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const headingText = "BARAK";
  const subheadingText = "VALLEY OF THE GOLDEN LEAF";

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden pt-20 cursor-default select-none animate-fade-in"
    >
      {/* 1. Volumetric lighting and gradient backgrounds */}
      <div className="absolute inset-0 z-0 bg-radial-gradient" style={{
        background: `radial-gradient(circle at 50% 50%, #0d1a12 0%, #050505 85%)`
      }} />

      {/* Parallax Glowing Volumetric Ambience */}
      <motion.div 
        style={{ x: glowTranslateX, y: glowTranslateY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-barak-gold/8 via-barak-success/4 to-transparent blur-[120px] pointer-events-none z-0"
      />

      {/* Interactive Cursor light spotlight overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(200, 146, 42, 0.12), transparent 80%)`
        }}
      />

      {/* 2. Interactive Canvas for Particles & Leaves */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
      />

      {/* 3. Main Hero Content Layout */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-16">
        
        {/* Left Column: Premium Editorial Copy */}
        <div className="flex flex-col text-left max-w-2xl order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="h-[1px] w-8 bg-barak-gold" />
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-barak-gold">
              {subheadingText}
            </span>
          </motion.div>

          <h1 className="font-playfair text-[12vw] lg:text-[7.5vw] font-black text-barak-cream leading-[0.85] tracking-tighter mb-6">
            {headingText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.08, 
                  ease: [0.215, 0.610, 0.355, 1] 
                }}
                className="inline-block origin-bottom mr-1"
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-barak-muted font-inter text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg"
          >
            Nurtured by the morning mist of Barak Valley. Crafting a bold, full-bodied CTC legacy of unparalleled character, luxury, and visual theater.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-4 bg-barak-gold text-[#050505] rounded-full text-xs uppercase tracking-widest font-black transition-all duration-350 hover:bg-white hover:shadow-gold-glow-large hover:scale-[1.02]">
              Shop the Collection
            </button>
            <button className="px-8 py-4 border border-white/10 hover:border-barak-gold/40 bg-white/5 backdrop-blur-md rounded-full text-xs uppercase tracking-widest font-bold text-barak-cream transition-all duration-350 hover:bg-white/10">
              Our Craftsmanship
            </button>
          </motion.div>
        </div>

        {/* Right Column: Floating Product Presentation */}
        <div className="relative w-full max-w-md lg:max-w-xl aspect-square flex items-center justify-center order-1 lg:order-2">
          
          {/* Backing Ambient Pedestal Ring Glow */}
          <motion.div 
            style={{ x: packetTranslateX, y: packetTranslateY }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-barak-gold/10 to-transparent blur-3xl pointer-events-none"
          />

          {/* Interactive floating product packet */}
          <motion.div
            style={{ 
              rotateX, 
              rotateY, 
              x: packetTranslateX, 
              y: packetTranslateY,
              transformStyle: "preserve-3d" 
            }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut",
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative z-20 w-[60%] md:w-[50%] aspect-[3/4] flex items-center justify-center origin-center cursor-pointer"
          >
            <img 
              src={productPacketImg} 
              alt="BARAK Premium Tea Pack" 
              className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              style={{ transform: "translateZ(30px)" }}
            />
            
            {/* Glossy shine reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl mix-blend-overlay pointer-events-none" />
          </motion.div>

          {/* Pedestal Bottom Reflection Shadow */}
          <motion.div 
            style={{ x: packetTranslateX }}
            className="absolute bottom-10 w-[55%] h-[12px] bg-black/80 rounded-full blur-[8px] pointer-events-none opacity-80"
          />
        </div>

      </div>

      {/* Fine Gold Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-barak-gold/15 to-transparent" />
    </section>
  );
}
