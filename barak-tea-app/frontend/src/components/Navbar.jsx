import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, MagnifyingGlass, List, X } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/shop' },
    { label: 'About', href: '/our-story' },
    { label: 'Contact', href: '#footer' },
  ];

  const handleLinkClick = (href, e) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-4 pointer-events-none"
      >
        <div 
          className={`mx-auto max-w-7xl w-full transition-all duration-500 pointer-events-auto rounded-full border ${
            isScrolled 
              ? 'bg-[#050505]/75 backdrop-blur-xl border-barak-gold/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] py-2 px-6' 
              : 'bg-transparent border-transparent py-4 px-4'
          }`}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center relative z-50"
            >
              <img 
                src={logo} 
                alt="BARAK Tea" 
                className="h-10 md:h-12 w-auto object-contain transition-all duration-300 hover:scale-105" 
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-1 items-center relative h-full">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href.startsWith('#') ? '/' : link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative text-sm font-medium text-barak-cream/80 hover:text-white px-4 py-2 transition-colors duration-300 rounded-full"
                  >
                    {/* Active Bottom Line */}
                    {isActive && (
                      <motion.span 
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-barak-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover Capsule Background */}
                    {hoveredIndex === idx && (
                      <motion.span
                        layoutId="navHoverCapsule"
                        className="absolute inset-0 bg-white/5 border border-white/5 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Actions & Buttons */}
            <div className="flex items-center gap-2 relative z-50">
              <button 
                className="p-2.5 text-barak-cream/80 hover:text-barak-gold transition-colors duration-300 rounded-full hover:bg-white/5" 
                aria-label="Search"
              >
                <MagnifyingGlass size={18} />
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="relative p-2.5 text-barak-cream/80 hover:text-barak-gold transition-colors duration-300 rounded-full hover:bg-white/5"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-barak-gold text-[#050505] text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-gold-glow"
                  >
                    {cartCount > 99 ? '99' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* Luxury Shop Now Button */}
              <button
                onClick={() => navigate('/shop')}
                className="hidden md:block nav-shop-now ml-2 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold text-barak-cream"
              >
                Shop Now
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                className="md:hidden p-2 text-barak-cream/80 hover:text-barak-gold transition-colors duration-300 rounded-full hover:bg-white/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: idx * 0.08, ease: [0.215, 0.610, 0.355, 1] }}
                >
                  <Link
                    to={link.href.startsWith('#') ? '/' : link.href}
                    className="text-4xl sm:text-5xl font-playfair font-bold text-barak-cream hover:text-barak-gold transition-colors duration-300 block"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleLinkClick(link.href, e);
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                transition={{ delay: navLinks.length * 0.08 + 0.1 }}
                className="flex flex-col gap-4 mt-8"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/shop');
                  }}
                  className="w-full text-center nav-shop-now py-4 rounded-full text-xs uppercase tracking-widest font-bold text-barak-cream"
                >
                  Shop Now
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


