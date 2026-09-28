# T2L Aurora Cinema V2.1 — Motion System & Physics

**Standard:** Web Motion Specification & Modern Web Guidance  
**Goal:** 60/120fps Compositor-Only Smoothness, Zero Layout Reflows, Accessible Easing

---

## 1. Timing & Easing Curves

```css
:root {
  --v2-motion-fast: 140ms;
  --v2-motion-normal: 240ms;
  --v2-motion-cinematic: 380ms;

  --v2-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);    /* Modal slide-up, tab pills */
  --v2-ease-standard: cubic-bezier(0.2, 0, 0, 1);    /* Card hover & press */
  --v2-ease-fade: ease-out;
}
```

---

## 2. Opening Splash Sequence Animation (1200ms)

Operates entirely on GPU transforms and opacity:
```css
@keyframes aperture-sweep {
  0% { transform: scale(0.85); opacity: 0; filter: blur(8px); }
  40% { transform: scale(1.02); opacity: 1; filter: blur(0px); }
  70% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.04); opacity: 0; filter: blur(4px); }
}

@keyframes aurora-wave-pulse {
  0% { stroke-dashoffset: 120; opacity: 0.3; }
  50% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: -120; opacity: 0.6; }
}
```

---

## 3. Top Header Transition on Scroll

The header smoothly transitions from transparent to blurred glass without triggering layout recalculations:
```css
.t2l-header {
  transition: background-color 220ms ease, backdrop-filter 220ms ease, border-color 220ms ease;
}
.t2l-header.is-scrolled {
  background: rgba(10, 12, 17, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

## 4. Acoustic Equalizer Visualizer (Radio)

Subtle equalizer bars animating on compositor threads:
```css
@keyframes eq-pulse {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}
.eq-bar-1 { animation: eq-pulse 0.8s ease-in-out infinite; }
.eq-bar-2 { animation: eq-pulse 1.1s ease-in-out infinite 0.2s; }
.eq-bar-3 { animation: eq-pulse 0.7s ease-in-out infinite 0.4s; }
```

---

## 5. Accessibility Fallback (`prefers-reduced-motion`)

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
