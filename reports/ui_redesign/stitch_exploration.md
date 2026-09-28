# Stitch & Visual Design Exploration — Aurora Cinema

**Application:** T2L  
**Design Exploration Period:** September 28, 2026  
**Core Identity:** Aurora Cinema  

---

## 1. Tooling & Exploration Context

- **Stitch MCP Status:** Initialized and inspected. The remote Stitch API service returned `401 Unauthorized` (OAuth credential required for remote project generation). In accordance with the project guidelines, visual exploration proceeded autonomously using the local Playwright browser inspection engine, DevTools DOM rendering, `modern-web-guidance`, and `web-motion`.
- **Modern Web Guidance Integration:**
  - `carousel-slide-effects`: Evaluated scroll-driven animations and CSS scroll-snap (`scroll-snap-type: x mandatory; scroll-padding: 0 16px;`) for horizontal media carousels.
  - `dark-mode`: Validated semantic color tokens, OLED black surface hierarchy, and high-contrast accessible typography.
  - `performance`: Enforced compositor-only animations (`transform`, `opacity`) without layout thrashing.
- **Web Motion Integration:**
  - Snappy micro-interactions (150ms–220ms ease-out).
  - Fluid bottom-sheet transitions (280ms cubic-bezier(0.22, 1, 0.36, 1)).
  - Accessible `prefers-reduced-motion` fallbacks across all ambient glows and carousels.

---

## 2. Aurora Cinema Visual Exploration & Key Decisions

```
+-------------------------------------------------------------+
|  [≡]  T2L  [● LIVE]                                   [⚙]   |
+-------------------------------------------------------------+
|                                                             |
|   +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+   |
|   |                  HERO ARTWORK                       |   |
|   |         (Cinematic Aspect 16:9 or 4:3)              |   |
|   |   Ambient Violet & Cyan Aurora Gradient Field       |   |
|   |                                                     |   |
|   |   FEATURED CINEMA • 2024 • 720p HD                  |   |
|   |   12th Fail                                         |   |
|   |   [▶ Watch Now]      [+ My List]                    |   |
|   +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+   |
|                                                             |
|   Trending Now                         See All >            |
|   [ Poster 1 ]  [ Poster 2 ]  [ Poster 3 ]  [ Poster 4 ]    |
|   (2.4 cards visible, smooth scroll-snap peek)              |
|                                                             |
|   2025-2026 New Releases               See All >            |
|   [ Poster A ]  [ Poster B ]  [ Poster C ]                  |
|                                                             |
|   Live Highlights                                           |
|   [ Channel A ] [ Channel B ]                               |
|                                                             |
|   =======================================================   |
|   |  (Home)   (Live)   (Radio)   (Movies)   (Local)     |   |  <- Floating Glass Dock
|   =======================================================   |
+-------------------------------------------------------------+
```

### Key Conceptual Changes:
1. **Retiring the Redundant Quick Bar:** The 4 giant square buttons (`Live TV`, `Radio`, `Local`, `My List`) beneath the hero are completely removed. Discovery occurs organically via the curated horizontal carousels and bottom dock.
2. **De-cluttering Media Cards:**
   - Remove the loud neon green `1080p HD` banner plastered over actors' faces.
   - Remove the `🇮🇳 Hindi` language tag from the thumbnail surface.
   - Quality and language are moved to the contextual detail view and player where they belong.
   - Card displays: High-res poster (2:3 aspect ratio, border-radius 12px), title, subtle year + verified badge.
3. **Floating Glass Dock with Aurora Active Indicator:**
   - Elevated glass capsule floating 12px above bottom edge.
   - `background: rgba(14, 16, 23, 0.85); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08);`.
   - Active tab highlighted by an Aurora violet/cyan atmospheric pill and subtle icon glow.
4. **Solid, Immersive Modals:**
   - Replaces the leaky 70% transparent sheet with an opaque, elevated OLED surface (`#0E1017`) featuring an ambient artwork backdrop header and smooth upward slide.
   - Prevents background watermarks and buttons from bleeding through.
5. **Unified Modern Typography & Spacing:**
   - Standardized typography scale from 11px (metadata) to 28px (hero display).
   - Standard 8pt spacing system (8px, 12px, 16px, 20px, 24px, 32px).
