import json, os

YOUTUBE_TRAILER_MAP = {
    "series_stranger_things": "b9EkMc79ZSU",
    "series_panchayat": "mojZJ74i5_g",
    "series_mirzapur": "ZNeGF-PvVHY",
    "vod_gladiator_2": "4rgYUipGJNo",
    "vod_spider_verse": "cqGjhVJWtEg",
    "vod_pathaan": "vqu4z34wENw",
    "series_family_man": "ngK8rK7f6aM",
    "series_money_heist": "_InqQJRqGW4",
    "series_scam_1992": "ISORfez27og",
    "series_sacred_games": "28j8h0RRnq4",
    "vod_interstellar": "zSWdZVtXT7E",
    "series_breaking_bad": "HhesaQXLuRY",
    "vod_dark_knight": "EXeTwQWrcwY",
    "series_kota_factory": "pNZQ6bhflhk",
    "vod_shaitaan": "cpG_z1E_t3w",
    "vod_munjya": "563W8kFwO3c",
    "series_farzi": "3ZrgHjH-P_Y",
    "vod_leo": "Po3jStA673E",
    "vod_tiger_3": "vMzm-V6ev44",
    "vod_salaar": "4GPvYMKtrtI",
    "vod_dunki": "2TuYw2hH-B0",
    "vod_animal": "Dydmpfo68DA",
    "vod_gadar_2": "vhwr4cf_uv8",
    "vod_the_batman": "mqqft2x_Aa4",
    "vod_brahmastra": "V5Z7pe4XwJg",
    "vod_pushpa_the_rise": "pKctjlpbqpA",
    "series_paatal_lok": "cNwfZ_x-1gQ",
    "vod_avengers_endgame": "TcMBFSGVi1c",
    "vod_inception": "YoHD9XEInc0",
    "series_squid_game": "oqxAJKy0ii4",
    "series_all_of_us_are_dead": "IN5iedt_BJ8",
    "series_crash_landing_on_you": "GVQGWgeVc4k",
    "series_vincenzo": "_J8tYxSB_LQ",
    "series_the_glory": "tqFFwf-q-bg",
    "series_business_proposal": "M-PHcxPkYQI",
    "series_descendants_of_the_sun": "WUsxU1tD0iQ",
    "series_happiness": "V022l4R_s0A",
    "series_my_name": "ZoldeqPnefg",
    "series_sweet_home": "7rI56NmD33Y",
    "series_goblin": "8AcNGouXZi8",
    "series_true_beauty": "YnF_qY7-3vI",
    "series_the_untamed": "4bWqE4iXWc0",
    "series_falling_into_your_smile": "36N18aZ_Nrg",
    "series_hidden_love": "9h7eR3H5T4M",
    "series_love_between_fairy_and_devil": "Q0s6m4U-v4o",
    "series_put_your_head_on_my_shoulder": "fNfVq2fP83Y",
    "series_meteor_garden": "X4zH6YJ2fPQ",
    "series_word_of_honor": "6Jz3u3rL6uE",
    "series_reset": "8ZlH9q_v4gY",
    "vod_train_to_busan": "pyWuHv2-Abk",
    "vod_parasite": "5xH0R_axxV8",
    "vod_the_raid_redemption": "m6Q7KnXpNOg",
    "vod_ip_man": "1AJxXQ74QGY",
    "vod_ip_man_4": "oCBGTCNJW2g",
    "vod_peninsula": "aZ3w8bQ7g4M",
    "vod_kung_fu_hustle": "-m3V84LJSxA",
    "vod_shaolin_soccer": "bREQCfWpD-U",
    "vod_the_outlaws": "Ff9J0l4J-5Q",
    "vod_the_roundup": "eXh2bF9P6uE",
    "vod_demon_slayer_mugen_train": "ATxIMy89bHQ",
    "vod_jujutsu_kaisen_0": "e8YBesRKq_U",
    "vod_suzume": "539794-k3sY",
    "vod_your_name": "xU47nhruN-Q",
    "series_death_note": "NlPT54n5B3E",
    "series_naruto_classic": "f1n07P1UuXg",
    "series_solo_leveling": "mY9D5-a_oZk",
    "vod_one_piece_film_red": "89JWDXP4Lio",
    "vod_stree": "gzeaGcNm74E",
    "vod_drishyam_2": "cxA2y9Tgl7o",
    "vod_kantara": "6oef9w3zY_Y",
    "vod_kgf_chapter_1": "qXgF-1uh_6g",
    "vod_baahubali_1": "sOEg_YZ-n0g",
    "vod_baahubali_2": "qD-6d8Wo3do",
    "vod_tumbbad": "sZ57oG4E60o",
    "vod_andhadhun": "hyL6L43u-9k",
    "vod_shershaah": "Q0FTXnefVBA",
    "vod_3_idiots": "K0eDlFX9GMc",
    "vod_gangs_of_wasseypur": "j-AkVnBWmsY",
    "vod_vikram_vedha": "hpwnlr-ZHB0"
}

catalog_path = "data/movies_catalog.json"
with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

updated_count = 0
for m in catalog.get("movies", []):
    mid = m.get("id")
    if mid in YOUTUBE_TRAILER_MAP and m.get("sourceState") == "NO_AUTHORIZED_SOURCE":
        vid = YOUTUBE_TRAILER_MAP[mid]
        trailer_url = f"https://www.youtube-nocookie.com/embed/{vid}"
        m["trailerUrl"] = trailer_url
        m["sourceState"] = "TRAILER_ONLY"
        m["qualityHonestBadge"] = "Official Trailer"
        m["resolution"] = "Official Studio Trailer (1080p HD)"
        
        # If series, ensure episodes have trailer fallback info
        if m.get("mediaType") == "series":
            if m.get("seasons"):
                for s in m["seasons"]:
                    for ep in s.get("episodes", []):
                        if not ep.get("streamUrl"):
                            ep["sourceState"] = "TRAILER_ONLY"
                            ep["qualityHonestBadge"] = "Preview"
            if m.get("episodes"):
                for ep in m["episodes"]:
                    if not ep.get("streamUrl"):
                        ep["sourceState"] = "TRAILER_ONLY"
                        ep["qualityHonestBadge"] = "Preview"
                        
        updated_count += 1

catalog["version"] = catalog.get("version", 9) + 1
catalog["updated_at"] = "2026-09-17T11:20:00Z"

with open(catalog_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

# Sync to Android assets
android_cat_path = "android_app/src/main/assets/data/movies_catalog.json"
with open(android_cat_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Successfully updated {updated_count} titles in both catalog paths!")
