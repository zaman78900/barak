import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../utils/hooks';
import { useCartStore } from '../../store';

/**
 * Beat 5 — Shop / Product Reveal
 * Products animate in with 3D tilt-on-cursor-move.
 * Leaf-dissolve reveal transition.
 * Minimal copy: name, descriptor, price, Shop.
 */

function TiltCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [ 12, -12]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12,  12]), { stiffness: 200, damping: 25 });
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%']);
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={{ z: 20 }}
      data-cursor="View"
      className="relative bg-white/2 border border-white/5 rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Dynamic glow follow cursor */}
      <motion.div
        style={{
          left: glowX,
          top: glowY,
          opacity: isHovered ? 1 : 0,
          background: 'radial-gradient(circle, rgba(200,146,42,0.12) 0%, transparent 70%)',
        }}
        className="absolute w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0 transition-opacity duration-300"
      />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(200,146,42,0.25)', border: '1px solid rgba(200,146,42,0.2)' }}
      />

      {/* Product image pedestal */}
      <div
        className="relative aspect-square overflow-hidden bg-black/20 flex items-center justify-center"
        style={{ transform: 'translateZ(20px)' }}
      >
        {/* Subtle pedestal light */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'radial-gradient(circle at center, rgba(200,146,42,0.07) 0%, transparent 70%)' }}
        />
        {product.image_url ? (
          <motion.img
            src={product.image_url}
            alt={`${product.name} — Premium Assam CTC tea`}
            animate={{
              scale:  isHovered ? 1.07 : 1,
              y:      isHovered ? -10  : 0,
              rotate: isHovered ? 2    : 0,
            }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="w-[72%] h-[72%] object-contain"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))' }}
            loading="lazy"
          />
        ) : (
          <span className="text-6xl select-none">🍵</span>
        )}
        {/* Reflection shadow under product */}
        <div
          className="absolute bottom-4 w-1/2 h-3 rounded-full opacity-40"
          style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 100%)', filter: 'blur(6px)' }}
        />
      </div>

      {/* Info block */}
      <div
        className="p-5 relative z-10"
        style={{ transform: 'translateZ(10px)' }}
      >
        <span className="font-inter text-[9px] uppercase tracking-[0.3em] text-barak-gold block mb-1.5">
          {product.category || 'Single Origin'}
        </span>
        <h3 className="font-playfair font-bold text-barak-cream text-base mb-0.5 leading-snug group-hover:text-barak-gold-light transition-colors duration-300">
          {product.name}
        </h3>
        <p className="font-inter text-barak-muted text-xs leading-relaxed mb-4 line-clamp-2">
          {product.short_description || 'Premium CTC tea from Barak Valley, Assam'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-playfair font-bold text-barak-gold text-lg">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="font-inter text-xs text-barak-cream/25 line-through">₹{product.mrp}</span>
            )}
          </div>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            data-cursor="Add"
            className="w-9 h-9 rounded-full border border-barak-gold/25 flex items-center justify-center text-barak-cream bg-white/4 hover:bg-barak-gold hover:text-[#050505] hover:border-barak-gold transition-all duration-300"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} />
          </motion.button>
        </div>
      </div>

      {/* Leaf-dissolve entry shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent -translate-x-full group-hover:animate-[shimmer_1.4s_ease_forwards] pointer-events-none" />
    </motion.div>
  );
}

export default function ProductReveal() {
  const navigate   = useNavigate();
  const { products, loading } = useProducts(1, 4);
  const addItem    = useCartStore((s) => s.addItem);

  const handleAddToCart = (product) => {
    addItem({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      image:    product.image_url || '🍵',
      category: product.category,
      variant:  'Default',
      quantity: 1,
    });
  };

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, y: 60, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      className="relative py-28 md:py-44 px-6 overflow-hidden"
      style={{ background: '#0D0905' }}
    >
      {/* Volumetric ambient */}
      <div
        className="absolute top-[15%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,146,42,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-[15%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45,122,79,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-inter text-[10px] uppercase tracking-[0.45em] text-barak-gold block mb-4"
            >
              The Harvest Catalog
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair font-black text-barak-cream leading-tight tracking-tight"
              style={{ fontSize: 'clamp(30px, 5vw, 58px)' }}
            >
              Buy Assam Tea Online
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-3 font-inter text-barak-muted text-sm max-w-md"
            >
              Selected estate blends from Barak Valley — single-origin Assam CTC tea,
              vacuum-sealed at source.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/shop')}
            data-cursor="Shop"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-barak-gold hover:text-barak-gold-light transition-colors group"
          >
            Browse All Blends
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </div>

        {/* Products grid */}
        {loading && (!products || products.length === 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl h-[420px] animate-pulse bg-white/3 border border-white/5" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            style={{ perspective: 1200 }}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <TiltCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
