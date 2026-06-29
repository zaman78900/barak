import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Envelope, Phone, MapPin, Clock, 
  CaretDown, Check, PaperPlaneTilt, 
  Chats, Leaf, ArrowLeft 
} from 'phosphor-react';
import { contactAPI } from '../utils/adminApi';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Customer Support',
  'Tea Estate Visit',
  'Wholesale & Partnerships',
  'Feedback & Reviews',
  'Other'
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubjectSelect = (subject) => {
    setForm(f => ({ ...f, subject }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreedToPrivacy) {
      setError('You must agree to the data processing terms.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message
      };

      await contactAPI.submit(payload);
      setSuccess(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setAgreedToPrivacy(false);
    } catch (err) {
      setError(err.error || err.message || 'Failed to dispatch message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-barak-bg pt-28 pb-20 px-4 text-barak-cream relative overflow-hidden"
    >
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-barak-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-barak-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-xs uppercase font-bold text-barak-gold tracking-[0.3em] font-dmsans"
          >
            <Leaf size={14} className="text-barak-gold" />
            Valley of the Golden Leaf
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-playfair font-semibold text-barak-cream tracking-tight"
          >
            Connect With Our Estate
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-barak-muted font-light leading-relaxed"
          >
            Whether you are curious about our seasonal harvests, interested in a bespoke B2B partnership, or wish to schedule an estate visit, we welcome your inquiry. 
          </motion.p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact details & Estate Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Coordinates Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-barak-surface/60 border border-barak-border/50 rounded-glass p-8 relative overflow-hidden backdrop-blur-glass shadow-glass"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-barak-gold/10 rounded-full blur-2xl" />
              
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.2em]">Geographic Estate Location</div>
                <div className="text-3xl font-cormorant font-bold text-barak-cream tracking-wider">24°49'N &nbsp; 92°48'E</div>
                <p className="text-xs text-barak-muted font-light leading-relaxed">
                  Cultivated in the pristine valleys of Cachar, Silchar, Assam. Our private estate sits along the fertile banks of the Barak River, enjoying optimal rain patterns and natural shade.
                </p>
                
                {/* Visual coordinate graphics */}
                <div className="pt-4 border-t border-barak-border/30 flex items-center justify-between text-[11px] text-barak-muted">
                  <span>Elevation: 45m MSL</span>
                  <span>Soil: Highly Acidic Alluvial</span>
                </div>
              </div>
            </motion.div>

            {/* Direct Channels */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-barak-surface/40 border border-barak-border/30 rounded-glass p-8 space-y-6 backdrop-blur-glass"
            >
              <h3 className="text-xs font-bold text-barak-gold uppercase tracking-[0.2em] border-b border-barak-border/30 pb-3">
                Direct Channels
              </h3>

              <div className="space-y-6">
                
                {/* Email Address */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full border border-barak-gold/20 flex items-center justify-center text-barak-gold bg-barak-gold/5 flex-shrink-0">
                    <Envelope size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-barak-cream tracking-wider uppercase mb-1">Estate Correspondence</h4>
                    <a href="mailto:hello@barak.tea" className="text-sm text-barak-muted hover:text-barak-gold transition-colors duration-300">
                      hello@barak.tea
                    </a>
                  </div>
                </div>

                {/* Phone & Concierge */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full border border-barak-gold/20 flex items-center justify-center text-barak-gold bg-barak-gold/5 flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-barak-cream tracking-wider uppercase mb-1">Concierge & Sales</h4>
                    <p className="text-sm text-barak-muted">
                      +91 99999 99999
                    </p>
                  </div>
                </div>

                {/* WhatsApp Chat */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full border border-barak-gold/20 flex items-center justify-center text-barak-gold bg-barak-gold/5 flex-shrink-0">
                    <Chats size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-barak-cream tracking-wider uppercase mb-1">WhatsApp Hotline</h4>
                    <a 
                      href="https://wa.me/919999999999?text=Hello%20BARAK%20Tea%20estate" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-[#25D366] hover:underline font-medium tracking-wide flex items-center gap-1.5 mt-1"
                    >
                      Chat with Estate Representative &rarr;
                    </a>
                  </div>
                </div>

                {/* Hours of Ceremony */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full border border-barak-gold/20 flex items-center justify-center text-barak-gold bg-barak-gold/5 flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-barak-cream tracking-wider uppercase mb-1">Hours of Service</h4>
                    <p className="text-xs text-barak-muted">
                      Monday &ndash; Saturday, 9:00 AM &ndash; 6:00 PM IST
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-barak-surface/60 border border-barak-border/40 rounded-glass p-8 md:p-10 relative overflow-hidden backdrop-blur-glass shadow-glass"
            >
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="border-b border-barak-border/20 pb-4 mb-2">
                      <h2 className="text-xl font-playfair font-medium text-barak-cream">Send a Message</h2>
                      <p className="text-xs text-barak-muted mt-1">Fields marked with * are required.</p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-barak-error/10 border border-barak-error/30 text-barak-error text-xs rounded-lg p-3"
                      >
                        {error}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-[11px] uppercase font-bold text-barak-cream tracking-wider">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          placeholder="Lord Curzon"
                          required
                          className="w-full bg-barak-bg border border-barak-border/50 rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 focus:outline-none focus:border-barak-gold focus:ring-1 focus:ring-barak-gold/30 transition-all duration-300"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-[11px] uppercase font-bold text-barak-cream tracking-wider">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="curzon@valley.tea"
                          required
                          className="w-full bg-barak-bg border border-barak-border/50 rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 focus:outline-none focus:border-barak-gold focus:ring-1 focus:ring-barak-gold/30 transition-all duration-300"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Phone */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-[11px] uppercase font-bold text-barak-cream tracking-wider">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="+91 99999 99999"
                          className="w-full bg-barak-bg border border-barak-border/50 rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 focus:outline-none focus:border-barak-gold focus:ring-1 focus:ring-barak-gold/30 transition-all duration-300"
                        />
                      </div>

                      {/* Custom Dropdown for Subject */}
                      <div className="flex flex-col gap-2 relative">
                        <span className="text-[11px] uppercase font-bold text-barak-cream tracking-wider">
                          Inquiry Subject *
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full bg-barak-bg border border-barak-border/50 rounded-lg px-4 py-3 text-sm text-barak-cream flex items-center justify-between focus:outline-none focus:border-barak-gold transition-all duration-300 text-left"
                        >
                          <span className={form.subject ? 'text-barak-cream' : 'text-barak-muted/40'}>
                            {form.subject || 'Select subject'}
                          </span>
                          <CaretDown size={14} className={`text-barak-muted transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.ul
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#120B06] border border-barak-border rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto"
                            >
                              {SUBJECT_OPTIONS.map(opt => (
                                <li key={opt}>
                                  <button
                                    type="button"
                                    onClick={() => handleSubjectSelect(opt)}
                                    className="w-full text-left px-4 py-2.5 text-xs text-barak-cream hover:bg-barak-gold/10 hover:text-barak-gold transition-colors duration-200"
                                  >
                                    {opt}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-[11px] uppercase font-bold text-barak-cream tracking-wider">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleInputChange}
                        placeholder="Write your correspondence here..."
                        required
                        className="w-full bg-barak-bg border border-barak-border/50 rounded-lg px-4 py-3 text-sm text-barak-cream placeholder-barak-muted/40 focus:outline-none focus:border-barak-gold focus:ring-1 focus:ring-barak-gold/30 transition-all duration-300 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Privacy policy agreement check */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={agreedToPrivacy}
                        onChange={() => setAgreedToPrivacy(!agreedToPrivacy)}
                        className="mt-1 rounded border-barak-border/50 text-barak-gold bg-barak-bg focus:ring-barak-gold/30 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="privacy" className="text-xs text-barak-muted font-light leading-relaxed cursor-pointer select-none">
                        I authorize BARAK Tea to process my data to address my inquiry. Your personal information is protected under our private estate data guidelines.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-barak-gold hover:bg-barak-gold-light text-[#0D0905] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-gold-glow cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0D0905] border-t-transparent rounded-full animate-spin" />
                            Dispatching...
                          </>
                        ) : (
                          <>
                            <PaperPlaneTilt size={14} weight="bold" />
                            Dispatch Message
                          </>
                        )}
                      </button>
                    </div>

                  </motion.form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12 px-6 flex flex-col items-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full border border-barak-gold flex items-center justify-center text-barak-gold bg-barak-gold/10 shadow-gold-glow">
                      <Check size={32} weight="bold" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-playfair font-semibold text-barak-cream">Inquiry Sealed & Dispatched</h2>
                      <p className="text-sm text-barak-muted max-w-md mx-auto leading-relaxed">
                        Thank you for contacting BARAK Tea. Your message has been received by our estate partners. An representative will follow up via email or phone within the next 24 business hours.
                      </p>
                    </div>

                    <button
                      onClick={() => setSuccess(false)}
                      className="bg-transparent hover:bg-white/5 border border-barak-border text-barak-cream font-bold text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft size={12} />
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
