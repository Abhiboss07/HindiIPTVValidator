# T2L Product Redesign V2 — Information Architecture

**Product:** T2L (Television to Live)  
**Date:** 2026-09-28  

---

## 1. Top-Level Hierarchy & Navigation Model

The application moves away from deep, nested drawers and cluttered header strips toward a **clear dual-layer navigation model**:

```text
┌─────────────────────────────────────────────────────────────┐
│ PRIMARY APP BAR: [Brand T2L]             [🔍 Search] [⚙ Hub] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      CONTENT CANVAS                         │
│                                                             │
│   (Home / Live TV / Radio / Movies / Series / Local)        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FLOATING SIGNATURE CAPSULE DOCK                             │
│   [ 🏠 Home ]  [ 📺 Live ]  [ 📻 Radio ]  [ 🎬 Cinema ]     │
└─────────────────────────────────────────────────────────────┘
```

### A. Primary Navigation (Floating Capsule Dock)
Positioned fixed at the bottom with 16px bottom margin, 48px touch targets, and blurred glass backdrop:
1. **Home (`/home`)**: Curated editorial highlights, continue watching, trending cinema, popular series, live spotlights.
2. **Live TV (`/live`)**: Broadcast control room, EPG schedules, country/category filters, live preview cards.
3. **Radio (`/radio`)**: Acoustic hi-fi stations, frequency dials, live stream player, regional Akashvani stations.
4. **Cinema (`/cinema`)**: Theatrical movies, web series, genre discovery, editorial collections.
5. **Local Vault (`/local`)**: Device storage, downloads manager, offline playback.

### B. Secondary Navigation (Hub & Search)
- **Top-Right Search Icon**: Summons full-screen Spotlight Search overlay.
- **Top-Right Hub / Settings Icon**: Opens the slide-over Control Hub (Downloads, Torrent Streamer, Speed Test, Audio Preferences, Device Telemetry, About).

---

## 2. Page-by-Page Information Hierarchy

### 1. Home (`/home`)
```text
[ Top Bar: T2L Brand · Search Icon · Hub Icon ]
     ↓
[ Cinematic Hero Banner: Full-width theatrical backdrop · Title · Metadata · Synopsis · "Watch Now" + "+ My List" ]
     ↓
[ Continue Watching Rail: 16:9 Landscape Cards with Embedded Progress Bar & Play Icon ]
     ↓
[ 🔥 Trending Now: 2:3 Theatrical Posters · 2.35 Mobile Card Peek · Title · Year · Quality ]
     ↓
[ ✦ 2025–2026 Upcoming Tentpoles: Theatrical Posters · "In Theaters 2026" / "Trailer Only" ]
     ↓
[ 📺 Live Broadcasts Now: 16:9 Channel Cards · Live Pulse · Current Program Name ]
     ↓
[ Safe-Area Padding for Floating Dock Clearance ]
```

### 2. Movies & Cinema (`/cinema` - Movie Mode)
```text
[ Cinema Header: Toggle [ Movies | Web Series ] · Filter Chips (Action, Drama, Thriller, Sci-Fi) ]
     ↓
[ Featured Cinema Hero: Dynamic high-res backdrop of top-rated release ]
     ↓
[ Curated Collections: "Bollywood Blockbusters", "IMAX Experiences", "Critically Acclaimed" ]
     ↓
[ Theatrical Grid / Rail: 2:3 Posters · Title · Year · Genre · Clean Honest Quality Pill ]
```

### 3. Web Series (`/cinema` - Series Mode)
```text
[ Series Spotlight: Key art of top binge-worthy series ]
     ↓
[ Series Cards: 2:3 Poster · Title · Season Count ("3 Seasons") · Genre ]
     ↓
[ Series Rail by Category: "Gripping Crime Thrillers", "Comedy & Satire", "High Fantasy" ]
```

### 4. Movie Details Experience
```text
[ Full-Bleed 16:9 Cinematic Backdrop with Atmospheric Vignette Gradient ]
     ↓
[ Floating Poster + Title Block: Poster (2:3) · Full Title · Release Year · Duration · Verified Quality Tag ]
     ↓
[ Action Row: [ ▶ Stream Direct ] (Primary Luminous) · [ 📥 Download ] · [ 🎬 Watch Trailer ] · [ 🔖 My List ] ]
     ↓
[ Technical Specs Bento Grid: Codec (H.264) · Audio Track (Hindi Master) · File Size · License ]
     ↓
[ Synopsis & Storyline ]
     ↓
[ Verified Audio & Quality Selector Cards ]
     ↓
[ Cast, Director & Crew Chips ]
     ↓
[ Related Cinema Carousel ]
```

### 5. Web Series Details Experience
```text
[ Series Backdrop & Key Art ]
     ↓
[ Series Title · Total Seasons · Total Episodes · Genre · Rating ]
     ↓
[ Season Selector Tabs: [ Season 1 ] [ Season 2 ] [ Season 3 ] ]
     ↓
[ Episode Rail / List:
    - Episode Thumbnail (16:9)
    - Episode Number & Title ("E01 · Winter Is Coming")
    - Runtime ("62m")
    - Play / Stream Button
    - Progress Bar if partially watched
]
```

### 6. Live TV (`/live`)
```text
[ Live Header: Search Channel · Filter by Country [ 🇮🇳 India | 🇺🇸 USA | 🌐 All ] · Filter by Genre ]
     ↓
[ ON AIR Spotlight: High-res live channel broadcast stream preview with "LIVE" pulse & viewer count ]
     ↓
[ What's On Now (Interactive EPG Timeline Preview) ]
     ↓
[ Channel Stream Cards: 16:9 broadcast card · Station Logo · Channel Name · Resolution (1080p FHD) · Category ]
```

### 7. Radio (`/radio`)
```text
[ Acoustic Header: Frequency Dial Banner ]
     ↓
[ Featured Live Audio Station: Vinyl disc art · Station Name · Frequency (102.8 FM) · Live Audio Waveform · "Listen Live" ]
     ↓
[ Station Filter: [ All Stations ] [ 📻 FM Radio ] [ 🏛 Akashvani National ] [ 🎶 Classical ] ]
     ↓
[ Station Bento Tiles: 2-column cards · Station Icon · Station Title · Audio Quality Tag (HD Stereo) ]
     ↓
[ Persistent Mini Audio Dock if playing ]
```

### 8. Local Media Vault (`/local`)
```text
[ Storage Telemetry Bar: Visual progress bar (e.g. "42.8 GB Used / 128 GB Total") ]
     ↓
[ Navigation Segments: [ All Files ] [ 🎥 Videos ] [ 🎵 Audio ] [ 📥 Downloads ] ]
     ↓
[ Media Files Grid / List: File thumbnail · Filename · File Size · Format Tag (.mp4, .mkv, .mp3) ]
     ↓
[ "Import Media" Floating Button ]
```

### 9. Dedicated Full-Screen Search (`/search`)
```text
[ Search Bar: Back Arrow · Autofocused Input with Instant Clear (✕) ]
     ↓
[ Filter Scope Pills: [ All ] [ Movies ] [ Series ] [ Live Channels ] [ Radio ] ]
     ↓
[ "Recent Searches" Tokenized Chips ]
     ↓
[ "Popular & Trending Searches" ]
     ↓
[ Live Instant Results Grid with Content Type Badges ]
```

### 10. OLED Theater Player
```text
[ Pitch-Black Background (#000000) ]
     ↓
[ Contextual Top Bar (auto-hides in 3s): [ Back ] · Media Title · Audio Track Pill · Quality Pill ]
     ↓
[ Center Playback Controls: [ ⏪ 10s ] · [ Large Luminous Play/Pause ] · [ ⏩ 10s ] ]
     ↓
[ Bottom Control Bar:
    - Interactive Scrubber Seekbar with Glowing Thumb & Buffer Indicator
    - Elapsed Time / Total Duration
    - Subtitles Toggle · Audio Track Selector Modal · Aspect Ratio Toggle · Fullscreen ]
```

### 11. Secondary Navigation Hub (Slide-Over Sheet)
```text
[ User Profile / Device Status Header ]
     ↓
[ Hub Menu Items:
    - 📥 Downloads Manager (Active & completed file downloads)
    - ⚡ Instant Streamer / Magnet Player (Custom torrent/magnet engine)
    - 📶 Real-time Speed Test & Network Diagnostics
    - 🎧 Audio & Language Preferences (Default Hindi first / Multi-audio)
    - 💾 Storage & Cache Management (Clear cache, buffer limits)
    - ℹ️ About T2L, Version, Zero-Trust Engine Status
]
```
