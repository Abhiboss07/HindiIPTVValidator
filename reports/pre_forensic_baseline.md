# T2L Pre-Forensic Catalog Baseline Audit

**Timestamp**: 2026-09-25T15:39:11.356712+00:00
**Catalog Version**: 17
**Total Inventory Items**: 170

## 1. Inventory Summary
| Metric | Count |
| :--- | :--- |
| **Total Movies** | 147 |
| **Total Web-Series** | 23 |
| **Total Episodes** | 156 |

## 2. Year Breakdown (Recent & Modern Focus)
| Year | Movies | Web-Series |
| :--- | :--- | :--- |
| **2026** | 8 | 0 |
| **2025** | 12 | 6 |
| **2024** | 24 | 3 |

## 3. Audio Classification
| Audio Category | Count |
| :--- | :--- |
| **Hindi Audio (Sole)** | 103 |
| **Hindi + English** | 0 |
| **Hindi + Native** | 0 |
| **Multilingual (incl. Hindi)** | 8 |
| **English-Only** | 49 |
| **Native-Only** | 10 |

## 4. Resolution Distribution
| Resolution | Count |
| :--- | :--- |
| **2160p (4K UHD)** | 1 |
| **1440p (2K)** | 0 |
| **1080p (Full HD)** | 72 |
| **720p (HD)** | 51 |
| **480p (SD)** | 14 |
| **< 480p (Low Res)** | 4 |
| **Other / Trailer Badge** | 28 |

## 5. Playability & Source States
| Source State | Count |
| :--- | :--- |
| **Full Movies (Direct Stream)** | 127 |
| **Full Series (Direct Stream)** | 13 |
| **Official Trailers & Teasers** | 20 |
| **Unavailable (No Authorized Source)** | 10 |

## 6. Pre-Forensic Failure Inventory
| Title (ID) | Category | Root Cause / Forensic Findings |
| :--- | :--- | :--- |
| **Salaar Part 1** (`vod_salaar`) | WRONG_THUMBNAIL + FALSE_HINDI | Poster is for indie romance movie *Love? With a question mark*. Stream is Telugu HQ HDRip, but catalog falsely declares `HINDI_AUDIO`. |
| **Tumbbad** (`vod_tumbbad`) | LANGUAGE_DISCREPANCY | Stream audio is Marathi/native audio with `und` (Marathi) tag; catalog declares pure `Hindi`. |
| **Spirit (2026)** (`vod_spirit_2026`) | SYNTHETIC_POSTER | Poster is synthetic PIL star graphic instead of verified announcement visual. |
| **Spider-Man 4 (2026)** (`vod_spiderman_4_2026`) | SYNTHETIC_POSTER | Poster is synthetic PIL spider graphic instead of verified Marvel Studios artwork. |
| **King (2026)** (`vod_king_2026`) | SYNTHETIC_POSTER | Poster is synthetic PIL crown graphic instead of verified Red Chillies artwork. |
| **Alpha (2026)** (`vod_alpha_2026`) | SYNTHETIC_POSTER | Poster is synthetic PIL Greek alpha graphic instead of verified YRF Spy Universe visual. |
