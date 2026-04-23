import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelSimple, ShoppingCart, Check } from 'phosphor-react';
import { useProducts } from '../utils/hooks';
import { useCartStore } from '../store';

export default function Shop() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addedIds, setAddedIds] = useState({});

  const addItem = useCartStore((s) => s.addItem);
  const { products, loading, pagination } = useProducts(page, 12, filters);

  const handleAddToCart = (product) => {
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image || '🍵',
      category: product.category,
      variant: product.variant || 'default',
      quantity: 1,
    });
    setAddedIds((prev) => ({ ...prev, [product._id || product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id || product.id]: false }));
    }, 1800);
  };

  const categories = ['All', 'Everyday', 'Premium', 'Blends', 'Gifts'];

  const handleCategoryChange = (category) => {
    const newFilters = { ...filters };
    if (category === 'All') {
      delete newFilters.category;
    } else {
      newFilters.category = category;
    }
    setFilters(newFilters);
    setPage(1);
  };

  const sortedProducts = useMemo(() => {
    if (!products) return [];

    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popular':
        return sorted.sort((a, b) => b.sold_count - a.sold_count);
      case 'newest':
      default:
        return sorted;
    }
  }, [products, sortBy]);

  return (
    <main className="min-h-screen bg-barak-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black text-barak-cream mb-4">Shop</h1>
          <p className="text-barak-muted">
            Discover our premium collection of CTC tea from Barak Valley
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-glass mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sm:hidden flex items-center gap-2 text-barak-cream hover:text-barak-gold transition-colors"
          >
            <FunnelSimple size={20} />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-barak-muted">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass px-4 py-2 rounded-lg text-barak-cream text-sm outline-none focus:ring-2 focus:ring-barak-gold"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <span className="text-sm text-barak-muted">
            {pagination.total} products found
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } md:block glass p-6 rounded-glass h-fit`}
          >
            <h3 className="text-lg font-bold text-barak-cream mb-6">Categories</h3>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    filters.category === cat || (cat === 'All' && !filters.category)
                      ? 'glass text-barak-gold'
                      : 'text-barak-muted hover:text-barak-cream'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="mt-8 pt-6 border-t border-barak-border">
              <h4 className="font-semibold text-barak-cream mb-4">Price Range</h4>
              <div className="space-y-2 text-sm text-barak-muted">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-barak-gold" />
                  Under ₹200
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-barak-gold" />
                  ₹200 - ₹300
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-barak-gold" />
                  ₹300 - ₹500
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-barak-gold" />
                  Above ₹500
                </label>
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-glass h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {sortedProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="glass rounded-glass overflow-hidden group cursor-pointer hover:shadow-gold-glow transition-all"
                    >
                      {/* Product Image */}
                      <div className="w-full aspect-square bg-barak-card flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                        🍵
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <p className="text-xs uppercase font-bold text-barak-gold mb-2">
                          {product.category}
                        </p>
                        <h3 className="text-lg font-bold text-barak-cream mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs text-barak-gold">★★★★★</span>
                          <span className="text-xs text-barak-muted">(24 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-bold text-barak-gold">
                            ₹{product.price}
                          </span>
                          <span className="text-sm text-barak-muted line-through">
                            ₹{product.mrp}
                          </span>
                        </div>

                        {/* Stock */}
                        <p className="text-xs text-barak-muted mb-4">
                          {product.stock_quantity > 0 ? (
                            <>
                              <span className="text-barak-success">In Stock</span>
                            </>
                          ) : (
                            <span className="text-barak-error">Out of Stock</span>
                          )}
                        </p>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity <= 0}
                          className={`w-full glass px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            addedIds[product._id || product.id]
                              ? 'bg-barak-success/20 text-barak-success border border-barak-success'
                              : product.stock_quantity <= 0
                              ? 'opacity-50 cursor-not-allowed text-barak-muted border border-barak-border'
                              : 'text-barak-cream hover:text-barak-gold border border-barak-gold hover:border-barak-gold-light'
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {addedIds[product._id || product.id] ? (
                              <motion.span
                                key="added"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Check size={18} weight="bold" /> Added!
                              </motion.span>
                            ) : (
                              <motion.span
                                key="add"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <ShoppingCart size={18} />
                                {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 flex justify-center gap-2"
                  >
                    {Array.from({ length: pagination.pages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setPage(i + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          page === i + 1
                            ? 'bg-barak-gold text-barak-bg'
                            : 'glass text-barak-cream hover:text-barak-gold'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
