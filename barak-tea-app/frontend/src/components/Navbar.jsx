import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MagnifyingGlass, List, X } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Brew Guide', href: '/brew-guide' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Blog', href: '/blog' },
    { label: 'Wholesale', href: '/wholesale' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass bg-[rgba(13,9,5,0.8)]' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-22">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center"
            >
              <img src={logo} alt="BARAK Tea" className="h-12 md:h-16 w-auto object-contain" />
            </Link>



            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-barak-cream hover:text-barak-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:text-barak-gold transition-colors" aria-label="Search">
                <MagnifyingGlass size={20} />
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:text-barak-gold transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-barak-gold text-barak-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* WhatsApp Button - Desktop */}
              <button className="hidden md:block glass px-4 py-2 rounded-pill text-sm font-semibold text-barak-cream hover:text-barak-gold transition-colors border border-barak-gold hover:border-barak-gold-light">
                Order on WhatsApp
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <List size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 pt-20 glass bg-[rgba(13,9,5,0.95)]"
        >
          <div className="flex flex-col gap-4 p-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.href}
                  className="text-lg font-medium text-barak-cream hover:text-barak-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="glass px-4 py-3 rounded-pill text-sm font-semibold text-barak-cream mt-4"
            >
              Order on WhatsApp
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-18 md:h-22" />
    </>

  );
}
