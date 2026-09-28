# T2L Aurora Cinema V2.1 — Component Inventory & Anatomy

**Date:** 2026-09-28  
**Scope:** Reusable Visual & Interactive Component Hierarchy

---

## 1. Floating Art-Aware Header (`t2l-v2-header`)
- **Container**: `position: fixed; top: 0; left: 0; right: 0; height: 56px; z-index: 80;`
- **Initial State**: Completely transparent (`background: transparent; border: none;`).
- **Scrolled State**: Translucent blur (`background: rgba(10, 12, 17, 0.72); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06);`).
- **Left Element**: T2L Kinetic Aperture SVG mark + "T2L" wordmark.
- **Right Elements**:
  - `[🔔 Notifications]` SVG button with red indicator dot.
  - `[👤 Profile]` SVG avatar button.

---

## 2. Opening & Splash Sequence Concepts (`t2l-splash-engine`)

We explored three distinct identity animation concepts:
- **Concept A (Kinetic Aperture Sweep)**: The geometric outer stadium strokes illuminate, followed by a radiant cyan light sweep through the transmission horizon, resolving the T2L wordmark (1100ms duration).
- **Concept B (Signal Pulse)**: An ultra-minimal concentric radar/broadcast pulse emanating from the central emitter, resolving directly into the home hero (950ms duration).
- **Concept C (Prism Horizon)**: A horizontal beam splits into Aurora Violet and Electric Cyan, framing the brand before gracefully fading into Home (1400ms duration).
- **Selected Direction**: **Concept A (Kinetic Aperture Sweep)** for its restrained majesty, GPU compositor efficiency, and immediate brand recognition.

---

## 3. Cinema Page Components
- **Featured Cinema Showcase**: Asymmetrical hero card with high-res layered key art and editorial tagline.
- **Segmented Format Switcher**: Compact glass pill switch: `[ All Cinema | Feature Films | Web Series ]`.
- **Editorial Genre Cards**: 4 photographic genre cards (Action, Crime, Sci-Fi, Bollywood) with subtle gradient overlays.
- **Theatrical Poster Grid**: 2:3 clean poster cards with title, year, genre, and honest quality badge in metadata.

---

## 4. Live TV Control Room Components
- **Flagship Broadcast Card (`live-flagship-card`)**: 16:9 preview with channel logo, program title, time elapsed bar, live viewer count, and direct watch action.
- **EPG Timeline Preview (`live-epg-preview`)**: Displays NOW, NEXT, and LATER scheduled broadcasts with start and end times.
- **Broadcast Category Navigation**: Visual category pills (`News`, `Entertainment`, `Sports`, `Movies`, `Kids`, `Regional`).
- **Live Channel Cards**: 16:9 broadcast card with station logo, channel name, current show title, resolution tag, and red `● ON AIR` badge.

---

## 5. Radio Acoustic Hi-Fi Components
- **Featured Acoustic Card (`radio-featured-card`)**: Bold music artwork with vinyl record disc, live frequency dial, animated audio visualizer equalizer bars, and circular play control.
- **Spotify-Inspired Station Tiles (`radio-music-tile`)**: Rounded square cards with high-contrast artwork, station frequency, and hover/touch play affordance.

---

## 6. Local Media Vault Components (Zero Storage Telemetry)
- **Zero Storage Capacity Bar**: Storage telemetry (`42.8 GB / 128 GB`) completely removed.
- **Media Segments**: `[ All Media | Videos | Audio | Downloads ]`.
- **Media File Tiles**: Clean horizontal cards with vector file icons (video camera, film strip, music note, document), file name, format tag, and file size.

---

## 7. Editorial Product Footer (`t2l-v2-footer`)
- **Brand statement**: *"T2L — Your cinematic media space."*
- **Column 1 (Explore)**: Home, Cinema, Live TV, Radio, Local Vault.
- **Column 2 (Features)**: Search, Downloads, Instant Streamer, My List.
- **Column 3 (Information)**: About T2L, Zero-Trust Engine, Privacy & Safety, Build Status.
- **Copyright & Telemetry**: Clean muted legal note with zero-trust pass indicator.

---

## 8. Refined Floating Signature Capsule Dock (`t2l-capsule-dock`)
- **Dimensions**: `height: 60px; max-width: 420px; border-radius: 9999px;`
- **Surface**: `background: rgba(10, 12, 17, 0.84); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.12);`
- **Tabs (5)**: Home, Cinema, Live TV, Radio, Local (all using unified vector SVG icons).
- **Clearance**: Mathematical safe-area bottom padding guarantees content never collides with the dock.
