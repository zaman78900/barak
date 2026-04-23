import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useProducts, useReviews } from '../utils/hooks';
import { useCartStore } from '../store';
import { FiStar, FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

/* ─── SCROLL & PARALLAX CONSTANTS ────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data Fetching
  const { product, loading: productLoading, error: productError } = useProduct(id);
  const { products: relatedProducts } = useProducts(1, 4, product ? { category: product.category } : {});
  const { reviews } = useReviews(id);
  const addItem = useCartStore(state => state.addItem);

  // Scroll to top on load or ID change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Local State

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [openAccordion, setOpenAccordion] = useState('brew'); // 'brew', 'desc', or null

  // Setup Gallery Images
  const gallery = product ? [
    product.image_url,
    ...(product.images || [])
  ].filter(Boolean) : [];

  // Initialize variant when product loads
  useEffect(() => {
    if (product && product.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Handle Variant Selection
  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
    // If variant has a specific image, find it in gallery or set it
    if (v.image_url) {
      const idx = gallery.indexOf(v.image_url);
      if (idx !== -1) {
        setActiveImage(idx);
      } else {
        // If not in gallery, we could temporarily add it or just show it
        // For simplicity, we'll assume it's either in gallery or we just use it
      }
    }
  };

  // Handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variantLabel = selectedVariant ? selectedVariant.variant_name : 'Standard';
    const price = selectedVariant ? selectedVariant.price : product.price;

    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image_url,
      variant: variantLabel,
      quantity
    });
  };

  const handleWhatsAppBuy = () => {
    if (!product) return;
    const variantLabel = selectedVariant ? selectedVariant.variant_name : 'Standard';
    const price = selectedVariant ? selectedVariant.price : product.price;
    const msg = `Hi, I would like to order:\n\n*${product.name}*\nVariant: ${variantLabel}\nQuantity: ${quantity}\nTotal: ₹${price * quantity}\n\nPlease let me know how to proceed.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-barak-bg pt-24 px-4 flex items-center justify-center">
        <div className="text-barak-cream text-xl animate-pulse">Brewing details...</div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-barak-bg pt-24 px-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-barak-cream font-bold">Product not found</h1>
        <button onClick={() => navigate('/shop')} className="mt-6 text-barak-gold underline">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barak-bg text-barak-cream pb-24 overflow-hidden pt-28 md:pt-32">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ─── LEFT: IMAGE GALLERY (PARALLAX & ZOOM) ──────────────────────── */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 sticky top-24 self-start"
          >
            {/* Thumbnail Rail (Desktop left, Mobile bottom) */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
              {gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-20 h-24 lg:w-24 lg:h-28 rounded-xl overflow-hidden transition-all duration-300 ${activeImage === idx ? 'ring-2 ring-barak-gold ring-offset-2 ring-offset-barak-bg' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Viewer */}
            <div 
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/20 cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={gallery[activeImage]} 
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
              />
            </div>
          </motion.div>

          {/* ─── RIGHT: PRODUCT DETAILS ──────────────────────────────────────── */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Breadcrumbs & Category */}
            <motion.div variants={fadeUp} className="text-sm text-barak-muted mb-4 uppercase tracking-wider font-semibold">
              <span className="cursor-pointer hover:text-barak-gold" onClick={() => navigate('/shop')}>Shop</span> 
              <span className="mx-2">/</span> 
              <span className="text-barak-gold">{product.category}</span>
            </motion.div>

            {/* Title & Price */}
            <motion.div variants={fadeUp}>
              <h1 className="text-4xl lg:text-5xl font-playfair font-black mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bebas tracking-wide">₹{selectedVariant?.price || product.price}</span>
                {(selectedVariant?.mrp || product.mrp) && (
                  <span className="text-xl text-barak-muted line-through font-bebas">₹{selectedVariant?.mrp || product.mrp}</span>
                )}
              </div>
            </motion.div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <motion.div variants={fadeUp} className="mb-8">
                <h3 className="text-sm text-barak-muted mb-3 uppercase tracking-wider font-semibold">Select Size</h3>
                <div className="flex gap-3">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantSelect(v)}
                      className={`px-5 py-3 rounded-lg border font-medium transition-all ${
                        selectedVariant?.id === v.id 
                        ? 'border-barak-gold bg-barak-gold/10 text-barak-gold' 
                        : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity & CTAs */}
            <motion.div variants={fadeUp} className="mb-12 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <FiMinus />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <FiPlus />
                  </button>
                </div>

                {/* Primary CTA */}
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-barak-cream text-barak-bg font-bold rounded-lg hover:bg-barak-gold hover:text-white transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  Add to Cart
                </button>
              </div>

              {/* Secondary CTA: WhatsApp */}
              <button 
                onClick={handleWhatsAppBuy}
                className="w-full h-14 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-all"
              >
                <FaWhatsapp className="text-xl" />
                Buy via WhatsApp
              </button>
            </motion.div>

            {/* Accordions (Brew Snippet & Description) */}
            <motion.div variants={fadeUp} className="border-t border-white/10">
              {/* Description */}
              <div className="border-b border-white/10">
                <button 
                  className="w-full py-6 flex justify-between items-center text-lg font-playfair font-bold"
                  onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                >
                  Description
                  {openAccordion === 'desc' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <AnimatePresence>
                  {openAccordion === 'desc' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-white/70 leading-relaxed">
                        {product.description || 'Experience the authentic taste of Barak Valley with this premium blend. Hand-picked from the finest gardens, this tea offers a robust flavor and rich aroma that rejuvenates your senses with every sip.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Brew Snippet */}
              <div className="border-b border-white/10">
                <button 
                  className="w-full py-6 flex justify-between items-center text-lg font-playfair font-bold"
                  onClick={() => setOpenAccordion(openAccordion === 'brew' ? null : 'brew')}
                >
                  How to Brew This Tea
                  {openAccordion === 'brew' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <AnimatePresence>
                  {openAccordion === 'brew' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                          <div className="text-2xl mb-2">🌡️</div>
                          <div className="font-bold">95°C</div>
                          <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Water Temp</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                          <div className="text-2xl mb-2">⚖️</div>
                          <div className="font-bold">2.5g</div>
                          <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Per Cup</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                          <div className="text-2xl mb-2">⏱️</div>
                          <div className="font-bold">3-4 Min</div>
                          <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Steep Time</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ─── RELATED PRODUCTS (Horizontal Rail) ─────────────────────────── */}
      {relatedProducts && relatedProducts.length > 0 && (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-7xl mx-auto px-4 lg:px-8 mt-32"
        >
          <h2 className="text-3xl font-playfair font-bold mb-8">You May Also Like</h2>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8">
            {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/product/${item.id}`)}
                className="min-w-[280px] w-[280px] group cursor-pointer"
              >
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/20 mb-4">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <h3 className="text-lg font-bold group-hover:text-barak-gold transition-colors">{item.name}</h3>
                <p className="text-barak-gold font-bebas text-xl mt-1">₹{item.price}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── SECTION 6.3: TESTIMONIALS / SOCIAL PROOF ──────────────────── */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-4 lg:px-8 mt-24"
      >
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-12 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-3">Loved by tea drinkers</h2>
              <p className="text-white/60">Real reviews from our Barak family.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex text-barak-gold text-xl">
                <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
              </div>
              <span className="font-bebas text-2xl pt-1">4.9/5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.slice(0, 3).map((review, i) => (
                <div key={i} className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-barak-gold/30 transition-colors">
                  <div className="flex text-barak-gold text-sm mb-4">
                    {[...Array(review.rating)].map((_, idx) => <FiStar key={idx} className="fill-current" />)}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{review.headline}</h4>
                  <p className="text-white/70 text-sm italic mb-6">"{review.body}"</p>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">- Customer</p>
                </div>
              ))
            ) : (
              // Fallback Social Proof if no reviews in DB
              <>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-barak-gold/30 transition-colors">
                  <div className="flex text-barak-gold text-sm mb-4">
                    <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Perfect Morning Cup</h4>
                  <p className="text-white/70 text-sm italic mb-6">"The flavor is robust and exact what I need to start my day. Highly recommend!"</p>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">- Riya S.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-barak-gold/30 transition-colors">
                  <div className="flex text-barak-gold text-sm mb-4">
                    <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Authentic Barak Taste</h4>
                  <p className="text-white/70 text-sm italic mb-6">"Reminds me of home. The packaging is premium and the tea leaves are super fresh."</p>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">- Amit K.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-barak-gold/30 transition-colors">
                  <div className="flex text-barak-gold text-sm mb-4">
                    <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Great value</h4>
                  <p className="text-white/70 text-sm italic mb-6">"Premium quality without the crazy price tag. Delivery was fast too."</p>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">- Sneha P.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
