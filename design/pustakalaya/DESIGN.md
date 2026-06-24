---
name: Pustakalaya
colors:
  surface: '#fff9ed'
  surface-dim: '#e2dabf'
  surface-bright: '#fff9ed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf3d8'
  surface-container: '#f7eed2'
  surface-container-high: '#f1e8cd'
  surface-container-highest: '#ebe2c8'
  on-surface: '#1f1c0b'
  on-surface-variant: '#434843'
  inverse-surface: '#35301e'
  inverse-on-surface: '#faf0d5'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#a33b39'
  on-secondary: '#ffffff'
  secondary-container: '#fe807a'
  on-secondary-container: '#74181a'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ae'
  on-secondary-fixed: '#410005'
  on-secondary-fixed-variant: '#842424'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fff9ed'
  on-background: '#1f1c0b'
  surface-variant: '#ebe2c8'
typography:
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Literata
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Literata
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is rooted in the "Dark Academia" and "Enchanted Library" aesthetic. It evokes the feeling of wandering through an ancient, dust-mote-filled library in the English countryside. The target audience includes scholars, bibliophiles, and dreamers who value the weight of history and the spark of magic.

The design style is **Tactile & Editorial**. It avoids the sterile flatness of modern SaaS, instead embracing organic textures, "hand-carved" UI elements, and a sense of permanence. Every interaction should feel like turning a heavy vellum page or unlatching a brass cabinet. The emotional response is one of warmth, intellectual curiosity, and quiet wonder.

## Colors
The palette is inspired by natural materials and royal pigments:
- **Primary (Forest Green):** Used for primary navigation and deep structural elements. Represents the lush countryside and growth.
- **Secondary (Burgundy):** Used for accents, notifications, and "wax seal" interactive elements. Evokes the feeling of old leather bindings.
- **Tertiary (Gold):** Reserved for highlights, borders, and premium interactions. It acts as the "magical" thread throughout the UI.
- **Neutral (Parchment):** The foundation. This replaces standard white to provide a warm, low-eye-strain reading environment that feels like aged paper.
- **Ink:** A deep off-black (#2C2C2C) is used for text to maintain high legibility without the harshness of pure black.

## Typography
Typography is the cornerstone of this design system. We use **EB Garamond** for all headlines to provide a literary, historical authority. Its classic proportions feel timeless.

For body text and functional labels, we use **Literata**. Designed specifically for long-form digital reading, it maintains the serif charm while offering superior legibility on screens. 

- Use **Italics** for metadata (e.g., book genres, author names) to emphasize the "archival" feel.
- Use **Small Caps** for labels and navigation items to mimic the typography found on the spines of old books.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop, creating a focused, "manuscript" feel. On mobile, it transitions to a single-column flow with generous margins to prevent the interface from feeling cluttered.

- **Margins:** Large margins are encouraged to create a sense of breath and prestige, similar to the wide margins of a luxury hardback book.
- **Rhythm:** We use an 8px base unit. Component spacing should feel deliberate and airy.
- **Alignment:** Center-aligned layouts are preferred for landing pages and "magical" moments, while left-aligned grids are used for density-heavy library catalogs.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layers** and **Subtle Textures** rather than heavy shadows.

- **The Base:** The bottom layer is a subtle parchment texture.
- **Surfaces:** Elements that sit "above" the base use a slightly lighter parchment tone and a 1px solid border in a faded gold or forest green.
- **Shadows:** Use very soft, long ambient shadows (e.g., `blur: 20px, opacity: 0.05, color: #1B3022`) to suggest the object is resting on the page.
- **Glassmorphism:** Use sparingly for "enchanted" overlays (like a floating search bar), with a high backdrop blur and a slight golden tint.

## Shapes
Shapes are "soft-hewn." We avoid perfect circles and sharp 90-degree corners.

- **Standard Elements:** Use `rounded-md` (0.5rem) to mimic the corners of a leather-bound book.
- **Cards/Containers:** Use `rounded-lg` (1rem) for a more welcoming, organic feel.
- **Borders:** Implement "ornate" borders for special sections—this can be a 1px double-line border or a subtle corner flourish in Tertiary Gold.

## Components
- **Buttons:** Primary buttons are Burgundy (#630A10) with white text. They should have a subtle inner-shadow to look pressed/embossed. Secondary buttons use a gold border and "Parchment" fill.
- **Wax Seals:** A special component for "Confirm" or "Approve" actions. These are circular, burgundy, and feature a gold icon in the center.
- **Input Fields:** Styled like traditional ledger entries. A simple bottom border in Forest Green, with the label floating in an italicized serif font above. Focus state adds a subtle golden glow.
- **Cards:** Library "Catalog Cards." These use a light parchment background, a 1px Forest Green border, and a subtle "texture" overlay that looks like fiber-pressed paper.
- **Lists:** Items are separated by subtle "dotted" dividers, reminiscent of old catalog indexes.
- **Navigation:** Top navigation should use "Small Caps" Literata. The active state is indicated by a small golden dot or a gold underline that looks like a hand-drawn stroke.
- **Transitions:** All hover states and page transitions must use `cubic-bezier(0.4, 0, 0.2, 1)` with a 400ms duration to feel "graceful" and "intentional."