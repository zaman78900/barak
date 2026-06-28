import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'phosphor-react';
import { useProducts } from '../../utils/hooks';
import { useCartStore } from '../../store';

export default function GlassProducts() {
  const navigate = useNavigate();
  const { products, loading } = useProducts(1, 3); // Fetch only top 3 for extreme luxury focus
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

  return (
    <section className="py-32 px-4 bg-[#050505] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-barak-gold/10 to-transparent blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#1a110a] to-transparent blur-[80px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-barak-gold text-sm tracking-[0.4em] font-bold uppercase mb-4"
            >
              The Collection
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-playfair font-black text-barak-cream"
            >
              Curated <span className="italic text-barak-gold/80">Masterpieces</span>
            </motion.h2>
          </div>
          
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/shop')}
            className="flex items-center gap-3 text-barak-cream hover:text-barak-gold transition-colors group"
          >
            <span className="text-sm uppercase tracking-widest font-bold">View Gallery</span>
            <div className="w-10 h-10 rounded-full border border-barak-cream/20 group-hover:border-barak-gold flex items-center justify-center transition-colors">
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {loading ? (
            // Skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-[600px] glass-panel-ultra animate-pulse bg-[#111]" />
            ))
          ) : (
            products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(`/product/${product.id}`)}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="glass-panel-ultra h-[500px] md:h-[600px] p-8 flex flex-col justify-between relative overflow-visible border-[rgba(255,255,255,0.03)] hover:border-barak-gold/30 transition-colors duration-500">
                  
                  {/* Top Bar */}
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[10px] uppercase font-bold text-barak-gold tracking-widest bg-barak-gold/10 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-barak-gold hover:text-black transition-all duration-300"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>

                  {/* 3D Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-[70%] object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                    ) : (
                      <div className="text-8xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700">🍵</div>
                    )}
                  </div>

                  {/* Bottom Info */}
                  <div className="z-10 bg-black/20 backdrop-blur-lg -mx-8 -mb-8 p-8 border-t border-white/5">
                    <h3 className="text-2xl font-playfair font-bold text-barak-cream mb-2 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-end gap-3">
                      <span className="text-xl font-bold text-barak-gold">₹{product.price}</span>
                      {product.mrp > product.price && (
                        <span className="text-sm text-barak-cream/40 line-through mb-0.5">₹{product.mrp}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
