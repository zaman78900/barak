# BARAK Tea — Award-Winning Creative Homepage Prompt (v2)

Paste this whole brief into your AI builder (v0, Lovable, Cursor, Framer AI) or hand to a creative dev. It supersedes the previous version — this one is built for an **Awwwards-style, immersive, single-flow experience**, not a stacked-template homepage.

---

## ROLE
You are an award-winning interactive web designer/developer (Awwwards "Site of the Day" caliber — think studios like Active Theory, Resn, or Locomotive.ca) building the homepage for **BARAK Tea**, a luxury single-origin CTC tea brand from **Barak Valley, Assam, India**. Brief: minimal words, maximum atmosphere, cinematic motion, and a homepage that feels like one continuous living scene — not a series of stacked sections.

## NON-NEGOTIABLE CREATIVE DIRECTION
1. **No visible "section breaks."** No hard horizontal lines, no abrupt background-color blocks stacking on top of each other. Use scroll-linked transitions (color bleed, morphing shapes, parallax depth, blur/dissolve crossfades) so each "chapter" emerges out of the last. Think of it as one continuous canvas the user scrolls *through*, not *down* a list of cards.
2. **Persistent falling tea-leaf particles across the ENTIRE page.** A fixed/sticky canvas (WebGL via Three.js/OGL, or a lightweight canvas2d/particles.js layer) renders tea leaves drifting and falling continuously behind/around all content, from hero to footer — never resets, never confined to one section. Leaves should have natural physics: slight rotation, varied size/opacity/speed, slow horizontal drift, occasional gusts. Must stay performant (cap particle count, use `will-change`/GPU transforms, pause when tab is hidden).
3. **Custom creative cursor.** Replace the default cursor with a branded interactive cursor:
   - Default state: a small dot or tea-leaf glyph with a soft trailing glow
   - On hover over links/buttons: cursor morphs (e.g., expands into a circle with "View"/"Shop"/"Explore" text inside, or magnetic pull effect where the button itself stretches slightly toward the cursor)
   - On hover over imagery: cursor could reveal a drag/expand icon
   - Subtle lag/easing (cursor follows pointer with spring physics, not 1:1) for a premium "weighted" feel
   - Must gracefully disable on touch devices
4. **Motion-first storytelling, minimal text.** Every section should communicate primarily through motion, imagery, and 3–7 word phrases — not paragraphs. Big confident type, animated in (split-text reveals, character/word stagger, mask-wipes), not static blocks.
5. **Scroll-driven choreography.** Use scroll-linked animation (GSAP ScrollTrigger, Framer Motion `useScroll`, or Lenis for smooth-scroll + GSAP) so elements scrub, scale, fade, and reposition based on scroll position/velocity — not just simple fade-on-enter.
6. **No product photo in the hero** (carried over from v1 — still applies). Hero should be atmospheric: valley mist footage/WebGL gradient/tea-pour macro — paired with the falling-leaf particle layer and animated typography.

---

## SITE FEEL REFERENCES (for tone, not to copy)
Describe the target feel as: a fusion of a premium tea garden documentary, a luxury fragrance brand site, and a generative-art landing page — moody, tactile, slow-breathing motion, warm cinematic grading, never sterile or "SaaS dashboard" feeling.

---

## EXPERIENCE FLOW (continuous canvas, not "sections" — but logically these beats must exist)

**Beat 1 — Arrival / Hero**
- Full-viewport atmospheric scene (video loop or WebGL gradient/fog shader) + falling leaves layer active immediately
- Animated wordmark/headline reveal (mask-wipe or letter-stagger), e.g. *"From the Mist of Barak Valley"* — short, no subhead paragraph, maybe one fragment line
- Scroll-hint as a subtle animated cue (not a static arrow — animate it breathing/pulsing)

**Beat 2 — Origin Reveal**
- As user scrolls, hero imagery parallax-recedes/zooms, color grade shifts (dark → warm gold), and a short origin line fades in: e.g. *"Hand-plucked. Single estate. Barak Valley, Assam."*
- Leaves continue falling, now perhaps catching a warm light/glow as palette shifts

**Beat 3 — The Process (CTC craft)**
- Horizontal or pinned scroll moment showing the CTC process as 3 quick animated motion-graphics beats (Crush → Tear → Curl) with single-word labels, not paragraphs
- This doubles as an SEO content anchor (see SEO section)

**Beat 4 — The Valley (Brand Story)**
- Large cinematic parallax imagery of the gardens/river/mist; story told in 2–3 short animated lines, not a block of text
- Optional: subtle scroll-scrubbed video (video frame tied to scroll position) for a premium "directed film" feel

**Beat 5 — Shop / Product Reveal**
- This is the one place product imagery appears. Make the reveal itself the moment of delight: products animate in with 3D tilt-on-cursor-move, or scale up from a leaf-dissolve transition
- Minimal copy per product — name, one descriptor, price, "Shop"

**Beat 6 — Proof / Trust**
- Animated counters/marquee of stats or a slow auto-scrolling testimonial/press marquee — keep kinetic, not a static grid

**Beat 7 — Journal / Culture teaser**
- 2–3 article cards with hover-triggered image reveals (image hidden until cursor hover, then expands) — supports SEO + keeps motion-first feel

**Beat 8 — Close / Newsletter + Footer**
- Footer should still feel designed, not a dead zone: leaves still falling, large animated closing line, minimal links, social icons with hover-morph cursor

---

## VISUAL & TECHNICAL DIRECTION
- **Typography:** One refined display serif for big animated headlines (e.g. Canela/Playfair-style) + one clean grotesk for the sparse supporting labels (Inter/Söhne). Type is a primary visual element here — treat headlines like hero graphics, animate them confidently.
- **Palette:** Anchor on #0D0905 (near-black/espresso), warm ivory (#F5EFE6), tea-leaf green, brass/gold accent — let the palette itself shift subtly as the user scrolls through beats (cool mist → warm gold → deep green) to reinforce the "no hard section breaks" rule.
- **Smooth scroll:** Implement Lenis (or similar) for inertia-based smooth scrolling site-wide — this alone makes a site feel "premium" instantly.
- **Performance budget:** Despite heavy motion, target Lighthouse performance >85: lazy-load below-fold media, use compressed WebM/AVIF, reduce particle count on mobile, respect `prefers-reduced-motion` (provide a calmer fallback — leaves fade-only, no parallax, standard cursor).
- **Responsiveness:** On mobile, replace cursor effects with tap-feedback micro-animations; keep leaf particles but reduce density; collapse pinned/horizontal scroll moments into simple vertical reveals.

---

## ON-PAGE SEO REQUIREMENTS (do not sacrifice for motion)

Even though the page is visually a continuous canvas, the underlying HTML must remain semantically structured for crawlers — motion is the *presentation* layer, not a replacement for proper markup.

**Primary keywords to weave naturally into real (not just decorative) text, alt tags, and metadata:**
- Barak Tea / BARAK Tea
- Assam Tea
- Barak Valley Tea
- CTC Tea / Premium CTC Tea
- Buy Assam Tea Online
- Single Origin Assam Tea

**Required implementation:**
- **Title tag:** `BARAK Tea | Premium Assam CTC Tea from Barak Valley`
- **Meta description (150–160 chars):** include "Barak Valley," "Assam tea," value prop, CTA
- **Real, crawlable H1–H3 structure** underneath the animated text — even if visually revealed via mask/stagger animation, the actual text content (not just images of text) must exist in the DOM at full value, not injected only after scroll/JS in a way that blocks indexing — use SSR/SSG (Next.js) so content is present on initial load
- **Descriptive alt text** on every image/video poster frame (e.g., "Hand-plucking tea leaves in a Barak Valley tea garden, Assam")
- **Descriptive file/URL naming:** `/shop/assam-ctc-tea`, `barak-valley-tea-garden.webp`
- **JSON-LD schema:** `Organization`, `Product`, `BreadcrumbList`, and `Place`/`LocalBusiness` if a physical estate location exists
- **Core Web Vitals discipline:** since this is animation-heavy, be strict about LCP (<2.5s) — preload hero media, defer non-critical WebGL/particle scripts until after first paint
- **Journal/content strategy:** plan articles targeting "what is CTC tea," "Assam tea vs Darjeeling," "how to brew Assam CTC tea," "Barak Valley tea history" to build topical authority for "Assam Tea"
- **robots.txt / sitemap.xml / canonical tags** configured correctly so the JS-heavy experience doesn't accidentally block indexing (test with Google's URL Inspection / Rich Results tool post-launch)

---

## SUGGESTED TECH STACK
- **Framework:** Next.js (SSR/SSG for SEO-safe content)
- **Animation:** GSAP + ScrollTrigger (scroll choreography), Framer Motion (component-level transitions), Lenis (smooth scroll)
- **Particles/leaves:** Three.js or OGL for a lightweight WebGL particle system, or `tsparticles` if a simpler 2D canvas approach is preferred for performance
- **Custom cursor:** plain React state + CSS transforms with spring easing (Framer Motion's `useSpring`), disabled on touch via media query detection

---

## DELIVERABLE
A homepage that:
1. Has zero visible hard section divisions — one continuous, color-shifting, parallax-driven scroll experience
2. Has tea leaves falling persistently across the full page background, from hero to footer
3. Has a custom, magnetic, branded cursor with hover-state morphing
4. Uses minimal copy — motion and imagery carry the storytelling
5. Has no product photography in the hero (product reveal happens later, as a designed "delight" moment)
6. Is fully SEO-sound underneath the motion (semantic HTML, SSR content, schema, fast LCP)
7. Feels like a $50K+ Awwwards-caliber site — not a stacked, generic template

---

### Build order recommendation
1. Set up Next.js + Lenis smooth scroll skeleton with real semantic content (SEO-safe) first
2. Layer in the persistent falling-leaf particle background
3. Build the custom cursor system
4. Then choreograph scroll-linked transitions beat by beat (hero → origin → process → story → shop → proof → journal → footer)
5. Performance + accessibility pass last (reduced-motion fallback, mobile simplification, Lighthouse audit)
