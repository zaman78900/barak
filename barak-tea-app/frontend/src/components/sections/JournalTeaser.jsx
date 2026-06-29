import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import blogChaiImg    from '../../assets/blog_chai_brewing.png';
import blogHandsImg   from '../../assets/blog_plucker_hands.png';
import blogTerroirImg from '../../assets/blog_soil_terroir.png';

/**
 * Beat 7 — Journal / Culture teaser
 * Cards with hover-triggered image reveals.
 * Image hidden until cursor hover, then expands.
 * SEO-supporting article topic coverage.
 */

const articles = [
  {
    slug: 'what-is-ctc-tea',
    tag:   'Craft',
    title: 'What is CTC Tea?',
    summary:
      'Crush, Tear, Curl — discover the ancient method that defines every cup of BARAK and why the granule structure matters for flavour, colour, and brew time.',
    img: blogChaiImg,
    alt: 'CTC tea granules being brewed in a traditional Assam style — Barak Tea Blog',
    read: '5 min read',
  },
  {
    slug: 'barak-valley-tea-history',
    tag:   'Heritage',
    title: 'Barak Valley Tea History',
    summary:
      'Long before Darjeeling became famous, Barak Valley estates were producing some of India\'s most characterful teas. A story of land, memory, and the craft of Assam tea.',
    img: blogHandsImg,
    alt: 'Expert tea plucker hands holding freshly plucked leaves in Barak Valley Assam',
    read: '7 min read',
  },
  {
    slug: 'how-to-brew-assam-ctc-tea',
    tag:   'Ritual',
    title: 'How to Brew Assam CTC Tea',
    summary:
      'The perfect cup of BARAK Assam tea takes 4 minutes and one golden rule. Our estate guide to the ideal water temperature, steeping time, and chai ratio.',
    img: blogTerroirImg,
    alt: 'Mineral-rich soil of Barak Valley Assam tea garden terroir',
    read: '4 min read',
  },
];

function JournalCard({ article, index }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/blog')}
      data-cursor="Read"
      className="relative rounded-2xl overflow-hidden border border-white/5 group cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      {/* Image reveal — hidden until hover, then expands */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="img"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={article.img}
              alt={article.alt}
              className="w-full h-full object-cover brightness-50 grayscale-[20%]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col min-h-[280px] justify-between">
        {/* Top meta */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-barak-gold" />
            <span className="font-inter text-[9px] uppercase tracking-[0.4em] text-barak-gold">
              {article.tag}
            </span>
          </div>
          <span className="font-inter text-[9px] text-barak-cream/30 tracking-wider">
            {article.read}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-playfair font-black text-barak-cream leading-tight tracking-tight mb-4 group-hover:text-barak-gold-light transition-colors duration-500"
          style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}
        >
          {article.title}
        </h3>

        {/* Summary */}
        <p
          className={`font-inter text-sm leading-relaxed transition-all duration-500 ${
            hovered ? 'text-barak-cream/80' : 'text-barak-muted'
          }`}
        >
          {article.summary}
        </p>

        {/* CTA arrow */}
        <motion.div
          animate={{ x: hovered ? 6 : 0, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
          className="mt-6 flex items-center gap-2 text-barak-gold text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          <span>Read Article</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function JournalTeaser() {
  const navigate = useNavigate();

  return (
    <section
      className="relative py-24 md:py-36 px-6 overflow-hidden"
      style={{ background: '#0D0905' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,146,42,0.03) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-inter text-[10px] uppercase tracking-[0.45em] text-barak-gold block mb-4"
            >
              Culture & Knowledge
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair font-black text-barak-cream tracking-tight leading-tight"
              style={{ fontSize: 'clamp(28px, 4.5vw, 54px)' }}
            >
              The Journal
            </motion.h2>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/blog')}
            data-cursor="Read"
            className="inline-flex items-center gap-2 font-inter text-[10px] uppercase tracking-[0.3em] font-bold text-barak-gold hover:text-barak-gold-light transition-colors group"
          >
            View All Articles
            <svg
              className="group-hover:translate-x-1 transition-transform duration-300"
              width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <JournalCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
