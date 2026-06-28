import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import pluckerHands from '../../assets/blog_plucker_hands.png';

export default function OriginStory() {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 md:py-36 px-4 bg-[#080808] relative z-10 border-t border-[rgba(250,243,224,0.03)] overflow-hidden">
      
      {/* Background radial gold detail */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-barak-gold/2 blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left Column: Premium Photo Spread */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Fine-framed visual wrap */}
            <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto rounded-glass overflow-hidden border border-[rgba(250,243,224,0.08)] bg-[rgba(26,17,10,0.2)] p-3 group">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden">
                <img 
                  src={pluckerHands} 
                  alt="Ancestral hands selecting Barak Tea leaves" 
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-[1200ms] ease-out opacity-85 group-hover:opacity-100" 
                />
                {/* Visual shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              
              {/* Elegant floating badge */}
              <div className="absolute bottom-8 left-8 z-10 bg-[rgba(13,9,5,0.75)] backdrop-blur-md border border-[rgba(200,146,42,0.3)] py-3 px-6 rounded-glass">
                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-barak-gold-light">
                  Silchar, Assam
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="max-w-[480px] mx-auto lg:mx-0">
              <span className="text-[10px] uppercase font-bold text-barak-gold tracking-[0.3em] mb-4 block">
                Heritage & Origin
              </span>
              
              <h2 className="text-3xl md:text-5xl font-playfair font-bold text-barak-cream mb-6 leading-tight">
                Three Generations of Selection
              </h2>
              
              <div className="w-12 h-[1px] bg-barak-gold mb-6" />
              
              <p className="text-sm md:text-base text-barak-cream text-opacity-70 leading-relaxed mb-6 font-light">
                We do not just produce tea; we preserve a culture. The rich alluvial soil of the Barak Valley, the heavy monsoon mist, and the ancestral hands that harvest it are all distilled into a singular premium blend.
              </p>
              
              <p className="text-sm italic font-playfair text-barak-gold-light mb-8 opacity-90 leading-relaxed">
                "From the morning mist of Silchar, to the warmth of your cup, every leaf tells the story of our valley's soul."
              </p>
              
              <button 
                onClick={() => navigate('/our-story')}
                className="group inline-flex items-center gap-3 text-xs uppercase font-bold text-barak-cream tracking-[0.2em] relative py-2 overflow-hidden"
              >
                <span>Read Our Story</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                {/* Fine gold line below */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[rgba(200,146,42,0.3)] group-hover:bg-barak-gold transition-colors duration-300" />
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
