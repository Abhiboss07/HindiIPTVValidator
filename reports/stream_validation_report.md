# T2L Autonomous Stream & Movie Source Validation Report
**Generated:** `2026-09-18 14:54:52 UTC` | **Engine Version:** `1.0.0`

---

## Executive Summary & Source Health Overview

| Media Category | Total Discovered | PASS (Playable) | FAIL (Broken) | TRAILER_ONLY | NO_SOURCE | Quality Mismatches |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🎬 **Movies (Priority 1)** | **99** | **94** | **0** | **5** | 0 | 0 |
| 📺 **Series & Episodes (Priority 2)** | 37 series (0 eps) | **0** eps | **0** eps | - | 0 | 0 wrong |
| 📹 **Trailers (Priority 3)** | **0** | **0** | **0** | - | - | - |
| 📡 **Live TV & Radio** | **0** | **0** | **0** | - | - | - |
| 🖼️ **Posters / Thumbnails** | **99** | **99** | **0** | - | - | - |

### 🌟 Movie Resolution Standard (Min 1080p up to 4K)
- **4K UHD (2160p):** `0`
- **1080p (Full HD):** `27`
- **Sub-1080p (<1080p):** `67`
- **Trailer-to-Movie Enforcement:** `5 missing movie streams for trailer entries` (Rule: If trailer is present, movie must be present)

### 📊 Regression Tracking vs Previous Run
- **Previous Run Timestamp:** `2026-09-18 14:47:53 UTC`
- **Fixed Sources:** `+8`
- **New Failures:** `0`
- **Playable Movies Delta:** `+8`

---

## 1. Movies (Priority 1 Audit)

> [!IMPORTANT]
> Trailers are strictly classified as `TRAILER_ONLY` and **never** reported as a movie PASS.

| ID | Movie Title | Status | Source Type | Probed Quality | Claimed Quality | Failure Reason / Details |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `vod_gladiator_2` | **Gladiator II** | 📹 TRAILER_ONLY | Trailer | `-` | `480p SD (854x480)` | Only official trailer is available; full movie stream absent. |
| `vod_pathaan` | **Pathaan** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_interstellar` | **Interstellar** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_kalki_2898_ad` | **Kalki 2898 AD** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_furiosa` | **Furiosa: A Mad Max Saga** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_shaitaan` | **Shaitaan** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_dark_knight` | **Iron Man** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_spider_verse` | **Spider-Man: Into the Spider-Verse** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_stree_2` | **Stree 2: Sarkate Ka Aatank** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_chhavaa` | **Chhaava** | ✅ PASS | Direct Stream | `720p (HD)` | `720p HD (1280x640)` | PASS |
| `vod_alien_romulus` | **Alien: Romulus** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_munjya` | **Munjya** | ✅ PASS | Direct Stream | `360p` | `480p SD (854x480)` | PASS |
| `vod_godzilla_x_kong` | **Godzilla x Kong: The New Empire** | ✅ PASS | Direct Stream | `1440p (2K)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_12th_fail` | **12th Fail** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (960x402)` | PASS |
| `vod_dune_part_two` | **Dune: Part Two** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_oppenheimer` | **Oppenheimer** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (1056x480)` | PASS |
| `vod_leo` | **Leo: Bloody Sweet** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_jawan` | **Jawan** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x804)` | PASS |
| `vod_salaar` | **Salaar: Part 1 - Ceasefire** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_dunki` | **Dunki** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_top_gun_maverick` | **Top Gun: Maverick** | 📹 TRAILER_ONLY | Trailer | `-` | `Official Trailer` | Only official trailer is available; full movie stream absent. |
| `vod_fighter` | **Fighter** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_the_batman` | **The Batman** | 📹 TRAILER_ONLY | Trailer | `-` | `Official Trailer` | Only official trailer is available; full movie stream absent. |
| `vod_gadar_2` | **Gadar 2: The Katha Continues** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_rrr` | **RRR** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (1152x480)` | PASS |
| `vod_avatar_way_of_water` | **Avatar: The Way of Water** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_brahmastra` | **Brahmāstra: Part One – Shiva** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_tiger_3` | **Tiger 3** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_animal` | **Animal** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_spider_man_nwh` | **Spider-Man: No Way Home** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_avengers_endgame` | **Avengers: Endgame** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_inception` | **Inception** | ✅ PASS | Direct Stream | `360p` | `480p SD (854x480)` | PASS |
| `vod_bbb_720p` | **Big Buck Bunny** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p Adaptive HLS` | IDENTITY_UNVERIFIED |
| `vod_deadpool_wolverine` | **Deadpool & Wolverine** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_sita_sings_blues` | **Sita Sings the Blues** | ✅ PASS | Direct Stream | `720p (HD)` | `720p HD (1280x720)` | PASS |
| `vod_his_girl_friday` | **His Girl Friday** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (640x480)` | PASS |
| `vod_train_to_busan` | **Train to Busan** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_kgf_chapter_2` | **K.G.F: Chapter 2** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_parasite` | **Parasite** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_pushpa_the_rise` | **Pushpa: The Rise** | ✅ PASS | Direct Stream | `480p (SD)` | `720p HD (1280x720)` | IDENTITY_UNVERIFIED |
| `vod_ip_man_4` | **Ip Man 4: The Finale** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_the_raid_redemption` | **The Raid: Redemption** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `480p SD (854x480)` | PASS |
| `vod_ip_man` | **Ip Man** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_peninsula` | **Peninsula** | ✅ PASS | Direct Stream | `360p` | `480p SD (854x480)` | PASS |
| `vod_dangal` | **Dangal** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x804)` | PASS |
| `vod_john_wick_4` | **John Wick: Chapter 4** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_shaolin_soccer` | **Shaolin Soccer** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_the_outlaws` | **The Outlaws** | ✅ PASS | Direct Stream | `360p` | `720p HD (1280x720)` | PASS |
| `vod_suzume` | **Suzume** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_jujutsu_kaisen_0` | **Jujutsu Kaisen 0** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `480p SD (854x480)` | PASS |
| `vod_your_name` | **Your Name (Kimi no Na wa)** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | IDENTITY_UNVERIFIED |
| `vod_the_roundup` | **The Roundup** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_one_piece_film_red` | **One Piece Film: Red** | ✅ PASS | Direct Stream | `360p` | `1080p FHD (1920x1080)` | PASS |
| `vod_stree` | **Stree** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_kung_fu_hustle` | **Kung Fu Hustle** | ✅ PASS | Direct Stream | `720p (HD)` | `480p SD (854x480)` | PASS |
| `vod_drishyam_2` | **Drishyam 2** | ✅ PASS | Direct Stream | `360p` | `480p SD (854x480)` | PASS |
| `vod_kantara` | **Kantara** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_3_idiots` | **3 Idiots** | ✅ PASS | Direct Stream | `360p` | `480p SD (854x480)` | PASS |
| `vod_kgf_chapter_1` | **K.G.F: Chapter 1** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_andhadhun` | **Andhadhun** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_baahubali_2` | **Baahubali 2: The Conclusion** | ✅ PASS | Direct Stream | `360p` | `480p SD (854x480)` | PASS |
| `vod_demon_slayer_mugen_train` | **Demon Slayer: Mugen Train** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_gangs_of_wasseypur` | **Gangs of Wasseypur** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_tumbbad` | **Tumbbad** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_masoom_1983` | **Masoom** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_baahubali_1` | **Baahubali: The Beginning** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `480p SD (854x480)` | PASS |
| `vod_do_bigha_zamin` | **Do Bigha Zamin** | ✅ PASS | Direct Stream | `480p (SD)` | `576p SD (720x576)` | PASS |
| `vod_shershaah` | **Uri: The Surgical Strike** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_carnival_of_souls` | **Carnival of Souls** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_charade_1963` | **Charade** | ✅ PASS | Direct Stream | `240p` | `1080p FHD (1920x1080)` | PASS |
| `vod_house_on_haunted_hill` | **House on Haunted Hill** | ✅ PASS | Direct Stream | `480p (SD)` | `720p HD (1280x720)` | PASS |
| `vod_vikram_vedha` | **Vikram Vedha** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (854x480)` | PASS |
| `vod_chhoti_si_baat` | **Chhoti Si Baat** | ✅ PASS | Direct Stream | `240p` | `720p HD (1280x720)` | PASS |
| `vod_avengers_doomsday_2026` | **Avengers: Doomsday** | 📹 TRAILER_ONLY | Trailer | `-` | `Official Studio Teaser` | Only official trailer is available; full movie stream absent. |
| `vod_the_batman_part_ii_2026` | **The Batman Part II** | 📹 TRAILER_ONLY | Trailer | `-` | `Official Studio Teaser` | Only official trailer is available; full movie stream absent. |
| `vod_dressed_to_kill` | **Dressed to Kill (Sherlock Holmes)** | ✅ PASS | Direct Stream | `480p (SD)` | `720p HD (1280x720)` | IDENTITY_UNVERIFIED |
| `vod_jaane_bhi_do_yaaro` | **Jaane Bhi Do Yaaro** | ✅ PASS | Direct Stream | `720p (HD)` | `720p HD (1280x720)` | PASS |
| `disc_TheFastandtheFuriousJohnIreland1954goofyrip` | **The Fast And The Furious** | ✅ PASS | Direct Stream | `480p (SD)` | `480p (SD)` | PASS |
| `disc_charlie_chaplin_film_fest` | **Charlie Chaplin Festival** | ✅ PASS | Direct Stream | `480p (SD)` | `480p (SD)` | IDENTITY_UNVERIFIED |
| `vod_night_of_the_living_dead` | **Night of the Living Dead** | ✅ PASS | Direct Stream | `480p (SD)` | `1080p FHD (1920x1080)` | PASS |
| `vod_fateh_2025` | **Fateh** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (1146x480)` | PASS |
| `disc_Return_of_the_Kung_Fu_Dragon` | **Return Of The Kung Fu Dragon** | ✅ PASS | Direct Stream | `240p` | `240p` | PASS |
| `vod_game_changer_2025` | **Game Changer** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (1152x480)` | PASS |
| `vod_badla_2019` | **Badla** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x804)` | PASS |
| `vod_laapataa_ladies_2024` | **Laapataa Ladies** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x960)` | PASS |
| `vod_article_370_2024` | **Article 370** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (1154x480)` | PASS |
| `vod_mission_raniganj_2023` | **Mission Raniganj** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x804)` | PASS |
| `disc_VoyagetothePlanetofPrehistoricWomen` | **Voyage To The Planet Of Prehistoric Women** | ✅ PASS | Direct Stream | `480p (SD)` | `480p (SD)` | PASS |
| `vod_airlift_2016` | **Airlift** | ✅ PASS | Direct Stream | `720p (HD)` | `1080p FHD (1904x816)` | PASS |
| `vod_rockstar_2011` | **Rockstar** | ✅ PASS | Direct Stream | `720p (HD)` | `720p HD (1280x544)` | PASS |
| `vod_baby_2015` | **Baby** | ✅ PASS | Direct Stream | `720p (HD)` | `1080p FHD (1904x816)` | PASS |
| `vod_sky_force_2025` | **Sky Force** | ✅ PASS | Direct Stream | `360p` | `480p SD (720x300)` | PASS |
| `vod_holiday_2014` | **Holiday: A Soldier Is Never Off Duty** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x816)` | PASS |
| `vod_znmd_2011` | **Zindagi Na Milegi Dobara** | ✅ PASS | Direct Stream | `480p (SD)` | `480p SD (1130x480)` | PASS |
| `vod_kesari_2019` | **Kesari** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x816)` | PASS |
| `vod_taare_zameen_par_2007` | **Taare Zameen Par** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x816)` | PASS |
| `vod_ghajini_2008` | **Ghajini** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x816)` | PASS |
| `vod_rang_de_basanti_2006` | **Rang De Basanti** | ✅ PASS | Direct Stream | `360p` | `480p SD (720x320)` | PASS |
| `vod_lagaan_2001` | **Lagaan: Once Upon a Time in India** | ✅ PASS | Direct Stream | `1080p (Full HD)` | `1080p FHD (1920x816)` | PASS |

---

## 2. Web Series & Episodes (Priority 2 Audit)

| Series Title | Episode Title | Status | Stream URL / Source | Probed Resolution | Reason / Note |
| :--- | :--- | :---: | :--- | :---: | :--- |

---

## 3. Official Trailers (Priority 3 Audit)

| Parent Title | Category | Status | Embed URL | Failure Reason |
| :--- | :---: | :---: | :--- | :--- |