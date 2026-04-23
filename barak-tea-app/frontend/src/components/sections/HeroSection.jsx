import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, CaretDown } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouseX = canvas.width / 2;
    this.mouseY = canvas.height / 2;
    this.width = canvas.width;
    this.height = canvas.height;

    this.initParticles();
    this.animate();

    // Mouse interaction (only if no reduced motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
    }
  }

  initParticles() {
    const count = window.innerWidth > 768 ? 30 : 15;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.particles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;

      // Mouse repel effect
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = 150;

      if (dist < minDist) {
        const force = (minDist - dist) / minDist;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      // Bounce boundaries
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) {
        p.y = this.height;
        p.vx = (Math.random() - 0.5) * 0.5;
      }

      // Draw particle
      this.ctx.fillStyle = `rgba(200, 146, 42, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }
}

export default function HeroSection() {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current) {
        particlesRef.current.resize(canvas.width, canvas.height);
      }
    };

    updateCanvasSize();
    particlesRef.current = new ParticleSystem(canvas);

    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const words = ['The Finest CTC Tea', 'from Barak Valley'];

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-barak-bg to-barak-surface">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/40" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overline */}
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <span className="text-xs md:text-sm font-bold text-barak-cream uppercase tracking-widest">
            Premium CTC from Barak Valley
          </span>
        </motion.div>

        {/* Hero Headline - Word by word animation */}
        <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 md:mb-8">
          {words.map((word, wordIdx) => (
            <div key={wordIdx} className="inline-block">
              {word.split(' ').map((w, i) => (
                <motion.span
                  key={`${wordIdx}-${i}`}
                  variants={wordVariants}
                  className={wordIdx === 1 ? 'gradient-gold' : 'text-barak-cream'}
                >
                  {w}{' '}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-barak-muted max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed"
        >
          Hand-sourced from the lush gardens of Silchar, Assam. Pure, fresh, crafted for the perfect chai.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8 md:mb-12"
        >
          <button 
            onClick={() => navigate('/shop')}
            className="glass group px-8 py-4 rounded-lg font-semibold text-barak-cream hover:text-barak-gold-light border border-barak-gold hover:border-barak-gold-light transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Shop Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => window.location.href = 'https://wa.me/919999999999?text=Hello%20BARAK%20Tea'}
            className="bg-barak-gold text-barak-bg px-8 py-4 rounded-lg font-semibold hover:bg-barak-gold-light transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Order on WhatsApp
          </button>
        </motion.div>

        {/* Trust Row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs md:text-sm text-barak-cream"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">★★★★★</span>
            <span className="text-barak-muted">Trusted Nationwide</span>
          </div>
          <div className="hidden md:block h-6 w-px bg-barak-border" />
          <div>Free Delivery above ₹499</div>
          <div className="hidden md:block h-6 w-px bg-barak-border" />
          <div>100% Natural CTC</div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CaretDown size={24} className="text-barak-gold" />
      </motion.div>
    </section>
  );
}
