#!/usr/bin/env python3
"""
Phase 2A & 2B Remediation Script
Fixes data integrity, media identity, stream sources, and schema alignment.
"""

import json
import os
import shutil

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
CHANNELS_PATH = os.path.join(WORKSPACE, "data", "channels.json")
ASSETS_CATALOG_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "data", "movies_catalog.json")
ASSETS_CHANNELS_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "data", "channels.json")

def remediate_catalog():
    print(f"Loading {CATALOG_PATH}...")
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    movies = catalog.get("movies", [])
    modified_count = 0

    for m in movies:
        mid = m.get("id")

        # 1. vod_dark_knight
        if mid == "vod_dark_knight":
            m["title"] = "The Dark Knight"
            m["originalTitle"] = "The Dark Knight"
            m["description"] = "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
            m["director"] = "Christopher Nolan"
            m["cast"] = "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Gary Oldman, Morgan Freeman"
            m["rating"] = 9.0
            m["tmdbId"] = 155
            m["imdbId"] = "tt0468569"
            m["contentId"] = "movie_tmdb_155"
            m["streamUrl"] = None
            m["trailerUrl"] = "https://www.youtube-nocookie.com/embed/EXeTwQWrcwY"
            m["sourceState"] = "TRAILER_ONLY"
            m["sourceStatus"] = "TRAILER_ONLY"
            m["qualityClass"] = "TRAILER"
            m["qualityHonestBadge"] = "Official Trailer"
            m["resolution"] = "Trailer Only"
            m["durationFormatted"] = "Trailer (2-3 min)"
            modified_count += 1
            print("Remediated: vod_dark_knight")

        # 2. vod_stree_2
        elif mid == "vod_stree_2":
            m["streamUrl"] = None
            m["trailerUrl"] = "https://archive.org/download/lv_0_20250311095752/lv_0_20250311095752.mp4"
            m["sourceState"] = "TRAILER_ONLY"
            m["sourceStatus"] = "TRAILER_ONLY"
            m["qualityClass"] = "TRAILER"
            m["qualityHonestBadge"] = "Official Trailer"
            m["resolution"] = "Trailer Only"
            m["durationFormatted"] = "Trailer (2-3 min)"
            modified_count += 1
            print("Remediated: vod_stree_2")

        # 3. vod_ip_man
        elif mid == "vod_ip_man":
            m["title"] = "Ip Man"
            m["streamUrl"] = "https://archive.org/download/ip-man-720-hd-2008/Ip%20Man%20%5B720%5D_HD_%282008%29.mp4"
            m["sourceState"] = "DIRECT_STREAM_AVAILABLE"
            m["sourceStatus"] = "PLAYABLE"
            m["qualityClass"] = "HD"
            m["qualityHonestBadge"] = "720p HD"
            m["resolution"] = "720p HD (1280x536)"
            modified_count += 1
            print("Remediated: vod_ip_man")

        # 4. vod_the_roundup
        elif mid == "vod_the_roundup":
            m["title"] = "The Roundup"
            m["streamUrl"] = None
            m["trailerUrl"] = "https://www.youtube-nocookie.com/embed/PDEl1rw_Vn0"
            m["sourceState"] = "TRAILER_ONLY"
            m["sourceStatus"] = "TRAILER_ONLY"
            m["qualityClass"] = "TRAILER"
            m["qualityHonestBadge"] = "Official Trailer"
            m["resolution"] = "Trailer Only"
            m["durationFormatted"] = "Trailer (2-3 min)"
            modified_count += 1
            print("Remediated: vod_the_roundup")

        # 5. vod_oppenheimer
        elif mid == "vod_oppenheimer":
            m["streamUrl"] = None
            m["sourceState"] = "TRAILER_ONLY"
            m["sourceStatus"] = "TRAILER_ONLY"
            m["qualityClass"] = "TRAILER"
            m["qualityHonestBadge"] = "Official Trailer"
            m["resolution"] = "Trailer Only"
            modified_count += 1
            print("Remediated: vod_oppenheimer")

        # 6. vod_demon_slayer_mugen_train
        elif mid == "vod_demon_slayer_mugen_train":
            m["streamUrl"] = None
            m["sourceState"] = "TRAILER_ONLY"
            m["sourceStatus"] = "TRAILER_ONLY"
            m["qualityClass"] = "TRAILER"
            m["qualityHonestBadge"] = "Official Trailer"
            m["resolution"] = "Trailer Only"
            modified_count += 1
            print("Remediated: vod_demon_slayer_mugen_train")

        # 7. series_panchayat
        elif mid == "series_panchayat":
            s1_episodes = [
                {
                    "id": "panchayat_s1e1",
                    "episodeNumber": 1,
                    "season": 1,
                    "title": "S01:E01 • Gram Panchayat Phulera",
                    "duration": "40m",
                    "streamUrl": None,
                    "sourceState": "NO_AUTHORIZED_SOURCE",
                    "qualityHonestBadge": "Source Unavailable",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e2",
                    "episodeNumber": 2,
                    "season": 1,
                    "title": "S01:E02 • Bhoota Ped",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E02.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e3",
                    "episodeNumber": 3,
                    "season": 1,
                    "title": "S01:E03 • Chakke Wali Kursi",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E03.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e4",
                    "episodeNumber": 4,
                    "season": 1,
                    "title": "S01:E04 • Hamper",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E04.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e5",
                    "episodeNumber": 5,
                    "season": 1,
                    "title": "S01:E05 • Computer",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E05.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e6",
                    "episodeNumber": 6,
                    "season": 1,
                    "title": "S01:E06 • Bahot Hua Samman",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E06.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e7",
                    "episodeNumber": 7,
                    "season": 1,
                    "title": "S01:E07 • Ladka Tez Hai Lekin..",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E07.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                },
                {
                    "id": "panchayat_s1e8",
                    "episodeNumber": 8,
                    "season": 1,
                    "title": "S01:E08 • Jab Kismat Ho Kharab",
                    "duration": "40m",
                    "streamUrl": "https://archive.org/download/a2z-panchayat-season-1/E08.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "HD 720p",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                }
            ]

            s3_episodes = [
                {
                    "id": "panchayat_s3e1",
                    "episodeNumber": 1,
                    "season": 3,
                    "title": "S03 • Complete Feature Edition (E01-E08)",
                    "duration": "2h 45m",
                    "streamUrl": "https://archive.org/download/panchayat-s-03-e-1-8/Panchayat-S03E1-8.mp4",
                    "sourceState": "DIRECT_STREAM_AVAILABLE",
                    "qualityHonestBadge": "1080p FHD",
                    "episodeType": "full_episode",
                    "audioSwitchingCapability": "NONE"
                }
            ]

            m["seasons"] = [
                {
                    "seasonNumber": 1,
                    "title": "Season 1",
                    "episodes": s1_episodes
                },
                {
                    "seasonNumber": 3,
                    "title": "Season 3",
                    "episodes": s3_episodes
                }
            ]
            m["episodes"] = s1_episodes + s3_episodes
            m["streamUrl"] = "https://archive.org/download/a2z-panchayat-season-1/E02.mp4"
            modified_count += 1
            print("Remediated: series_panchayat (fixed +1 shift, unshifted E02-E08, labeled S3)")

        # 8. series_squid_game percent encoding
        elif mid == "series_squid_game":
            if m.get("streamUrl") and "[" in m["streamUrl"]:
                m["streamUrl"] = m["streamUrl"].replace("[", "%5B").replace("]", "%5D")
            for ep in m.get("episodes", []):
                if ep.get("streamUrl") and "[" in ep["streamUrl"]:
                    ep["streamUrl"] = ep["streamUrl"].replace("[", "%5B").replace("]", "%5D")
            for sea in m.get("seasons", []):
                for ep in sea.get("episodes", []):
                    if ep.get("streamUrl") and "[" in ep["streamUrl"]:
                        ep["streamUrl"] = ep["streamUrl"].replace("[", "%5B").replace("]", "%5D")
            modified_count += 1
            print("Remediated: series_squid_game (percent-encoded RFC 3986 brackets)")

        # 9. Schema alignment
        if mid in ("vod_ramayana_part_1_2026", "vod_war_2_2025", "vod_toxic_2026"):
            if "synopsis" in m and "description" not in m:
                m["description"] = m["synopsis"]
            if "genre" in m and "genres" not in m:
                m["genres"] = list(m["genre"])
            if "categories" not in m and "genres" in m:
                m["categories"] = [g.lower() for g in m["genres"]]
            if "type" not in m:
                m["type"] = "movie"
            if "region" not in m:
                m["region"] = "IN"
            modified_count += 1
            print(f"Remediated schema alignment: {mid}")

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"Saved {CATALOG_PATH} with {modified_count} items updated.")

    if os.path.exists(os.path.dirname(ASSETS_CATALOG_PATH)):
        shutil.copy2(CATALOG_PATH, ASSETS_CATALOG_PATH)
        print(f"Synced to {ASSETS_CATALOG_PATH}")


def remediate_channels():
    print(f"Loading {CHANNELS_PATH}...")
    with open(CHANNELS_PATH, "r", encoding="utf-8") as f:
        channels = json.load(f)

    dead_names = {
        "DD Chhattisgarh",
        "News Daily 24",
        "Santvani Channel",
        "Hi Dost!",
        "Swaraj Express SMBC",
        "Subharti TV"
    }

    updated = 0
    for c in channels:
        if c.get("name") in dead_names or not c.get("url"):
            if c.get("status") != "OFFLINE":
                c["status"] = "OFFLINE"
                updated += 1
                print(f"Marked OFFLINE: {c.get('id')} ({c.get('name')})")

    with open(CHANNELS_PATH, "w", encoding="utf-8") as f:
        json.dump(channels, f, indent=2, ensure_ascii=False)
    print(f"Saved {CHANNELS_PATH} with {updated} channels marked OFFLINE.")

    if os.path.exists(os.path.dirname(ASSETS_CHANNELS_PATH)):
        shutil.copy2(CHANNELS_PATH, ASSETS_CHANNELS_PATH)
        print(f"Synced to {ASSETS_CHANNELS_PATH}")


if __name__ == "__main__":
    remediate_catalog()
    remediate_channels()
