---
name: Heritage Editorial
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#574240'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#8a716f'
  outline-variant: '#ddc0bd'
  surface-tint: '#a43b35'
  primary: '#490003'
  on-primary: '#ffffff'
  primary-container: '#6b1111'
  on-primary-container: '#f5786e'
  inverse-primary: '#ffb4ac'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#1f201e'
  on-tertiary: '#ffffff'
  tertiary-container: '#343533'
  on-tertiary-container: '#9d9d9a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#842420'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e3e2df'
  tertiary-fixed-dim: '#c7c7c3'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#464744'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is anchored in **Modern Indian Luxury**. It balances the opulence of traditional Indian craftsmanship with a restrained, editorial minimalism. The target audience is discerning, high-net-worth individuals seeking bespoke artistry. 

The visual language draws from **Minimalism** and **Modern Corporate** styles, utilizing generous whitespace to allow product photography and high-contrast typography to breathe. It avoids traditional "clutter" often associated with festive design, opting instead for structural elegance, precise alignment, and a tactile sense of paper and gold-leaf. The emotional response should be one of quiet confidence, exclusivity, and cultural resonance.

## Colors

The palette is a sophisticated interplay of warmth and depth:
- **Base (Warm Ivory - #FCFBF7):** Used for the primary background to mimic premium cotton-pressed paper.
- **Accent (Deep Burgundy - #6B1111):** Used for primary calls to action, high-level branding, and critical highlights.
- **Gilding (Antique Gold - #C5A059):** Reserved for decorative borders, active states, and refined iconography.
- **Type (Charcoal - #2D2D2D):** Ensures high legibility and a modern edge against the warm background.
- **Surface (Subtle Beige - #F5F2EA):** Used for secondary containers, input backgrounds, and subtle sectioning.

## Typography

This design system utilizes a high-contrast typographic pairing to reinforce the luxury editorial feel. 

- **Playfair Display** is used for all headlines and display text. Its high-contrast serifs evoke the feeling of ink on paper. Use "Italic" styles sparingly for quotes or emphasis to add a poetic touch.
- **Inter** is the functional workhorse. It provides a clean, neutral balance to the expressive serif, ensuring that interface elements and long-form body copy remain legible and modern. 
- **Labels** should always utilize the uppercase transformation with increased letter spacing to create a "gallery-tag" aesthetic.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain an editorial "page" feel, transitioning to a fluid model on smaller screens.

- **Grid:** A 12-column system is used. Content should often be offset (e.g., spanning columns 3 through 10) to create asymmetric, high-end compositions.
- **Rhythm:** An 8px base unit drives all spacing. 
- **Whitespace:** Use generous vertical gaps (`section-gap`) between content blocks to prevent a cluttered "marketplace" feel.
- **Mobile:** Margins tighten significantly, and display typography scales down to maintain balance. Elements should stack vertically with a focus on immersive imagery.

## Elevation & Depth

This design system prioritizes flat, tactile surfaces over heavy shadows. Depth is conveyed through:

- **Tonal Layering:** The primary background is the Ivory base. Interactive surfaces or card elements use the Subtle Beige (#F5F2EA) to create a subtle lift.
- **Refined Outlines:** Instead of shadows, use 1px solid borders in Antique Gold (#C5A059) or Deep Burgundy (#6B1111) at low opacities (20-40%) to define containers.
- **Ambient Depth:** When shadows are necessary for functional elevation (e.g., a modal or floating navigation), use a very soft, highly diffused shadow: `0 12px 32px rgba(45, 45, 45, 0.08)`.

## Shapes

To maintain a sophisticated and architectural aesthetic, the design system utilizes **Sharp** edges (`0px` radius). 

This sharp-cornered approach mimics the edges of high-quality cardstock and invitation suites. It projects a sense of precision and heritage. Avoid rounded corners on buttons, inputs, and cards. The only exception is for circular icon buttons or profile avatars.

## Components

- **Buttons:** Primary buttons are solid Deep Burgundy (#6B1111) with white or ivory text, sharp corners, and a 1px Gold (#C5A059) hover border. Secondary buttons are outlined in 1px Gold with Ivory background.
- **Input Fields:** Use a "minimalist" approach—only a bottom border (1px Charcoal at 30% opacity) that turns to 1px Gold on focus. Labels use the `label-sm` style positioned above the line.
- **Cards:** Product cards are borderless with a Subtle Beige background and sharp corners. Imagery should have a slight inner 1px border to simulate a "tipped-in" photo.
- **Navigation:** Top-tier navigation should be centered, utilizing `label-md` for links, with a gold underline appearing on hover.
- **Chips/Tags:** Used for categories (e.g., "Handmade Paper"). These should be 1px Gold outlines with `label-sm` typography.
- **Dividers:** Use very thin (0.5px) horizontal lines in Antique Gold to separate content sections, occasionally featuring a small centered brand icon.