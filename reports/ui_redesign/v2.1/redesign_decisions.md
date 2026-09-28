# T2L Aurora Cinema V2.1 — Redesign Decisions Log

**Date:** 2026-09-28  
**Scope:** Architectural, Visual & Interaction Rationale

---

## 1. Decision 1: Floating Transparent Art-Aware Header
- **Problem in V2**: The header had a permanent blurred surface that created a dark band across the top of hero artwork.
- **V2.1 Solution**: Made the header completely transparent by default. It floats over the theatrical artwork and only gains a subtle ambient glass blur when the user scrolls past the hero.
- **Benefit**: Seamless, uninterrupted cinematic key art presentation matching Apple TV+ / Disney+ premiere experiences.

---

## 2. Decision 2: Elimination of Search & Settings from Top Bar
- **Problem in V2**: The top bar still had search and settings buttons competing for visual attention.
- **V2.1 Solution**: Removed Search and Settings from the top bar. Search is accessed via a dedicated search action in the hub or bottom navigation; Settings lives in the Profile / Hub drawer. The top right is now dedicated to **Notifications** (with unread indicator) and **Profile Avatar**.
- **Benefit**: Much cleaner, uncluttered top bar with clear utility focus.

---

## 3. Decision 3: Redesigned T2L Symbol & Identity
- **Problem in V2**: The logo relied on a generic badge rectangle.
- **V2.1 Solution**: Designed the **Kinetic Aperture** monogram mark. An outer continuous stadium stroke framing a transmission prism and focal horizon.
- **Benefit**: Unique, scalable mark suitable for app icons, splash screens, watermarks, and favicons.

---

## 4. Decision 4: Addition of an Editorial Product Footer
- **Problem in V2**: The page ended abruptly after the final rail, leaving an unpolished empty gap above the bottom dock.
- **V2.1 Solution**: Designed a clean, premium editorial footer with the T2L brand statement (*"Your cinematic media space"*), structured navigation links, product features, and zero-trust build status.
- **Benefit**: Gives the application a sense of completion and architectural polish.

---

## 5. Decision 5: Live TV Broadcast Control Room Experience
- **Problem in V2**: Live TV was presented as a generic card list with basic category filters.
- **V2.1 Solution**: Restructured Live TV as a true broadcast control room: a **LIVE NOW** flagship broadcast showcase, an **interactive EPG timeline preview** (NOW, NEXT, LATER schedule), and broadcast channel tiles with station logos and red pulsing `ON AIR` badges.
- **Benefit**: Communicates live television rather than on-demand movies.

---

## 6. Decision 6: Spotify-Inspired Radio Acoustic Experience
- **Problem in V2**: Radio stations used generic cards.
- **V2.1 Solution**: Created an acoustic Hi-Fi station layout inspired by modern music streaming: bold album/station artwork, live frequency dials, vinyl record aesthetics, and subtle animated audio visualizer equalizer bars.
- **Benefit**: Radio looks and feels like an audio/music product.

---

## 7. Decision 7: Complete Removal of Storage Telemetry from Local Page
- **Problem in V2**: Local media displayed a device-storage gauge (`42.8 GB / 128 GB`), making the screen feel like a system utility or disk manager.
- **V2.1 Solution**: Completely removed storage capacity and usage bars. The screen is now a pure **personal media library** with category segments (Movies, Videos, TV Shows, Music, Downloads) and clean vector file tiles.
- **Benefit**: Focused entirely on user media enjoyment.

---

## 8. Decision 8: Complete Ban on UI Emojis (Unified SVG System)
- **Problem in V2**: Emojis (`🎬`, `📁`, `🎵`, `📺`, `📻`, `🏠`, `🍿`, `🏏`, etc.) were used in category filters and tiles, looking amateur and rendering inconsistently across Android and iOS.
- **V2.1 Solution**: Replaced 100% of emojis with a custom, unified geometric SVG vector icon system with uniform stroke weights.
- **Benefit**: High-end, consistent, and professional appearance.
