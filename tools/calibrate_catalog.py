import json
from datetime import datetime

cat_path = "data/movies_catalog.json"

with open(cat_path, "r", encoding="utf-8") as f:
    cat = json.load(f)

cat["version"] = 8
cat["updated_at"] = "2026-09-14T15:00:00Z"

for m in cat["movies"]:
    mid = m["id"]
    
    # 1. Mirzapur honest realignment
    if mid == "series_mirzapur":
        m["sourceState"] = "NO_AUTHORIZED_SOURCE"
        m["torrentUri"] = None
        m["streamUrl"] = None
        m["swarmSeeders"] = None
        m["qualityClass"] = None
        m["qualityHonestBadge"] = None
        m["resolution"] = "Source Unavailable"
        
        # Seasons and episodes
        if "seasons" in m:
            for s in m["seasons"]:
                for ep in s.get("episodes", []):
                    ep["streamUrl"] = None
                    ep["sourceState"] = "NO_AUTHORIZED_SOURCE"
                    ep["qualityHonestBadge"] = None
        if "episodes" in m:
            for ep in m["episodes"]:
                ep["streamUrl"] = None
                ep["sourceState"] = "NO_AUTHORIZED_SOURCE"
                ep["qualityHonestBadge"] = None
        print("✅ Mirzapur updated to NO_AUTHORIZED_SOURCE")

    # 2. Game of Thrones episode state
    elif mid == "series_game_of_thrones":
        if "seasons" in m:
            for s in m["seasons"]:
                for ep in s.get("episodes", []):
                    ep["sourceState"] = "NO_AUTHORIZED_SOURCE"
                    ep["qualityHonestBadge"] = None
        if "episodes" in m:
            for ep in m["episodes"]:
                ep["sourceState"] = "NO_AUTHORIZED_SOURCE"
                ep["qualityHonestBadge"] = None
        print("✅ Game of Thrones episodes calibrated")

    # 3. Quality and Audio calibration based on ffprobe
    elif mid == "vod_kalki_2898_ad":
        m["resolution"] = "480p SD (854x480)"
        m["qualityHonestBadge"] = "480p SD"
        m["qualityClass"] = "SD"
        m["languages"] = ["Hindi"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ Kalki calibrated to 480p SD / Hindi")

    elif mid == "vod_12th_fail":
        m["resolution"] = "480p SD (960x402)"
        m["qualityHonestBadge"] = "480p SD"
        m["qualityClass"] = "SD"
        m["languages"] = ["Hindi"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ 12th Fail calibrated to 480p SD / Hindi")

    elif mid == "vod_oppenheimer":
        m["resolution"] = "480p SD (1056x480)"
        m["qualityHonestBadge"] = "480p SD"
        m["qualityClass"] = "SD"
        m["languages"] = ["English"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ Oppenheimer calibrated to 480p SD / English")

    elif mid == "vod_rrr":
        m["resolution"] = "480p SD (1152x480)"
        m["qualityHonestBadge"] = "480p SD"
        m["qualityClass"] = "SD"
        m["languages"] = ["Telugu"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ RRR calibrated to 480p SD / Telugu")

    elif mid == "vod_his_girl_friday":
        m["resolution"] = "480p SD (640x480)"
        m["qualityHonestBadge"] = "480p SD"
        m["qualityClass"] = "SD"
        m["languages"] = ["English"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ His Girl Friday calibrated to 480p SD / English")

    elif mid == "vod_chhavaa":
        m["resolution"] = "720p HD (1280x640)"
        m["qualityHonestBadge"] = "720p HD"
        m["qualityClass"] = "HD"
        m["languages"] = ["Hindi"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ Chhaava calibrated to 720p HD / Hindi")

    elif mid == "vod_sita_sings_blues":
        m["resolution"] = "720p HD (1280x720)"
        m["qualityHonestBadge"] = "720p HD"
        m["qualityClass"] = "HD"
        m["languages"] = ["English"]
        m["audio"] = "Stereo AAC (1 Track)"
        print("✅ Sita Sings the Blues calibrated to 720p HD / English")

    elif mid == "vod_jawan":
        m["resolution"] = "1080p FHD (1920x804)"
        m["qualityHonestBadge"] = "1080p Full HD"
        m["qualityClass"] = "FULL HD"
        m["languages"] = ["Hindi"]
        m["audio"] = "5.1 Surround AAC (1 Track)"
        print("✅ Jawan calibrated to 1080p Full HD / Hindi")

    elif mid == "vod_dangal":
        m["resolution"] = "1080p FHD (1920x804)"
        m["qualityHonestBadge"] = "1080p Full HD"
        m["qualityClass"] = "FULL HD"
        m["languages"] = ["Hindi"]
        m["audio"] = "5.1 Surround AAC (1 Track)"
        print("✅ Dangal calibrated to 1080p Full HD / Hindi")

    elif mid == "series_sherlock_holmes":
        m["resolution"] = "1080p FHD (1920x1080)"
        m["qualityHonestBadge"] = "1080p Full HD"
        m["qualityClass"] = "FULL HD"
        m["languages"] = ["English"]
        m["audio"] = "Stereo AC-3 (1 Track)"
        print("✅ Sherlock Holmes calibrated to 1080p Full HD / English")

    elif mid == "vod_bbb_720p":
        m["resolution"] = "1080p Adaptive HLS"
        m["qualityHonestBadge"] = "1080p Adaptive"
        m["qualityClass"] = "FULL HD"
        m["languages"] = ["Universal Audio"]
        m["audio"] = "Multi-Rate HLS Audio"
        print("✅ Big Buck Bunny calibrated to 1080p Adaptive")

with open(cat_path, "w", encoding="utf-8") as f:
    json.dump(cat, f, indent=2, ensure_ascii=False)

print("\nCatalog saved successfully to", cat_path)
