import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useCartStore } from '../store';

import api from '../utils/api.js';


/* ─── Step indicator ──────────────────────────────────────────────── */
function Steps({ current }) {
  const steps = ['Cart', 'Checkout', 'Confirmation'];
  return (
    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 ${done ? 'text-barak-gold/60' : active ? 'text-barak-gold' : 'text-barak-muted'}`}>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] flex-shrink-0 ${done ? 'bg-barak-gold border-barak-gold text-barak-bg' : 'border-current'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span>{label}</span>
            </div>
            {i < steps.length - 1 && <span className="text-barak-muted text-[10px]">→</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = 'error') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, showToast: show };
}

/* ─── Field component ─────────────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] tracking-widest uppercase text-barak-muted">{label}</label>
      {children}
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  );
}

/* ─── Input styles ─────────────────────────────────────────────────── */
const inputCls = (err) =>
  `w-full bg-[rgba(34,18,8,0.6)] border ${err ? 'border-red-700' : 'border-white/[0.08]'} text-barak-cream placeholder-barak-muted/50 px-4 py-3.5 text-sm outline-none focus:border-barak-gold transition-colors backdrop-blur-sm`;

const selectCls = (err) =>
  `w-full bg-[rgba(34,18,8,0.6)] border ${err ? 'border-red-700' : 'border-white/[0.08]'} text-barak-cream px-4 py-3.5 text-sm outline-none focus:border-barak-gold transition-colors appearance-none backdrop-blur-sm`;

/* ─── Payment method ──────────────────────────────────────────────── */
function PaymentOption({ id, icon, name, desc, badge, selected, onClick, children }) {
  return (
    <>
      <div
        onClick={onClick}
        className={`flex items-center gap-4 px-5 py-4 border cursor-pointer transition-all ${
          selected ? 'border-barak-gold bg-barak-gold/[0.06]' : 'border-white/[0.06] hover:border-barak-gold/20'
        }`}
        style={{ background: selected ? 'rgba(201,168,76,0.06)' : 'rgba(34,18,8,0.55)', backdropFilter: 'blur(16px)' }}
      >
        <div className={`w-[18px] h-[18px] rounded-full border flex-shrink-0 relative transition-all ${selected ? 'border-barak-gold bg-barak-gold' : 'border-barak-gold/40'}`}>
          {selected && <div className="absolute inset-[3px] bg-barak-bg rounded-full" />}
        </div>
        <div className="text-xl w-8 text-center">{icon}</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-barak-cream mb-0.5">{name}</div>
          <div className="text-[11px] text-barak-muted tracking-wide">{desc}</div>
        </div>
        {badge && (
          <span className={`text-[9px] tracking-widest uppercase px-2 py-1 border ${
            badge.gold
              ? 'bg-barak-gold/10 border-barak-gold/30 text-barak-gold'
              : 'bg-green-900/15 border-green-500/30 text-green-400'
          }`}>
            {badge.text}
          </span>
        )}
      </div>
      <AnimatePresence>
        {selected && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-x border-b border-white/[0.06] bg-white/[0.02] px-5 py-5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { toast, showToast } = useToast();

  const [payMethod, setPayMethod]   = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors]         = useState({});

  const [form, setForm] = useState(() => {
    try {
      const last = JSON.parse(localStorage.getItem('barak_last_order'));
      if (last && last.customer) {
        const names = (last.customer.name || '').trim().split(' ');
        const fName = names[0] || '';
        const lName = names.length > 1 ? names.slice(1).join(' ') : '';
        return {
          firstName: fName, lastName: lName, 
          email: last.customer.email || '', 
          phone: last.customer.phone || '',
          addr1: last.address?.line1 || '', 
          addr2: last.address?.line2 || '', 
          city: last.address?.city || '', 
          state: last.address?.state || '', 
          pincode: last.address?.pin || '',
          upiId: '', cardNum: '', cardName: '', cardExpiry: '', cardCvv: '', bank: '',
        };
      }
    } catch (e) {}
    return {
      firstName: '', lastName: '', email: '', phone: '',
      addr1: '', addr2: '', city: '', state: '', pincode: '',
      upiId: '', cardNum: '', cardName: '', cardExpiry: '', cardCvv: '',
      bank: '',
    };
  });

  /* Load order totals from cart page */
  const od = (() => {
    try { return JSON.parse(localStorage.getItem('barak_order') || '{}'); }
    catch { return {}; }
  })();
  const codFee  = payMethod === 'cod' ? 20 : 0;
  const displayTotal = (od.total || 0) + codFee;

  /* Redirect if cart empty (unless processing an order) */
  useEffect(() => {
    if (items.length === 0 && !processing) navigate('/cart');
  }, [items, processing, navigate]);

  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === 'cardNum') {
      val = val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'cardExpiry') {
      val = val.replace(/\D/g, '').substring(0, 4);
      if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
    } else if (field === 'cardCvv') {
      val = val.replace(/\D/g, '').substring(0, 4);
    } else if (field === 'pincode') {
      val = val.replace(/\D/g, '').substring(0, 6);
    }
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    const req = ['firstName','lastName','email','phone','addr1','city','state','pincode'];
    req.forEach(k => { if (!form[k].trim()) errs[k] = 'Required'; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.phone && !/^[+\d\s()-]{8,14}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) errs.pincode = '6-digit PIN code required';
    if (payMethod === 'upi' && (!form.upiId.trim() || !form.upiId.includes('@')))
      errs.upiId = 'Enter a valid UPI ID (e.g. name@bank)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Place order ── */
  const placeOrder = async () => {
    if (!validate()) { showToast('Please fill all required fields', 'error'); return; }
    setProcessing(true);

    const localOrderNum = 'BRK' + Date.now().toString().slice(-6);

    // Build payload for the backend
    const payload = {
      order_number: localOrderNum,
      items: items.map(i => ({
        product_id: i.id || null,   // real product id if available
        name:       i.name,
        price:      i.price,
        quantity:   i.quantity,
        variant:    i.variant || 'Standard',
        size:       i.variant || 'Standard',
        image:      i.image,
      })),
      customer_info: {
        name:  form.firstName + ' ' + form.lastName,
        email: form.email,
        phone: form.phone,
      },
      shipping_address: {
        line1:  form.addr1,
        line2:  form.addr2,
        city:   form.city,
        state:  form.state,
        pin:    form.pincode,
      },
      payment_method: payMethod,
      total_amount:   displayTotal,
      coupon_code:    od.promo || null,
    };

    // ── Call the backend ──────────────────────────────────────────
    let backendOrderNum = localOrderNum;
    try {
      const result = await api.post('/orders/guest', payload);
      backendOrderNum = result.order_number || localOrderNum;
      console.log('[Checkout] Order saved to DB:', result);
    } catch (err) {
      // Non-fatal — still proceed to confirmation but log the error
      console.error('[Checkout] Failed to save order to backend:', err);
    }

    // ── Save for the Confirmation page ───────────────────────────
    const orderData = {
      orderNumber: backendOrderNum,
      items: items.map(i => ({
        name: i.name, size: i.variant || 'Standard',
        price: i.price, qty: i.quantity, image: i.image,
      })),
      customer: {
        name:  form.firstName + ' ' + form.lastName,
        email: form.email,
        phone: form.phone,
      },
      address: {
        line1: form.addr1, line2: form.addr2,
        city: form.city, state: form.state, pin: form.pincode,
      },
      payment: { method: payMethod },
      totals: { ...od, codFee, finalTotal: displayTotal },
      date: new Date().toISOString(),
    };
    localStorage.setItem('barak_last_order', JSON.stringify(orderData));

    // Wait for the processing overlay then navigate
    setTimeout(() => {
      clearCart();
      navigate('/confirmation');
    }, 2000);
  };


  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-barak-bg pb-20" style={{ paddingTop: '72px' }}>
      {/* Noise */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-30"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")` }} />

      {/* Checkout nav strip */}
      <div className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 flex items-center justify-between h-[72px] border-b border-barak-gold/10"
        style={{ background: 'rgba(13,8,5,0.96)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="flex items-center">
          <img src={logo} alt="BARAK Tea" className="h-8 md:h-10 w-auto object-contain" />
        </Link>
        <div className="hidden md:block"><Steps current={1} /></div>
        <div className="flex items-center gap-2 text-[11px] text-barak-muted tracking-wide">
          🔒 Secure Checkout
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[1300px] mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start relative z-20">

        {/* ── Left: Form ── */}
        <div>

          {/* Section helper */}
          {[
            { num: '01', title: 'Contact Details' },
            { num: '02', title: 'Shipping Address' },
            { num: '03', title: 'Payment Method' },
          ].map((_, sIdx) => (
            <div key={sIdx} />
          ))}

          {/* 01 Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 pb-3 mb-6 border-b border-white/[0.06]">
              <span className="font-bebas text-3xl text-barak-gold leading-none">01</span>
              <span className="font-playfair text-xl font-bold text-barak-cream">Contact Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name *" error={errors.firstName}>
                <input className={inputCls(errors.firstName)} placeholder="Rina" value={form.firstName} onChange={set('firstName')} />
              </Field>
              <Field label="Last Name *" error={errors.lastName}>
                <input className={inputCls(errors.lastName)} placeholder="Dutta" value={form.lastName} onChange={set('lastName')} />
              </Field>
              <Field label="Email Address *" error={errors.email}>
                <input type="email" className={inputCls(errors.email)} placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </Field>
              <Field label="Phone Number *" error={errors.phone}>
                <input type="tel" className={inputCls(errors.phone)} placeholder="+91 98765 43210" maxLength={14} value={form.phone} onChange={set('phone')} />
              </Field>
            </div>
          </motion.section>

          {/* 02 Shipping */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 pb-3 mb-6 border-b border-white/[0.06]">
              <span className="font-bebas text-3xl text-barak-gold leading-none">02</span>
              <span className="font-playfair text-xl font-bold text-barak-cream">Shipping Address</span>
            </div>
            <div className="flex flex-col gap-4">
              <Field label="Address Line 1 *" error={errors.addr1}>
                <input className={inputCls(errors.addr1)} placeholder="House no., Street, Colony" value={form.addr1} onChange={set('addr1')} />
              </Field>
              <Field label="Address Line 2">
                <input className={inputCls(false)} placeholder="Landmark, Area (optional)" value={form.addr2} onChange={set('addr2')} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City *" error={errors.city}>
                  <input className={inputCls(errors.city)} placeholder="Silchar" value={form.city} onChange={set('city')} />
                </Field>
                <Field label="State *" error={errors.state}>
                  <select className={selectCls(errors.state)} value={form.state} onChange={set('state')}>
                    <option value="">Select State</option>
                    {['Assam','Meghalaya','Tripura','Manipur','Mizoram','Nagaland',
                      'Arunachal Pradesh','Sikkim','West Bengal','Delhi','Maharashtra',
                      'Karnataka','Tamil Nadu','Telangana','Gujarat','Rajasthan',
                      'Uttar Pradesh','Bihar','Madhya Pradesh','Other'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="PIN Code *" error={errors.pincode}>
                  <input className={inputCls(errors.pincode)} placeholder="788001" maxLength={6} value={form.pincode} onChange={set('pincode')} />
                </Field>
                <Field label="Country">
                  <input className={inputCls(false)} value="India" readOnly style={{ opacity: 0.5 }} />
                </Field>
              </div>
            </div>
          </motion.section>

          {/* 03 Payment */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 pb-3 mb-6 border-b border-white/[0.06]">
              <span className="font-bebas text-3xl text-barak-gold leading-none">03</span>
              <span className="font-playfair text-xl font-bold text-barak-cream">Payment Method</span>
            </div>
            <div className="flex flex-col gap-[2px]">

              <PaymentOption id="upi" icon="📱" name="UPI" desc="PhonePe, GPay, Paytm, BHIM"
                badge={{ text: 'Instant', gold: false }} selected={payMethod === 'upi'} onClick={() => setPayMethod('upi')}>
                <Field label="UPI ID" error={errors.upiId}>
                  <input className={inputCls(errors.upiId)} style={{ maxWidth: 360 }} placeholder="yourname@paytm" value={form.upiId} onChange={set('upiId')} />
                </Field>
              </PaymentOption>

              <PaymentOption id="card" icon="💳" name="Credit / Debit Card" desc="Visa, Mastercard, RuPay"
                selected={payMethod === 'card'} onClick={() => setPayMethod('card')}>
                <div className="flex flex-col gap-4">
                  <Field label="Card Number">
                    <input className={inputCls(false)} placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNum} onChange={set('cardNum')} />
                  </Field>
                  <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
                    <Field label="Name on Card">
                      <input className={inputCls(false)} placeholder="Rina Dutta" value={form.cardName} onChange={set('cardName')} />
                    </Field>
                    <Field label="Expiry (MM/YY)">
                      <input className={inputCls(false)} placeholder="08/27" maxLength={5} value={form.cardExpiry} onChange={set('cardExpiry')} />
                    </Field>
                    <Field label="CVV">
                      <input type="password" className={inputCls(false)} placeholder="•••" maxLength={4} value={form.cardCvv} onChange={set('cardCvv')} />
                    </Field>
                  </div>
                </div>
              </PaymentOption>

              <PaymentOption id="netbanking" icon="🏦" name="Net Banking" desc="All major Indian banks"
                selected={payMethod === 'netbanking'} onClick={() => setPayMethod('netbanking')}>
                <Field label="Select Bank">
                  <select className={selectCls(false)} style={{ maxWidth: 360 }} value={form.bank} onChange={set('bank')}>
                    <option value="">Choose your bank</option>
                    {['SBI – State Bank of India','HDFC Bank','ICICI Bank','Axis Bank',
                      'Punjab National Bank','Bank of Baroda','Kotak Mahindra Bank',
                      'Canara Bank','Other Bank'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </Field>
              </PaymentOption>

              <PaymentOption id="cod" icon="💵" name="Cash on Delivery" desc="Pay when your order arrives"
                badge={{ text: '+₹20 fee', gold: true }} selected={payMethod === 'cod'} onClick={() => setPayMethod('cod')} />

            </div>
          </motion.section>
        </div>

        {/* ── Right: Order Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="sticky top-24 border border-barak-gold/12"
          style={{ background: 'rgba(34,18,8,0.72)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', padding: '36px' }}
        >
          <div className="font-playfair text-lg font-bold text-barak-cream mb-6 pb-4 border-b border-white/[0.06]">
            Your Order
          </div>

          {/* Items */}
          <div className="flex flex-col gap-4 mb-6">
            {items.map(item => (
              <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3.5">
                <div className="w-12 h-14 flex items-center justify-center flex-shrink-0 bg-white/[0.03] border border-white/[0.06] text-2xl">
                  {item.image || '🍵'}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-barak-cream leading-snug">{item.name}</div>
                  <div className="text-[11px] text-barak-muted mt-0.5">{item.variant || 'Standard'}</div>
                  <span className="inline-block mt-1 text-[10px] text-barak-gold border border-barak-gold/20 bg-barak-gold/10 px-1.5 py-0.5">
                    ×{item.quantity}
                  </span>
                </div>
                <div className="font-bebas text-lg text-barak-gold tracking-wide flex-shrink-0">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/[0.06] mb-3" />

          <div className="space-y-3 text-[13px] mb-3">
            <div className="flex justify-between">
              <span className="text-barak-muted">Subtotal</span>
              <span className="text-barak-cream">₹{od.sub || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-barak-muted">Shipping</span>
              <span className="text-barak-cream">{(od.shipping === 0) ? 'FREE' : `₹${od.shipping || 50}`}</span>
            </div>
            {(od.discount > 0) && (
              <div className="flex justify-between text-green-400">
                <span>Promo</span>
                <span>−₹{od.discount}</span>
              </div>
            )}
            {payMethod === 'cod' && (
              <div className="flex justify-between">
                <span className="text-barak-muted">COD Fee</span>
                <span className="text-barak-cream">₹20</span>
              </div>
            )}
          </div>

          <div className="h-px bg-white/[0.06] mb-4" />

          <div className="flex justify-between items-center mb-6">
            <span className="font-playfair text-base text-barak-cream">Total</span>
            <span className="font-bebas text-3xl text-barak-gold tracking-wide">₹{displayTotal}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={processing}
            className="relative w-full bg-barak-gold text-barak-bg py-5 font-bold text-[13px] tracking-[4px] uppercase overflow-hidden group mb-3 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-barak-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-350 pointer-events-none" />
            {processing ? (
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-barak-bg/30 border-t-barak-bg rounded-full animate-spin" />
                Processing…
              </span>
            ) : (
              <>
                <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="relative z-10">Place Order</span>
              </>
            )}
          </button>
          <div className="text-center text-[11px] text-barak-muted flex items-center justify-center gap-1.5 tracking-wide">
            🔒 SSL Encrypted · Safe &amp; Secure Payment
          </div>
        </motion.div>
      </div>

      {/* Processing overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(13,8,5,0.96)', backdropFilter: 'blur(8px)' }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-barak-gold/20 border-t-barak-gold animate-spin" />
            <p className="font-playfair text-2xl italic text-barak-cream">Brewing your order…</p>
            <p className="text-[13px] text-barak-muted tracking-widest uppercase">Please wait, do not close this page</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="fixed bottom-8 right-8 z-[9999] px-6 py-4 text-[13px] font-medium"
            style={{ background: toast.type === 'success' ? '#C9A84C' : '#8B0000', color: toast.type === 'success' ? '#0D0805' : '#FAF3E0' }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
