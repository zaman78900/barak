---
name: Barak Premium
colors:
  surface: '#1b1105'
  surface-dim: '#1b1105'
  surface-bright: '#443727'
  surface-container-lowest: '#160c02'
  surface-container-low: '#241a0c'
  surface-container: '#291e0f'
  surface-container-high: '#342819'
  surface-container-highest: '#3f3323'
  on-surface: '#f5dfc8'
  on-surface-variant: '#d4c4b0'
  inverse-surface: '#f5dfc8'
  inverse-on-surface: '#3b2e1f'
  outline: '#9c8f7c'
  outline-variant: '#504536'
  surface-tint: '#f8bc51'
  primary: '#f8bc51'
  on-primary: '#422c00'
  primary-container: '#c8922a'
  on-primary-container: '#462f00'
  inverse-primary: '#7e5700'
  secondary: '#ccc6b4'
  on-secondary: '#333024'
  secondary-container: '#4a4739'
  on-secondary-container: '#bbb5a3'
  tertiary: '#cfc5bc'
  on-tertiary: '#352f29'
  tertiary-container: '#a39a92'
  on-tertiary-container: '#38322c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdeab'
  primary-fixed-dim: '#f8bc51'
  on-primary-fixed: '#281900'
  on-primary-fixed-variant: '#5f4100'
  secondary-fixed: '#e9e2d0'
  secondary-fixed-dim: '#ccc6b4'
  on-secondary-fixed: '#1e1c10'
  on-secondary-fixed-variant: '#4a4739'
  tertiary-fixed: '#ebe1d7'
  tertiary-fixed-dim: '#cfc5bc'
  on-tertiary-fixed: '#201b15'
  on-tertiary-fixed-variant: '#4c463f'
  background: '#1b1105'
  on-background: '#f5dfc8'
  surface-variant: '#3f3323'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 100px
    fontWeight: '800'
    lineHeight: '0.95'
    letterSpacing: -0.04em
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.8'
    letterSpacing: '0'
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  cta:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.01em
  accent-tagline:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 96px
  max-width: 1440px
  gutter: 24px
---

## Brand & Style
This design system captures the essence of the Barak Valley’s tea heritage through a lens of modern luxury. The brand personality is prestigious, mysterious, and deeply rooted in quality. It targets an epicurean audience that values origin stories and artisanal excellence.

The aesthetic merges **Dark Luxury** with **Glassmorphism**. By utilizing deep, warm near-blacks and translucent frosted layers, the UI evokes the feeling of a high-end lounge or a boutique tea tasting room at dusk. The interface should feel atmospheric, using depth and light to guide the user’s eye toward the "liquid gold" of the tea itself.

## Colors
The color palette follows a strict 60-30-10 distribution to maintain a premium dark atmosphere. The base is a warm, near-black that prevents the design from feeling cold. Cream tones are used for the "glass" surfaces and primary typography to ensure high legibility and a soft, organic contrast. 

Gold serves as the singular accent color, reserved for calls to action, active states, and brand-critical highlights. A specific "Gold Glow" token is used to simulate light passing through tea or reflecting off metallic finishes.

## Typography
This design system relies exclusively on **Inter** to maintain a systematic, modern editorial feel without the distraction of script fonts. Hierarchy is established through extreme scale—specifically the Display/Hero headlines which use tight leading and aggressive tracking to create a bold, "poster-like" impact.

Body text utilizes generous line height (1.8) to ensure maximum readability against dark, translucent backgrounds. All labels and taglines use increased letter-spacing to emphasize the premium, spaced-out luxury aesthetic.

## Layout & Spacing
The layout uses a **Fixed Grid** approach for content containers, centered within a 1440px max-width boundary. Hero sections and background glass panels are allowed to bleed full-width to enhance the immersive, atmospheric quality.

The spacing rhythm is built on an incremental scale that favors breathing room. Large vertical gaps (96px+) are encouraged between major sections to mimic the sparse, intentional layout of a luxury editorial. Use a 12-column grid for complex layouts, with 24px gutters to allow the glass borders sufficient room to breathe.

## Elevation & Depth
Depth is achieved through the physical properties of glass rather than traditional shadow stacking. Every surface should utilize `backdrop-filter: blur(12px)` to create a sense of translucency.

A subtle 1px border with a gold tint acts as the "edge" of the glass, catching light. Box shadows are deep and highly diffused (32px to 48px blur) with low opacity to simulate an ambient light environment. Interaction is signaled by an "inner glow" and a slight increase in shadow spread, suggesting the element is lifting closer to the user.

## Shapes
The shape language is refined and approachable. A standard 16px radius is applied to major cards and glass containers. For smaller interactive elements like pills or tags, a more aggressive 24px radius is used to create a distinct "pod" look. Buttons maintain a crisp 12px radius to feel structural and precise. 

Images must adhere to strict aspect ratios: 1:1 for product listings to emphasize symmetry, 16:9 for immersive hero storytelling, and 4:3 for editorial content.

## Components
### Buttons
- **Glass Button:** Transparent background with `blur(12px)`, a `--color-glass-border`, and a subtle `--color-gold-glow`.
- **Solid Gold:** High-contrast CTA using `--color-gold` background and `--color-bg-dark` text.
- **WhatsApp:** A specialized green glass variant using `--color-whatsapp` with frosted properties for direct support.

### Cards & Inputs
- **Cards:** Use `--color-glass` background and `--glass-shadow`. No solid borders; only the 1px tinted border.
- **Inputs:** Darker background (`--color-brand-dark`) with an 8px radius and subtle cream placeholder text. Focus states should trigger a `--color-gold` border glow.

### Interactive Elements
- **Icons:** Use Phosphor Icons (Thin or Light weight) at 24px.
- **Badges/Pills:** 24px roundedness, using `--color-brand-dark` with `--color-gold` text for premium categorization.
- **Transitions:** Every interaction must use a 0.35s cubic-bezier. Scroll-triggered animations should gently fade up as the user descends the page.