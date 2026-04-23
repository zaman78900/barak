---
name: Liquid Amber Aesthetic
colors:
  surface: '#17130c'
  surface-dim: '#17130c'
  surface-bright: '#3e3830'
  surface-container-lowest: '#120e07'
  surface-container-low: '#201b14'
  surface-container: '#241f17'
  surface-container-high: '#2f2921'
  surface-container-highest: '#3a342c'
  on-surface: '#ece1d5'
  on-surface-variant: '#d4c4b0'
  inverse-surface: '#ece1d5'
  inverse-on-surface: '#353027'
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
  tertiary: '#9dcaff'
  on-tertiary: '#003257'
  tertiary-container: '#62a0e0'
  on-tertiary-container: '#00355c'
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
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#9dcaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#17130c'
  on-background: '#ece1d5'
  surface-variant: '#3a342c'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  grid-gutter: 24px
  side-margin: 40px
---

## Brand & Style

This design system establishes a high-end, atmospheric environment for managing a luxury tea brand. The personality is sophisticated, artisanal, and serene, mirroring the ritualistic nature of tea preparation. 

The visual direction utilizes **Glassmorphism** infused with **Minimalism**. By layering translucent surfaces over a deep, warm-toned foundation, the interface achieves a sense of physical depth and premium craftsmanship. Every interaction should feel intentional and smooth, evoking the quiet luxury of a private tasting room. The contrast between the near-black background and the gold-tinted glass elements creates a "glow from within" effect that prioritizes focus and visual comfort.

## Colors

The palette is rooted in an earthen, "near-black" warmth to avoid the sterility of pure black. 

- **Primary Gold:** Used for key actions, focus states, and essential branding elements. It represents the quality of the product.
- **Glass & Borders:** The glass color is a highly desaturated cream at low opacity, providing a neutral substrate that catches the "light" from the gold borders.
- **Typography:** Cream text ensures high legibility without the harshness of pure white, while the muted secondary text provides hierarchy and reduces visual noise in administrative data tables.

## Typography

The typography uses **Inter** to maintain a systematic and functional feel amidst the decorative glass elements. The hierarchy is strictly enforced through weight and color (Cream vs. Muted). 

Headlines should be tight and authoritative, while body text uses a generous line height to ensure readability against the blurred glass backgrounds. Labels use an uppercase style with increased letter spacing to provide a distinct structural contrast to numerical data and input values.

## Layout & Spacing

The design system employs a **Fluid Grid** model with high-margin padding to preserve the "premium" feel. A 12-column system is used for dashboard layouts, with a 24px gutter to allow the glass borders of adjacent cards to breathe.

Spacing follows an 8px base unit. Larger components like data tables and product grids should utilize `xl` (40px) side margins to create a focused, centered content column that feels curated rather than crowded.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** rather than traditional elevation levels. 

1.  **Base Layer:** The `#0D0905` background remains static.
2.  **Surface Layer:** Large container areas (sidebars, main content areas) use `#1A110A` with no blur to ground the application.
3.  **Glass Layer:** Interactive cards and modals use `rgba(250, 243, 224, 0.08)` with a **12px backdrop-blur**. 
4.  **Shadows:** Shadows are deep and soft (0px 20px 40px rgba(0,0,0,0.6)), used exclusively on floating glass elements to simulate they are hovering above the warm surface.

## Shapes

The shape language is consistently **Rounded**. A base radius of 8px is applied to functional elements like inputs and buttons to feel precise. Larger containers like cards use a 12px radius (`rounded-lg`) to soften the overall appearance of the dashboard. Badges and chips deviate from this to use a fully circular (pill) shape, providing a clear visual distinction between structural containers and status indicators.

## Components

### Buttons
- **Primary:** Glass background with a 1px `Primary Gold` border. Text is `Primary Gold`. On hover, the border and text transition to `Hover Gold` with a subtle outer glow.
- **Secondary:** Transparent background with a `Muted` text color and a thin `#9E8C78` border at 30% opacity.

### Cards
- **Construction:** `rgba(26, 17, 10, 0.7)` background with a **12px blur**. 
- **Borders:** A 1px gold-tinted border (`rgba(200, 146, 42, 0.15)`).
- **Usage:** Essential for grouping tea inventory data, sales metrics, and customer profiles.

### Inputs & Fields
- **Style:** 8px radius, glass background with 8px blur. 
- **Focus State:** The border transitions from the subtle gold-tint to a solid `Primary Gold`, accompanied by a 4px soft outer glow in the same hue.

### Badges & Chips
- **Style:** Pill-shaped with a low-opacity background of the status color (e.g., Green for "In Stock").
- **Effect:** Include a `box-shadow` matching the status color with a 10px blur to create a "neon glow" effect against the dark surface.

### Transitions
All interactive states (hover, focus, active) must use a `0.35s cubic-bezier(0.4, 0, 0.2, 1)` transition for property changes in color, opacity, and transform to maintain a high-end, fluid feel.