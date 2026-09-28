# T2L Aurora Cinema V2 — Redesign Decisions Log

**Date:** 2026-09-28  
**Scope:** Architectural, Visual & Interaction Rationale

---

## 1. Decision 1: Complete Separation of Search into an Intentional Full-Screen Spotlight
- **Problem**: V1 placed a massive permanent search bar (`height: 48px`, taking up ~15% of vertical space above the fold) on the Home screen. This pushed down the cinematic hero banner and made the app look like an internal admin database or file directory rather than a streaming service.
- **Solution**: Search was moved to a deliberate icon button in the top app bar (`[🔍]`). Tapping it smoothly opens a dedicated full-screen Spotlight Search overlay with recent searches, trending pills, scope filters (`[All] [Movies] [Series] [Live] [Radio]`), and real-time results.
- **Benefit**: Reclaims 70px of vertical space for the cinematic hero artwork; provides a much more powerful and focused search experience when the user actually wants to search.

---

## 2. Decision 2: Elimination of Category Shortcut Strips on Home
- **Problem**: V1 featured a horizontal strip of category buttons ("Trending", "2025–2026", "Hindi Cinema", "Web Series", "Top Rated") directly under the hero banner. This created visual noise, redundant navigation pathways, and competed with the bottom navigation dock.
- **Solution**: Completely removed the shortcut strip. Category discovery is now organic through curated editorial content rails on Home ("🔥 Trending Now", "✦ 2025–2026 Upcoming Tentpoles", "📺 Live Broadcasts Now"), and via dedicated filter chips on the Cinema and Live TV pages.
- **Benefit**: Clean, uninterrupted editorial flow with high visual impact.

---

## 3. Decision 3: Removal of Thumbnail Language and Quality Badges
- **Problem**: V1 plastered green quality badges ("4K UHD", "1080p FHD") and language pills ("🎧 Hindi", "🌐 Multi Audio") directly over poster images. This severely degraded the artistic aesthetic of movie posters.
- **Solution**: Banned badges from poster thumbnails. Poster images now render cleanly in 2:3 aspect ratio. Quality tags and language availability are placed cleanly in the metadata line beneath the title (`2024 · Hindi · 1080p`) and fully detailed in the Movie Details modal and Player HUD.
- **Benefit**: Theatrical movie posters feel premium and unvandalized, matching Apple TV+ and HBO Max design standards.

---

## 4. Decision 4: Dedicated Card Architectures for Different Media Types
- **Problem**: V1 attempted to force a single vertical movie card design onto every media type, making live channels and radio stations feel like poorly fitted movies.
- **Solution**: Created 5 distinct card types:
  1. **Movie Cards**: 2:3 vertical theatrical poster.
  2. **Series Cards**: 2:3 vertical poster with subtle episode/season indicators.
  3. **Continue Watching**: 16:9 landscape backdrop with embedded cyan progress bar and play glyph.
  4. **Live TV Cards**: 16:9 broadcast still with `● LIVE` badge, station logo, and EPG program title.
  5. **Radio Station Cards**: Dark square acoustic tile with vinyl disc art, station frequency, and live audio wave visualizer.
  6. **Local Media**: Clean horizontal file tile with storage size and media format indicators.
- **Benefit**: Each content type is presented in its natural, optimal layout.

---

## 5. Decision 5: Signature Floating Capsule Dock with Native Clearance
- **Problem**: V1 navigation bar collided with the bottom of list content and looked like a generic Android bottom navigation.
- **Solution**: Designed a signature floating capsule island dock (`border-radius: 9999px; height: 60px; max-width: 440px; margin: 0 auto;`), elevated 16px from the bottom with frosted blur and glowing active indicators. Coupled with mathematical safe-area bottom padding on `.view-content-wrapper`, content scrolls completely clear of the dock.
- **Benefit**: Distinct T2L product signature, highly ergonomic for one-handed thumb navigation, zero visual collisions.

---

## 6. Decision 6: OLED Pitch-Black Theater Mode
- **Problem**: V1 player modal lacked immersion and had cluttered controls that remained visible.
- **Solution**: V2 Player is 100% pitch black (`#000000`) for true OLED power savings and immersion. Playback controls fade out automatically after 3000ms of user inactivity. The central play button features an Aurora gradient glow, and the seekbar thumb radiates a high-contrast `#22D3EE` cyan accent.
- **Benefit**: World-class theater immersion with intuitive contextual controls.
