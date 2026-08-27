import urllib.request
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_m3u(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.read().decode('utf-8')
    except Exception as e:
        return ""

in_m3u = fetch_m3u("https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u")
hin_m3u = fetch_m3u("https://iptv-org.github.io/iptv/languages/hin.m3u")

raw_pool = []
seen_urls = set()

for m3u_text in [hin_m3u, in_m3u]:
    lines = m3u_text.splitlines()
    cur_info = None
    for line in lines:
        if line.startswith('#EXTINF:'):
            cur_info = line
        elif line.startswith('http') and cur_info:
            url = line.strip()
            if url not in seen_urls:
                seen_urls.add(url)
                m_title = re.search(r',(.+)$', cur_info)
                m_logo = re.search(r'tvg-logo="([^"]+)"', cur_info)
                m_grp = re.search(r'group-title="([^"]+)"', cur_info)
                title = m_title.group(1).strip() if m_title else "Channel"
                logo = m_logo.group(1).strip() if m_logo else ""
                grp = m_grp.group(1).strip() if m_grp else "General"
                raw_pool.append({
                    'title': title,
                    'url': url,
                    'logo': logo,
                    'group': grp
                })
            cur_info = None

print(f"Total stream candidates: {len(raw_pool)}", flush=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def test_url(ch):
    try:
        req = urllib.request.Request(ch['url'], headers=headers)
        with urllib.request.urlopen(req, timeout=1.8) as resp:
            if resp.getcode() == 200:
                return ch
    except:
        pass
    return None

verified_list = []
with ThreadPoolExecutor(max_workers=80) as executor:
    futures = [executor.submit(test_url, ch) for ch in raw_pool]
    for f in as_completed(futures):
        res = f.result()
        if res:
            verified_list.append(res)
            if len(verified_list) % 25 == 0:
                print(f"Verified {len(verified_list)} active streams...", flush=True)

print(f"Total 100% verified online streams: {len(verified_list)}", flush=True)

# Build curated channel database
curated = [
    {
        "id": "aajtak-hd",
        "name": "Aaj Tak HD Live",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": "News",
        "quality": "1080p FHD",
        "description": "India's premier 24x7 Hindi national breaking news and prime-time debates.",
        "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
        "backupUrls": [
            "https://live-aajtak.akamaized.net/hls/live/2003835/aajtak/master.m3u8"
        ],
        "isFeatured": True
    },
    {
        "id": "ndtv-india",
        "name": "NDTV India HD",
        "type": "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": "News",
        "quality": "1080p FHD",
        "description": "In-depth investigative reports, prime time news, and national coverage.",
        "url": "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/master.m3u8",
        "backupUrls": [
            "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/live_1080p.m3u8"
        ],
        "isFeatured": True
    },
    {
        "id": "nasa-tv-uhd",
        "name": "NASA TV HD (Space)",
        "type": "tv",
        "country": "US",
        "countryName": "USA",
        "flag": "🇺🇸",
        "category": "Science & Space",
        "quality": "4K UHD / 1080p",
        "description": "Live views from the International Space Station and Artemis rocket launches.",
        "url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
        "backupUrls": [
            "https://nasa-i.akamaihd.net/hls/live/253565/NTV-Media/master.m3u8"
        ],
        "isFeatured": True
    },
    {
        "id": "al-jazeera-en",
        "name": "Al Jazeera World News HD",
        "type": "tv",
        "country": "QA",
        "countryName": "Qatar / Global",
        "flag": "🌐",
        "category": "News",
        "quality": "1080p FHD",
        "description": "Award-winning global breaking news and in-depth investigative reports.",
        "url": "https://live-hls-web-aje.getaj.net/AJE/03.m3u8",
        "backupUrls": [
            "https://live-hls-web-aje.getaj.net/AJE/index.m3u8"
        ],
        "isFeatured": True
    },
    {
        "id": "dw-english",
        "name": "DW News HD (Germany)",
        "type": "tv",
        "country": "DE",
        "countryName": "Germany",
        "flag": "🇩🇪",
        "category": "News",
        "quality": "1080p FHD",
        "description": "Deutsche Welle international broadcast with European perspectives.",
        "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
        "backupUrls": [],
        "isFeatured": True
    },
    {
        "id": "makkah-live-hd",
        "name": "Holy Makkah 24/7 Live HD",
        "type": "tv",
        "country": "SA",
        "countryName": "Saudi Arabia",
        "flag": "🇸🇦",
        "category": "Devotional",
        "quality": "1080p FHD",
        "description": "Continuous 24/7 live HD broadcast from the Grand Mosque in Holy Makkah.",
        "url": "https://win.holymakkah.gov.sa/live/smil:makkah.smil/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True
    },
    {
        "id": "madinah-live-hd",
        "name": "Holy Madinah 24/7 Live HD",
        "type": "tv",
        "country": "SA",
        "countryName": "Saudi Arabia",
        "flag": "🇸🇦",
        "category": "Devotional",
        "quality": "1080p FHD",
        "description": "Continuous 24/7 live HD broadcast from the Prophet's Mosque in Holy Madinah.",
        "url": "https://win.holymakkah.gov.sa/live/smil:madinah.smil/playlist.m3u8",
        "backupUrls": [],
        "isFeatured": True
    },
    {
        "id": "air-vividh-bharati",
        "name": "AIR Vividh Bharati 102.8 FM",
        "type": "radio",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": "Music & Songs",
        "quality": "HD Audio",
        "description": "Evergreen Bollywood golden melodies and classic All India Radio broadcasts.",
        "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8",
        "backupUrls": [],
        "isFeatured": True
    },
    {
        "id": "air-gold-fm",
        "name": "AIR FM Gold Delhi",
        "type": "radio",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": "Music & Songs",
        "quality": "HD Audio",
        "description": "Retro Hindi classics, ghazals, and national news bulletin updates.",
        "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmgold/hlspbaudiofmgold_Auto.m3u8",
        "backupUrls": [],
        "isFeatured": False
    },
    {
        "id": "air-rainbow-fm",
        "name": "AIR FM Rainbow",
        "type": "radio",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": "Music & Songs",
        "quality": "HD Audio",
        "description": "Youth music, contemporary Bollywood hits, and infotainment.",
        "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmrainbow/hlspbaudiofmrainbow_Auto.m3u8",
        "backupUrls": [],
        "isFeatured": False
    }
]

curated_urls = set(c['url'] for c in curated)
idx = 1
for v in verified_list:
    if v['url'] in curated_urls:
        continue
    curated_urls.add(v['url'])
    title = v['title']
    clean_title = re.sub(r'\s*\(\d+p\)', '', title).strip()
    quality = "1080p FHD" if "1080" in title else ("720p HD" if "720" in title else "HD Quality")
    category = "Music & Songs" if ("music" in title.lower() or "music" in v['group'].lower()) else ("News" if "news" in title.lower() else "Entertainment")
    is_radio = "audio" in v['url'] or "radio" in title.lower() or "fm" in title.lower()

    curated.append({
        "id": f"live_ch_{idx}",
        "name": clean_title,
        "type": "radio" if is_radio else "tv",
        "country": "IN",
        "countryName": "India",
        "flag": "🇮🇳",
        "category": category,
        "quality": quality,
        "description": f"Live online broadcast of {clean_title}",
        "url": v['url'],
        "backupUrls": [],
        "isFeatured": False
    })
    idx += 1

print(f"Total curated active channels: {len(curated)}", flush=True)

with open('data/channels.json', 'w') as f:
    json.dump(curated, f, indent=2)

print("Saved data/channels.json successfully!", flush=True)
