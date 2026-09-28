# T2L Aurora Cinema — Motion System

**Standard:** Modern Web Guidance + Web Motion Spec  
**Target:** 60fps / 120fps Smooth Compositor Animation  

---

## 1. Principles

1. **Compositor Only:** Animate `transform` and `opacity` exclusively. Never animate `width`, `height`, `margin`, `padding`, or `top/left` properties that cause layout recalculations.
2. **Purposeful Feedback:** Every transition communicates spatial orientation, hierarchy, or state change. No decorative bouncing or gratuitous movement.
3. **Hardware Acceleration:** Ensure active animated layers are promoted cleanly using `transform: translateZ(0)` or `will-change: transform, opacity` during active gestures, without permanent VRAM bloat.

---

## 2. Motion Curve & Timing Matrix

| Interaction | Duration | Easing Curve | CSS Keyframe / Property |
| :--- | :--- | :--- | :--- |
| **Tab / Button Tap** | 140ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `transform: scale(0.96); opacity: 0.9;` |
| **Media Card Hover/Focus** | 220ms | `cubic-bezier(0.16, 1, 0.3, 1)` | `transform: translateY(-4px) scale(1.02);` |
| **Details Sheet Slide-up** | 300ms | `cubic-bezier(0.22, 1, 0.36, 1)` | `transform: translateY(0); opacity: 1;` |
| **Player HUD Controls Fade**| 240ms | `ease-out` | `opacity: 1; transform: translateY(0);` |
| **Carousel Snap & Scroll** | Browser native | `scroll-snap-type: x mandatory` | Fluid inertia with partial card peek |
| **Aurora Ambient Glow** | 8s cycle | `ease-in-out infinite` | `opacity: 0.45` to `0.75` breathing gradient |

---

## 3. Accessibility & Reduced Motion Standard

Mandatory fallback for vestibular disorders and user accessibility preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .aurora-ambient-glow {
    animation: none !important;
    opacity: 0.5 !important;
  }
}
```
