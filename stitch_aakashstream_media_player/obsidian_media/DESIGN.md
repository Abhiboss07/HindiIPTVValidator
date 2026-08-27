---
name: Obsidian Media
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2b2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0a0a0a'
  on-primary-container: '#7b7979'
  inverse-primary: '#5f5e5e'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#b9cac4'
  on-tertiary: '#24332f'
  tertiary-container: '#010d0a'
  on-tertiary-container: '#6d7d78'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#d5e6e0'
  tertiary-fixed-dim: '#b9cac4'
  on-tertiary-fixed: '#101e1b'
  on-tertiary-fixed-variant: '#3b4a46'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
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
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is rooted in **Sophisticated Minimalism**. It prioritizes content as the primary visual driver, utilizing a "Pure Dark" aesthetic to minimize interface distraction and maximize cinematic immersion. The target audience values a premium, calm, and professional viewing experience devoid of the "gamified" clutter common in modern streaming platforms.

The style is characterized by:
- **Atmospheric Depth:** Relying on tonal shifts in dark grays rather than shadows.
- **Precision:** Strict adherence to grid lines and purposeful alignment.
- **Intentionality:** Every element exists for a functional reason; if a component doesn't aid in discovery or playback, it is removed.
- **Quiet Luxury:** High-contrast typography paired with a single, muted accent color creates a sense of exclusivity and calm.

## Colors

This design system utilizes a monolithic dark palette designed for low-light environments. 

- **Backgrounds:** The base layer is a true black (`#0A0A0A`) to ensure seamless integration with OLED displays. Secondary surfaces use a deep charcoal (`#141414`) to provide subtle separation without breaking the minimalist flow.
- **Accents:** A soft Emerald (`#4F7C73`) serves as the primary action color. It is muted and sophisticated, used sparingly for active states, primary buttons, and progress indicators.
- **Typography:** Text relies on pure white for headlines to ensure maximum legibility, while metadata and secondary descriptions use a mid-gray to establish hierarchy.

## Typography

The typography system uses **Inter** exclusively to maintain a clean, systematic feel. 

- **Hierarchy:** Contrast is achieved through weight and color rather than excessive size variance. 
- **Readability:** For long descriptions (synopses), use `body-md` with generous line height. 
- **Utility:** Metadata (year, rating, duration) should always use `label-sm` with the defined uppercase transformation to distinguish technical data from narrative content.
- **Spacing:** Tighten letter-spacing on display styles to maintain a premium "editorial" feel.

## Layout & Spacing

The design system employs a **Fluid-Fixed Hybrid Grid**. 

- **Desktop:** A 12-column grid with a max-width of 1440px. Content is centered with wide 48px margins to evoke a sense of luxury and space.
- **Mobile:** A 4-column fluid grid with 16px margins.
- **Rhythm:** All spacing must be a multiple of the 4px base unit. 
- **Content Density:** Use `xl` (40px) or `xxl` (64px) vertical spacing between major sections (e.g., "Trending" vs "Continue Watching") to allow the user's eyes to rest.

## Elevation & Depth

This design system avoids traditional drop shadows to maintain its minimalist aesthetic. Instead, depth is communicated through **Tonal Layering** and **Subtle Outlines**.

- **Level 0 (Background):** Pure Black (`#0A0A0A`).
- **Level 1 (Cards/Surface):** Deep Charcoal (`#141414`).
- **Level 2 (Modals/Popovers):** Slightly lighter Charcoal (`#1F1F1F`) with a 1px solid border in `#2B3A36`.
- **Interactions:** Hover states should be indicated by a subtle increase in brightness of the surface or the appearance of a 1px "Emerald" border, rather than a shadow or lift effect.

## Shapes

The shape language is "Soft-Modern." Elements use a disciplined corner radius to appear precise yet approachable.

- **Standard Elements:** Buttons, input fields, and small thumbnails use `rounded` (4px).
- **Featured Content:** Large hero banners or promotional cards use `rounded-lg` (8px) to soften their impact on the layout.
- **Selection Indicators:** Small indicators (like the current page in pagination) may use `rounded-xl` for a more distinct, pill-like appearance.

## Components

### Buttons
- **Primary:** Solid Emerald (`#4F7C73`) with White text. No gradients.
- **Secondary:** Transparent background with a 1px White or Emerald border.
- **Ghost:** Text-only with Emerald color for high-priority secondary actions, or White for low-priority.

### Cards
- Media cards are flat with no shadow. 
- A 1px subtle border (`#2B3A36`) is used only when cards sit on the Level 0 background to provide definition.
- Hover state: The image scales slightly (1.05x) within the container (overflow hidden) to indicate focus.

### Input Fields
- Darkest gray background (`#0A0A0A`) with a subtle 1px border.
- Focused state: Border changes to Emerald. 
- Placeholders: Mid-gray text (`#A0A0A0`).

### Progress Bars
- Track: Dark Gray (`#2B3A36`).
- Fill: Emerald (`#4F7C73`).
- Height: 2px for subtle background tasks, 4px for active video playback.

### Chips & Tags
- Used for genres or categories. 
- Minimalist style: Border only, no background fill, using `label-sm` typography.