# T2L V2.2 — Responsive Strategy & Dock Clearance

## 1. Responsive Viewport Matrix

| Device Profile | Viewport Width | Cinema Hero Height | Theatrical Poster Columns | Shelf Card Peek |
| :--- | :---: | :---: | :---: | :---: |
| **Small Phone** (iPhone SE) | 320px – 360px | 320px | **2 Columns** (gap: 10px) | 1.8 Cards |
| **Standard Phone** (iPhone 14/15/16) | 375px – 390px | 360px | **2 Columns** (gap: 12px) | 2.2 Cards |
| **Large Phone** (Pixel 8 Pro, Galaxy S24) | 412px – 430px | 380px | **2 Columns** (gap: 14px) | 2.3 Cards |
| **Tablet Portrait** (iPad Mini/Air) | 768px – 834px | 420px | **3–4 Columns** (gap: 16px) | 3.5 Cards |
| **Desktop / Laptop** (MacBook, PC) | 1024px – 1440px | 480px | **5–6 Columns** (gap: 20px) | 5.5 Cards |

---

## 2. Floating Dock Clearance Formula

To guarantee that cards at the very bottom of the Cinema page are never obscured by the floating signature navigation dock, the bottom padding is calculated as:

$$\text{Padding Bottom} = \text{Dock Height (64px)} + \text{Floating Offset (24px)} + \text{Safe Clearance (32px)} + \text{env(safe-area-inset-bottom)} = 120\text{px} + \text{env(safe-area-inset-bottom)}$$

```css
.t2l-content-container {
  padding-bottom: calc(120px + env(safe-area-inset-bottom, 20px));
}
```

---

## 3. Desktop Ergonomics (1024px+)

At 1024px and wider:
1. Max container width is constrained to `1320px` with automatic centering (`margin: 0 auto;`).
2. Hero artwork expands to a 21:9 Cinemascope ratio.
3. Poster grids automatically reflow into 5 to 6 balanced columns.
4. Curated shelves feature visible horizontal navigation arrows with subtle hover effects.
