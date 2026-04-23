import React from 'react';
import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-barak-cream">Blog</h1>
        <p className="text-barak-muted mt-4">Coming soon...</p>
      </div>
    </motion.div>
  );
}
