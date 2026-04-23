import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Confetti canvas hook ────────────────────────────────────────── */
function useConfetti(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#C9A84C','#E8C97A','#F5E6C0','#8B0000','#FAF3E0','#E8D5B0'];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      w: Math.random() * 10 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      opacity: 1,
    }));

    let frame = 0;
    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rotation += p.rotationSpeed;
        if (frame > 120) p.opacity = Math.max(0, p.opacity - 0.015);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (particles.some(p => p.opacity > 0)) rafId = requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);
}

/* ─── Steps ────────────────────────────────────────────────────────── */
function Steps({ current }) {
  const steps = ['Cart', 'Checkout', 'Confirmation'];
  return (
    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 ${done ? 'text-barak-gold/60' : active ? 'text-barak-gold' : 'text-barak-muted/40'}`}>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] flex-shrink-0 ${(done || active) ? 'bg-barak-gold border-barak-gold text-barak-bg' : 'border-current'}`}>
                {(done || active) ? '✓' : i + 1}
              </div>
              <span>{label}</span>
            </div>
            {i < steps.length - 1 && <span className="text-barak-muted/30 text-[10px]">→</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Track step ──────────────────────────────────────────────────── */
function TrackStep({ icon, label, time, done, active, last }) {
  return (
    <div className="flex-1 text-center relative">
      {!last && (
        <div className={`absolute top-[14px] left-[50%] right-[-50%] h-px z-0 ${done ? 'bg-barak-gold' : 'bg-white/[0.08]'}`} />
      )}
      <div className={`relative z-10 w-7 h-7 rounded-full border flex items-center justify-center mx-auto mb-3 text-[12px] transition-all ${
        done   ? 'border-barak-gold bg-barak-gold text-barak-bg' :
        active ? 'border-barak-gold animate-pulse' :
                 'border-white/10 bg-barak-bg'
      }`}>
        {icon}
      </div>
      <div className={`text-[11px] leading-snug tracking-wide ${(done || active) ? 'text-barak-cream' : 'text-barak-muted'}`}>
        {label}
      </div>
      <div className="text-[10px] text-barak-gold mt-1 opacity-60">{time}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Confirmation() {
  const navigate  = useNavigate();
  const canvasRef = useRef(null);
  useConfetti(canvasRef);

  /* Load order */
  const order = (() => {
    try { return JSON.parse(localStorage.getItem('barak_last_order') || '{}'); }
    catch { return {}; }
  })();

  /* Demo mode if no order found */
  useEffect(() => {
    if (!order.orderNumber) {
      const demo = {
        orderNumber: 'BRK' + Math.floor(100000 + Math.random() * 900000),
        customer: { name: 'Valued Customer', email: 'customer@example.com', phone: '+91 98765 43210' },
        address: { line1: '123 Tea Garden Road', line2: '', city: 'Silchar', state: 'Assam', pin: '788001' },
        payment: { method: 'upi' },
        items: [
          { name: 'Barak Tasty Tea', size: '250g', price: 190, qty: 2, image: '🍵' },
          { name: 'Barak Masala Chai', size: '100g', price: 110, qty: 1, image: '🌿' },
        ],
        totals: { sub: 490, shipping: 0, discount: 0, finalTotal: 490 },
      };
      localStorage.setItem('barak_last_order', JSON.stringify(demo));
      window.location.reload();
    }
  }, []);

  if (!order.orderNumber) return null;

  /* Dates */
  const now = new Date();
  const placedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const estDelivery = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const estStr = estDelivery.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const payLabels = { upi: 'UPI', card: 'Credit/Debit Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

  const copyCode = () => {
    navigator.clipboard.writeText('BARAK10').catch(() => {});
    // small visual cue handled by toast — but we keep it lightweight here
  };

  const shareWhatsApp = () => {
    const msg = `Hey! I just ordered amazing Assam tea from BARAK Tasty Tea 🍃\n\nUse my code *BARAK10* for 10% off your first order!\n\nShop here: ${window.location.origin}/shop`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  };

  const cardGlass = {
    background: 'rgba(34,18,8,0.70)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.05)',
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5 },
  });

  return (
    <div className="min-h-screen bg-barak-bg pb-20 relative" style={{ paddingTop: '72px' }}>
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />

      {/* Noise */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-30"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")` }} />

      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 flex items-center justify-between h-[72px] border-b border-barak-gold/10"
        style={{ background: 'rgba(13,8,5,0.96)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="text-2xl font-black text-barak-gold hover:text-barak-gold-light transition-colors tracking-widest">
          BARAK
        </Link>
        <div className="hidden md:block"><Steps current={2} /></div>
        <Link to="/shop" className="text-[11px] tracking-widest uppercase text-barak-muted hover:text-barak-gold transition-colors">
          Shop More
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 pt-10 relative z-20">

        {/* ── Hero ── */}
        <div className="text-center py-14 pb-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative text-5xl"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(139,0,0,0.2))', border: '2px solid #C9A84C' }}
          >
            ✓
            <div className="absolute inset-[-8px] rounded-full border border-barak-gold/20 animate-ping opacity-30" />
          </motion.div>

          <motion.span {...fadeUp(0.4)} className="block text-[11px] tracking-[5px] uppercase text-barak-gold mb-4">
            Order Confirmed
          </motion.span>
          <motion.h1 {...fadeUp(0.5)} className="font-playfair text-5xl md:text-7xl font-black text-barak-cream leading-none mb-5">
            Thank You<br />for Your <em className="text-barak-gold italic">Order!</em>
          </motion.h1>
          <motion.p {...fadeUp(0.6)} className="text-barak-muted text-base max-w-md mx-auto mb-12 leading-relaxed">
            Your BARAK tea is being prepared. You'll receive a confirmation on your email and WhatsApp shortly.
          </motion.p>

          <motion.div
            {...fadeUp(0.7)}
            className="inline-flex items-center gap-4 px-8 py-4 border border-barak-gold/20"
            style={cardGlass}
          >
            <div>
              <div className="text-[11px] tracking-[3px] uppercase text-barak-muted mb-1">Order Number</div>
              <div className="font-bebas text-2xl text-barak-gold tracking-[3px]">{order.orderNumber}</div>
            </div>
          </motion.div>
        </div>

        {/* ── Details grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-[2px]">

          {/* Customer */}
          <motion.div {...fadeUp(0.8)} style={cardGlass} className="p-8 md:p-9">
            <div className="flex items-center gap-2.5 text-[10px] tracking-[4px] uppercase text-barak-gold mb-5">
              <div className="w-5 h-px bg-barak-gold" />
              Customer Details
            </div>
            {[
              ['Name',    order.customer?.name],
              ['Email',   order.customer?.email],
              ['Phone',   order.customer?.phone],
              ['Payment', payLabels[order.payment?.method] || 'Online Payment'],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex justify-between items-start gap-6 mb-3 last:mb-0">
                <span className="text-[12px] text-barak-muted flex-shrink-0">{lbl}</span>
                <span className="text-[13px] text-barak-cream font-medium text-right">{val || '—'}</span>
              </div>
            ))}
          </motion.div>

          {/* Delivery */}
          <motion.div {...fadeUp(0.9)} style={cardGlass} className="p-8 md:p-9">
            <div className="flex items-center gap-2.5 text-[10px] tracking-[4px] uppercase text-barak-gold mb-5">
              <div className="w-5 h-px bg-barak-gold" />
              Delivery Address
            </div>
            {[
              ['Address', [order.address?.line1, order.address?.line2].filter(Boolean).join(', ')],
              ['City',    order.address?.city],
              ['State / PIN', [order.address?.state, order.address?.pin].filter(Boolean).join(', ')],
              ['Est. Delivery', estStr],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex justify-between items-start gap-6 mb-3 last:mb-0">
                <span className="text-[12px] text-barak-muted flex-shrink-0">{lbl}</span>
                <span className={`text-[13px] font-medium text-right ${lbl === 'Est. Delivery' ? 'text-barak-gold' : 'text-barak-cream'}`}>
                  {val || '—'}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Items — full width */}
          <motion.div {...fadeUp(1.0)} style={cardGlass} className="p-8 md:p-9 md:col-span-2">
            <div className="flex items-center gap-2.5 text-[10px] tracking-[4px] uppercase text-barak-gold mb-5">
              <div className="w-5 h-px bg-barak-gold" />
              Items Ordered
            </div>
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-3 mb-4 border-b border-white/[0.06]">
              {['Product','Qty','Total'].map((h, i) => (
                <span key={h} className={`text-[10px] tracking-widest uppercase text-barak-muted ${i > 0 ? 'text-right' : ''}`}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {(order.items || []).map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-4 py-3.5 border-b border-white/[0.03] last:border-0 items-center">
                <div>
                  <div className="text-sm font-medium text-barak-cream">{item.name}</div>
                  <div className="text-[11px] text-barak-muted mt-0.5">{item.size}</div>
                </div>
                <div className="font-bebas text-lg text-barak-muted tracking-wide text-right">{item.qty}</div>
                <div className="font-bebas text-xl text-barak-gold tracking-wide text-right">₹{item.price * item.qty}</div>
              </div>
            ))}
            {/* Total row */}
            <div className="flex items-center justify-between pt-5 mt-2 border-t border-barak-gold/20">
              {(order.totals?.shipping > 0)
                ? <div className="text-[12px] text-barak-muted">Shipping: ₹{order.totals.shipping}</div>
                : <div className="text-[12px] text-green-400">Free Shipping ✓</div>
              }
              <div className="flex items-center gap-3">
                <span className="font-playfair text-lg text-barak-cream">Total</span>
                <span className="font-bebas text-3xl text-barak-gold tracking-widest">₹{order.totals?.finalTotal || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Delivery tracker ── */}
        <motion.div {...fadeUp(1.1)} style={cardGlass} className="p-9 mt-[2px]">
          <div className="flex items-center gap-2.5 text-[10px] tracking-[4px] uppercase text-barak-gold mb-7">
            <div className="w-5 h-px bg-barak-gold" />
            Order Tracking
          </div>
          <div className="flex items-start">
            <TrackStep icon="✓" label="Order Placed"        time={placedTime} done  active={false} />
            <TrackStep icon="⚙" label="Processing"         time="Within 24h" done={false} active />
            <TrackStep icon="📦" label="Packed & Shipped"   time="1–2 days"   done={false} active={false} />
            <TrackStep icon="🚚" label="Out for Delivery"   time="3–5 days"   done={false} active={false} />
            <TrackStep icon="☕" label="Delivered!"          time={estStr}     done={false} active={false} last />
          </div>
        </motion.div>

        {/* ── Share card ── */}
        <motion.div
          {...fadeUp(1.4)}
          className="mt-[2px] p-9 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(139,0,0,0.3), rgba(201,168,76,0.1))',
            border: '1px solid rgba(201,168,76,0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h3 className="font-playfair text-2xl font-bold text-barak-cream mb-3">Share the Love, Earn Rewards 🍃</h3>
          <p className="text-[13px] text-barak-muted mb-6 leading-relaxed max-w-md mx-auto">
            Share your BARAK experience and give your friends 10% off their first order.<br />
            You'll get ₹50 credit when they buy.
          </p>
          <div className="inline-flex items-center gap-4 bg-barak-gold/10 border border-dashed border-barak-gold/40 px-7 py-3 mb-7">
            <span className="font-bebas text-3xl text-barak-gold tracking-[4px]">BARAK10</span>
            <button
              onClick={copyCode}
              className="border border-barak-gold/30 text-barak-gold px-4 py-1.5 text-[11px] tracking-widest hover:bg-barak-gold/15 transition-colors"
            >
              Copy
            </button>
          </div>
          <br />
          <button
            onClick={shareWhatsApp}
            className="inline-flex items-center gap-3 px-9 py-4 font-bold text-[12px] tracking-widest uppercase text-white hover:opacity-90 transition-opacity"
            style={{ background: '#25D366' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </button>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div {...fadeUp(1.3)} className="flex flex-wrap gap-4 justify-center mt-14">
          <Link
            to="/shop"
            className="relative inline-flex items-center gap-3 bg-barak-gold text-barak-bg px-9 py-4 font-bold text-[12px] tracking-[3px] uppercase overflow-hidden group"
          >
            <span className="absolute inset-0 bg-barak-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-350" />
            <span className="relative z-10">🍃 Shop Again</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-barak-cream border border-barak-gold/30 px-9 py-4 font-medium text-[12px] tracking-[3px] uppercase hover:border-barak-gold hover:text-barak-gold transition-all"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
