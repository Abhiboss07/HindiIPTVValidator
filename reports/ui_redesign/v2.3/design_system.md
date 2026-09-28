# T2L V2.3 — Design System & Design Tokens

## 1. Master Token Dictionary

```css
:root {
  /* Surfaces & Pitch-Black OLED Canvas */
  --t2l-canvas: #050608;
  --t2l-surface-1: #0A0C11;
  --t2l-surface-2: #12151D;
  --t2l-surface-3: #191E2A;
  --t2l-surface-glass: rgba(10, 12, 17, 0.72);
  --t2l-dock-glass: rgba(10, 12, 16, 0.82);
  --t2l-drawer-glass: rgba(10, 12, 17, 0.94);

  /* Aurora Brand Accents */
  --t2l-aurora-violet: #8B5CF6;
  --t2l-aurora-indigo: #6366F1;
  --t2l-aurora-cyan: #22D3EE;
  --t2l-aurora-rose: #F43F5E;
  --t2l-aurora-emerald: #10B981;
  --t2l-aurora-amber: #F59E0B;
  --t2l-aurora-gradient: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #22D3EE 100%);
  --t2l-aurora-glow: 0 0 24px rgba(34, 211, 238, 0.28);
  --t2l-scrim-hero: linear-gradient(180deg, rgba(5,6,8,0) 0%, rgba(5,6,8,0.5) 55%, #050608 100%);

  /* Typography */
  --t2l-font: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif;
  --t2l-font-mono: "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;

  /* Typography Colors */
  --t2l-text-white: #FFFFFF;
  --t2l-text-muted: #94A3B8;
  --t2l-text-subtle: #64748B;

  /* Borders & Highlights */
  --t2l-border-subtle: rgba(255, 255, 255, 0.08);
  --t2l-border-prominent: rgba(255, 255, 255, 0.16);

  /* Dimensions */
  --t2l-dock-height: 60px;
  --t2l-dock-margin-bottom: 16px;
  --t2l-safe-bottom: env(safe-area-inset-bottom, 16px);
  --t2l-header-height: 56px;
  --t2l-touch-target: 48px;

  /* Radii */
  --t2l-radius-sm: 8px;
  --t2l-radius-md: 14px;
  --t2l-radius-lg: 20px;
  --t2l-radius-xl: 28px;
  --t2l-radius-pill: 9999px;

  /* Motion */
  --t2l-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --t2l-ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

---

## 2. Component Tokens

* **Top Bar Mark**: 28×28px vector ("The Nexus Ribbon"), standalone, vertically centered.
* **Top Bar Icons**: 18×18px vector paths with 2px stroke and round caps.
* **Hamburger Drawer**: `width: min(340px, 84vw);` on mobile, `width: 360px;` on desktop.
* **Theatrical Rails**: `height: 210px` for standard 2:3 posters, `height: 150px` for 2.39:1 scope cards.
* **Radio Station Card**: `width: 140px; height: 160px;` with compact `44px` icon and 11px metadata.
