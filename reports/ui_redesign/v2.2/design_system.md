# T2L V2.2 — Design System & Design Tokens

## 1. Master Token Dictionary

```css
:root {
  /* Surface Layers (Deep OLED & Space Zinc) */
  --t2l-bg-base: #07090D;
  --t2l-surface-1: #0D1117;
  --t2l-surface-2: #161B22;
  --t2l-surface-3: #21262D;
  --t2l-surface-glass: rgba(13, 17, 23, 0.72);
  --t2l-dock-glass: rgba(10, 12, 16, 0.82);

  /* Aurora Brand Accents */
  --t2l-brand-violet: #8B5CF6;
  --t2l-brand-indigo: #6366F1;
  --t2l-brand-cyan: #22D3EE;
  --t2l-brand-emerald: #10B981;
  --t2l-brand-rose: #F43F5E;
  --t2l-brand-amber: #F59E0B;

  /* Cinema Specific Gradients */
  --t2l-grad-aurora: linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #22D3EE 100%);
  --t2l-grad-theatre-scrim: linear-gradient(180deg, rgba(7, 9, 13, 0) 0%, rgba(7, 9, 13, 0.6) 60%, #07090D 100%);
  --t2l-grad-card-bottom: linear-gradient(0deg, rgba(7, 9, 13, 0.94) 0%, rgba(7, 9, 13, 0.4) 50%, transparent 100%);

  /* Typography */
  --t2l-font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif;
  --t2l-font-mono: "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;

  /* Text Colors */
  --t2l-text-primary: #FFFFFF;
  --t2l-text-secondary: #E2E8F0;
  --t2l-text-muted: #94A3B8;
  --t2l-text-tertiary: #64748B;

  /* Borders & Highlights */
  --t2l-border-subtle: rgba(255, 255, 255, 0.08);
  --t2l-border-glow: rgba(139, 92, 246, 0.35);

  /* Radius & Shadows */
  --t2l-radius-sm: 8px;
  --t2l-radius-md: 14px;
  --t2l-radius-lg: 20px;
  --t2l-radius-xl: 28px;
  --t2l-radius-pill: 9999px;

  --t2l-shadow-dock: 0 16px 36px -4px rgba(0, 0, 0, 0.6), 0 0 24px -2px rgba(139, 92, 246, 0.2);
  --t2l-shadow-card: 0 10px 24px -2px rgba(0, 0, 0, 0.5);
}
```

---

## 2. Typography Scale

* **Display 1 (Cinema Premiere)**: `32px` / line-height `1.15` / weight `800`
* **Title 1 (Page Title)**: `24px` / line-height `1.25` / weight `800`
* **Title 2 (Shelf Title)**: `18px` / line-height `1.3` / weight `700`
* **Title 3 (Card Title)**: `14px` / line-height `1.35` / weight `600`
* **Body (Synopsis / Descriptions)**: `13px` / line-height `1.45` / weight `400`
* **Caption / Meta**: `11px` / line-height `1.4` / weight `500` / tracking `0.04em`
* **Micro (Badges / Counters)**: `9px` / weight `700` / uppercase / tracking `0.08em`
