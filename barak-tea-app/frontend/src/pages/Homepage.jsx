import React, { useEffect } from 'react';
import HeroAtmospheric  from '../components/sections/HeroAtmospheric';
import OriginAndProcess from '../components/sections/OriginAndProcess';
import ValleyStory      from '../components/sections/ValleyStory';
import ProductReveal    from '../components/sections/ProductReveal';
import ProofMarquee     from '../components/sections/ProofMarquee';
import JournalTeaser    from '../components/sections/JournalTeaser';

/**
 * Homepage — Awwwards-caliber continuous canvas experience.
 * No hard section divisions. Particle canvas and cursor are global (in App.jsx).
 * Scroll flows seamlessly: Hero → Origin → CTC Process → Valley → Products → Proof → Journal → Footer
 */
export default function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Update document title and meta for SEO
    document.title = 'BARAK Tea | Premium Assam CTC Tea from Barak Valley';
  }, []);

  return (
    <main
      className="w-full overflow-hidden"
      style={{ background: '#0D0905', color: '#FAF3E0' }}
    >
      {/* Beat 1 — Atmospheric Hero (no product image) */}
      <HeroAtmospheric />

      {/* Beat 2 + 3 — Origin Reveal + CTC Process (continuous, no hard break) */}
      <OriginAndProcess />

      {/* Beat 4 — The Valley (cinematic parallax story) */}
      <ValleyStory />

      {/* Beat 5 — Shop / Product Reveal (3D tilt cards) */}
      <ProductReveal />

      {/* Beat 6 — Proof / Trust (kinetic marquees) */}
      <ProofMarquee />

      {/* Beat 7 — Journal / Culture teaser (hover image reveals) */}
      <JournalTeaser />

      {/* Beat 8 — Footer is in App.jsx, leaves still falling (global canvas) */}
    </main>
  );
}
