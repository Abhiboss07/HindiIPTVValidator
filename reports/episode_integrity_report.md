# T2L Web-Series & Episode Integrity Forensics Report

**Generated Date:** 2026-09-25  
**Version:** 15.0  
**Scope:** Forensic analysis of web-series, seasons, episode identity, anti-trailer contamination, and stream isolation.

---

## 1. Executive Summary

Previous agents reported artificial pass rates for web-series where entire series mapped to single promotional trailers, wrong episodes, or duplicate files across different episode numbers. Under the **Zero-Trust Validation Architecture**, all series have been audited against strict episode identity invariants:
1. Every playable episode must point to a unique, isolated media file (no duplicate stream URLs across episodes).
2. Missing or unreleased episodes must display `EPISODE_UNAVAILABLE` or `NO_AUTHORIZED_SOURCE` rather than silently playing a trailer or unrelated clip.
3. Korean-only series without multi-audio or Hindi/English tracks (*Crash Landing on You*, *Descendants of the Sun*) have been removed per user policy.

---

## 2. Web-Series Inventory & Status Classification

| Series ID | Series Title | Seasons | Episodes | Playable Eps | State | Quality |
|---|---|---|---|---|---|---|
| `series_sherlock_holmes` | The Adventures of Sherlock Holmes (1984) | 2 | 26 | 26 | DIRECT_STREAM_AVAILABLE | 1080p FHD |
| `series_stranger_things` | Stranger Things (Season 5) | 1 | 8 | 8 | DIRECT_STREAM_AVAILABLE | 720p BluRay |
| `series_panchayat` | Panchayat | 2 | 8 | 8 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_mirzapur` | Mirzapur | 1 | 9 | 9 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_breaking_bad` | Breaking Bad | 1 | 7 | 7 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_kota_factory` | Kota Factory | 1 | 5 | 5 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_squid_game` | Squid Game (Multi-Audio) | 1 | 9 | 9 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_naruto_classic` | Naruto Shippuden (Hindi Dubbed) | 1 | 10 | 10 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_sherlock_holmes_1954` | Sherlock Holmes (1954 Classic) | 1 | 8 | 8 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_scam_1992` | Scam 1992: The Harshad Mehta Story | 1 | 1 | 1 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_death_note` | Death Note (English Dubbed) | 1 | 1 | 1 | DIRECT_STREAM_AVAILABLE | 720p HD |
| `series_family_man` | The Family Man | 1 | 1 | 0 | NO_AUTHORIZED_SOURCE | Honest Unavailable |
| `series_money_heist` | Money Heist (La Casa de Papel) | 1 | 9 | 0 | NO_AUTHORIZED_SOURCE | Honest Unavailable |
| `series_sacred_games` | Sacred Games | 1 | 8 | 0 | NO_AUTHORIZED_SOURCE | Honest Unavailable |
| `series_farzi` | Farzi | 1 | 8 | 0 | NO_AUTHORIZED_SOURCE | Honest Unavailable |
| `series_paatal_lok` | Paatal Lok | 1 | 1 | 0 | NO_AUTHORIZED_SOURCE | Honest Unavailable |
| `series_family_man_s3_2025` | The Family Man Season 3 (2025) | 0 | 0 | 0 | TRAILER_ONLY | Official Teaser |
| `series_farzi_s2_2025` | Farzi Season 2 (2025) | 0 | 0 | 0 | TRAILER_ONLY | Official Teaser |
| `series_paatal_lok_s2_2025` | Paatal Lok Season 2 (2025) | 0 | 0 | 0 | TRAILER_ONLY | Official Teaser |
| `series_delhi_crime_s3_2025` | Delhi Crime Season 3 (2025) | 0 | 0 | 0 | TRAILER_ONLY | Official Teaser |
| `series_squid_game_s2_2025` | Squid Game Season 2 (2025) | 0 | 0 | 0 | TRAILER_ONLY | Official Teaser |

---

## 3. Metrics Summary

- **Total Series in Catalog:** 21
- **Total Structured Seasons:** 18
- **Total Registered Episodes:** 119
- **Playable Episodes (Direct Streams):** 92
- **Honest Unavailable Commercial Episodes:** 27
- **Zero Duplicate Stream URLs Across Playable Episodes:** Verified (100% Isolated)
- **Zero Trailer-as-Episode Contamination:** Verified

---

## 4. Episode Navigation & Player Safety

In `assets/app.js`, `playSeriesEpisode(movieId, seasonNumber, episodeId)` executes strict identity matching:
```javascript
const s = movie.seasons.find(sea => sea.seasonNumber === seasonNumber);
const ep = s.episodes.find(e => String(e.id) === String(episodeId));
if (!ep || !ep.streamUrl) {
    showToast('Episode currently unavailable from authorized sources');
    return;
}
```
This guarantees that no fallback to random episodes, trailers, or previews can occur at runtime.
