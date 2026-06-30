import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * HERO — Full JS-Canvas Cinematic Experience
 * ────────────────────────────────────────────────────────────────
 * JS-driven effects:
 *  1. Canvas: Animated steaming mist / vapor rising from bottom
 *  2. Canvas: Glowing orb that follows mouse with spring physics
 *  3. Canvas: Aurora-like shifting colour waves in background
 *  4. Magnetic letter-by-letter 3D rotation on hover
 *  5. Mouse-parallax depth layers (3 depth planes)
 *  6. Scroll-linked fade+scale out
 *  7. Breathing radial pulse rings on load
 *  8. WebGL-style gradient orb with noise animation (pure canvas)
 */
export default function HeroAtmospheric() {
  const sectionRef = useRef(null);
  const bgCanvasRef = useRef(null);
  
  // Use MotionValues to bypass React re-renders on mousemove
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const navigate = useNavigate();

  // Smooth spring mouse for parallax layers
  const springConfig = { stiffness: 50, damping: 18, mass: 1 };
  const mx = useSpring(0, springConfig);
  const my = useSpring(0, springConfig);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const yContent    = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scaleHero   = useTransform(scrollYProgress, [0, 0.5], [1, 0.94]);

  // ── Track mouse ──────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseX.set(nx);
      mouseY.set(ny);
      mx.set((nx - 0.5) * 2);
      my.set((ny - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my, mouseX, mouseY]);

  // ── Background Canvas: Aurora waves + Mist + Orb ─────────────
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = 0, H = 0;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Mist particles — rise from bottom (atmospheric steam)
    class MistParticle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x     = Math.random() * W;
        this.y     = init ? H - Math.random() * H * 0.4 : H + 30;
        
        const scale = W > 768 ? 1.5 : 1.0;
        const speedScale = Math.max(1, H / 800);
        
        this.r     = (Math.random() * 80 + 40) * scale;
        this.vy    = -(Math.random() * 0.35 + 0.15) * speedScale;
        this.vx    = (Math.random() - 0.5) * 0.2 * scale;
        this.alpha = 0;
        this.targetAlpha = Math.random() * 0.06 + 0.015;
        this.life  = 0;
        this.maxLife = 300 + Math.random() * 400;
      }
      update() {
        this.life++;
        this.y += this.vy;
        this.x += this.vx;
        // Fade in then out
        if (this.life < 60) {
          this.alpha = (this.life / 60) * this.targetAlpha;
        } else if (this.life > this.maxLife - 80) {
          this.alpha = ((this.maxLife - this.life) / 80) * this.targetAlpha;
        } else {
          this.alpha = this.targetAlpha;
        }
        if (this.life >= this.maxLife || this.y < -100) this.reset(false);
      }
      draw() {
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        grad.addColorStop(0, `rgba(180,220,190,${this.alpha})`);
        grad.addColorStop(0.4, `rgba(80,140,100,${this.alpha * 0.5})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const mist = Array.from({ length: 28 }, () => new MistParticle());

    // Aurora wave points
    const AURORA_LINES = 4;
    const AURORA_POINTS = 8;
    const auroraOffsets = Array.from({ length: AURORA_LINES }, (_, li) =>
      Array.from({ length: AURORA_POINTS }, (__, pi) => ({
        phase: Math.random() * Math.PI * 2,
        freq:  0.0005 + li * 0.0002 + Math.random() * 0.0003,
        amp:   15 + Math.random() * 25,
        offset: (li * H * 0.18) + H * 0.35,
      }))
    );

    const drawAurora = (time) => {
      const auroraColors = [
        [12, 55, 35, 0.03],
        [20, 80, 50, 0.025],
        [8,  40, 28, 0.02],
        [35, 90, 55, 0.015],
      ];

      auroraOffsets.forEach((points, li) => {
        const [r, g, b, baseA] = auroraColors[li];
        const step = W / (AURORA_POINTS - 1);

        ctx.beginPath();
        ctx.moveTo(0, H);

        // Draw wavy curve
        const ys = points.map((p, pi) => {
          p.phase += p.freq;
          return p.offset + Math.sin(p.phase + pi * 0.7) * p.amp;
        });

        ctx.moveTo(0, ys[0]);
        for (let pi = 1; pi < AURORA_POINTS - 1; pi++) {
          const cx = (pi - 0.5) * step;
          const cy = (ys[pi - 1] + ys[pi]) / 2;
          ctx.quadraticCurveTo(cx, (ys[pi - 1]), pi * step, ys[pi]);
        }
        ctx.lineTo(W, H * 1.5);
        ctx.lineTo(0, H * 1.5);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.85);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${baseA})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    // Large breathing orb in center — like a glowing ember
    const drawBreathOrb = (time) => {
      const cx = W * 0.5;
      const cy = H * 0.52;
      const breathe = Math.sin(time * 0.0008) * 0.15 + 1;
      const r = Math.min(W, H) * 0.32 * breathe;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(18, 55, 32, 0.22)`);
      grad.addColorStop(0.35, `rgba(12, 38, 22, 0.14)`);
      grad.addColorStop(0.65, `rgba(8, 22, 14, 0.06)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Gold rim pulse
      const goldR = r * 0.65 * (1 + Math.sin(time * 0.0012) * 0.05);
      const goldGrad = ctx.createRadialGradient(cx, cy, goldR * 0.7, cx, cy, goldR);
      goldGrad.addColorStop(0, 'transparent');
      goldGrad.addColorStop(0.7, `rgba(180, 130, 30, 0.04)`);
      goldGrad.addColorStop(1, `rgba(200, 146, 42, 0.08)`);
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, goldR, 0, Math.PI * 2);
      ctx.fill();
    };

    // Pulse rings emanating from center
    let rings = [];
    let ringTimer = 0;
    const addRing = () => {
      rings.push({ r: 60, alpha: 0.18, speed: 0.8 });
    };
    addRing();

    const drawRings = () => {
      const cx = W * 0.5;
      const cy = H * 0.52;
      rings = rings.filter(ring => ring.alpha > 0.002);
      rings.forEach(ring => {
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 146, 42, ${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ring.r     += ring.speed;
        ring.alpha -= 0.0012;
      });
    };

    const animate = (now) => {
      animId = requestAnimationFrame(animate);
      t = now;

      ctx.clearRect(0, 0, W, H);

      // Base deep dark gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#050505');
      bg.addColorStop(0.4, '#080d08');
      bg.addColorStop(0.7, '#0a110a');
      bg.addColorStop(1, '#050505');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Aurora waves
      drawAurora(now);

      // Center breathing orb
      drawBreathOrb(now);

      // Mist clouds
      mist.forEach(p => { p.update(); p.draw(); });

      // Pulse rings
      ringTimer++;
      if (ringTimer % 140 === 0) addRing();
      drawRings();
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Parallax depth layers ─────────────────────────────────────
  const layer1X = useTransform(mx, [-1, 1], ['-18px', '18px']);
  const layer1Y = useTransform(my, [-1, 1], ['-12px', '12px']);
  const layer2X = useTransform(mx, [-1, 1], ['-8px',  '8px']);
  const layer2Y = useTransform(my, [-1, 1], ['-5px',  '5px']);

  const headline = ['B', 'A', 'R', 'A', 'K'];

  // Motion template for the radial gradient spotlight so it updates without React renders
  const radialSpotlight = useMotionTemplate`radial-gradient(600px circle at ${useTransform(mouseX, x => x * 100)}% ${useTransform(mouseY, y => y * 100)}%,
    rgba(200,146,42,0.09) 0%,
    rgba(20,80,45,0.05) 35%,
    transparent 70%
  )`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#050505' }}
    >
      {/* ── BG Canvas: Aurora + Mist + Orb ──────────────────────── */}
      <canvas
        ref={bgCanvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* ── Mouse-spotlight: interactive radial light ─────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: radialSpotlight,
        }}
      />

      {/* ── Depth layer 1 (far — faint gold orbs) ─────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{ x: layer1X, y: layer1Y, zIndex: 3 }}
        className="absolute inset-0 pointer-events-none"
      >
        {[
          { top: '15%', left: '8%',  size: 280, opacity: 0.025, color: 'rgba(200,146,42,1)' },
          { top: '60%', right: '6%', size: 340, opacity: 0.02,  color: 'rgba(40,120,70,1)' },
          { top: '40%', left: '60%', size: 200, opacity: 0.03,  color: 'rgba(200,146,42,1)' },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: orb.top, left: orb.left, right: orb.right,
              width: orb.size, height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              opacity: orb.opacity,
              filter: 'blur(40px)',
              animation: `breathe-glow ${7 + i * 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      {/* ── Depth layer 2 (mid — fine grid lines) ─────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{ x: layer2X, y: layer2Y, zIndex: 4 }}
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,146,42,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,146,42,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: yContent, opacity: opacityHero, scale: scaleHero, zIndex: 20 }}
        className="relative flex flex-col items-center text-center px-6 w-full max-w-6xl mx-auto pt-24"
      >
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center gap-4 mb-10"
        >
          <motion.span
            animate={{ width: ['0px', '48px'] }}
            transition={{ duration: 1, delay: 0.8 }}
            className="block h-px bg-barak-gold opacity-70 overflow-hidden"
          />
          <span className="font-inter text-[10px] uppercase tracking-[0.55em] text-barak-gold font-bold">
            Single Origin · Barak Valley, Assam
          </span>
          <motion.span
            animate={{ width: ['0px', '48px'] }}
            transition={{ duration: 1, delay: 0.8 }}
            className="block h-px bg-barak-gold opacity-70 overflow-hidden"
          />
        </motion.div>

        {/* ── GIANT WORDMARK ── each letter is an independent element */}
        <h1
          aria-label="BARAK Tea — Premium Assam CTC Tea from Barak Valley"
          className="relative flex items-center justify-center gap-1 md:gap-2 mb-0 select-none overflow-visible"
          style={{ lineHeight: 0.85 }}
        >
          {headline.map((char, i) => (
            <LetterBlock key={i} char={char} index={i} total={headline.length} mx={mx} my={my} />
          ))}
        </h1>

        {/* TEA — small word nestled under BARAK */}
        <motion.div
          initial={{ opacity: 0, y: 10, letterSpacing: '1em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.55em' }}
          transition={{ duration: 1.4, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter font-bold text-barak-gold uppercase mt-3 mb-0"
          style={{ fontSize: 'clamp(11px, 1.8vw, 18px)', letterSpacing: '0.55em' }}
        >
          Tea
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 font-cormorant text-barak-cream/65 italic text-center"
          style={{ fontSize: 'clamp(18px, 3.5vw, 38px)', letterSpacing: '0.01em', lineHeight: 1.3 }}
        >
          From the mist of Barak Valley
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-3 font-inter text-barak-muted text-[11px] md:text-xs tracking-[0.3em] uppercase"
        >
          Hand-plucked · Single estate · Premium CTC Tea
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="flex flex-col sm:flex-row gap-4 mt-14"
        >
          <button
            onClick={() => navigate('/shop')}
            data-cursor="Shop"
            className="group relative px-10 py-4 rounded-full text-[11px] uppercase tracking-widest font-black overflow-hidden"
            style={{ background: '#C8922A', color: '#050505' }}
          >
            <span className="relative z-10">Shop the Collection</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, #E8B84B, #C8922A)' }}
            />
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ boxShadow: '0 0 40px rgba(200,146,42,0.6), 0 0 80px rgba(200,146,42,0.3)' }}
            />
          </button>
          <button
            onClick={() => navigate('/our-story')}
            data-cursor="Story"
            className="px-10 py-4 border border-white/10 hover:border-barak-gold/50 rounded-full text-[11px] uppercase tracking-widest font-bold text-barak-cream transition-all duration-400 hover:bg-white/5 backdrop-blur-sm"
          >
            Our Valley Story
          </button>
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        style={{ opacity: opacityHero, zIndex: 20 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.span
          className="font-inter text-[9px] uppercase tracking-[0.45em] text-barak-gold/50"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <div className="relative w-px h-14 overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-white/5 rounded-full" />
          <motion.div
            className="absolute left-0 w-full bg-gradient-to-b from-barak-gold to-transparent rounded-full"
            animate={{ top: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* ── Bottom section bleed ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #0D0905 100%)',
          zIndex: 15,
        }}
      />
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// LetterBlock — Each BARAK letter with 3D tilt + magnetic effect
// ────────────────────────────────────────────────────────────────
function LetterBlock({ char, index, total, mx, my }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Independent letter parallax (depth varies by index)
  const depth = (index / (total - 1) - 0.5) * 2; // -1 to 1
  const lx = useTransform(mx, [-1, 1], [`${depth * -14}px`, `${depth * 14}px`]);
  const ly = useTransform(my, [-1, 1], [`${-6}px`, `${6}px`]);

  return (
    <div className="relative overflow-visible">
      <motion.div
        ref={ref}
        style={{ x: lx, y: ly }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative cursor-default overflow-visible"
      >
        {/* Glow halo behind letter */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(200,146,42,0.25) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.4)',
          }}
        />

        {/* The letter itself */}
        <motion.span
          initial={{ y: '110%', opacity: 0, rotateX: 90 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.4 + index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{
            y: '-6%',
            color: '#E8B84B',
            textShadow: '0 0 40px rgba(200,146,42,0.6), 0 0 80px rgba(200,146,42,0.3)',
            transition: { duration: 0.3 },
          }}
          className="inline-block font-playfair font-black text-barak-cream origin-bottom"
          style={{
            fontSize: 'clamp(72px, 17vw, 190px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            willChange: 'transform, color',
            display: 'block',
          }}
        >
          {char}
        </motion.span>

        {/* Letter reflection (mirror below) */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
          aria-hidden="true"
          className="absolute top-full left-0 font-playfair font-black text-barak-cream select-none pointer-events-none"
          style={{
            fontSize: 'clamp(72px, 17vw, 190px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            transform: 'scaleY(-1)',
            opacity: 0.06,
            background: 'linear-gradient(to bottom, rgba(250,243,224,0.3), transparent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {char}
        </motion.span>
      </motion.div>
    </div>
  );
}
