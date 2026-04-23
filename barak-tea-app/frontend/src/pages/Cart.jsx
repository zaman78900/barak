import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash, ShoppingCart, Plus, Minus, ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-20 px-4 bg-barak-bg"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-black text-barak-cream">Shopping Cart</h1>
          <p className="text-barak-muted mt-2">
            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-glass p-20 flex flex-col items-center gap-6"
          >
            <ShoppingCart size={80} className="text-barak-muted opacity-40" />
            <p className="text-barak-muted text-xl">Nothing here yet.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-barak-gold text-barak-bg font-bold rounded-lg hover:bg-barak-gold-light transition-colors"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.variant}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="glass rounded-glass p-5 flex items-center gap-5"
                  >
                    {/* Image / Emoji */}
                    <div className="w-20 h-20 bg-barak-card rounded-xl flex items-center justify-center text-4xl shrink-0">
                      {item.image}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase text-barak-gold tracking-wider mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-barak-cream font-semibold text-base leading-snug truncate">
                        {item.name}
                      </h3>
                      <p className="text-barak-gold font-bold mt-1">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:text-barak-gold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-barak-cream font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:text-barak-gold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line Total */}
                    <p className="text-barak-gold font-bold text-lg w-20 text-right shrink-0">
                      ₹{Math.round(item.price * item.quantity)}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id, item.variant)}
                      className="ml-2 text-barak-muted hover:text-red-400 transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear cart */}
              <motion.div layout className="pt-2">
                <button
                  onClick={clearCart}
                  className="text-sm text-barak-muted hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash size={14} /> Clear cart
                </button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-glass p-8 h-fit sticky top-24"
            >
              <h2 className="text-2xl font-bold text-barak-cream mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-barak-muted">Subtotal ({itemCount} items)</span>
                  <span className="text-barak-cream font-semibold">₹{Math.round(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-barak-muted">Shipping</span>
                  <span className="text-barak-gold font-bold">FREE</span>
                </div>
                <div className="border-t border-barak-border pt-3 flex justify-between text-lg font-bold">
                  <span className="text-barak-cream">Total</span>
                  <span className="text-barak-gold">₹{Math.round(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-8 w-full py-4 bg-gradient-to-r from-barak-gold to-barak-gold-light text-barak-bg font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-gold-glow transition-all"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="mt-3 w-full py-3 glass rounded-lg text-barak-cream text-sm font-semibold hover:text-barak-gold transition-colors"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
