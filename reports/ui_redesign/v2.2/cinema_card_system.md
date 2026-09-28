# T2L V2.2 — Cinema Multi-Card Design System

## 1. Five Distinct Cinema Card Types

To eliminate the visual monotony of repetitive card grids, T2L V2.2 introduces a 5-tier card taxonomy engineered for varied narrative depth and visual rhythm:

```
┌────────────────────────────────────────────────────────┐
│ TYPE A: FEATURED PREMIERE CARD (Panoramic 21:9 / 16:9) │
│ • Full-bleed high-impact key art                       │
│ • Floating theatrical title & release metadata         │
│ • Primary & secondary contextual action triggers       │
└────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌───────────────────────────────┐
│ TYPE B:         │       │ TYPE C:                       │
│ STANDARD        │       │ PANORAMIC SAGA CARD (16:10)   │
│ THEATRICAL      │       │ • Multi-season indicator      │
│ POSTER (2:3)    │       │ • Series backdrop             │
│ • Pure artwork  │       │ • Episode count pill          │
│ • Floating text │       └───────────────────────────────┘
│ • Minimal meta  │
└─────────────────┘       ┌───────────────────────────────┐
                          │ TYPE D: CONTINUE WATCHING     │
┌────────────────────────┐│ • 16:9 cinematic still        │
│ TYPE E: EDITORIAL      ││ • Real progress bar fill      │
│ COLLECTION BANNER      ││ • Resume playback glyph       │
│ • Curated shelf themes │└───────────────────────────────┘
└────────────────────────┘
```

---

## 2. Card Specifications

### Type A: Featured Premiere Showcase Card
* **Aspect Ratio**: 16:9 on mobile (`height: 380px`), 21:9 on desktop (`height: 480px`).
* **Content**: Key art backdrop, dark directional gradient overlay (`rgba(7, 9, 13, 0.88)` at bottom), gold/cyan premiere badge (`★ CINEMA SPOTLIGHT`), grand display typography, genuine runtime & year, dual action buttons (`Watch Now`, `Explore Cinema Details`).
* **Interaction**: Subtle 1.02 scale on hover with ambient backlight blooming.

### Type B: Standard Theatrical Film Poster Card
* **Aspect Ratio**: Classic 2:3 vertical theatrical poster (`aspect-ratio: 2 / 3`).
* **Content**: Edge-to-edge poster artwork, subtle inset shadow at bottom, title in medium-bold sans, year and genre separated by centered dot.
* **Prohibitions**: NO ugly emoji badges, NO oversized resolution labels, NO audio language pills.
* **State**: Gentle 4px Y-translation lift and 1.03 scale on hover/touch, with soft drop-shadow `0 12px 28px rgba(0, 0, 0, 0.6)`.

### Type C: Panoramic Series / Saga Card
* **Aspect Ratio**: 16:10 or 2.39:1 scope aspect ratio (`aspect-ratio: 16 / 10`).
* **Content**: Wide cinematic still/key art, corner pill indicating `3 SEASONS` or `EPISODIC EPIC`, episode status, and title.
* **Purpose**: Differentiates episodic narratives from standalone feature films instantly.

### Type D: Continue Watching Card
* **Aspect Ratio**: 16:9 landscape (`aspect-ratio: 16 / 9`).
* **Content**: Captured video frame, play button glyph in glass circle, real progress bar (`height: 3px`) with gradient fill, remaining time counter.
* **Data Integrity**: Only populated when true user playback history exists.

### Type E: Curated Editorial Shelf / Collection Banner
* **Aspect Ratio**: Wide landscape banner (`height: 120px` mobile, `160px` desktop).
* **Content**: Stylized backdrop with editorial headline (e.g., *"The World of High-Stakes Heists"* or *"2024–2026 Modern Masterpieces"*), narrative description, and chevron exploration cue.

---

## 3. Grid Columns & Breakpoints

| Breakpoint | Viewport Width | Grid Columns (Type B) | Shelf Visible Cards |
| :--- | :---: | :---: | :---: |
| **Compact Mobile** | 320px – 360px | **2 Columns** (gap: 10px) | 1.8 peek |
| **Standard Mobile**| 375px – 430px | **2 Columns** (gap: 14px) | 2.2 peek |
| **Tablet** | 768px – 834px | **3–4 Columns** (gap: 16px) | 3.5 peek |
| **Desktop / TV** | 1024px – 1440px | **5–6 Columns** (gap: 20px) | 5.5 peek |
