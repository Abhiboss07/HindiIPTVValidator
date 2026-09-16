#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
import ssl

def run_health_check():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    catalog_path = os.path.join(repo_root, 'data', 'movies_catalog.json')

    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    movies = catalog.get('movies', [])
    series_list = [m for m in movies if m.get('mediaType') == 'series' or m.get('contentType') == 'SERIES']

    total_series = len(series_list)
    total_seasons = 0
    total_episodes = 0
    episodes_with_source = 0
    episodes_no_source = 0
    reachable_sources = 0
    unreachable_sources = 0
    duplicate_ep_ids = 0
    seen_ep_ids = set()
    broken_thumbnails = 0

    print("=" * 80)
    print("           T2L WEB-SERIES HEALTH CHECK & EPISODE VALIDATION MATRIX           ")
    print("=" * 80)

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for s in series_list:
        sid = s.get('id')
        title = s.get('title')
        poster = s.get('posterUrl')
        if poster:
            clean_p = poster.replace('assets/posters/', '')
            p_path = os.path.join(repo_root, 'assets', 'posters', clean_p)
            if not os.path.exists(p_path) or os.path.getsize(p_path) == 0:
                broken_thumbnails += 1

        seasons = s.get('seasons', [])
        total_seasons += len(seasons)

        print(f"\nSERIES: {title} (ID: {sid}) | Seasons: {len(seasons)} | State: {s.get('sourceState')}")
        print("-" * 80)

        for season in seasons:
            s_num = season.get('seasonNumber')
            s_title = season.get('title', f"Season {s_num}")
            eps = season.get('episodes', [])
            print(f"  SEASON {s_num}: {s_title} ({len(eps)} episodes)")

            for ep in eps:
                total_episodes += 1
                eid = ep.get('id')
                enum = ep.get('episodeNumber')
                etitle = ep.get('title')
                src = ep.get('streamUrl')
                state = ep.get('sourceState', 'NO_AUTHORIZED_SOURCE')

                # Duplicate check
                if eid in seen_ep_ids:
                    duplicate_ep_ids += 1
                    dup_tag = " [DUPLICATE ID]"
                else:
                    seen_ep_ids.add(eid)
                    dup_tag = ""

                # Source reachability test
                if src:
                    episodes_with_source += 1
                    try:
                        req = urllib.request.Request(src, headers={'User-Agent': 'T2L-Validator/1.0', 'Range': 'bytes=0-1024'})
                        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
                            code = resp.getcode()
                            c_type = resp.headers.get('Content-Type', '')
                            if code in (200, 206) or (code == 302 and 'archive.org' in src):
                                status_str = "SOURCE OK | PLAYABLE"
                                reachable_sources += 1
                            else:
                                status_str = f"SOURCE HTTP {code}"
                                unreachable_sources += 1
                    except Exception as ex:
                        status_str = f"SOURCE FAIL | {str(ex)[:25]}"
                        unreachable_sources += 1
                else:
                    episodes_no_source += 1
                    if state == 'TORRENT_SOURCE_AVAILABLE' or s.get('torrentUri'):
                        status_str = "TORRENT SOURCE (PEER-DEPENDENT)"
                    else:
                        status_str = "NO AUTHORIZED SOURCE (HONEST UNAVAILABLE)"

                print(f"    E{enum:02d} | PRESENT | {status_str} | {etitle}{dup_tag}")

    print("\n" + "=" * 80)
    print("                         SUMMARY STATISTICS                                  ")
    print("=" * 80)
    print(f"Total Series:              {total_series}")
    print(f"Total Seasons:             {total_seasons}")
    print(f"Total Catalog Episodes:    {total_episodes}")
    print(f"Duplicate Episode IDs:     {duplicate_ep_ids}")
    print(f"Episodes With Direct URL:  {episodes_with_source}")
    print(f"  Reachable / Playable:    {reachable_sources}")
    print(f"  Unreachable / Failed:    {unreachable_sources}")
    print(f"Episodes With No Source:   {episodes_no_source}")
    print(f"Broken Thumbnails:         {broken_thumbnails}")
    print("=" * 80)

if __name__ == '__main__':
    run_health_check()
