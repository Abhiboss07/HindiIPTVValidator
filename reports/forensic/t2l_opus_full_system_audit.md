# T2L — FULL SYSTEM FORENSIC AUDIT REPORT
**Target System:** T2L (Television to Live) / HindiIPTVValidator / AakashStream  
**Investigation Mode:** Zero-Trust Forensic Code & Runtime Audit (Phase 1 — Audit Only)  
**Date of Audit:** September 29, 2026  
**Auditor:** Autonomous Deep Forensic Auditor  

---

## EXECUTIVE VERDICT: SYSTEM INTEGRITY ANALYSIS

> **Zero-Trust Verdict:** **FAIL / HIGH OPERATIONAL & ARCHITECTURAL RISK**  
> Prior claims of "100% verified", "PASS", "zero forensic integrity issues", and "production ready" were **demonstrably false** or based on superficial static checks that masked critical runtime failures.

While the user interface has received significant visual polish, an independent forensic investigation of the codebase, network layers, Android runtime, and catalog data reveals severe regressions, broken pipelines, fabricated video IDs, sham test suites, and critical security vulnerabilities:

1. **Test Infrastructure Deception:** `tools/test_e2e_playwright_suite.js` claims to be a "Playwright Browser E2E Automation Suite". In reality, neither Playwright nor Puppeteer nor `node_modules/` exists. The script is pure static file string-matching (`fs.readFileSync().includes()`) that runs in 50ms and reports 11 fake "PASS" checks. The actual test suite (`python3 -m unittest discover -s tests`) **FAILS** with 3 assertion violations and 1 crashing `AttributeError`.
2. **Streaming & Trailer Reality:** Out of 391 catalog stream and trailer URLs tested live over the network, **72 URLs are completely broken**. Top-billed titles like *Brahmāstra*, *Pushpa*, *Dangal*, and *Train to Busan* suffer from dead redirect loops or 404s. Over 30 YouTube trailers contain **fabricated/dummy IDs** (e.g. `q0_A1v9K3_King`, `v9qX4_z1N9E`, `p1T_z5Y4w9A`) that immediately fail with "Video unavailable".
3. **Data Schema & Content Mismatches:**
   - *Stree 2 (2024)* is mapped to the 2018 *Stree 1* video file.
   - *The Dark Knight* is a hybrid frankenstein entry where Nolan/Bale metadata is spliced with *Iron Man (2008)* title, synopsis, and video stream.
   - *Ip Man (2008)* plays *Ip Man 4: The Finale (2019)*.
   - *The Roundup (2022)* plays *The Roundup: Punishment (2024)*.
   - *Panchayat* Season 1 episodes are shifted by +1 (E01 is missing, Ep 1 links to Ep 2, Ep 2 to Ep 3, etc.).
   - *Mirzapur* Season 1 episodes actually point to Season 2 files.
4. **Android Native Security & Runtime Vulnerabilities:**
   - Production APK has `android:debuggable="true"` hardcoded.
   - Global cleartext traffic and user CA certificate trust enabled in `network_security_config.xml`.
   - WebView has SOP disabled (`setAllowUniversalAccessFromFileURLs(true)`) and unrestricted external URL loading exposing 45 native Java bridge methods.
   - Embedded local HTTP server truncates non-range GET requests to 4MB and starves with only 4 threads.
   - BitTorrent engine has broken magnet support (hardcoded 100MB dummy metadata with zeroed piece hashes), inverted bitfield endianness, and piece buffer clobbering.
   - JNI native audio decoder enters an infinite 5ms busy loop on EOF and leaks 64KB native heap per error.
5. **Frontend UI ↔ DOM Disconnects:**
   - `index.html` defines an Up-Next Episode banner with `onclick="dismissNextEpBanner()"`, but `dismissNextEpBanner` is undefined in `assets/app.js`, throwing `ReferenceError`.
   - Watch History on the Movies page (`page-movies`) fails to render because `moviesContinueSection` and `moviesContinueRow` are absent from HTML.
   - `btnPlayerCC` is queried on every CC update but does not exist in `index.html`.
   - Service Worker (`sw.js`) is never registered anywhere in JavaScript or HTML, and `manifest.json` is not linked.

---

## 1. PROJECT STRUCTURE & REPOSITORY AUDIT

### Workspace Layout
- **Root Directory:** `/home/abhiboss/Projects/HindiIPTVValidator`
- **Key Source Code Size:**
  - `assets/app.js`: 20,873 lines (~1.13 MB) — Monolithic JavaScript bundle containing all app state, routing, UI rendering, HLS controller, VOD catalog provider, audio selection, gesture engine, and torrent bridge.
  - `index.html`: 2,260 lines (~144 KB) — Single-page application template containing 5 page views and 8 modals.
  - `assets/styles.css`: 7,953 lines (~350 KB) — Global and component CSS.
  - `data/channels.json`: 16,663 lines (~520 KB) — 890 IPTV/Radio channels.
  - `data/movies_catalog.json`: 16,341 lines (~580 KB) — 170 VOD movies and series.
  - `android_app/src/main/java/com/aakashstream/app/MainActivity.java`: 2,302 lines (~105 KB) — Native Android WebView wrapper, local HTTP media server, and `@JavascriptInterface` bridge.
  - `build_apk.sh`: 63 lines — Raw bash script invoking Android SDK build-tools (aapt2, d8, javac, zipalign, apksigner).
  - Total repository codebase: **66,452 lines**.

### Dual-Asset Divergence Finding
Web assets exist in two locations:
1. Root: `index.html`, `assets/`, `data/`
2. Android Bundle: `android_app/src/main/assets/`

While the core JS/HTML/CSS files currently match, `build_apk.sh` does NOT clean `android_app/src/main/assets/` before copying. As a result, an orphan backup file `data/movies_catalog.json.bak.1789747904` (597 KB) was baked directly into the 23MB production APK.

---

## 2. FRONTEND ARCHITECTURE & ROUTING FORENSIC

### Routing System (`switchPage(pageId)`)
- Exposed globally at [assets/app.js:13215](file:///home/abhiboss/Projects/HindiIPTVValidator/assets/app.js#L13215).
- Controlled views:
  - `page-home`: Renders hero carousel, Continue Watching rail, curated Bollywood, Web-Series, Asian, and Hollywood rails.
  - `page-movies` (Cinema): Renders premiere hero showcase, discovery mode navigation, and dynamic content rails.
  - `page-live`: Renders IPTV categories, channel filters, search, and live grid.
  - `page-radio`: Renders AIR radio stations feed.
  - `page-local`: Renders Local Media Vault (device videos/audios).
  - `page-favs`: Referenced in `switchPage` line 13259, but `page-favs` is **missing from `index.html`** (favorites are embedded as a drawer modal instead).
- Floating signature dock ([index.html:868-918](file:///home/abhiboss/Projects/HindiIPTVValidator/index.html#L868-L918)) correctly routes to 5 tabs: Home, Movies (Cinema), Live TV, Radio, and Vault.

### Gesture & Player Overlay System
- Gestures initialized in `initPlayerSwipeGestures` ([assets/app.js:17901](file:///home/abhiboss/Projects/HindiIPTVValidator/assets/app.js#L17901)).
- Left 42% of viewport controls brightness; Right 42% controls volume. Center 16% is a deadzone to prevent accidental triggers during taps.
- 32px swipe threshold and 1.4x vertical-to-horizontal ratio check prevent diagonal micro-jitter from firing gestures.
- Initial brightness initialized to `70` (line 13204) and synchronized with Android hardware via `window.AndroidMedia.getBrightness()`.

---

## 3. DATA LAYER & SCHEMA AUDIT

### `data/movies_catalog.json` (170 Items: 147 Movies, 23 Web-Series)
- **Source State Breakdown:**
  - `DIRECT_STREAM_AVAILABLE`: 138 items (125 Movies, 13 Series)
  - `UPCOMING_TRAILER`: 16 items
  - `NO_AUTHORIZED_SOURCE`: 10 items (all Series with null streams)
  - `TRAILER_ONLY`: 6 items
  - `TORRENT_SOURCE_AVAILABLE`: 0 items
- **Integrity Anomalies:**
  - `vod_oppenheimer` and `vod_demon_slayer_mugen_train` have `"sourceState": "TRAILER_ONLY"` and `"streamUrl": null`, but `"sourceStatus": "PLAYABLE"`. This causes immediate unit test failures.
  - 3 items (`vod_sita_sings_blues`, `vod_bbb_720p`, `vod_his_girl_friday`) declare both `streamUrl` and `torrentUri` under `DIRECT_STREAM_AVAILABLE`.
  - 3 items (`vod_ramayana_part_1_2026`, `vod_war_2_2025`, `vod_toxic_2026`) use `synopsis` instead of `description` and `genre` instead of `genres`, breaking details modal text.

### `data/channels.json` (890 Channels: 886 TV, 4 Radio)
- **Status Breakdown:**
  - `UNVERIFIED`: 868 channels (97.53%)
  - `PASS`: 14 channels (1.57%)
  - `OFFLINE`: 8 channels (0.90%)
  - `isFeatured: true`: 30 channels
- **Integrity Anomalies:**
  - 3 channels have completely empty stream URLs (`url: ""`):
    - `discovery-channel-hindi-hd` (line 117)
    - `animal-planet-hindi-hd` (line 156)
    - `disney-channel-hindi-hd` (line 175)
  - 182 stream URLs are duplicated across multiple distinct channels.
  - Severe schema inconsistencies: `language` missing in 885/890 channels; `lastSuccessfulCheck` missing in 880/890 channels.

### Poster File Inventory (`assets/posters/`)
- Total poster files on disk: 216 files.
- Missing poster files referenced in catalog: **0** (all 170 catalog posters exist on disk).
- Unreferenced / Orphan poster files: **46 files** (21.3% of `assets/posters/` directory is dead weight).

---

## 4. STREAMING & PLAYER PIPELINE FORENSIC

### Stream URL Probing Results (391 Total Catalog URLs Probed)
Out of 391 stream and trailer URLs tested live over HTTP:
- **Playable / Accessible:** 319 URLs
- **Broken / Unreachable:** **72 URLs**

#### Critical Broken Streams
1. `vod_brahmastra`: Redirects to archive.org storage node resulting in dead redirect loop / 404.
2. `vod_pushpa_the_rise`: Redirects to dead storage node.
3. `vod_dangal`: Storage node unreachable / 404.
4. `vod_sita_sings_blues`: Storage node redirect failure.
5. `vod_train_to_busan`: Dead redirect loop.
6. `vod_ip_man`: Dead redirect loop.
7. `vod_ip_man_4`: 404 on remote storage node.
8. `vod_shaolin_soccer`: 404 on remote storage node.
9. `series_naruto_classic`: Network timeout / DNS unreachable.
10. `vod_tribhanga_2021`: Redirects to `dn720301.ca.archive.org/0/items/...` returning HTTP 404.

#### Fabricated / Dead YouTube Trailers (404 / Video Unavailable)
Over 30 YouTube trailers in the catalog contain invalid or fabricated IDs:
- `vod_king_2026`: `https://www.youtube-nocookie.com/embed/q0_A1v9K3_King` (Fabricated ID)
- `vod_alpha_2026`: `q0_A1v9K3_8` (404)
- `vod_spirit_2026`: `w7K3X1_8g8g` (404)
- `series_farzi_s2_2025`: `v9qX4_z1N9E` (404)
- `series_family_man_s3_2025`: `p1T_z5Y4w9A` (404)
- `series_delhi_crime_s3_2025`: `S_8qM8W8b1c` (404)
- `series_paatal_lok_s2_2025`: `6f9GfWjH4yE` (404)
- `series_squid_game_s2_2025`: `lQBmZBJTN4g` (404)
- `vod_deva_2025`: `7r1w9b4y8kA` (404)
- `vod_sikandar_2025`: `8t3X6w8j9pU` (404)
- `vod_fantastic_four_2025`: `11kvy_sL_5o` (404)

#### Broken Radio Stations
- `air-gold-fm` fallback in `assets/app.js:578`: HTTP 404.
- `air-rainbow-fm` fallback in `assets/app.js:592`: HTTP 404.
- `air-vividh-bharati` fallback in `assets/app.js:564`: Points to classical music stream (`hlspbaudioragam`) instead of Vividh Bharati.

---

## 5. ANDROID NATIVE LAYER & WEBVIEW FORENSIC

### Architecture
All media playback occurs inside the Android WebView via HTML5 `<video>`, HLS.js, or YouTube iframe. **There is no native ExoPlayer or Media3 player.**

### Native Security Vulnerabilities
- **AndroidManifest.xml:19:** `android:debuggable="true"` hardcoded in production build.
- **network_security_config.xml:3-8:** Explicitly trusts `<certificates src="user" />` globally and permits cleartext HTTP, allowing trivial TLS MITM proxying of all app traffic.
- **MainActivity.java:702-705:** WebView disables Same-Origin Policy for local files:
  ```java
  webSettings.setAllowFileAccessFromFileURLs(true);
  webSettings.setAllowUniversalAccessFromFileURLs(true);
  ```
- **MainActivity.java:767-772:** `shouldOverrideUrlLoading` returns `false` for any external `http://` or `https://` URL, allowing external malicious web pages loaded in the WebView to invoke all 45 `@JavascriptInterface` methods.
- **MainActivity.java:1028-1054:** Bridge method `fetchRemoteUrl` acts as an unrestricted server-side request forgery (SSRF) proxy.
- **MainActivity.java:1096-1098:** `startTorrentFromFile` reads arbitrary local files from the filesystem without validation.

### Embedded Local Media Server (`127.0.0.1`)
- **HTTP 200 Truncation Bug:** In [MainActivity.java:358-393](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L358-L393), standard GET requests without a `Range:` header are truncated to 4MB with `HTTP 200 OK`. If a media player requests the full file without byte-range headers, playback silently cuts off at 4MB.
- **Thread Starvation:** Fixed thread pool of only 4 threads ([MainActivity.java:154](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L154)). Loading 4 local media thumbnails concurrently blocks video playback threads completely.

### BitTorrent Subsystem (`android_app/.../torrent/`)
- **Fake Magnet Implementation:** In `MainActivity.java:1070-1078`, magnet links generate a hardcoded dummy 100MB metadata structure with 100 zeroed SHA-1 hashes. There is no BEP 9 / BEP 10 extension protocol for metadata exchange.
- **Bitfield Endianness Inversion:** In `PeerConnection.java:135`, incoming bitfields are parsed using Java's Little-Endian `BitSet.valueOf()`. BEP 3 specifies Big-Endian bitfields. As a result, piece availability is inverted per byte.
- **Piece Buffer Clobbering:** In `PeerConnection.java:210-212`, when pipelined blocks from different pieces arrive, `currentDownloadingPiece` is overwritten, discarding previously received blocks.

### JNI Native Audio Decoder (`native_audio_decoder.c`)
- **Infinite EOF Busy Loop:** At EOF, `nativeDecode` returns `total_bytes = 0`. The Java loop in `MainActivity.java:2209-2212` checks `while (isDecoding && bytesRead >= 0)`. Because 0 is `>= 0`, the thread spins in an infinite 5ms loop instead of terminating.
- **Native Memory Leak:** In `nativeOpenFd`, any error exit between lines 74-98 fails to free the 64KB `avio_buf`, permanently leaking heap memory.
- **Fake 5.1 EAC3:** While advertised as hardware Dolby Digital Plus 5.1 pass-through, line 187 explicitly hardcodes `AV_CHANNEL_LAYOUT_STEREO`, downmixing all multi-channel audio to software 2-channel stereo.

---

## 6. BUILD PIPELINE & TEST INFRASTRUCTURE FORENSIC

### Build Pipeline (`build_apk.sh`)
- Compiles via Android build-tools 35.0.0 with pure Java 11 + AAPT2 + D8.
- Target SDK mismatch: Manifest specifies SDK 35; `aapt2 link` specifies `--target-sdk-version 34`.
- Missing PWA asset sync: Does not copy `sw.js` or `manifest.json`.
- Non-destructive sync leaves stale files (like `.bak` files) in `android_app/src/main/assets/`.
- Native libraries only support `arm64-v8a`; 32-bit ARM and x86/x86_64 emulators are unsupported.

### Test Infrastructure Reality
- **Fraudulent E2E Suite:** `tools/test_e2e_playwright_suite.js` is a static regex scanner claiming to be Playwright. No browser is ever launched.
- **Pytest Suite Failure:** Executing `python3 -m unittest discover -s tests -p "test_*.py"` produces:
  - **114 Passed, 3 Failed, 1 Error** in 18.2s.
  - `AttributeError: 'NoneType' object has no attribute 'upper'` in `tests/test_quality_gate.py:37`.
  - 3 assertion failures in `tests/test_media_identity.py` and `tests/test_quality_gate.py` due to catalog contamination on `vod_oppenheimer` and `vod_demon_slayer_mugen_train`.
- **Hardware-Coupled Test Scripts:** 12+ JavaScript test files in `tools/` hardcode physical device serial `"00015364U000110"` and crash on any other environment.

---

## 7. SYSTEMATIC FORENSIC BUG CATALOG

### BUG-001
- **Area:** Testing & Quality Assurance
- **Severity:** HIGH
- **Symptom:** `tools/test_e2e_playwright_suite.js` generates false reports claiming 11/11 Playwright Browser E2E passes.
- **Root Cause:** Script contains zero Playwright/Puppeteer automation code. It only executes `fs.readFileSync().includes()`. Neither Playwright nor `node_modules` exists.
- **Evidence:** [tools/test_e2e_playwright_suite.js:14-16, 42-76](file:///home/abhiboss/Projects/HindiIPTVValidator/tools/test_e2e_playwright_suite.js#L14-L16). Finishes in 50ms without spawning a browser.

### BUG-002
- **Area:** Data Layer / Catalog Quality Gate
- **Severity:** HIGH
- **Symptom:** Automated regression suite crashes with `AttributeError` and fails 3 assertion tests.
- **Root Cause:**
  1. In `tests/test_quality_gate.py:37`, `m.get("qualityClass", "").upper()` crashes when `"qualityClass": null`.
  2. `vod_oppenheimer` and `vod_demon_slayer_mugen_train` have `"sourceState": "TRAILER_ONLY"` and `"streamUrl": null`, but `"sourceStatus": "PLAYABLE"`.
- **Evidence:** `python3 -m unittest discover -s tests -p "test_*.py"` output: `FAILED (failures=3, errors=1)`.

### BUG-003
- **Area:** Streaming & VOD Catalog
- **Severity:** CRITICAL
- **Symptom:** 72 out of 391 catalog stream and trailer URLs are dead, returning 404, DNS failure, or dead redirect loops.
- **Root Cause:** Remote archive.org storage nodes have gone offline or moved, and over 30 YouTube trailers were populated with fabricated placeholder strings.
- **Evidence:** Live HTTP probing of all 391 URLs:
  - *Brahmāstra* ([data/movies_catalog.json:6042](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L6042)) -> dead redirect loop.
  - *King (2026)* ([data/movies_catalog.json:1815](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L1815)) -> `q0_A1v9K3_King` fabricated YouTube ID.

### BUG-004
- **Area:** Content Identity / Catalog Mapping
- **Severity:** HIGH
- **Symptom:** Selecting *Stree 2 (2024)* plays *Stree 1 (2018)*.
- **Root Cause:** Stream URL points to `Stree 1080p 2018.mp4` instead of *Stree 2*.
- **Evidence:** [data/movies_catalog.json:3565](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L3565).

### BUG-005
- **Area:** Content Identity / Catalog Mapping
- **Severity:** CRITICAL
- **Symptom:** *The Dark Knight* entry shows Nolan/Bale poster and credits, but displays *Iron Man* title, description, and plays the 2008 Marvel film.
- **Root Cause:** Catalog record `vod_dark_knight` was corrupted with *Iron Man* video source and synopsis while retaining Dark Knight ID and poster.
- **Evidence:** [data/movies_catalog.json:4955-5026](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L4955-L5026).

### BUG-006
- **Area:** Content Identity / Catalog Mapping
- **Severity:** HIGH
- **Symptom:** Selecting *Ip Man (2008)* streams *Ip Man 4: The Finale (2019)*.
- **Root Cause:** `vod_ip_man` streamUrl is set to `Ip man 04.mp4`.
- **Evidence:** [data/movies_catalog.json:8338](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L8338).

### BUG-007
- **Area:** Content Identity / Catalog Mapping
- **Severity:** HIGH
- **Symptom:** Selecting *The Roundup (2022)* streams *The Roundup: Punishment (2024)*.
- **Root Cause:** `vod_the_roundup` streamUrl links to the 4th installment of the franchise.
- **Evidence:** [data/movies_catalog.json:8684](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L8684).

### BUG-008
- **Area:** Web-Series Pipeline / Episode Mapping
- **Severity:** CRITICAL
- **Symptom:** *Panchayat* Season 1 episodes play the wrong episode (+1 offset; Episode 1 plays Episode 2).
- **Root Cause:** S01E01 is linked to `E02.mp4`, S01E02 to `E03.mp4`, and S01E01 file is missing from catalog.
- **Evidence:** [data/movies_catalog.json:2876-3148](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L2876-L3148).

### BUG-009
- **Area:** Web-Series Pipeline / Season Mapping
- **Severity:** HIGH
- **Symptom:** *Mirzapur* Season 1 episodes stream Season 2 files.
- **Root Cause:** Season 1 episode URLs link to `s2 m1`, `s2 m3` ... `s2 m10` files.
- **Evidence:** [data/movies_catalog.json:3150-3442](file:///home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json#L3150-L3442).

### BUG-010
- **Area:** Web-Series Pipeline
- **Severity:** MEDIUM
- **Symptom:** 10 web-series contain 31 episodes with 100% null stream URLs.
- **Root Cause:** Placeholder episode objects added to catalog without streams or torrent resolution.
- **Evidence:** Lines 715, 810, 899, 990, 1081, 3816, 3930, 4351, 5897, 7384 in `data/movies_catalog.json`.

### BUG-011
- **Area:** Frontend UI & Event Binding
- **Severity:** MEDIUM
- **Symptom:** Clicking the close button '✕' on the Up-Next Episode banner throws an unhandled JavaScript error.
- **Root Cause:** [index.html:1063](file:///home/abhiboss/Projects/HindiIPTVValidator/index.html#L1063) binds `onclick="dismissNextEpBanner()"`, but `dismissNextEpBanner` is never defined in `assets/app.js`.
- **Evidence:** `grep -rn "dismissNextEpBanner" assets/` returns 0 results.

### BUG-012
- **Area:** Frontend UI & Watch History
- **Severity:** MEDIUM
- **Symptom:** Continue Watching / Watch History rail is permanently missing from the Movies (Cinema) page.
- **Root Cause:** [assets/app.js:19183-19184](file:///home/abhiboss/Projects/HindiIPTVValidator/assets/app.js#L19183-L19184) queries `moviesContinueSection` and `moviesContinueRow`, which do not exist anywhere in `index.html`. The function silently aborts on line 19185.
- **Evidence:** `document.getElementById('moviesContinueSection') === null`.

### BUG-013
- **Area:** Frontend UI & Subtitles
- **Severity:** LOW
- **Symptom:** Calling `updateCCUI()` attempts to toggle active class on non-existent element.
- **Root Cause:** [assets/app.js:17549](file:///home/abhiboss/Projects/HindiIPTVValidator/assets/app.js#L17549) queries `btnPlayerCC`, which is absent from `index.html`.
- **Evidence:** `grep -rn "btnPlayerCC" index.html` returns 0 results.

### BUG-014
- **Area:** Offline & Service Worker Infrastructure
- **Severity:** MEDIUM
- **Symptom:** App cannot run offline or install as PWA.
- **Root Cause:**
  1. `sw.js` is never registered in any JavaScript or HTML file.
  2. `manifest.json` is not linked in `<head>` of `index.html`.
  3. `sw.js` static assets list omits `data/movies_catalog.json` and `assets/hls.min.js`.
- **Evidence:** [sw.js:2-12](file:///home/abhiboss/Projects/HindiIPTVValidator/sw.js#L2-L12). Zero calls to `navigator.serviceWorker.register`.

### BUG-015
- **Area:** Android Native Security
- **Severity:** CRITICAL
- **Symptom:** Production APK is marked debuggable and allows TLS MITM interception.
- **Root Cause:**
  1. [android_app/src/main/AndroidManifest.xml:19](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/AndroidManifest.xml#L19) has `android:debuggable="true"`.
  2. [android_app/src/main/res/xml/network_security_config.xml:3-8](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/res/xml/network_security_config.xml#L3-L8) trusts user-installed CA certificates and permits cleartext traffic.
- **Evidence:** APK can be inspected and attached to by any debugger; network traffic can be decrypted with user certs.

### BUG-016
- **Area:** Android Native Security
- **Severity:** CRITICAL
- **Symptom:** Malicious web pages loaded inside the WebView gain unrestricted access to 45 native Java bridge methods.
- **Root Cause:** [MainActivity.java:767-772](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L767-L772) `shouldOverrideUrlLoading` returns `false` for all external HTTP/HTTPS links, keeping navigation inside the app's WebView where `window.AndroidMedia` is bound.
- **Evidence:** `return false;` in `shouldOverrideUrlLoading`.

### BUG-017
- **Area:** Android Native Security
- **Severity:** HIGH
- **Symptom:** Native bridge exposes arbitrary file reading and unrestricted SSRF proxy.
- **Root Cause:**
  1. `fetchRemoteUrl` ([MainActivity.java:1028](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L1028)) acts as an unvalidated network proxy.
  2. `startTorrentFromFile` ([MainActivity.java:1096](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L1096)) reads raw paths with `Files.readAllBytes`.
- **Evidence:** No permission or path validation in bridge methods.

### BUG-018
- **Area:** Android Local HTTP Server
- **Severity:** HIGH
- **Symptom:** Non-range video requests for local media are truncated to 4MB, cutting off playback.
- **Root Cause:** [MainActivity.java:358-393](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L358-L393) sets `HTTP 200` length to `Math.min(fileSize, 4 * 1024 * 1024)`.
- **Evidence:** Hardcoded 4MB cap in non-range response path.

### BUG-019
- **Area:** BitTorrent Engine
- **Severity:** CRITICAL
- **Symptom:** Magnet link playback fails with corrupt piece errors.
- **Root Cause:**
  1. Magnet links use hardcoded dummy metadata with 100 zeroed SHA-1 hashes ([MainActivity.java:1070](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L1070)).
  2. Incoming bitfield bytes are parsed in Little-Endian order using `BitSet.valueOf` ([PeerConnection.java:135](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/torrent/PeerConnection.java#L135)), inverting piece indexes per byte.
- **Evidence:** `BitSet.valueOf(payload)` violates BEP 3 Big-Endian bitfield specification.

### BUG-020
- **Area:** JNI Audio Decoder
- **Severity:** HIGH
- **Symptom:** Audio decoder worker thread hangs in infinite 5ms loop on file EOF, draining battery.
- **Root Cause:** [native_audio_decoder.c:306](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/jni/native_audio_decoder.c#L306) returns `0` on EOF; [MainActivity.java:2209](file:///home/abhiboss/Projects/HindiIPTVValidator/android_app/src/main/java/com/aakashstream/app/MainActivity.java#L2209) tests `while (bytesRead >= 0)`, continuously repeating.
- **Evidence:** `0 >= 0` evaluates to true indefinitely.

### BUG-021
- **Area:** Live TV Channel Data
- **Severity:** HIGH
- **Symptom:** 3 channels in `channels.json` have empty URLs, failing playback.
- **Root Cause:** `discovery-channel-hindi-hd`, `animal-planet-hindi-hd`, and `disney-channel-hindi-hd` have `url: ""`.
- **Evidence:** [data/channels.json:117, 156, 175](file:///home/abhiboss/Projects/HindiIPTVValidator/data/channels.json#L117).

### BUG-022
- **Area:** Build Pipeline / Packaging
- **Severity:** HIGH
- **Symptom:** Uncleaned asset directory packs obsolete backup files into the signed production APK.
- **Root Cause:** `build_apk.sh` copies web assets to `android_app/src/main/assets/` without running `rm -rf android_app/src/main/assets/` first.
- **Evidence:** `unzip -l T2L.apk` contains `assets/data/movies_catalog.json.bak.1789747904` (597,622 bytes).

---

## 8. PRIORITIZED REMEDIATION ROADMAP (FOR PHASE 2)

### Priority 1: Critical Stability & Test Suite Repairs
1. In `data/movies_catalog.json`, update `vod_oppenheimer` and `vod_demon_slayer_mugen_train` to have `"sourceStatus": "TRAILER_ONLY"` and `"qualityClass": "TRAILER"`.
2. In `tests/test_quality_gate.py:37`, change `qc = m.get("qualityClass", "").upper()` to `qc = (m.get("qualityClass") or "").upper()`.
3. Verify that `python3 -m unittest discover -s tests -p "test_*.py"` achieves 100% PASS.

### Priority 2: Catalog Data & Stream Remediation
1. Fix corrupted movie mappings:
   - Point `vod_stree_2` to legitimate Stree 2 media or set to `TRAILER_ONLY`.
   - Restore *The Dark Knight* (`vod_dark_knight`) metadata and stream.
   - Correct `vod_ip_man` and `vod_the_roundup` stream URLs.
2. Fix web-series episode shifts:
   - Correct *Panchayat* Season 1 episode numbering and URL mapping.
   - Relink *Mirzapur* Season 1 episodes.
3. Clean dead/fabricated YouTube trailer IDs: Replace invalid IDs with valid embeds or set `trailerUrl: null`.
4. Remove or populate the 3 empty Live TV channel URLs in `data/channels.json`.

### Priority 3: Frontend DOM & UI Binding Alignment
1. Define `window.dismissNextEpBanner = function() { ... }` in `assets/app.js` to eliminate the `ReferenceError`.
2. Add `<div id="moviesContinueSection">` and `<div id="moviesContinueRow">` to `page-movies` in `index.html` so watch history displays on the Cinema page.
3. Add `<button id="btnPlayerCC">` or remove the dead DOM check in `updateCCUI()`.
4. Register `sw.js` in `app.js` and link `manifest.json` in `index.html`.

### Priority 4: Android Native Hardening
1. In `AndroidManifest.xml`, remove `android:debuggable="true"`.
2. In `network_security_config.xml`, remove `<certificates src="user" />`.
3. In `MainActivity.java`, restrict `shouldOverrideUrlLoading` to open external domains in the system browser (`Intent.ACTION_VIEW`).
4. Fix HTTP 200 truncation in the local media server to serve full files when `Range:` header is omitted.
5. In `native_audio_decoder.c`, return negative value on EOF to break the Java decode loop cleanly.
6. In `build_apk.sh`, add `rm -rf android_app/src/main/assets/` before copying assets, eliminating orphan backup files.
