# T2L Aurora Cinema V2 — Responsive & Ergonomic Strategy

**Target Device Matrix:**
- Small Phone: 320 × 640 (iPhone SE 1st Gen)
- Compact Phone: 360 × 780 (Galaxy S20)
- Modern Flagship Phone: 390 × 844 (iPhone 12/13/14, Pixel 7a)
- Large Android Phone: 412 × 915 (Nothing Phone 1/2, Pixel 7 Pro)
- Max / Ultra Phone: 430 × 932 (iPhone 15 Pro Max, S24 Ultra)
- Tablet / Foldable: 768 × 1024 / 800 × 1280
- Desktop / Android TV: 1024 × 768 to 1920 × 1080

---

## 1. Mobile-First Rail Peek Mathematical Formula

Horizontal scrolling rails on mobile MUST communicate that more content exists to the right without relying on arrows or scrollbars.

The **2.35 Card Peek Formula**:
```css
.content-rail-card {
  /* 
   * On a 390px viewport with 16px margins (358px usable):
   * 2 full cards at 150px = 300px
   * 1 gap at 12px = 12px
   * Remaining width = 46px (roughly 31% of the 3rd card peeks)
   */
  flex: 0 0 clamp(135px, 38vw, 175px);
  scroll-snap-align: start;
}
```

---

## 2. Breakpoint Grid Matrix

| Breakpoint | Viewport Range | Layout Transformation | Navigation Model |
| :--- | :--- | :--- | :--- |
| **Mobile Compact** | `< 360px` | 1 column hero, 2-card peek rail, 60px capsule dock | Bottom Capsule Dock |
| **Mobile Standard** | `360px – 480px` | Full hero premiere, 2.35 card peek rail, 60px capsule dock | Bottom Capsule Dock |
| **Tablet / Foldable**| `481px – 840px` | 3.5 card peek rail, 2-column live TV grid, 4-column search grid | Expanded Capsule Dock |
| **Desktop / TV** | `> 840px` | Widescreen hero, 5-card carousel with side arrows, 4-column cinema grid | Top Bar or Left Rail |

---

## 3. Safe Area Insets & Dock Clearance

To prevent Android gesture navigation bars and iOS Home bars from obscuring content:
```css
:root {
  --v2-dock-height: 60px;
  --v2-dock-margin-bottom: 16px;
  --v2-safe-bottom: env(safe-area-inset-bottom, 16px);
}

.view-content-wrapper {
  /* Guarantee content scrolls fully clear of the floating dock */
  padding-bottom: calc(var(--v2-dock-height) + var(--v2-dock-margin-bottom) + var(--v2-safe-bottom) + 32px) !important;
}
```
