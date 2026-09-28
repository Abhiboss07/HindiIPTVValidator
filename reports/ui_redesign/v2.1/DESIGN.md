# T2L Aurora Cinema V2.1 — Design System Specification

**Standard:** Modern Web Guidance, Web Motion Compliant  
**Color Profile:** sRGB / Display P3 Wide Gamut OLED  
**Form Factor:** Responsive Mobile-First (320px–430px) to Desktop (1024px+)

---

## 1. Color Palette & Token System

```css
:root {
  /* True OLED Canvas & Glass Surfaces */
  --t2l-canvas: #050608;              /* Deepest pitch-black OLED background */
  --t2l-surface-1: #0A0C11;          /* Base card surface */
  --t2l-surface-2: #12151D;          /* Elevated surface */
  --t2l-surface-3: #191E2A;          /* Active / hovered surface */
  --t2l-surface-glass: rgba(10, 12, 17, 0.72); /* Header & dock frosted glass */
  --t2l-border-subtle: rgba(255, 255, 255, 0.07);
  --t2l-border-prominent: rgba(255, 255, 255, 0.15);

  /* Signature Aurora Color Identity */
  --t2l-aurora-violet: #8B5CF6;       /* Atmospheric luminescence */
  --t2l-aurora-cyan: #22D3EE;         /* Primary brand accent & active states */
  --t2l-aurora-rose: #F43F5E;         /* Live ON AIR & notification alerts */
  --t2l-aurora-emerald: #10B981;      /* Verified honest quality & master audio */
  --t2l-aurora-amber: #F59E0B;        /* IMDb ratings & upcoming announcements */
  --t2l-aurora-gradient: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
  --t2l-aurora-glow: 0 0 24px rgba(34, 211, 238, 0.28);
  --t2l-scrim-hero: linear-gradient(180deg, rgba(5,6,8,0) 0%, rgba(5,6,8,0.45) 50%, #050608 100%);

  /* Typography */
  --t2l-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
  --t2l-text-white: #FFFFFF;
  --t2l-text-muted: #94A3B8;
  --t2l-text-subtle: #64748B;

  /* Dimensions & Ergonomics */
  --t2l-dock-height: 60px;
  --t2l-dock-margin-bottom: 16px;
  --t2l-safe-bottom: env(safe-area-inset-bottom, 16px);
  --t2l-header-height: 56px;
  --t2l-touch-target: 48px;

  /* Radii */
  --t2l-radius-sm: 8px;
  --t2l-radius-md: 14px;
  --t2l-radius-lg: 20px;
  --t2l-radius-pill: 9999px;
}
```

---

## 2. Redesigned T2L Symbol & Identity

The **Kinetic Aperture** is constructed with pure geometric vectors:
- Outer rounded stadium container framing two continuous transmission wave arcs.
- Dynamic central horizon line and focal emitter representing cinematic projection.
- Perfectly legible at 16x16px (favicon), 32x32px (header/player), and 128x128px (splash/app icon).

```svg
<svg viewBox="0 0 36 36" fill="none" class="t2l-symbol">
  <rect x="2" y="2" width="32" height="32" rx="9" stroke="url(#auroraGradient)" stroke-width="2.2" />
  <path d="M10 13H26M18 13V24M13 24H23" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="18" cy="13" r="1.8" fill="#22D3EE" />
  <defs>
    <linearGradient id="auroraGradient" x1="0" y1="0" x2="36" y2="36">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
</svg>
```

---

## 3. Unified Vector Iconography System (Zero Emojis)

All icons use a consistent 1.75px–2px stroke, 24x24px viewBox, round line caps, and round joints:
- **Home**: Geometric house silhouette with chimney (`M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`)
- **Cinema**: Film clapperboard (`rect` with slanted clap bar)
- **Live TV**: Antenna monitor with broadcast waves
- **Radio**: Vintage acoustic radio with frequency dial
- **Local**: Folder library / media vault
- **Notifications**: Sleek bell with unread notification dot
- **Profile / Avatar**: User silhouette circle
- **Play**: Minimal equilateral triangle glyph (`polygon 5 3, 19 12, 5 21`)
- **Download**: Downward arrow into tray
- **Search**: Thin-stroke magnifying glass

---

## 4. End-of-Content Editorial Footer
Appears naturally at the bottom of the page when scrolled to the end:
```text
┌─────────────────────────────────────────────────────────────┐
│ [⧉ T2L Mark]                                               │
│ Your cinematic media space.                                 │
│                                                             │
│ EXPLORE          FEATURES           INFORMATION             │
│ • Home           • Search           • About T2L             │
│ • Cinema         • Downloads        • Zero-Trust Engine     │
│ • Live TV        • Instant Streamer • Privacy & Safety      │
│ • Radio          • My List          • Build 2026.09.28      │
│ • Local Vault    • Diagnostics                              │
│                                                             │
│ © 2026 T2L Television to Live. All rights reserved.         │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Refined Floating Capsule Dock
- **Width**: Responsive max-width 420px, auto-centered.
- **Elevation**: 16px above bottom with safe-area addition.
- **Glass**: `background: rgba(10, 12, 17, 0.84); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.12);`.
- **Tabs**: 5 destinations with uniform SVG icons, 10px labels, and active aurora capsule pill.
- **Clearance**: Content padding guarantees zero overlap on any scroll position.
