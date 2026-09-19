# T2L Multilingual Audio Forensic Audit Report

**Total Multilingual / Language-Annotated Titles Audited**: 141

## 1. Executive Summary

- **Zero-Trust Audio Audited**: 141 titles
- **Physical Stream-to-Catalog Mismatches Detected**: 24
- **Jujutsu Kaisen 0 Status**: Catalog false Hindi claims corrected to single-track English master.
- **Phantom Multi-Language Selectors Eliminated**: Single-track MP4s strictly bound to actual track without fake Hindi switches.

## 2. Audio Track Forensic Matrix

| ID | Title | Claimed Langs | Claimed Class | Actual Streams | Actual Langs | Mismatch? | Result |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| `series_sherlock_holmes` | **The Adventures of Sherlock Holmes (1984)** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_stranger_things` | **Stranger Things** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_panchayat` | **Panchayat** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `series_mirzapur` | **Mirzapur** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_deadpool_wolverine` | **Deadpool & Wolverine** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_stree_2` | **Stree 2: Sarkate Ka Aatank** | Hindi, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_kalki_2898_ad` | **Kalki 2898 AD** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_gladiator_2` | **Gladiator II** | English | `NON_HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_spider_verse` | **Spider-Man: Into the Spider-Verse** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_pathaan` | **Pathaan** | Hindi, English, Telugu, Tamil | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `series_family_man` | **The Family Man** | Hindi, English, Tamil, Telugu | `MULTI_AUDIO_INCLUDING_HINDI` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `series_money_heist` | **Money Heist (La Casa de Papel)** | Hindi, English | `MULTI_AUDIO_INCLUDING_HINDI` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `series_scam_1992` | **Scam 1992: The Harshad Mehta Story** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `series_sacred_games` | **Sacred Games** | Hindi | `HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_interstellar` | **Interstellar** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_breaking_bad` | **Breaking Bad** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_dark_knight` | **Iron Man** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_chhavaa` | **Chhaava** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `series_kota_factory` | **Kota Factory** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_dune_part_two` | **Dune: Part Two** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_furiosa` | **Furiosa: A Mad Max Saga** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_shaitaan` | **Shaitaan** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_alien_romulus` | **Alien: Romulus** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_munjya` | **Munjya** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_fighter` | **Fighter** | Hindi, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_godzilla_x_kong` | **Godzilla x Kong: The New Empire** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_12th_fail` | **12th Fail** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_oppenheimer` | **Oppenheimer** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_farzi` | **Farzi** | Hindi | `HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_john_wick_4` | **John Wick: Chapter 4** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_leo` | **Leo: Bloody Sweet** | Hindi, Tamil, Telugu, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_jawan` | **Jawan** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_tiger_3` | **Tiger 3** | Hindi, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_salaar` | **Salaar: Part 1 - Ceasefire** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_dunki` | **Dunki** | Hindi, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_animal` | **Animal** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_gadar_2` | **Gadar 2: The Katha Continues** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_kgf_chapter_2` | **K.G.F: Chapter 2** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_top_gun_maverick` | **Top Gun: Maverick** | English | `NON_HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_rrr` | **RRR** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_the_batman` | **The Batman** | English | `NON_HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_avatar_way_of_water` | **Avatar: The Way of Water** | English, Hindi, Tamil, Telugu | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_brahmastra` | **Brahmāstra: Part One – Shiva** | Hindi, Telugu, Tamil, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_spider_man_nwh` | **Spider-Man: No Way Home** | English, Hindi, Tamil, Telugu | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_pushpa_the_rise` | **Pushpa: The Rise** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `series_paatal_lok` | **Paatal Lok** | Hindi | `HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_avengers_endgame` | **Avengers: Endgame** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_dangal` | **Dangal** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_inception` | **Inception** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_sita_sings_blues` | **Sita Sings the Blues** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_bbb_720p` | **Big Buck Bunny** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_his_girl_friday` | **His Girl Friday** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_squid_game` | **Squid Game** | Hindi, English | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `series_crash_landing_on_you` | **Crash Landing on You** | Korean | `NON_HINDI_AUDIO` | 1 | ko | NO | **PASS** |
| `series_descendants_of_the_sun` | **Descendants of the Sun** | Korean | `NON_HINDI_AUDIO` | 1 | ko | NO | **PASS** |
| `vod_train_to_busan` | **Train to Busan** | Hindi, Korean | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_parasite` | **Parasite** | Hindi, Korean | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_the_raid_redemption` | **The Raid: Redemption** | Hindi, Indonesian | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_ip_man` | **Ip Man** | Hindi, Cantonese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_ip_man_4` | **Ip Man 4: The Finale** | Hindi, Cantonese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_peninsula` | **Peninsula** | Hindi, Korean | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_kung_fu_hustle` | **Kung Fu Hustle** | Hindi, Cantonese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_shaolin_soccer` | **Shaolin Soccer** | Hindi, Cantonese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_the_outlaws` | **The Outlaws** | Korean, English | `NON_HINDI_AUDIO` | 1 | ko, en | NO | **PASS** |
| `vod_the_roundup` | **The Roundup** | Hindi, Korean | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_demon_slayer_mugen_train` | **Demon Slayer: Mugen Train** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_jujutsu_kaisen_0` | **Jujutsu Kaisen 0** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_suzume` | **Suzume** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_your_name` | **Your Name (Kimi no Na wa)** | Hindi, Japanese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `series_death_note` | **Death Note (English Dubbed)** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_naruto_classic` | **Naruto Shippuden (Hindi Dubbed)** | Hindi, Japanese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_one_piece_film_red` | **One Piece Film: Red** | Hindi, Japanese | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_stree` | **Stree** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_drishyam_2` | **Drishyam 2** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_kantara` | **Kantara** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_kgf_chapter_1` | **K.G.F: Chapter 1** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_baahubali_1` | **Baahubali: The Beginning** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_baahubali_2` | **Baahubali 2: The Conclusion** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_tumbbad` | **Tumbbad** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_andhadhun` | **Andhadhun** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_shershaah` | **Uri: The Surgical Strike** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_3_idiots` | **3 Idiots** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_gangs_of_wasseypur` | **Gangs of Wasseypur** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_vikram_vedha` | **Vikram Vedha** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_masoom_1983` | **Masoom** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_jaane_bhi_do_yaaro` | **Jaane Bhi Do Yaaro** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_chhoti_si_baat` | **Chhoti Si Baat** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_do_bigha_zamin` | **Do Bigha Zamin** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_night_of_the_living_dead` | **Night of the Living Dead** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_charade_1963` | **Charade** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_carnival_of_souls` | **Carnival of Souls** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_house_on_haunted_hill` | **House on Haunted Hill** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_dressed_to_kill` | **Dressed to Kill (Sherlock Holmes)** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `series_sherlock_holmes_1954` | **Sherlock Holmes (1954 Classic Series)** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `disc_VoyagetothePlanetofPrehistoricWomen` | **Voyage To The Planet Of Prehistoric Women** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `disc_TheFastandtheFuriousJohnIreland1954goofyrip` | **The Fast And The Furious** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `disc_charlie_chaplin_film_fest` | **Charlie Chaplin Festival** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `disc_Return_of_the_Kung_Fu_Dragon` | **Return Of The Kung Fu Dragon** | English | `NON_HINDI_AUDIO` | 1 | en | NO | **PASS** |
| `vod_avengers_doomsday_2026` | **Avengers: Doomsday** | English | `NON_HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_the_batman_part_ii_2026` | **The Batman Part II** | English | `NON_HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_fateh_2025` | **Fateh** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_sky_force_2025` | **Sky Force** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_game_changer_2025` | **Game Changer** | Telugu, Hindi | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_laapataa_ladies_2024` | **Laapataa Ladies** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_article_370_2024` | **Article 370** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_mission_raniganj_2023` | **Mission Raniganj** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_badla_2019` | **Badla** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_kesari_2019` | **Kesari** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_airlift_2016` | **Airlift** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_baby_2015` | **Baby** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_holiday_2014` | **Holiday: A Soldier Is Never Off Duty** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_rockstar_2011` | **Rockstar** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_znmd_2011` | **Zindagi Na Milegi Dobara** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_ghajini_2008` | **Ghajini** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_taare_zameen_par_2007` | **Taare Zameen Par** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_rang_de_basanti_2006` | **Rang De Basanti** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_lagaan_2001` | **Lagaan: Once Upon a Time in India** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_aavesham_2024` | **Aavesham** | Hindi, Malayalam | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi, ml | NO | **PASS** |
| `vod_bramayugam_2024` | **Bramayugam** | Hindi, Malayalam | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi, ml | NO | **PASS** |
| `vod_aadujeevitham_2024` | **The Goat Life (Aadujeevitham)** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_maharaja_2024` | **Maharaja** | Tamil | `NON_HINDI_AUDIO` | 1 | ta | NO | **PASS** |
| `vod_premalu_2024` | **Premalu** | Malayalam | `NON_HINDI_AUDIO` | 1 | ml | NO | **PASS** |
| `vod_manjummel_boys_2024` | **Manjummel Boys** | Tamil | `NON_HINDI_AUDIO` | 1 | ta | NO | **PASS** |
| `vod_amar_singh_chamkila_2024` | **Amar Singh Chamkila** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_blackout_2024` | **Blackout** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_hanuman_2024` | **Hanu-Man** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_kill_2024` | **Kill** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_crew_2024` | **Crew** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_jailer_2023` | **Jailer** | Tamil | `NON_HINDI_AUDIO` | 0 |  | NO | **NO_DIRECT_SOURCE** |
| `vod_sam_bahadur_2023` | **Sam Bahadur** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_vikram_2022` | **Vikram** | Telugu, Tamil, Hindi | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi | ⚠️ YES | **SOURCE_METADATA_INVALID** |
| `vod_sita_ramam_2022` | **Sita Ramam** | Malayalam | `NON_HINDI_AUDIO` | 1 | ml | NO | **PASS** |
| `vod_karthikeya_2_2022` | **Karthikeya 2** | Telugu | `NON_HINDI_AUDIO` | 1 | te | NO | **PASS** |
| `vod_777_charlie_2022` | **777 Charlie** | Tamil | `NON_HINDI_AUDIO` | 1 | ta | NO | **PASS** |
| `vod_minnal_murali_2021` | **Minnal Murali** | Telugu, Tamil, Malayalam, Hindi, Kannada | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | te, ta, ml, hi, kn | NO | **PASS** |
| `vod_sardar_udham_2021` | **Sardar Udham** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_jai_bhim_2021` | **Jai Bhim** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_ala_vaikunthapurramuloo_2020` | **Ala Vaikunthapurramuloo** | Hindi, Telugu | `MULTI_AUDIO_INCLUDING_HINDI` | 1 | hi, te | NO | **PASS** |
| `vod_ludo_2020` | **Ludo** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_thappad_2020` | **Thappad** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |
| `vod_bandaa_2023` | **Sirf Ek Bandaa Kaafi Hai** | Hindi | `HINDI_AUDIO` | 1 | hi | NO | **PASS** |

## 3. Discrepancy Forensic Details

### Stree 2: Sarkate Ka Aatank (`vod_stree_2`)
- **Claimed**: Hindi, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, English), but progressive MP4 container contains only a single audio stream.

### Pathaan (`vod_pathaan`)
- **Claimed**: Hindi, English, Telugu, Tamil (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 4 languages (Hindi, English, Telugu, Tamil), but progressive MP4 container contains only a single audio stream.

### Fighter (`vod_fighter`)
- **Claimed**: Hindi, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, English), but progressive MP4 container contains only a single audio stream.

### Leo: Bloody Sweet (`vod_leo`)
- **Claimed**: Hindi, Tamil, Telugu, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 4 languages (Hindi, Tamil, Telugu, English), but progressive MP4 container contains only a single audio stream.

### Tiger 3 (`vod_tiger_3`)
- **Claimed**: Hindi, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, English), but progressive MP4 container contains only a single audio stream.

### Dunki (`vod_dunki`)
- **Claimed**: Hindi, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, English), but progressive MP4 container contains only a single audio stream.

### Avatar: The Way of Water (`vod_avatar_way_of_water`)
- **Claimed**: English, Hindi, Tamil, Telugu (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 4 languages (English, Hindi, Tamil, Telugu), but progressive MP4 container contains only a single audio stream.

### Brahmāstra: Part One – Shiva (`vod_brahmastra`)
- **Claimed**: Hindi, Telugu, Tamil, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 4 languages (Hindi, Telugu, Tamil, English), but progressive MP4 container contains only a single audio stream.

### Spider-Man: No Way Home (`vod_spider_man_nwh`)
- **Claimed**: English, Hindi, Tamil, Telugu (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 4 languages (English, Hindi, Tamil, Telugu), but progressive MP4 container contains only a single audio stream.

### Squid Game (`series_squid_game`)
- **Claimed**: Hindi, English (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, English), but progressive MP4 container contains only a single audio stream.

### Train to Busan (`vod_train_to_busan`)
- **Claimed**: Hindi, Korean (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Korean), but progressive MP4 container contains only a single audio stream.

### Parasite (`vod_parasite`)
- **Claimed**: Hindi, Korean (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Korean), but progressive MP4 container contains only a single audio stream.

### The Raid: Redemption (`vod_the_raid_redemption`)
- **Claimed**: Hindi, Indonesian (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Indonesian), but progressive MP4 container contains only a single audio stream.

### Ip Man (`vod_ip_man`)
- **Claimed**: Hindi, Cantonese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Cantonese), but progressive MP4 container contains only a single audio stream.

### Ip Man 4: The Finale (`vod_ip_man_4`)
- **Claimed**: Hindi, Cantonese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Cantonese), but progressive MP4 container contains only a single audio stream.

### Peninsula (`vod_peninsula`)
- **Claimed**: Hindi, Korean (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Korean), but progressive MP4 container contains only a single audio stream.

### Kung Fu Hustle (`vod_kung_fu_hustle`)
- **Claimed**: Hindi, Cantonese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Cantonese), but progressive MP4 container contains only a single audio stream.

### Shaolin Soccer (`vod_shaolin_soccer`)
- **Claimed**: Hindi, Cantonese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Cantonese), but progressive MP4 container contains only a single audio stream.

### The Roundup (`vod_the_roundup`)
- **Claimed**: Hindi, Korean (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Korean), but progressive MP4 container contains only a single audio stream.

### Your Name (Kimi no Na wa) (`vod_your_name`)
- **Claimed**: Hindi, Japanese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Japanese), but progressive MP4 container contains only a single audio stream.

### Naruto Shippuden (Hindi Dubbed) (`series_naruto_classic`)
- **Claimed**: Hindi, Japanese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Japanese), but progressive MP4 container contains only a single audio stream.

### One Piece Film: Red (`vod_one_piece_film_red`)
- **Claimed**: Hindi, Japanese (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Hindi, Japanese), but progressive MP4 container contains only a single audio stream.

### Game Changer (`vod_game_changer_2025`)
- **Claimed**: Telugu, Hindi (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 2 languages (Telugu, Hindi), but progressive MP4 container contains only a single audio stream.

### Vikram (`vod_vikram_2022`)
- **Claimed**: Telugu, Tamil, Hindi (MULTI_AUDIO_INCLUDING_HINDI)
- **Actual**: 1 audio stream(s) (hi)
- **Finding**: Catalog claims 3 languages (Telugu, Tamil, Hindi), but progressive MP4 container contains only a single audio stream.

