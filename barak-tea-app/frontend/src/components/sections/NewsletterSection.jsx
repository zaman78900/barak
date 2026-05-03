import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Warning, CaretDown } from 'phosphor-react';

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
    // Accept various phone formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation
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
        setMessage(data.message || 'Successfully subscribed! 🎉');
        setEmail('');
        setWhatsapp('');
        setAgreed(false);

        // Clear success message after 5 seconds
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
    <section className="py-20 md:py-32 px-4 bg-barak-surface">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-8 md:p-12 rounded-glass"
        >
          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-black text-barak-cream text-center mb-4">
            10% Off + Free Tea Sample
          </h2>
          <p className="text-center text-barak-muted mb-8 md:mb-10">
            Join our WhatsApp community for exclusive deals and tea stories
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  className="w-full glass px-4 py-3 rounded-lg text-barak-cream placeholder-barak-muted outline-none focus:ring-2 focus:ring-barak-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="email"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="+91 9876 543210"
                  value={whatsapp}
                  onChange={handlePhoneChange}
                  disabled={loading}
                  className="w-full glass px-4 py-3 rounded-lg text-barak-cream placeholder-barak-muted outline-none focus:ring-2 focus:ring-barak-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <Warning className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-green-300">{message}</p>
              </motion.div>
            )}

            {/* Subscribe Button */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-barak-gold text-barak-bg py-3 rounded-lg font-bold hover:bg-barak-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-barak-bg border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </button>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={agreed}
                onChange={handleCheckboxChange}
                disabled={loading}
                className="mt-1 w-4 h-4 accent-barak-gold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="privacy" className="text-xs text-barak-muted leading-relaxed cursor-pointer hover:text-barak-cream transition-colors">
                I agree to the privacy policy and consent to receive updates via email and WhatsApp. I'll get 10% off my first order and exclusive tea recommendations.
              </label>
            </div>

            {/* Info Text */}
            <p className="text-xs text-barak-muted/70 text-center">
              ✓ No spam · ✓ Unsubscribe anytime · ✓ Secure & encrypted
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
