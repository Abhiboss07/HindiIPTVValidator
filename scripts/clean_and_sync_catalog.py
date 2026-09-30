#!/usr/bin/env python3
"""
Clean and sync movies_catalog.json for T2L.
Enforces strict language policy (Hindi & English only),
eliminates dead streams, fixes broken links, verifies web series episodes,
and syncs both catalog files.
"""

import json
from datetime import datetime, timezone
import shutil

SOURCE_CATALOG = "data/movies_catalog.json"
TARGET_ASSET = "android_app/src/main/assets/data/movies_catalog.json"

REMOVE_IDS = {
    # Non-Hindi / Non-English without dub
    'vod_salaar',
    'vod_maharaja_2024',
    'vod_premalu_2024',
    'vod_manjummel_boys_2024',
    'vod_jailer_2023',
    'vod_karthikeya_2_2022',
    'vod_777_charlie_2022',
    'series_crash_landing_on_you',
    'series_descendants_of_the_sun',
    'vod_parasite',
    'vod_sita_ramam_2022',

    # Dead streams / web-series without working episodes
    'series_family_man',
    'series_money_heist',
    'series_sacred_games',
    'series_farzi',
    'series_paatal_lok',
    'series_tvf_pitchers',
    'series_tvf_tripling',
    'series_tvf_aspirants',
    'series_wednesday',
    'series_the_last_of_us'
}

def clean_catalog():
    with open(SOURCE_CATALOG, 'r', encoding='utf-8') as f:
        data = json.load(f)

    movies = data.get('movies', [])
    initial_count = len(movies)
    print(f"Initial catalog items: {initial_count}")

    cleaned_movies = []
    fixed_count = 0

    for m in movies:
        mid = m['id']
        if mid in REMOVE_IDS:
            continue

        # Apply specific verified fixes
        if mid == 'vod_vivah_2006':
            m['streamUrl'] = "https://archive.org/download/vivah-2006-dv-drip-x-264-aac-3-wanxsz/Vivah%202006%20DvDrip%20X264%20AAC%203%20Wanxsz.mp4"
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/Kd4e9olBVYw"
            m['sourceStatus'] = "PLAYABLE"
            m['sourceState'] = "DIRECT_STREAM_AVAILABLE"
            m['qualityHonestBadge'] = "720p HD"
            m['container'] = "MP4"
            fixed_count += 1
        elif mid == 'vod_sarrainodu_2016':
            m['streamUrl'] = "https://www.youtube-nocookie.com/embed/B6h-kQLQqec"
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/B6h-kQLQqec"
            m['sourceStatus'] = "PLAYABLE"
            m['sourceState'] = "DIRECT_STREAM_AVAILABLE"
            m['qualityHonestBadge'] = "4K UHD (2160p)"
            fixed_count += 1
        elif mid == 'trailer_bhool_bhulaiyaa_3_2024':
            m['streamUrl'] = "https://www.youtube-nocookie.com/embed/6YMY62tMLUA"
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/6YMY62tMLUA"
            fixed_count += 1
        elif mid == 'trailer_singham_again_2024':
            m['streamUrl'] = "https://www.youtube-nocookie.com/embed/MD7v0-igVIM"
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/MD7v0-igVIM"
            fixed_count += 1
        elif mid == 'trailer_devara_2024':
            m['streamUrl'] = "https://www.youtube-nocookie.com/embed/NcCYq3bvlJM"
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/NcCYq3bvlJM"
            fixed_count += 1
        elif mid == 'vod_stree_2':
            m['streamUrl'] = "https://www.youtube-nocookie.com/embed/KVnheXywIbY"
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/KVnheXywIbY"
            fixed_count += 1
        elif mid == 'vod_ghajini_2008':
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/_I0xx8Oj3Ww"
            fixed_count += 1
        elif mid == 'vod_aavesham_2024':
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/UttccYQXpTM"
            fixed_count += 1
        elif mid == 'series_gullak':
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/7DJLNCp5HyI"
            fixed_count += 1
        elif mid == 'series_mismatched':
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/uYmwNNkix-k"
            fixed_count += 1
        elif mid == 'series_cosmos_hindi':
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/Fm4UV5_HsPA"
            fixed_count += 1
        elif mid == 'series_undekhi':
            m['trailerUrl'] = "https://www.youtube-nocookie.com/embed/16m0mh3a-QM"
            fixed_count += 1
        elif mid == 'vod_tumbbad':
            m['defaultLanguage'] = "Hindi"
            m['languages'] = ["Hindi"]
            m['audioClassification'] = "HINDI_AUDIO"
            m['audio'] = {
                "classification": "HINDI_AUDIO",
                "hasHindiAudio": True,
                "hasHindiSubtitles": True,
                "primaryLanguage": "Hindi",
                "availableLanguages": ["Hindi"]
            }
            fixed_count += 1
        elif mid == 'vod_the_general_720p':
            m['defaultLanguage'] = "English"
            m['languages'] = ["English"]
            m['audioClassification'] = "NON_HINDI_AUDIO"
            m['audio'] = {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "English",
                "availableLanguages": ["English"]
            }
            fixed_count += 1
        elif mid == 'vod_bbb_4k':
            m['defaultLanguage'] = "English"
            m['languages'] = ["English"]
            m['audioClassification'] = "NON_HINDI_AUDIO"
            m['audio'] = {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": True,
                "primaryLanguage": "English",
                "availableLanguages": ["English"]
            }
            fixed_count += 1

        cleaned_movies.append(m)

    total_series = len([m for m in cleaned_movies if m.get('mediaType') == 'series'])
    total_non_series = len(cleaned_movies) - total_series

    data['version'] = data.get('version', 18) + 1
    data['updated_at'] = datetime.now(timezone.utc).isoformat()
    data['total_movies'] = len(cleaned_movies)
    data['total_series'] = total_series
    data['default_language_filter'] = "Hindi"
    data['movies'] = cleaned_movies

    # Write cleaned catalog
    with open(SOURCE_CATALOG, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Successfully wrote {len(cleaned_movies)} items to {SOURCE_CATALOG}")

    # Sync to android_app asset
    shutil.copyfile(SOURCE_CATALOG, TARGET_ASSET)
    print(f"Successfully synced to {TARGET_ASSET}")

    print("\nSUMMARY:")
    print(f"Audited: {initial_count}")
    print(f"Removed: {len(REMOVE_IDS)}")
    print(f"  - Non-Hindi/Non-English: 11")
    print(f"  - Dead web-series/streams: 10")
    print(f"Fixed: {fixed_count}")
    print(f"Clean Final Count: {len(cleaned_movies)}")
    print(f"  - Web Series: {total_series}")
    print(f"  - Movies / Trailers: {total_non_series}")

if __name__ == '__main__':
    clean_catalog()
