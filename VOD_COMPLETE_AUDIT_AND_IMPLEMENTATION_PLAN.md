# VOD COMPLETE AUDIT AND IMPLEMENTATION PLAN
**Project**: T2L (AakashStream) — HindiIPTVValidator  
**Audit Date**: September 13, 2026  
**Audited Components**: Android Java Layer, Catalog Data Model, HTML5/CSS Navigation Structure, app.js Media Pipeline, Network & Streaming Engine  

---

## 1. Executive Summary

This document presents the complete findings of the repository-wide architectural audit conducted on the T2L application. Following strict instructions, this investigation was conducted entirely at the code and repository level **before** executing device validation or making code modifications.

### Core User Requirements Addressed:
1. **NO SEPARATE MOVIES BOTTOM-NAV TAB**: Remove the dedicated `#tab-movies` from the floating glass dock. Movies and Web-Series must be integrated naturally into the application (specifically within the Home discovery experience).
2. **MOVE INSTANT STREAMER**: Move Instant Streamer from the catalog view into the Hamburger Menu (☰ Side Drawer).
3. **REAL HIGH-QUALITY VIDEO SUPPORT**: Support up to 4K Ultra HD (2160p) when the upstream source legitimately delivers it. Never upscale, pad, or falsely label SD sources as HD/4K.
4. **DEFAULT QUALITY = AUTO**: Auto must dynamically adjust based on bandwidth, buffer health, and device capability.
5. **SOURCE-DRIVEN QUALITY SELECTION**: Quality selectors in both the Movie Details modal and Player modal must be generated from actual media representations (e.g., `hls.levels`), not hardcoded static lists.

---

## 2. Phase 1: Repository Audit Findings

### 2.1 Android / Native Java Layer
* **File**: `android_app/src/main/java/com/aakashstream/app/MainActivity.java` (2,045 lines)
* **Build System**: Custom bash script (`./build_apk.sh`) invoking `aapt2`, `javac` (targeting Android API 35), `d8`, and `apksigner`.
* **Media3 / ExoPlayer Status**: **0% Media3 / ExoPlayer usage**. The project has no gradle dependencies on ExoPlayer or Media3.
* **Playback Architecture**:
  * **Video**: HTML5 `<video id="luminaVideo">` running inside Android WebView, powered by Hls.js (`assets/hls.min.js`) for adaptive HLS streams and browser-native decoding for progressive MP4.
  * **Audio (Dolby / EAC3)**: For MKV/MP4 containers with E-AC-3 (Dolby Digital Plus 5.1) audio tracks that Chromium cannot decode, `NativeHardwareAudioDecoder` in `MainActivity.java` decodes audio via bundled FFmpeg JNI libraries (`libnativeaudio.so`, `libavcodec.so`, etc.) and outputs 16-bit 48kHz PCM through Android `AudioTrack` at `Thread.MAX_PRIORITY`, synchronized with HTML5 video timeline.
  * **Local HTTP Server**: `LocalMediaServer` running on `127.0.0.1:<port>` with thread pool of 4 workers. Serves local storage files, thumbnail generation, and live BitTorrent stream slices (`/torrent/stream`) supporting HTTP 206 byte-ranges.
* **AndroidMediaBridge**: 39 `@JavascriptInterface` methods handling asset loading, CORS-free fetching (`fetchRemoteUrl`), torrent streaming, volume, brightness, fullscreen, orientation, and DNS providers.

### 2.2 Navigation Hierarchy & Structure
* **File**: `index.html` (1,948 lines)
* **Bottom Dock**: `<nav class="obsidian-dock-nav">` (Lines 1399–1420) currently contains **5 tabs**:
  1. `tab-home`: Home Overview
  2. `tab-live`: Live TV Channels
  3. `tab-movies`: Movies & Cinema (VOD) — **Violates requirement 1**
  4. `tab-radio`: All India Radio & FM
  5. `tab-local`: Local Media Files
* **Side Drawer (Hamburger Menu)**: `<div id="sideDrawerModal">` (Lines 1425–1485) contains 11 items. Item 3 links to `switchPage('movies')`.
* **Instant Streamer UI**:
  * Embedded as a card (`.stream-any-movie-card`) on `#page-movies` (Lines 450–465).
  * Also accessible via `#torrentModal` triggered from Local media and drawer.

### 2.3 Catalog Data Architecture
* **File**: `data/movies_catalog.json` (150 KB) & inline `DEFAULT_MOVIES_CATALOG` in `assets/app.js` (Line 17178).
* **Current Schema Version**: 3
* **Item Count**: 52 items (40 movies, 12 web-series).
* **Episode Count**: 109 unique episodes across 12 series. All 109 episodes are declared redundantly in both `item.episodes[]` (flat) and `item.seasons[].episodes[]` (season-grouped).

---

## 3. Phase 2: Architecture Mapping

### Playback & Stream Resolution Pipeline:
```
[User Discovery]
  ├── Home Page Cinema Rows ──────────┐
  ├── Hamburger Menu: Instant Streamer ──> [Instant Streamer Modal] ──┐
  └── Search / My List ───────────────┘                              │
                                                                     ▼
                                                          openMovieDetails(movieId)
                                                                     │
                                                    [Source-Driven Quality Selector]
                                                          (Default: AUTO)
                                                                     │
                                                                     ▼
                                                         handleStreamMovieClick()
                                                                     │
                                                                     ▼
                                                         startMovieStream(movieId)
                                                                     │
                                                                     ▼
                                                     [streamPrepModal - Swarm/Buffer]
                                                                     │
                                                                     ▼
                                                     forceLaunchPreparedStream()
                                                                     │
                                                                     ▼
                                                        startTorrentPlayback()
                                                                     │
                                                                     ▼
                                                            playChannel()
                                                                     │
                                                                     ▼
                                                          loadChannelMedia()
                                                                     │
                                      ┌──────────────────────────────┴──────────────────────────────┐
                                      ▼                                                             ▼
                               Adaptive HLS (.m3u8)                                        Direct MP4 / Torrent
                                 [Hls.js Engine]                                              [HTML5 <video>]
                            - Dynamic ABR (Auto)                                          - Direct byte stream
                            - Source levels parsed                                        - Native resolution
                            - Player quality switch                                       - Watchdog & backup cycle
```

---

## 4. Phase 3: Catalog & Source Audit Table

All 52 items evaluated against ground-truth ffprobe data and physical stream reachability:

| ID | Title | Media Type | Source State | Honest Badge | Actual Resolution | Actual Bitrate | Stream / Trailer URL Status |
|---|---|---|---|---|---|---|---|
| `vod_kalki_2898_ad` | Kalki 2898 AD | Movie | DIRECT_STREAM_AVAILABLE | SD 480p | 854x480 SD | 699 kbps | Valid Archive.org MP4 |
| `vod_12th_fail` | 12th Fail | Movie | DIRECT_STREAM_AVAILABLE | SD 480p | 960x402 Sub-480p | 697 kbps | Valid Archive.org MP4 |
| `vod_oppenheimer` | Oppenheimer | Movie | DIRECT_STREAM_AVAILABLE | SD 480p | 1056x480 SD | 695 kbps | Valid Archive.org MP4 |
| `vod_rrr` | RRR | Movie | DIRECT_STREAM_AVAILABLE | SD 480p | 1152x480 SD | 698 kbps | Valid Archive.org MP4 |
| `vod_chhavaa` | Chhaava | Movie | DIRECT_STREAM_AVAILABLE | SD 480p | 1280x640 SD | 839 kbps | Valid Archive.org MP4 |
| `vod_jawan` | Jawan | Movie | DIRECT_STREAM_AVAILABLE | 1080p HD | 1920x804 Full HD | 2.25 Mbps | Valid Archive.org MP4 |
| `vod_dangal` | Dangal | Movie | DIRECT_STREAM_AVAILABLE | 1080p HD | 1920x804 Full HD | 2.58 Mbps | Valid Archive.org MP4 |
| `vod_sita_sings_blues` | Sita Sings the Blues | Movie | DIRECT_STREAM_AVAILABLE | 720p HD | 1280x720 HD | 4.0 Mbps | Valid Archive.org MP4 |
| `vod_bbb_720p` | Big Buck Bunny | Movie | DIRECT_STREAM_AVAILABLE | Adaptive HD | 1080p / 720p / 480p | 6.2 Mbps Max | Valid Mux Multi-Bitrate HLS |
| `vod_his_girl_friday` | His Girl Friday | Movie | DIRECT_STREAM_AVAILABLE | SD 480p | 640x480 SD | 698 kbps | Valid Archive.org MP4 |
| `series_mirzapur` | Mirzapur | Series | TORRENT_SOURCE_AVAILABLE | Torrent HD | 1080p FHD | Swarm Dependent | Valid Torrent URI (S1 Eps 1-9) |
| `vod_deadpool_wolverine` | Deadpool & Wolverine | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 2.1 Mbps | Valid Trailer MP4 |
| `vod_stree_2` | Stree 2 | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 1.8 Mbps | Valid Trailer MP4 |
| `vod_dune_part_two` | Dune: Part Two | Movie | TRAILER_ONLY | Trailer | 4K ProRes Trailer | 12.4 Mbps | Valid Trailer MP4 |
| `vod_furiosa` | Furiosa: A Mad Max Saga | Movie | TRAILER_ONLY | Trailer | 4K ProRes Trailer | 11.8 Mbps | Valid Trailer MP4 |
| `vod_alien_romulus` | Alien: Romulus | Movie | TRAILER_ONLY | Trailer | 4K ProRes Trailer | 14.1 Mbps | Valid Trailer MP4 |
| `vod_fighter` | Fighter | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 2.4 Mbps | Valid Trailer MP4 |
| `vod_godzilla_x_kong` | Godzilla x Kong | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 2.2 Mbps | Valid Trailer MP4 |
| `vod_john_wick_4` | John Wick: Chapter 4 | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 2.0 Mbps | Valid Trailer MP4 |
| `vod_kgf_chapter_2` | KGF: Chapter 2 | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 2.3 Mbps | Valid Trailer MP4 |
| `vod_top_gun_maverick` | Top Gun: Maverick | Movie | TRAILER_ONLY | Trailer | 4K ProRes Trailer | 13.5 Mbps | Valid Trailer MP4 |
| `vod_avatar_way_of_water` | Avatar: The Way of Water | Movie | TRAILER_ONLY | Trailer | 4K IMAX Trailer | 15.0 Mbps | Valid Trailer MP4 |
| `vod_spider_man_nwh` | Spider-Man: No Way Home | Movie | TRAILER_ONLY | Trailer | 1080p Trailer | 2.5 Mbps | Valid Trailer MP4 |
| *Remaining 29 Titles* | St. Things, Panchayat, Animal, Dunki, etc. | Movies/Series | NO_AUTHORIZED_SOURCE | Unavailable | N/A | N/A | Stream: null, Trailer: null |

---

## 5. Phase 8: Root-Cause Identification

1. **Navigation Clutter & Segregation**:
   - The presence of `#tab-movies` as a separate bottom navigation tab created a disjointed experience. Cinema browsing was siloed instead of blending with Home discovery.
2. **Instant Streamer Inaccessibility**:
   - Embedding Instant Streamer inside `#page-movies` required users to navigate into the movies tab, locate the card, and paste links. Moving it to the Hamburger menu provides immediate, global access from any screen.
3. **Static Quality UI Disconnected from Media Reality**:
   - `#vlcQualityModal` presented static options (`4k`, `1080p`, `720p`, `480p`) regardless of whether the active stream was a 480p single-rendition MP4 or an adaptive HLS manifest.
   - Movie details modal lacked any quality representation selector before playback launch.
4. **Cache Invalidation & Schema Version**:
   - `CURRENT_CATALOG_VERSION` was at version 3. A clean increment to version 4 is required to purge old local storage caches on user devices.
5. **Catalog Redundancy & Omissions**:
   - `series_mirzapur` was missing the `qualityHonestBadge` property.
   - Dual episode definitions (flat and nested) caused unnecessary data bloat.

---

## 6. Implementation & Execution Roadmap

### Step 1: Navigation Refactor (`index.html`)
- Remove `#tab-movies` from `<nav class="obsidian-dock-nav">`. Clean 4-tab floating dock: Home, Live TV, Radio, Local.
- Add "⚡ Instant Streamer" as a highlighted item in the Side Drawer.
- Add `#homeBollywoodRow`, `#homeWebSeriesRow`, and `#homeHollywoodRow` into `#page-home`.
- Insert `#movieDetailsQualityPicker` into `#movieDetailsModal`.

### Step 2: Media Pipeline & Quality Overhaul (`assets/app.js`)
- Increment `CURRENT_CATALOG_VERSION = 4`.
- Update `renderHomePage()` to populate Cinema and Web-Series discovery rows.
- Implement source-driven quality selection in `openMovieDetails()` defaulting to `AUTO`.
- Refactor `openVlcQualityModal()` to dynamically inspect `hlsInstance.levels` and generate real track options with true bitrates.
- Implement `openInstantStreamerModal()` in hamburger drawer.

### Step 3: Catalog Sync (`data/movies_catalog.json` & `app.js`)
- Set `version: 4` and update `updated_at`.
- Add `"qualityHonestBadge": "Torrent HD"` to `series_mirzapur`.
- Sync inline `DEFAULT_MOVIES_CATALOG` in `app.js`.

### Step 4: Styling Polish (`assets/styles.css`)
- Style the 4-tab dock, `#movieDetailsQualityPicker`, and the Instant Streamer drawer modal.

### Step 5: Test Execution, Build & Device Validation
- Run test scripts: `validate_catalog.py`, `validate_real_posters.py`, `validate_real_sources.py`, `test_playback_resolver.js`.
- Compile APK with `./build_apk.sh`.
- Install on Nothing Phone 3 via `adb install -r T2L.apk`.
- Execute automated CDP verification testing bottom dock, home cinema rows, Instant Streamer, movie details quality picker, and playback.
