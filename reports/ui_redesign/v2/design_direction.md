# T2L Product Redesign V2 — Design Direction

**Product:** T2L (Television to Live)  
**Version:** V2 Architecture & Interaction Redesign  
**Stage:** Design Exploration & Review (Pre-Implementation Gate)  
**Date:** 2026-09-28  

---

## 1. Vision & Emotional Direction: True Cinematic Immersion

The previous "Aurora Cinema" visual prototype was rejected because it merely restyled existing layouts with purple gradients, cyan glows, and CSS tweaks without rethinking the underlying product architecture. 

**T2L V2 is a ground-up conceptual redesign.**

The core philosophy is:
> **"Content is the canvas. The interface is invisible until summoned."**

### Emotional Attributes
1. **Cinematic Majesty**: Large, high-fidelity imagery, deep atmospheric vignetting, theatrical aspect ratios (2:3 for cinema posters, 16:9 for broadcasts and continue watching).
2. **Intentional Silence**: Removing clutter, removing persistent giant search bars that consume 15% of vertical space, removing noisy badge stickers from thumbnails, and removing spreadsheet-like categorizations.
3. **Ergonomic One-Handed Control**: Floating interactive capsule at the bottom for thumb reach; secondary actions grouped predictably.
4. **Distinct Identity**: T2L should not look like a generic Netflix clone, a standard IPTV m3u playlist viewer, or an Android Material 3 template. It has a signature floating capsule dock, acoustic-focused radio cards, program-aware live TV schedules, and an OLED theater player.

---

## 2. Core Architectural Philosophy: Form Follows Content

| Screen / Modality | Distinct Design Persona | Why It Differs From Other Screens |
| :--- | :--- | :--- |
| **Home** | Curated Theatrical Premiere | Cinematic hero, 2.35-peek trending rails, landscape continue-watching progress cards, and live broadcast spotlights. |
| **Movies** | Curated Cinema Hall | Theatrical 2:3 vertical posters, studio/editorial collections, clean metadata (Year · Genre · Verified Quality), no audio language badges on posters. |
| **Web Series** | Episodic Storyteller | Dedicated season selector tabs, episode cards with horizontal progress scrubbers, episode thumbnails, and episode runtimes. |
| **Live TV** | Broadcast Control Center | 16:9 preview cards, ON AIR badges, current program progress bar, interactive What's On / EPG schedule, viewer count metrics. |
| **Radio** | Acoustic Hi-Fi Station | Dark vinyl aesthetic, station frequency dials, animated audio wave bars, live station logos, and persistent mini-audio dock. |
| **Local Media** | Personal Media Vault | Storage telemetry gauge (e.g. 42 GB / 128 GB), folder hierarchy, video/audio format tags, download queue tracker. |
| **Search** | Instant Full-Screen Spotlight | Summoned intentionally via top-right search icon; instant tokenized results, recent queries, category chips. |
| **Theater Player** | Pure OLED Void | 100% pitch-black canvas, luminous gradient play controls, auto-hiding HUD (3s timeout), one-tap audio track & quality selection. |

---

## 3. What Was Eliminated From V1 (Negative Requirements)

- ❌ **NO permanent giant search bar on Home**: Search is an intentional action, accessed via the top app bar search icon or keyboard shortcut.
- ❌ **NO top category chip bar cluttering Home**: The "Trending / 2025–2026 / Hindi Cinema / Web Series" button strip has been completely removed.
- ❌ **NO audio badges on thumbnails**: Badges like "🎧 Hindi", "🌐 Multi Audio", "English" are banned from poster images. Audio language belongs in Details and Player.
- ❌ **NO bulky green quality banners**: Replaced with clean typography metadata (`2024 · Action · 1080p`).
- ❌ **NO single card fits all**: Dedicated card architectures for Movies, Series, Continue Watching, Live TV, and Radio.
- ❌ **NO dock content overlap**: Fully eliminated with CSS environment safe-area padding formulas.

---

## 4. Design Evaluation Criteria (How V2 Is Judged)
1. **Structure**: Does this feel like an entirely new product from the ground up?
2. **Hierarchy**: Is primary media instantly prominent without distraction?
3. **Ergonomics**: Can it be navigated smoothly with one hand on mobile devices?
4. **Media Truth**: Are verified sources, real audio tracks, and honest quality labels strictly maintained?
5. **Smoothness**: Compositor-only transitions running at 60/120fps.
