import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, TwitterLogo, LinkedinLogo } from 'phosphor-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Footer() {
  const footerSections = [
    {
      title: 'Brand',
      links: [
        { label: 'About', to: '/our-story' },
        { label: 'Blog', to: '/blog' },
        { label: 'Wholesale B2B', to: '/wholesale' },
      ],
    },
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/shop' },
        { label: 'Gift Sets', to: '/shop' },
        { label: 'Brewing Equipment', to: '/shop' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Brew Guide', to: '/brew-guide' },
        { label: 'Tea Education', to: '/our-story' },
        { label: 'Sustainability', to: '/our-story' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'Email: hello@barak.tea', href: 'mailto:hello@barak.tea' },
        { label: 'WhatsApp', href: 'https://wa.me/919999999999?text=Hello%20BARAK%20Tea' },
        { label: 'Support', href: 'mailto:hello@barak.tea' },
      ],
    },
  ];

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
          <img src={logo} alt="BARAK Tea" className="h-20 w-auto object-contain" />
        </motion.div>


        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-bold text-barak-gold mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-barak-muted hover:text-barak-cream transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-barak-muted hover:text-barak-cream transition-colors">
                        {link.label}
                      </a>
                    )}
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
              { Icon: TwitterLogo, href: 'https://twitter.com' },
              { Icon: InstagramLogo, href: 'https://instagram.com' },
              { Icon: LinkedinLogo, href: 'https://linkedin.com' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
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
