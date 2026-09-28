# T2L V2.3 — Responsive Strategy & Dock Clearance

## 1. Responsive Viewport Matrix

| Viewport Profile | Width | Top Bar Presentation | Cinema Flow | Radio Cards | Footer Presentation |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Small Phone** (320px–360px) | 320px | Symbol only + 3 icons | Horizontal rails (1.8 peek) | 120px compact tiles | Compact accordion / chevrons |
| **Standard Phone** (375px–390px)| 390px | Symbol only + 3 icons | Horizontal rails (2.2 peek) | 136px compact tiles | Compact accordion / chevrons |
| **Large Phone** (412px–430px) | 412px–430px| Symbol only + 3 icons | Horizontal rails (2.4 peek) | 140px compact tiles | Compact accordion / chevrons |
| **Tablet** (768px–834px) | 768px | Symbol only + 3 icons | Horizontal rails (3.5 peek) | 150px compact tiles | 4-column structured layout |
| **Desktop** (1024px–1440px) | 1024px+ | Symbol only + 3 icons | Horizontal rails (5.5 peek) | 160px compact tiles | 4-column structured layout |

---

## 2. Floating Dock Safe-Area Clearance

The bottom content container enforces strict clearance so that no content is obscured by the floating signature dock:

$$\text{Clearance} = \text{Dock Height (60px)} + \text{Margin Bottom (16px)} + \text{Safe Inset Bottom} + 36\text{px buffer} = 112\text{px} + \text{safe-area-inset-bottom}$$

```css
.t2l-content-container {
  padding-bottom: calc(var(--t2l-dock-height) + var(--t2l-dock-margin-bottom) + var(--t2l-safe-bottom) + 36px);
}
```
