# Modern Movie Catalog Gap Analysis (2020–2026)

## Baseline Distribution Audit

```text
YEAR       CURRENT MOVIES
-------------------------
2020       2
2021       3
2022       12
2023       12
2024       13
2025       4
2026       2
-------------------------
TOTAL      48 / 99 movies
```

### Current Modern Proportion
- **Modern Movies (2020–2026)**: 48 (48.5% of total 99 catalog movies)
- **Pre-2020 Movies**: 51 (51.5% of total 99 catalog movies)

---

## Gap Matrix & Identified Deficits

### 1. Severe Year Deficits
- **2026 (2 entries)**: *Avengers: Doomsday* and *The Batman Part II* are both unreleased upcoming films with trailer-only streams (`streamUrl: null`). Zero released 2026 movies are currently playable. Under project rules, upcoming movies must NOT masquerade as playable films.
- **2025 (4 entries)**: *Fateh*, *Sky Force*, *Game Changer*, and *Chhaava*. 2025 representation is critically sparse.
- **2020 (2 entries) & 2021 (3 entries)**: Major modern milestone years severely under-indexed compared to 2022–2024.
- **2024 (13 entries)**: High demand period, yet missing landmark Pan-Indian, critically acclaimed, and regional crossover titles.

### 2. Language & Regional Cinema Underrepresentation
- **Malayalam Cinema**: Underrepresented in 2020–2024 blockbusters despite groundbreaking recent output (*Aavesham*, *Bramayugam*, *Manjummel Boys*, *Premalu*, *The Goat Life*).
- **Tamil Cinema**: Lacks major 2021–2024 hits (*Jai Bhim*, *Vikram*, *Jailer*, *Maharaja*).
- **Telugu Cinema**: Missing top pan-Indian releases (*Ala Vaikunthapurramuloo*, *Karthikeya 2*, *Hanu-Man*).
- **Kannada Cinema**: Missing crossover emotional/adventure modern titles (*777 Charlie*).
- **Hindi Original Cinema**: Missing key critically acclaimed films (*Ludo*, *Thappad*, *Sardar Udham*, *Amar Singh Chamkila*, *Article 370*, *Laapataa Ladies*, *Sam Bahadur*).

### 3. Multi-Audio & Dub Deficits
- High demand for multi-track audio (`MULTI_AUDIO_INCLUDING_HINDI`) where original regional audio (Tamil/Telugu/Malayalam) is paired with authentic Hindi dub tracks.
- Currently, many South Indian entries only have single language tracks or lack Hindi dub tracks.

### 4. Genre Diversity Deficits
- **Biography / Historical**: Sparse in modern eras (*Sardar Udham*, *Amar Singh Chamkila*, *Sam Bahadur*).
- **Psychological / Dark Fantasy / Horror**: Underrepresented (*Bramayugam*).
- **Caper / Dark Comedy / Action**: Low count in modern years (*Aavesham*, *Ludo*, *Blackout*).
- **Survival / Real-Life Drama**: Missing (*Manjummel Boys*, *The Goat Life*).

---

## Action Plan: Priority Expansion Pipeline

1. **Verify candidate streams** using `MediaProber` (bounded probesize, HTTPS audio/video stream extraction, duration check >= 40 min).
2. **Assign honest quality badges** (`1080p`, `720p`, `360p`) matching probed container dimensions.
3. **Assign precise 5-tier audio classifications** (`HINDI_AUDIO`, `MULTI_AUDIO_INCLUDING_HINDI`, `NON_HINDI_AUDIO`).
4. **Acquire local poster assets** directly into `assets/posters/` and synchronize to `android_app/src/main/assets/assets/posters/`.
5. **Enforce Zero-Trust Rules**: Reject duplicates, upcoming 2026 films without full media, and fake trailers.
