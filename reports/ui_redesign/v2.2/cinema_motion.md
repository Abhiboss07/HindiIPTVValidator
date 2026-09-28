# T2L V2.2 — Cinema Motion & Detail Transition

## 1. Principles of Cinematic Motion

Motion in T2L Cinema is strictly functional, purposeful, and compositor-driven:
* **Physics over arbitrary timing**: Easing curves emulate real-world lens movement and physical projection shutters.
* **Compositor Only**: Only `transform` and `opacity` are animated to ensure stable 60/120fps performance on mobile devices.
* **Zero Disorientation**: Transitions keep the user's visual anchor intact when advancing from card selection to details view.

---

## 2. Card-to-Backdrop Detail Transition

Rather than an abrupt modal popping onto the screen, selecting any cinema card triggers a seamless elevation:

```
[ THEATRICAL CARD ]
       │
       ▼ (User Tap)
[ CARD SCALE & EXPAND ] (280ms, cubic-bezier(0.2, 0.9, 0.3, 1))
       │ Poster expands outward, ambient glow illuminates backdrop
       ▼
[ FULL-BLEED DETAILS HERO ]
       │ Key art dissolves smoothly into full screen, metadata slides up
       ▼
[ COMPLETE DETAIL EXPERIENCE ]
```

### Implementation Mechanics
1. **View Transitions API / Progressive CSS**:
   When supported, `document.startViewTransition` captures the card snapshot and expands it smoothly into the modal hero backdrop.
2. **CSS Starting Style & Fallback**:
   For environments without native View Transitions, the modal uses `@starting-style` and CSS transforms:
   ```css
   .cinema-detail-modal {
     opacity: 1;
     transform: scale(1) translateY(0);
     transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
                 transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
   }
   @starting-style {
     .cinema-detail-modal {
       opacity: 0;
       transform: scale(0.96) translateY(20px);
     }
   }
   ```

---

## 3. Micro-Interactions & Rail Physics

* **Card Press Lift**:
  ```css
  .theatrical-card:active {
    transform: scale(0.97);
    transition: transform 120ms cubic-bezier(0.2, 0, 0, 1);
  }
  ```
* **Shelf Horizontal Momentum**:
  ```css
  .cinema-shelf-scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    gap: 14px;
    padding-bottom: 8px;
  }
  .cinema-shelf-scroll > * {
    scroll-snap-align: start;
    flex-shrink: 0;
  }
  ```

---

## 4. Accessibility & Reduced Motion

In compliance with modern web guidelines and WCAG 2.2:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .cinema-detail-modal {
    transform: none !important;
  }
}
```
