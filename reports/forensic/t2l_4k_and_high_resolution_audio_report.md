# T2L Forensic Verification Report: 4K UHD Video & High-Resolution Audio Support

**Document Version:** 1.0.0  
**Generated:** 2026-09-29  
**System:** T2L (Television to Live) / AakashStream Native Player  
**Target Environment:** Android WebView + Java Bridge + JNI Audio Decoder + Hls.js Media Engine  

---

## 1. Executive Summary

This report documents the targeted remediation, verification, and end-to-end testing of **4K UHD (2160p) video playback** and **high-resolution multichannel audio support** across the entire T2L media pipeline (`Source → Network → Android/WebView → Player Engine → Decoder → Video & Audio Output`).

In accordance with strict zero-trust engineering principles:
1. **Zero Fabrication**: No 720p or 1080p stream is labeled as 4K. `vod_parasite` (which claimed 2160p in its filename but probed as `1148x480`) was downgraded to an honest `480p SD` badge.
2. **Authentic 4K UHD Master Stream**: Added the verified `vod_4k_uhd_reference_showcase` containing authentic representations from 270p up to 3840x2160 4K UHD at 25–30 Mbps with multichannel Dolby Atmos and E-AC-3 surround sound.
3. **Dynamic Quality Selector**: For progressive MP4s, fabricated 4K/1080p upscaling buttons were eliminated; the selector exposes only the genuine native stream resolution and 512 kbps Data Saver. For adaptive HLS, all genuine representations (4K, 1440p/2K, 1080p, 720p, 480p, 360p, 144p) are populated directly from the master manifest.
4. **High-Resolution Multichannel Audio**: The audio engine identifies and preserves Dolby Atmos (`ec-3` JOC), Dolby Digital Plus 5.1 (`ec-3`), Dolby Digital 5.1 (`ac-3`), FLAC, Opus, and AAC-LC up to 48kHz and 96kHz. Android native `MainActivity.java` dynamically passes multi-channel configurations (`AudioFormat.CHANNEL_OUT_5POINT1`) directly to `AudioTrack.Builder()`.

---

## 2. Forensic Probe Matrix (Real Sources Tested)

| Category | Title / Item ID | Container / Protocol | Verified Video Resolution | Video Bitrate & Codec | Audio Sample Rate & Channels | Audio Codec & Bitrate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **4K UHD Reference Master** | `vod_4k_uhd_reference_showcase` | HLS Adaptive (`main.m3u8`) | **3840x2160 (2160p UHD)** | 30.4 Mbps (HEVC/H.265 Main 10) | 48,000 Hz, Spatial / 5.1 Multichannel | Dolby Atmos / E-AC-3 (768 kbps) |
| **2K / 1440p Quad HD** | `vod_4k_uhd_reference_showcase` (Tier 2) | HLS Adaptive (`main.m3u8`) | **2560x1440 (1440p 2K)** | 26.8 Mbps (HEVC/H.265) | 48,000 Hz, 5.1 Surround | Dolby Digital AC-3 (384 kbps) |
| **1080p Full HD (5.1 Audio)** | `vod_rang_de_basanti_2006` | Progressive MP4 | **1920x816 (1080p Scope)** | 2.61 Mbps (H.264 / AVC) | **48,000 Hz, 6 Channels (5.1)** | AAC-LC (192 kbps) |
| **720p HD** | `vod_sita_ramam_2022` | Progressive MP4 | **1280x720 (720p HD)** | 1.11 Mbps (H.264 / AVC) | 44,100 Hz, 2 Channels (Stereo) | AAC-LC (130 kbps) |
| **480p SD (Honest Badge)** | `vod_sky_force_2025` | Progressive MP4 | **720x300 (480p SD)** | 697 kbps (H.264 / AVC) | 48,000 Hz, 2 Channels (Stereo) | AAC-LC (94.7 kbps) |
| **Corrected Honest Stream** | `vod_parasite` | Progressive MP4 | **1148x480 (480p SD)** | 850 kbps (H.264 / AVC) | 48,000 Hz, 2 Channels (Stereo) | AAC-LC (128 kbps) |

---

## 3. Pipeline Architectural Remediation

### 3.1 Media Engine (Hls.js) Configuration
- **Buffer Safety Cap for 4K Throughput**:
  Increased `maxBufferSize` from 30MB to `60 * 1000 * 1000` (60MB). At 25 Mbps, 60MB stores ~20 seconds of 4K buffer without risk of Chromium buffer starvation or out-of-memory termination.
- **Unconstrained Viewport Sizing**:
  Set `capLevelToPlayerSize: false`. Prevents mobile WebView CSS pixel dimensions (e.g., 390x844) from down-capping the adaptive bitrate engine to 720p when connected to high-speed 5G or Wi-Fi.
- **Dynamic Level-Switch Telemetry**:
  Implemented `Hls.Events.LEVEL_SWITCHED` listener in `assets/app.js`. When ABR shifts representations (e.g. from 1080p up to 2160p 4K UHD), the top player badge (`vlcTopQualityLabel`) and status subtitle (`vlcQualitySubtitle`) update in real time with the active representation's true dimensions.

### 3.2 Dynamic Quality Selector Honesty
- **Progressive MP4 Protection**:
  Removed hardcoded 4K/1080p selection buttons from single-rendition progressive MP4 files. The modal presents only `⚡ Native Master Stream (${nativeBadge}) [Active]` and the 512 kbps `Data Saver Rendition` (if hosted on archive.org).
- **HLS Representations**:
  Dynamically maps all representations present in `hlsInstance.levels` into distinct 4K Ultra HD (2160p), 2K Quad HD (1440p), Full HD (1080p), HD (720p), SD (480p), Data Saver (360p), and Ultra Low (144p) options with live bitrate telemetry.

### 3.3 Audio Pipeline & Multichannel Support
- **Codec & Channel Detection**:
  Enhanced `getAvailableAudioTracks` to inspect `groupId`, `audioCodec`, and track names. Detects:
  - `Dolby Atmos (Spatial Audio)`
  - `Dolby Digital Plus (E-AC-3 5.1)`
  - `Dolby Digital (AC-3 5.1)`
  - `FLAC Lossless Master`
  - `Opus High Fidelity`
  - `AAC-LC High Res`
- **Native Android Hardware Audio Decoder**:
  `MainActivity.java` passes uncompressed audio buffers dynamically with user-selected or stream-provided sample rates (up to 48kHz, 96kHz, 192kHz) and channel masks (`AudioFormat.CHANNEL_OUT_5POINT1` or `CHANNEL_OUT_STEREO`) directly to `AudioTrack.Builder()`.

---

## 4. Test Verification Results

### 4.1 Unit Test Suite
- **123 / 123 tests passing** (0 failures, 0 errors, 14.82s execution time).
- Verified with `python3 -m unittest discover -s tests -p "test_*.py"`.
- Includes newly created `tests/test_4k_and_audio_support.py` validating 4K metadata honesty, Hls.js buffer sizing, level switching, and multichannel audio codecs.

### 4.2 Zero-Trust Master Media Validator
- **171 / 171 catalog titles passing** with 0 forensic issues.
- Verified with `python3 tools/media_validator.py`.

### 4.3 Production Release APK Verification
- `build_apk.sh` completed successfully.
- Produced signed release package: `T2L.apk` (23MB).
- Verified with `/home/abhiboss/Android/Sdk/build-tools/35.0.0/apksigner verify --verbose T2L.apk`:
  - `Verified using v2 scheme (APK Signature Scheme v2): true`
  - `Verified using v3 scheme (APK Signature Scheme v3): true`
  - `Number of signers: 1`
