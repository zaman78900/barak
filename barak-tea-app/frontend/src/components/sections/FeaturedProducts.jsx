import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'phosphor-react';
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (loading && (!products || products.length === 0)) {
    return (
      <section className="py-20 md:py-32 px-4 bg-barak-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-glass h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (

    <section className="py-20 md:py-32 px-4 bg-barak-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <p className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest mb-2">
            Handpicked for You
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-barak-cream">
            Our Premium Selection
          </h2>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="glass rounded-glass overflow-hidden group cursor-pointer"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-barak-card overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                    🍵
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <p className="text-xs uppercase font-bold text-barak-gold mb-2 tracking-wider">
                  {product.category}
                </p>
                <h3 className="text-lg font-bold text-barak-cream mb-3 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-barak-gold">★★★★★</span>
                  <span className="text-xs text-barak-muted">{product.rating || 4.8}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-barak-gold">₹{product.price}</span>
                  <span className="text-sm text-barak-muted line-through">₹{product.mrp}</span>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full glass px-4 py-3 rounded-lg font-semibold text-barak-cream hover:text-barak-gold-light border border-barak-gold hover:border-barak-gold-light transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button 
            onClick={() => navigate('/shop')}
            className="glass px-8 py-4 rounded-lg font-semibold text-barak-cream hover:text-barak-gold inline-flex items-center gap-2 group"
          >
            View All Products
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
