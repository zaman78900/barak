import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../utils/hooks';
import { useCartStore } from '../../store';

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { products, loading } = useProducts(1, 4);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '🍵',
      category: product.category,
      variant: 'Default',
      quantity: 1,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
  };

  if (loading && (!products || products.length === 0)) {
    return (
      <section className="py-24 md:py-36 px-4 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-glass h-[420px] animate-pulse border border-[rgba(250,243,224,0.05)]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-36 px-4 bg-[#0a0a0a] relative z-10 border-t border-[rgba(250,243,224,0.03)]">
      
      {/* Dynamic Background Volumetric Gradients */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-barak-gold/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-barak-success/2 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-3">
              The Collection
            </p>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-barak-cream leading-tight">
              Selected Harvest Blends
            </h2>
          </div>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-[rgba(200,146,42,0.15)] to-transparent mx-8 hidden md:block" />
          <button 
            onClick={() => navigate('/shop')}
            className="text-[10px] uppercase font-bold text-barak-gold-light hover:text-barak-gold tracking-[0.2em] transition-colors inline-flex items-center gap-2 mt-4 md:mt-0"
          >
            Browse All Blends
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative bg-[rgba(10,10,10,0.5)] border border-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-3xl overflow-hidden group cursor-pointer hover:border-[rgba(200,146,42,0.3)] transition-all duration-500 hover:shadow-glass-hover"
            >
              {/* Product Visual Pedestal */}
              <div className="relative aspect-square w-full bg-[rgba(0,0,0,0.2)] flex items-center justify-center p-10 border-b border-[rgba(255,255,255,0.03)] overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] group-hover:scale-105 group-hover:translate-y-[-6px] transition-all duration-700 ease-out" 
                  />
                ) : (
                  <div className="text-6xl group-hover:scale-105 group-hover:translate-y-[-6px] transition-all duration-700 ease-out">
                    🍵
                  </div>
                )}
                
                {/* Volumetric pedestal rim reflection */}
                <div className="absolute bottom-6 w-[55%] h-[6px] pedestal-reflection transition-transform duration-700 group-hover:scale-105 opacity-80" />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col justify-between h-[200px]">
                <div>
                  <span className="text-[9px] uppercase font-bold text-barak-gold tracking-[0.2em] mb-2 block">
                    {product.category}
                  </span>
                  
                  <h3 className="text-base font-playfair font-bold text-barak-cream mb-2 line-clamp-2 group-hover:text-barak-gold-light transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-barak-gold tracking-widest">★★★★★</span>
                    <span className="text-[10px] text-barak-cream text-opacity-40">({product.rating || 4.8})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-barak-gold">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-barak-cream text-opacity-40 line-through">₹{product.mrp}</span>
                    )}
                  </div>

                  {/* Quick Add Bag Action Button */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-10 h-10 rounded-full border border-[rgba(200,146,42,0.3)] flex items-center justify-center text-barak-cream hover:bg-barak-gold hover:text-barak-bg hover:border-barak-gold transition-all duration-350"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
