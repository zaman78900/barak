import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../utils/hooks';

export default function EditorialCarousel() {
  const navigate = useNavigate();
  const { products, loading } = useProducts(1, 4);
  const containerRef = useRef(null);

  const scrollRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Background colors corresponding to products (dynamic high-end morph)
  const bgColors = ['#0a0a0a', '#1a110a', '#0a1a11', '#1a0a0a'];
  const [activeBg, setActiveBg] = useState(bgColors[0]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setScrollRange(scrollRef.current.scrollWidth - window.innerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(handleResize);
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [products, loading]);

  // Calculate which item is currently centered
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!products || products.length === 0) return;
    const itemsCount = products.length;
    // Map scroll progress 0-1 to index
    const index = Math.min(Math.floor(latest * itemsCount), itemsCount - 1);
    setActiveBg(bgColors[index % bgColors.length]);
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  return (
    <motion.section 
      ref={containerRef} 
      className="h-[400vh] relative transition-colors duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ backgroundColor: activeBg }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Floating background noise/texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"/>

        {loading || !products ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-6xl font-playfair font-black text-white leading-[0.9] tracking-tighter mb-4">
              The Collection
            </h2>
            <p className="text-barak-gold text-xs tracking-[0.4em] uppercase font-bold animate-pulse">
              Loading masterfully crafted blends...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-6xl font-playfair font-black text-white leading-[0.9] tracking-tighter mb-4">
              The Collection
            </h2>
            <p className="text-white/60 font-light text-lg">
              Explore our masterfully crafted blends, coming soon.
            </p>
          </div>
        ) : (
          <motion.div ref={scrollRef} style={{ x }} className="flex h-full items-center pl-[10vw] pr-[5vw]">
            <div className="w-[80vw] md:w-[35vw] shrink-0">
              <h2 className="text-5xl md:text-8xl font-playfair font-black text-white leading-[0.9] tracking-tighter mb-6">
                The <br/> <span className="italic text-white/50">Collection</span>
              </h2>
              <p className="text-white/60 font-light text-lg">
                Explore our masterfully crafted blends, where every leaf is treated as a piece of art.
              </p>
            </div>

            {/* Product Cards */}
            {products.map((product, idx) => (
              <div 
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-[90vw] md:w-[60vw] h-[75vh] shrink-0 mx-[5vw] relative flex items-center justify-center group cursor-pointer"
              >
                {/* Massive floating image */}
                <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="max-h-[90%] max-w-[80%] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:rotate-2 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  ) : (
                    <div className="text-9xl group-hover:scale-110 transition-transform duration-1000">🍵</div>
                  )}
                </div>

                {/* Massive background typography */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <span className="text-[25vw] font-playfair font-black text-white whitespace-nowrap">
                    {product.category}
                  </span>
                </div>

                {/* Foreground Product Info */}
                <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <h3 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-xl md:text-2xl font-light text-white/60">₹{product.price}</p>
                </div>

                {/* Explore Button (Appears on Hover) */}
                <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 z-20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-black transition-colors">
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="w-[10vw] shrink-0" />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
