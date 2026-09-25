# T2L / HindiIPTVValidator — Initial Baseline Catalog Report

**Generated Date:** 2026-09-25  
**Audit Scope:** Full system media catalog (`data/movies_catalog.json`) prior to zero-trust expansion and low-quality/unsupported language remediation.

---

## 1. Catalog Totals

| Metric | Count |
|---|---|
| **Total Media Items** | 144 |
| **Total Movies** | 126 |
| **Total Series** | 18 |
| **Total Seasons** | 20 |
| **Total Episodes** | 151 |

---

## 2. Release Year Distribution

### Movies:
- **2026 Movies:** 4 (`vod_avengers_doomsday_2026`, `vod_the_batman_part_ii_2026`, `vod_ramayana_part_1_2026`, `vod_toxic_2026`)
- **2025 Movies:** 5 (`vod_chhavaa`, `vod_fateh_2025`, `vod_sky_force_2025`, `vod_game_changer_2025`, `vod_war_2_2025`)
- **2024 Movies:** 24
- **2020–2023 Movies:** 42
- **Pre-2020 Movies:** 51

### Series:
- **2026 Series:** 0
- **2025 Series:** 1 (`series_solo_leveling`)
- **2024 Series:** 3 (`series_mirzapur`, `series_panchayat`, `series_kota_factory`)
- **2020–2023 Series:** 6 (`series_farzi`, `series_scam_1992`, `series_paatal_lok`, `series_the_glory`, `series_business_proposal`, `series_happiness`)
- **Pre-2020 Series:** 8 (`series_sacred_games`, `series_family_man`, `series_stranger_things`, `series_money_heist`, `series_breaking_bad`, `series_game_of_thrones`, `series_death_note`, `series_naruto_classic`)

---

## 3. Language Classification Baseline

| Classification | Movies | Series | Total |
|---|---|---|---|
| **Hindi-only** | 75 | 9 | 84 |
| **Hindi dubbed** | 6 | 0 | 6 |
| **Hindi + English** | 1 | 1 | 2 |
| **Hindi + native language** | 0 | 0 | 0 |
| **Multi-audio including Hindi** | 0 | 0 | 0 |
| **English-only** | 36 | 6 | 42 |
| **Korean-only** | 1 (`vod_parasite`) | 2 (`series_crash_landing_on_you`, `series_descendants_of_the_sun`) | 3 |
| **Japanese-only** | 0 | 0 | 0 |
| **Chinese-only** | 0 | 0 | 0 |
| **Other native-language-only** | 7 | 0 | 7 |
| **Unknown language** | 0 | 0 | 0 |

*Note: Korean-only items do not have Hindi or English audio support, violating the application requirement.*

---

## 4. Quality & Resolution Baseline

| Quality Tier | Movies | Series | Episodes |
|---|---|---|---|
| **2160p (4K UHD)** | 1 | 0 | 0 |
| **1440p (2K QHD)** | 0 | 0 | 0 |
| **1080p (FHD)** | 58 | 3 | 42 |
| **720p (HD)** | 41 | 10 | 82 |
| **480p (SD)** | 16 | 0 | 0 |
| **<480p (360p / 240p)** | 1 | 0 | 0 |
| **Unknown / Unprobed** | 9 | 5 | 27 |

*Items below 720p (17 titles) violate the minimum quality threshold of 720p.*

---

## 5. Content Status Baseline

| Status | Movies | Series | Total |
|---|---|---|---|
| **FULL_MOVIE / FULL_EPISODE** | 117 | 13 | 130 |
| **TRAILER_ONLY (Upcoming)** | 9 | 0 | 9 |
| **PREVIEW_ONLY** | 0 | 0 | 0 |
| **UPCOMING** | 0 | 0 | 0 |
| **SOURCE_OFFLINE** | 0 | 0 | 0 |
| **NO_AUTHORIZED_SOURCE** | 0 | 5 | 5 |
| **BROKEN** | 0 | 0 | 0 |
| **UNVERIFIED** | 0 | 0 | 0 |

---

## 6. Key Forensic Deficiencies Identified in Baseline

1. **Sub-720p Content Present (17 titles):** Several titles (e.g. `vod_pathaan`, `vod_munjya`, `vod_inception`, `vod_sita_ramam_2022`, `disc_Return_of_the_Kung_Fu_Dragon`) are encoded at 480p, 360p, or 240p.
2. **Korean-only Without Multi-Audio (3 titles):** `vod_parasite`, `series_crash_landing_on_you`, and `series_descendants_of_the_sun` lack Hindi or English audio streams.
3. **2025–2026 Series Coverage:** Only 1 series from 2025 and 0 from 2026.
4. **Multi-Audio Track Playback Integration:** Need robust verification that when multi-track streams are switched (e.g. Hindi <-> English), the player does not experience silent audio, desync, or race conditions.
5. **UI Main Page Filter Consistency:** Verification that all eligible catalog items render without getting filtered out on the main page.
