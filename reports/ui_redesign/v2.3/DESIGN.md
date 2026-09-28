# T2L V2.3 — Master Design Document

## 1. Summary of Changes

T2L V2.3 is an isolated precision correction iteration focusing strictly on:
1. **Top Bar**: Removed `T2L` wordmark text (symbol only on left), added hamburger menu icon on right, removed "Master Brand System" button.
2. **Hamburger Menu**: Added floating slide-over sheet housing secondary utilities (*My List*, *Continue*, *Downloads*, *Streamer*, *Network*, *Settings*, *About*, *Help*, *Privacy*).
3. **Typography & Labels**: Short visible labels (`Streamer`, `Network`, `Continue`, `Settings`) with full names displayed on desktop hover via non-intrusive tooltips. Strict horizontal layout (`white-space: nowrap`) with zero awkward vertical word breaks.
4. **Cinematic Footer**: Completely redesigned into an editorial closing section with brand lockup, short statement, 4-column structured layout on desktop, and compact expandable layout on mobile.
5. **Cinema Flow**: Removed the 2×2 vertical poster grid entirely; implemented 100% horizontal flowing discovery rails.
6. **Radio Cards**: Reduced station card scale from bulky blocks to compact, refined, high-fidelity tiles while preserving the turntable and equalizer.
7. **Local Media Vault**: Reverted 100% to the approved V2.1 baseline (zero storage telemetry, clean category filters, vector tiles).

---

## 2. Frozen Baseline Verification

* **Home View**: Frozen.
* **Live TV Control Room**: Frozen.
* **Player Modal**: Frozen.
* **Search View**: Frozen.
* **Notifications & Profile Sheets**: Frozen.
* **Floating Capsule Dock**: Frozen.
* **Opening Animation**: Frozen.
* **Production Code**: 100% untouched.

---

## 3. Responsive Geometry

* **Mobile (320px–430px)**:
  * Top bar: 28px standalone symbol, notifications, profile, hamburger.
  * Cinema: Full-bleed hero + horizontal rails (1-2 cards + peek).
  * Radio: Compact cards with 44px artwork.
  * Footer: Compact expandable hierarchy with chevrons.
* **Desktop (1024px+)**:
  * Top bar: Art-aware floating header with subtle blur on scroll.
  * Hamburger: 360px refined floating right panel.
  * Cinema: Rails show 4 to 6 cards horizontally with edge gradients.
  * Footer: 4-column structured grid with closing copyright bar.
