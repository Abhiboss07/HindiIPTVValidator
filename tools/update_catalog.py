import json

def process_catalog(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Correct stream URLs for full movies
    full_movies = {
        "vod_12th_fail": "https://archive.org/download/12th-fail-2023-bollywood-hindi-movie-hevc-720p-esub/%F0%9F%8E%AC%2012th_Fail_%282023%29_Bollywood_Hindi_Movie_HEVC_720p_ESub.mp4",
        "vod_kalki_2898_ad": "https://archive.org/download/kalki.-2898.-ad.-2024.-hindi.-web-dl.-720p/Kalki.2898.AD.2024.Hindi.WEB-DL.720p.mp4",
        "vod_jawan": "https://archive.org/download/jawan.-2023.1080p.-blu-ray.x-264.-aac-5.1-yts.-mx/Jawan.2023.1080p.BluRay.x264.AAC5.1-%5BYTS.MX%5D.mp4",
        "vod_dangal": "https://archive.org/download/dangal-1080p-2016/Dangal%201080p%202016.mp4",
        "vod_oppenheimer": "https://archive.org/download/oppenheimer-2023-imax-1080p-blu-ray-hindi-english-ddp-5.1-h.-265-esubs-extra-flix.-pw/Oppenheimer%20%282023%29%20IMAX%201080p%20BluRay%20%5BHindi-English%5D%20DDP5.1%20H.265%20ESubs-ExtraFlix.Pw.mp4",
        "vod_chhavaa": "https://archive.org/download/chhaava-2025-hindi-full-movie-720p-hdtc-filmywap.pm/Chhaava_2025_Hindi_Full_Movie_720p_HDTC-%28Filmywap.pm%29.mp4",
        "vod_rrr": "https://archive.org/download/rrr-2022-1080p-amzn-web-dl-x-265-telugu-dd-5.1/RRR%20%282022%29%201080p%20AMZN%20WEB-DL%20x265%20%5BTelugu%20%28DD%2B%205.1%20-.mp4",
        "vod_sita_sings_blues": "https://archive.org/download/Sita_Sings_the_Blues/Sita_Sings_the_Blues_720p.mp4",
        "vod_his_girl_friday": "https://archive.org/download/his_girl_friday/his_girl_friday.mp4",
        "vod_bbb_720p": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    }

    # Trailer URLs
    trailer_movies = {
        "vod_deadpool_wolverine": "https://archive.org/download/unlisted-deadpoolspot/Deleted%20Deadpool%20Spot.mp4",
        "vod_stree_2": "https://archive.org/download/lv_0_20250311095752/lv_0_20250311095752.mp4",
        "vod_gladiator_2": None,
        "vod_spider_verse": None,
        "vod_pathaan": None,
        "vod_interstellar": None,
        "vod_dark_knight": None,
        "vod_dune_part_two": "https://archive.org/download/dune-part-two-official-imax-trailer-2-4k-prores/DunePartTwo_Official-IMAX-Trailer-2_4K_51_prores.mp4",
        "vod_furiosa": "https://archive.org/download/furiosa-a-mad-max-saga-official-trailer-2-4k-prores/Furiosa_OfficialTrailer2_4K_51_prores.mp4",
        "vod_shaitaan": None,
        "vod_alien_romulus": "https://archive.org/download/alien-romulus-imax-final-trailer-4k-prores/AlienRomulus_IMAX-Final-Trailer_4K_51_prores.mp4",
        "vod_munjya": None,
        "vod_fighter": "https://archive.org/download/fighter-official-trailer-hrithik-roshan-deepika-padukone-anil-kapoor-siddharth-anand/Fighter%20Official%20Trailer%20-%20Hrithik%20Roshan%2C%20Deepika%20Padukone%2C%20Anil%20Kapoor%2C%20Siddharth%20Anand.mp4",
        "vod_godzilla_x_kong": "https://archive.org/download/godzilla-vs-kong-final-trailer/Godzilla%20Vs%20Kong%20-%20Final%20Trailer%21.mp4",
        "vod_john_wick_4": "https://archive.org/download/youtube-fvJvbA1MvTY/fvJvbA1MvTY.mp4",
        "vod_leo": None,
        "vod_tiger_3": None,
        "vod_salaar": None,
        "vod_dunki": None,
        "vod_animal": None,
        "vod_gadar_2": None,
        "vod_kgf_chapter_2": "https://archive.org/download/kgf-chapter-2-teaser-yash-sanjay-dutt-raveena-tandon-srinidhi-shetty-prashanth-neel-vijay-kiragandur/KGF%20Chapter2%20TEASER%20_Yash_Sanjay%20Dutt_Raveena%20Tandon_Srinidhi%20Shetty_Prashanth%20Neel_Vijay%20Kiragandur.mp4",
        "vod_top_gun_maverick": "https://archive.org/download/top-gun-maverick-official-trailer-2-prores/TopGunMaverick_OfficialTrailer2_4K_51_prores.mp4",
        "vod_the_batman": None,
        "vod_avatar_way_of_water": "https://archive.org/download/avatar-the-way-of-water-official-trailer-4k-imax-prores/AvatarWayOfWater-IMX_TLR-E-2D_EN-XX_INT_IMAX5_4K_TCS_20221102_prores.mp4",
        "vod_brahmastra": None,
        "vod_spider_man_nwh": "https://archive.org/download/spider-man-no-way-home-official-trailer-hd_202508/SPIDER-MAN_%20NO%20WAY%20HOME%20-%20Official%20Trailer%20%28HD%29.mp4",
        "vod_pushpa_the_rise": None,
        "vod_avengers_endgame": None,
        "vod_inception": None
    }
    
    # Process each entry
    for entry in data.get("movies", []):
        item_id = entry.get("id", "")
        
        # 1. Determine contentType
        if item_id.startswith("series_"):
            entry["contentType"] = "SERIES"
        else:
            entry["contentType"] = "MOVIE"
            
        # 2. Determine region based on id/title/categories
        cats = entry.get("categories", [])
        types = entry.get("type", "").lower()
        if item_id in ["vod_sita_sings_blues", "vod_his_girl_friday", "vod_bbb_720p"]:
            entry["region"] = "PUBLIC_DOMAIN"
        elif "bollywood" in cats or "hindi" in types:
            entry["region"] = "BOLLYWOOD"
        elif "hollywood" in cats or "english" in types:
            entry["region"] = "HOLLYWOOD"
        else:
            # fallback
            if "bollywood" in [c.lower() for c in entry.get("genres", [])]:
                entry["region"] = "BOLLYWOOD"
            else:
                entry["region"] = "INTERNATIONAL"
        
        # 3. Stream URL and Trailer URL
        entry["trailerUrl"] = None
        if item_id in full_movies:
            entry["streamUrl"] = full_movies[item_id]
        elif item_id in trailer_movies:
            entry["streamUrl"] = None
            entry["trailerUrl"] = trailer_movies[item_id]
        else:
            if item_id.startswith("series_"):
                entry["streamUrl"] = None
            else:
                # Keep whatever streamUrl is there, or set to None?
                entry["streamUrl"] = None

        # 4. Handle series
        if entry["contentType"] == "SERIES":
            entry["streamUrl"] = None # as requested
            
            if "episodes" in entry:
                seasons = {}
                for ep in entry["episodes"]:
                    ep["streamUrl"] = None
                    sn = ep.get("season", 1)
                    if sn not in seasons:
                        seasons[sn] = []
                    seasons[sn].append(ep)
                
                # Create seasons array
                seasons_arr = []
                for sn in sorted(seasons.keys()):
                    seasons_arr.append({
                        "seasonNumber": sn,
                        "title": f"Season {sn}",
                        "episodes": sorted(seasons[sn], key=lambda x: x.get("episodeNumber", 0))
                    })
                entry["seasons"] = seasons_arr
                # Also keep flat episodes array as is (already mutated with streamUrl = None)
                
    data["updated_at"] = "2026-09-13T05:00:00Z"

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

process_catalog('/home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json')
