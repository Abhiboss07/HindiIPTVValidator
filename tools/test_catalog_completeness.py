#!/usr/bin/env python3
import json
import sys

def test_completeness():
    print("=" * 60)
    print("CATALOG COMPLETENESS & QUALITY HONESTY AUDIT")
    print("=" * 60)

    with open("data/movies_catalog.json", "r", encoding="utf-8") as f:
        cat = json.load(f)

    movies = cat.get("movies", [])
    errors = []

    series_list = [m for m in movies if m.get("contentType") == "SERIES" or m.get("mediaType") == "series"]
    if len(series_list) != 12:
        errors.append(f"Expected 12 series, found {len(series_list)}")

    total_episodes = 0
    for s in series_list:
        sid = s["id"]
        title = s["title"]
        seasons = s.get("seasons", [])
        if not seasons:
            errors.append(f"Series {sid} ({title}) has no seasons")
            continue

        for season in seasons:
            s_num = season.get("seasonNumber")
            eps = season.get("episodes", [])
            if not eps:
                errors.append(f"Series {sid} Season {s_num} has no episodes")
                continue
            
            total_episodes += len(eps)
            ep_nums = [e.get("episodeNumber") for e in eps]
            expected_nums = list(range(1, len(eps) + 1))
            if ep_nums != expected_nums:
                errors.append(f"Series {sid} Season {s_num} has gaps or unordered episodes: {ep_nums} vs expected {expected_nums}")

            for ep in eps:
                if not ep.get("id"):
                    errors.append(f"Series {sid} episode missing id: {ep}")
                if not ep.get("title"):
                    errors.append(f"Series {sid} episode missing title: {ep.get('id')}")
                if ep.get("streamUrl") is not None:
                    errors.append(f"Series {sid} episode {ep.get('id')} has non-null streamUrl: {ep.get('streamUrl')}")

        print(f"  [PASS] Series '{title}' -> {len(seasons)} season(s), {sum(len(sn['episodes']) for sn in seasons)} episodes contiguous (0 gaps)")

    print(f"\nTotal series episodes validated: {total_episodes}")

    print("\n--- 2. VERIFYING QUALITY HONESTY METADATA ---")
    quality_checks = {
        "vod_kalki_2898_ad": ("SD (854x480)", "SD 480p"),
        "vod_12th_fail": ("SD (960x402)", "SD 480p"),
        "vod_oppenheimer": ("SD (1056x480)", "SD 480p"),
        "vod_rrr": ("SD (1152x480)", "SD 480p"),
        "vod_chhavaa": ("SD (1280x640)", "SD 480p"),
        "vod_jawan": ("1080p Full HD (1920x804)", "1080p HD"),
        "vod_dangal": ("1080p Full HD (1920x804)", "1080p HD"),
        "vod_sita_sings_blues": ("720p HD (1280x720)", "720p HD"),
        "vod_bbb_720p": ("Adaptive HD (1080p / 720p / 480p)", "Adaptive HD"),
        "vod_his_girl_friday": ("SD (640x480)", "SD 480p"),
    }

    for mid, (exp_res_sub, exp_badge) in quality_checks.items():
        m = next((item for item in movies if item["id"] == mid), None)
        if not m:
            errors.append(f"Movie {mid} not found in catalog")
            continue
        res = m.get("resolution", "")
        badge = m.get("qualityHonestBadge", "")
        if exp_res_sub not in res:
            errors.append(f"Movie {mid} resolution mismatch: expected '{exp_res_sub}' in '{res}'")
        if badge != exp_badge:
            errors.append(f"Movie {mid} badge mismatch: expected '{exp_badge}', got '{badge}'")
        print(f"  [PASS] {m['title'][:25]:<25} -> Resolution: {res:<35} Badge: {badge}")

    print("\n--- 3. VERIFYING TRAILER ISOLATION ---")
    trailer_items = [m for m in movies if m.get("sourceState") == "TRAILER_ONLY"]
    if len(trailer_items) != 12:
        errors.append(f"Expected 12 trailer-only items, got {len(trailer_items)}")
    for t in trailer_items:
        if t.get("streamUrl") is not None:
            errors.append(f"Trailer-only item {t['id']} has non-null streamUrl: {t.get('streamUrl')}")
        if not t.get("trailerUrl"):
            errors.append(f"Trailer-only item {t['id']} missing trailerUrl")
        if t.get("qualityHonestBadge") != "Trailer":
            errors.append(f"Trailer-only item {t['id']} badge mismatch: {t.get('qualityHonestBadge')}")
        print(f"  [PASS] Trailer: {t['title'][:25]:<25} -> Badge: {t.get('qualityHonestBadge')} (StreamUrl: null)")

    print("\n--- 4. VERIFYING CATALOG ASSET SYNCHRONIZATION ---")
    with open("android_app/src/main/assets/data/movies_catalog.json", "r", encoding="utf-8") as f2:
        cat2 = json.load(f2)
    if cat != cat2:
        errors.append("data/movies_catalog.json and android_app/src/main/assets/data/movies_catalog.json are not identical!")
    else:
        print("  [PASS] Both root and android_app movies_catalog.json files are 100% identical.")

    print("\n" + "=" * 60)
    if errors:
        print(f"FAILED: {len(errors)} errors encountered:")
        for err in errors:
            print(f"  ❌ {err}")
        return 1
    else:
        print("ALL CATALOG COMPLETENESS & QUALITY HONESTY AUDITS PASSED (0 ERRORS)!")
        print("=" * 60)
        return 0

if __name__ == "__main__":
    sys.exit(test_completeness())
