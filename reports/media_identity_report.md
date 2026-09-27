# T2L Media Identity & Anti-Trailer Contamination Forensic Report

- **Total Catalog Items**: 170
- **Zero-Trust PASS**: 170
- **Violations (FAIL)**: 0
- **Playable Full Movies**: 127
- **Web-Series**: 23
- **Trailers / Upcoming**: 20

## Forensic Checks Applied
1. **Anti-Trailer Contamination**: Confirmed zero trailers masquerading as full playable movies.
2. **Salaar Truth Gate**: Telugu audio declared strictly as `NON_HINDI_AUDIO`.
3. **Tumbbad Truth Gate**: Marathi native audio declared strictly as `NON_HINDI_AUDIO`.
4. **Source State Consistency**: All `streamUrl: null` entries correctly set to `TRAILER_ONLY` or `UPCOMING`.

## Detailed Item Analysis

| ID | Title | Status | Source Status | Source State | Audio Class | Issues |
|---|---|---|---|---|---|---|
| `vod_tribhanga_2021` | Tribhanga (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_the_white_tiger_2021` | The White Tiger (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_sooryavanshi_2021` | Sooryavanshi (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_mimi_2021` | Mimi (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_dhamaka_2021` | Dhamaka (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_bhuj_2021` | Bhuj: The Pride of India (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_bhoot_police_2021` | Bhoot Police (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_bellbottom_2021` | Bellbottom (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_atrangi_re_2021` | Atrangi Re (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_83_2021` | 83 (2021) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `series_squid_game_s2_2025` | Squid Game Season 2 (2025) | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | NON_HINDI_AUDIO | Verified Clean |
| `series_delhi_crime_s3_2025` | Delhi Crime Season 3 (2025) | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `series_paatal_lok_s2_2025` | Paatal Lok Season 2 (2025) | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `series_farzi_s2_2025` | Farzi Season 2 (2025) | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `series_family_man_s3_2025` | The Family Man Season 3 (2025) | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `vod_deva_2025` | Deva (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_sikandar_2025` | Sikandar (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_fantastic_four_2025` | The Fantastic Four: First Steps (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_thunderbolts_2025` | Thunderbolts* (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_superman_2025` | Superman (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_mission_impossible_8_2025` | Mission: Impossible – The Final Reckoning (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_captain_america_bnw_2025` | Captain America: Brave New World (2025) | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_spirit_2026` | Spirit (2026) | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_alpha_2026` | Alpha (2026) | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_king_2026` | King (2026) | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_spiderman_4_2026` | Spider-Man 4 (2026) | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `series_sherlock_holmes` | The Adventures of Sherlock Holmes (1984) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_stranger_things` | Stranger Things | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_panchayat` | Panchayat | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `series_mirzapur` | Mirzapur | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_deadpool_wolverine` | Deadpool & Wolverine | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_stree_2` | Stree 2: Sarkate Ka Aatank | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kalki_2898_ad` | Kalki 2898 AD | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_gladiator_2` | Gladiator II | **PASS** | TRAILER_ONLY | TRAILER_ONLY | NON_HINDI_AUDIO | Verified Clean |
| `vod_spider_verse` | Spider-Man: Into the Spider-Verse | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_family_man` | The Family Man | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `series_money_heist` | Money Heist (La Casa de Papel) | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | NON_HINDI_AUDIO | Verified Clean |
| `series_scam_1992` | Scam 1992: The Harshad Mehta Story | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `series_sacred_games` | Sacred Games | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `vod_interstellar` | Interstellar | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_breaking_bad` | Breaking Bad | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_dark_knight` | Iron Man | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_chhavaa` | Chhaava | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `series_kota_factory` | Kota Factory | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_dune_part_two` | Dune: Part Two | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_furiosa` | Furiosa: A Mad Max Saga | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_shaitaan` | Shaitaan | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_alien_romulus` | Alien: Romulus | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_fighter` | Fighter | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_godzilla_x_kong` | Godzilla x Kong: The New Empire | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_12th_fail` | 12th Fail | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_oppenheimer` | Oppenheimer | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_farzi` | Farzi | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `vod_john_wick_4` | John Wick: Chapter 4 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_leo` | Leo: Bloody Sweet | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_jawan` | Jawan | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_tiger_3` | Tiger 3 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_salaar` | Salaar: Part 1 - Ceasefire | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_dunki` | Dunki | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_animal` | Animal | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_gadar_2` | Gadar 2: The Katha Continues | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kgf_chapter_2` | K.G.F: Chapter 2 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_top_gun_maverick` | Top Gun: Maverick | **PASS** | TRAILER_ONLY | TRAILER_ONLY | NON_HINDI_AUDIO | Verified Clean |
| `vod_rrr` | RRR | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_the_batman` | The Batman | **PASS** | TRAILER_ONLY | TRAILER_ONLY | NON_HINDI_AUDIO | Verified Clean |
| `vod_avatar_way_of_water` | Avatar: The Way of Water | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_brahmastra` | Brahmāstra: Part One – Shiva | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_spider_man_nwh` | Spider-Man: No Way Home | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_pushpa_the_rise` | Pushpa: The Rise | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `series_paatal_lok` | Paatal Lok | **PASS** | UNAVAILABLE | NO_AUTHORIZED_SOURCE | HINDI_AUDIO | Verified Clean |
| `vod_avengers_endgame` | Avengers: Endgame | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_dangal` | Dangal | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_sita_sings_blues` | Sita Sings the Blues | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_bbb_720p` | Big Buck Bunny | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_squid_game` | Squid Game | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_train_to_busan` | Train to Busan | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_the_raid_redemption` | The Raid: Redemption | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_ip_man` | Ip Man | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_ip_man_4` | Ip Man 4: The Finale | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kung_fu_hustle` | Kung Fu Hustle | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_shaolin_soccer` | Shaolin Soccer | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_the_outlaws` | The Outlaws | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_the_roundup` | The Roundup | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_demon_slayer_mugen_train` | Demon Slayer: Mugen Train | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_jujutsu_kaisen_0` | Jujutsu Kaisen 0 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_suzume` | Suzume | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_your_name` | Your Name (Kimi no Na wa) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `series_death_note` | Death Note (English Dubbed) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_naruto_classic` | Naruto Shippuden (Hindi Dubbed) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_one_piece_film_red` | One Piece Film: Red | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_stree` | Stree | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kantara` | Kantara | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kgf_chapter_1` | K.G.F: Chapter 1 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_baahubali_1` | Baahubali: The Beginning | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_baahubali_2` | Baahubali 2: The Conclusion | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_tumbbad` | Tumbbad | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_andhadhun` | Andhadhun | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_shershaah` | Shershaah | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_gangs_of_wasseypur` | Gangs of Wasseypur | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_vikram_vedha` | Vikram Vedha | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_masoom_1983` | Masoom | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_jaane_bhi_do_yaaro` | Jaane Bhi Do Yaaro | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_chhoti_si_baat` | Chhoti Si Baat | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_night_of_the_living_dead` | Night of the Living Dead | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_charade_1963` | Charade | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_carnival_of_souls` | Carnival of Souls | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_house_on_haunted_hill` | House on Haunted Hill | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_dressed_to_kill` | Dressed to Kill (Sherlock Holmes) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_sherlock_holmes_1954` | Sherlock Holmes (1954 Classic Series) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_avengers_doomsday_2026` | Avengers: Doomsday | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_the_batman_part_ii_2026` | The Batman Part II | **PASS** | UPCOMING | UPCOMING_TRAILER | NON_HINDI_AUDIO | Verified Clean |
| `vod_fateh_2025` | Fateh | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_game_changer_2025` | Game Changer | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_laapataa_ladies_2024` | Laapataa Ladies | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_article_370_2024` | Article 370 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_mission_raniganj_2023` | Mission Raniganj | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_badla_2019` | Badla | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kesari_2019` | Kesari | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_airlift_2016` | Airlift | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_baby_2015` | Baby | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_holiday_2014` | Holiday: A Soldier Is Never Off Duty | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_rockstar_2011` | Rockstar | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_znmd_2011` | Zindagi Na Milegi Dobara | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_ghajini_2008` | Ghajini | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_taare_zameen_par_2007` | Taare Zameen Par | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_lagaan_2001` | Lagaan: Once Upon a Time in India | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_aavesham_2024` | Aavesham | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_bramayugam_2024` | Bramayugam | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_aadujeevitham_2024` | The Goat Life (Aadujeevitham) | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_maharaja_2024` | Maharaja | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_premalu_2024` | Premalu | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_manjummel_boys_2024` | Manjummel Boys | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_amar_singh_chamkila_2024` | Amar Singh Chamkila | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_blackout_2024` | Blackout | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_hanuman_2024` | Hanu-Man | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_kill_2024` | Kill | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_crew_2024` | Crew | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_jailer_2023` | Jailer | **PASS** | TRAILER_ONLY | TRAILER_ONLY | NON_HINDI_AUDIO | Verified Clean |
| `vod_sam_bahadur_2023` | Sam Bahadur | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_vikram_2022` | Vikram | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_karthikeya_2_2022` | Karthikeya 2 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_777_charlie_2022` | 777 Charlie | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_minnal_murali_2021` | Minnal Murali | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_sardar_udham_2021` | Sardar Udham | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_ala_vaikunthapurramuloo_2020` | Ala Vaikunthapurramuloo | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | MULTI_AUDIO_INCLUDING_HINDI | Verified Clean |
| `vod_ludo_2020` | Ludo | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_bandaa_2023` | Sirf Ek Bandaa Kaafi Hai | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_ramayana_part_1_2026` | Ramayana: Part 1 | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_war_2_2025` | War 2 | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_toxic_2026` | Toxic: A Fairy Tale for Grown-ups | **PASS** | UPCOMING | UPCOMING_TRAILER | HINDI_AUDIO | Verified Clean |
| `vod_pathaan` | Pathaan | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_munjya` | Munjya | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_inception` | Inception | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_his_girl_friday` | His Girl Friday | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_crash_landing_on_you` | Crash Landing on You | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `series_descendants_of_the_sun` | Descendants of the Sun | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_parasite` | Parasite | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_peninsula` | Peninsula | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_drishyam_2` | Drishyam 2 | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_3_idiots` | 3 Idiots | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_do_bigha_zamin` | Do Bigha Zamin | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `disc_VoyagetothePlanetofPrehistoricWomen` | Voyage To The Planet Of Prehistoric Women | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `disc_TheFastandtheFuriousJohnIreland1954goofyrip` | The Fast And The Furious | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `disc_charlie_chaplin_film_fest` | Charlie Chaplin Festival | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `disc_Return_of_the_Kung_Fu_Dragon` | Return Of The Kung Fu Dragon | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_sky_force_2025` | Sky Force | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_rang_de_basanti_2006` | Rang De Basanti | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_sita_ramam_2022` | Sita Ramam | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | NON_HINDI_AUDIO | Verified Clean |
| `vod_jai_bhim_2021` | Jai Bhim | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
| `vod_thappad_2020` | Thappad | **PASS** | PLAYABLE | DIRECT_STREAM_AVAILABLE | HINDI_AUDIO | Verified Clean |
