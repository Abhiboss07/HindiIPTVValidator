# T2L Final Production UI Implementation — Forensic Baseline

## 1. Executive Overview
- **Project**: T2L (Television to Live)
- **Status**: Production UI/UX Modernization
- **Source of Truth**: Approved Design Prototype V2.3 (`reports/ui_redesign/v2.3/`)
- **Strict Mandate**: 100% faithful visual translation of approved prototype; **ZERO** regressions to media playback, catalog integrity, audio/video track selection, or Android native bridge.

---

## 2. Production Files Inventory

| File Path | Role | Lines / Size | Status |
|---|---|---|---|
| `index.html` | Root Web Application Markup | 2,003 lines | Landmark structure refactoring to Aurora Cinema standards |
| `assets/styles.css` | Production CSS Stylesheet | 5,950 lines | Integrated with approved V2.3 design tokens, typography, dock, rails, and modals |
| `assets/app.js` | Production Application Logic | 20,211 lines | Presentation layer alignment while preserving 100% of functional pipelines |
| `data/movies_catalog.json` | Media Metadata Truth | 52 items | **FROZEN** (zero fabrication, preserved accurate audio/video states) |
| `build_apk.sh` | Android Build & Asset Packaging | 62 lines | Synchronizes `index.html`, `assets/`, `data/` to `android_app/src/main/assets/` |
| `android_app/...` | Android Native Java Bridge & Host | Java 11 / WebView | Preserved native interfaces and local streaming bridges |

---

## 3. Structural Deltas: Current Production vs. Approved Prototype

### 3.1 Header
- **Current Production**: Obsidian header with wordmark and clutter.
- **Approved V2.3**:
  - Transparent pinned header with `backdrop-filter: blur(20px)` on scroll.
  - **Left**: Nexus Ribbon vector symbol **ONLY** (no textual "T2L" wordmark).
  - **Right**: Notifications bell, Profile avatar, Hamburger drawer button.
  - **Removed**: "Master brand system" button and header search field.

### 3.2 Navigation & Drawer
- **Current Production**: Standard bottom bar and legacy drawer.
- **Approved V2.3**:
  - Floating cinematic pill dock (`.t2l-dock-nav`) with frosted glass and glowing active pills.
  - Primary tabs: `Home`, `Cinema`, `Live`, `Radio`, `Vault` (Local).
  - Slide-over utility drawer (`#hamburgerDrawer`) on the right containing Personal Media, Tools, Information, short labels, and tooltips. Settings relocated inside the drawer.

### 3.3 Cinema Discovery
- **Current Production**: Mixed horizontal shelves ending in a `2 × 2` or dense vertical catalog grid (`#moviesGridSection`).
- **Approved V2.3**:
  - **100% Horizontal Discovery Rails** across all shelves.
  - Vertical grid completely eliminated.
  - Theatrical 2:3 posters, Series 16:9 cards, Continue Watching with progress bars.

### 3.4 Radio Experience
- **Current Production**: Large card containers.
- **Approved V2.3**: Compact, refined station tiles with vinyl turntable visualizer and equalizer animation.

### 3.5 Local Media Vault
- **Current Production**: Experimental telemetry gauges and capacity bars.
- **Approved V2.3**: Clean V2.1 restoration — category pills (*All*, *Videos*, *Audio*, *Downloads*), vector cards, **zero storage telemetry**.

### 3.6 Footer
- **Current Production**: Outdated or absent footer structure.
- **Approved V2.3**:
  - Brand identity lockup with statement: *"Your cinematic media space."*
  - Multi-column desktop layout (`Navigation`, `Discover`, `Tools`, `Information`).
  - Mobile compact expandable layout with chevron cues (`›`).
  - **Strictly ABSENT**: "Zero-Trust Architecture" or any security architecture wording.

---

## 4. Preservation Boundaries (Untouchable Functional Logic)
1. **Catalog Integrity**: All 52 catalog items, legitimate stream URLs, trailer URLs, and quality badges must remain untouched.
2. **Playback Pipelines**:
   - `startMovieStream`, `forceLaunchPreparedStream`, `playSeriesEpisode`.
   - `playChannel`, `loadChannelMedia` (Hls.js / ExoPlayer bridge).
   - Audio language track selector (`CANONICAL_LANG_MAP`, `setVlcAudioTrack`).
   - Video quality switching (`setMovieQuality`).
3. **Android Bridge**: `@JavascriptInterface` bridge methods and local port handlers.
4. **Data Cache**: `localStorage` keys for watch history, continue watching, favorites, and downloads.
