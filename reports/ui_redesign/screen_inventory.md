# T2L Screen & Component Inventory (Audit Baseline)

**Application:** T2L — Television to Live  
**Platform:** Android Hybrid / WebView with Native Media Bridge & Web Browser  
**Baseline Date:** September 28, 2026  
**Visual Target:** Aurora Cinema  

---

## 1. Screen & Route Inventory

| Screen ID | Element Identifier | Primary Purpose | Current Layout & Flaws |
| :--- | :--- | :--- | :--- |
| **HOME** | `#page-home` | Main landing hub for trending content, live radio, movies, recent activity | Cluttered hero banner, redundant 4-box quick-action bar (`#categoryStrip`), vertical live channels row, dock overlapping bottom cards. |
| **MOVIES & CINEMA** | `#page-movies` | Dedicated catalog browser, genre filtering, search, watchlists | Clunky search input, card thumbnails obscured by bright green/red badges, bottom navigation dock overlaps bottom cards. |
| **MOVIE DETAILS** | `#movieDetailsModal` | Detailed synopsis, stream actions, honest quality/audio breakdown, cast | Low opacity backdrop lets home text bleed through ("T2L" watermark clashes with buttons); disjointed button styles; cramped metadata table. |
| **WEB SERIES** | `#movieDetailsModal` (Series variant) | Season selection, episode browsing, playback trigger | Flat season dropdown, trailer button rendered alongside stream button, inconsistent episode card heights. |
| **LIVE TV** | `#page-live` | 886 IPTV channels, country/genre filtering, instant playback | Harsh solid-red pills, two stacked horizontal filter bars, cards overlap bottom dock, missing smooth EPG representation. |
| **RADIO** | `#page-radio` | Live Indian & International radio broadcasts, audio visualizer | Boxy dark cards, prominent solid red "Listen Live" CTAs, disconnected card styles. |
| **LOCAL MEDIA** | `#page-local` | Device media browser, file picker, sequential torrent streamer | Harsh red/blue alert banners, generic file icons, dock collision. |
| **MY SAVED LIST** | `#page-favs` | Bookmarked movies, channels, radio stations | Plain vertical list with minimal visual styling. |
| **INSTANT STREAMER** | `#torrentModal` | Custom magnet link and .torrent input engine | Utility dialog without cinematic polish. |
| **FULLSCREEN PLAYER** | `#playerModal` | High-fidelity VLC-style player, ABR levels, audio selector, gestures | Stark black background, harsh red scrubber, plain monochrome bottom bar, basic buffering spinner box. |
| **MORE OPTIONS DRAWER** | `#vlcMoreDrawer` | Subtitles, speed, equalizer, sleep timer, bookmarks | Side drawer sliding from right, plain text lists. |
| **SUBTITLES DIALOG** | `#vlcSubtitlesModal` | Subtitle selection, live AI translation, offset sync | Stacked dialog boxes. |
| **AUDIO TRACK DIALOG** | `#vlcAudioModal` | Multi-track selector, stereo/vocal DSP, dialogue boost | Basic list dialog. |
| **QUALITY MODAL** | `#vlcQualityModal` | ABR resolution selection (Auto / 1080p / 720p / 480p) | Radio button group. |
| **DOWNLOADS MANAGER** | `#downloadsManagerModal`| Offline download queue and saved files | Basic list modal. |
| **SPEED TEST MODAL** | `#speedTestModal` | Real-time network throughput and latency probe | Semi-transparent modal with dial/counters. |
| **SETTINGS MODAL** | `#settingsModal` | DNS resolver, hardware acceleration, cache reclamation | Standard form inputs. |
| **GLOBAL SIDE DRAWER** | `#sideDrawerModal` | Secondary utility links (Speed test, Settings, Add File) | Left-hand navigation drawer with list items. |

---

## 2. Shared Component Inventory

1. **Top Bar (`.top-bar`)**:
   - Menu drawer toggle (`.top-menu-btn`)
   - Logo badge (`.t2l-logo-badge` + `.t2l-logo-text`)
   - Network status indicator (`#networkStatusBadge` - ONLINE/OFFLINE)
   - Settings shortcut button (`.top-settings-btn`)
2. **Hero Carousel (`.hero-carousel`)**:
   - Dynamic backdrop image with gradient overlay
   - Title, genre tags, year, runtime
   - Primary action ("Play Now" / "Stream Direct")
   - Secondary action ("My List" / "Trailer")
   - Dot / pill indicators
3. **Media Card (`.movie-card`)**:
   - Poster image (`.movie-poster`)
   - Badges (Resolution, Audio, Honest Source Status)
   - Title, metadata line (year, duration, rating)
4. **Bottom Navigation Dock (`.bottom-dock-nav`)**:
   - 5 Persistent tabs: Home, Live TV, Radio, Movies, Local
   - Active state indicator
   - Safe-area inset handling
5. **Mini-Player Bar (`#miniPlayerBar`)**:
   - Floating persistent bar when player is minimized
   - Title, channel name, play/pause toggle, close button
6. **Error / Empty States**:
   - Stream error overlay (`#playerErrorOverlay`)
   - No search results state
   - Storage empty state

---

## 3. Critical Visual & Ergonomic Defects Identified

1. **Dock Clipping & Overlap**: Every page (`#page-home`, `#page-movies`, `#page-live`, `#page-radio`, `#page-local`) has cards and lists running behind or colliding with the fixed `.bottom-dock-nav` because container padding-bottom is insufficient or missing safe-area awareness.
2. **Backdrop Bleed in Modals**: The movie details backdrop (`.side-drawer-backdrop`) is too transparent (`rgba(0,0,0,0.7)`), causing home page titles, buttons, and watermarks to bleed directly into the modal text.
3. **Card Clutter**: Poster cards have aggressive neon green badges (`1080p HD`) obscuring actors' faces and audio language labels (`🇮🇳 Hindi`) cluttering cards where they don't belong.
4. **Redundant Quick-Action Bar**: The 4-button quick bar on Home (`Live TV`, `Radio`, `Local`, `My List`) duplicates the persistent bottom navigation tabs and disrupts content flow.
5. **Color Disconnection**: Heavy use of bright primary red `#e50914` alongside bright blue `#00b4d8`, yellow `#f59e0b`, and green `#10b981` without a unifying atmospheric palette.

---
