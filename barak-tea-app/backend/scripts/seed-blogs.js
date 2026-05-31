import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../src/utils/supabase.js';
import logger from '../src/utils/logger.js';

// Setup directories
const FRONTEND_ASSETS = path.resolve('../frontend/src/assets');
const BUCKET_NAME = 'products';

const BLOG_POSTS_DATA = [
  {
    localImage: 'blog_chai_brewing.png',
    title: 'The Art of Brewing the Perfect Barak Masala Chai',
    category: 'Brewing',
    readTime: '5 min read',
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
    localImage: 'blog_tea_culture.png',
    title: "Tea Culture in Assam's Barak Valley: More Than a Drink",
    category: 'Culture',
    readTime: '7 min read',
    excerpt: 'In Silchar and Kalain, tea is the rhythm of daily life. Explore the social traditions, Addas, and local gatherings shaped by the brew.',
    content: `
      <p class="lead text-lg text-barak-cream mb-6">Step off the train at Silchar station, or walk down the main market of Kalain at dawn, and you will hear a rhythmic clattering: glass cups meeting saucers, kettles whistling, and lively chatter. In the Barak Valley, tea is not a beverage; it is a language.</p>
      
      <p class="mb-4">Historically, while the Barak Valley had its own grand history, it established a close-knit, community-driven tea lifestyle. The tea estates here are woven directly into the local landscape, and almost everyone has a family member or friend connected to the gardens.</p>

      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">The Art of the 'Adda'</h3>
      <p class="mb-4">In Assam, an "Adda" is a long, informal conversation among friends, family, or strangers. An Adda is never complete without hot cups of chai. From discussions on local politics, literature, and football to simple daily gossip, the local tea shop acts as the community center.</p>
      
      <p class="mb-4">What makes the Barak tea culture unique is the accessibility. Whether you are a farmer, businessman, student, or traveler, everyone sits on the same wooden benches at a road-side tea stall, sharing the same strong brew. It acts as a great social equalizer.</p>
      
      <h3 class="text-2xl font-bold text-barak-gold mt-8 mb-4 font-playfair">The Welcoming Gesture</h3>
      <p class="mb-6">In Barak homes, offering tea is the ultimate gesture of hospitality. It is considered impolite to let a guest leave without serving them a fresh cup, usually accompanied by local snacks like "Shingara" (samosa) or "Pitha" (rice cakes). The recipe is always adjusted to the guest's liking—black, sweet, spicy, or heavy on milk.</p>
      
      <p class="mt-6 text-barak-muted border-t border-barak-border/40 pt-4">At BARAK, we are proud to share this warm culture with tea drinkers across the country, packaging the authentic flavor of Barak Valley hospitality in every bag.</p>
    `
  },
  {
    localImage: 'blog_soil_terroir.png',
    title: 'Understanding Terroir: Why River Valley Soil Matters',
    category: 'Terroir',
    readTime: '6 min read',
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
    localImage: 'blog_plucker_hands.png',
    title: 'A Day in the Life of a Tea Garden Plucker',
    category: 'Community',
    readTime: '8 min read',
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

async function ensureBucketExists(bucketName) {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;

    if (!buckets.find(b => b.name === bucketName)) {
      console.log(`Creating missing storage bucket: ${bucketName}`);
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880
      });
      if (createError) throw createError;
    }
  } catch (err) {
    console.error(`Error ensuring bucket exists: ${err.message}`);
  }
}

async function seed() {
  try {
    console.log('🚀 Starting Blog Seeding script...');

    // 1. Ensure storage bucket exists
    await ensureBucketExists(BUCKET_NAME);

    // 2. Iterate and process each blog
    for (const postData of BLOG_POSTS_DATA) {
      console.log(`\nProcessing: "${postData.title}"`);

      // Upload image if it exists in local assets
      const localImagePath = path.join(FRONTEND_ASSETS, postData.localImage);
      let imageUrl = '';

      if (fs.existsSync(localImagePath)) {
        console.log(`Found local image asset: ${localImagePath}`);
        const fileBuffer = fs.readFileSync(localImagePath);
        const fileName = `blog-seeding-${Date.now()}-${postData.localImage}`;
        const filePath = `product-images/${fileName}`;

        console.log(`Uploading image ${postData.localImage} to storage...`);
        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(filePath, fileBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          console.warn(`⚠️ Upload failed: ${uploadError.message}. Using fallback placeholder.`);
        } else {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
          
          imageUrl = publicUrl;
          console.log(`Successfully uploaded: ${imageUrl}`);
        }
      } else {
        console.warn(`⚠️ Local image not found at: ${localImagePath}`);
      }

      // Check if blog already exists to avoid duplicates
      const { data: existing, error: searchError } = await supabaseAdmin
        .from('blogs')
        .select('id')
        .eq('title', postData.title)
        .maybeSingle();

      if (searchError) {
        throw searchError;
      }

      if (existing) {
        console.log(`Post already exists. Updating existing entry (id: ${existing.id})...`);
        const { error: updateError } = await supabaseAdmin
          .from('blogs')
          .update({
            category: postData.category,
            excerpt: postData.excerpt,
            content: postData.content,
            image_url: imageUrl || undefined,
            read_time: postData.readTime,
            status: 'published',
            updated_at: new Date()
          })
          .eq('id', existing.id);
        
        if (updateError) throw updateError;
        console.log('Updated successfully.');
      } else {
        console.log('Inserting new blog post...');
        const { error: insertError } = await supabaseAdmin
          .from('blogs')
          .insert([{
            title: postData.title,
            category: postData.category,
            excerpt: postData.excerpt,
            content: postData.content,
            image_url: imageUrl,
            read_time: postData.readTime,
            status: 'published',
            created_at: new Date(),
            updated_at: new Date()
          }]);
        
        if (insertError) throw insertError;
        console.log('Inserted successfully.');
      }
    }

    console.log('\n🎉 Blog Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
