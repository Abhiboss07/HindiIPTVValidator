# T2L V2.2 — Logo Technical Specification: "The Nexus Ribbon"

## 1. Geometry & Coordinate System

The master symbol is constructed on a 48×48 coordinate grid with an 8px safe margin:

```text
  0       8            24           40      48
0 ┌──────────────────────────────────────────┐
  │                                          │
8 │       ●━━━━━━━━━━━━━━━━━━━━━━━━━━●       │ y = 12 (Crown of 'T')
  │       │                          │       │
  │       │             ●            │       │ (24, 12) Spine Origin
  │       │            ╱             │       │
24│       │           ╱              │       │
  │       │          ╱               │       │
  │       │         ●                │       │ (14, 36) Apex of '2'
  │       │         │                │       │
36│       ●━━━━━━━━━●━━━━━━━━━━━━━━━━●       │ y = 36 (Base of '2' & 'L')
  │                                  │       │
  │                                  ●       │ (38, 26) Terminal of 'L'
48└──────────────────────────────────────────┘
```

### Exact Mathematical Paths

1. **The Crown Bar (Crossbar of 'T')**:
   ```svg
   <path d="M 9 12 H 39" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" />
   ```
2. **The Diagonal Kinetic Spine (Downstroke of '2')**:
   ```svg
   <path d="M 24 12 L 13 36" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" />
   ```
3. **The Foundation & Shelf (Base of '2' + Stem & Upturn of 'L')**:
   ```svg
   <path d="M 13 36 H 37 V 26" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
   ```

### Combined Master SVG Definition (48×48)

```svg
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="t2l-symbol">
  <defs>
    <linearGradient id="t2lAuroraGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="50%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <!-- Crown Bar (T) -->
  <path d="M 9 12 H 39" stroke="url(#t2lAuroraGrad)" stroke-width="4.2" stroke-linecap="round"/>
  <!-- Kinetic Spine (2) -->
  <path d="M 24 12 L 13 36" stroke="url(#t2lAuroraGrad)" stroke-width="4.2" stroke-linecap="round"/>
  <!-- Foundation & Shelf (2 + L) -->
  <path d="M 13 36 H 37 V 26" stroke="url(#t2lAuroraGrad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

---

## 2. Wordmark Specification

* **Text**: `T2L`
* **Typography**: Custom Geometric Neo-Grotesque
* **Font Family**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif`
* **Weight**: 800 (Extra Bold)
* **Letter Spacing**: `0.14em`
* **Optical Kerning**: The `2` is mathematically centered between the right arm of `T` and the vertical stem of `L`.
* **Proportions**: Wordmark height equals 65% of the symbol height in standard horizontal lockups.

```svg
<div class="t2l-brand-lockup">
  <svg class="t2l-symbol-icon" viewBox="0 0 48 48">...</svg>
  <span class="t2l-brand-wordmark">T2L</span>
</div>
```

---

## 3. Scale Adaptability & Optical Adjustment

| Size | Usage | Stroke Width | Border Radius / Squircle |
| :---: | :--- | :---: | :---: |
| **16×16px** | Favicon, tiny status dot | 4.8px (optical compensation) | None |
| **24×24px** | Top bar, notification icon, watermark | 4.2px | Optional 6px tile |
| **32×32px** | Player header, list items | 4.0px | 8px tile |
| **48×48px** | Master lockup, profile hub | 4.2px | 12px tile |
| **96×96px** | Splash sequence, app store artwork | 4.2px | 22px squircle (`rx="22"`) |

---

## 4. Opening Animation Sequence (1200ms)

The opening animation choreographs the birth of the mark without frivolous gaming/particle effects:

1. **Phase 1: Convergence (0ms – 400ms)**
   - Top crown stroke draws horizontally from center outwards (`stroke-dashoffset`).
   - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Phase 2: Transmission (300ms – 700ms)**
   - Kinetic diagonal spine beams down from `(24, 12)` to `(13, 36)`.
   - Aurora gradient illuminates with a subtle 8px focal glow.
3. **Phase 3: Grounding (600ms – 1000ms)**
   - Foundation base extends across and locks into the vertical upright of `L`.
   - Wordmark `T2L` cross-fades into view with `letter-spacing: 0.22em -> 0.14em`.
4. **Phase 4: Resolve (1000ms – 1200ms)**
   - Entire splash scales gently (`scale: 1.0 -> 0.98`) and fades smoothly to reveal the cinematic UI.
   - Total duration: 1200ms. Respects `prefers-reduced-motion` with instant fade-in.
