import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, TwitterLogo, LinkedinLogo, FacebookLogo, Leaf } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store';
import logo from '../assets/logo.png';

export default function Footer() {
  const { leafAnimationEnabled, toggleLeafAnimation } = useSettingsStore();

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
        { label: 'Email: mantrading890@gmail.com', href: 'mailto:mantrading890@gmail.com' },
        { label: 'WhatsApp', href: 'https://wa.me/916000034182?text=Hello%20BARAK%20Tea' },
        { label: 'Support', href: 'mailto:mantrading890@gmail.com' },
      ],
    },
  ];

  return (
    <footer className="bg-[#050505] relative z-20 border-t border-white/5 overflow-hidden">

      {/* Animated Center-Out Expansion Divider Line */}
      <div className="w-full flex justify-center">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-barak-gold/30 to-transparent origin-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        {/* Logo and Brand tagline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            <img src={logo} alt="BARAK Tea" className="h-12 w-auto object-contain self-start transition-transform duration-300 hover:scale-105" />
            <p className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em]">
              Valley of the Golden Leaf
            </p>
          </motion.div>

          <div className="max-w-xs text-left md:text-right">
            <p className="text-xs text-barak-muted font-light leading-relaxed">
              Cultivating legacy, flavor, and luxury in every leaf. Handpicked and sealed at our private Assam estate.
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h4 className="text-xs font-bold text-barak-cream mb-4 uppercase tracking-[0.2em]">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx} className="overflow-hidden">
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-xs text-barak-muted hover:text-barak-gold-light transition-colors duration-300 relative inline-block group"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-barak-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-xs text-barak-muted hover:text-barak-gold-light transition-colors duration-300 relative inline-block group"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-barak-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar Section */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-barak-muted font-light tracking-wider">
            © 2026 BARAK Tea. All rights reserved. Cultivated in Silchar.
          </p>

          {/* Social Icons with luxury circles */}
          <div className="flex gap-4 items-center">
            {/* Animation Toggle */}
            <button
              onClick={toggleLeafAnimation}
              title={leafAnimationEnabled ? "Disable background leaves" : "Enable background leaves"}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-350 ${leafAnimationEnabled
                ? 'border-green-400/50 text-green-400 bg-green-400/10 shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'border-white/10 text-barak-muted hover:text-green-400 hover:border-green-400/50 hover:shadow-[0_0_8px_rgba(74,222,128,0.2)] bg-white/2'
                }`}
              aria-label="Toggle leaf animation"
            >
              <Leaf size={14} weight={leafAnimationEnabled ? "fill" : "regular"} />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>

            {[
              { Icon: FacebookLogo, href: 'https://facebook.com' },
              { Icon: TwitterLogo, href: 'https://twitter.com' },
              { Icon: InstagramLogo, href: 'https://instagram.com' },
              { Icon: LinkedinLogo, href: 'https://linkedin.com' },
            ].map(({ Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-barak-muted hover:text-barak-gold hover:border-barak-gold/40 transition-colors duration-350 bg-white/2"
                aria-label="Social media link"
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

