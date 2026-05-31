import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight } from 'phosphor-react';
import api from '../utils/api.js';

// Asset imports
import chaiBrewingImg from '../assets/blog_chai_brewing.png';
import teaCultureImg from '../assets/blog_tea_culture.png';
import soilTerroirImg from '../assets/blog_soil_terroir.png';
import pluckerHandsImg from '../assets/blog_plucker_hands.png';

const STATIC_BLOG_POSTS = [
  {
    id: 1,
    title: 'The Art of Brewing the Perfect Barak Masala Chai',
    category: 'Brewing',
    date: 'May 28, 2026',
    readTime: '5 min read',
    image: chaiBrewingImg,
    excerpt: 'CTC tea demands a unique brewing approach. Discover the ideal ratios of milk, water, spices, and leaves to unleash a truly bold, comforting cup.',
    content: `
      <p class="lead text-lg text-barak-cream mb-6">If you’ve ever had a cup of tea in Silchar or Kalain, you know it’s different. It has body. It has a robust, malty backbone that cuts through milk and carries spices perfectly. This is the magic of high-grade CTC (Crush, Tear, Curl) tea.</p>
      
      <p class="mb-4">Standard orthodox tea leaves are delicate and brewed gently. However, Barak CTC tea is built for strength. To get the absolute best out of it, we recommend the traditional double-boil method—the way tea is prepared in local dhabas and households across Assam.</p>
      
      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">Ingredients You Need (For 2 Cups)</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Water:</strong> 1.25 cups (fresh, filtered water is essential)</li>
        <li><strong>Milk:</strong> 1 cup (full-fat whole milk gives the best texture)</li>
        <li><strong>BARAK Tea:</strong> 2 rounded teaspoons</li>
        <li><strong>Fresh Ginger:</strong> 1/2 inch, crushed</li>
        <li><strong>Green Cardamom:</strong> 2 pods, crushed</li>
        <li><strong>Sweetener:</strong> Sugar or honey to taste</li>
      </ul>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">Step-by-Step Brewing Guide</h3>
      <ol class="list-decimal pl-6 mb-6 space-y-4">
        <li>
          <strong>The Base Infusion:</strong> Bring the water to a boil in a saucepan. Once it bubbles, add the crushed ginger and cardamom. Let them boil for 1-2 minutes until the water turns slightly golden and aromatic.
        </li>
        <li>
          <strong>Adding the Leaves:</strong> Add the BARAK CTC tea leaves. Turn down the heat slightly and let it simmer for 2 minutes. You will watch the water turn a deep, dark ruby red. This indicates the strong tannins and malty notes are releasing.
        </li>
        <li>
          <strong>Adding the Milk:</strong> Pour in the milk. Bring the heat back up and watch the mixture rise to a boil.
        </li>
        <li>
          <strong>The Double-Boil Rise:</strong> As the tea reaches the top of the pan, lift the pan or turn down the heat to let it settle. Bring it to a boil a second time. This dhaba-style boiling technique binds the milk fat and tea proteins together, giving it a velvety body.
        </li>
        <li>
          <strong>Strain and Serve:</strong> Strain the piping hot chai directly into warm cups. Add sugar to taste and serve with biscuits.
        </li>
      </ol>
      
      <p class="mt-6 text-barak-muted italic border-t border-barak-border/40 pt-4">Pro Tip: If you like your tea extra strong, increase the simmer time after adding the tea leaves, but do not boil the milk for more than 3 minutes, as over-boiled milk can mask the malty flavor of the tea.</p>
    `
  },
  {
    id: 2,
    title: "Tea Culture in Assam's Barak Valley: More Than a Drink",
    category: 'Culture',
    date: 'May 15, 2026',
    readTime: '7 min read',
    image: teaCultureImg,
    excerpt: 'In Silchar and Kalain, tea is the rhythm of daily life. Explore the social traditions, Addas, and local gatherings shaped by the brew.',
    content: `
      <p class="lead text-lg text-barak-cream mb-6">Step off the train at Silchar station, or walk down the main market of Kalain at dawn, and you will hear a rhythmic clattering: glass cups meeting saucers, kettles whistling, and lively chatter. In the Barak Valley, tea is not a beverage; it is a language.</p>
      
      <p class="mb-4">Historically, while the Brahmaputra Valley got international fame for its grand estates, the Barak Valley established a close-knit, community-driven tea lifestyle. The tea estates here are woven directly into the local landscape, and almost everyone has a family member or friend connected to the gardens.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">The Art of the 'Adda'</h3>
      <p class="mb-4">In Assam, an "Adda" is a long, informal conversation among friends, family, or strangers. An Adda is never complete without hot cups of chai. From discussions on local politics, literature, and football to simple daily gossip, the local tea shop acts as the community center.</p>
      
      <p class="mb-4">What makes the Barak tea culture unique is the accessibility. Whether you are a farmer, businessman, student, or traveler, everyone sits on the same wooden benches at a road-side tea stall, sharing the same strong brew. It acts as a great social equalizer.</p>
      
      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">The Welcoming Gesture</h3>
      <p class="mb-6">In Barak homes, offering tea is the ultimate gesture of hospitality. It is considered impolite to let a guest leave without serving them a fresh cup, usually accompanied by local snacks like "Shingara" (samosa) or "Pitha" (rice cakes). The recipe is always adjusted to the guest's liking—black, sweet, spicy, or heavy on milk.</p>
      
      <p class="mt-6 text-barak-muted border-t border-barak-border/40 pt-4">At BARAK, we are proud to share this warm culture with tea drinkers across the country, packaging the authentic flavor of Barak Valley hospitality in every bag.</p>
    `
  },
  {
    id: 3,
    title: 'Understanding Terroir: Why River Valley Soil Matters',
    category: 'Terroir',
    date: 'May 02, 2026',
    readTime: '6 min read',
    image: soilTerroirImg,
    excerpt: 'Nestled along the Barak River, the tea estates of Kalain enjoy a clay-rich soil and microclimate that give our CTC tea its distinctive malty body.',
    content: `
      <p class="lead text-lg text-barak-cream mb-6">The word "terroir" is most often associated with wine, but it is equally vital to tea. It describes how the soil, climate, water, and geography of a specific place impact the flavor, aroma, and texture of the crop.</p>
      
      <p class="mb-4">So, what makes tea from the Barak Valley so special? The answer lies in the unique environment of southern Assam, particularly the regions around Kalain and Silchar.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">1. The Clay-Rich Silt of the Barak River</h3>
      <p class="mb-4">The Barak River winds through the valley, depositing rich alluvial silt during the monsoon seasons. The soil in Kalain is heavily clayey-loam. Clay soil is excellent at retaining moisture and holds a high concentration of essential minerals like iron and potassium. This nutrient density forces the tea bushes to grow slowly and deeply, packing more complex chemical compounds into the leaves.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">2. The Tropical Humid Microclimate</h3>
      <p class="mb-4">The valley is surrounded by hills on three sides, creating a natural trap for heat and humidity. The humidity rarely drops below 70%, and the temperatures stay warm year-round. This greenhouse-like microclimate promotes lush leaf growth. The combination of intense heat and rich soil results in high levels of catechins and polyphenols in the leaves, which are responsible for the bold, malty taste and deep copper color when brewed.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">3. Elevation and Rainfall</h3>
      <p class="mb-6">At a lower altitude than hilly orthodox tea gardens, the valley plains receive heavy, consistent rainfall. This constant watering keeps the bushes well-hydrated, ensuring that the tea shoots are tender, juicy, and packed with sugars that balance out the natural bitterness of the black tea.</p>
      
      <p class="mt-6 text-barak-muted border-t border-barak-border/40 pt-4">When you drink a cup of BARAK, you are tasting this exact combination of clay, river fog, and tropical sun. It is a flavor that cannot be replicated anywhere else in the world.</p>
    `
  },
  {
    id: 4,
    title: 'A Day in the Life of a Tea Garden Plucker',
    category: 'Community',
    date: 'April 20, 2026',
    readTime: '8 min read',
    image: pluckerHandsImg,
    excerpt: "Meet the hard-working community in Kalain who carefully harvest 'two leaves and a bud' to bring fresh tea to your morning teapot.",
    content: `
      <p class="lead text-lg text-barak-cream mb-6">At BARAK, we believe that the hands that harvest the leaves are just as important as the soil they grow in. The quality of our CTC tea relies entirely on the skilled pluckers in the gardens of Kalain.</p>
      
      <p class="mb-4">Plucking tea is an art form. Unlike mechanical harvesting which cuts stems, twigs, and old leaves, hand-plucking ensures that only the tenderest parts of the bush are harvested. Let's take a look at a typical day in the life of a tea plucker.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">Dawn in the Gardens</h3>
      <p class="mb-4">The day starts early, around 6:00 AM, when the air is still cool and the dew is fresh on the leaves. The pluckers gather at the garden weigh-stations, carrying their traditional woven wicker baskets or light bags strapped to their foreheads. They walk in groups down the neat rows of tea hedges, their hands moving with incredible speed.</p>
      
      <p class="mb-4">The target is always "two leaves and a bud"—the soft, young tip of the tea shoot. These parts contain the highest concentration of caffeine and L-theanine, which gives the tea its rich flavor and calming effect. An experienced plucker can pick thousands of shoots a day, selecting them with a gentle pinch that prevents bruising the leaf.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">The Weigh-In and Processing</h3>
      <p class="mb-4">Around midday and again at sunset, the pluckers bring their harvest to the garden centers for weighing. The leaves must be processed quickly to prevent fermentation. They are loaded into trucks and driven straight to the sorting facility in Silchar, where the tea undergoes withering, crushing (CTC), and drying.</p>
      
      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">Our Ethical Sourcing Promise</h3>
      <p class="mb-6">Many tea brands squeeze gardens for low prices, leading to poor wages for pluckers. We do things differently. By partnering directly with estates in Kalain and Silchar, we bypass brokers and pay a premium for quality. This directly translates to fair wages, educational support for pluckers' children, and healthcare in the estate communities.</p>
      
      <p class="mt-6 text-barak-muted border-t border-barak-border/40 pt-4">Every time you enjoy a cup of BARAK, you are supporting a sustainable, ethical chain that honors the workers of the Barak Valley.</p>
    `
  }
];

const categories = ['All', 'Brewing', 'Culture', 'Terroir', 'Community'];

export default function Blog() {
  const [blogs, setBlogs] = useState(STATIC_BLOG_POSTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const data = await api.get('/blogs', { params: { status: 'published', limit: 50 } });
        if (data && data.blogs && data.blogs.length > 0) {
          const mapped = data.blogs.map(b => ({
            id: b.id,
            title: b.title,
            category: b.category,
            date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: b.read_time || '5 min read',
            image: b.image_url || chaiBrewingImg,
            excerpt: b.excerpt || '',
            content: b.content
          }));
          setBlogs(mapped);
        }
      } catch (err) {
        console.warn("Failed to load dynamic blogs, using static fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  // Filter posts based on search query and selected category
  const filteredPosts = blogs.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogs[0] || null;
  const gridPosts = filteredPosts.filter(post => !featuredPost || post.id !== featuredPost.id || selectedCategory !== 'All' || searchQuery !== '');

  // Safe SVG Icons
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-barak-muted group-focus-within:text-barak-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-barak-bg pt-28 pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs md:text-sm uppercase font-bold text-barak-gold tracking-widest">
              The Barak Journal
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-barak-cream font-playfair mt-2">
              Stories From the <span className="gradient-gold">Valley</span>
            </h1>
            <p className="text-barak-muted text-lg mt-4 max-w-2xl mx-auto">
              Read about tea culture, traditional Indian brewing methods, sustainable agriculture, and the rich heritage of Silchar and Kalain.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 bg-barak-surface border border-barak-border/60 rounded-full px-5 py-3 max-w-md mx-auto group focus-within:border-barak-gold/60 transition-all shadow-glass"
          >
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-barak-cream placeholder-barak-muted/60 w-full text-sm"
            />
          </motion.div>
        </section>

        {/* Category Filters */}
        <section className="flex justify-center gap-2 md:gap-4 overflow-x-auto pb-2 flex-wrap">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-barak-gold text-barak-bg shadow-glass' 
                  : 'glass text-barak-cream hover:bg-barak-gold/15'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </section>

        {/* Featured Post (Only visible when no search query and showing All/Brewing) */}
        {selectedCategory === 'All' && searchQuery === '' && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-glass overflow-hidden shadow-glass hover:shadow-glass-hover transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-barak-gold">
                  <span>{featuredPost.category}</span>
                  <span className="text-barak-border">•</span>
                  <span className="text-barak-muted">{featuredPost.date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-barak-cream font-playfair leading-tight hover:text-barak-gold transition-colors cursor-pointer" onClick={() => setSelectedPost(featuredPost)}>
                  {featuredPost.title}
                </h2>
                <p className="text-barak-muted text-sm md:text-base leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-barak-muted">
                  <Clock className="w-4 h-4 text-barak-gold" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <div>
                  <button 
                    onClick={() => setSelectedPost(featuredPost)}
                    className="bg-barak-gold hover:bg-barak-gold-light text-barak-bg font-bold px-6 py-3 rounded-lg flex items-center gap-2 group transition-all"
                  >
                    Read Featured Post
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Blog Grid */}
        <section className="space-y-8">
          {gridPosts.length > 0 && (
            <h2 className="text-2xl font-bold text-barak-cream font-playfair border-b border-barak-border/30 pb-4">
              {selectedCategory === 'All' && searchQuery === '' ? 'More Articles' : `Filtered Results (${filteredPosts.length})`}
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              // If showing Featured Post separately, skip it in grid
              if (selectedCategory === 'All' && searchQuery === '' && post.id === featuredPost.id) {
                return null;
              }
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-glass overflow-hidden flex flex-col hover:shadow-glass-hover group"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-barak-surface">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-barak-gold">
                      <span>{post.category}</span>
                      <span className="text-barak-muted">{post.date}</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedPost(post)}
                      className="text-xl font-bold text-barak-cream font-playfair group-hover:text-barak-gold transition-colors cursor-pointer line-clamp-2"
                    >
                      {post.title}
                    </h3>

                    <p className="text-barak-muted text-sm leading-relaxed flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-barak-border/40 text-xs">
                      <div className="flex items-center gap-1.5 text-barak-muted">
                        <Clock className="w-3.5 h-3.5 text-barak-gold" />
                        <span>{post.readTime}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedPost(post)}
                        className="text-barak-gold font-bold hover:text-barak-gold-light inline-flex items-center gap-1 group"
                      >
                        Read More
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 glass rounded-glass max-w-xl mx-auto space-y-4">
              <span className="text-4xl block">🍃</span>
              <h3 className="text-xl font-bold text-barak-cream">No Articles Found</h3>
              <p className="text-barak-muted text-sm px-6">
                We couldn't find any articles matching "{searchQuery}" in the category "{selectedCategory}". Try clearing search or selecting another category.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-barak-gold font-bold hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Reading Modal View */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-4 md:p-8"
            data-lenis-prevent
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-barak-bg border border-barak-border/60 max-w-4xl w-full rounded-glass overflow-hidden shadow-glass flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-barak-bg/85 backdrop-blur-md border-b border-barak-border/40 p-4 md:p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-barak-gold">
                  <span>{selectedPost.category}</span>
                  <span className="text-barak-border">•</span>
                  <span>{selectedPost.date}</span>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="w-10 h-10 rounded-full border border-barak-border/60 flex items-center justify-center text-barak-cream hover:text-barak-gold hover:border-barak-gold transition-all"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[80vh] p-6 md:p-12 space-y-8">
                {/* Hero image */}
                <div className="aspect-[16/9] w-full rounded-glass overflow-hidden bg-barak-surface">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Article Header info */}
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-5xl font-black text-barak-cream font-playfair leading-tight">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-barak-muted">
                    <Clock className="w-4 h-4 text-barak-gold" />
                    <span>{selectedPost.readTime} Reading Duration</span>
                  </div>
                </div>

                {/* Main Content (HTML rendered safely) */}
                <div 
                  className="prose prose-invert max-w-none text-barak-muted text-base md:text-lg leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                {/* Article Footer */}
                <div className="border-t border-barak-border/40 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-barak-muted">
                    Published by the <strong>BARAK Tea Editorial Team</strong>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="glass px-6 py-2.5 rounded-lg text-sm text-barak-cream hover:text-barak-gold transition-all font-semibold"
                  >
                    Back to Articles
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
