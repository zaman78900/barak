import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../utils/hooks';
import { useCartStore } from '../../store';

export default function PremiumProducts() {
  const navigate = useNavigate();
  const { products, loading } = useProducts(1, 4);
  const addItem = useCartStore((s) => s.addItem);
  const [hoveredId, setHoveredId] = useState(null);

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
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
    }
  };

  if (loading && (!products || products.length === 0)) {
    return (
      <section className="py-24 md:py-36 px-6 bg-[#050505] relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-3xl h-[450px] animate-pulse border border-white/5 bg-white/2" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-36 px-6 bg-[#050505] relative z-20 border-t border-white/5">
      
      {/* Volumetric background lights */}
      <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] rounded-full bg-barak-gold/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-barak-success/2 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-28">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-4 block">
              The Harvest Catalog
            </span>
            <h2 className="text-4xl md:text-6xl font-playfair font-black text-barak-cream leading-tight">
              Selected Estate Blends
            </h2>
          </div>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-barak-gold/15 to-transparent mx-8 hidden md:block" />
          <button 
            onClick={() => navigate('/shop')}
            className="text-[10px] uppercase font-bold text-barak-gold-light hover:text-barak-gold tracking-[0.2em] transition-colors inline-flex items-center gap-2 mt-6 md:mt-0 hover:translate-x-1 duration-300"
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
          {products.map((product) => {
            const isHovered = hoveredId === product.id;
            return (
              <motion.div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                variants={cardVariants}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative bg-white/2 border border-white/5 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-700 hover:border-barak-gold/30 hover:shadow-glass-hover"
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* Visual Pedestal (Product image display area) */}
                <div className="relative aspect-square w-full bg-black/30 flex items-center justify-center p-8 border-b border-white/5 overflow-hidden">
                  
                  {/* Subtle light leak shine behind product */}
                  <div className={`absolute inset-0 bg-radial-gradient duration-700 pointer-events-none transition-opacity ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} style={{
                    background: 'radial-gradient(circle at center, rgba(200, 146, 42, 0.08) 0%, transparent 65%)'
                  }} />

                  {product.image_url ? (
                    <motion.img 
                      src={product.image_url} 
                      alt={product.name} 
                      animate={{ 
                        rotate: isHovered ? 4 : 0,
                        scale: isHovered ? 1.05 : 1,
                        y: isHovered ? -8 : 0
                      }}
                      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                      className="max-h-[75%] max-w-[75%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]" 
                    />
                  ) : (
                    <span className="text-6xl select-none">🍵</span>
                  )}
                  
                  {/* Pedestal Reflection line */}
                  <div className="absolute bottom-5 w-[60%] h-[4px] pedestal-reflection opacity-80" />
                </div>

                {/* Product Metadata Info */}
                <div className="p-6 flex flex-col justify-between h-[210px] bg-black/10">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-barak-gold tracking-[0.2em] mb-2 block">
                      {product.category || 'Estate Blend'}
                    </span>
                    
                    <h3 className="text-base font-playfair font-bold text-barak-cream mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-barak-gold-light">
                      {product.name}
                    </h3>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-[10px] text-barak-gold tracking-widest">★★★★★</span>
                      <span className="text-[10px] text-barak-cream/40">({product.rating || '4.8'})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-barak-gold">₹{product.price}</span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-barak-cream/30 line-through">₹{product.mrp}</span>
                      )}
                    </div>

                    {/* Quick Add cart action */}
                    <motion.button 
                      onClick={(e) => handleAddToCart(e, product)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full border border-barak-gold/30 flex items-center justify-center text-barak-cream bg-white/5 hover:bg-barak-gold hover:text-[#050505] hover:border-barak-gold transition-all duration-350 shadow-md"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={15} />
                    </motion.button>
                  </div>

                </div>

                {/* Reflection Sweep Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[slide_1.5s_ease-out_infinite] pointer-events-none" />

              </motion.div>
            );
          })}
        </motion.div>
      </div>

    </section>
  );
}
