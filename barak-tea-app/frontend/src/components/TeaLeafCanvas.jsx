import React, { useRef, useEffect } from 'react';

/**
 * GLOBAL FALLING TEA LEAVES — Top to Bottom, Physics-based
 * ─────────────────────────────────────────────────────────
 * • Leaves spawn at the TOP and fall DOWN with gravity + wind sway
 * • Bezier-curve swaying path (sinusoidal horizontal drift)
 * • Tumbling rotation synced to fall speed
 * • Varied leaf sizes, speeds, opacity, flutter frequency
 * • Gold dust sparkles also fall (smaller, faster, glittery)
 * • Canvas is FIXED to viewport — covers full screen at all times
 * • Tab-hidden pause, mobile density reduction, prefers-reduced-motion
 */
export default function TeaLeafCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animId;
    let paused = false;
    let W = 0, H = 0;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const LEAF_COUNT  = isMobile ? 10 : 22;
    const DUST_COUNT  = isMobile ? 18 : 40;

    // ── Resize: match physical viewport ────────────────────────
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Visibility pause ────────────────────────────────────────
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Wind system ─────────────────────────────────────────────
    let windStrength = 0;
    let windTarget   = 0;
    let windTimer    = 0;

    const updateWind = (dt) => {
      windTimer -= dt;
      if (windTimer <= 0) {
        windTarget = (Math.random() - 0.5) * 0.6; // gentle gusts
        windTimer  = 2000 + Math.random() * 4000;
      }
      windStrength += (windTarget - windStrength) * 0.001 * dt;
    };

    // ─────────────────────────────────────────────────────────────
    // TEA LEAF  — falls from top, swaying naturally
    // ─────────────────────────────────────────────────────────────
    class TeaLeaf {
      constructor(init = false) { this.spawn(init); }

      spawn(init = false) {
        this.x          = Math.random() * W;
        this.y          = init ? Math.random() * H * 1.5 - H * 0.5 : -(Math.random() * 80 + 20);

        // Leaf dimensions — natural variety
        this.w          = Math.random() * 9 + 5;     // half-width 5–14px
        this.h          = this.w * (Math.random() * 0.7 + 1.5); // h = 1.5–2.2× width

        // Fall physics
        this.vy         = Math.random() * 0.9 + 0.5; // gravity speed (px/frame)
        this.vx         = (Math.random() - 0.5) * 0.3;

        // Sway — sinusoidal oscillation for flutter feel
        this.swayAmp    = Math.random() * 1.4 + 0.4;  // px amplitude
        this.swayFreq   = Math.random() * 0.025 + 0.012; // oscillation rate
        this.swayPhase  = Math.random() * Math.PI * 2;

        // Rotation — tumbles with fall, gentle
        this.angle      = Math.random() * Math.PI * 2;
        this.spin       = (Math.random() - 0.5) * 0.025; // rad/frame

        // Appearance
        this.alpha      = Math.random() * 0.5 + 0.12;
        this.green      = Math.floor(Math.random() * 35 + 38); // green channel 38–73
        this.warm       = Math.random() > 0.55; // slight warm/cool tint

        // Occasional golden leaf tip
        this.golden     = Math.random() < 0.18;
      }

      update(dt, wind) {
        if (prefersReduced) return;
        this.swayPhase += this.swayFreq;
        const sway = Math.sin(this.swayPhase) * this.swayAmp + wind * 12;

        this.x     += this.vx + sway * 0.06;
        this.y     += this.vy;
        this.angle += this.spin;

        // Fade in softly near bottom
        if (this.y > H * 0.85) {
          this.alpha = Math.max(0, this.alpha - 0.006);
        }

        // Respawn from top when off-screen
        if (this.y > H + 50 || this.x < -60 || this.x > W + 60 || this.alpha <= 0) {
          this.spawn(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Main leaf body — elongated bezier oval
        ctx.beginPath();
        ctx.moveTo(0, -this.h / 2);
        // right curve
        ctx.bezierCurveTo(
          this.w * 1.0,  -this.h * 0.15,
          this.w * 0.9,   this.h * 0.30,
          0,              this.h / 2
        );
        // left curve
        ctx.bezierCurveTo(
          -this.w * 0.9,  this.h * 0.30,
          -this.w * 1.0, -this.h * 0.15,
          0,             -this.h / 2
        );

        // Fill gradient — tip darker, base lighter
        const grad = ctx.createLinearGradient(0, -this.h / 2, 0, this.h / 2);
        if (this.golden) {
          grad.addColorStop(0, `rgba(${160},${110},${20},${this.alpha})`);
          grad.addColorStop(0.5, `rgba(${42},${this.green + 15},${30},${this.alpha * 0.9})`);
          grad.addColorStop(1, `rgba(${30},${this.green},${22},${this.alpha})`);
        } else {
          grad.addColorStop(0, `rgba(${20},${this.green + 10},${18},${this.alpha})`);
          grad.addColorStop(0.5, `rgba(${32},${this.green + 20},${28},${this.alpha * 0.85})`);
          grad.addColorStop(1, `rgba(${15},${this.green},${15},${this.alpha * 0.7})`);
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Midrib vein — subtle gold line
        ctx.beginPath();
        ctx.moveTo(0, -this.h * 0.42);
        ctx.quadraticCurveTo(this.w * 0.08, 0, 0, this.h * 0.42);
        ctx.strokeStyle = this.golden
          ? `rgba(200,150,40,${this.alpha * 0.55})`
          : `rgba(140,120,40,${this.alpha * 0.2})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Tiny side veins (only for larger leaves)
        if (this.w > 8) {
          ctx.strokeStyle = `rgba(120,100,30,${this.alpha * 0.12})`;
          ctx.lineWidth = 0.4;
          for (let vi = -1; vi <= 1; vi += 2) {
            const vy = vi * this.h * 0.18;
            ctx.beginPath();
            ctx.moveTo(0, vy);
            ctx.lineTo(this.w * 0.55, vy + vi * this.h * 0.06);
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    }

    // ─────────────────────────────────────────────────────────────
    // GOLD DUST SPARKLE — tiny glittering particles, also fall down
    // ─────────────────────────────────────────────────────────────
    class GoldDust {
      constructor(init = false) { this.spawn(init); }

      spawn(init = false) {
        this.x      = Math.random() * W;
        this.y      = init ? Math.random() * H : -(Math.random() * 30);
        this.r      = Math.random() * 2.0 + 0.3;
        this.vy     = Math.random() * 0.6 + 0.15;
        this.vx     = (Math.random() - 0.5) * 0.2;
        this.alpha  = Math.random() * 0.7 + 0.1;
        // Twinkle animation
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleFreq  = Math.random() * 0.06 + 0.02;
      }

      update(wind) {
        if (prefersReduced) return;
        this.twinklePhase += this.twinkleFreq;
        this.x += this.vx + wind * 5;
        this.y += this.vy;

        // Fade near bottom
        if (this.y > H * 0.9) this.alpha -= 0.008;
        if (this.y > H + 20 || this.x < -20 || this.x > W + 20 || this.alpha <= 0) {
          this.spawn(false);
        }
      }

      draw() {
        const twinkle = 0.6 + Math.sin(this.twinklePhase) * 0.4;
        const a = this.alpha * twinkle;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,170,50,${a})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(200,150,40,${a * 0.8})`;
        ctx.fill();
        ctx.restore();
      }
    }

    // ── Create particles ─────────────────────────────────────────
    const leaves = Array.from({ length: LEAF_COUNT }, () => new TeaLeaf(true));
    const dust   = Array.from({ length: DUST_COUNT  }, () => new GoldDust(true));

    // ── Render loop ──────────────────────────────────────────────
    let lastTime = performance.now();

    const animate = (now) => {
      animId = requestAnimationFrame(animate);
      if (paused) return;

      const dt = Math.min(now - lastTime, 50); // cap at 50ms (20fps min)
      lastTime = now;

      updateWind(dt);

      ctx.clearRect(0, 0, W, H);

      dust.forEach(p   => { p.update(windStrength); p.draw(); });
      leaves.forEach(p => { p.update(dt, windStrength); p.draw(); });
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
        willChange: 'transform',
      }}
    />
  );
}
