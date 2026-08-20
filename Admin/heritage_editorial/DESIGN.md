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
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#574240'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
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
  tertiary: '#00213e'
  on-tertiary: '#ffffff'
  tertiary-container: '#003761'
  on-tertiary-container: '#7aa1d1'
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
  tertiary-fixed: '#d2e4ff'
  tertiary-fixed-dim: '#a2c9fc'
  on-tertiary-fixed: '#001d36'
  on-tertiary-fixed-variant: '#1d4974'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e5e2e1'
  surface-subtle: '#F3F1F0'
  border-muted: '#D9D2CE'
  status-success: '#727559'
  status-info: '#373B4D'
  status-warning: '#634522'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style
The design system for this CMS/Dashboard balances the gravitas of a traditional design studio with the efficiency of a modern administrative tool. The personality is **Professional, Premium, and Reliable**, evoking the feel of a high-end editorial desk.

The visual style is a hybrid of **Minimalism** and **Corporate Modern**. It uses expansive whitespace and a structured grid to manage complex data, while utilizing "Heritage" elements—high-contrast typography and a rich burgundy palette—to distinguish it from generic SaaS products. The interface prioritizes clarity and focus, ensuring that administrative tasks feel like a curated experience rather than a technical chore.

## Colors
This design system utilizes a "Warm Editorial" palette. The **Deep Burgundy** is used sparingly for primary actions, branding, and high-level navigation to maintain its impact without overwhelming the user. 

- **Primary:** Deep Burgundy (#6B1111) for key interactions and brand identity.
- **Secondary/Accent:** Muted Antique Gold (#C5A059) for highlights and interactive focus states.
- **Backgrounds:** The interface avoids pure white, using a Warm Ivory (#FCF9F8) to reduce eye strain and provide a more premium, paper-like feel. 
- **Surfaces:** Use the Very Light Warm Gray (#F3F1F0) for sidebar backgrounds, card containers, and table headers.
- **Typography:** Dark Charcoal (#222222) ensures maximum legibility and high contrast against the off-white backgrounds.

## Typography
The typography strategy employs a high-contrast pairing: **Playfair Display** for high-level branding and major page titles, and **Inter** for all functional UI elements.

- **Editorial Touch:** Use Playfair Display only for page headers and the "Studio Shunya" logo.
- **Utility:** Inter is used for all data, forms, and navigation to ensure clarity at small sizes.
- **Hierarchy:** Use the `label-sm` style with uppercase transformations and slight letter spacing for sidebar categories and table headers to create a "Table of Contents" aesthetic.

## Layout & Spacing
The layout follows a **Fixed Grid** model for the main content area, anchored by a persistent left sidebar.

- **Sidebar:** A fixed 280px width, utilizing the `surface-subtle` color to separate navigation from the workspace.
- **Grid:** A 12-column grid system with 24px gutters.
- **Rhythm:** An 8px linear scale (4, 8, 16, 24, 32, 48, 64) is used for all padding and margins. 
- **Responsive Behavior:** On tablet, the sidebar collapses into a 64px icon-only rail. On mobile, the sidebar becomes a hidden drawer, and margins reduce to 16px to maximize data visibility.

## Elevation & Depth
In alignment with the "Heritage Editorial" style, the design system avoids heavy shadows, instead using **Tonal Layers** and **Low-Contrast Outlines**.

- **Cards & Containers:** Use a thin 1px border (#D9D2CE) rather than a shadow for most containers.
- **Active Elevation:** Only use a shadow for floating elements like dropdown menus or modals. Use an "Ambient Shadow" (0px 4px 20px rgba(34, 34, 34, 0.08)) to maintain a soft, premium feel.
- **Sidebar Depth:** The sidebar is visually distinguished through color (the Light Warm Gray) rather than elevation, creating a flat, sophisticated layout.

## Shapes
This design system uses **Soft** geometry. The 4px (0.25rem) base radius provides a subtle modern touch without feeling overly "app-like" or "bubbly."

- **Standard Elements:** Buttons, input fields, and status badges use the 4px base radius.
- **Large Containers:** Content cards and image uploaders use the `rounded-lg` (8px) radius to softly frame content.
- **Status Badges:** Status badges use a `rounded-xl` (12px) or full pill shape to differentiate them from interactive buttons.

## Components
- **Sidebar Navigation:** Use the Deep Burgundy for the active state indicator (a vertical 4px bar on the left edge). Icons should be thin-stroke (2pt) for a refined look.
- **Statistic Cards:** Large Playfair Display numbers paired with Inter `label-sm` titles. Include a subtle sparkline in the Antique Gold color.
- **Data Tables:** Use the `label-sm` style for headers with a `surface-subtle` background. Rows should have a 1px bottom border (#D9D2CE). Status badges use muted background tints of the brand colors (e.g., a 10% opacity Burgundy for "Pending").
- **Polished Forms:** Labels are always positioned above the input field. Use a 1px Dark Charcoal border for active states. Implement "Progressive Disclosure" by using collapsible sections for advanced settings.
- **Drag-and-Drop Uploader:** Use a dashed border in Antique Gold. When a file is hovered, the background should transition to a 5% Burgundy tint.
- **Buttons:** Primary buttons are solid Deep Burgundy with white text. Secondary buttons are outlined in Dark Charcoal. Tertiary buttons use the Antique Gold for the text/icon only.