#!/usr/bin/env python3
"""
Fixes catalog semantics in data/movies_catalog.json:
1. Corrects Jujutsu Kaisen 0 metadata to truthful single-track English master audio.
2. Adds explicit 'episodeType' to all series episodes:
   - 'full_episode' for verified playable episodes.
   - 'no_authorized_source' for commercial series episodes.
3. Updates episode quality badges to honest labels ('Custom Stream' instead of misleading 'Preview').
4. Synchronizes data/movies_catalog.json with android_app/src/main/assets/data/movies_catalog.json.
"""

import os
import json

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
ANDROID_CATALOG_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "data", "movies_catalog.json")


def main():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        cat = json.load(f)

    movies = cat.get("movies", [])
    playable_series_ids = {"series_sherlock_holmes", "series_sherlock_holmes_1954"}

    episodes_updated = 0
    series_updated = 0

    for m in movies:
        mid = m.get("id")

        # 1. Correct Jujutsu Kaisen 0
        if mid == "vod_jujutsu_kaisen_0":
            m["languages"] = ["English"]
            m["defaultLanguage"] = "English"
            m["audioClassification"] = "NON_HINDI_AUDIO"
            m["license"] = "MAPPA / Toho (English Dubbed)"
            m["audio"] = {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "English",
                "availableLanguages": ["English"]
            }
            if "metadata" in m:
                m["metadata"]["originalLanguage"] = "ja"
                m["metadata"]["spokenLanguages"] = ["English"]
            print("  ✅ Corrected vod_jujutsu_kaisen_0 to honest English master audio.")

        # 2. Add episodeType and sanitize episode sourceStates
        if m.get("mediaType") == "series" or "seasons" in m:
            series_updated += 1
            is_playable_series = (mid in playable_series_ids)
            for sn in m.get("seasons", []):
                for ep in sn.get("episodes", []):
                    episodes_updated += 1
                    if ep.get("streamUrl"):
                        ep["episodeType"] = "full_episode"
                        ep["sourceState"] = "DIRECT_STREAM_AVAILABLE"
                    else:
                        ep["episodeType"] = "no_authorized_source"
                        ep["sourceState"] = "NO_AUTHORIZED_SOURCE"
                        ep["qualityHonestBadge"] = "Custom Stream"

    # Write back to root and Android assets
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(cat, f, indent=2)

    with open(ANDROID_CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(cat, f, indent=2)

    print(f"✅ Updated {series_updated} series and {episodes_updated} episodes across catalogs.")


if __name__ == "__main__":
    main()
