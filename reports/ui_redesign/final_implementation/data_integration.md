# T2L Production Data Integration & Architecture Contract

## Forensic Audit Findings & Root Causes

### 1. Disconnect Between Prototype Shell and Data Pipelines
When the approved V2.3 prototype HTML was assembled into production `index.html`:
- The DOM element IDs and container tags that the production JavaScript (`assets/app.js`) populated were replaced by static prototype mock cards.
- Specifically:
  - **Home**: `homeLiveNowList`, `homeBollywoodRow`, `homeWebSeriesRow`, `homeAsianRow`, `homeHollywoodRow`, `homeMovieContinueRow` were missing from `#page-home`.
  - **Cinema**: `moviesHeroCard`, `moviesBollywoodRow`, `moviesWebSeriesRow`, `moviesAsianRow`, `moviesHollywoodRow`, etc., were replaced by hardcoded prototype markup.
  - **Live TV**: `liveChannelsFeed`, `liveChannelsCountTitle`, `liveCountryChips`, `liveCategoryChips` were missing from `#page-live`.
  - **Radio**: `radioStationsFeed`, `radioFilterChips` were missing from `#page-radio`.
  - **Local Vault**: `localFoldersGrid`, `localMediaFolderFeed`, `autoScanStatusText` were missing from `#page-local`.
  - **Movie Details**: Prototype stub `#detailsModal` was separate from production `#movieDetailsModal`. Prototype buttons passed raw string titles instead of movie IDs (e.g., `openMovieDetails('Kalki 2898 AD')` instead of `'vod_kalki_2898_ad'`).
  - **Catalog Loading**: `CatalogProvider.load()` was not called during `initApp()`, leading to asynchronous race conditions.

---

## Data Contract Definition

### HOME (`#page-home`)
- **Data Source**: `CatalogProvider` (`data/movies_catalog.json`) + `channelsData` (`data/channels.json`) + `localStorage` (`t2l_vod_history`, `t2l_resume_*`).
- **Hero Carousel**:
  - Dynamic rotating hero (5–8s interval) cycling through top verified feature movies and series with full metadata (title, backdrop, year, genre, duration, quality badge, synopsis).
  - Primary actions: `Watch Now` (triggers `startMovieStream(id)` / `playCurrentHero()`), `Details` (triggers `openMovieDetails(id)`).
- **Horizontal Rails**:
  1. *Continue Watching*: Populated dynamically from `localStorage.getItem('t2l_vod_history')` and resume bookmarks.
  2. *Trending Hindi Blockbusters*: Populated from `CatalogProvider.filterByCategory('Bollywood')`.
  3. *Acclaimed Web-Series*: Populated from `CatalogProvider.filterByCategory('Web-Series')`.
  4. *K-Drama & Asian Series (Hindi Dubbed)*: Populated from `CatalogProvider.filterByCategory('Asian')`.
  5. *Hollywood & Global Cinema*: Populated from `CatalogProvider.filterByCategory('Hollywood')`.
  6. *Live Now Broadcasts*: Populated from `channelsData.filter(c => c.type === 'tv').slice(0, 10)`.
  7. *Acoustic Radio Transmissions*: Populated from `channelsData.filter(c => c.type === 'radio').slice(0, 8)`.

### CINEMA (`#page-movies`)
- **Data Source**: `CatalogProvider` (`data/movies_catalog.json`).
- **Hero Showcase**:
  - Curated rotating showcase featuring top movies (e.g. Kalki 2898 AD, Jawan, 12th Fail, Oppenheimer).
- **Architectural Discovery Modes**:
  - `Premieres`, `Theatrical`, `Sagas & Series`, `All`.
- **100% Horizontal Rails**:
  1. *Trending in Theatres* (`.theatrical-horizon-card` 2.39:1 scope).
  2. *New to Cinema* (`.theatrical-card`).
  3. *Episodic Expeditions / Web-Series* (Multi-season series cards).
  4. *K-Drama & Asian Sagas* (Hindi dubbed).
  5. *Hollywood & Worldwide Hits*.
  6. *Public Domain & Classics*.

### LIVE TV (`#page-live`)
- **Data Source**: `channelsData` loaded from `data/channels.json` (bundled asset & Android AssetManager).
- **State**: `currentLiveCountry`, `currentLiveCategory`, `currentLiveSearch`.
- **Renderer**: `filterLiveChannels()` rendering real channels into `#liveChannelsFeed` with verified stream URLs, EPG status, and quality tags.

### RADIO (`#page-radio`)
- **Data Source**: `channelsData.filter(c => c.type === 'radio')` from `data/channels.json`.
- **State**: `currentRadioGenre`, `currentRadioSearch`.
- **Renderer**: `renderRadioPage()` generating approved compact cards (`.radio-compact-tile`) with turntable visualizer.

### LOCAL MEDIA VAULT (`#page-local`)
- **Data Source**: Android Media Scanner bridge (`window.AndroidMedia.getDeviceMediaJson()`), File System input, and custom storage arrays.
- **Renderer**: `updateDynamicFolderCards()` and `renderLocalFolderFeed()` rendering clean vector tiles with play triggers.

### MOVIE & SERIES DETAILS (`#movieDetailsModal`)
- **Data Source**: `CatalogProvider.getById(id)` (with title lookup fallback).
- **Features**: Dynamic backdrop, poster, tags, honest quality pill, multi-audio selection list, episode accordion for series, watch / download / watchlist actions.

---

## Verification & Visual Evidence (All 390x844 Viewport)

| Destination / State | Verified Evidence File | Verification Details |
| :--- | :--- | :--- |
| **Dynamic Home View** | `reports/ui_redesign/final_implementation/home_dynamic_390.png` | Verified: 6s auto-rotating hero carousel (Kalki 2898 AD), pagination dots, Continue Watching bookmarks with progress bar, all horizontal rails populated. |
| **Home Scrolled Rails** | `reports/ui_redesign/final_implementation/home_scrolled_390.png` | Verified: Trending Hindi Blockbusters (Tribhanga, The White Tiger, Sooryavanshi), Acclaimed Web-Series (Squid Game, Delhi Crime, Paatal Lok) rendered with genuine posters and metadata. |
| **Cinema Discovery Rails** | `reports/ui_redesign/final_implementation/cinema_dynamic_390.png` | Verified: Curated Cinema showcase (Jawan), 2.39:1 scope cards (Trending in Theatres), search input, architectural discovery mode buttons. |
| **Live Movie Details** | `reports/ui_redesign/final_implementation/movie_details_real_390.png` | Verified: 12th Fail (2023, 720p HD), specs bento bar (H.264/AVC, Hindi, 879 MB), active audio badge, direct stream button. |
| **Live Series Details** | `reports/ui_redesign/final_implementation/series_details_real_390.png` | Verified: Panchayat (2 Seasons • 8 Episodes), season selector dropdown, episode cards with stream buttons, synopsis, cast/director metadata. |
| **Live TV Broadcast Control** | `reports/ui_redesign/final_implementation/livetv_real_390.png` | Verified: 886 Live Channels, country chips (India, US, UK), category chips, live flagship card (Aaj Tak HD Live 1080p 60FPS). |
| **Acoustic Radio Feed** | `reports/ui_redesign/final_implementation/radio_real_390.png` | Verified: Dynamic turntable visualizer with live frequency transmission, AIR Vividh Bharati, AIR FM Gold, AIR FM Rainbow compact cards. |
| **Local Media Vault** | `reports/ui_redesign/final_implementation/local_real_390.png` | Verified: Device storage scanner, folder category chips (All Media, All Videos, All Music), media file tiles with durations and vector icons. |
| **Search Functionality** | `reports/ui_redesign/final_implementation/search_real_390.png` | Verified: Live query execution ("Kalki") instantly rendering search grid with Kalki 2898 AD and ZNMD theatrical cards. |
| **Hamburger Utilities & Hub** | `reports/ui_redesign/final_implementation/hamburger_functional_390.png` | Verified: Drawer opens smoothly with functional navigation (My List, Continue, Downloads, Streamer, Network, Settings, About, Help, Privacy). |
| **Physical Device Verification** | `reports/ui_redesign/final_implementation/device_live_verified.png` | Verified: Installed signed `T2L.apk` on physical hardware (`00015364U000110`), live app launch, dynamic hero, real continue bookmarks, and smooth navigation. |

---

## Summary of Completed Data Integration
1. **Catalog & Database**: Loaded unconditionally before UI render; zero mock data or placeholder cards.
2. **Hero Carousels**: Autonomous 6-second rotation on Home and Cinema, touch/swipe navigation, hover pause.
3. **Card Consistency**: Standard category rows use `.theatrical-card` (2:3), horizontal trending rows use `.theatrical-horizon-card` (2.39:1), continue watching uses `.continue-card`.
4. **Modal Unification**: Completed `#movieDetailsModal` with audio language selection, technical specs, honest quality pill, and multi-season episode accordion.
5. **No Visual Redesign**: The approved UI layout, theme colors, typography, and dock remain intact while connecting to the underlying application data.

