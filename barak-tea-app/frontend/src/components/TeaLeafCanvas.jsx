import React, { useRef, useEffect } from 'react';

/**
 * Global persistent falling tea-leaf particle canvas.
 * Fixed behind all page content, never resets, never confined to one section.
 * Uses canvas2D for performance. GPU-accelerated via will-change.
 * Pauses on hidden tab. Reduces particle count on mobile.
 * Respects prefers-reduced-motion — leaves only fade, no movement.
 */
export default function TeaLeafCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let paused = false;

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile detection — reduce particle count
    const isMobile = window.innerWidth < 768;
    const LEAF_COUNT  = isMobile ? 8  : 18;
    const DUST_COUNT  = isMobile ? 20 : 45;

    // ──── Resize ────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ──── Tab visibility pause ───────────────────────────────────
    const handleVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    // ──── Particle Classes ───────────────────────────────────────
    class GoldDust {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x       = Math.random() * canvas.width;
        this.y       = init ? Math.random() * canvas.height : canvas.height + 10;
        this.size    = Math.random() * 1.8 + 0.4;
        this.speedY  = Math.random() * 0.5 + 0.2;
        this.speedX  = Math.random() * 0.3 - 0.15;
        this.alpha   = Math.random() * 0.5 + 0.05;
        this.maxAlpha = this.alpha;
      }
      update() {
        if (prefersReduced) { this.alpha = Math.max(0.05, this.alpha - 0.0005); return; }
        this.y -= this.speedY;
        this.x += this.speedX;
        // fade near top
        if (this.y < canvas.height * 0.15) this.alpha -= 0.003;
        if (this.y < 0 || this.alpha <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,146,42,${this.alpha})`;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `rgba(200,146,42,${this.alpha * 0.9})`;
        ctx.fill();
        ctx.restore();
      }
    }

    class TeaLeaf {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x      = Math.random() * canvas.width;
        this.y      = init ? Math.random() * canvas.height : -30;
        this.w      = Math.random() * 10 + 5;        // leaf half-width
        this.h      = this.w * (Math.random() * 0.8 + 1.4); // leaf height
        this.angle  = Math.random() * Math.PI * 2;
        this.spin   = (Math.random() * 0.018 - 0.009) * (prefersReduced ? 0 : 1);
        this.speedY = (Math.random() * 0.55 + 0.3) * (prefersReduced ? 0 : 1);
        this.speedX = (Math.random() * 0.6 - 0.3)  * (prefersReduced ? 0 : 1);
        // slight horizontal gust oscillation
        this.gustPhase = Math.random() * Math.PI * 2;
        this.gustFreq  = 0.003 + Math.random() * 0.004;
        this.gustAmp   = Math.random() * 0.25;
        this.alpha     = Math.random() * 0.35 + 0.08;
        // warm/cool color shift per beat (approximated via alpha variation)
        this.warm      = Math.random() > 0.5; // warm gold-tinted vs cool green
      }
      update() {
        if (prefersReduced) { this.alpha = Math.max(0.05, this.alpha); return; }
        this.gustPhase += this.gustFreq;
        this.x     += this.speedX + Math.sin(this.gustPhase) * this.gustAmp;
        this.y     += this.speedY;
        this.angle += this.spin;
        if (
          this.y > canvas.height + 40 ||
          this.x < -40 ||
          this.x > canvas.width + 40
        ) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        // elegant elongated leaf shape
        ctx.moveTo(0, -this.h / 2);
        ctx.bezierCurveTo( this.w * 0.9,  -this.h * 0.1, this.w * 0.8,  this.h * 0.35, 0, this.h / 2);
        ctx.bezierCurveTo(-this.w * 0.8,   this.h * 0.35, -this.w * 0.9, -this.h * 0.1, 0, -this.h / 2);
        // Fill: tea-leaf green with warm glow tint
        const fill = this.warm
          ? `rgba(45,95,60,${this.alpha})`
          : `rgba(28,70,45,${this.alpha})`;
        ctx.fillStyle = fill;
        ctx.fill();
        // Vein line — gold accent
        ctx.beginPath();
        ctx.moveTo(0, -this.h * 0.45);
        ctx.lineTo(0,  this.h * 0.45);
        ctx.strokeStyle = `rgba(200,146,42,${this.alpha * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    // ──── Instantiate ────────────────────────────────────────────
    const dust   = Array.from({ length: DUST_COUNT }, () => new GoldDust());
    const leaves = Array.from({ length: LEAF_COUNT  }, () => new TeaLeaf());

    // ──── Render loop ────────────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (paused) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dust.forEach(p  => { p.update(); p.draw(); });
      leaves.forEach(p => { p.update(); p.draw(); });
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
        willChange: 'transform',
        opacity: 0.7,
      }}
    />
  );
}
