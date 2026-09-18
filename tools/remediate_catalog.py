#!/usr/bin/env python3
import os
import sys
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, REPO_ROOT)

import json
import re
import urllib.parse
import urllib.request
import time
from tools.stream_validator.youtube_validator import YouTubeValidator

CATALOG_PATH = os.path.join(REPO_ROOT, 'data', 'movies_catalog.json')

def update_sherlock_holmes(catalog):
    base_archive = 'https://archive.org/download/granada-holmes/The%20Adventures%20Of%20Sherlock%20Holmes%20Season%201%20to%207%20Mp4%201080p/'
    
    seasons_data = [
        {
            "seasonNumber": 1,
            "title": "Season 1 (1984) • The Adventures of Sherlock Holmes",
            "episodes": [
                ("A Scandal in Bohemia", "54m", "Season 1/Sherlock Holmes S01E01 A Scandal In Bohemia.mp4"),
                ("The Dancing Men", "52m", "Season 1/Sherlock Holmes S01E02 The Dancing Men.mp4"),
                ("The Naval Treaty", "53m", "Season 1/Sherlock Holmes S01E03 The Naval Treaty.mp4"),
                ("The Solitary Cyclist", "52m", "Season 1/Sherlock Holmes S01E04 The Solitary Cyclist.mp4"),
                ("The Crooked Man", "51m", "Season 1/Sherlock Holmes S01E05 The Crooked Man.mp4"),
                ("The Speckled Band", "54m", "Season 1/Sherlock Holmes S01E06 The Speckled Band.mp4"),
                ("The Blue Carbuncle", "52m", "Season 1/Sherlock Holmes S01E07 The Blue Carbuncle.mp4")
            ]
        },
        {
            "seasonNumber": 2,
            "title": "Season 2 (1985) • The Adventures of Sherlock Holmes",
            "episodes": [
                ("The Copper Beeches", "53m", "Season 2/Sherlock Holmes S02E01 The Copper Beeches.mp4"),
                ("The Greek Interpreter", "51m", "Season 2/Sherlock Holmes S02E02 The Greek Interpreter.mp4"),
                ("The Norwood Builder", "52m", "Season 2/Sherlock Holmes S02E03 The Norwood Builder.mp4"),
                ("The Resident Patient", "52m", "Season 2/Sherlock Holmes S02E04 The Resident Patient.mp4"),
                ("The Red-Headed League", "53m", "Season 2/Sherlock Holmes S02E05 The Red Headed League.mp4"),
                ("The Final Problem", "55m", "Season 2/Sherlock Holmes S02E06 The Final Problem.mp4")
            ]
        },
        {
            "seasonNumber": 3,
            "title": "Season 3 (1986) • The Return of Sherlock Holmes",
            "episodes": [
                ("The Empty House", "52m", "Season 3/Sherlock Holmes S03E01 The Empty House.mp4"),
                ("The Abbey Grange", "51m", "Season 3/Sherlock Holmes S03E02 The Abbey Grange.mp4"),
                ("The Musgrave Ritual", "52m", "Season 3/Sherlock Holmes S03E03 The Musgrave Ritual.mp4"),
                ("The Second Stain", "52m", "Season 3/Sherlock Holmes S03E04 The Second Stain.mp4"),
                ("The Man with the Twisted Lip", "52m", "Season 3/Sherlock Holmes S03E05 The Man With The Twisted Lip.mp4"),
                ("The Priory School", "52m", "Season 3/Sherlock Holmes S03E06 The Priory School.mp4"),
                ("The Six Napoleons", "52m", "Season 3/Sherlock Holmes S03E07 The Six Napoleons.mp4")
            ]
        },
        {
            "seasonNumber": 4,
            "title": "Season 4 (1988) • The Return of Sherlock Holmes",
            "episodes": [
                ("The Sign of Four", "104m", "Season 4/Sherlock Holmes S04E01 The Sign Of Four.mp4"),
                ("The Devil's Foot", "52m", "Season 4/Sherlock Holmes S04E02 The Devils Foot.mp4"),
                ("Silver Blaze", "52m", "Season 4/Sherlock Holmes S04E03 Silver Blaze.mp4"),
                ("Wisteria Lodge", "52m", "Season 4/Sherlock Holmes S04E04 Wisteria Lodge.mp4"),
                ("The Bruce-Partington Plans", "52m", "Season 4/Sherlock Holmes S04E05 The Bruce Partington Plans.mp4"),
                ("The Hound of the Baskervilles", "104m", "Season 4/Sherlock Holmes S04E06 The Hound Of The Baskervilles.mp4")
            ]
        }
    ]

    new_seasons = []
    flat_episodes = []

    for s in seasons_data:
        s_num = s["seasonNumber"]
        s_title = s["title"]
        ep_list = []
        for e_num, (ep_title, dur, rel_path) in enumerate(s["episodes"], start=1):
            ep_id = f"sherlock_s{s_num}e{e_num}"
            full_title = f"S{s_num:02d}:E{e_num:02d} • {ep_title}"
            encoded_path = urllib.parse.quote(rel_path)
            stream_url = base_archive + encoded_path
            ep_obj = {
                "id": ep_id,
                "episodeNumber": e_num,
                "season": s_num,
                "title": full_title,
                "duration": dur,
                "streamUrl": stream_url,
                "sourceState": "DIRECT_STREAM_AVAILABLE",
                "qualityHonestBadge": "1080p Full HD"
            }
            ep_list.append(ep_obj)
            flat_episodes.append(ep_obj)
        
        new_seasons.append({
            "seasonNumber": s_num,
            "title": s_title,
            "episodes": ep_list
        })

    for item in catalog.get('movies', []):
        if item.get('id') == 'series_sherlock_holmes':
            item['durationFormatted'] = f"4 Seasons • {len(flat_episodes)} Episodes"
            item['seasons'] = new_seasons
            item['episodes'] = flat_episodes
            print(f"✅ Updated series_sherlock_holmes with 4 seasons and {len(flat_episodes)} episodes.")
            break

def search_youtube_video(query):
    try:
        url = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote_plus(query)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req, timeout=6) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            vids = re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)
            seen = set()
            out = []
            for v in vids:
                if v not in seen:
                    seen.add(v)
                    out.append(v)
            return out
    except Exception as e:
        return []

def remediate():
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # 1. Update Sherlock Holmes
    update_sherlock_holmes(catalog)

    # 2. Fix broken trailers
    yt_val = YouTubeValidator(timeout_sec=5.0)

    fixed_count = 0
    cleared_count = 0

    for item in catalog.get('movies', []):
        item_id = item.get('id', '')
        tr_url = item.get('trailerUrl')
        title = item.get('title', '')

        if tr_url and ('youtube' in tr_url or 'youtu.be' in tr_url):
            res = yt_val.validate(tr_url)
            if not res.is_available:
                print(f"Trailer broken for {title} ({item_id}): {tr_url}")
                query = f"{title} official trailer"
                candidates = search_youtube_video(query)
                found = False
                for cid in candidates[:6]:
                    test_res = yt_val.validate(f"https://www.youtube.com/watch?v={cid}")
                    if test_res.is_available and test_res.title:
                        # Check title relevance
                        norm_t = re.sub(r'[^a-zA-Z0-9]', '', title.lower())
                        norm_yt = re.sub(r'[^a-zA-Z0-9]', '', test_res.title.lower())
                        # If at least some key words match
                        first_word = title.lower().split()[0]
                        if first_word in test_res.title.lower():
                            new_url = f"https://www.youtube-nocookie.com/embed/{cid}"
                            item['trailerUrl'] = new_url
                            print(f"   --> Replaced with verified trailer: {new_url} ({test_res.title})")
                            fixed_count += 1
                            found = True
                            break
                if not found:
                    item['trailerUrl'] = None
                    if item.get('sourceState') == 'TRAILER_ONLY':
                        item['sourceState'] = 'NO_AUTHORIZED_SOURCE'
                    print(f"   --> Cleared broken trailer URL for {title}")
                    cleared_count += 1

    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"\nRemediation Complete! Fixed/Replaced: {fixed_count}, Cleared invalid: {cleared_count}")

if __name__ == '__main__':
    remediate()
