# T2L Aurora Cinema V2 — Motion System & Physics

**Standard:** Web Motion Specification & Modern Web Guidance  
**Goal:** 60/120fps Compositor-Only Smoothness, Zero Layout Reflows, Accessible Easing

---

## 1. Core Principles
1. **Compositor Exclusivity**:
   Every animation and transition operates exclusively on `transform` and `opacity`. We strictly forbid animating `height`, `width`, `top`, `bottom`, `left`, `right`, `padding`, or `margin`.
2. **Snappy Ergonomics**:
   Micro-interactions complete within **140ms–220ms**. Users should never feel like they are waiting for an animation to finish before they can interact.
3. **Intentional Continuity**:
   Modals slide up smoothly from the bottom with spring-like physics (`cubic-bezier(0.16, 1, 0.3, 1)`), preserving spatial orientation.

---

## 2. Easing Curves & Timing Tokens

```css
/* Timing Variables */
--v2-motion-fast: 150ms;
--v2-motion-normal: 250ms;
--v2-motion-cinematic: 380ms;

/* Easing Curves */
--v2-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);    /* Modal entry, tab switches */
--v2-ease-exit: cubic-bezier(0.4, 0, 1, 1);        /* Disappearing overlays */
--v2-ease-standard: cubic-bezier(0.2, 0, 0, 1);    /* Hover & press transforms */
```

---

## 3. Specific Component Transitions

### A. Theatrical Card Hover & Touch Press
- **Touch down / Hover**: `transform: scale(0.97); transition: transform 140ms var(--v2-ease-standard);`
- **Release**: `transform: scale(1); transition: transform 220ms var(--v2-ease-spring);`
- **Active border glow**: `border-color: rgba(34, 211, 238, 0.4); box-shadow: 0 8px 24px rgba(34, 211, 238, 0.2);`

### B. Floating Capsule Dock Active Tab Transition
- **Tab indicator pill**: Translates smoothly between items using CSS transition:
  ```css
  .capsule-dock-item {
    transition: background-color 200ms ease, color 200ms ease, transform 150ms var(--v2-ease-spring);
  }
  .capsule-dock-item:active {
    transform: scale(0.92);
  }
  ```

### C. Details Modal Slide-Up
- **Entry**: `transform: translateY(100%) -> translateY(0); opacity: 0 -> 1; transition: transform 320ms var(--v2-ease-spring), opacity 240ms ease;`
- **Backdrop Fade**: `opacity: 0 -> 1; transition: opacity 280ms ease;`

### D. Theater Player HUD Auto-Hide
- **Show HUD**: `opacity: 1; pointer-events: auto; transition: opacity 200ms ease;`
- **Hide HUD (after 3000ms idle)**: `opacity: 0; pointer-events: none; transition: opacity 500ms ease;`

---

## 4. Accessibility Fallback (`prefers-reduced-motion`)
Per WCAG 2.3.3:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
