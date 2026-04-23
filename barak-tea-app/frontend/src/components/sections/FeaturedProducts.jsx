import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedProducts() {
  const navigate = useNavigate();

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };
  const products = [
    {
      id: 1,
      name: 'Classic CTC Dust',
      category: 'Everyday',
      price: 180,
      mrp: 220,
      image: '🍵',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Premium Leaf Grade CTC',
      category: 'Premium',
      price: 280,
      mrp: 340,
      image: '🌿',
      rating: 5,
    },
    {
      id: 3,
      name: 'Morning Masala Blend',
      category: 'Blends',
      price: 220,
      mrp: 260,
      image: '✨',
      rating: 4.9,
    },
    {
      id: 4,
      name: 'Gift Box Collection',
      category: 'Gifts',
      price: 480,
      mrp: 580,
      image: '🎁',
      rating: 4.7,
    },
  ];

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
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="glass rounded-glass overflow-hidden group"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-barak-card flex items-center justify-center text-6xl hover:scale-110 transition-transform duration-500">
                {product.image}
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
                  <span className="text-xs text-barak-muted">{product.rating}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-barak-gold">₹{product.price}</span>
                  <span className="text-sm text-barak-muted line-through">₹{product.mrp}</span>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={() => addToCart({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price, 
                    image: product.image,
                    category: product.category
                  })}
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
