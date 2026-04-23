import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, Lightning, Truck, Recycle, Heart } from 'phosphor-react';

export default function FeatureBento() {
  const features = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'Hand-picked CTC leaves, no additives, no preservatives',
      size: 'large',
    },
    {
      icon: Wind,
      title: 'Fresh Daily',
      description: 'Packed monthly, vacuum-sealed for peak freshness',
      size: 'small',
    },
    {
      icon: Lightning,
      title: 'Bold Flavor',
      description: 'Dense, rich oxidation creates dynamic cup profile',
      size: 'small',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Ships within 24 hours, nationwide free shipping',
      size: 'small',
    },
    {
      icon: Recycle,
      title: 'Sustainable',
      description: 'Ethical sourcing, minimal packaging waste',
      size: 'small',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Direct from farmers, supports Barak Valley livelihoods',
      size: 'large',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 md:py-32 px-4 bg-barak-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-barak-cream mb-4">
            Why Choose BARAK Tea
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isLarge = feature.size === 'large';

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`glass p-8 md:p-10 rounded-glass group hover:shadow-gold-glow transition-all ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <Icon
                  size={isLarge ? 64 : 48}
                  className="text-barak-gold mb-6 group-hover:scale-110 transition-transform"
                />
                <h3 className="text-xl md:text-2xl font-bold text-barak-cream mb-3">
                  {feature.title}
                </h3>
                <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
