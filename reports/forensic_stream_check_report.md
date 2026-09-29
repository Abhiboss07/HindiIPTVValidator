# Forensic Stream Check Report

## 1. Summary Statistics

- **Top-level Stream URLs**: 138 tested, 0 broken
- **Trailer URLs**: 129 tested, 49 broken
- **Episode Stream URLs**: 124 tested, 2 broken
- **Radio Stations**: 8 tested, 2 broken
- **Live TV Sample (20 items)**: 20 tested, 6 broken (30.0% error rate)

## 2. Broken Radio Stations

- **AIR FM Gold Delhi (app.js FALLBACK_CHANNELS)** (assets/app.js L578): HTTP 404 -> `https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmgold/hlspbaudiofmgold_Auto.m3u8`
- **AIR FM Rainbow (app.js FALLBACK_CHANNELS)** (assets/app.js L592): HTTP 404 -> `https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmrainbow/hlspbaudiofmrainbow_Auto.m3u8`

## 3. Broken Live TV Sample Channels

- **Subharti TV** (`live_ch_732`, data/channels.json L14372): HTTP 404 (Status in DB: UNVERIFIED) -> `https://mumt04.tangotv.in/m18aqlK4SUBHARTITV/index.m3u8`
- **Santvani Channel** (`live_ch_223`, data/channels.json L4804): HTTP 404 (Status in DB: UNVERIFIED) -> `https://cdn-2.pishow.tv/live/475/master.m3u8`
- **News Daily 24** (`live_ch_201`, data/channels.json L4398): HTTP 404 (Status in DB: UNVERIFIED) -> `https://cdn-6.pishow.tv/live/10009/master.m3u8`
- **Swaraj Express SMBC** (`live_ch_731`, data/channels.json L14352): HTTP 404 (Status in DB: UNVERIFIED) -> `https://cdn-2.pishow.tv/live/477/master.m3u8`
- **Hi Dost!** (`live_ch_405`, data/channels.json L8196): HTTP 404 (Status in DB: UNVERIFIED) -> `https://cdn-1.pishow.tv/live/224/master.m3u8`
- **DD Chhattisgarh** (`live_ch_68`, data/channels.json L1982): HTTP 404 (Status in DB: UNVERIFIED) -> `https://cdn-1.pishow.tv/live/15/master.m3u8`

## 4. Broken Trailers (Dead YouTube Embeds)

- **Tribhanga (2021)** (`vod_tribhanga_2021`, data/movies_catalog.json L46): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/G1a8w9b_k00`
- **The White Tiger (2021)** (`vod_the_white_tiger_2021`, data/movies_catalog.json L115): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/T3nn5h5GlP8`
- **Mimi (2021)** (`vod_mimi_2021`, data/movies_catalog.json L257): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/p1T_z5Y4w92`
- **Dhamaka (2021)** (`vod_dhamaka_2021`, data/movies_catalog.json L329): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/7r1w9b4y8k1`
- **Bhuj: The Pride of India (2021)** (`vod_bhuj_2021`, data/movies_catalog.json L400): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/5aY6z8wLbg1`
- **Bhoot Police (2021)** (`vod_bhoot_police_2021`, data/movies_catalog.json L469): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/P_8aY2_3k80`
- **Bellbottom (2021)** (`vod_bellbottom_2021`, data/movies_catalog.json L539): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/A8g8W7d7z50`
- **Atrangi Re (2021)** (`vod_atrangi_re_2021`, data/movies_catalog.json L611): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/x3L2PBz5_n8`
- **83 (2021)** (`vod_83_2021`, data/movies_catalog.json L683): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/mAMf5dovmZ8`
- **Squid Game Season 2 (2025)** (`series_squid_game_s2_2025`, data/movies_catalog.json L753): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/lQBmZBJTN4g`
- **Delhi Crime Season 3 (2025)** (`series_delhi_crime_s3_2025`, data/movies_catalog.json L843): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/S_8qM8W8b1c`
- **Paatal Lok Season 2 (2025)** (`series_paatal_lok_s2_2025`, data/movies_catalog.json L934): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/6f9GfWjH4yE`
- **Farzi Season 2 (2025)** (`series_farzi_s2_2025`, data/movies_catalog.json L1025): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/v9qX4_z1N9E`
- **The Family Man Season 3 (2025)** (`series_family_man_s3_2025`, data/movies_catalog.json L1117): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/p1T_z5Y4w9A`
- **Deva (2025)** (`vod_deva_2025`, data/movies_catalog.json L1207): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/7r1w9b4y8kA`
- **Sikandar (2025)** (`vod_sikandar_2025`, data/movies_catalog.json L1273): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/8t3X6w8j9pU`
- **The Fantastic Four: First Steps (2025)** (`vod_fantastic_four_2025`, data/movies_catalog.json L1341): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/11kvy_sL_5o`
- **Captain America: Brave New World (2025)** (`vod_captain_america_bnw_2025`, data/movies_catalog.json L1613): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/1pHDWnXmKMY`
- **Spirit (2026)** (`vod_spirit_2026`, data/movies_catalog.json L1682): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/w7K3X1_8g8g`
- **Alpha (2026)** (`vod_alpha_2026`, data/movies_catalog.json L1749): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/q0_A1v9K3_8`
- **King (2026)** (`vod_king_2026`, data/movies_catalog.json L1815): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/q0_A1v9K3_King`
- **Mirzapur** (`series_mirzapur`, data/movies_catalog.json L3304): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/ZNeGF-PvVHY`
- **The Family Man** (`series_family_man`, data/movies_catalog.json L3881): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/NGf_B88kU1A`
- **Sacred Games** (`series_sacred_games`, data/movies_catalog.json L4499): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/28j8h0RRnq4`
- **Farzi** (`series_farzi`, data/movies_catalog.json L6044): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/4bT_k8yV_zU`
- **Paatal Lok** (`series_paatal_lok`, data/movies_catalog.json L7448): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/cNw_Xv-wXQk`
- **Bramayugam** (`vod_bramayugam_2024`, data/movies_catalog.json L12405): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/yW7t8224F5M`
- **The Goat Life (Aadujeevitham)** (`vod_aadujeevitham_2024`, data/movies_catalog.json L12485): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/q13d11b3wF8`
- **Maharaja** (`vod_maharaja_2024`, data/movies_catalog.json L12564): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/e18VfA481sA`
- **Premalu** (`vod_premalu_2024`, data/movies_catalog.json L12639): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/rQxL9Hn4L4k`
- **Manjummel Boys** (`vod_manjummel_boys_2024`, data/movies_catalog.json L12718): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/idQ_9A8e9Xk`
- **Amar Singh Chamkila** (`vod_amar_singh_chamkila_2024`, data/movies_catalog.json L12795): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/g8l6p3zC3aM`
- **Blackout** (`vod_blackout_2024`, data/movies_catalog.json L12873): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/7n7Y_w-xO78`
- **Hanu-Man** (`vod_hanuman_2024`, data/movies_catalog.json L12954): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/OivkdWd9-z4`
- **Kill** (`vod_kill_2024`, data/movies_catalog.json L13031): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/da3b_H9b0_M`
- **Crew** (`vod_crew_2024`, data/movies_catalog.json L13106): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/1B1qg7tQ1Gg`
- **Sam Bahadur** (`vod_sam_bahadur_2023`, data/movies_catalog.json L13260): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/1bN_k-1a-1k`
- **Vikram** (`vod_vikram_2022`, data/movies_catalog.json L13347): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/OKBMCL-hrPU`
- **Karthikeya 2** (`vod_karthikeya_2_2022`, data/movies_catalog.json L13428): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/K8qY7iM59pU`
- **777 Charlie** (`vod_777_charlie_2022`, data/movies_catalog.json L13507): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/5c_Y6z8wLbg`
- **Sardar Udham** (`vod_sardar_udham_2021`, data/movies_catalog.json L13687): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/EDbW3k8J-3k`
- **Ala Vaikunthapurramuloo** (`vod_ala_vaikunthapurramuloo_2020`, data/movies_catalog.json L13770): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/2_YnCsm1z7M`
- **Ludo** (`vod_ludo_2020`, data/movies_catalog.json L13850): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/caY1L9G-6e8`
- **Sirf Ek Bandaa Kaafi Hai** (`vod_bandaa_2023`, data/movies_catalog.json L13928): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/Pj1L5a05-x0`
- **Ramayana: Part 1** (`vod_ramayana_part_1_2026`, data/movies_catalog.json L13979): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/9GZ08h3vWps`
- **War 2** (`vod_war_2_2025`, data/movies_catalog.json L14043): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/g8m3B_eJt7s`
- **Toxic: A Fairy Tale for Grown-ups** (`vod_toxic_2026`, data/movies_catalog.json L14108): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/mKk3lP_e_vM`
- **Sita Ramam** (`vod_sita_ramam_2022`, data/movies_catalog.json L16164): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/Fw0W64iZ8qg`
- **Thappad** (`vod_thappad_2020`, data/movies_catalog.json L16316): Raw HTTP 200, YT Thumbnail HTTP 404 -> `https://www.youtube-nocookie.com/embed/jBw_EROnOSo`
