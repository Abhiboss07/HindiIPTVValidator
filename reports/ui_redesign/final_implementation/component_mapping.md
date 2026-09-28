# T2L Final Production UI Implementation — Component Mapping

This document provides a 1:1 mapping between the approved V2.3 prototype design components and the production application's DOM and JavaScript layers.

---

## 1. Landmark & Structural Architecture Mapping

| Approved Prototype Component | Production HTML Target (`index.html`) | Production Logic (`assets/app.js`) | Functionality Preserved |
|---|---|---|---|
| **Nexus Ribbon Symbol** | Header Left Brand Anchor | Global Brand System | Clean SVG symbol vector, zero text wordmark |
| **Header Action Trio** | Header Right Action Icons | `openNotificationsSheet()`, `openProfileSheet()`, `openHamburgerDrawer()` | Bell notification indicator, user profile drawer, hamburger trigger |
| **Hamburger Side-Sheet** | `#hamburgerDrawer` (replacing legacy `#sideDrawerModal`) | `toggleHamburgerDrawer()`, short label handlers | Personal media, utilities, tools, settings modal trigger |
| **Floating Cinematic Dock** | `nav.t2l-dock-nav` (replacing `.obsidian-dock-nav`) | `switchPage(pageId)` | Active tab pill glow, safe-area clearance, 5 primary views (`home`, `movies`/cinema, `live`, `radio`, `local`) |
| **Atmospheric Hero Banner** | `#heroBannerSection` / `#moviesHeroSection` | `renderHomePage()`, `renderMoviesPage()` | Dynamic backdrop poster, IMDb score, runtime, audio pill, direct stream & details actions |
| **Cinema Horizontal Rails** | `#moviesRowsContainer` | `renderMoviesPage()`, `renderMovieCard()` | 100% horizontal scroll rails (*Trending*, *New to Cinema*, *Episodic Sagas*, *Heritage Archive*); **ZERO 2x2 grid** |
| **Radio Compact Tiles** | `#radioStationsContainer` | `renderRadioPage()`, `playRadioStation()` | Refined 44px square art, vinyl turntable visualizer, equalizer animation, zero overflow text |
| **Local Vault V2.1** | `#page-local` media cards | `renderLocalPage()`, `autoScanDeviceMedia()` | Clean category pills (*All*, *Videos*, *Audio*, *Downloads*), vector card tiles, **zero storage telemetry** |
| **OLED Theater Player** | `#playerModal` / `#videoPlayerModal` | `startMovieStream()`, `playChannel()`, Hls.js | Immersive black canvas, auto-hide HUD, watermark symbol, audio/quality selectors |
| **Movie Details Sheet** | `#movieDetailsModal` | `openMovieDetails(id)` | Expanded artwork hero, stream preparation, trailer trigger, episode list, honest badges |
| **Footer Lockup** | `footer.t2l-footer` | Static template | Multi-column desktop / accordion mobile, **zero-trust label strictly absent** |

---

## 2. Design Tokens Mapping (`assets/styles.css`)

```css
:root {
  /* Aurora Cinema Precision Palette */
  --t2l-bg-base: #06080B;
  --t2l-bg-surface: #0A0D14;
  --t2l-bg-surface-elevated: #111622;
  --t2l-bg-glass: rgba(10, 13, 20, 0.72);
  --t2l-bg-glass-heavy: rgba(10, 13, 20, 0.94);

  /* Aurora Brand Accents */
  --t2l-aurora-cyan: #22D3EE;
  --t2l-aurora-teal: #06B6D4;
  --t2l-aurora-purple: #8B5CF6;
  --t2l-aurora-blue: #3B82F6;
  --t2l-aurora-emerald: #10B981;
  --t2l-aurora-rose: #F43F5E;

  /* Typography & Layout Spacing */
  --t2l-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --t2l-radius-sm: 8px;
  --t2l-radius-md: 14px;
  --t2l-radius-lg: 20px;
  --t2l-radius-pill: 9999px;
  --t2l-dock-height: 64px;
}
```

---

## 3. Strict Functional Integrity Constraints
1. **Never alter data-binding signatures**:
   - `startMovieStream(id)`
   - `openMovieDetails(id)`
   - `playChannel(channelId)`
   - `playRadioStation(stationId)`
   - `switchPage(pageId)`
2. **Never alter Android bridge interfaces**:
   - `AndroidMediaBridge.startTorrentStream(...)`
   - `AndroidMediaBridge.getLocalServerPort()`
   - `AndroidMediaBridge.sendStreamStatus(...)`
3. **Never modify movie/series catalog data**:
   - `data/movies_catalog.json` remains strictly untouched.
