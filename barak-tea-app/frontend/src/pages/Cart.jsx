import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store';

/* ─── Promo codes ──────────────────────────────────────────────────── */
const PROMOS = {
  BARAK10:  { type: 'percent',  value: 10, label: '10% off' },
  ASSAM20:  { type: 'percent',  value: 20, label: '20% off' },
  FREESHIP: { type: 'shipping', label: 'Free shipping' },
  FIRST50:  { type: 'flat',     value: 50, label: '₹50 off' },
};

/* ─── Toast ────────────────────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 2800);
  }, []);
  return { toast, showToast };
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { toast, showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg, setPromoMsg] = useState(null); // { text, ok }

  /* ── Totals ── */
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = appliedPromo?.type === 'shipping' ? 0 : subtotal >= 500 ? 0 : 50;
  const discount  =
    !appliedPromo ? 0
    : appliedPromo.type === 'percent' ? Math.round(subtotal * appliedPromo.value / 100)
    : appliedPromo.type === 'flat'    ? Math.min(appliedPromo.value, subtotal)
    : 0;
  const total = subtotal + shipping - discount;
  const freeShipNeeded = Math.max(0, 500 - subtotal);

  /* Save summary for checkout page */
  const saveSummary = () => {
    localStorage.setItem('barak_order', JSON.stringify({
      sub: subtotal, shipping, discount, total,
      promo: appliedPromo?.label || null,
    }));
  };

  /* ── Handlers ── */
  const handleRemove = (id, variant, name) => {
    removeItem(id, variant);
    showToast(`"${name}" removed`);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoMsg({ text: 'Please enter a promo code.', ok: false }); return; }
    if (PROMOS[code]) {
      setAppliedPromo(PROMOS[code]);
      setPromoMsg({ text: `✓ Promo "${code}" applied — ${PROMOS[code].label}!`, ok: true });
      showToast('🎉 Promo code applied!');
    } else {
      setAppliedPromo(null);
      setPromoMsg({ text: 'Invalid code. Try: BARAK10, ASSAM20, FREESHIP, FIRST50', ok: false });
    }
  };

  const handleCheckout = () => {
    saveSummary();
    navigate('/checkout');
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  /* ─── Empty state ─────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-28 pb-20 px-6 bg-barak-bg flex flex-col items-center justify-center text-center"
      >
        <div className="text-8xl mb-8 opacity-40">☕</div>
        <h2 className="font-playfair text-4xl font-black text-barak-cream mb-4">
          Your cart is empty
        </h2>
        <p className="text-xl text-barak-muted font-light mb-10 font-cormorant">
          Looks like you haven't added any tea yet. Let's fix that.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-barak-gold text-barak-bg px-10 py-4 font-bold text-xs tracking-widest uppercase hover:bg-barak-gold-light transition-colors"
        >
          Browse Our Teas
        </Link>
      </motion.div>
    );
  }

  /* ─── Full cart ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-barak-bg pt-24 pb-20 px-6">
      {/* Noise overlay (matches reference) */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-barak-muted mb-12">
          <Link to="/" className="hover:text-barak-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-barak-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-barak-gold">Your Cart</span>
        </nav>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-playfair text-5xl md:text-6xl font-black text-barak-cream mb-2 leading-none">
            Your <em className="text-barak-gold italic">Cart</em>
          </h1>
          <p className="text-[13px] text-barak-muted tracking-wide mb-14">
            — {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>

        {/* Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10 items-start">

          {/* ── Left: Cart Items ── */}
          <div className="flex flex-col gap-[2px]">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${item.variant}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0 }}
                  transition={{ duration: 0.28, delay: idx * 0.05 }}
                  className="grid grid-cols-[100px_1fr_auto] items-center overflow-hidden border border-white/5 hover:border-barak-gold/15 transition-colors"
                  style={{
                    background: 'rgba(34,18,8,0.7)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Image */}
                  <div className="w-[100px] h-[120px] flex items-center justify-center bg-white/[0.02] overflow-hidden flex-shrink-0 relative group">
                    {item.image && item.image.length > 2 ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`${(item.image && item.image.length > 2) ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-5xl drop-shadow-[0_8px_20px_rgba(139,0,0,0.4)] transition-transform duration-500 group-hover:scale-110`}
                    >
                      {item.image || '🍵'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-7 py-6">
                    <div className="text-[10px] tracking-[3px] uppercase text-barak-muted mb-1">Barak Tea</div>
                    <div className="font-playfair text-lg font-bold text-barak-cream mb-1">{item.name}</div>
                    <div className="text-xs text-barak-muted tracking-wide">Pack: {item.variant || 'Standard'}</div>
                    <div className="text-xs text-barak-gold mt-2 opacity-70">₹{item.price} per pack</div>
                  </div>

                  {/* Actions */}
                  <div className="px-7 py-6 flex flex-col items-end gap-4">
                    {/* Qty control */}
                    <div className="flex items-center border border-barak-gold/20">
                      <button
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                        className="w-8 h-8 bg-transparent text-barak-gold text-base flex items-center justify-center hover:bg-barak-gold/10 transition-colors"
                      >−</button>
                      <span className="w-9 h-8 flex items-center justify-center text-center text-barak-cream border-x border-barak-gold/20 font-bebas text-base tracking-wide">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                        className="w-8 h-8 bg-transparent text-barak-gold text-base flex items-center justify-center hover:bg-barak-gold/10 transition-colors"
                      >+</button>
                    </div>

                    {/* Line total */}
                    <div className="font-bebas text-2xl text-barak-gold tracking-wide">
                      ₹{item.price * item.quantity}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.id, item.variant, item.name)}
                      className="flex items-center gap-1.5 text-barak-muted text-[11px] tracking-widest uppercase hover:text-red-400 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Right: Order Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="sticky top-24 border border-barak-gold/12"
            style={{
              background: 'rgba(34,18,8,0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              padding: '40px',
            }}
          >
            <div className="font-playfair text-xl font-bold text-barak-cream mb-8 pb-5 border-b border-white/[0.06]">
              Order Summary
            </div>

            {/* Rows */}
            <div className="space-y-4 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-barak-muted">Subtotal</span>
                <span className="text-barak-cream font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barak-muted">Shipping</span>
                <span className="text-barak-cream font-medium">
                  {shipping === 0 ? <span className="text-green-400">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              {discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-between"
                >
                  <span className="text-green-400">Promo Discount</span>
                  <span className="text-green-400 font-medium">−₹{discount}</span>
                </motion.div>
              )}
            </div>

            <div className="h-px bg-white/[0.06] my-5" />

            <div className="flex justify-between items-center mb-2">
              <span className="font-playfair text-lg text-barak-cream">Total</span>
              <span className="font-bebas text-3xl text-barak-gold tracking-wide">₹{total}</span>
            </div>

            {freeShipNeeded > 0 && !appliedPromo && (
              <p className="text-[11px] text-barak-muted text-right mb-7 leading-relaxed">
                Add ₹{freeShipNeeded} more for free shipping!
              </p>
            )}

            {/* Promo */}
            <div className="flex mb-1 mt-7">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                placeholder="Promo code"
                className="flex-1 bg-white/[0.04] border border-barak-gold/20 border-r-0 text-barak-cream placeholder-barak-muted px-4 py-3 text-[13px] outline-none focus:border-barak-gold transition-colors font-dmsans"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-barak-gold/10 border border-barak-gold/30 text-barak-gold px-5 py-3 text-[11px] tracking-widest uppercase hover:bg-barak-gold/20 transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {promoMsg && (
              <div className={`text-[12px] px-4 py-2.5 mb-1 mt-1 ${
                promoMsg.ok
                  ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                  : 'bg-red-900/20 border border-red-500/30 text-red-400'
              }`}>
                {promoMsg.text}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="relative w-full mt-7 bg-barak-gold text-barak-bg py-5 font-bold text-[12px] tracking-[4px] uppercase overflow-hidden group mb-3"
            >
              <span className="absolute inset-0 bg-barak-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-350" />
              <span className="relative z-10">Proceed to Checkout →</span>
            </button>
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 w-full py-4 border border-white/10 text-barak-muted text-[11px] tracking-[3px] uppercase hover:border-barak-gold/30 hover:text-barak-cream transition-all"
            >
              ← Continue Shopping
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-px mt-7 border-t border-white/[0.05] pt-6">
              {[['🔒','Secure Payment'],['🚚','Fast Delivery'],['🔄','Easy Returns']].map(([icon, label]) => (
                <div key={label} className="text-center py-3 px-2">
                  <div className="text-xl mb-1.5">{icon}</div>
                  <div className="text-[10px] tracking-wide uppercase text-barak-muted leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="fixed bottom-8 right-8 z-[9999] px-6 py-4 text-[13px] font-medium font-dmsans"
            style={{
              background: toast.type === 'success' ? '#C9A84C' : '#8B0000',
              color: toast.type === 'success' ? '#0D0805' : '#FAF3E0',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
