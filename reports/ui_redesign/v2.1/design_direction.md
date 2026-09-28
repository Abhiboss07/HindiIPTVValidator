# T2L Aurora Cinema V2.1 — Design Direction

**Product:** T2L (Television to Live)  
**Version:** V2.1 Iteration Proposal  
**Stage:** Design Exploration & Pre-Implementation Review  
**Date:** 2026-09-28  

---

## 1. Evolution from V2 to V2.1: Key Architectural Shifts

While V2 eliminated the giant permanent search box and bulky card banners, V2.1 takes the product-level visual hierarchy to a true premium tier:

1. **Floating Transparent Art-Aware Header**:
   - The top header is completely transparent, seamlessly floating over the hero artwork with no solid rectangular bar.
   - It only acquires an ultra-subtle ambient glass blur when scrolled past the hero.
   - Search and Settings are removed from the permanent top bar.
   - Right side now houses dedicated **Notifications** (with unread badge) and **Profile / Hub Avatar** controls.
2. **New Standalone T2L Symbol & Brand Identity**:
   - Designed a new geometric, cinematic monogram mark: the **Kinetic Aperture**.
   - Visually expresses transmission, cinema projection, and streaming connectivity without relying on clichéd play-triangle tropes.
   - Functions seamlessly in monochrome, Aurora violet/cyan gradient, and as a scalable app icon / favicon / player watermark.
3. **Restrained 1200ms Cinematic Opening Sequence**:
   - A GPU-compositor-friendly, non-flashy splash reveal:
     - Phase 1: OLED pure black void.
     - Phase 2: Subtle Aurora light sweep across the T2L Kinetic Aperture.
     - Phase 3: Brand mark resolves with soft cyan/violet luminescence.
     - Phase 4: Smooth 300ms fade directly into the Home premiere.
4. **End-of-Content Editorial Footer**:
   - Replaces the abrupt cutoff after the last rail.
   - Features the T2L brand statement (*"Your cinematic media space"*), structured navigation links, product utilities, and build/zero-trust status.
5. **Cinema Page Full Redesign**:
   - Replaced simple category grids with a true Cinema Hall composition:
     - Hero Feature Showcase with deep layered backdrop.
     - Curated Editorial Rails ("Trending Cinema", "2025–2026 New Releases", "IMAX Blockbusters").
     - Segmented genre cards rather than infinite horizontal chip rows.
     - High-density responsive grid (2 columns mobile, 4 tablet, 5–6 desktop).
6. **Live TV Broadcast Control Room**:
   - Completely differentiated from Cinema.
   - **LIVE NOW** flagship broadcast card with current program name, time elapsed, and broadcast description.
   - **Interactive EPG Timeline Preview** (NOW, NEXT, LATER schedule).
   - Dedicated channel collections and broadcast tiles with station logos and red pulsing `ON AIR` indicators.
7. **Radio Acoustic Hi-Fi Station (Spotify-Inspired Polish)**:
   - Bold music artwork, rounded station cards, prominent play button, and animated acoustic equalizer visualizer.
   - Featured station hero with live frequency dial (`102.8 FM`) and currently playing melody metadata.
8. **Local Media Library (Zero Storage Telemetry)**:
   - Storage telemetry (`42.8 GB / 128 GB`) completely removed.
   - Redesigned into a pure personal media vault with segmented media filters (Movies, Videos, TV Shows, Music, Downloads).
   - High-contrast responsive media file grid with clean vector icons.
9. **Unified SVG Iconography (Zero Emojis)**:
   - Banned emojis (`🎬`, `📁`, `🎵`, `📺`, `📻`, `🏠`, `🍿`, etc.) across all UI elements.
   - Replaced with a unified, 1.75px-stroke geometric vector icon set for maximum legibility and elegance.
10. **Refined Floating Signature Capsule Dock**:
    - Re-engineered with ultra-lightweight floating geometry, refined SVG icons, active indicator pill with subtle aurora glow, and mathematical safe-area dock clearance.
