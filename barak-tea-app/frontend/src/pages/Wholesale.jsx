import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Buildings, User, Phone, Envelope, MapPin, 
  ClipboardText, CaretDown, Check, ArrowRight, 
  ShieldCheck, Sparkle, Truck 
} from 'phosphor-react';
import { wholesaleAPI } from '../utils/adminApi';

// FAQ list
const FAQS = [
  {
    q: 'What is the Minimum Order Quantity (MOQ) for wholesale?',
    a: 'Our wholesale pricing begins at a minimum order quantity of 50 kg. For customized packaging or private labeling, MOQs may vary. Contact our team for specific requirements.'
  },
  {
    q: 'Do you provide samples before bulk ordering?',
    a: 'Yes, we provide sample kits containing our Classic CTC, Premium CTC, and Masala blends. You can request a sample kit using the inquiry form below, and our team will coordinate the shipment.'
  },
  {
    q: 'What are your delivery timelines across India?',
    a: 'We ship directly from our facilities in Silchar and Kalain, Assam. Deliveries to major metros take between 5 to 7 business days, while other regions take 7 to 10 business days depending on the courier partner.'
  },
  {
    q: 'Do you offer customized blends or private labeling?',
    a: 'Absolutely. We work closely with restaurants, hotels, and retail brands to create custom CTC grades, spice ratios, and custom retail packaging under your own private label.'
  }
];

export default function Wholesale() {
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    email: '',
    city: '',
    monthly_quantity_kg: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.business_name || !form.phone) {
      setError('Business Name and Phone Number are required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = {
        ...form,
        monthly_quantity_kg: form.monthly_quantity_kg ? parseFloat(form.monthly_quantity_kg) : null
      };

      await wholesaleAPI.submit(payload);
      setSuccess(true);
      setForm({
        business_name: '',
        contact_name: '',
        phone: '',
        email: '',
        city: '',
        monthly_quantity_kg: '',
        message: ''
      });
    } catch (err) {
      setError(err.error || err.message || 'Failed to submit inquiry. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-barak-bg pt-28 pb-20 px-4 text-barak-cream"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest bg-barak-gold/10 px-3 py-1.5 rounded-full">
              BARAK Business Partnership
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-barak-cream font-playfair leading-tight">
              Premium Assam CTC Tea <span className="gradient-gold">Directly In Bulk</span>
            </h1>
            <p className="text-barak-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Partner with BARAK to supply your outlet, hotel, restaurant, or business with authentic, bold, single-origin CTC tea sourced directly from the gardens of Kalain and Silchar.
            </p>
          </motion.div>
        </section>

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-glass border border-barak-border/40 space-y-4 shadow-glass hover:shadow-glass-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-barak-gold/10 flex items-center justify-center text-barak-gold">
              <Sparkle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-barak-cream font-playfair">Uncompromising Freshness</h3>
            <p className="text-barak-muted text-sm leading-relaxed">
              By cutting out middleman brokers, our tea travels straight from the processing estates in Assam to your warehouse. You get tea at peak flavor and aroma.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-glass border border-barak-border/40 space-y-4 shadow-glass hover:shadow-glass-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-barak-gold/10 flex items-center justify-center text-barak-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-barak-cream font-playfair">Ethical Sourcing</h3>
            <p className="text-barak-muted text-sm leading-relaxed">
              We pay our pluckers and partner estates premium prices directly. Align your brand with high-standard, sustainable, and fair-wage trade practices in Assam.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-glass border border-barak-border/40 space-y-4 shadow-glass hover:shadow-glass-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-barak-gold/10 flex items-center justify-center text-barak-gold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-barak-cream font-playfair">Flexible Logistics</h3>
            <p className="text-barak-muted text-sm leading-relaxed">
              Whether you need 50 kg or 5,000 kg, our shipping networks guarantee secure freight delivery with real-time tracking across all locations.
            </p>
          </motion.div>
        </section>

        {/* Form and Stats Block */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-playfair text-barak-cream leading-snug">
                Power Your Tea Program With Authentic Flavor
              </h2>
              <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                Whether you run a high-volume chain of tea shops, distribute to regional groceries, or need custom brewing blends for hospitality, we deliver consistent grades year-round.
              </p>
            </div>

            <div className="space-y-4 border-t border-barak-border/40 pt-6">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-black text-barak-gold">50 Kg</div>
                <div className="text-sm text-barak-muted">Minimum order volume to access wholesale price tiers</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-black text-barak-gold">100%</div>
                <div className="text-sm text-barak-muted">Single-origin premium CTC tea directly from Assam</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-black text-barak-gold">24 Hr</div>
                <div className="text-sm text-barak-muted">Response time on all corporate bulk queries</div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="glass p-8 md:p-10 rounded-glass border border-barak-border/60 shadow-glass-hover">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="border-b border-barak-border/40 pb-4 mb-4">
                      <h3 className="text-2xl font-bold font-playfair text-barak-cream">Bulk Inquiry Form</h3>
                      <p className="text-barak-muted text-xs mt-1">Submit your details and our team will get in touch with pricing packages.</p>
                    </div>

                    {error && (
                      <div className="bg-red-950/40 border border-red-900/60 text-red-400 p-4 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                          <Buildings className="w-3.5 h-3.5 text-barak-gold" /> Company / Business Name *
                        </label>
                        <input
                          type="text"
                          name="business_name"
                          value={form.business_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Chai Junction Ltd"
                          required
                          className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-barak-gold" /> Contact Name
                        </label>
                        <input
                          type="text"
                          name="contact_name"
                          value={form.contact_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Priya Sharma"
                          className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-barak-gold" /> Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 98765 43210"
                          required
                          className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                          <Envelope className="w-3.5 h-3.5 text-barak-gold" /> Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="e.g. partner@business.com"
                          className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-barak-gold" /> Operating City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Guwahati"
                          className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                          <ClipboardText className="w-3.5 h-3.5 text-barak-gold" /> Est. Monthly Volume (Kg)
                        </label>
                        <input
                          type="number"
                          name="monthly_quantity_kg"
                          value={form.monthly_quantity_kg}
                          onChange={handleInputChange}
                          placeholder="e.g. 250"
                          min="0"
                          className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-barak-muted flex items-center gap-1.5">
                        Inquiry Details / Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your business, grade preference, or packaging requirements..."
                        rows="4"
                        className="w-full bg-barak-surface border border-barak-border/60 focus:border-barak-gold/60 outline-none rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 transition-colors resize-none font-inherit"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-barak-gold hover:bg-barak-gold-light text-barak-bg font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Wholesale Inquiry'}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-barak-gold/20 flex items-center justify-center text-barak-gold mx-auto">
                      <Check className="w-8 h-8" weight="bold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold font-playfair text-barak-cream">Inquiry Submitted!</h3>
                      <p className="text-barak-muted text-sm max-w-md mx-auto">
                        Thank you for reaching out. We have received your wholesale inquiry and our partnerships team will email or call you within the next 24 business hours.
                      </p>
                    </div>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-barak-gold hover:text-barak-gold-light font-bold text-sm underline underline-offset-4"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-playfair text-barak-cream">Partnership FAQs</h2>
            <p className="text-barak-muted text-sm mt-2">Answers to common bulk buying questions</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const active = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="glass border border-barak-border/40 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(active ? null : idx)}
                    className="w-full text-left p-6 flex justify-between items-center text-barak-cream font-bold hover:text-barak-gold transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <CaretDown className={`w-5 h-5 transition-transform duration-300 ${active ? 'transform rotate-180 text-barak-gold' : 'text-barak-muted'}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="p-6 pt-0 text-barak-muted text-sm leading-relaxed border-t border-barak-border/10 bg-barak-bg/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
