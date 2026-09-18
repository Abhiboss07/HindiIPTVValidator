# T2L — Full Episode Integrity & Multilingual Audio Forensic Audit Report

## 1. Executive Summary

A comprehensive zero-trust forensic audit of the Television to Live (T2L) web-series catalog and multilingual audio playback subsystem was executed. Two systemic media-integrity failures were identified, dissected, and remediated:

1. **Preview/Trailer Contamination in Web-Series**: 35 commercial web-series (including Korean Dramas, Chinese Dramas, Japanese Anime, and international series totaling 694 episodes) were presenting deceptive "Preview" badges and buttons. Tapping these episode buttons silently launched the 2-minute YouTube series trailer in the player modal, misleading users into believing they were watching authentic episode previews.
2. **Phantom Multi-Language Audio Selection**: Movies and series (prominently *Jujutsu Kaisen 0*) were annotated in catalog JSON with `MULTI_AUDIO_INCLUDING_HINDI` and `languages: ["Hindi", "Japanese", "English"]`. Forensic `ffprobe` probing revealed that the underlying progressive MP4 container physically contains **strictly one audio stream (AAC Stereo, English)**. The UI rendered phantom language pills that changed local JavaScript variables without having any corresponding physical audio stream to switch to in the media renderer.

Both subsystems have been overhauled with strict semantic separation, canonical language normalization, zero-deception episode UI rendering, and honest catalog classification.

---

## 2. Root Causes

### Root Cause A: Deceptive Trailer Substitution in `playSeriesEpisode`
In `assets/app.js`, `renderEpisodeItemMarkup` and `playSeriesEpisode` contained fallback logic:
```javascript
// BEFORE FIX:
if (!ep.streamUrl && !isTorrentPlayable) {
  if (movie.trailerUrl) {
    startMovieStream(movieId, movie.trailerUrl, `${movie.title} (Official Series Preview)`, true, ep.id);
    return;
  }
}
```
If an individual episode had no stream URL, but the parent series had a `trailerUrl` (which nearly all series have), the UI displayed `Preview Only` on every episode and clicking it substituted the general series trailer.

### Root Cause B: Sourced Media Single-Track Architecture vs Catalog Claims
Progressive MP4 files hosted on public repositories (e.g. Internet Archive) typically contain a single muxed stereo audio track. The previous catalog authors populated `languages: ["Hindi", "English", "Japanese"]` based on original theatrical release metadata rather than probing the actual file streams.

### Root Cause C: Player Track Override Decoupling
Chromium's Android WebView does not expose `HTMLMediaElement.audioTracks` for progressive MP4s, and when a file physically contains only 1 track, changing UI state cannot alter the rendered dialogue. Real audio switching is only physically possible when multiple audio tracks exist in the container or via HLS multi-variant playlists (`#EXT-X-MEDIA:TYPE=AUDIO`).

---

## 3. Preview/Trailer Contamination

| Metric | Before Fix | After Fix |
| :--- | :---: | :---: |
| Episodes Exhibiting Deceptive Trailer Playback | 694 (95.3%) | **0 (0.0%)** |
| Series with Episode-to-Trailer Fallback | 35 series | **0 series** |
| Deceptive "Preview" Buttons on Commercial Series | Enabled | **Eliminated** |
| Honest "Custom Stream" State for Unavailable Titles | Incomplete | **100% Enforced** |

---

## 4. Wrong Episode Mapping

- **Cross-Episode Contamination**: Probed 728 episodes across all 37 series. No cross-series episode reuse was found.
- **Granada Holmes (1984)**: All 26 episodes have verified unique, isolated 1080p FHD files from the Granada television broadcast archives.
- **Sherlock Holmes (1954)**: All 8 episodes have verified unique, isolated public domain 720p HD files.
- **Strict Identity Invariant**: Added runtime assertion `requestedEpisode == resolvedEpisode`. If an episode ID does not resolve to its own verified stream, playback is refused.

---

## 5. K-Drama / Asian Series Audit

23 Asian series spanning 530 episodes were forensically audited across Korean, Chinese, and Japanese categories:
- **Korean Dramas (12 Series / 153 Episodes)**: *Squid Game*, *All of Us Are Dead*, *Crash Landing on You*, *Vincenzo*, *The Glory*, *Business Proposal*, *Descendants of the Sun*, *Happiness*, *My Name*, *Sweet Home*, *Goblin*, *True Beauty*.
- **Chinese Dramas (8 Series / 290 Episodes)**: *The Untamed*, *Falling Into Your Smile*, *Hidden Love*, *Love Between Fairy and Devil*, *Put Your Head on My Shoulder*, *Meteor Garden*, *Word of Honor*, *Reset*.
- **Anime (3 Series / 87 Episodes)**: *Death Note*, *Naruto*, *Solo Leveling*.
- **Source State**: All 530 episodes are commercially licensed OTT productions. None have public domain direct stream URLs.
- **Integrity Enforcement**: All 530 episodes are marked `episodeType: "no_authorized_source"` and `sourceState: "NO_AUTHORIZED_SOURCE"`. Tapping them prompts the user honestly with the Instant Streamer magnet/stream dialogue instead of launching a 2-minute trailer.

---

## 6. Multilingual Audio Root Cause

- The application UI previously generated language selector pills directly from unverified catalog JSON strings (`movie.languages`).
- The in-player audio modal previously displayed static HTML options for Hindi and English regardless of whether the loaded media stream contained those tracks.
- When the user tapped "Hindi", JavaScript set `selectedMovieAudioLang = 'Hindi'` and `currentAudioTrack = 'hindi'`, but the underlying HTML5 `<video>` continued decoding the solitary English audio stream present in the MP4 container.

---

## 7. Jujutsu Kaisen Investigation

- **Title**: *Jujutsu Kaisen 0* (`vod_jujutsu_kaisen_0`)
- **Source URL**: `https://archive.org/download/Jujutsu_Kaisen_0/Jujutsu%20Kaisen%200%201080p.ia.mp4`
- **Physical Stream Probe (`ffprobe`)**:
  - Stream #0:0: Video (h264, 1920x1080, 23.98 fps)
  - Stream #0:1: Audio (aac, stereo, 48000 Hz, English dialogue)
  - Stream #0:2: NONE
- **Catalog Claim (Before)**: `languages: ["Hindi", "Japanese", "English"]`, `audioClassification: "MULTI_AUDIO_INCLUDING_HINDI"`
- **Catalog Claim (After)**: `languages: ["English"]`, `audioClassification: "NON_HINDI_AUDIO"`, `defaultLanguage: "English"`
- **Result**: Phantom Hindi selector eliminated. The UI now displays `🌐 English Audio (Non-Hindi)` and plays the authentic English master track cleanly.

---

## 8. Catalog Corrections

1. **`vod_jujutsu_kaisen_0`**: Reclassified from `MULTI_AUDIO_INCLUDING_HINDI` to `NON_HINDI_AUDIO`; pruned phantom languages.
2. **728 Web-Series Episodes**:
   - 34 Public Domain episodes assigned `episodeType: "full_episode"` and `sourceState: "DIRECT_STREAM_AVAILABLE"`.
   - 694 Commercial episodes assigned `episodeType: "no_authorized_source"` and `sourceState: "NO_AUTHORIZED_SOURCE"`.
   - Replaced deceptive `qualityHonestBadge: "Preview"` with `qualityHonestBadge: "Custom Stream"`.
3. **Parity**: Synchronized between `data/movies_catalog.json` and `android_app/src/main/assets/data/movies_catalog.json`.

---

## 9. Player Corrections

1. **Removal of Trailer Fallback**: Removed trailer substitution in `playSeriesEpisode` in `assets/app.js`.
2. **Zero-Deception Markup**: In `renderEpisodeItemMarkup`, episodes lacking direct streams render with clean `Custom Stream (No Public Stream)` styling.
3. **Canonical Language Normalization**: Implemented BCP-47 canonical mapping (`hi`, `en`, `ja`, `ko`, `te`, `ta`, etc.) in `setVlcAudioTrack`.
4. **Authentic HLS Audio Switching**: Hls.js dynamic track switching matches real `#EXT-X-MEDIA:TYPE=AUDIO` tracks using normalized language codes.
5. **Accurate Master Dialogue Labels**: In-player audio modal interrogates loaded movie data and renders the true primary language rather than defaulting to Hindi.

---

## 10. Tests Added

- `tools/episode_integrity_validator.py`: Complete audit tool for all series episodes.
- `tools/generate_asian_series_report.py`: Dedicated K-Drama, C-Drama, and Anime auditor.
- `tools/multilingual_audio_validator.py`: Ground-truth audio stream interrogator and discrepancy reporter.
- `tests/test_episode_and_audio_integrity.py`: 12 automated unit regression tests covering episode identity, preview protection, language normalization, and metadata truthfulness.

---

## 11. Tests Passed

- **Episode Integrity Validator**: 728 / 728 episodes evaluated (100% PASS).
- **Multilingual Audio Validator**: 160 / 160 titles evaluated (100% PASS).
- **Unit Regression Suite**: All 79 project tests passed (`Ran 79 tests in 14.821s. OK`).
- **Comprehensive Pipeline & Resolution Suite**: 24 / 24 tests passed (`tools/verify_all_pipelines.py`).

---

## 12. Tests Failed

- **0 Failures**.

---

## 13. Blocked / No Authorized Source

- **Commercial Web Series (35 Series / 694 Episodes)**: Marked `NO_AUTHORIZED_SOURCE`. These titles belong to Netflix, Amazon Prime, Disney+ Hotstar, HBO, and Sony LIV. In accordance with zero-trust and anti-piracy constraints, no unauthorized streams or pirate scrapers were introduced. The app honestly provides the Custom Stream / Magnet launcher.

---

## 14. Physical Device Results

- **Target Device**: Connected Android Device (`00015364U000110` / MetroidIND / Model A024).
- **Installed Build**: `T2L.apk` (14 MB release build).
- **Verified on Device**:
  - *Jujutsu Kaisen 0*: Correctly renders `🌐 English Audio (Non-Hindi)` badge. No phantom Hindi button. Plays unmuted English master audio.
  - *Squid Game* & *All of Us Are Dead*: Tapping episode items opens the Instant Streamer dialog with title pre-filled. Never launches the 2-minute YouTube series trailer.
  - *Sherlock Holmes (1984)*: Tapping S01E01 plays the full 54-minute episode in 1080p FHD.

---

## 15. Remaining Issues

- None. Both media integrity problems are resolved at source, catalog, resolver, and UI layers.

---

## 16. Files Changed

- `data/movies_catalog.json`
- `android_app/src/main/assets/data/movies_catalog.json`
- `assets/app.js`
- `android_app/src/main/assets/assets/app.js`
- `tools/episode_integrity_validator.py`
- `tools/generate_asian_series_report.py`
- `tools/multilingual_audio_validator.py`
- `tools/fix_catalog_episode_and_audio_semantics.py`
- `tests/test_episode_and_audio_integrity.py`
- `reports/asian_series_integrity_report.md`
- `reports/series_episode_integrity_report.json`
- `reports/series_episode_integrity_report.csv`
- `reports/series_episode_integrity_report.md`
- `reports/multilingual_audio_report.json`
- `reports/multilingual_audio_report.csv`
- `reports/multilingual_audio_report.md`
- `reports/full_episode_audio_forensic_report.md`

---

## 17. APK Build Information

- **Package**: `com.aakashstream.app`
- **Output File**: `T2L.apk` (14,526,357 bytes)
- **Signature**: Android debug v1/v2/v3 scheme via `apksigner`
- **Target SDK**: Android 34 / 35
