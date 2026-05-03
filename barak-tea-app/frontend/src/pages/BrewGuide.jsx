import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Clock, Flame, CheckCircle, CaretDown, ShoppingCart } from 'phosphor-react';
import { Link } from 'react-router-dom';

const teaBrewingMethods = [
  {
    id: 'loose-leaf',
    name: 'Loose Leaf Brewing',
    temperature: '95-100°C',
    tempF: '203-212°F',
    time: '3-5 minutes',
    waterRatio: '1 tsp per cup (250ml)',
    steps: [
      'Heat fresh water to 95-100°C',
      'Add loose leaf tea to infuser (1 tsp per cup)',
      'Pour hot water over tea',
      'Steep for 3-5 minutes',
      'Remove infuser and enjoy',
      'Can re-steep 2-3 times'
    ],
    tips: [
      'Use fresh, filtered water for best taste',
      'Don\'t exceed 5 minutes - tea becomes bitter',
      'Golden color indicates perfect brew',
      'Re-steeping extracts different flavors'
    ],
    icon: Flame,
    color: 'from-amber-600 to-orange-500'
  },
  {
    id: 'tea-bag',
    name: 'Tea Bag Method',
    temperature: '95-100°C',
    tempF: '203-212°F',
    time: '4-6 minutes',
    waterRatio: '1 bag per cup (250ml)',
    steps: [
      'Boil fresh water to 95-100°C',
      'Place tea bag in cup',
      'Pour hot water over bag',
      'Steep for 4-6 minutes',
      'Remove bag by string',
      'Add honey or milk if desired'
    ],
    tips: [
      'Keep bag in water for duration of steep',
      'Longer steeping = stronger flavor',
      'Perfect for on-the-go brewing',
      'Great for office or travel'
    ],
    icon: Thermometer,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'gongfu',
    name: 'Gongfu Style (Traditional)',
    temperature: '90-95°C',
    tempF: '194-203°F',
    time: '30-50 sec each',
    waterRatio: '5-7g tea per 150ml',
    steps: [
      'Warm gaiwan with hot water first',
      'Add 5-7g of tea leaves',
      'Flash rinse leaves (1 second)',
      'First infusion: 30 seconds',
      'Subsequent infusions: 40-50 seconds',
      'Can steep 8-10 times!'
    ],
    tips: [
      'Shorter, multiple steeps reveal complexity',
      'Temperature below 95°C extracts subtle notes',
      'Rinse leaves to remove dust',
      'Perfect for savoring and meditation'
    ],
    icon: Thermometer,
    color: 'from-red-600 to-amber-600'
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    temperature: 'Room temp - Fridge',
    tempF: '4-25°C (40-77°F)',
    time: '6-12 hours',
    waterRatio: '1 tsp per cup',
    steps: [
      'Add tea leaves to jar (1 tsp per cup)',
      'Pour room temperature water',
      'Cover and let sit in fridge',
      'Steep for 6-12 hours',
      'Strain through fine sieve',
      'Serve over ice'
    ],
    tips: [
      'No bitterness - gentle extraction',
      'Keeps in fridge for up to 5 days',
      'Perfect for hot summer days',
      'More concentrated brew = less dilution'
    ],
    icon: Flame,
    color: 'from-blue-400 to-cyan-400'
  }
];

const equipment = [
  {
    name: 'Gaiwan (Lidded Bowl)',
    description: 'Traditional Chinese brewing vessel. Perfect for Gongfu style brewing.',
    uses: ['Traditional steeping', 'Multiple infusions', 'Viewing leaf unfurling'],
    price: '₹500-1500',
    image: '🍵'
  },
  {
    name: 'Tea Infuser',
    description: 'Stainless steel ball or mesh infuser. Ideal for loose leaf brewing.',
    uses: ['Quick brewing', 'Convenient steeping', 'Easy cleanup'],
    price: '₹200-600',
    image: '🔍'
  },
  {
    name: 'Tea Kettle',
    description: 'Quality gooseneck kettle for precise pouring and temperature control.',
    uses: ['Accurate pouring', 'Better bloom', 'Controlled timing'],
    price: '₹1500-4000',
    image: '☕'
  },
  {
    name: 'Strainer',
    description: 'Fine mesh strainer to catch leaves and ensure clear cup.',
    uses: ['Removing leaves', 'Clarity', 'Multiple uses'],
    price: '₹300-800',
    image: '✨'
  },
  {
    name: 'Digital Thermometer',
    description: 'Precise temperature monitoring for optimal brewing.',
    uses: ['Temperature accuracy', 'Consistent results', 'Learning tool'],
    price: '₹500-2000',
    image: '🌡️'
  },
  {
    name: 'Tea Storage Caddy',
    description: 'Airtight container to maintain freshness and aroma.',
    uses: ['Preservation', 'Organization', 'Longevity'],
    price: '₹400-1200',
    image: '🏺'
  }
];

const commonMistakes = [
  {
    mistake: 'Using Water That\'s Too Hot',
    why: 'Temperatures above 100°C extract tannins and bitter compounds, resulting in astringent taste.',
    solution: 'Use water at 95-100°C or let boiled water cool for 2-3 minutes before brewing.'
  },
  {
    mistake: 'Over-Steeping',
    why: 'Leaving tea in water too long makes it bitter and overpowering.',
    solution: 'Follow time guidelines: 3-5 minutes for loose leaf, use a timer to be precise.'
  },
  {
    mistake: 'Using Tap Water',
    why: 'Chlorine and minerals in tap water can mask delicate tea flavors.',
    solution: 'Use filtered water or bottled water for best results.'
  },
  {
    mistake: 'Not Preheating the Vessel',
    why: 'A cold cup cools down the water and affects steeping consistency.',
    solution: 'Pour hot water in cup first, let sit 10 seconds, then empty before brewing.'
  },
  {
    mistake: 'Wrong Tea-to-Water Ratio',
    why: 'Too little tea = weak, flavorless brew. Too much = overly strong.',
    solution: 'Use approximately 1 teaspoon per 250ml cup for optimal flavor.'
  },
  {
    mistake: 'Discarding Re-Steeps',
    why: 'Second and third infusions often taste better and reveal hidden notes.',
    solution: 'Keep steeping! CTC teas resteep beautifully 2-3 more times.'
  }
];

const faqItems = [
  {
    question: 'How many times can I re-steep Barak tea leaves?',
    answer: 'Barak CTC tea leaves can be steeped 2-3 times with excellent results. Each steeping reveals different flavor notes - often the second steeping is sweeter and more complex than the first!'
  },
  {
    question: 'What\'s the difference between CTC and loose leaf?',
    answer: 'CTC (Crush-Tear-Curl) is machine-processed into pellets, brewing quickly (3-5 min) with bold flavor. Loose leaf is whole leaves, brewing more slowly but offering subtle complexity. CTC is perfect for daily drinking!'
  },
  {
    question: 'Can I add milk and sugar to Barak tea?',
    answer: 'Absolutely! Barak tea\'s robust character pairs beautifully with milk and honey. Try it both ways - plain to appreciate the full flavor, and with milk for a creamy, comforting cup.'
  },
  {
    question: 'Is Barak tea better hot or cold?',
    answer: 'Both are excellent! Hot tea showcases the full complexity of flavors. Cold brew is refreshing, less astringent, and perfect for summer. Try both to see what you prefer!'
  },
  {
    question: 'How should I store Barak tea to keep it fresh?',
    answer: 'Store in an airtight container away from light, heat, and strong odors. Keep at room temperature. Properly stored tea stays fresh for 6-12 months. Avoid fridges as humidity affects flavor.'
  },
  {
    question: 'What is the best time to drink Barak tea?',
    answer: 'Anytime is great! Breakfast or afternoon is most popular. The caffeine content helps with alertness. Some prefer it after meals for digestion. Listen to your body!'
  },
  {
    question: 'Is there caffeine in Barak tea?',
    answer: 'Yes! CTC black tea contains about 40-70mg of caffeine per cup, similar to coffee but without the jitters. It provides sustained energy through the day.'
  },
  {
    question: 'How is Barak tea different from other Indian teas?',
    answer: 'Barak Valley produces flavorful, full-bodied CTC tea with a distinctive spicy, fruity character. The region\'s unique soil, altitude, and climate create tea with more body than many other regions.'
  }
];

export default function BrewGuide() {
  const [activeTab, setActiveTab] = useState('loose-leaf');
  const [openFaq, setOpenFaq] = useState(null);

  const activeMethod = teaBrewingMethods.find(m => m.id === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-barak-bg pt-24"
    >
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-barak-cream mb-6">
              Perfect Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-barak-gold to-barak-gold-light">Cup</span>
            </h1>
            <p className="text-xl text-barak-muted max-w-2xl mx-auto mb-8">
              Master the art of brewing premium Barak CTC tea. Learn traditional and modern techniques to unlock every flavor note.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/shop" className="glass px-8 py-3 rounded-lg font-semibold text-barak-cream hover:bg-barak-gold/20 transition-all">
                Get Barak Tea
              </Link>
              <a href="#brewing" className="border border-barak-gold text-barak-gold px-8 py-3 rounded-lg font-semibold hover:bg-barak-gold/10 transition-all">
                Learn Methods
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brewing Methods Section */}
      <section id="brewing" className="px-4 py-20 bg-barak-surface">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-barak-cream mb-4 text-center"
          >
            Brewing Methods
          </motion.h2>
          <p className="text-center text-barak-muted mb-16 max-w-2xl mx-auto">
            Four proven ways to brew the perfect cup of Barak tea. Choose your style.
          </p>

          {/* Method Tabs */}
          <div className="flex gap-2 md:gap-4 mb-12 overflow-x-auto pb-2 md:justify-center flex-wrap">
            {teaBrewingMethods.map(method => (
              <motion.button
                key={method.id}
                onClick={() => setActiveTab(method.id)}
                whileHover={{ scale: 1.05 }}
                className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === method.id
                  ? 'bg-barak-gold text-barak-bg'
                  : 'glass text-barak-cream hover:bg-barak-gold/20'
                }`}
              >
                {method.name}
              </motion.button>
            ))}
          </div>

          {/* Active Method Details */}
          {activeMethod && (
            <motion.div
              key={activeMethod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-6 rounded-lg text-center">
                  <Thermometer className="w-8 h-8 text-barak-gold mx-auto mb-3" weight="fill" />
                  <div className="text-sm text-barak-muted mb-1">Temperature</div>
                  <div className="text-lg font-bold text-barak-cream">{activeMethod.temperature}</div>
                  <div className="text-xs text-barak-muted">{activeMethod.tempF}</div>
                </div>
                <div className="glass p-6 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-barak-gold mx-auto mb-3" weight="fill" />
                  <div className="text-sm text-barak-muted mb-1">Steep Time</div>
                  <div className="text-lg font-bold text-barak-cream">{activeMethod.time}</div>
                </div>
                <div className="glass p-6 rounded-lg text-center col-span-2 md:col-span-1">
                  <Flame className="w-8 h-8 text-barak-gold mx-auto mb-3" weight="fill" />
                  <div className="text-sm text-barak-muted mb-1">Tea to Water</div>
                  <div className="text-lg font-bold text-barak-cream">{activeMethod.waterRatio}</div>
                </div>
                <div className="glass p-6 rounded-lg text-center col-span-2 md:col-span-1">
                  <CheckCircle className="w-8 h-8 text-barak-success mx-auto mb-3" weight="fill" />
                  <div className="text-sm text-barak-muted mb-1">Result</div>
                  <div className="text-lg font-bold text-barak-success">Perfect Cup!</div>
                </div>
              </div>

              {/* Steps and Tips Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Steps */}
                <div className="glass p-8 rounded-lg">
                  <h3 className="text-2xl font-bold text-barak-cream mb-6">Steps</h3>
                  <ol className="space-y-4">
                    {activeMethod.steps.map((step, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-barak-gold text-barak-bg font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-barak-cream pt-1">{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                <div className="glass p-8 rounded-lg">
                  <h3 className="text-2xl font-bold text-barak-cream mb-6">Pro Tips</h3>
                  <ul className="space-y-4">
                    {activeMethod.tips.map((tip, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <span className="text-barak-gold text-xl flex-shrink-0">✓</span>
                        <span className="text-barak-muted">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Equipment Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-barak-cream mb-4 text-center"
          >
            Essential Equipment
          </motion.h2>
          <p className="text-center text-barak-muted mb-16 max-w-2xl mx-auto">
            Quality tools enhance your brewing experience. Here are the essentials.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {equipment.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-lg hover:shadow-glass-hover transition-all group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{item.image}</div>
                <h3 className="text-xl font-bold text-barak-cream mb-3">{item.name}</h3>
                <p className="text-barak-muted text-sm mb-4">{item.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-barak-gold">USES:</p>
                  <ul className="space-y-1">
                    {item.uses.map((use, i) => (
                      <li key={i} className="text-sm text-barak-muted">• {use}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-barak-gold font-bold">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="px-4 py-20 bg-barak-surface">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-barak-cream mb-4 text-center"
          >
            Common Mistakes
          </motion.h2>
          <p className="text-center text-barak-muted mb-16">Avoid these pitfalls for consistently perfect tea</p>

          <div className="space-y-4">
            {commonMistakes.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass p-6 rounded-lg border-l-4 border-barak-error"
              >
                <h3 className="text-lg font-bold text-barak-cream mb-2">❌ {item.mistake}</h3>
                <p className="text-barak-muted mb-3 text-sm"><strong>Why:</strong> {item.why}</p>
                <p className="text-barak-success text-sm"><strong>✓ Solution:</strong> {item.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-barak-cream mb-4 text-center"
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-center text-barak-muted mb-16">Everything you need to know about brewing Barak tea</p>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full glass p-6 rounded-lg hover:bg-barak-gold/10 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-barak-cream group-hover:text-barak-gold transition-colors">
                      {item.question}
                    </h3>
                    <CaretDown
                      className={`w-5 h-5 text-barak-gold transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                      weight="bold"
                    />
                  </div>
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-barak-card px-6 py-4 rounded-b-lg"
                  >
                    <p className="text-barak-muted">{item.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-barak-gold/20 to-barak-gold-light/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-barak-cream mb-6">
              Ready to Brew?
            </h2>
            <p className="text-xl text-barak-muted mb-8 max-w-2xl mx-auto">
              Get fresh Barak CTC tea delivered to your door. Experience the difference that altitude, soil, and tradition make.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/shop"
                className="bg-barak-gold hover:bg-barak-gold-light text-barak-bg px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" weight="fill" />
                Shop Now
              </Link>
              <Link
                to="/checkout"
                className="glass text-barak-cream px-8 py-4 rounded-lg font-bold hover:bg-barak-gold/20 transition-all"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="px-4 py-16 bg-barak-surface text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-barak-muted mb-4">
            💡 Pro Tip: Document your brewing ratios and times to find your perfect cup
          </p>
          <div className="flex justify-center gap-6 text-sm text-barak-muted flex-wrap">
            <Link to="/" className="hover:text-barak-gold transition-colors">Home</Link>
            <span>•</span>
            <Link to="/shop" className="hover:text-barak-gold transition-colors">Shop</Link>
            <span>•</span>
            <Link to="/our-story" className="hover:text-barak-gold transition-colors">Our Story</Link>
            <span>•</span>
            <a href="#brewing" className="hover:text-barak-gold transition-colors">Brewing</a>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
