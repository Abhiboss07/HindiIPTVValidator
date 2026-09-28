# T2L Aurora Cinema — Design System & Tokens

**System Name:** Aurora Cinema Design System (ACDS)  
**Version:** 1.0.0  
**Target:** Mobile First (320px–430px) + Responsive Tablet & Large Screens  

---

## 1. Color Tokens (Semantic Palette)

```css
:root {
  /* Surfaces & Backgrounds */
  --bg-canvas: #08090D;               /* Deepest OLED space black */
  --bg-surface-primary: #0E1017;      /* Primary dark container surface */
  --bg-surface-elevated: #151823;     /* Elevated cards, sheets, dialogs */
  --bg-surface-glass: rgba(14, 16, 23, 0.78); /* Frosted floating navigation */
  --bg-surface-glass-border: rgba(255, 255, 255, 0.08);

  /* Aurora Accent Illumination */
  --aurora-primary: #8B5CF6;          /* Aurora Violet */
  --aurora-secondary: #22D3EE;        /* Aurora Cyan */
  --aurora-highlight: #A78BFA;        /* Bright Lilac */
  --aurora-gradient: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
  --aurora-ambient-glow: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, rgba(34, 211, 238, 0.05) 50%, transparent 80%);

  /* Text & Content */
  --text-primary: #F5F7FA;            /* High-contrast crisp white */
  --text-secondary: #A7ACB8;          /* Clean neutral subtitle text */
  --text-muted: #6F7583;              /* Subtle tertiary text & timestamps */
  --text-accent: #C4B5FD;             /* Tinted active text */

  /* Semantic Status Indicators */
  --status-success: #34D399;          /* Emerald (Online, Verified, Complete) */
  --status-warning: #FBBF24;          /* Amber (Buffering, Low Bandwidth) */
  --status-error: #FB7185;            /* Rose (Playback Error, Offline) */
  --status-live: #EF4444;             /* Crimson Pulse (Live TV / Live Radio) */

  /* Interactive States */
  --interactive-hover: rgba(255, 255, 255, 0.06);
  --interactive-active: rgba(139, 92, 246, 0.18);
  --interactive-focus-ring: 0 0 0 2px rgba(139, 92, 246, 0.5);
}
```

---

## 2. Typography Scale

```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif;
  
  --text-xs: 0.6875rem;    /* 11px - micro badges, duration tags */
  --text-sm: 0.8125rem;    /* 13px - metadata, secondary labels */
  --text-base: 0.9375rem;  /* 15px - body copy, button labels */
  --text-md: 1.0625rem;    /* 17px - card titles, list items */
  --text-lg: 1.25rem;      /* 20px - section headers */
  --text-xl: 1.5rem;       /* 24px - modal titles, page headers */
  --text-2xl: 1.875rem;    /* 30px - hero feature title */
  
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

---

## 3. Spacing & Ergonomics

```css
:root {
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 20px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* Touch Targets & Safe Areas */
  --touch-target-min: 48px;
  --bottom-dock-height: 64px;
  --bottom-dock-clearance: 96px;       /* Mandatory container padding to eliminate card clipping */
}
```

---

## 4. Radii & Elevation

```css
:root {
  --radius-xs: 4px;
  --radius-sm: 8px;                    /* Pills, badges */
  --radius-md: 12px;                   /* Media cards, buttons */
  --radius-lg: 18px;                   /* Sheets, hero modules */
  --radius-xl: 24px;                   /* Floating bottom dock */
  --radius-full: 9999px;               /* Circular controls, avatar chips */

  /* Elevation Shadows */
  --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.6);
  --shadow-aurora: 0 4px 20px rgba(139, 92, 246, 0.25);
  --shadow-dock: 0 -4px 30px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.1);
}
```

---

## 5. Motion Tokens

```css
:root {
  --ease-snappy: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-micro: 160ms;
  --duration-card: 220ms;
  --duration-sheet: 300ms;
  --duration-hero: 450ms;
}
```
