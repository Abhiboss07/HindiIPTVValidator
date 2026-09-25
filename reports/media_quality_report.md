# T2L Media Quality & Resolution Forensics Report

**Generated Date:** 2026-09-25  
**Version:** 15.0  
**Scope:** Forensic analysis of video dimensions, bitrates, quality classifications, and resolution integrity.

---

## 1. Executive Summary

In adherence to the core project mandate:
> *"minimum quality is 720p and max. 4k ... and also remove movies/web series which are lower quality below 720p"*

All media streams across the catalog were probed for actual display dimensions and container properties. Seventeen (17) sub-720p titles (previously encoded at 480p, 360p, or 240p) have been completely removed from the production catalog. Zero synthetic 4K or fake 1080p badges exist in the application.

---

## 2. Quality Distribution: Before vs. After

| Resolution Tier | Baseline (Before) | Current Catalog (After) | Status |
|---|---|---|---|
| **2160p (4K UHD)** | 1 | 0 | Calibrated (Downscaled to native 1080p) |
| **1440p (2K QHD)** | 0 | 0 | N/A |
| **1080p (Full HD)** | 58 | 61 | Verified Native 1080p |
| **720p (HD)** | 41 | 49 | Verified Native 720p |
| **480p (Standard Definition)** | 16 | 0 | **ELIMINATED** (Sub-720p Policy) |
| **<480p (360p / 240p)** | 1 | 0 | **ELIMINATED** (Sub-720p Policy) |
| **Official Trailers & Teasers** | 9 | 30 | Honestly Labeled (Upcoming/Previews) |
| **Unknown / Unprobed** | 18 | 0 | Fully Probed |
| **TOTAL** | **144** | **140** | **100% Quality-Compliant** |

---

## 3. Sub-720p Eliminated Titles Audit Log

The following 17 titles were discovered to be lower than 720p and have been eliminated from the production APK:

1. `vod_pathaan`: 854x480 (480p SD)
2. `vod_munjya`: 854x480 (480p SD)
3. `vod_inception`: 854x480 (480p SD)
4. `vod_his_girl_friday`: 640x480 (480p SD)
5. `vod_peninsula`: 854x480 (480p SD)
6. `vod_drishyam_2`: 854x480 (480p SD)
7. `vod_3_idiots`: 854x480 (480p SD)
8. `vod_do_bigha_zamin`: 720x576 (576p SD)
9. `disc_VoyagetothePlanetofPrehistoricWomen`: 640x480 (480p SD)
10. `disc_TheFastandtheFuriousJohnIreland1954goofyrip`: 640x480 (480p SD)
11. `disc_charlie_chaplin_film_fest`: 640x480 (480p SD)
12. `disc_Return_of_the_Kung_Fu_Dragon`: 320x240 (240p)
13. `vod_sky_force_2025`: 720x300 (480p SD)
14. `vod_rang_de_basanti_2006`: 720x320 (480p SD)
15. `vod_sita_ramam_2022`: 640x360 (360p SD)
16. `vod_jai_bhim_2021`: 640x360 (360p SD)
17. `vod_thappad_2020`: 640x360 (360p SD)

---

## 4. Web-Series Quality Governance

In previous versions, series-level metadata frequently advertised `1080p Full HD` even if individual episodes were rendered at lower resolutions.

### Remediation:
1. Every episode record in `seasons[].episodes[]` maintains its own explicit `resolution`, `qualityHonestBadge`, and `streamUrl`.
2. Commercial series without full authorized streams (e.g. `series_sacred_games`, `series_game_of_thrones`) do not claim synthetic `1080p` or `4K` badges; their quality badge is set strictly to `NO_AUTHORIZED_SOURCE` or `Official Teaser`.
3. Verified high-definition series (such as Granada's *The Adventures of Sherlock Holmes* and *Panchayat*) have all episodes confirmed at 720p/1080p with isolated stream URLs.
