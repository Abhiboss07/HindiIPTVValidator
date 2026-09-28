# T2L V2.3 — Cinema Horizontal Discovery System

## 1. The 100% Horizontal Flow Mandate

In V2.2, a vertical `2 × 2` repertory poster grid lingered at the bottom of the Cinema page. In V2.3, this vertical database pattern is **completely eradicated**.

Cinema is transformed into a pure, continuous horizontal discovery pavilion:

```text
HERO: PREMIERE SHOWCASE (Type A)
──────────────────────────────────────────────────────────→

MODE SWITCHER: [ PREMIERES | THEATRICAL | SAGAS ]
──────────────────────────────────────────────────────────→

RAIL 1: TRENDING NOW (Type B - 2:3 Theatrical Posters)
[ Card 1 ][ Card 2 ][ Card 3 ][ Card 4 ] ─────────────────→

RAIL 2: CINEMATIC HORIZONS (Scope 2.39:1 Panoramic Cards)
[ Scope 1 ][ Scope 2 ][ Scope 3 ] ────────────────────────→

RAIL 3: NEW RELEASES & 2024–2026 PREMIERES (Type B Posters)
[ Card 1 ][ Card 2 ][ Card 3 ][ Card 4 ] ─────────────────→

RAIL 4: EPISODIC SAGAS (Type C - 16:10 Multi-Season Cards)
[ Saga 1 ][ Saga 2 ][ Saga 3 ] ───────────────────────────→

RAIL 5: CONTINUE YOUR JOURNEY (Type D - 16:9 Backdrop Cards)
[ Continue 1 ][ Continue 2 ] ─────────────────────────────→

RAIL 6: THE VAULT & HERITAGE ARCHIVE (Type B Theatrical Cards)
[ Vault 1 ][ Vault 2 ][ Vault 3 ][ Vault 4 ] ─────────────→
```

---

## 2. Card Proportions & Projections

| Discovery Rail | Format | Aspect Ratio | Mobile Card Width | Desktop Card Width |
| :--- | :---: | :---: | :---: | :---: |
| **Premiere Hero** | Type A | 16:9 / 21:9 | 100% full-bleed (`height: 380px`) | 100% widescreen (`height: 480px`) |
| **Trending Now** | Type B | 2:3 vertical | `140px` (2.2 card peek) | `180px` (5.5 card peek) |
| **Cinematic Horizons**| Scope | 2.39:1 landscape | `260px` (1.3 card peek) | `360px` (3.2 card peek) |
| **New Releases** | Type B | 2:3 vertical | `140px` (2.2 card peek) | `180px` (5.5 card peek) |
| **Episodic Sagas** | Type C | 16:10 scope | `240px` (1.4 card peek) | `320px` (3.5 card peek) |
| **Continue Journey** | Type D | 16:9 frame | `220px` (1.5 card peek) | `280px` (4.0 card peek) |
| **The Vault & Heritage**| Type B | 2:3 vertical | `140px` (2.2 card peek) | `180px` (5.5 card peek) |

---

## 3. Responsive Touch & Momentum Scrolling

* **Scroll Physics**:
  ```css
  .content-rail-scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 14px;
    padding: 0 16px 8px 16px;
    scrollbar-width: none;
  }
  .content-rail-scroll::-webkit-scrollbar {
    display: none;
  }
  .content-rail-scroll > * {
    scroll-snap-align: start;
    flex-shrink: 0;
  }
  ```
* **Desktop Enhancements (1024px+)**:
  * Rails dynamically show 4 to 6 full cards with subtle edge gradient masks indicating further content.
  * Card hover states lift cards gently by `-4px` with a soft bloom shadow (`0 12px 28px rgba(0, 0, 0, 0.7)`).
