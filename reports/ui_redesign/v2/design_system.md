# T2L Aurora Cinema V2 — Design System Specification

**Standard:** Modern Web Guidance & Web Motion Compliant  
**Color Profile:** sRGB / Display P3 Wide Gamut OLED  
**Form Factor:** Responsive Mobile-First (320px–430px) to Tablet/Desktop (1024px+)

---

## 1. Color Palette & Token Dictionary

### Base Canvas & Surfaces (OLED True Black Foundations)
```css
--v2-canvas: #060709;              /* Deepest pitch-black OLED background */
--v2-surface-1: #0D0F14;          /* Level 1 background card/panel */
--v2-surface-2: #141720;          /* Level 2 elevated surface */
--v2-surface-3: #1C202E;          /* Level 3 high-contrast interactive surface */
--v2-surface-glass: rgba(13, 15, 20, 0.75); /* Frosted blur surface */
--v2-border-subtle: rgba(255, 255, 255, 0.06);
--v2-border-prominent: rgba(255, 255, 255, 0.14);
```

### Signature Aurora Accent Tokens
```css
--v2-aurora-violet: #8B5CF6;       /* Atmospheric luminescence */
--v2-aurora-cyan: #22D3EE;         /* Primary brand accent & active states */
--v2-aurora-rose: #F43F5E;         /* Live ON AIR & warning alerts */
--v2-aurora-emerald: #10B981;      /* Verified honest quality & master audio */
--v2-aurora-amber: #F59E0B;        /* IMDb ratings & upcoming announcements */
--v2-aurora-gradient: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
--v2-aurora-glow: 0 0 24px rgba(34, 211, 238, 0.28);
--v2-scrim-hero: linear-gradient(180deg, rgba(6,7,9,0) 0%, rgba(6,7,9,0.7) 60%, #060709 100%);
```

### Typography Tokens (Clean Sans-Serif Humanist Hierarchy)
```css
--v2-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;

/* Scales */
--v2-text-display: clamp(24px, 5vw, 36px);  /* Line height: 1.15; Weight: 800 */
--v2-text-title: 20px;                      /* Line height: 1.25; Weight: 700 */
--v2-text-subtitle: 16px;                   /* Line height: 1.4;  Weight: 600 */
--v2-text-body: 14px;                       /* Line height: 1.5;  Weight: 400 */
--v2-text-meta: 12px;                       /* Line height: 1.4;  Weight: 500 */
--v2-text-badge: 11px;                      /* Line height: 1.2;  Weight: 700; Letter-spacing: 0.5px */
```

---

## 2. Spacing & Ergonomic Sizing Scale

| Token | Dimension | Intended Application |
| :--- | :--- | :--- |
| `--v2-space-2xs` | `4px` | Badge padding, micro metadata gaps |
| `--v2-space-xs` | `8px` | Icon-to-text spacing, button inner gaps |
| `--v2-space-sm` | `12px` | Card internal padding, tag spacing |
| `--v2-space-md` | `16px` | Screen horizontal margins, rail gap |
| `--v2-space-lg` | `24px` | Section vertical rhythm, header margins |
| `--v2-space-xl` | `32px` | Hero section separators |
| `--v2-touch-target` | `48px` | Strict WCAG / Android touch target minimum |

---

## 3. Border Radii Scale

```css
--v2-radius-sm: 8px;              /* Small badges, pills */
--v2-radius-md: 14px;             /* Theatrical poster cards, buttons */
--v2-radius-lg: 20px;             /* Hero spotlight banners, sheet modals */
--v2-radius-pill: 9999px;         /* Category chips, capsule floating dock */
```

---

## 4. Elevation & Surface Depth Levels

1. **Level 0 (Canvas)**: `#060709` — Void, true OLED black.
2. **Level 1 (Surface)**: `#0D0F14` — Base background for rails and content groups.
3. **Level 2 (Cards)**: `#141720` with `border: 1px solid rgba(255,255,255,0.06)` — Theatrical cards, channel tiles.
4. **Level 3 (Interactive / Hover)**: `#1C202E` with `box-shadow: 0 8px 24px rgba(0,0,0,0.6)`.
5. **Level 4 (Floating Glass)**: `rgba(13, 15, 20, 0.85)` with `backdrop-filter: blur(24px)` — Capsule dock, app header.
6. **Level 5 (Modals & Theater)**: `rgba(6, 7, 9, 0.95)` with `backdrop-filter: blur(32px)`.

---

## 5. Dedicated Card Types & Content Densities

### Type A: Theatrical Movie Card (2:3 Aspect Ratio)
- **Visuals**: Clean 2:3 poster art, rounded corners (14px).
- **Overlays**: Top-right Bookmark icon (subtle, transparent until tapped).
- **Metadata**: Title in 14px 600 weight; below title: `2024 · Hindi · 1080p` in 12px Slate 400.
- **Rule**: NO bulky audio badges covering the poster artwork.

### Type B: Episodic Series Card (2:3 Aspect Ratio)
- **Visuals**: 2:3 poster art with a subtle top-left "SERIES" translucent pill.
- **Metadata**: Title; below title: `2 Seasons · Drama` in 12px Slate 400.

### Type C: Continue Watching Card (16:9 Landscape)
- **Visuals**: 16:9 horizontal backdrop, embedded play glyph with subtle frosted pill.
- **Progress**: Embedded bottom progress bar (`height: 3px; background: var(--v2-aurora-cyan)`).
- **Metadata**: Title in 13px; remaining time e.g. `42m left (68%)`.

### Type D: Live Broadcast Card (16:9 Landscape)
- **Visuals**: 16:9 channel snapshot or broadcast art.
- **Badges**: Pulsing red `● LIVE` badge, live viewer count pill (e.g. `14.2K`).
- **Metadata**: Channel logo + Channel name, current program title.

### Type E: Radio Station Card (Acoustic Vinyl Bento)
- **Visuals**: Dark charcoal square card with vinyl disc aesthetic and station logo in center.
- **Badges**: Animated audio wave indicator bars (green/cyan).
- **Metadata**: Station name (e.g., "AIR Vividh Bharati"), frequency dial ("102.8 FM"), audio quality ("HD Stereo").

### Type F: Local Media File Card
- **Visuals**: File thumbnail with file type icon overlay (Video / Audio).
- **Metadata**: File name, file size (`1.4 GB`), container duration.

---

## 6. Signature Floating Capsule Dock
- **Position**: Floating fixed at `bottom: 16px; left: 16px; right: 16px; max-width: 480px; margin: 0 auto;`.
- **Dimensions**: Height: 60px; Border radius: 9999px (full capsule).
- **Background**: `rgba(13, 15, 20, 0.88)` with `backdrop-filter: blur(24px)` and `border: 1px solid rgba(255, 255, 255, 0.1)`.
- **Tabs**: 5 destinations (Home, Live TV, Radio, Cinema, Local).
- **Active State**: Glowing violet pill container with high-contrast cyan icon and label.
- **Clearance**: Content padding guarantees zero overlap on any scroll position.
