import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Warning } from 'phosphor-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!whatsapp.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhone(whatsapp)) {
      setError('Please enter a valid phone number (minimum 10 digits)');
      return;
    }

    if (!agreed) {
      setError('Please agree to the privacy policy');
      return;
    }

    setLoading(true);

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseURL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          phone: whatsapp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError(data.message || data.error || 'Already subscribed');
        } else {
          setError(data.error || 'Failed to subscribe. Please try again.');
        }
      } else {
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
        setWhatsapp('');
        setAgreed(false);

        setTimeout(() => {
          setMessage(null);
        }, 5000);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePhoneChange = (e) => {
    setWhatsapp(e.target.value);
    if (error) setError(null);
  };

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
    if (error) setError(null);
  };

  return (
    <section className="py-24 md:py-36 px-4 bg-[#0a0a0a] relative z-10 border-t border-[rgba(250,243,224,0.03)] overflow-hidden">
      
      {/* Volumetric Radial Gold Glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-barak-gold/2.5 blur-[130px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="relative p-8 md:p-14 border border-[rgba(250,243,224,0.05)] bg-[rgba(13,9,5,0.4)] backdrop-blur-lg rounded-glass"
        >
          {/* Content */}
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-4 block">
              Membership
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-barak-cream mb-4">
              Join The Circle
            </h2>
            <div className="w-12 h-[1px] bg-barak-gold mx-auto mb-4" />
            <p className="text-xs md:text-sm text-barak-cream text-opacity-50 font-light leading-relaxed max-w-[420px] mx-auto">
              Receive private reserve notifications, estate harvest logs, and 10% off your initial purchase.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  className="w-full bg-[rgba(250,243,224,0.02)] border border-[rgba(250,243,224,0.08)] px-4 py-3 rounded-lg text-barak-cream placeholder-barak-muted outline-none focus:border-barak-gold transition-colors text-sm disabled:opacity-50"
                  autoComplete="email"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={whatsapp}
                  onChange={handlePhoneChange}
                  disabled={loading}
                  className="w-full bg-[rgba(250,243,224,0.02)] border border-[rgba(250,243,224,0.08)] px-4 py-3 rounded-lg text-barak-cream placeholder-barak-muted outline-none focus:border-barak-gold transition-colors text-sm disabled:opacity-50"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-500/5 border border-red-500/20"
              >
                <Warning className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3.5 rounded-lg bg-green-500/5 border border-green-500/20"
              >
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-300">{message}</p>
              </motion.div>
            )}

            {/* Subscribe Button */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full nav-shop-now py-3.5 rounded-pill text-sm font-semibold text-barak-cream transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-barak-cream border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Request Invitation'
              )}
            </button>

            {/* Checkbox consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={agreed}
                onChange={handleCheckboxChange}
                disabled={loading}
                className="mt-1 w-3.5 h-3.5 accent-barak-gold cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="privacy" className="text-[10px] text-barak-cream text-opacity-40 leading-relaxed cursor-pointer hover:text-opacity-65 transition-colors">
                I agree to the privacy policy and consent to receive private reserve allocations and harvest journals via email and WhatsApp.
              </label>
            </div>

            {/* Fine info line */}
            <div className="h-[1px] bg-[rgba(250,243,224,0.03)] w-full pt-2" />
            <p className="text-[9px] uppercase tracking-[0.2em] text-barak-gold text-opacity-50 text-center">
              Secure Allocation · Opt-out Anytime · Direct trade logs
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
