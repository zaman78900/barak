import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, TwitterLogo, LinkedinLogo } from 'phosphor-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Footer() {
  const footerLinks = {
    'Brand': ['About', 'Blog', 'Careers'],
    'Shop': ['All Products', 'Gift Sets', 'Brewing Equipment'],
    'Resources': ['Brew Guide', 'Tea Education', 'Sustainability'],
    'Contact': ['Email: hello@barak.tea', 'WhatsApp', 'Support'],
  };

  return (
    <footer className="bg-barak-bg border-t border-barak-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <img src={logo} alt="BARAK Tea" className="h-12 w-auto object-contain" />
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {Object.entries(footerLinks).map(([category, links], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-bold text-barak-gold mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-barak-muted hover:text-barak-cream transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-barak-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-barak-muted">
            © 2026 BARAK Tea. All rights reserved. Crafted with ☕ in Barak Valley.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { Icon: TwitterLogo, href: '#' },
              { Icon: InstagramLogo, href: '#' },
              { Icon: LinkedinLogo, href: '#' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 glass rounded-full flex items-center justify-center text-barak-gold hover:text-barak-gold-light hover:shadow-gold-glow transition-all"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
