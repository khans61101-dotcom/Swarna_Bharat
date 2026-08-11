---
name: Sovereign Social Narrative
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#454652'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#fec330'
  on-secondary-container: '#6f5100'
  tertiary: '#181b23'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c3039'
  on-tertiary-container: '#9597a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#f8bd2a'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#e0e2ee'
  tertiary-fixed-dim: '#c4c6d2'
  on-tertiary-fixed: '#181b24'
  on-tertiary-fixed-variant: '#434750'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Montserrat
    fontSize: 10px
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
  sidebar_left_width: 280px
  sidebar_right_width: 320px
  main_gutter: 24px
  container_max_width: 1440px
  component_padding: 1.25rem
  stack_gap: 1rem
---

## Brand & Style
The design system bridges the gap between high-level governance and social interaction. It targets community leaders and active participants who require a professional yet engaging dashboard to manage sovereign digital identities and social discourse. 

The design style is **Corporate Modern with a Social Layout**. It utilizes a structured, reliable framework that feels established and authoritative, while adopting the familiar information density of a three-column social dashboard. The aesthetic is clean, using heavy whitespace to separate governance modules from social feeds, ensuring the "Sovereign" identity remains premium and uncluttered.

## Colors
The palette is dominated by **Professional Navy (#1a237e)**, used for primary navigation, headers, and core action buttons to project stability and trust. **Saffron (#fbc02d)** serves as a strategic accent color for alerts, notifications, and "Join" or "Contribute" calls-to-action, providing high visibility against the navy.

The background uses a light neutral gray (#f5f5f5) to differentiate the page surface from the white (#ffffff) component cards. Tertiary Navy tints are used for hover states and subtle grouping backgrounds.

## Typography
This design system exclusively uses **Montserrat** to achieve a confident, urban, and modern feel. 

- **Headlines:** Use Bold (700) or SemiBold (600) weights. High-level titles use slight negative letter spacing to feel more compact and impactful.
- **Body:** Standardized at 16px for optimal readability in feed-style layouts.
- **Labels:** Use uppercase with increased letter spacing for metadata, sidebar categories, and small utility text to maintain a "governance" feel.

## Layout & Spacing
The layout follows a **Fixed-Fluid-Fixed 3-column grid** inspired by social dashboards:

1.  **Left Sidebar (Navigation):** Fixed at 280px. Contains the sovereign profile, main navigation links (Proposals, Treasury, Voting), and followed communities.
2.  **Central Feed (Management/Content):** Fluid width with a maximum line-length constraint. This area hosts the primary content stream, active debates, or management tools.
3.  **Right Sidebar (Metrics/Context):** Fixed at 320px. Contains "Governance Health" metrics, follower activity, and upcoming deadlines.

**Breakpoints:**
- **Desktop (1280px+):** Full three-column view.
- **Tablet (768px - 1279px):** Right sidebar collapses into a drawer or moves below the feed; left sidebar becomes an icon-only rail.
- **Mobile (<767px):** Single column feed with a bottom navigation bar and top-header for profile/metrics.

## Elevation & Depth
The design system uses **Tonal Layers** rather than heavy shadows to maintain a professional, administrative clarity.

- **Background:** The base layer is #f5f5f5.
- **Cards/Modules:** Use a pure white (#ffffff) surface with a very subtle 1px border (#e0e0e0) and a soft, low-opacity ambient shadow (Alpha 0.05) to lift content slightly.
- **Primary Actions:** Buttons and active states use the Primary Navy with no shadow, relying on color contrast for hierarchy.
- **Interlays:** Modals and dropdowns use a medium-diffusion shadow to indicate they are temporary overlays on the dashboard.

## Shapes
This design system adopts a **Soft (0.25rem)** shape language. This minimal rounding provides a precise, geometric look that aligns with professional governance software while avoiding the harshness of sharp corners.

- **Standard Buttons & Inputs:** 0.25rem (4px).
- **Cards & Large Containers:** 0.5rem (8px).
- **Profile Avatars:** 100% (Circle) to signify the "Human" element within the structured system.

## Components

- **Buttons:** 
    - *Primary:* Navy background, white text, bold weight. 
    - *Accent:* Saffron background, navy text (for high-priority governance actions).
    - *Ghost:* Navy outline or text-only for secondary sidebar navigation.
- **Cards:** White background, 1px border, 20px internal padding. Feed cards should have a clear header area for the author/entity and a footer for social/governance metrics.
- **Navigation Items:** Left sidebar items use a 4px left-accent bar in Navy or Saffron when active.
- **Status Chips:** Small, rounded-sm badges. Use "Saffron" for "Pending/Voting," "Navy" for "Passed," and a muted gray for "Archived."
- **Input Fields:** Flat white background with a 1px gray border. On focus, the border transitions to Primary Navy with a 2px thickness.
- **Metrics Widget:** Compact cards in the right sidebar using "Display" typography for numbers to emphasize data-driven governance.