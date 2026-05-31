import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, ArrowRight, CheckCircle } from 'phosphor-react';
import { Link } from 'react-router-dom';

// Asset imports
import teaGardenImg from '../assets/barak_tea_garden.png';
import teaPluckingImg from '../assets/barak_tea_plucking.png';
import brewedCupImg from '../assets/barak_brewed_cup.png';

export default function OurStory() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Safe SVG Icons
  const MapPinIcon = () => (
    <svg className="w-6 h-6 text-barak-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-6 h-6 text-barak-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const QuotesIcon = () => (
    <svg className="w-12 h-12 text-barak-gold/20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-barak-bg overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={teaGardenImg}
            alt="Misty tea garden in Assam"
            className="w-full h-full object-cover object-center scale-105 animate-[pulseGlow_12s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-barak-bg" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-bold uppercase tracking-widest text-barak-gold mb-3 inline-block">
              Welcome to Barak
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-barak-cream mb-6 font-playfair leading-tight">
              Grown in the Valley,<br />
              <span className="gradient-gold">Brewed for the Soul</span>
            </h1>
            <p className="text-xl md:text-2xl text-barak-cream/80 max-w-3xl mx-auto font-light leading-relaxed">
              Discover the heritage, geography, and passion that brings the finest Assam tea directly from gardens to your cup.
            </p>
          </motion.div>

          {/* Quick Info Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-full border border-barak-border/50">
              <CalendarIcon />
              <div className="text-left">
                <p className="text-xs text-barak-muted uppercase tracking-wider font-bold">Founded</p>
                <p className="text-sm text-barak-cream font-semibold font-playfair">2019</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-full border border-barak-border/50">
              <MapPinIcon />
              <div className="text-left">
                <p className="text-xs text-barak-muted uppercase tracking-wider font-bold">Origin</p>
                <p className="text-sm text-barak-cream font-semibold font-playfair">Assam, Silchar, Kalain</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Genesis Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest block">
                The Genesis
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-barak-cream font-playfair leading-tight">
                Our Story Began With A Simple Promise
              </h2>
              <div className="w-16 h-1 bg-barak-gold rounded-full" />

              <p className="text-base md:text-lg text-barak-muted leading-relaxed">
                Founded in <strong>2019</strong>, BARAK was born from a desire to celebrate the rich tea-growing heritage of the Barak Valley in southern Assam. We noticed that while the region produced some of the world's most robust, high-grade CTC teas, the complex middleman supply chains often delayed transit, diluting the flavor and leaving consumers with stale blends.
              </p>
              <p className="text-base md:text-lg text-barak-muted leading-relaxed">
                By setting up our roots in <strong>Kalain, Silchar</strong>, we partnered directly with sustainable local estates. We designed a direct-to-cup path, ensuring that only the freshest, pure, unadulterated leaves reach your teapot.
              </p>

              <blockquote className="border-l-4 border-barak-gold pl-6 py-2 my-4">
                <p className="text-lg text-barak-cream font-playfair italic font-medium">
                  "We don't just sell tea. We preserve the integrity of the soil, the work of our pluckers, and the comfort of a warm brew."
                </p>
              </blockquote>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6"
            >
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-square bg-gradient-to-br from-barak-gold/10 to-barak-surface rounded-glass overflow-hidden shadow-glass group">
                <img
                  src={teaPluckingImg}
                  alt="Plucking tea leaves in Barak Valley"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs text-barak-gold font-bold uppercase tracking-wider">Harvesting Heritage</p>
                  <p className="text-lg text-barak-cream font-bold">Handpicked Two Leaves & A Bud</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terroir Section */}
      <section className="py-20 md:py-32 px-4 bg-barak-surface relative border-y border-barak-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 lg:order-last"
            >
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-square bg-gradient-to-br from-barak-gold/10 to-barak-surface rounded-glass overflow-hidden shadow-glass group">
                <img
                  src={brewedCupImg}
                  alt="A hot cup of brewed Barak Tea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs text-barak-gold font-bold uppercase tracking-wider">The Golden Liquor</p>
                  <p className="text-lg text-barak-cream font-bold">Malty, Strong, and Aromatic</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest block">
                The Terroir
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-barak-cream font-playfair leading-tight">
                Deeply Rooted in Kalain & Silchar
              </h2>
              <div className="w-16 h-1 bg-barak-gold rounded-full" />

              <p className="text-base md:text-lg text-barak-muted leading-relaxed">
                The Barak Valley, situated in southern Assam, features a distinct geographical climate. Nestled alongside the Barak River, the tea estates of <strong>Kalain and Silchar</strong> thrive in rich, fertile clay soil, accompanied by heavy tropical rainfall and warm, humid seasons.
              </p>
              <p className="text-base md:text-lg text-barak-muted leading-relaxed">
                This specific soil composition and environment give our CTC (Crush, Tear, Curl) tea its signature bold character. When brewed, it produces a deep golden-brown cup, a malty aroma, and a full-bodied texture that blends perfectly with milk and spices or stands strong on its own.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border border-barak-border/40 p-4 rounded-lg bg-black/10">
                  <span className="text-2xl font-black text-barak-gold font-playfair block">Clayey Soil</span>
                  <span className="text-sm text-barak-muted">Nourishes tea bushes with rich, essential minerals.</span>
                </div>
                <div className="border border-barak-border/40 p-4 rounded-lg bg-black/10">
                  <span className="text-2xl font-black text-barak-gold font-playfair block">Riverside Fog</span>
                  <span className="text-sm text-barak-muted">Ensures slow growth, concentrating malty sugars.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Timeline Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest">Our Journey</span>
            <h2 className="text-4xl font-black text-barak-cream font-playfair">Milestones that Define Us</h2>
            <div className="w-16 h-1 bg-barak-gold rounded-full mx-auto" />
          </motion.div>

          <div className="relative border-l border-barak-border/50 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12 py-4">
            {/* 2019 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-barak-bg border-2 border-barak-gold z-10">
                <div className="w-2 h-2 rounded-full bg-barak-gold" />
              </div>
              <div className="absolute right-full mr-8 top-1 hidden md:block text-right">
                <span className="text-3xl font-black text-barak-gold font-playfair">2019</span>
              </div>
              <div className="glass p-6 md:p-8">
                <span className="text-xl font-bold text-barak-gold font-playfair md:hidden block mb-1">2019</span>
                <h3 className="text-xl md:text-2xl font-bold text-barak-cream font-playfair mb-3">The Seed is Sown</h3>
                <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                  BARAK is founded in Kalain, Assam. We started with a select partnership with a single private family estate to procure high-grade Assam CTC tea, establishing our direct-sourcing standard.
                </p>
              </div>
            </motion.div>

            {/* 2020 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-barak-bg border-2 border-barak-gold z-10">
                <div className="w-2 h-2 rounded-full bg-barak-gold" />
              </div>
              <div className="absolute right-full mr-8 top-1 hidden md:block text-right">
                <span className="text-3xl font-black text-barak-gold font-playfair">2020</span>
              </div>
              <div className="glass p-6 md:p-8">
                <span className="text-xl font-bold text-barak-gold font-playfair md:hidden block mb-1">2020</span>
                <h3 className="text-xl md:text-2xl font-bold text-barak-cream font-playfair mb-3">Direct-to-Cup Setup</h3>
                <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                  We built our state-of-the-art sorting and packing facility in Silchar. This allowed us to clean, inspect, and package the tea immediately after harvesting, locking in maximum freshness before shipment.
                </p>
              </div>
            </motion.div>

            {/* 2022 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-barak-bg border-2 border-barak-gold z-10">
                <div className="w-2 h-2 rounded-full bg-barak-gold" />
              </div>
              <div className="absolute right-full mr-8 top-1 hidden md:block text-right">
                <span className="text-3xl font-black text-barak-gold font-playfair">2022</span>
              </div>
              <div className="glass p-6 md:p-8">
                <span className="text-xl font-bold text-barak-gold font-playfair md:hidden block mb-1">2022</span>
                <h3 className="text-xl md:text-2xl font-bold text-barak-cream font-playfair mb-3">Signature Blends Launched</h3>
                <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                  We introduced custom CTC tea blends, carefully formulated to cater to different tastes—ranging from robust breakfast teas to perfect masala chai bases.
                </p>
              </div>
            </motion.div>

            {/* Present */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-barak-bg border-2 border-barak-gold z-10">
                <div className="w-2 h-2 rounded-full bg-barak-gold" />
              </div>
              <div className="absolute right-full mr-8 top-1 hidden md:block text-right">
                <span className="text-3xl font-black text-barak-gold font-playfair">Present</span>
              </div>
              <div className="glass p-6 md:p-8">
                <span className="text-xl font-bold text-barak-gold font-playfair md:hidden block mb-1">Present</span>
                <h3 className="text-xl md:text-2xl font-bold text-barak-cream font-playfair mb-3">Heritage Shared Nationwide</h3>
                <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                  Today, BARAK serves thousands of households across India. We remain committed to our small-batch ethics, sustainable estate-direct sourcing, and the community of Barak Valley.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 md:py-32 px-4 bg-barak-surface border-y border-barak-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest">Our Foundation</span>
            <h2 className="text-4xl font-black text-barak-cream font-playfair">The Pillars of BARAK</h2>
            <div className="w-16 h-1 bg-barak-gold rounded-full mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass p-8 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-barak-gold/10 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6 text-barak-gold" weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-barak-cream font-playfair">100% Single Origin</h3>
              <p className="text-barak-muted text-sm leading-relaxed">
                Every single leaf is harvested exclusively from Barak Valley estates in Assam. We never dilute our packages with low-quality teas from other regions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-8 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-barak-gold/10 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-barak-gold" weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-barak-cream font-playfair">Supporting Communities</h3>
              <p className="text-barak-muted text-sm leading-relaxed">
                We believe in growing together. By partnering directly with local gardens in Kalain, we ensure fair wages, ethical work environments, and sustainable development.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass p-8 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-barak-gold/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-barak-gold" weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-barak-cream font-playfair">Uncompromised Quality</h3>
              <p className="text-barak-muted text-sm leading-relaxed">
                Our tea undergoes rigorous quality checks and taste tests. We package in hermetically sealed bags to lock in aroma and prevent oxidation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-16 rounded-glass text-center relative overflow-hidden"
          >
            {/* Top Quotes Icon */}
            <div className="flex justify-center mb-6">
              <QuotesIcon />
            </div>

            <p className="text-xl md:text-3xl text-barak-cream font-playfair leading-relaxed italic relative z-10">
              "We created BARAK to build a bridge of trust. From the misty, clay-rich riverbanks of Kalain and Silchar straight to your teapot, we wanted to deliver Assam CTC tea in its truest, freshest, and most honest state."
            </p>

            <div className="w-12 h-0.5 bg-barak-gold/50 mx-auto my-8" />

            <div>
              <p className="text-barak-gold font-bold uppercase tracking-wider text-sm">The Founders of BARAK</p>
              <p className="text-xs text-barak-muted mt-1">EST. 2019 — Assam, India</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-barak-gold/20 via-barak-gold-dim/15 to-transparent relative border-t border-barak-border/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-black text-barak-cream font-playfair">
              Experience the Taste of Barak Valley
            </h2>
            <p className="text-base md:text-lg text-barak-muted max-w-2xl mx-auto">
              Every cup of BARAK tea carries the warmth of the Assam sun, the freshness of the river breeze, and our promise of absolute purity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to="/shop"
              className="bg-barak-gold hover:bg-barak-gold-light text-barak-bg px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 group shadow-glass"
            >
              Shop Our Tea Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/brew-guide"
              className="glass text-barak-cream px-8 py-4 rounded-lg font-bold hover:bg-barak-gold/20 transition-all"
            >
              Learn How to Brew
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
