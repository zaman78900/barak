import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api.js';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(cartTotal);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 3) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // CVV only numbers
    else if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 3) }));
    }
    // Regular input
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate card details (basic validation)
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Invalid card number');
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        throw new Error('Invalid expiry date (MM/YY)');
      }
      if (formData.cvv.length !== 3) {
        throw new Error('Invalid CVV');
      }

      // Step 1: Create order in backend
      const orderResponse = await api.post('/orders', {
        items: cartItems,
        total,
        customerInfo: formData,
        paymentMethod: 'card',
      });

      const { id: newOrderId } = orderResponse;

      // Step 2: Create payment intent (in real scenario, Stripe would process this)
      const paymentResponse = await api.post('/payments/create-payment-intent', {
        amount: total,
        orderId: newOrderId,
        customerEmail: formData.email,
      });

      // Step 3: Confirm payment in backend (backend will handle Stripe)
      await api.post('/payments/confirm-payment', {
        paymentIntentId: paymentResponse.paymentIntentId,
        orderId: newOrderId,
      });

      // Clear cart
      localStorage.removeItem('cart');
      setOrderId(newOrderId);
      setPaymentComplete(true);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 px-4 bg-barak-bg"
    >
      <div className="max-w-7xl mx-auto">
        {paymentComplete ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              ✅
            </motion.div>
            <h1 className="text-5xl font-black text-barak-cream mb-4">Payment Successful!</h1>
            <p className="text-barak-muted mb-6 text-lg">
              Your order #{orderId} has been confirmed
            </p>
            <p className="text-barak-muted mb-8">
              A confirmation email has been sent to your inbox
            </p>
            <a href="/" className="inline-block px-8 py-3 bg-barak-gold text-barak-bg font-bold rounded-lg hover:bg-barak-gold-light transition">
              Back to Home
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-barak-card border border-barak-border rounded-2xl p-8"
              >
                <h1 className="text-5xl font-black text-barak-cream mb-8">Checkout</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Delivery Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-barak-cream">Delivery Information</h3>
                    
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold"
                    />

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (+91XXXXXXXXXX)"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold"
                    />

                    <textarea
                      name="address"
                      placeholder="Delivery Address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold"
                      rows="3"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold"
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold"
                      />
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4 border-t border-barak-border pt-6">
                    <h3 className="text-xl font-bold text-barak-cream">Payment Details</h3>
                    
                    <div className="mb-3 p-3 bg-barak-surface/50 border border-barak-gold/30 rounded-lg">
                      <p className="text-sm text-barak-muted">
                        💳 Test Card: 4242 4242 4242 4242 | Any date | Any CVC
                      </p>
                    </div>

                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number (1234 5678 9012 3456)"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength="19"
                      className="w-full px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold font-mono"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        required
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        maxLength="5"
                        className="px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold font-mono"
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength="3"
                        className="px-4 py-3 bg-barak-surface border border-barak-border rounded-lg text-barak-cream placeholder-barak-muted focus:outline-none focus:border-barak-gold font-mono"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-barak-gold to-barak-gold-light text-barak-bg font-bold rounded-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Processing Payment...' : `Pay ₹${Math.round(total)}`}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-barak-card border border-barak-border rounded-2xl p-8 sticky top-24 h-fit"
              >
                <h2 className="text-2xl font-bold text-barak-cream mb-6">Order Summary</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-barak-muted">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between py-3 border-b border-barak-border">
                          <div className="flex-1">
                            <p className="text-barak-cream text-sm">{item.name}</p>
                            <p className="text-barak-muted text-xs">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-barak-gold font-bold ml-2">₹{Math.round(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 border-t border-barak-border pt-6">
                      <div className="flex justify-between">
                        <span className="text-barak-muted text-sm">Subtotal</span>
                        <span className="text-barak-cream font-semibold">₹{Math.round(total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-barak-muted text-sm">Shipping</span>
                        <span className="text-barak-gold font-bold text-sm">FREE</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-barak-border">
                        <span>Total</span>
                        <span className="text-barak-gold">₹{Math.round(total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
