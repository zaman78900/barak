# BARAK Tea — Complete Stitch Design Prompts (Glassmorphism Edition)
### Website + Admin Panel · Premium Dark Luxury with Glass Surfaces
---

## HOW TO USE THESE PROMPTS
Paste each **section prompt** into Stitch one at a time. Start with the Design System prompt first — it sets the tokens every other section inherits. This new iteration features glassmorphism aesthetics combined with dark luxury. Then build page by page.

---

## 🎨 PROMPT 0 — DESIGN SYSTEM & TOKENS (Run this first)

```
Set up a global design system for BARAK Tea using glassmorphism + dark luxury aesthetic. A premium CTC tea brand from Barak Valley, Assam, India.

COLOR TOKENS (60-30-10 RULE):
--color-bg-dark: #0D0905 (60% — main dark background, near-black warm)
--color-glass: rgba(250, 243, 224, 0.08) (30% — glass/frosted surfaces, cream at 8% opacity)
--color-glass-border: rgba(200, 146, 42, 0.12) (glass borders, subtle gold tint)
--color-glass-hover: rgba(250, 243, 224, 0.12) (glass hover state)
--color-brand-dark: #1A110A (glass surface background, darker than main)
--color-gold: #C8922A (10% — primary accent, CTAs, highlights)
--color-gold-light: #F5D98B (gold light tint, hover states)
--color-gold-glow: rgba(200, 146, 42, 0.25) (gold glow effect on glass)
--color-cream: #FAF3E0 (primary text on dark, high contrast)
--color-muted: #9E8C78 (secondary text, placeholders)
--color-success: #2D7A4F
--color-error: #C0392B
--color-whatsapp: #25D366

GLASSMORPHISM TOKENS:
--glass-blur: backdrop-filter blur(12px)
--glass-border: 1px solid rgba(200, 146, 42, 0.12)
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(250, 243, 224, 0.1)
--glass-shadow-hover: 0 12px 48px rgba(200, 146, 42, 0.15), inset 0 1px 0 rgba(250, 243, 224, 0.15)

TYPOGRAPHY:
- Display/Hero headlines: Inter, weight 700–900, sizes 80–120px, letter-spacing -0.04em, line-height 0.95
- H1–H3: Inter, weight 700, sizes 24–48px, letter-spacing -0.02em
- Body text: Inter, weight 400–500, sizes 14–16px, line-height 1.8
- Labels/Captions: Inter, weight 500–600, sizes 11–13px, letter-spacing 0.05em
- CTA Buttons: Inter, weight 600–700, sizes 14–16px, letter-spacing 0.01em
- Accent taglines: Inter, weight 600, sizes 16–20px, letter-spacing 0.05em (no script fonts)

COMPONENT RULES:
- Border radius: 16px glass cards, 24px pills/badges, 8px inputs, 12px buttons
- Background: Use glass tokens with backdrop-filter blur(12px) on all surfaces
- Box shadows: glass-shadow on default, glass-shadow-hover on interaction
- Transitions: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) (smooth, premium feel)
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Max content width: 1440px, hero full-bleed
- Images: always 1:1 for products, 16:9 for hero, 4:3 for blog (with glass overlays)
- Icons: Phosphor Icons library throughout, 20-24px sizes
- Button styles: Glass (gold border + glass bg with glow), Solid Gold, Ghost (transparent border), WhatsApp (green glass)
- Animations: scroll-triggered fade-up, parallax 0.4-0.6x, smooth Lenis scroll
```

---

## 🏠 PROMPT 1 — HOMEPAGE (/)

```
Build the BARAK Tea homepage with glassmorphism + dark luxury aesthetic. Aesthetic: premium dark with frosted glass surfaces, scroll-triggered animations, parallax depth. Layout: fullbleed hero → feature bento grid → asymmetric sections. Animation: scroll-triggered fade-up + parallax + smooth Lenis scroll.

BRAND CONTEXT:
BARAK Tea is a premium CTC (Crush-Tear-Curl) tea brand from Barak Valley, Silchar, Assam. Premium dark luxury aesthetic. Colors: Near-black #0D0905 (60% background), Glass rgba(250,243,224,0.08) (30% surfaces), Gold #C8922A (10% accents). Font: Inter throughout (display + body + UI).

SMOOTH SCROLL INITIALIZATION:
Initialize Lenis smooth scroll on page load. Settings: duration 1.2s, ease "easeOutExpo". This creates the premium feel.

STICKY GLASS NAVBAR:
- Default: transparent background, sticky top 0, z-index 1000, padding 16px 32px
- Transition at 60px scroll: background rgba(13,9,5,0.8) with backdrop-filter blur(12px), 1px border-bottom rgba(200,146,42,0.12), box-shadow inset 0 1px 0 rgba(250,243,224,0.1)
- Left: BARAK Tea logo text in Inter 24px weight 800 gold #C8922A, no subtext (cleaner)
- Center: nav links — Home, Shop, Brew Guide, Our Story, Blog, Wholesale — Inter 14px weight 500, cream color, hover: gold #C8922A transition, underline gold on active
- Right: search icon (Phosphor MagnifyingGlass) + cart icon (ShoppingCart) with gold count badge + glass "Order on WhatsApp" button (gold border, glass bg, green icon)
  - Glass button: rgba(250,243,224,0.1) bg, border 1px rgba(200,146,42,0.2), padding 10px 20px, 24px radius, hover: darker glass bg + gold glow
- Mobile: hamburger Phosphor icon → fullscreen overlay menu with glass surface slide-in from right, staggered link fade-in
- Navbar buttons and icons remain consistent with glass styling

HERO SECTION (fullscreen, 100vh, dark background):
- Full-bleed dark background gradient: #0D0905 → #1A110A bottom
- Hero image: tea gardens at sunrise, 100% cover, parallax scroll at 0.5× speed, dark overlay rgba(13,9,5,0.65)
- Particle animation: HTML5 Canvas overlay, 30 tea-leaf particles floating upward at slow speed. Particles: gold #C8922A at 12% opacity. On hover, particles gently repel from cursor (desktop only). Reduce to 15 particles on mobile. Respect prefers-reduced-motion.
- Center content, max-width 900px:
  - Overline: Inter 13px weight 600, letter-spacing 0.08em, cream color, "PREMIUM CTC FROM BARAK VALLEY" uppercase
  - Hero headline: Inter 900, clamp(64px, 12vw, 120px), cream #FAF3E0, letter-spacing -0.04em, line-height 0.95:
    Line 1: "The Finest CTC Tea"
    Line 2: Gradient text on "from Barak Valley" using linear-gradient(135deg, #C8922A, #F5D98B)
    - Word-by-word reveal: each word opacity 0 + translateY(20px) → opacity 1, stagger 0.08s
  - Subtext: Inter 18px weight 400, #9E8C78, max-width 520px, margin-top 20px: "Hand-sourced from the lush gardens of Silchar, Assam. Pure, fresh, crafted for the perfect chai."
  - CTA row: Two buttons side by side
    1. "Shop Now" glass button (gold border, glass bg, right arrow icon, hover glow effect)
    2. "Order on WhatsApp" solid gold button (dark text, 10px padding, 8px radius, WhatsApp icon left)
  - Trust row below buttons: "★★★★★ Trusted Nationwide · Free Delivery above ₹499 · 100% Natural CTC" — Inter 13px cream, staggered emoji
- Scroll indicator at bottom: animated chevron-down in gold, bouncing 8px, fade on scroll

FEATURE BENTO GRID (after hero, dark section):
- Section title: "Why Choose BARAK Tea" — Inter 48px weight 700 cream, letter-spacing -0.02em, centered, margin-bottom 48px
- Bento grid layout (3 rows, varying card sizes):
  Row 1: Big card (2×2) + Two small cards (1×1 stacked)
  Row 2: Two small cards (1×1) + Big card (2×2)
  - Each card: glass surface (rgba(250,243,224,0.08) bg, blur 12px), gold border 1px rgba(200,146,42,0.12), 16px radius, 32px padding, hover: darker glass + gold glow shadow
  - Big cards: H3 Inter 28px weight 700 cream + description Inter 15px cream 70% + 64px icon Phosphor (gold) top-left
  - Small cards: H4 Inter 18px + description Inter 13px cream 70%
  - Content on scroll: fade-up from translateY 40px + opacity 0, stagger each card 0.06s

Cards:
1. 🍃 "100% Natural" — Hand-picked CTC leaves, no additives, no preservatives
2. 🌾 "Fresh Daily" — Packed monthly, vacuum-sealed for peak freshness
3. ⚡ "Bold Flavor" — Dense, rich oxidation creates dynamic cup profile
4. 🚚 "Fast Delivery" — Ships within 24 hours, nationwide free shipping above ₹499
5. ♻️ "Sustainable" — Ethical sourcing, minimal packaging waste
6. 💚 "Community" — Direct from farmers, supports Barak Valley livelihoods

TRUST TICKER STRIP (dark section below bento):
- Dark background with subtle gradient, horizontal infinite marquee at 20px/s
- Items separated by small gold tea-leaf dividers (SVG): "100% Pure CTC" · "Freshly Packed" · "Free Delivery on ₹499+" · "WhatsApp Support 24/7" · "Grown in Barak Valley" · "No Preservatives"
- Text: Inter 12px weight 600, gold #C8922A, uppercase, letter-spacing 0.1em
- Full-width scroll, no gaps

FEATURED PRODUCTS SECTION:
- Section header: "Our Premium Selection" — Inter 40px weight 700 cream + overline "Handpicked for You" Inter 12px cream 50%
- Horizontal scrollable rail (snap-scroll on mobile), 4-5 product cards visible
- Each product card: glass surface (same styling as bento), image 1:1 aspect, product name Inter 16px weight 700 cream, variant pills (250g/500g/1kg), price (MRP strikethrough muted + selling price gold bold), "Add to Cart" glass button with gold border, hover: glow effect + translateY(-4px)
- Scroll trigger: cards fade-in on scroll with stagger

ORIGIN STORY ASYMMETRIC BLOCK:
- Grid: image 60% left + content 40% right
- Left: full-bleed tea gardens image with parallax 0.4× speed, soft dark overlay
- Right: glass surface (rgba color, blur 12px, gold border) with vertical centering, padding 48px
  - Overline: Inter 11px uppercase gold, letter-spacing 0.08em: "OUR STORY"
  - Heading: "From the Heart of Barak Valley" — Inter 42px weight 700 cream, letter-spacing -0.02em
  - Body: Inter 15px cream 80%, line-height 1.8, 3-4 sentences about heritage
  - Accent: "from our valley to your cup" — Inter 18px weight 600 gold
  - CTA: "Read Our Story" — glass button with gold border, right arrow
- On scroll: left image translateX(-30px) fade-in, right content translateX(30px) fade-in, 0.7s ease-out

BREW GUIDE TEASER:
- Full-width dark section with subtle gold radial glow effect behind content (positioned top-right)
- Centered content:
  - Heading: "Brew the Perfect Cup" — Inter 40px weight 700 cream
  - 4 step icons in horizontal row: circle glass backgrounds (rgba with gold border), white Phosphor icons (20px), step labels
  - Step labels: "Boil" · "Add" · "Steep" · "Pour" — Inter 13px cream below each icon
  - CTA: "See Full Brew Guide" — solid gold button with right arrow
- Scroll trigger: fade-in from opacity 0 on section view

TESTIMONIALS BENTO SECTION:
- Section title: "What Our Customers Say" — Inter 48px weight 700 cream, centered
- Asymmetric card grid (3-4 visible cards depending on screen):
  - Mix of tall (2 rows) and short (1 row) glass cards
  - Each card: glass surface, 24px radius, 20px padding, gold border subtle
  - 5 gold stars, italic quote Inter 14px cream with large opening quotation mark (36px gold)
  - Customer name bold Inter 13px + city + "Verified Buyer" green pill
- Cards auto-scroll horizontally with pause on hover, fade-in on scroll with stagger

SEASONAL/PROMOTIONAL BANNER (conditional):
- Glass surface banner card, full-width (max-width 1440px), centered, margin 48px 0
- Design toggles by occasion (Eid/Bihu/Diwali/New Year):
  - Gold/cream gradient overlay, glass surface, 1px gold border
  - Promo text: Inter 32px weight 700 cream + subtext + seasonal product showcase
  - CTA button: solid gold "Shop [Season] Special"
  - If countdown needed: timer display (days remaining) in gold
- Scroll trigger: scale-in from 0.9 opacity 0

NEWSLETTER + WHATSAPP OPT-IN STRIP:
- Glass surface card, centered, max-width 640px, blur 12px, gold border, padding 48px
- Heading: "10% Off + Free Tea Sample on First Order" — Inter 32px weight 700 cream
- Subtext: "Join our WhatsApp community for exclusive deals and tea stories" — Inter 14px cream 70%
- Input row: Two inline glass inputs side-by-side
  - Email input: glass bg, gold border on focus, cream text, 24px radius, 12px padding
  - WhatsApp number input: similar styling
  - "Subscribe" solid gold button on right
- Checkbox: "I agree to the privacy policy" — small text below
- Scroll trigger: fade-up + scale from 0.95

FOOTER:
- Background: #0D0905 with subtle texture
- 4-column grid (2-column mobile): Brand · Shop Links · Resources · Contact
- Each column: Inter 13px cream head weight 700, links below in 13px 70% opacity, hover gold transition
- Top border: 1px gold #C8922A at 40% opacity
- Bottom bar: copyright + social icons (Twitter, Instagram, LinkedIn) in gold
- Social icons: 20px Phosphor icons, hover: glow effect

STICKY WHATSAPP FAB:
- Fixed bottom-right: 56px glass circle button (rgba(250,243,224,0.12) bg, gold border), z-index 50
- White WhatsApp icon (Phosphor, 24px)
- Pulse animation: scale 1 → 1.12 → 1, 2s infinite alternating
- Hover: expand to pill shape with "Chat with Us" text
- Smooth transition 0.3s ease
- Links to wa.me/[businessPhone]
```

---

## 🛍️ PROMPT 2 — SHOP PAGE (/shop)

```
Build the BARAK Tea shop/catalogue page with glassmorphism design. Aesthetic: clean dark premium with glass surfaces and subtle animations. Layout: filter sidebar + product grid. Animation: scroll-triggered fade-up cards with stagger, smooth scroll.

Use the same sticky glass navbar from homepage.

PAGE HEADER:
- Dark background #0D0905 with subtle gradient
- Playfair Display H1 "Our Teas" (now use Inter) — Inter 56px weight 700 cream + Inter 14px weight 500 cream 60%: "Freshly packed from Barak Valley" below
- Breadcrumb: Home › Shop — Inter 12px cream 50%, with › separator in gold

FILTER BAR + SEARCH (sticky below navbar):
- Glass surface background: rgba(250,243,224,0.08) with blur 12px, gold border 1px rgba(200,146,42,0.12), padding 16px 24px
- Left: horizontal scrollable category pills
  - All, Everyday, Premium, Blends, Gift Boxes
  - Inactive pill: cream border (1px), gold text, 24px radius, padding 8px 20px
  - Active pill: gold fill #C8922A, dark text, smooth transition
- Center: search bar with Phosphor MagnifyingGlass icon left, glass bg (rgba), gold border on focus, cream text, 24px radius, 10px padding
- Right: Sort dropdown (Popularity, Price Low→High, Price High→Low, Newest) + Filter icon button (glass style)

PRODUCT GRID:
- 2-col mobile, 3-col tablet, 4-col desktop, gap 24px, padding 32px
- Each product card: glass surface (rgba(250,243,224,0.08) bg, blur 12px, border 1px rgba(200,146,42,0.12), 16px radius, box-shadow: 0 8px 32px rgba(0,0,0,0.3))
  - Image area 1:1 aspect ratio, dark placeholder with product emoji centered large
  - TOP-LEFT: "Freshness" green badge "Packed: Apr 2026" — solid green bg, cream text
  - TOP-RIGHT: wishlist heart icon (outline cream, hover fill gold)
  - If out of stock: semi-transparent gray overlay, "Sold Out" cream pill centered, "Notify Me" gold button replaces cart
  - Content area padding 20px:
    - Category label: Inter 10px uppercase gold, letter-spacing 0.1em
    - Product name: Inter 16px weight 700 cream
    - Pack size pills: 250g · 500g · 1kg — small glass pills (rgba bg, gold border), clickable to select
    - Price row: MRP strikethrough cream 50% + selling price Inter 16px weight 700 gold + per-unit price Inter 11px cream 50%
    - "Add to Cart" glass button (gold border, rgba bg, hover: darker glass + glow shadow), 24px radius, full-width
  - Card hover: gold glow shadow, translateY(-4px), transition 0.35s ease
- Cards scroll-trigger: fade-up from translateY 30px opacity 0, stagger 0.06s each

EMPTY / NO-RESULTS STATE:
- Centered: tea-cup Phosphor icon (48px gold), "No Teas Found" Inter 24px cream, "Try clearing filters or adjusting search" Inter 13px cream 50%
- Popular teaspoon link below
```

---

## 📦 PROMPT 3 — PRODUCT DETAIL PAGE (/product/:slug)

```
Build the BARAK Tea product detail page with glass surfaces. Aesthetic: editorial luxury with frosted glass surfaces. Layout: asymmetric 55/45 split — image gallery left (parallax on scroll), product info right. Animation: fade-in gallery, accordion expand, scroll parallax.

BREADCRUMB: Home › Shop › [Category] › [Product Name] — Inter 12px cream 50%, with › separator in gold

IMAGE GALLERY (left 55%):
- Main image: large square (1:1), zoom-on-hover (transform scale 1.8 on clipped container), 16px radius, gold glow shadow on hover, parallax 0.3× on scroll
- Thumbnail rail below: 4 small square thumbnails, gold border (1px) on active, click to swap main, 12px radius
- Mobile: full-width swipeable carousel with dot indicators (gold)
- "Share" floating button bottom-right: Phosphor ShareNetwork icon, glass surface on hover expands to show: WhatsApp, Facebook, Copy Link options

PRODUCT INFO (right 45%, sticky top 120px):
- Glass surface background (optional): rgba(250,243,224,0.08) with blur, border gold, rounded 16px, padding 32px
- Overline: Inter 11px uppercase cream 50%, letter-spacing 0.08em: "BARAK TEA · BARAK VALLEY, ASSAM"
- Product name: Inter 32px weight 700 cream, letter-spacing -0.02em
- Star rating: gold star icons (Phosphor Star, 16px, 5 stars max) + "(24 reviews)" Inter 12px gold link
- Price block:
  - MRP strikethrough: ~~₹340~~ Inter 13px cream 50%
  - Selling price: ₹280 Inter 28px weight 700 gold, bold
  - Unit price: "₹56 per 100g" Inter 11px cream 50%
  - "Incl. GST" pill badge
- Freshness + origin badges: "Packed: Apr 2026" solid green pill + "Barak Valley, Assam" glass pill with map-pin icon
- Variant selector:
  - Label: "Pack Size" Inter 12px weight 600 cream
  - Pill buttons for 250g / 500g / 1kg, glass styling (inactive) → gold fill (active)
  - Out of stock variant: strikethrough + disabled gray, tooltip "Sold Out"
  - Price updates dynamically on selection
- Quantity stepper: − button · number input (cream/gold on focus) · + button, all glass styled
- CTA row: 
  - "Add to Cart" golden button (60% width, solid gold, dark text, 24px radius, 12px padding)
  - "Buy via WhatsApp" green button (40% width, solid green #25D366, white text, WhatsApp icon left)
  - WhatsApp link: pre-fills "Hi BARAK Tea! I'd like to order [Product] [Pack] x [Qty]"
- Trust pills row: "100% Natural" · "Free Delivery ₹499+" · "24/7 WhatsApp Support" — inline glass pills with icons

TABS SECTION (below main info):
- Tab navigation: Description · Ingredients & Nutrition · Shipping & Returns
- Sliding gold underline indicator on active tab, transitions 0.3s ease
- Description tab: Inter 15px cream 80%, line-height 1.8, bold subheadings in gold
- Ingredients tab: table layout with glass rows, alternating rgba 0.08 / 0.12 backgrounds
- Shipping tab: accordion (Phosphor ChevronDown icon rotates) with policies in glass-bordered sections

BREW GUIDE SNIPPET (collapsible accordion):
- Glass surface card, gold left border (2px), padding 20px, 16px radius
- "How to Brew This Tea" — Inter 16px weight 700 cream + Phosphor ChevronDown (rotates on open)
- Expanded content: steps + ratios + illustrated icons (15px Phosphor icons in gold)

REVIEWS & RATINGS SECTION:
- Heading: "Customer Reviews" Inter 28px weight 700 cream
- Star aggregate: 5-star bar chart (visual bars in gold on glass background), percentages, count badges
- "Sort Reviews" dropdown
- Review cards: glass surface, gold border, padding 16px, 12px radius
  - Star rating (gold), headline Inter 14px weight 600 cream, body Inter 13px cream 80%
  - "Verified Buyer" green pill, customer name, date
  - Helpful icons (Phosphor ThumbsUp) with count
- "Write a Review" button: gold glass style

RELATED PRODUCTS (4-card rail):
- "You May Also Like" — Inter 24px weight 700 cream
- Horizontal scrollable, same card style as shop grid, fade-in on scroll
```

---

## 🛒 PROMPT 4 — CART DRAWER (global component)

```
Build a slide-in cart drawer with glassmorphism. Opens from the RIGHT when a product is added. Aesthetic: glass surface dark panel, premium feel.

OVERLAY: position fixed, inset 0, background rgba(13,9,5,0.7), backdrop-filter blur(8px), z-index 1000. Click overlay closes drawer.

DRAWER PANEL: position fixed, right 0, top 0, height 100vh, width 420px (full-width on mobile), background rgba(26,17,10,0.95) with backdrop-filter blur(12px), 1px leftborder rgba(200,146,42,0.12), gold glow effect. Slides in: transform translateX(100%) → translateX(0), transition 0.4s cubic-bezier(0.4,0,0.2,1).

DRAWER HEADER: background rgba(13,9,5,0.8), padding 20px 24px, flex space-between, border-bottom 1px rgba(200,146,42,0.08). Left: "Your Cart" Inter 18px weight 700 cream + item count badge gold. Right: X close button (Phosphor X, cream, hover gold).

FREE SHIPPING PROGRESS BAR (below header):
- Background rgba(250,243,224,0.05), padding 12px 24px, border-bottom 1px rgba(200,146,42,0.08)
- "Add ₹[X] more for free delivery!" Inter 12px cream 70%
- Progress bar: full width, 4px height, background rgba track, #C8922A gold fill, smooth transition
- Turns green with "🎉 Free delivery unlocked!" when ₹499 threshold hit

CART ITEMS (scrollable area, flex 1):
- Each item: padding 16px 24px, border-bottom 1px rgba(200,146,42,0.08), flex row
- Left: product thumbnail 64px square, 8px radius, dark placeholder background
- Right: product name Inter 14px weight 700 cream · variant label Inter 11px cream 50% · price Inter 14px gold bold
- Quantity stepper: small − / + buttons with number, glass styling (rgba border), 4px radius
- Remove button: trash Phosphor icon cream, hover: red (#C0392B) transition

COUPON CODE FIELD:
- Padding 16px 24px, border-top 1px rgba(200,146,42,0.08)
- Flex row: glass input (placeholder "Promo code", rgba bg, gold border on focus) + "Apply" gold button glass style
- Error state: red border, "Invalid code" Inter 11px red
- Success state: green border, "✓ Discount applied" Inter 11px green

ORDER SUMMARY (fixed at drawer bottom):
- Background rgba(26,17,10,0.9), border-top 1px gold rgba(200,146,42,0.2), padding 20px 24px
- Subtotal row Inter 13px cream · Discount row gold (if applied) · Shipping row green if Free · GST row · Total row Inter 18px weight 700 gold
- "Checkout via WhatsApp" button: full-width, solid #25D366, white text, WhatsApp Phosphor icon left, 24px radius, 14px font weight 600, hover: darker green
- "Continue Shopping" ghost text link below, centered, Inter 13px

UPSELL ROW (between items and coupon):
- Horizontal scrollable 2-card mini suggestions
- "You might also like..." Inter 11px cream 50% header
- Mini product cards (glass style, compact)

ACCESSIBILITY: focus trap inside drawer, ESC closes, aria-modal true, aria-label "Shopping Cart"
```

---

## ☕ PROMPT 5 — BREW GUIDE (/brew-guide)

```
Build the BARAK Tea Brew Guide page with glassmorphism. Aesthetic: warm editorial with glass surfaces, scroll-triggered reveals. Layout: hero + tab switcher + step-by-step guide + interactive calculator. Animation: scroll reveals, calculator live updates.

PAGE HERO:
- Background: #0D0905 with subtle gold radial glow (top-right corner), height 400px
- Canvas animation: HTML5 Canvas with rising steam-wave lines (bezier curves) in gold at 15% opacity, gentle undulation
- Centered content max-width 900px:
  - Overline: Inter 13px uppercase cream 50%, "HOW TO BREW PERFECTLY"
  - Heading: "The Perfect Cup of Chai" — Inter 60px weight 700 cream, letter-spacing -0.02em
  - Subheading: Inter 18px cream 70%, "A guide by BARAK Tea · Follow these steps to honor our Barak Valley tradition"

TAB SWITCHER:
- 2 tabs: "Classic CTC" and "Masala Chai" — glass surface bar (rgba bg, gold border), sliding gold underline indicator
- Padding 12px total, 24px rounded ends, transition 0.35s ease

6-STEP GUIDE (for selected tab):
- Each step: full-width asymmetric layout alternating left image / right text, then right image / left text
- Step container: padding 64px 0, scroll-triggered: fade-up from opacity 0 translateY 40px, 0.7s ease
- Step number: background text, Inter 120px weight 900 gold at 10% opacity (decorative, behind content)
- Step illustration: 1:1 aspect image (tea brewing photos placeholder), parallax 0.4× scroll speed, rounded 16px, gold glow shadow
- Content padding 48px:
  - Step label: Inter 11px uppercase letter-spacing 0.1em gold
  - Heading: "Step [N]: [Title]" — Inter 36px weight 700 cream, letter-spacing -0.02em
  - Description: Inter 15px cream 80%, line-height 1.8, 2-3 sentences
  - Tip callout: glass surface (rgba bg with blur, gold border), padding 16px, rounded 12px, Phosphor Lightbulb icon gold (24px), "Pro Tip: [text]" Inter 13px cream

Steps for Classic CTC:
1. Boil Fresh Water — 200ml spring water, full rolling boil in pot
2. Add Quality Tea — 1.5–2 tsp Classic CTC Dust (use our calculator for exact amount)
3. Steep & Brew — 2–3 minutes covered, brew until dark amber
4. Add Whole Milk — 50–60ml full-fat milk, bring to gentle boil
5. Sweeten to Taste — 1–2 tsp sugar or jaggery, stir well
6. Strain & Serve — through fine mesh into warmed cup, enjoy immediately

RATIO CALCULATOR (sticky on desktop, center of page, glass card):
- Glass surface card (rgba bg, blur 12px, gold border, 16px radius, padding 32px, 480px max-width)
- Heading: "Brew Calculator" Inter 24px weight 700 cream
- "How many cups?" label Inter 13px cream + range slider (1–10 cups)
  - Slider: gold track, gold thumb circle (interactive, hover lift effect)
- Live output box (updates on slider move):
  - Grid of 5 stats:
    - 🍵 Cups: [N]
    - 🌿 Tea: [N×2] tsp
    - 💧 Water: [N×200] ml
    - 🥛 Milk: [N×60] ml
    - 🍬 Sugar: [N×1.5] tsp
  - Each stat: value Inter 18px weight 700 gold, label Inter 12px cream 70%
- "Download Brew Sheet PDF" button: glass style, gold border, right arrow icon

MASALA CHAI TAB — same structure, calculator adds spice row:
- Cardamom pods: [N] pods
- Ginger slices: [N]–[N+1] slices
- Tulsi/Holy Basil leaves: 3–5 leaves

PRODUCT CROSS-LINKS (inline within step content):
- After Step 2: small product card suggestion (glass style, 240px wide, inline)
- "Best for this recipe: Classic CTC Dust" — product name, "Add to Cart" glass button with gold border
```

---

## 🏔️ PROMPT 6 — OUR STORY (/about)

```
Build the BARAK Tea Our Story page with glassmorphism. Aesthetic: editorial storytelling with dark luxury, glass surfaces. Layout: long-form narrative with parallax imagery. Animation: parallax image sections, scroll-triggered text reveals.

HERO SECTION:
- Full-bleed dark background #0D0905, height 500px
- Hero image: tea gardens aerial view, parallax 0.5×, dark overlay rgba(13,9,5,0.6)
- Centered content:
  - Overline: Inter 13px uppercase cream 50%, "OUR HERITAGE"
  - Heading: "From the Valley to Your Cup" — Inter 64px weight 700 cream, letter-spacing -0.02em
  - Subheading: Inter 18px cream 70%, "The story of BARAK Tea" — italic weight 400

BRAND ORIGIN NARRATIVE SECTION:
- Asymmetric 40/60 split
- Left 40%: tea-growing portrait image, parallax 0.4× scroll
- Right 60%: long-form text on dark background:
  - Lead paragraph: Inter 18px weight 500 cream, line-height 2
  - Body paragraphs: Inter 15px cream 80%, line-height 1.9
  - Section headings: Inter 28px weight 700 cream, letter-spacing -0.01em
  - Pull quote: "a quote about tea" — Inter 22px italic cream, gold accent color, 20px left gold border (2px), padding-left 20px
- Scroll trigger: left image fade-in from left (translateX -40px), right text fade-in from right (translateX 40px), stagger 0.1s

BARAK VALLEY GEOGRAPHY SECTION:
- Full-width cream-on-dark section, center content max-width 1200px
- Heading: "Where Assam's Hidden Gem Grows" — Inter 40px weight 700 cream
- Leaflet.js interactive map:
  - Custom dark map tiles (warm-tinted color scheme)
  - Gold pin marker on Silchar (24.8333°N, 92.7789°E)
  - Popup on marker: "BARAK Tea · Barak Valley, Assam"
  - Non-scrollable (decorative), zoom disabled, sized 100% width, height 420px
- 3 stat callout cards below map (glass surface, gold borders):
  - "300+ Tea Gardens" · "Rich Alluvial Soil" · "Harvested Year-Round"
  - Each: icon (Phosphor, 32px gold) + value (Inter 24px weight 700 gold) + label (Inter 13px cream 70%)

FOUNDER'S NOTE:
- Glass surface card (rgba bg, blur, gold border), centered, max-width 680px, padding 48px, 16px radius
- Heading: "A Note from Our Founder" — Inter 28px weight 700 cream
- Body: italic Inter 16px cream 80%, line-height 2
- Signature: Inter 24px weight 700 gold + founder name Inter 12px cream 50% below
- Scroll trigger: scale-in from 0.95 opacity 0

QUALITY PROCESS SECTION:
- Dark background section, padding 64px 0
- Centered heading: "How We Bring Tea to You" — Inter 40px weight 700 cream
- Horizontal timeline (4 steps): Harvest → Crush-Tear-Curl → Grade & Sort → Pack Fresh
  - Step layout: gold numbered circle (24px radius, Inter 20px weight 700 dark) + title Inter 18px weight 600 cream + description Inter 13px cream 70%
  - Connecting line between circles: 1px gold (dashed), responsive
  - On scroll: each step fades in + bounces slightly (scale 0.9 → 1.05 → 1)
- Scroll trigger: Stagger each step 0.12s, fade-up animation

CERTIFICATIONS ROW:
- Flex row, center-aligned, gap 32px, padding 48px
- 4–5 certification badge cards (glass surface, rounded 12px, padding 24px):
  - Certification emoji/icon (32px) + "Certified [Type]" Inter 14px weight 600
  - Examples: ISO Certified, Fair Trade, Organic, etc. (or placeholder cards)
```

---

## 📞 PROMPT 7 — CONTACT PAGE (/contact)

```
Build the BARAK Tea Contact & Support page with glassmorphism. Aesthetic: warm, inviting, accessible. Layout: centered single-column with prominent WhatsApp CTA.

PAGE HERO:
- Dark background section, height 300px, centered content
- Heading: "We'd Love to Hear from You" — Inter 48px weight 700 cream, letter-spacing -0.01em
- Subheading: Inter 18px cream 70%, "Always here to help"

PRIMARY WHATSAPP CTA CARD (prominent):
- Solid #25D366 green background, white content, glass surface effect (slight transparency), round corners 20px
- Padding 48px, centered, max-width 600px, margin 48px auto
- WhatsApp Phosphor icon (64px white) centered top
- Heading: "Chat with Us on WhatsApp" — Inter 28px weight 700 white
- Description: Inter 16px white 90%, "The fastest way to order, ask questions, or get support"
- Business hours: "Monday – Saturday 9AM–9PM IST" — Inter 13px white 80%
- "Start Chat →" button: white background, green text, 24px radius, 12px padding, hover lifted
- Link: wa.me/[businessPhone]

CONTACT FORM CARD (below):
- Glass surface card (rgba bg, blur 12px, gold border), centered, max-width 560px, padding 40px, 16px radius
- Heading: "Send Us a Message" — Inter 24px weight 700 cream
- Form fields (glass inputs with gold borders):
  - Name input, Email input, Phone input (with +91 prefix), Message textarea
  - All: rgba(250,243,224,0.08) bg, border 1px gold on focus, 12px radius, padding 10px 16px, Inter 14px cream
- "Send Message" button: solid gold, dark text, 24px radius, full-width, hover: darker gold
- Helper text below: Inter 12px cream 50%, "We typically reply within a few hours"

FAQ ACCORDION:
- Section: "Frequently Asked Questions" — Inter 40px weight 700 cream
- 10 FAQ items: each full-width glass surface card (rgba, gold border), rounded 12px, padding 16px, margin-bottom 12px
- Question: flex row with Phosphor ChevronDown icon right (rotates on open), Inter 15px weight 500 cream, click toggles open
- Answer: Inter 14px cream 80%, collapsible, max-height 0 → auto, 0.3s ease, one open at a time

FAQ Questions:
1. How quickly can you ship? · 2. What payment methods do you accept? · 3. Can I return or exchange? · 4. How long does tea stay fresh? · 5. Do you ship internationally? · 6. Can I order via WhatsApp? · 7. Is bulk ordering available? · 8. How do you ensure quality? · 9. What's your loyalty program? · 10. Can I customize orders?

CONTACT INFO ROW (below FAQ):
- 3 glass cards side-by-side (flex row, gap 24px, responsive stacks)
- Card 1: Location pin icon (gold, 24px), "Visit Us" heading, address text Inter 13px cream
- Card 2: Envelope icon (gold), "Email Us" heading, email link Inter 13px cream, hover gold
- Card 3: Clock icon (gold), "Hours" heading, "Mon–Sat 9AM–9PM IST" Inter 13px cream
- Each card: glass surface (rgba, gold border), rounded 12px, padding 20px
```

---

## 🏭 PROMPT 8 — WHOLESALE ENQUIRY (/wholesale)

```
Build the BARAK Tea wholesale/B2B enquiry page with glass surfaces. Aesthetic: professional + warm, trustworthy dark design. Layout: hero + pricing tiers + enquiry form.

HERO SECTION:
- Dark background #0D0905, height 350px, subtle gold radial glow (top-right)
- Centered content, max-width 900px:
  - Overline: Inter 13px uppercase cream 50%, "B2B OPPORTUNITIES"
  - Heading: "Partner with BARAK Tea" — Inter 56px weight 700 cream, letter-spacing -0.02em
  - Subheading: Inter 18px cream 70%, "Bulk pricing for restaurants, hotels, and distributors across India"

INFO PILLS ROW (below hero):
- 3 glass pills side-by-side, centered, gap 20px
- Each pill: glass surface (rgba bg, gold border, blur), padding 16px 24px, rounded 20px
- Icons (Phosphor, 20px gold) + "MOQ: 10kg per order" · "GST Invoice Ready" · "24-Hour Response" — Inter 13px cream

TIERED PRICING TABLE (initially blurred/locked):
- Section heading: "Our Bulk Pricing" — Inter 36px weight 700 cream, centered
- 3-column grid (responsive tablets/mobile): 10kg+, 50kg+, 100kg+
- Each column: glass surface card (rgba, gold border, rounded 16px, padding 32px)
  - Header: tier name Inter 20px weight 700 gold
  - Price per kg: large bold gold number, "per kg" label muted
  - Features list: Phosphor checkmark icon (gold, 16px) + feature text Inter 13px cream, bullets
  - "Select Plan" glass button (gold border) at bottom
- Blur overlay (if locked): semi-transparent dark glass with "Submit Enquiry to See Pricing" centered, blue/gold gradient button

ENQUIRY FORM CARD:
- Glass surface (rgba bg, blur 12px, gold border), rounded 16px, padding 40px, max-width 680px, centered
- Heading: "Request a Custom Quote" — Inter 28px weight 700 cream
- Form grid (2 columns, stacks on mobile):
  - Business Name input (glass style)
  - Contact Person input
  - Phone input (required, +91 prefix option)
  - Email input
  - City / Region dropdown
  - Monthly Requirement (kg) numeric input
  - Message textarea (larger, 4 rows)
  - GST Number input (optional)
- "Send Enquiry" button: solid gold, dark text, 24px radius, 14px font weight 600, full-width
- Helper text below: Inter 13px cream 50%, "We'll respond on WhatsApp within 24 hours with a personalized quote"

TRUST INDICATORS SECTION:
- Flex row, centered, gap 32px, padding 48px 0
- 4 trust badges (icons + labels):
  - Certified badge (seal icon gold)
  - Direct sourcing (hands shake icon gold)
  - Competitive pricing (percentage icon gold)
  - Dedicated support (headset icon gold)
- Each: icon 32px gold + label Inter 13px cream 70%
```

---

---

# 🖥️ ADMIN PANEL PROMPTS

---

## PROMPT A — ADMIN DESIGN SYSTEM

```
Set up the BARAK Tea Admin Panel design system with glassmorphism. Dark luxury admin console with glass surfaces.

ADMIN COLOR TOKENS:
--admin-bg: #0D0905 (black-dark, near-black warm background)
--admin-surface: #1A110A (sidebar, top bar, panels)
--admin-glass: rgba(250, 243, 224, 0.08) (glass surfaces on dark)
--admin-glass-border: rgba(200, 146, 42, 0.15) (gold-tinted glass borders)
--admin-card: rgba(26, 17, 10, 0.6) with blur 12px (content cards)
--admin-border: rgba(200, 146, 42, 0.12) (subtle borders)
--admin-gold: #C8922A (primary accent, active states)
--admin-gold-light: #E8B84B (hover accent, highlights)
--admin-gold-dim: #8A6118 (dimmed gold backgrounds)
--admin-cream: #FAF3E0 (primary text, high contrast)
--admin-muted: #9E8C78 (secondary text, placeholders)
--admin-success: #2D7A4F
--admin-error: #C0392B
--admin-warning: #D4870A
--admin-whatsapp: #25D366

ADMIN TYPOGRAPHY: Inter (all sizes) — clean, readable sans-serif, warm palette.

ADMIN COMPONENTS (Glassmorphism):
- Cards: rgba(26,17,10,0.7) background, blur 12px, 1px rgba(200,146,42,0.12) border, 12px border-radius, box-shadow: 0 8px 32px rgba(0,0,0,0.3)
- Tables: glass rows, alternate rgba(250,243,224,0.05) / 0.08, 1px rgba(200,146,42,0.12) borders
- Inputs: rgba(250,243,224,0.08) bg, blur 8px, border 1px rgba(200,146,42,0.12), gold focus border, 8px radius, 10px padding, cream text
- Badges: colored pill badges with soft glow — processing(gold), shipped(blue), delivered(green), cancelled(red) — 12px radius
- Buttons: Primary glass (gold border, rgba bg) · Secondary dark outline · Danger red · WhatsApp green
- Stat cards: glass surface, circular gold glow accent top-right corner (80px blur)
- Transitions: all 0.35s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## PROMPT B — ADMIN LAYOUT SHELL

```
Build the BARAK Tea Admin Console layout shell with glassmorphism. Aesthetic: dark luxury sidebar + glass panels. Same sidebar pattern as premium dashboards.

SIDEBAR (collapsible, 220px expanded → 64px collapsed, sticky 100vh):
Background: rgba(26,17,10,0.8) with backdrop-filter blur(12px), right border: 1px rgba(200,146,42,0.12), transition width 0.25s ease

SIDEBAR HEADER (border-bottom rgba(200,146,42,0.12)):
- Expanded: "BARAK TEA" in Inter 16px weight 800 gold #C8922A + "Admin" in Inter 10px muted below, collapse chevron-left button (muted) on right, hover gold
- Collapsed: ☕ emoji 22px centered, tooltip on hover

SIDEBAR NAVIGATION (flex 1, overflow-y auto, padding 12px 0):
Nav items: Dashboard, Products, Orders, Customers, Inventory, Shipments, Coupons, Reviews, Wholesale, Blog, Analytics, Settings
- Each item: full-width button, padding 10px 16px, Inter 13px, flex row with Phosphor icon (20px) + label
- Inactive: muted text, transparent, 3px transparent left border
- Active: gold #C8922A text, rgba(200,146,42,0.15) background, 3px gold left border, border-radius 8px right side
- Hover: muted → cream transition, 0.15s, gold glow subtle
- Notification badges (corner, top-right of icon): red pill #C0392B (e.g., 2 pending reviews)
- Collapsed state: icon only, 20px padding sides, tooltip on hover

SIDEBAR FOOTER (border-top rgba(200,146,42,0.12)):
- Expanded: 32px gold avatar circle (gradient gold to orange) "B" initial + "Admin" Inter 12px cream + "BARAK Owner" Inter 10px muted + LogOut icon (Phosphor SignOut, hover red) right
- Collapsed: just the avatar, click to expand, logout on right-click

TOP BAR (sticky top 0, z-index 100):
Background: rgba(26,17,10,0.9) with backdrop-filter blur(12px), border-bottom: 1px rgba(200,146,42,0.12), padding 14px 28px, flex space-between

Left: breadcrumb — "BARAK Tea" Inter 12px muted + ChevronRight (gold, 12px) + current page name Inter 12px weight 600 gold capitalize

Right (flex, gap 20px):
- Notification bell (Phosphor Bell icon, 20px cream) with red count badge (3+)
- "WhatsApp HQ" green pill button (border rgba(37,211,102,0.3), bg rgba(37,211,102,0.1), color #25D366, Inter 12px weight 500, MessageCircle icon 16px left)
- Vertical divider: 1px rgba(200,146,42,0.12), 24px height
- Date: "April 22, 2026" Inter 11px muted
- Admin user menu: avatar circle (24px, gold) + dropdown on click (profile, settings, logout)

---

## PROMPT C — ADMIN DASHBOARD PAGE

```
Build the BARAK Tea Admin Dashboard page with glassmorphism. Default page when admin logs in. Aesthetic: data-rich dark luxury with glass surfaces. Layout: stat cards grid + charts + activity feed.

PAGE HEADER: Inter 28px weight 700 cream "Dashboard" + Inter 13px cream 50% "Good morning · April 22, 2026" beside it

ROW 1 — STAT CARDS (4-column grid, gap 16px, responsive):
Each card: glass surface (rgba bg, blur 12px, gold border), rounded 16px, padding 20px 24px, position relative, overflow hidden
- Decorative circle: position absolute top-right, 120px circle, card accent color at 8% opacity, blur 40px
- Structure: label (Inter 10px uppercase gold letter-spacing 0.08em) · value (Inter 26px weight 700 cream) · sub-label (Inter 11px cream 50%) · trend indicator (Phosphor ArrowUp/ArrowDown icon + % green/red + "vs last month" muted)
- Icon: accent-colored circle background (16px radius, 24px padding) top-right, Phosphor icon (IndianRupee, ShoppingCart, Users, TrendingUp)

Cards:
1. Monthly Revenue — ₹28,450 — "This month" — +22.4% green — gold accent
2. Orders This Month — 87 — "80 target" — +8.8% green — blue accent
3. Active Customers — 234 — "Registered users" — +15.2% green — green accent
4. Avg Order Value — ₹327 — "Target ₹350" — -6.0% red — orange accent

ROW 2 — CHARTS (2-column, 60/40 split, responsive):
LEFT — Revenue Chart (60%): glass card (rgba, blur, gold border), rounded 16px, padding 24px
- Heading: Inter 18px weight 600 cream + "vs Previous Week" toggle button (small, glass style)
- Recharts BarChart: bars in #C8922A gold, x-axis dates Inter 11px muted, y-axis ₹ amounts, tooltip with dark glass background gold border, grid lines rgba(200,146,42,0.08)
- Below chart: 3 mini stat boxes (horizontal flex): "Total" ₹X · "Best Day" ₹X · "Orders" X

RIGHT — Orders by Channel (40%): glass card, heading Inter 18px
- Recharts PieChart donut: WhatsApp slice #25D366 (40%), Web slice #2563EB (60%), smooth animation
- Legend below with count + % per channel
- Center text: total order count Inter 18px weight 700 gold

ROW 3 — TWO COLUMNS (50/50):
LEFT — Recent Orders table: glass card, heading "Recent Orders" + "View All →" link right
- Table columns: Order ID, Customer, City, Amount, Status, Channel, Action
- Status column: colored pill badges (glass surface with color accent)
- Channel column: WhatsApp icon green or Web icon
- Action: Phosphor Eye icon button (hover gold)
- Show last 5 orders

RIGHT — Low Stock Alert: glass card, heading "Low Stock Alert" + warning Phosphor AlertTriangle icon (orange)
- List of products with stock < 20 units
- Each item: product emoji + name Inter 13px + current stock bold + "Reorder" glass button
- Progress bar per item showing stock level with red/orange fill when low

ROW 4 — ACTIVITY FEED + PENDING ACTIONS (50/50):
LEFT — Today's Activity: glass card, heading "Activity Feed"
- Vertical timeline list, each item: colored circle dot (gold/orange/blue per type) + Inter 13px description + timestamp muted
- Types: new order (gold dot), review pending (orange), wholesale enquiry (blue), stock update (muted)
- "Load More" glass button with outline

RIGHT — Pending Actions: glass card, heading "Action Required"
- List of clickable action items with red count badges:
  - "2 Reviews Awaiting Approval" → links to reviews page
  - "1 New Wholesale Enquiry" → links to wholesale page
  - "3 Orders to Confirm" → links to orders page
- Arrow right icon (Phosphor ArrowRight) on each item
```

---

## PROMPT D — ADMIN PRODUCTS PAGE

```
Build the BARAK Tea Admin Products management page with glass surfaces. Aesthetic: dark data table with glass cards. Layout: toolbar + table + slide-in edit panel.

PAGE HEADER: Inter 28px weight 700 cream "Products" + Inter 12px cream 50% "6 active" + "Add Product" gold button (Plus icon, Phosphor) right

TOOLBAR ROW (below header):
- Search input: glass surface (rgba bg, blur, gold border on focus), Phosphor MagnifyingGlass icon left, 24px radius, placeholder "Search products…", Inter 13px cream
- Category filter pills: All, Everyday, Premium, Blends, Gifts
  - Inactive: cream border glass bg, active: gold fill
  - 24px radius, glass styling
- Status filter: All, Active, Inactive (same pill style)
- Sort dropdown: Name, Price, Stock, Sold (glass button style with Phosphor ChevronDown icon)

PRODUCTS TABLE (glass card):
- Glass surface (rgba bg, blur 12px, gold border, 16px radius, overflow hidden)
- Table columns: Product, Category, Variants, Price, MRP, Stock, Sold, Status, Actions
- Table header: background rgba(200,146,42,0.08), Inter 11px uppercase gold, letter-spacing 0.1em, padding 14px 16px
- Each row: padding 12px 16px, border-bottom 1px rgba(200,146,42,0.08), hover: rgba(200,146,42,0.12) bg
- Product cell: product emoji (32px in circle bg) + name Inter 14px weight 600 cream + ID Inter 11px muted
- Price cell: gold bold ₹[price] + MRP muted strikethrough
- Stock cell: colored number (green >50, orange 10-50, red <10) with Phosphor AlertTriangle if low
- Status cell: glass pill badge (Active green, Inactive gray)
- Actions cell: Phosphor Pencil icon (hover gold), Eye icon, Trash icon (hover red)
- Low stock rows: 2px left gold border

EMPTY STATE: centered Phosphor TeaCup icon (48px gold), "No products yet" Inter 20px cream, "Add your first product" gold glass button

ADD/EDIT PRODUCT PANEL (slide-in right, 480px, dark glass):
- Header: "Edit Product" Inter 20px weight 700 cream on rgba(13,9,5,0.9) + Phosphor X close button (cream, hover gold)
- Scrollable form body:
  - Product name input (glass), Category dropdown, Status toggle Active/Inactive
  - Image picker carousel (3-item display, rounded 12px)
  - Pack size pills: 250g / 500g / 1kg — multi-select, glass styling
  - Price row (2-col): Price input + MRP input
  - Stock input, Description textarea
  - "Save Changes" gold button full-width at bottom, padding 20px
- All inputs: glass surface with gold focus border, 28px radius, padding 10px 12px
```

---

## PROMPT E — ADMIN ORDERS PAGE

```
Build the BARAK Tea Admin Orders management page with glassmorphism. Aesthetic: operational data-heavy dark layout. Layout: filter bar + orders table + detail slide-out panel.

PAGE HEADER: Inter 28px weight 700 cream "Orders" + Inter 12px cream 50% "Total: 847" + date range filter dropdown (last 7d / 30d / custom) + "Export CSV" glass button right

STAT MINI-ROW (below header, 4 cards, horizontal flex):
Compact stat cards (glass surface, gold borders, 140px each, padding 12px):
- Today's Orders: blue accent · This Month: gold accent · Pending: orange accent · Avg Value: green accent
- Each: value Inter 16px weight 700 + label Inter 10px muted

FILTER TOOLBAR:
- Search input: glass surface, "Search by Order ID or customer phone..." placeholder
- Status filter pills: All, Confirmed, Processing, Shipped, Delivered, Cancelled — with count badges (gold)
- Channel filter: "All · WhatsApp · Web" — toggle buttons glass style (inactive: outline, active: filled gold)
- Date range picker: two glass inputs with calendar icons

ORDERS TABLE (glass card, full-width):
Columns: Order ID, Customer (name + phone + city), Items, Total, Status, Channel, Date, Actions
- Table header: gold accent background rgba(200,146,42,0.08), Inter 10px uppercase
- Each row: padding 12px 16px, border-bottom 1px rgba(200,146,42,0.08), hover: subtle glass glow
- Order ID: monospace Inter 13px cream weight 600 (WhatsApp orders bolded)
- Customer cell: name Inter 13px cream + phone Inter 11px muted below + city glass pill
- Items preview: product emoji + name + "and N more" if multiple, hover shows all
- Total: gold bold ₹[X]
- Status: glass pill badge (green/orange/purple/red per status)
- Channel: small pill (WhatsApp #25D366 or Web #2563EB) with icon left
- Date: Inter 11px cream 50%
- Actions: Phosphor Eye icon (hover glow) + dropdown menu (update status, send WhatsApp, cancel)

ORDER DETAIL SLIDE-IN PANEL (right, 560px, dark glass):
- Header: "Order #ORD-1082" Inter 20px weight 700 + gold status badge + X close
- Background: rgba(13,9,5,0.95) with blur, left border 2px gold

Content sections (separated by 1px rgba(200,146,42,0.08) dividers):
1. Customer Info: 32px gold avatar circle (initial) + name Inter 14px weight 600 + phone (clickable, Phosphor Phone icon) + city + email
2. Order Items: mini glass table (transparent), columns — product · variant · qty · line price
3. Order Summary: rows in glass bg — subtotal, discount (green if applied), shipping, GST, Total (bold gold, 18px)
4. Delivery Address: Phosphor MapPin icon (gold, 20px) + full address Inter 13px cream
5. Order Notes: italic Inter 12px cream 70% if present
6. Metadata: channel badge + "Ordered on [date]" + order time

ACTION BUTTONS (fixed bottom, padding 20px):
- "Confirm Order" solid gold button (if pending)
- Status dropdown: move to Processing / Shipped / Delivered (with radio selector)
- "Send WhatsApp Update" green button (#25D366) with Phosphor icon — pre-fills: "Hi [Name]! Your order #[ID] has been [status]"
- "Cancel Order" red glass button with confirm dialog
```

---

## PROMPT F — ADMIN CUSTOMERS PAGE

```
Build the BARAK Tea Admin Customers page with glass surfaces. Layout: search + table + customer profile slide-in panel.

PAGE HEADER: Inter 28px weight 700 cream "Customers" + Inter 12px cream 50% "847 total" + "Export" glass button right

SEARCH & FILTER:
- Search input: glass surface, "Search by name, phone, email..." placeholder, Phosphor MagnifyingGlass icon
- Tier filter pills: All, Gold, Silver, Bronze — colored pills (gold #C8922A, silver #9E8C78, bronze #8B4513)
  - Pill styling: glass surface with tier-color border (2px)
- Sort dropdown: "Most Orders · Most Spent · Recently Joined · Points Balance" (glass button style)

CUSTOMERS TABLE (glass card):
Columns: Customer, Contact, City, Orders, Total Spent, Loyalty Points, Tier, Joined, Actions
- Customer cell: 32px tier-colored avatar circle (gradient) + initial letter + name Inter 13px weight 600 cream + ID Inter 11px gold
- Contact: phone (Phosphor Phone icon link) + email (Phosphor At icon) Inter 12px cream 70%
- Orders: number Inter 13px gold bold
- Total Spent: ₹[X] gold bold
- Points: number (gold) + "pts" inter 11px muted
- Tier: colored glass pill badge (Gold/Silver/Bronze)
- Joined: date Inter 11px cream 50%
- Actions: Phosphor Eye icon (view profile) + Phosphor MessageCircle icon (WhatsApp) + three-dot menu (more options)

CUSTOMER PROFILE PANEL (slide-in right, 520px):
- Header: 64px tier-colored avatar circle + name Inter 20px weight 700 cream + tier glass badge
- Stats row (4 glass cards, horizontal): Total Orders · Total Spent · Loyalty Points · Referrals Made
  - Each stat: value Inter 16px weight 700 gold + label Inter 11px cream 50%

Tabs (sliding gold indicator):
1. Orders History — table of last 10 orders: Order ID · date · amount · status (glass pill)
2. Addresses — up to 3 saved addresses with "Default" badge, add address button
3. Loyalty Activity — vertical timeline of point earn/redeem events

Footer actions: "Send WhatsApp" green button + "View Full Profile" gold glass button
```

---

## PROMPT G — ADMIN INVENTORY PAGE

```
Build the BARAK Tea Admin Inventory page with glass surfaces. Aesthetic: operational warning-focused dark layout. Layout: overview grid + stock table + reorder alerts.

PAGE HEADER: Inter 28px weight 700 cream "Inventory" + Inter 12px cream 50% "Last updated: 5 min ago" + Phosphor RefreshCw icon button (24px, hover gold) right

INVENTORY OVERVIEW GRID (3 glass cards, horizontal flex):
- Total SKUs: Phosphor Package icon (gold, 32px) + number gold bold + "products" label
- Active Products: Phosphor CheckCircle icon (green, 32px) + number gold bold
- Low Stock Items: Phosphor AlertTriangle icon (orange, 32px) + number gold bold
- Each card: glass surface (rgba, gold border/glow), 16px radius, padding 20px

STOCK LEVEL TABLE (glass card):
Columns: Product, Category, Pack Variants, Total Stock, Threshold, Status, Actions
- Product cell: emoji (24px) + name Inter 13px weight 600 cream
- Pack variants (collapsible accordion per row): "250g: 45 · 500g: 32 · 1kg: 65" Inter 11px cream 70%
  - Chevron icon rotates on open
- Total stock: bold number (green >50, orange 10-50, red <10)
- Threshold: target number Inter 11px muted
- Status pill: "In Stock" green / "Low Stock" orange / "Out of Stock" red (glass style)
- Progress bar column: horizontal bar showing stock level (0-100%) with gold fill, red when under threshold
- Actions: Phosphor Pencil icon (edit inline stock) + Phosphor EyeOff icon (toggle visibility)

REORDER ALERT SECTION (glass card, orange border accent):
- Header: Phosphor AlertTriangle icon (orange, 24px) + "Reorder Alerts" Inter 20px weight 700 cream
- List of products below threshold:
  - Product name + emoji + current stock (red bold number) + threshold + "Notify Supplier" gold glass button
  - Sortable by urgency (most critical first)
```

---

## PROMPT H — ADMIN REVIEWS PAGE

```
Build the BARAK Tea Admin Reviews moderation page with glass surfaces. Layout: filter tabs + review cards grid.

PAGE HEADER: Inter 28px weight 700 cream "Reviews" + Phosphor MessageCircle icon + red badge "2 pending reviews"

FILTER TABS (sliding gold underline, glass surface bar):
- Pending (2 badge red) · Approved · Rejected · All
- Tab text: Inter 13px weight 500 cream, active: gold, inactive: muted
- Gold underline slides on active, 0.3s ease transition

REVIEWS GRID (2-column responsive, gap 16px):
Each review card: glass surface (rgba bg, blur 12px, gold border on pending), 16px radius, padding 16px, hover: glow shadow
- Header row: product name gold bold + star rating (gold stars, Phosphor Star 16px) + date Inter 11px cream 50% right
- Customer row: "Verified Buyer" green pill + customer name Inter 12px cream + city Inter 11px muted
- Headline: Inter 14px weight 600 cream (3-line clamp, expandable)
- Body text: Int 13px cream 80%, 4-line clamp with "Read More" link
- Footer: helpful icons (Phosphor ThumbsUp count) + helpful/unhelpful buttons (small, ghost style)

For PENDING reviews only:
- Action buttons: "Approve" green glass button (CheckCircle icon, Phosphor) + "Reject" red glass button (XCircle icon)
- Optional: "Flag" yellow button (for moderation review)

For APPROVED/REJECTED reviews:
- Status badge (green/red pill) + "Undo" or "Edit" link (small, muted)

EMPTY STATES: per-tab illustrations with messages (no reviews pending, etc.)
```

---

## PROMPT I — ADMIN COUPONS PAGE

```
Build the BARAK Tea Admin Coupons management page with glass surfaces. Layout: toolbar + coupons table + create coupon modal.

PAGE HEADER: Inter 28px weight 700 cream "Coupons & Promos" + "Create Coupon" gold button (Plus icon, Phosphor Percent) right

COUPONS TABLE (glass card):
Columns: Code, Type, Value, Min Order, Usage (used/limit), Valid Period, Status, Actions
- Code: monospace Inter 14px weight 700 cream + Phosphor Copy icon button (hover: "Copied!" tooltip)
- Type badge: "%" orange pill · "₹ Fixed" blue pill · "Shipping Free" green pill (glass style)
- Value: gold bold number
- Min Order: ₹[X] Inter 12px cream 50%
- Usage: progress bar showing used/limit with "87/200" text below bars
  - Bar track: rgba(200,146,42,0.15), fill: gold or red if near limit
- Valid period: "Apr 1 — Apr 30" Inter 11px cream 50%
- Status pill: "Active" green glow / "Expired" gray / "Upcoming" blue (glass style)
- Actions:
  - Phosphor Pencil icon (edit coupon)
  - Toggle switch (Active/Inactive) — gold when active
  - Phosphor Trash icon (delete, hover: red)

CREATE COUPON MODAL (centered, 480px, dark glass):
- Header: "Create New Coupon" Inter 20px weight 700 cream on rgba(13,9,5,0.95) + X close
- Form grid (single column):
  - Code input (glass) + "Auto-Generate" button (gold glass)
  - Discount Type radio: "% Off" · "Fixed ₹" · "Free Shipping" (radio buttons glass style)
  - Value input (appear based on type selected)
  - Min Order Amount input
  - Usage Limit input (max per coupon, e.g., 500)
  - Max Redemptions Per Customer input (e.g., 1)
  - Valid From date picker (glass style)
  - Valid Until date picker
  - Toggle: "Active on Creation" (gold)
  - Description textarea (optional)
- Buttons: "Create Coupon" solid gold button + "Cancel" ghost button
```

---

## PROMPT J — ADMIN WHOLESALE PAGE

```
Build the BARAK Tea Admin Wholesale Enquiries management page with glass surfaces.

PAGE HEADER: Inter 28px weight 700 cream "Wholesale Enquiries" + red badge "2 new" + total count

STATUS TABS (sliding gold indicator, glass bar):
- New (2 red) · Contacted · Converted · All
- Tab text Inter 13px, gold slide transition 0.3s ease

ENQUIRIES TABLE (glass card):
Columns: Business Name, Contact Person, Phone, City, Monthly Req (kg), Message Preview, Status, Date, Actions
- Business name: Inter 14px weight 600 cream + ID Inter 11px gold below
- Contact person: Inter 12px cream 70%
- Phone: clickable with Phosphor Phone icon (can dial)
- City: small tablet-style Inter 11px
- Monthly kg: gold bold number + "kg/mo"
- Message preview: Inter 12px cream 70% (3-line clamp)
- Status pills:
  - "New" blue glow
  - "Contacted" orange
  - "Converted" green
  - Glass styling, 20px radius
- Date: Inter 11px cream 50%
- Actions:
  - Phosphor Eye icon (view enquiry)
  - Phosphor MessageCircle icon (WhatsApp) — pre-fills message
  - Dropdown: Mark Contacted / Mark Converted / Archive / Delete

ENQUIRY DETAIL PANEL (slide-in right, 520px):
- Header: business name Inter 20px weight 700 cream + status badge + close button
- Info section:
  - Contact person name + phone (clickable) + email
  - City + region
  - Monthly kg requirement (bold gold)
- Message section: full text in italics Inter 13px cream, light background glass surface
- Status update:
  - Radio selector: New / Contacted / Converted
  - "Update Status" button (gold glass)
- WhatsApp CTA: "Send Message" green button with pre-filled: "Hi [ContactName], Thank you for your interest in BARAK Tea wholesale. We'd love to partner with you..."
- Internal notes textarea (admin-only, glass surface)
- Pricing info (auto-populated based on monthly kg tier): "Quote: ₹[X]/kg for [Tier] order"
```

---

## PROMPT K — ADMIN ANALYTICS PAGE

```
Build the BARAK Tea Admin Analytics page with glass surfaces and charts. Layout: metric overview + multiple chart rows.

PAGE HEADER: Inter 28px weight 700 cream "Analytics" + date range selector button (7d / 30d / 90d / Custom) + "Export Report" glass button right

ROW 1 — KPI CARDS (6-column grid, responsive, gap 12px):
Compact glass cards showing: Unique Visitors · WhatsApp Clicks · Conversion Rate (%) · New Customers · Repeat Rate (%) · Revenue/Day
- Each card: glass surface (rgba, gold border), 80px height, padding 12px 16px
- Value: Inter 18px weight 700 gold · Label: Inter 10px cream 50%
- Trend: small ↑ icon (green) for increases

ROW 2 — MAIN CHARTS (2-column, 60/40 split, responsive):
LEFT — "Revenue Over Time" Chart (60%, glass card):
- Recharts AreaChart
- Area fill: #C8922A at 20% opacity
- Stroke: gold #C8922A (smooth curve)
- X-axis: dates Inter 10px cream 50%
- Y-axis: ₹ amounts Inter 10px cream 50%
- Tooltip: dark glass bg, gold border, Inter 11px text
- Grid: rgba(200,146,42, 0.08) lines
- Animation: smooth on load, easing cubic-bezier(0.4,0,0.2,1)
- Legend below: "Revenue", hover: description

RIGHT — "Orders by Day of Week" Chart (40%, glass card):
- Recharts BarChart
- Bars: gold #C8922A, find peak day with brighter color
- Days on x-axis: Mon / Tue / Wed / Thu / Fri / Sat / Sun
- Responsive sizing

ROW 3 — FUNNEL + GEOGRAPHY (2-column, 50/50):
LEFT — "Conversion Funnel" (glass card):
- Horizontal funnel viz showing:
  - Product Views · Add to Cart · WhatsApp Click · Order Confirmed
  - Each step: bar width decreases, number of users + %, % drop-off muted below
  - Colors: gold gradient steps, last step green (conversion)
- Hover: tooltip showing exact counts

RIGHT — "Top Cities" (glass card):
- Ranked list with horizontal progress bars:
  - Silchar, Guwahati, Karimganj, Hailakandi, Kolkata
  - Each: city name Inter 13px + order count gold bold + revenue ₹X muted + progress bar (gold fill)

ROW 4 — PRODUCTS + REVIEWS (2-column, 50/50):
LEFT — "Top Products by Revenue" (glass card):
- Recharts horizontal BarChart
- Product names on y-axis, bars in gold
- Top 5 products by revenue
- Hover: shows exact value

RIGHT — "Review Ratings Distribution" (glass card):
- Recharts PieChart donut
- 5-star segment: #C8922A (gold)
- 4-star segment: #9E8C78 (muted)
- 3-star segment: #D4870A (orange)
- 2-star: #C0392B (red)
- 1-star: #C0392B (red, darker)
- Center text: average rating Inter 16px weight 700 gold
- Legend right: "5★ 40% · 4★ 35%..." with small colored dots
```

---

## PROMPT L — ADMIN SETTINGS PAGE

```
Build the BARAK Tea Admin Settings page with glass surfaces. Layout: 2-column — settings nav (left) + settings content (right).

LEFT SETTINGS NAV (sticky, 200px, glass card):
- Background: glass surface (rgba, blur 12px, gold border, 16px radius)
- Nav items with Phosphor icons: General · WhatsApp · Banners & Occasions · Delivery & Shipping · Loyalty Programme · SEO & Meta · Admin Users · Security
- Item styling:
  - Inactive: cream text, transparent bg, 4px transparent left border
  - Active: gold text, rgba(200,146,42,0.15) bg, 4px gold left border, rounded 8px right
  - Hover: cream → muted transition, 0.15s
- Icons: 20px Phosphor icons, color-coded per section (some gold, some muted)

RIGHT SETTINGS CONTENT (flex 1, responsive):

GENERAL TAB (glass card):
- Heading: Inter 20px weight 700 cream
- Input fields (glass style, rgba bg, gold border on focus):
  - Store Name input
  - Tagline input
  - Contact Email input
  - Primary Phone input
  - Address inputs (Street, City, State, Postal Code)
  - Business Hours (start time, end time inputs)
- "Save General Settings" gold button

WHATSAPP TAB (glass card):
- Primary WhatsApp number input (required, +91 prefix) + "Test Connection" button (small, green)
- Backup WhatsApp number input
- Message templates (textarea cards, glass surface):
  - Checkout confirmation message (editable)
  - Order update message template
  - Review request message template
- "Save WhatsApp Settings" gold button

BANNERS & OCCASIONS TAB (glass card):
- Active Banner selector dropdown (Eid / Bihu / Durga Puja / New Year / Custom / None)
- Banner preview card (glass surface, 480px wide, 200px height, rounded 12px) showing live preview
- Date range picker (from/until)
- Associated promo code input
- "Upload Custom Banner" file upload area (drag-and-drop, glass border dashed)
- "Preview on Website" link (new tab)

DELIVERY & SHIPPING TAB (glass card):
- Free delivery threshold input: ₹[X] (default 499)
- COD available: toggle switch (gold when active)
- Delivery partners checkboxes: "India Post" · "DTDC" · "Own Delivery" (glass checkboxes)
- Delivery area coverage textarea: "List of serviceable pincodes or cities"
- Delivery time estimate input: "2-3 business days"

LOYALTY PROGRAMME TAB (glass card):
- Points earned per ₹1 spent: number input (default 1)
- Redemption rate: "100 points = ₹[X]" input
- Max redemption per order: % input (default 50%)
- Tier thresholds:
  - Bronze tier: [X] points
  - Silver tier: [X] points
  - Gold tier: [X] points
- Points expiry: [X] months

All tabs with "Save Changes" gold button at bottom, success toast on save (green pill, "✓ Settings updated").

SEO & META TAB (glass card):
- Site title input
- Meta description textarea
- OG image upload
- Robots.txt textarea
- Schema.org structured data (JSON textarea)

ADMIN USERS TAB (glass card):
- List of admin users (table): Name · Email · Role · Last Login · Actions (edit, deactivate)
- "Add Admin User" button → modal with email + role selector (Owner/Manager/Editor)

SECURITY TAB (glass card):
- Change admin password fields (current + new + confirm)
- Two-factor authentication toggle (green if enabled)
- Login activity log (last 10 sessions): IP, device, time, location
- "Logout All Sessions" button (danger style, red)
- Session timeout input: [X] minutes
```

---

## ✅ FINAL TIPS FOR STITCH IMPLEMENTATION

1. **Run prompts in order** — Design System first, then Layout Shell, then individual pages. This ensures all child prompts inherit tokens and styling.

2. **Reference design tokens in every prompt** — Copy this snippet into each page prompt start:
   - "Use the BARAK Tea glassmorphism design system from Design System prompt. Implement glass surfaces using: rgba(250,243,224,0.08) with backdrop-filter blur(12px), borders rgba(200,146,42,0.12), shadowing 0 8px 32px rgba(0,0,0,0.3). Use 60-30-10 color rule: 60% dark #0D0905, 30% glass surfaces, 10% gold #C8922A + WhatsApp #25D366."

3. **Glassmorphism execution** — All surfaces use:
   - Background: rgba(250,243,224,0.08) minimum opacity
   - Backdrop filter: blur(12px) required for glass effect
   - Border: 1px rgba(200,146,42,0.12) with 0.12 opacity gold
   - Shadow: 0 8px 32px rgba(0,0,0,0.3) on default, 0 12px 48px on hover
   - Rounded corners: 16px for cards, 24px for pills, 12px for buttons

4. **Animation essentials**:
   - Scroll-triggered: fade-up from translateY 30-40px + opacity 0, stagger 0.06-0.12s per item
   - Parallax: 0.4-0.6× on hero images, preserve prefers-reduced-motion
   - Smooth Lenis scroll: initialize on page load, duration 1.2s, ease out-expo
   - Transitions: all 0.35s cubic-bezier(0.4,0,0.2,1) for premium feel
   - Hover: glow shadow on glass surfaces, scale 1.02-1.04 on interactive elements

5. **Color system (60-30-10 rule)**:
   - 60% → Dark background #0D0905
   - 30% → Glass surfaces rgba(250,243,224,0.08)
   - 10% → Gold #C8922A + WhatsApp #25D366
   - Always pair gold with glass, never use solid filled buttons except CTAs

6. **Typography hierarchy**:
   - Hero: Inter 80-120px weight 900, letter-spacing -0.04em, line-height 0.95
   - H1-H3: Inter weight 700, sizes 24-48px, letter-spacing -0.02em
   - Body: Inter 14-16px weight 400-500, line-height 1.8
   - All text on dark: cream #FAF3E0 for 100% contrast, muted #9E8C78 for 50% opacity secondary text
   - No serif fonts; Inter only (no Playfair Display changes)

7. **Component consistency**:
   - All buttons: glass (gold border + rgba bg) or solid gold (only for primary CTAs)
   - All inputs: glass surface with gold focus border
   - Form validation: red toast #C0392B for errors, green #2D7A4F for success
   - Cards: glass surface with gold subtle border, no solid filled cards
   - Pills/badges: glass surface with colored accent borders or fills

8. **Admin panel specifics**:
   - Sidebar: rgba(26,17,10,0.8) with blur 12px, right border gold 1px
   - Tables: glass rows with alternating rgba 0.05 / 0.12 backgrounds
   - Stat cards: include 80px circular gold glow top-right corner (blur 40px, 8% opacity)
   - Charts: use Recharts with dark glass tooltips, gold accents, no colored fills except gold

9. **WhatsApp integration**:
   - All WhatsApp buttons: solid #25D366 or glass with green accent
   - FAB (floating action button): 56px glass circle, pulse animation scale 1 → 1.12 → 1, 2s infinite
   - WhatsApp links: wa.me format with pre-filled messages

10. **Testing checklist**:
    - [ ] Run Design System prompt, verify color tokens exported in CSS variables
    - [ ] Run Layout Shell, confirm sidebar/navbar glass surfaces display correctly
    - [ ] Run each page prompt, verify scroll-triggered animations fire on scroll
    - [ ] Test hero parallax on mouse/scroll, ensure smooth 0.5× or 0.4× offset
    - [ ] Check glass blur effect: should see background through glass
    - [ ] Verify gold glow on hover: shadows 0.35s ease transition
    - [ ] Mobile responsive: test hamburger nav, single-column layouts
    - [ ] Accessibility: test focus states (gold glow), reduce motion respected, WCAG AA contrast
    - [ ] Performance: check animation frame rates (aim 60fps), scroll smoothness

---
*BARAK Tea · Stitch Design Prompts v2.0 (Glassmorphism Edition) · April 2026*
