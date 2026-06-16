---
name: EvenTease Design System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#414754'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005cbb'
  primary: '#005ab6'
  on-primary: '#ffffff'
  primary-container: '#0072e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#abc7ff'
  secondary: '#9e00b7'
  on-secondary: '#ffffff'
  secondary-container: '#c600e4'
  on-secondary-container: '#fffbff'
  tertiary: '#9b4000'
  on-tertiary: '#ffffff'
  tertiary-container: '#c25200'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#ffd6fe'
  secondary-fixed-dim: '#faabff'
  on-secondary-fixed: '#35003f'
  on-secondary-fixed-variant: '#7b008f'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb692'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#793100'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  h1:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style

The design system for this event management platform is built on a **Modern SaaS** aesthetic, balancing professional utility with high-energy accents. It is designed to feel dependable enough for complex logistics while remaining vibrant enough to reflect the excitement of live events.

The style leans into **Minimalism** with a **Corporate/Modern** foundation, utilizing whitespace and a structured grid to manage information density. Distinction is achieved through purposeful use of vibrant gradients and subtle depth, moving away from purely flat design toward a more layered, high-fidelity dashboard feel. 

The target audience consists of event organizers and corporate planners who require clarity and efficiency. The UI evokes a sense of "Organized Energy"—streamlined workflows punctuated by bold, celebratory visual markers.

## Colors

The palette is centered around a high-contrast pairing of **Azure Blue** and **Phlox Purple**. 

- **Azure Blue (#0080FF):** Used for primary actions, navigation states, and core branding. It represents trust and technical stability.
- **Phlox Purple (#E02AFF):** Used sparingly as an accent for secondary highlights, status indicators, or "magic" features like AI assistants.
- **The Brand Gradient:** A linear blend of the two primary hues, reserved for high-impact elements like active "Create" buttons, progress bars, and premium card borders.
- **Surface & Background:** The background uses a soft **Smoke Gray (#F5F5F5)** to reduce eye strain compared to pure white, while primary containers use pure white (#FFFFFF) to create a clear visual hierarchy.

## Typography

This design system uses **Montserrat** exclusively to maintain a clean, geometric, and professional appearance. The typeface provides a wide range of weights, allowing for clear hierarchy without introducing secondary fonts.

- **Headlines:** Use Bold (700) or SemiBold (600) weights with slightly tighter letter-spacing to create a "locked-in" professional look.
- **Body:** Uses Regular (400) weight for maximum readability. Line heights are generous (1.6x) to ensure large amounts of data remain digestible.
- **Localization:** Since the interface is in **French**, typography accounts for longer word lengths (e.g., "Tableau de bord" vs "Dashboard"). Ensure containers have sufficient horizontal flexibility.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. While the dashboard sidebar remains fixed (280px), the main content area utilizes a fluid grid that caps at 1440px to prevent excessive line lengths on ultrawide monitors.

- **Grid System:** A 12-column grid for desktop, 8-column for tablet, and 4-column for mobile.
- **The 8px Rule:** All spacing (padding, margins, gaps) must be a multiple of 8px. This creates a predictable rhythm across the application.
- **Safe Areas:** Maintain a 40px margin on desktop to let the content breathe. On mobile, this shrinks to 16px to maximize screen real estate.

## Elevation & Depth

To achieve a modern SaaS aesthetic, the system uses **Tonal Layering** combined with **Ambient Shadows**.

- **Level 0 (Background):** #F5F5F5.
- **Level 1 (Cards/Sidebar):** Pure white (#FFFFFF) with a very soft, diffused shadow (15% opacity Azure Blue tint, 10px blur).
- **Level 2 (Popovers/Modals):** Pure white with a more pronounced shadow (20% opacity, 30px blur) to create distinct separation from the workspace.
- **Glassmorphism:** Used sparingly for sticky navigation bars, using a backdrop blur (12px) and 80% opacity white fill to maintain context of the scroll position.

## Shapes

The design system utilizes **Rounded (0.5rem)** corners as the standard. This approach softens the "technical" feel of a data-heavy dashboard, making it feel more approachable and modern.

- **Standard (8px):** Primary buttons, input fields, and standard cards.
- **Large (16px):** Large feature containers and modals.
- **Extra Large (24px):** Marketing-oriented sections or decorative image containers.

## Components

Components are inspired by **shadcn/ui**, characterized by high-contrast outlines and precise geometry.

- **Buttons:** 
  - *Primary:* Azure Blue fill with white text.
  - *Secondary:* Gradient border (Azure to Phlox) with Azure Blue text and white background.
  - *Ghost:* No background, #1A1A1A text, appearing on hover.
- **Input Fields:** 1px solid border (#E2E8F0). On focus, the border transitions to Azure Blue with a subtle 2px glow.
- **Chips/Badges:** Small, rounded (pill-shaped) elements. For "Confirmed" (Confirmé), use a soft green tint; for "Pending" (En attente), use a soft orange.
- **Cards:** White background, 8px radius, and a subtle 1px border (#E2E8F0). Premium or highlighted event cards feature a 2px gradient top-border.
- **Lists:** Clean rows with 16px vertical padding, separated by a light gray divider. Hover states should trigger a subtle shift to #F9FAFB.
- **Event Calendar:** A custom component using the brand gradient for "Current Day" and Azure Blue for "Event Slots."