# T2L Aurora Cinema V2.1 — Information Architecture

**Product:** T2L (Television to Live)  
**Date:** 2026-09-28  

---

## 1. Global Navigation & Layout Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│ TRANSPARENT ART-AWARE TOP BAR:                              │
│ [⧉ T2L Mark + Wordmark]            [🔔 Notifications] [👤 Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      CONTENT CANVAS                         │
│                                                             │
│   (Home / Cinema / Live TV / Radio / Local Vault / Search)  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ EDITORIAL PRODUCT FOOTER                                    │
│   [ T2L Brand Statement · Navigation · Product · Status ]   │
├─────────────────────────────────────────────────────────────┤
│ REFINED FLOATING SIGNATURE CAPSULE DOCK                     │
│   [ ⌂ Home ]  [ ⊞ Cinema ]  [ ⧉ Live ]  [ ∿ Radio ]  [ 📁 Local ] │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Screen Information Hierarchy

### 1. Home (`/home`)
- **Top Bar**: Transparent, floating directly over hero backdrop art. Redesigned T2L Kinetic Aperture logo on the left; Notification bell + Profile avatar on the right.
- **Cinematic Hero**: Full-bleed 16:9 theatrical key art with smooth 3-stop vertical gradient fade, title, metadata (`2024 · 2h 28m · Hindi Master · 4K UHD`), synopsis, `[ ▶ Watch Now ]` and `[ Details ]`.
- **Continue Watching Rail**: 16:9 landscape cards with embedded cyan progress bars (`18m left (72%)`) and centered play glyphs.
- **Trending Cinema Rail**: 2:3 theatrical posters utilizing the 2.35 card peek formula (`2 full cards + 1 partial peek card`). Clean title, year, and verified quality pill.
- **2025–2026 Upcoming Tentpoles Rail**: Upcoming cinema with honest "In Theaters 2026" / "Trailer Only" metadata.
- **Live Broadcast Spotlight**: 16:9 channel preview cards with pulsing red `● LIVE` badge, station logo, program title, and viewer count.
- **Editorial Footer**: Brand statement, quick links, zero-trust telemetry indicator, copyright.

### 2. Cinema & Web Series (`/cinema`)
- **Cinema Hero Showcase**: Deep layered backdrop featuring the editor's pick of the month.
- **Format Toggle**: Minimal pill segmented control: `[ All Cinema | Feature Films | Web Series ]`.
- **Editorial Category Cards**: Rich photographic genre cards (e.g. *Action & High-Octane*, *Intense Crime Thrillers*, *Bollywood Masterpieces*, *Sci-Fi & Cyberpunk*) replacing generic text chips.
- **Curated Rails**: "Blockbuster Hits", "Critically Acclaimed", "Recently Added".
- **Responsive Theatrical Grid**: 2 columns mobile, 4 columns tablet, 5–6 columns desktop.

### 3. Movie Details Modal
- **Cinematic Header**: 16:9 high-res theatrical still with gradient vignette and floating 48px close button.
- **Identity Block**: 2:3 vertical poster thumbnail overlapping the header; title, director, IMDb rating, release year, runtime, verified quality pill.
- **Action Buttons**: `[ ▶ Stream Direct (1080p) ]` (primary luminous) and `[ 📥 Download ]` (secondary glass).
- **Technical Specs Bento Grid**: 4-column card detailing Codec (H.264/AVC), Audio (Hindi Master 5.1), File size, and License.
- **Storyline**: Expandable synopsis with cast & crew chips.

### 4. Series Details Modal
- **Series Header**: Key art backdrop with series title, total seasons, total episodes, genre.
- **Season Switcher**: Clean horizontal tab bar (`[ Season 1 ] [ Season 2 ]`).
- **Episode List**: Vertical stacked rows featuring 16:9 episode thumbnail, episode index & title (`E01 · Gram Panchayat Phulera`), duration, audio language, and play button.

### 5. Live TV Broadcast Control Room (`/live`)
- **LIVE NOW Flagship Broadcast**: Large featured broadcast card showing active on-air stream snapshot, station logo, program name, elapsed time progress bar, and immediate `[ Watch Live ]` CTA.
- **Interactive EPG Timeline Preview**: Horizontal time slots (NOW, NEXT, LATER) showing upcoming schedules for top channels.
- **Broadcast Category Navigation**: Visual category pills (`News`, `Entertainment`, `Sports`, `Movies`, `Kids`, `Regional`).
- **Channel Broadcast Grid**: 16:9 broadcast tiles with channel logo, channel name, current show title, resolution tag, and red `● ON AIR` badge.

### 6. Radio Acoustic Hi-Fi Station (`/radio`)
- **Featured Station Card**: Bold music artwork, vinyl disc aesthetic with animated acoustic equalizer bars, station name (`Vividh Bharati`), frequency (`102.8 FM`), current program, and large circular play control.
- **Spotify-Inspired Station Tiles**: Rounded square cards with high-contrast station artwork, station frequency, and hover/touch play affordance.
- **Category Filter**: `[ All Stations | FM Radio | Akashvani National | Classical & Melodies ]`.

### 7. Local Media Vault (`/local`)
- **Header**: "Local Media Vault" with descriptive subtext.
- **Zero Storage Telemetry**: Absolutely no storage capacity bars or used/free disk space statistics. Pure personal media focus.
- **Media Segments**: `[ All Media | Videos | Audio | Downloads ]`.
- **Media File Grid**: Responsive tiles with clean vector icons (movie reel, video camera, music note, document), file name, format tag (`.mp4`, `.mkv`), and duration.

### 8. Spotlight Search Overlay (`/search`)
- **Full-Screen Canvas**: Summoned via top-bar search button.
- **Search Header**: Back chevron, auto-focused search input, and instant ✕ clear button.
- **Scope Pills**: `[ All | Movies | Web Series | Live TV | Radio ]`.
- **Recent Searches & Trending Tags**: Tokenized pill chips.
- **Live Results Grid**: Dynamic 2-column card grid with content-type badges.

### 9. Secondary Panels
- **Notification Panel (Slide-Over)**: Lists system announcements, new cinema additions, and download completion alerts.
- **Profile & Control Hub**: Slide-over drawer with user profile, Downloads Manager, Instant Magnet Streamer, Network Speed Diagnostics, Audio Defaults, and Zero-Trust System Status.
