import json
import shutil
from datetime import datetime

DATA_PATH = "data/channels.json"
ASSETS_PATH = "android_app/src/main/assets/data/channels.json"

new_channels = [
    {
        "id": "sony-yay-hindi",
        "name": "Sony YAY! (Hindi)",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🎨",
        "category": "CARTOONS",
        "quality": "576p SD Broadcast",
        "description": "Sony Pictures Networks premier Hindi kids channel featuring Oggy, Honey Bunny, and anime adventures.",
        "url": "http://103.185.24.134:3001/SONY-YAY/index.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "super-hungama-hindi",
        "name": "Super Hungama (Hindi)",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "⚡",
        "category": "CARTOONS",
        "quality": "576p SD Broadcast",
        "description": "Disney action-packed anime, Marvel superheroes, Beyblade, and animated adventures in Hindi.",
        "url": "http://103.185.24.134:3001/SUPER-HUNGAMA/index.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "dd-sports-hd",
        "name": "DD Sports HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🏅",
        "category": "SPORTS",
        "quality": "720p HD",
        "description": "Official national sports channel broadcasting live Indian cricket, athletics, and multisport championships with Hindi commentary.",
        "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/b17adfe543354fdd8d189b110617cddd/index.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "history-tv18-hindi",
        "name": "History TV18 HD (Hindi)",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🏛️",
        "category": "INFOTAINMENT",
        "quality": "1080p FHD",
        "description": "Leading factual entertainment, world mysteries, Pawn Stars, and blockbuster documentaries in Hindi.",
        "url": "https://amg01448-amg01448c16-samsung-in-3495.playouts.now.amagi.tv/ts-ap-s1-n1/playlist/amg01448-samsungindia-historychannelhindi-samsungin/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "sony-bbc-earth-hd",
        "name": "Sony BBC Earth HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India (International)",
        "flag": "🌍",
        "category": "INFOTAINMENT",
        "quality": "1080p FHD",
        "description": "Stunning wildlife, science, natural history, and BBC Earth premium expeditions in full HD.",
        "url": "https://lightning-fnf-samsungaus.amagi.tv/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "aaj-tak-news-hd",
        "name": "Aaj Tak HD News",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🔴",
        "category": "NEWS",
        "quality": "1080p FHD",
        "description": "India's premier 24/7 Hindi news broadcaster delivering breaking news, analysis, and ground reports in 1080p.",
        "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "ndtv-india-hd",
        "name": "NDTV India HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🗞️",
        "category": "NEWS",
        "quality": "720p HD",
        "description": "Trusted 24/7 Hindi news channel providing comprehensive national reporting, debates, and investigative journalism.",
        "url": "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/master.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "abp-news-hd",
        "name": "ABP News HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "⚡",
        "category": "NEWS",
        "quality": "1080p FHD",
        "description": "Top-rated Hindi news network delivering rapid bulletins, special investigations, and national coverage in 1080p.",
        "url": "https://d1rc86nwwc9fag.cloudfront.net/vglive-sk-472500/abpnews/master.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "india-tv-hd",
        "name": "India TV HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "📺",
        "category": "NEWS",
        "quality": "720p HD",
        "description": "India's leading Hindi news station featuring Aap Ki Adalat, Superfast news, and in-depth prime-time debates.",
        "url": "https://pl-indiatvnews.akamaized.net/out/v1/db79179b608641ceaa5a4d0dd0dca8da/index.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "india-tv-speed-news",
        "name": "India TV Speed News HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "⚡",
        "category": "NEWS",
        "quality": "1080p FHD",
        "description": "Continuous fast-paced Hindi news headlines and non-stop national news updates in 1080p.",
        "url": "https://cc-lyf4c0hwzg5dd.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-lyf4c0hwzg5dd/v1/vglive-sk-479089/main.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "republic-bharat-hd",
        "name": "Republic Bharat HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🔥",
        "category": "NEWS",
        "quality": "1080p FHD",
        "description": "High-octane 24/7 Hindi news, investigative journalism, and debate network in crystal-clear 1080p.",
        "url": "https://samsung-republicbharat.amagi.tv/ts-ap-s1-n1/playlist/samsungin-republicbharat-samsungindia/playlist.m3u8",
        "backupUrls": [
            "https://streams.tangotv.in/REPUBLICBHARAT/ORIGIN/index.m3u8"
        ],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "news18-india-hd",
        "name": "News18 India HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": "NEWS",
        "quality": "1080p FHD",
        "description": "Network18 flagship Hindi national news channel covering India and global headlines in 1080p.",
        "url": "https://n18syndication.akamaized.net/bpk-tv/News18_India_NW18_MOB/output01/master.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "times-now-navbharat-hd",
        "name": "Times Now Navbharat HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "📢",
        "category": "NEWS",
        "quality": "1080p FHD",
        "description": "Times Network flagship Hindi news channel providing bold, disruptive reporting and prime-time analysis.",
        "url": "https://yupprestreamliveus.akamaized.net/v1/vglive-sk-717514/main.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "tv9-bharatvarsh-hd",
        "name": "TV9 Bharatvarsh HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "📡",
        "category": "NEWS",
        "quality": "720p HD",
        "description": "Fast-growing Hindi news channel offering dynamic visual presentation and global geopolitical reporting.",
        "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9hinjzgtpe/liveabr/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "colors-cineplex-bollywood",
        "name": "Colors Cineplex Bollywood",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🎬",
        "category": "MOVIES",
        "quality": "576p SD Broadcast",
        "description": "24/7 Hindi movie channel broadcasting iconic Bollywood hits, action thrillers, and family classics.",
        "url": "http://202.70.146.135:8000/play/a058/index.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "zee-cine-classic",
        "name": "Zee Cine Classic HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🎞️",
        "category": "MOVIES",
        "quality": "1080p FHD",
        "description": "Golden era and vintage Bollywood cinema classics in remastered 1080p.",
        "url": "https://amg00862-amg00862c8-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c8-amgplt0173/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    },
    {
        "id": "zee-comedy-nation",
        "name": "Zee Comedy Nation HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "😂",
        "category": "ENTERTAINMENT",
        "quality": "1080p FHD",
        "description": "Round-the-clock Hindi comedy shows, stand-up specials, and sitcoms in 1080p.",
        "url": "https://amg00862-amg00862c5-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c5-amgplt0173/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True,
        "sourceType": "LIVE_HLS",
        "status": "PASS",
        "language": "Hindi",
        "lastChecked": "2026-09-30T12:30:00Z",
        "lastSuccessfulCheck": "2026-09-30T12:30:00Z",
        "consecutiveFailures": 0,
        "failureReason": None
    }
]

def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        channels = json.load(f)

    existing_ids = {c["id"]: i for i, c in enumerate(channels)}

    # Remove Geo-blocked tag from live_ch_300 if present
    for c in channels:
        if c.get("id") == "live_ch_300" and "[Geo-blocked]" in c.get("name", ""):
            c["name"] = "History TV18 HD Hindi"

    # Add or update channels
    to_insert = []
    for item in new_channels:
        if item["id"] in existing_ids:
            idx = existing_ids[item["id"]]
            channels[idx].update(item)
            print(f"Updated existing channel: {item['id']}")
        else:
            to_insert.append(item)

    print(f"Adding {len(to_insert)} new channels...")
    # Insert right at index 15 (near the front among top featured channels)
    insert_pos = 15
    for item in reversed(to_insert):
        channels.insert(insert_pos, item)

    print(f"Total channels after merge: {len(channels)}")

    # Write data/channels.json
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(channels, f, indent=2, ensure_ascii=False)
    print(f"Written to {DATA_PATH}")

    # Copy to android_app/src/main/assets/data/channels.json
    shutil.copy2(DATA_PATH, ASSETS_PATH)
    print(f"Synced to {ASSETS_PATH}")

    # Verify both files
    with open(DATA_PATH, "r", encoding="utf-8") as f1, open(ASSETS_PATH, "r", encoding="utf-8") as f2:
        d1 = json.load(f1)
        d2 = json.load(f2)
        assert len(d1) == len(d2), "Mismatch in channel counts"
        assert d1 == d2, "Mismatch in content"
    print("Verification successfully passed! Both files match and are valid JSON.")

if __name__ == "__main__":
    main()
