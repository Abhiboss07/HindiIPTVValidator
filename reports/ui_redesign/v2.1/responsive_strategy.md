# T2L Aurora Cinema V2.1 — Responsive & Ergonomic Strategy

**Target Device Matrix:**
- Small Phone: 320 × 640 (iPhone SE 1st Gen)
- Compact Phone: 360 × 780 (Galaxy S20)
- Modern Flagship Phone: 390 × 844 (iPhone 12/13/14, Pixel 7a)
- Large Android Phone: 412 × 915 (Nothing Phone 1/2, Pixel 7 Pro)
- Max / Ultra Phone: 430 × 932 (iPhone 15 Pro Max, S24 Ultra)
- Tablet / Foldable: 768 × 1024 / 800 × 1280
- Desktop / TV: 1024 × 768 to 1920 × 1080

---

## 1. Breakpoint Grid Matrix

| Breakpoint | Viewport Range | Cinema Grid | Live TV Grid | Radio Bento | Navigation Model |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile Compact** | `< 360px` | 2 columns | 1 column | 2 columns | Floating Capsule Dock |
| **Mobile Standard** | `360px – 480px` | 2 columns | 1 column | 2 columns | Floating Capsule Dock |
| **Tablet / Foldable**| `481px – 840px` | 3–4 columns | 2 columns | 3 columns | Floating Capsule Dock |
| **Desktop / TV** | `> 840px` | 5–6 columns | 3 columns | 4 columns | Centered Capsule Dock |

---

## 2. Safe Area Insets & Dock Clearance

Content padding guarantees zero overlap with the floating bottom dock:
```css
:root {
  --t2l-dock-height: 60px;
  --t2l-dock-margin-bottom: 16px;
  --t2l-safe-bottom: env(safe-area-inset-bottom, 16px);
}

.t2l-content-container {
  padding-bottom: calc(var(--t2l-dock-height) + var(--t2l-dock-margin-bottom) + var(--t2l-safe-bottom) + 36px) !important;
}
```
