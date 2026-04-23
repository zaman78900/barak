import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend API
    console.log({ email, whatsapp, agreed });
    setEmail('');
    setWhatsapp('');
    setAgreed(false);
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
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass px-4 py-3 rounded-lg text-barak-cream placeholder-barak-muted outline-none focus:ring-2 focus:ring-barak-gold"
                required
              />
              <input
                type="tel"
                placeholder="+91 your number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="glass px-4 py-3 rounded-lg text-barak-cream placeholder-barak-muted outline-none focus:ring-2 focus:ring-barak-gold"
                required
              />
            </div>

            {/* Subscribe Button */}
            <button
              type="submit"
              className="w-full bg-barak-gold text-barak-bg py-3 rounded-lg font-bold hover:bg-barak-gold-light transition-colors"
            >
              Subscribe
            </button>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-barak-gold"
              />
              <label htmlFor="privacy" className="text-xs text-barak-muted leading-relaxed">
                I agree to the privacy policy and consent to receive updates via email and WhatsApp
              </label>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
