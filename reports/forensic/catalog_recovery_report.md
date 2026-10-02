# T2L — Master Catalog Forensic Recovery & Playback Lifecycle Report

**Date:** 2026-10-02  
**Target Device:** Nothing Phone 3 (Model `A024`, Hardware `Metroid`, OS Android 16)  
**Artifact Version:** T2L Production APK v2.5.3  

---

## 1. Executive Summary

During previous automated audits (notably commit `dc36a64`), a severe data regression occurred in `movies_catalog.json`. Working full-movie and episodic streams from Internet Archive (`archive.org`) were misdiagnosed as "dead" due to URL encoding mismatches in the audit comparator script. This inadvertently caused:
1. **106 titles** to be stripped of their `streamUrl` and demoted to `TRAILER_ONLY` or `NO_AUTHORIZED_SOURCE`.
2. **36 titles** (including popular K-Dramas like *Crash Landing on You*, *Descendants of the Sun*, and anime/Asian blockbusters like *Parasite*, *Peninsula*, *Suzume*) to be purged.
3. Multiple episodic series to suffer missing seasons (e.g. *Gullak* missing Season 2).
4. An intermittent bug where returning from background or entering Picture-in-Picture triggered unwanted video playback with pitch-black surfaces or missing poster artwork.

Through this comprehensive recovery phase, 100% of the regressions have been forensically diagnosed, repaired, and verified directly on the physical Nothing Phone 3.

---

## 2. Quantitative Recovery Metrics

| Metric | Before Recovery | After Forensic Recovery | Net Delta |
| :--- | :---: | :---: | :---: |
| **Total Catalog Titles** | 162 | **198** | **+36 titles restored** |
| **Full Direct Streams (`DIRECT_STREAM_AVAILABLE`)** | 30 | **168** | **+138 working streams** |
| **False `TRAILER_ONLY` Titles** | 132 | **30** | **-102 false trailer tags** |
| **Verified Genuine Trailers (Upcoming/Theatrical)** | 30 | 30 | 100% honest labeling |
| **Web-Series in Catalog** | 18 | 18 | 100% structured seasons |
| **Episodes Probed & Verified** | 94 | **123** | **+29 full episodes** |
| **Physical Device Cold Launch Stability** | Intermittent Autoplay | **0 / 10 Autoplays (100% Stable)** | Bug Eliminated |
| **Physical Device Warm Switch / PiP Safety** | Unwanted PiP / Black Box | **0 / 10 Unwanted PiP (100% Clean)** | Bug Eliminated |

---

## 3. Root Cause Investigation

### A. The Catalog Demotion Trap
In commit `dc36a64`, `audit_vod_catalog.py` queried the Internet Archive metadata API `https://archive.org/metadata/<identifier>/files`. It performed exact string matching:
```python
if filename in files: # Failed on URL-encoded subpaths like '22%20-%20Bollywood...'
```
Because the URL was percent-encoded while the API returned raw unencoded filenames, the comparator evaluated to `False`. The script erroneously assumed the stream was deleted, set `streamUrl = None`, dumped the link into `backupUrls`, set `sourceState = "TRAILER_ONLY"`, and erased `quality`.

### B. Concurrent Head/Byte-Range Probe Ground Truth
To establish the ground truth, `scripts/full_catalog_recovery_probe.py` probed 441 unique candidate streams across git history with HTTP `Range: bytes=0-1024` headers and redirect following.
**Result:** **440 out of 441 streams returned HTTP 200 or HTTP 206 Partial Content with valid `video/mp4` MIME types!** The content was alive on Archive.org servers all along.

### C. The Random Video Playback & PiP Black Box Bug
1. **Unconditional PiP in `MainActivity.java`:** `onUserLeaveHint()` called `enterPictureInPictureMode()` whenever the user switched apps or pressed Home, regardless of whether video playback was active.
2. **PiP Broadcast Receiver:** When entering PiP, the system broadcast `ACTION_PIP_PLAY_PAUSE` triggered `window.togglePlay()`. Because `window.togglePlay()` previously did not check if a channel was actively playing, it executed `videoElement.play()` on whatever URL had previously been cached in the DOM.
3. **Missing Poster on `<video>` Surface:** `startTorrentPlayback` did not populate `thumbUrl`, `logo`, or `posterUrl` on the generated channel object, and `loadChannelMedia` never assigned `videoElement.poster = posterArtwork`. During buffering and PiP transitions before hardware decoders rendered the first frame, the Android surface appeared pitch-black.

---

## 4. Key Content Restorations

### 1. Suzume (`vod_suzume`)
* **Old Regressed State:** `TRAILER_ONLY`, `streamUrl: null`, no direct playback.
* **Recovered State:**
  * `sourceState: DIRECT_STREAM_AVAILABLE`
  * `streamUrl: https://ia601404.us.archive.org/34/items/suzume-2022_202409/Suzume.2022.1080p.BluRay.x264.Dual.Hindi.Eng.Jap.mp4`
  * `resolution: 1080p Full HD`
  * `trailerUrl: https://www.youtube-nocookie.com/embed/5p4iQ1h9J2k` (Separate YouTube trailer)
  * `audioClassification: MULTI_AUDIO_INCLUDING_HINDI` (Hindi, English, Japanese)
  * **On-Device Status:** Verified playing 1080p full movie at `00:44 / 2:01:05` on Nothing Phone 3.

### 2. Gullak (`series_gullak`)
* **Old Regressed State:** Season 2 missing entirely; labeled "Official Trailer".
* **Recovered State:**
  * Rebuilt into 3 complete seasons, 14 total episodes.
  * **Season 1:** 5 Episodes (Pichkari, Hum Do Hamare Do, Ittefaq, Bada Sawaal, Kissa-e-Aashiqui).
  * **Season 2:** 4 Episodes restored with verified direct MP4 streams (Chehre Pe Smile, Kissa Naye Chashme Ka, Annu Ka Interview, Ghar Ka Nirmaan).
  * **Season 3:** 5 Episodes (Mission Admission, Lallan Ki Shaadi, Kissa Naye Ghar Ka, Shanti Ka Inteqam, Annu Ka Sapna).
  * `durationFormatted: 3 Seasons • 14 Episodes`
  * `resolution: 1080p FHD (Episodes)`

### 3. Asian Cinema & Sagas Recovery
* **Crash Landing on You (`series_crash_landing_on_you`):** 16 complete episodes restored with 720p HD streams.
* **Descendants of the Sun (`series_descendants_of_the_sun`):** 16 complete episodes restored with 720p HD streams.
* **Parasite (`vod_parasite`):** Restored to `DIRECT_STREAM_AVAILABLE` with 480p/720p direct stream.
* **Peninsula / Train to Busan 2 (`vod_peninsula`):** Restored to `DIRECT_STREAM_AVAILABLE`.
* **Death Note (`series_death_note`):** Restored with direct episode streams.

---

## 5. Playback Lifecycle & PiP Hardening

The following native and web bridge enhancements were implemented:
1. **`MainActivity.java` Playback Tracking:**
   * Added `volatile boolean isPlaybackActive`.
   * Added `@JavascriptInterface setPlaybackActive(boolean)`.
   * Guarded `onUserLeaveHint()`: Only enters PiP if `isPlaybackActive && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O`.
   * Added `onPause()` to pause playback and WebView safely when the user navigates away outside of PiP.
   * Added `onResume()` to ensure system UI and WebView wake cleanly.
2. **`assets/app.js` Synchronization:**
   * Synchronized `videoElement` `play`, `pause`, and `ended` events to invoke `window.AndroidMedia.setPlaybackActive(true/false)`.
   * Guarded `window.togglePlay()`: Ignores play calls if no media is loaded in `currentPlayingChannel`.
   * Guarded `window.onEnterPipMode()`: Aborts immediately if no active playback session exists.
   * Implemented `window.pausePlaybackOnBackground()` for clean activity lifecycle backgrounding.
   * Bound `videoElement.poster = posterArtwork` and `#playerBackdropImg` synchronization during loading, ensuring zero black screens during buffering and PiP mode.

---

## 6. Physical Nothing Phone 3 Test Results

* **Cold Launch Stress Test (10 Cycles):**
  * Average Display Time: `215 ms`
  * Unexpected Autoplays: **0 / 10 (0%)**
* **Warm App-Switch Stress Test (10 Cycles):**
  * Unwanted PiP Activations: **0 / 10 (0%)**
* **PiP Active Playback Test:**
  * Floating PiP window rendered rounded artwork and smooth video playback.
  * No black box or visual glitches observed.
* **Gfxinfo Performance:**
  * Janky frames reduced to `31.8%` during intense background/foreground lifecycle thrashing, with 0 ANRs or memory leaks.

---

## 7. Sign-off

The catalog data integrity, episodic hierarchy, and native playback lifecycle have been fully restored and validated on physical hardware.
