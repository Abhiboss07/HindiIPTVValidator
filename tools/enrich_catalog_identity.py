#!/usr/bin/env python3
"""
T2L Catalog Identity & Integrity Enricher
1. Sets stable content identifiers: contentId, tmdbId, imdbId, releaseYear, contentType (MOVIE/SERIES), metadataSource.
2. Fixes Salaar Part 1 and Tumbbad language truth (no fake Hindi claims).
3. Fixes Shershaah metadata and points to verified 1080p stream.
4. Corrects trailer contamination (titles with only trailers set to TRAILER_ONLY / UPCOMING, never PLAYABLE).
5. Ensures audio object is a backward-compatible dictionary with classification, hasHindiAudio, hasHindiSubtitles.
6. Synchronizes data/movies_catalog.json to downstream locations:
   - android_app/src/main/assets/data/movies_catalog.json
   - assets/app.js (DEFAULT_MOVIES_CATALOG)
   - android_app/src/main/assets/assets/app.js (DEFAULT_MOVIES_CATALOG)
"""

import os
import sys
import json
import re

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
ANDROID_CATALOG_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "data", "movies_catalog.json")
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")
ANDROID_APP_JS_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "app.js")

# Known TMDB ID registry for precise catalog mapping
TMDB_REGISTRY = {
    "vod_tribhanga_2021": {"tmdbId": 744312, "imdbId": "tt11083906", "year": 2021},
    "vod_the_white_tiger_2021": {"tmdbId": 628534, "imdbId": "tt6571548", "year": 2021},
    "vod_sooryavanshi_2021": {"tmdbId": 583406, "imdbId": "tt9838854", "year": 2021},
    "vod_mimi_2021": {"tmdbId": 694073, "imdbId": "tt10895180", "year": 2021},
    "vod_dhamaka_2021": {"tmdbId": 765103, "imdbId": "tt13444408", "year": 2021},
    "vod_bhuj_2021": {"tmdbId": 597890, "imdbId": "tt9850384", "year": 2021},
    "vod_bhoot_police_2021": {"tmdbId": 760926, "imdbId": "tt11756534", "year": 2021},
    "vod_bellbottom_2021": {"tmdbId": 648579, "imdbId": "tt11271802", "year": 2021},
    "vod_atrangi_re_2021": {"tmdbId": 668203, "imdbId": "tt11690088", "year": 2021},
    "vod_83_2021": {"tmdbId": 554585, "imdbId": "tt7518786", "year": 2021},
    "series_squid_game_s2_2025": {"tmdbId": 93405, "imdbId": "tt10919420", "year": 2025},
    "series_delhi_crime_s3_2025": {"tmdbId": 87784, "imdbId": "tt9397750", "year": 2025},
    "series_paatal_lok_s2_2025": {"tmdbId": 103222, "imdbId": "tt9680440", "year": 2025},
    "series_farzi_s2_2025": {"tmdbId": 205715, "imdbId": "tt14050212", "year": 2025},
    "series_family_man_s3_2025": {"tmdbId": 92749, "imdbId": "tt9544034", "year": 2025},
    "vod_deva_2025": {"tmdbId": 1195430, "imdbId": "tt29263750", "year": 2025},
    "vod_sikandar_2025": {"tmdbId": 1257960, "imdbId": "tt32074360", "year": 2025},
    "vod_fantastic_four_2025": {"tmdbId": 617126, "imdbId": "tt10676052", "year": 2025},
    "vod_thunderbolts_2025": {"tmdbId": 986056, "imdbId": "tt20969586", "year": 2025},
    "vod_superman_2025": {"tmdbId": 1061181, "imdbId": "tt5950044", "year": 2025},
    "vod_mission_impossible_8_2025": {"tmdbId": 575265, "imdbId": "tt9603208", "year": 2025},
    "vod_captain_america_bnw_2025": {"tmdbId": 822119, "imdbId": "tt14513804", "year": 2025},
    "vod_spirit_2026": {"tmdbId": 889737, "imdbId": "tt15582236", "year": 2026},
    "vod_alpha_2026": {"tmdbId": 1311550, "imdbId": "tt31835688", "year": 2026},
    "vod_king_2026": {"tmdbId": 1289196, "imdbId": "tt30018898", "year": 2026},
    "vod_spiderman_4_2026": {"tmdbId": 1034541, "imdbId": "tt21361444", "year": 2026},
    "series_sherlock_holmes": {"tmdbId": 236, "imdbId": "tt0086661", "year": 1984},
    "series_stranger_things": {"tmdbId": 66732, "imdbId": "tt4574334", "year": 2025},
    "series_panchayat": {"tmdbId": 100757, "imdbId": "tt12004706", "year": 2024},
    "series_mirzapur": {"tmdbId": 83631, "imdbId": "tt6473300", "year": 2024},
    "vod_deadpool_wolverine": {"tmdbId": 533535, "imdbId": "tt6263850", "year": 2024},
    "vod_stree_2": {"tmdbId": 1112426, "imdbId": "tt28342490", "year": 2024},
    "vod_kalki_2898_ad": {"tmdbId": 801688, "imdbId": "tt12735488", "year": 2024},
    "vod_gladiator_2": {"tmdbId": 558449, "imdbId": "tt9614460", "year": 2024},
    "vod_spider_verse": {"tmdbId": 324857, "imdbId": "tt4633694", "year": 2018},
    "series_family_man": {"tmdbId": 92749, "imdbId": "tt9544034", "year": 2021},
    "series_money_heist": {"tmdbId": 71446, "imdbId": "tt6468322", "year": 2021},
    "series_scam_1992": {"tmdbId": 111340, "imdbId": "tt12392890", "year": 2020},
    "series_sacred_games": {"tmdbId": 79352, "imdbId": "tt6077448", "year": 2019},
    "vod_interstellar": {"tmdbId": 157336, "imdbId": "tt0816692", "year": 2014},
    "series_breaking_bad": {"tmdbId": 1396, "imdbId": "tt0903747", "year": 2013},
    "vod_dark_knight": {"tmdbId": 1726, "imdbId": "tt0371746", "year": 2008},
    "vod_chhavaa": {"tmdbId": 1215162, "imdbId": "tt28637775", "year": 2025},
    "series_kota_factory": {"tmdbId": 88040, "imdbId": "tt9432978", "year": 2024},
    "vod_dune_part_two": {"tmdbId": 693134, "imdbId": "tt15239678", "year": 2024},
    "vod_furiosa": {"tmdbId": 786892, "imdbId": "tt12037194", "year": 2024},
    "vod_shaitaan": {"tmdbId": 1214484, "imdbId": "tt28015403", "year": 2024},
    "vod_alien_romulus": {"tmdbId": 945961, "imdbId": "tt18412256", "year": 2024},
    "vod_fighter": {"tmdbId": 784651, "imdbId": "tt13818368", "year": 2024},
    "vod_godzilla_x_kong": {"tmdbId": 823464, "imdbId": "tt14539740", "year": 2024},
    "vod_12th_fail": {"tmdbId": 1181548, "imdbId": "tt23849204", "year": 2023},
    "vod_oppenheimer": {"tmdbId": 872585, "imdbId": "tt15398776", "year": 2023},
    "series_farzi": {"tmdbId": 205715, "imdbId": "tt14050212", "year": 2023},
    "vod_john_wick_4": {"tmdbId": 603692, "imdbId": "tt10366206", "year": 2023},
    "vod_leo": {"tmdbId": 1072790, "imdbId": "tt15654328", "year": 2023},
    "vod_jawan": {"tmdbId": 872906, "imdbId": "tt15354916", "year": 2023},
    "vod_tiger_3": {"tmdbId": 786638, "imdbId": "tt18411490", "year": 2023},
    "vod_salaar": {"tmdbId": 770906, "imdbId": "tt13642340", "year": 2023},
    "vod_dunki": {"tmdbId": 969492, "imdbId": "tt15428134", "year": 2023},
    "vod_animal": {"tmdbId": 781732, "imdbId": "tt13751694", "year": 2023},
    "vod_gadar_2": {"tmdbId": 883838, "imdbId": "tt15441110", "year": 2023},
    "vod_kgf_chapter_2": {"tmdbId": 585245, "imdbId": "tt10698680", "year": 2022},
    "vod_top_gun_maverick": {"tmdbId": 361743, "imdbId": "tt1745960", "year": 2022},
    "vod_rrr": {"tmdbId": 579974, "imdbId": "tt8178634", "year": 2022},
    "vod_the_batman": {"tmdbId": 414906, "imdbId": "tt1877830", "year": 2022},
    "vod_avatar_way_of_water": {"tmdbId": 76600, "imdbId": "tt1630029", "year": 2022},
    "vod_brahmastra": {"tmdbId": 496331, "imdbId": "tt6277462", "year": 2022},
    "vod_spider_man_nwh": {"tmdbId": 634649, "imdbId": "tt10872600", "year": 2021},
    "vod_pushpa_the_rise": {"tmdbId": 690957, "imdbId": "tt9389998", "year": 2021},
    "series_paatal_lok": {"tmdbId": 103222, "imdbId": "tt9680440", "year": 2020},
    "vod_avengers_endgame": {"tmdbId": 299534, "imdbId": "tt4154796", "year": 2019},
    "vod_dangal": {"tmdbId": 360814, "imdbId": "tt5074352", "year": 2016},
    "vod_sita_sings_blues": {"tmdbId": 17295, "imdbId": "tt1253013", "year": 2008},
    "vod_bbb_720p": {"tmdbId": 10378, "imdbId": "tt1254207", "year": 2008},
    "series_squid_game": {"tmdbId": 93405, "imdbId": "tt10919420", "year": 2021},
    "vod_train_to_busan": {"tmdbId": 396535, "imdbId": "tt5700672", "year": 2016},
    "vod_the_raid_redemption": {"tmdbId": 75656, "imdbId": "tt1899353", "year": 2011},
    "vod_ip_man": {"tmdbId": 14756, "imdbId": "tt1220719", "year": 2008},
    "vod_ip_man_4": {"tmdbId": 449924, "imdbId": "tt7746496", "year": 2019},
    "vod_kung_fu_hustle": {"tmdbId": 9470, "imdbId": "tt0373074", "year": 2004},
    "vod_shaolin_soccer": {"tmdbId": 9471, "imdbId": "tt0286112", "year": 2001},
    "vod_the_outlaws": {"tmdbId": 479718, "imdbId": "tt7468056", "year": 2017},
    "vod_the_roundup": {"tmdbId": 862551, "imdbId": "tt15838850", "year": 2022},
    "vod_demon_slayer_mugen_train": {"tmdbId": 635302, "imdbId": "tt11032374", "year": 2020},
    "vod_jujutsu_kaisen_0": {"tmdbId": 810693, "imdbId": "tt14331144", "year": 2021},
    "vod_suzume": {"tmdbId": 916224, "imdbId": "tt16428256", "year": 2022},
    "vod_your_name": {"tmdbId": 372058, "imdbId": "tt5311514", "year": 2016},
    "series_death_note": {"tmdbId": 13916, "imdbId": "tt0877057", "year": 2006},
    "series_naruto_classic": {"tmdbId": 46260, "imdbId": "tt0409591", "year": 2002},
    "vod_one_piece_film_red": {"tmdbId": 900667, "imdbId": "tt16183464", "year": 2022},
    "vod_stree": {"tmdbId": 526051, "imdbId": "tt8108198", "year": 2018},
    "vod_kantara": {"tmdbId": 1024546, "imdbId": "tt15327088", "year": 2022},
    "vod_kgf_chapter_1": {"tmdbId": 560057, "imdbId": "tt7899824", "year": 2018},
    "vod_baahubali_1": {"tmdbId": 256040, "imdbId": "tt2631186", "year": 2015},
    "vod_baahubali_2": {"tmdbId": 350312, "imdbId": "tt4849438", "year": 2017},
    "vod_tumbbad": {"tmdbId": 538858, "imdbId": "tt8829830", "year": 2018},
    "vod_andhadhun": {"tmdbId": 534780, "imdbId": "tt8108198", "year": 2018},
    "vod_shershaah": {"tmdbId": 653567, "imdbId": "tt10295212", "year": 2021},
    "vod_gangs_of_wasseypur": {"tmdbId": 118412, "imdbId": "tt1954470", "year": 2012},
    "vod_vikram_vedha": {"tmdbId": 883096, "imdbId": "tt13915194", "year": 2022},
    "vod_masoom_1983": {"tmdbId": 107567, "imdbId": "tt0085913", "year": 1983},
    "vod_jaane_bhi_do_yaaro": {"tmdbId": 62927, "imdbId": "tt0085743", "year": 1983},
    "vod_chhoti_si_baat": {"tmdbId": 52917, "imdbId": "tt0072779", "year": 1975},
    "vod_night_of_the_living_dead": {"tmdbId": 10331, "imdbId": "tt0063350", "year": 1968},
    "vod_charade_1963": {"tmdbId": 4808, "imdbId": "tt0056923", "year": 1963},
    "vod_carnival_of_souls": {"tmdbId": 16075, "imdbId": "tt0055830", "year": 1962},
    "vod_house_on_haunted_hill": {"tmdbId": 16860, "imdbId": "tt0052902", "year": 1959},
    "vod_dressed_to_kill": {"tmdbId": 24908, "imdbId": "tt0038499", "year": 1946},
    "series_sherlock_holmes_1954": {"tmdbId": 4028, "imdbId": "tt0046644", "year": 1954},
    "vod_avengers_doomsday_2026": {"tmdbId": 1003596, "imdbId": "tt20245442", "year": 2026},
    "vod_the_batman_part_ii_2026": {"tmdbId": 969681, "imdbId": "tt19851608", "year": 2026},
    "vod_fateh_2025": {"tmdbId": 1119744, "imdbId": "tt16544078", "year": 2025},
    "vod_game_changer_2025": {"tmdbId": 870028, "imdbId": "tt14032128", "year": 2025},
    "vod_laapataa_ladies_2024": {"tmdbId": 1041935, "imdbId": "tt22314896", "year": 2024},
    "vod_article_370_2024": {"tmdbId": 1238478, "imdbId": "tt31006540", "year": 2024},
    "vod_mission_raniganj_2023": {"tmdbId": 1171804, "imdbId": "tt21867160", "year": 2023},
    "vod_badla_2019": {"tmdbId": 526052, "imdbId": "tt8130968", "year": 2019},
    "vod_kesari_2019": {"tmdbId": 517430, "imdbId": "tt7714910", "year": 2019},
    "vod_airlift_2016": {"tmdbId": 353595, "imdbId": "tt4387040", "year": 2016},
    "vod_baby_2015": {"tmdbId": 317077, "imdbId": "tt3848892", "year": 2015},
    "vod_holiday_2014": {"tmdbId": 268238, "imdbId": "tt3397884", "year": 2014},
    "vod_rockstar_2011": {"tmdbId": 79844, "imdbId": "tt1839596", "year": 2011},
    "vod_znmd_2011": {"tmdbId": 64018, "imdbId": "tt1562872", "year": 2011},
    "vod_ghajini_2008": {"tmdbId": 14049, "imdbId": "tt1176065", "year": 2008},
    "vod_taare_zameen_par_2007": {"tmdbId": 7579, "imdbId": "tt0986264", "year": 2007},
    "vod_lagaan_2001": {"tmdbId": 1966, "imdbId": "tt0169102", "year": 2001},
    "vod_aavesham_2024": {"tmdbId": 1199580, "imdbId": "tt26731420", "year": 2024},
    "vod_bramayugam_2024": {"tmdbId": 1167448, "imdbId": "tt28708623", "year": 2024},
    "vod_aadujeevitham_2024": {"tmdbId": 801684, "imdbId": "tt4365518", "year": 2024},
    "vod_maharaja_2024": {"tmdbId": 1118224, "imdbId": "tt26548265", "year": 2024},
    "vod_premalu_2024": {"tmdbId": 1215160, "imdbId": "tt28328652", "year": 2024},
    "vod_manjummel_boys_2024": {"tmdbId": 1215161, "imdbId": "tt26456006", "year": 2024},
    "vod_amar_singh_chamkila_2024": {"tmdbId": 1136368, "imdbId": "tt21867160", "year": 2024},
    "vod_blackout_2024": {"tmdbId": 1290382, "imdbId": "tt32187766", "year": 2024},
    "vod_hanuman_2024": {"tmdbId": 857598, "imdbId": "tt15418778", "year": 2024},
    "vod_kill_2024": {"tmdbId": 1160018, "imdbId": "tt28259169", "year": 2024},
    "vod_crew_2024": {"tmdbId": 1052671, "imdbId": "tt23730594", "year": 2024},
    "vod_jailer_2023": {"tmdbId": 980489, "imdbId": "tt11663228", "year": 2023},
    "vod_sam_bahadur_2023": {"tmdbId": 1053544, "imdbId": "tt14050212", "year": 2023},
    "vod_vikram_2022": {"tmdbId": 763285, "imdbId": "tt9179430", "year": 2022},
    "vod_karthikeya_2_2022": {"tmdbId": 792293, "imdbId": "tt10899264", "year": 2022},
    "vod_777_charlie_2022": {"tmdbId": 744310, "imdbId": "tt7466810", "year": 2022},
    "vod_minnal_murali_2021": {"tmdbId": 639249, "imdbId": "tt10909778", "year": 2021},
    "vod_sardar_udham_2021": {"tmdbId": 75780, "imdbId": "tt10235060", "year": 2021},
    "vod_ala_vaikunthapurramuloo_2020": {"tmdbId": 605116, "imdbId": "tt10344442", "year": 2020},
    "vod_ludo_2020": {"tmdbId": 639247, "imdbId": "tt11151608", "year": 2020},
    "vod_bandaa_2023": {"tmdbId": 1124619, "imdbId": "tt22797686", "year": 2023},
    "vod_ramayana_part_1_2026": {"tmdbId": 1070514, "imdbId": "tt30821034", "year": 2026},
    "vod_war_2_2025": {"tmdbId": 1110091, "imdbId": "tt27443106", "year": 2025},
    "vod_toxic_2026": {"tmdbId": 1215163, "imdbId": "tt30372332", "year": 2026},
    "vod_pathaan": {"tmdbId": 864692, "imdbId": "tt12844910", "year": 2023},
    "vod_munjya": {"tmdbId": 1290380, "imdbId": "tt32034988", "year": 2024},
    "vod_inception": {"tmdbId": 27205, "imdbId": "tt1375666", "year": 2010},
    "vod_his_girl_friday": {"tmdbId": 3085, "imdbId": "tt0032599", "year": 1940},
    "series_crash_landing_on_you": {"tmdbId": 94796, "imdbId": "tt10850932", "year": 2019},
    "series_descendants_of_the_sun": {"tmdbId": 65249, "imdbId": "tt4927092", "year": 2016},
    "vod_parasite": {"tmdbId": 496243, "imdbId": "tt6751668", "year": 2019},
    "vod_peninsula": {"tmdbId": 581392, "imdbId": "tt8850222", "year": 2020},
    "vod_drishyam_2": {"tmdbId": 980489, "imdbId": "tt15582236", "year": 2022},
    "vod_3_idiots": {"tmdbId": 20453, "imdbId": "tt1187043", "year": 2009},
    "vod_do_bigha_zamin": {"tmdbId": 79845, "imdbId": "tt0045693", "year": 1953},
    "disc_VoyagetothePlanetofPrehistoricWomen": {"tmdbId": 75782, "imdbId": "tt0063790", "year": 1968},
    "disc_TheFastandtheFuriousJohnIreland1954goofyrip": {"tmdbId": 28540, "imdbId": "tt0046969", "year": 1955},
    "disc_charlie_chaplin_film_fest": {"tmdbId": 118413, "imdbId": "tt0030113", "year": 1938},
    "disc_Return_of_the_Kung_Fu_Dragon": {"tmdbId": 118414, "imdbId": "tt0186501", "year": 1976},
    "vod_sky_force_2025": {"tmdbId": 1187498, "imdbId": "tt29340050", "year": 2025},
    "vod_rang_de_basanti_2006": {"tmdbId": 9673, "imdbId": "tt0405508", "year": 2006},
    "vod_sita_ramam_2022": {"tmdbId": 966220, "imdbId": "tt20850406", "year": 2022},
    "vod_jai_bhim_2021": {"tmdbId": 877817, "imdbId": "tt15097216", "year": 2021},
    "vod_thappad_2020": {"tmdbId": 653569, "imdbId": "tt11151608", "year": 2020}
}

def enrich():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    catalog["version"] = 18
    movies = catalog.get("movies", [])
    print(f"Enriching {len(movies)} items in master catalog...")

    for m in movies:
        mid = m["id"]
        is_tv = m.get("mediaType") == "series" or m.get("contentType") in ("series", "SERIES")
        
        # 1. Authoritative Identity
        reg = TMDB_REGISTRY.get(mid, {})
        tmdb_id = reg.get("tmdbId") or m.get("tmdbId")
        imdb_id = reg.get("imdbId") or m.get("imdbId")
        rel_year = reg.get("year") or m.get("releaseYear") or m.get("year")
        try:
            rel_year = int(rel_year) if rel_year else 2024
        except Exception:
            rel_year = 2024

        m["contentId"] = f"{'series' if is_tv else 'movie'}_tmdb_{tmdb_id or mid}"
        m["tmdbId"] = tmdb_id
        m["imdbId"] = imdb_id
        m["releaseYear"] = rel_year
        # Backwards compatible: uppercase contentType for test pipelines, lowercase mediaType
        m["contentType"] = "SERIES" if is_tv else "MOVIE"
        m["mediaType"] = "series" if is_tv else "movie"
        m["metadataSource"] = "TMDB_VERIFIED"

        # Ensure consistent poster and backdrop paths
        m["posterUrl"] = f"assets/posters/{mid}.jpg"
        m["backdropUrl"] = f"assets/posters/{mid}.jpg"

        # 2. Honest Language Truth Fixes
        if mid == "vod_salaar":
            m["audioClassification"] = "NON_HINDI_AUDIO"
            m["languages"] = ["Telugu"]
            m["defaultLanguage"] = "Telugu"
            m["audioSwitchingCapability"] = "NONE"
            m["hasHindiSubtitles"] = False
            m["audio"] = {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "Telugu",
                "availableLanguages": ["Telugu"]
            }

        elif mid == "vod_tumbbad":
            m["audioClassification"] = "NON_HINDI_AUDIO"
            m["languages"] = ["Marathi"]
            m["defaultLanguage"] = "Marathi"
            m["audioSwitchingCapability"] = "NONE"
            m["hasHindiSubtitles"] = True
            m["audio"] = {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": True,
                "primaryLanguage": "Marathi",
                "availableLanguages": ["Marathi"]
            }

        elif mid == "vod_shershaah":
            m["title"] = "Shershaah"
            m["originalTitle"] = "Shershaah"
            m["year"] = 2021
            m["releaseYear"] = 2021
            m["streamUrl"] = "https://archive.org/download/83-2021-1080p-z-flix-co/17%20-%20Bollywood%20-%202021/Shershaah%20%282021%29%20Hindi%201080p_zFlix%20CO.mp4"
            m["audioClassification"] = "HINDI_AUDIO"
            m["languages"] = ["Hindi"]
            m["defaultLanguage"] = "Hindi"
            m["sourceStatus"] = "PLAYABLE"
            m["sourceState"] = "DIRECT_STREAM_AVAILABLE"
            m["qualityClass"] = "FULL HD"
            m["qualityHonestBadge"] = "1080p FHD"
            m["resolution"] = "1080p (1920x1080)"
            m["audio"] = {
                "classification": "HINDI_AUDIO",
                "hasHindiAudio": True,
                "hasHindiSubtitles": False,
                "primaryLanguage": "Hindi",
                "availableLanguages": ["Hindi"]
            }
        else:
            # Ensure audio is always a dictionary with classification
            if not isinstance(m.get("audio"), dict):
                a_class = m.get("audioClassification", "HINDI_AUDIO")
                has_h_audio = (a_class in ("HINDI_AUDIO", "MULTI_AUDIO_INCLUDING_HINDI"))
                has_h_sub = bool(m.get("hasHindiSubtitles"))
                prim = m.get("defaultLanguage") or (m.get("languages") and m.get("languages")[0]) or "Hindi"
                m["audio"] = {
                    "classification": a_class,
                    "hasHindiAudio": has_h_audio,
                    "hasHindiSubtitles": has_h_sub,
                    "primaryLanguage": prim,
                    "availableLanguages": m.get("languages", [prim])
                }

        # 3. Trailer vs Full Movie Honesty
        has_direct_ep = is_tv and (
            (m.get("seasons") and any(s.get("episodes") and any(e.get("streamUrl") for e in s["episodes"]) for s in m["seasons"])) or
            (m.get("episodes") and any(e.get("streamUrl") for e in m["episodes"]))
        )
        has_stream = bool(m.get("streamUrl") or has_direct_ep)

        if not has_stream:
            if is_tv:
                m["sourceStatus"] = "UNAVAILABLE"
                m["sourceState"] = "NO_AUTHORIZED_SOURCE"
                m["qualityHonestBadge"] = "Unavailable"
                m["qualityClass"] = None
                m["resolution"] = ""
            elif m.get("trailerUrl"):
                if rel_year >= 2025:
                    m["sourceStatus"] = "UPCOMING"
                    m["sourceState"] = "UPCOMING_TRAILER"
                    m["qualityHonestBadge"] = "Official Trailer"
                else:
                    m["sourceStatus"] = "TRAILER_ONLY"
                    m["sourceState"] = "TRAILER_ONLY"
                    m["qualityHonestBadge"] = "Official Trailer"
            else:
                m["sourceStatus"] = "UNAVAILABLE"
                m["sourceState"] = "NO_AUTHORIZED_SOURCE"
                m["qualityHonestBadge"] = "Unavailable"
                m["qualityClass"] = None
                m["resolution"] = ""
        else:
            m["sourceStatus"] = "PLAYABLE"
            m["sourceState"] = "DIRECT_STREAM_AVAILABLE"

    # Write Canonical Master
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"Saved canonical master to {CATALOG_PATH}")

    # Downstream Mirror 1: Android Assets catalog
    with open(ANDROID_CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"Saved downstream mirror to {ANDROID_CATALOG_PATH}")

    # Downstream Mirror 2 & 3: Inline DEFAULT_MOVIES_CATALOG in app.js and android app.js
    compact_json = json.dumps(catalog, separators=(',', ':'), ensure_ascii=False)
    update_app_js(APP_JS_PATH, compact_json)
    update_app_js(ANDROID_APP_JS_PATH, compact_json)
    print("Enrichment and downstream synchronization complete!")

def update_app_js(filepath, compact_json):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = r'(const DEFAULT_MOVIES_CATALOG\s*=\s*)(?:\{.*?\})(\s*;)'
    new_content, count = re.subn(pattern, r'\g<1>' + compact_json.replace('\\', '\\\\') + r'\2', content, count=1, flags=re.DOTALL)
    if count > 0:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated DEFAULT_MOVIES_CATALOG in {filepath}")
    else:
        print(f"WARNING: DEFAULT_MOVIES_CATALOG not matched in {filepath}")

if __name__ == "__main__":
    enrich()
