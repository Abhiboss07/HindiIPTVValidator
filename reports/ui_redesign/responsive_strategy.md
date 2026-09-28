# T2L Aurora Cinema — Responsive Strategy

**Target Spectrum:** Mobile First (320px to 430px) + Tablet & Large Screen Scaling  

---

## 1. Viewport Matrix & Card Sizing

| Viewport Width | Device Archetype | Hero Layout | Carousel Card Width | Cards in View | Bottom Dock Clearance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **320px** | Ultra-compact (iPhone SE 1) | Compact Hero (220px) | `125px` | 2.1 cards | 96px |
| **360px** | Compact Android (Galaxy A) | Balanced Hero (260px) | `138px` | 2.2 cards | 100px |
| **390px** | Standard iOS (iPhone 14/15) | Immersive Hero (300px) | `150px` | 2.3 cards | 104px |
| **412px** | Standard Android (Pixel/Nothing)| Immersive Hero (310px) | `158px` | 2.3 cards | 108px |
| **430px** | Large Mobile (iPhone Pro Max) | Immersive Hero (330px) | `168px` | 2.4 cards | 108px |
| **600px+** | Foldables / Small Tablets | Wide Hero Split (360px) | `180px` | 3.5 cards | 112px |
| **900px+** | Tablets & Desktop Viewports | Cinematic 2-Column Banner | `200px` | 4.5 cards | 120px |

---

## 2. Horizontal Carousel Scroll-Snap Architecture

Using CSS Scroll-Snap and container sizing to guarantee seamless, non-cut-off scrolling:

```css
.aurora-carousel-scroller {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-left: var(--space-md);
  -webkit-overflow-scrolling: touch;
  padding: var(--space-xs) var(--space-md) var(--space-md) var(--space-md);
}

.aurora-carousel-scroller::-webkit-scrollbar {
  display: none;
}

.aurora-media-card {
  flex: 0 0 calc((100vw - 48px) / 2.35);
  max-width: 170px;
  min-width: 120px;
  scroll-snap-align: start;
}
```

---

## 3. Persistent Dock Clearance (Zero Collision Guarantee)

To permanently resolve the bug where cards, live channels, and media lists bleed into or under the bottom navigation:

```css
.page-view {
  padding-bottom: calc(var(--bottom-dock-height) + env(safe-area-inset-bottom, 24px) + 36px) !important;
  box-sizing: border-box;
}
```
