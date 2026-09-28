# T2L Aurora Cinema V2 — Component Inventory & Anatomy

**Date:** 2026-09-28  
**Scope:** Reusable Visual & Interactive Component Hierarchy

---

## 1. Top App Bar (`T2L-Header`)
- **Left**: T2L Wordmark logo in Aurora gradient with subtle television antenna glyph.
- **Center**: Contextual view title (e.g., "Cinema", "Live TV", "Radio") or hidden on Home.
- **Right**:
  - `[🔍 Search]` Icon button (48x48px target).
  - `[⚙ Hub / Settings]` Icon button (48x48px target).
- **Surface**: Sticky top, `height: 56px; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06);`.

---

## 2. Cinematic Hero Premiere (`Hero-Premiere`)
- **Dimensions**: Full screen width, `height: clamp(380px, 55vh, 460px);`.
- **Media**: High-resolution backdrop image with 3-stop vertical gradient scrim (`rgba(6,7,9,0) 0% -> rgba(6,7,9,0.5) 50% -> #060709 100%`).
- **Badge**: Top tag e.g. `★ PREMIERE SPOTLIGHT` or `● ON AIR`.
- **Typography**:
  - Title: 28px bold, white.
  - Metadata: `2024 · 2h 28m · Hindi · 4K UHD`.
  - Synopsis: 2-line clamped description (`-webkit-line-clamp: 2`).
- **Actions**:
  - Primary button: `[ ▶ Watch Now ]` — Aurora gradient background (`#8B5CF6 -> #22D3EE`), black/white text, 48px touch height.
  - Secondary button: `[ + My List ]` — Translucent glass button (`background: rgba(255,255,255,0.1)`), 48px touch height.

---

## 3. Theatrical Rail (`Content-Rail`)
- **Header**: Section title in 18px 700 weight (e.g. `🔥 Trending Cinema`) + `See All →` link.
- **Scroll Container**: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 14px; scroll-padding: 0 16px;`.
- **Card Peek Formula**: Cards enforce `flex: 0 0 clamp(140px, 38vw, 175px)` ensuring 2 full cards and exactly 1 partial peek card visible on any mobile viewport (320px–430px).

---

## 4. Cards Catalog

| Component Name | Aspect Ratio | Dimensions (Mobile) | Target Content |
| :--- | :--- | :--- | :--- |
| `MoviePosterCard` | `2:3` | 150px x 225px | VOD Movies, Hollywood, Bollywood |
| `SeriesPosterCard` | `2:3` | 150px x 225px | Episodic Web Series (with season count) |
| `ContinueWatchingCard` | `16:9` | 240px x 135px | In-progress media with progress bar |
| `LiveChannelCard` | `16:9` | 220px x 124px | Live IPTV channels with EPG program |
| `RadioStationCard` | `1:1` | 160px x 160px | Audio streams with vinyl dial & visualizer |
| `LocalFileCard` | `Horizontal Tile`| 100% x 64px | Device storage video/audio files |

---

## 5. Floating Capsule Dock (`Capsule-Dock`)
- **Structure**: Floating rounded-full pill centered at the bottom of the viewport.
- **Dimensions**: `height: 60px; max-width: 440px; margin: 0 auto;`.
- **Tabs (5)**:
  1. `Home` (House icon)
  2. `Live TV` (TV monitor icon)
  3. `Radio` (Radio broadcast tower icon)
  4. `Cinema` (Film clapperboard icon)
  5. `Local` (Folder library icon)
- **Active Treatment**: `background: rgba(139, 92, 246, 0.16); color: #22D3EE; border-radius: 9999px; font-weight: 700;`.

---

## 6. Full-Screen Spotlight Search (`Spotlight-Search`)
- **Structure**: Overlay dialog filling 100% viewport.
- **Header**: Back chevron + search input field with autofocus and clear button.
- **Category Filter**: `[ All ] [ Movies ] [ Series ] [ Live TV ] [ Radio ]`.
- **Empty State**: "Recent Searches" history chips + "Popular Searches" pills.
- **Result Grid**: 2-column or 3-column responsive card grid.

---

## 7. Movie Details Modal (`Details-Experience`)
- **Header Backdrop**: 16:9 cinematic still with bottom fade scrim.
- **Identity Block**: Poster (2:3) overlapping the header backdrop; title, director, IMDb rating, year, runtime.
- **Primary CTA**: Full-width or dual action buttons: `[ ▶ Stream Direct (1080p) ]` & `[ 📥 Download ]`.
- **Specs Bento Grid**:
  - `Video Codec`: H.264 / AVC
  - `Audio Track`: Hindi Master (5.1 AAC)
  - `File Size`: 1.2 GB
  - `Source Integrity`: Verified Archive.org / Direct HTTP
- **Synopsis Block**: Full expandable storyline.
- **Audio & Quality Selector**: Interactive verified pills.

---

## 8. Web Series Details Experience (`Series-Experience`)
- **Identity Block**: Series artwork, title, total seasons, total episodes.
- **Season Switcher**: Horizontal tab bar (`[ Season 1 ] [ Season 2 ] ...`).
- **Episode List**: Vertical stacked list of episode rows:
  - 16:9 thumbnail preview.
  - Episode index & title (`E01 · Winter Is Coming`).
  - Episode duration (`62 min`).
  - Play icon button.

---

## 9. OLED Theater Player HUD (`Theater-HUD`)
- **Viewport**: 100% viewport, pure pitch black `#000000`.
- **HUD Auto-Hide**: Fades out after 3000ms of user inactivity.
- **Top Bar**:
  - Back button (48x48px).
  - Current Title & Subtitle.
  - Quality selector button (`1080p FHD`).
  - Audio language selector button (`Hindi`).
- **Center Controls**:
  - Seek -10s button.
  - Primary 64x64px Luminous Play/Pause button with aurora glow.
  - Seek +10s button.
- **Bottom Bar**:
  - Custom gradient seekbar with buffered bar & glowing cyan thumb.
  - Timestamp (`01:24:18 / 02:45:00`).
  - Subtitles, PiP, Fullscreen icons.
