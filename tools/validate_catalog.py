#!/usr/bin/env python3
import json
import os
import sys

def validate_catalog(catalog_path, posters_dir):
    print("=" * 60)
    print("CATALOG VALIDATION REPORT")
    print("=" * 60)
    
    if not os.path.exists(catalog_path):
        print(f"FATAL: Catalog file not found at {catalog_path}")
        return 1

    with open(catalog_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    movies = data.get('movies', [])
    
    total_movies = 0
    total_series = 0
    total_episodes = 0
    total_trailers = 0
    
    errors = []
    warnings = []
    
    seen_content_ids = set()
    seen_episode_ids = set()
    stream_url_map = {}
    trailer_url_map = {}
    
    for idx, item in enumerate(movies):
        cid = item.get('id')
        title = item.get('title')
        ctype = item.get('contentType')
        media_type = item.get('mediaType', 'movie')
        stream_url = item.get('streamUrl')
        trailer_url = item.get('trailerUrl')
        poster_url = item.get('posterUrl')
        torrent_uri = item.get('torrentUri')
        genres = item.get('genres', [])
        region = item.get('region')
        
        # 1. Content ID checks
        if not cid:
            errors.append(f"Item #{idx} has missing 'id'")
        elif cid in seen_content_ids:
            errors.append(f"Duplicate content ID: {cid}")
        else:
            seen_content_ids.add(cid)
            
        # 2. Title check
        if not title or not title.strip():
            errors.append(f"Item '{cid}' has missing or empty title")
            
        # 3. Content Type check
        if not ctype:
            errors.append(f"Item '{cid}' ({title}) has missing contentType")
            
        if ctype == 'MOVIE' or media_type == 'movie':
            total_movies += 1
        elif ctype == 'SERIES' or media_type == 'series':
            total_series += 1
            
        if trailer_url:
            total_trailers += 1
            
        # 4. Poster validation
        if not poster_url:
            warnings.append(f"Item '{cid}' ({title}) has missing posterUrl")
        else:
            poster_clean = poster_url.replace('assets/posters/', '')
            local_poster_path = os.path.join(posters_dir, poster_clean)
            if not os.path.exists(local_poster_path):
                warnings.append(f"Item '{cid}' poster not found locally: {local_poster_path}")
                
        # 5. Cross-content Stream URL Reuse & Trailer Check
        if stream_url:
            if stream_url in stream_url_map:
                errors.append(f"Cross-content streamUrl reuse: '{cid}' shares URL with '{stream_url_map[stream_url]}': {stream_url}")
            else:
                stream_url_map[stream_url] = cid
                
            if "trailer" in stream_url.lower() or "teaser" in stream_url.lower():
                errors.append(f"Item '{cid}' ({title}) has trailer assigned as primary streamUrl: {stream_url}")
                
        # 6. Trailer URL validation
        if trailer_url:
            if trailer_url in trailer_url_map:
                errors.append(f"Cross-content trailerUrl reuse: '{cid}' shares trailer with '{trailer_url_map[trailer_url]}': {trailer_url}")
            else:
                trailer_url_map[trailer_url] = cid

        # 6b. Backup URLs validation
        backup_urls = item.get('backupUrls', [])
        for b_url in backup_urls:
            if not b_url:
                continue
            if b_url in stream_url_map and stream_url_map[b_url] != cid:
                errors.append(f"Cross-content backupUrl reuse: '{cid}' shares backup with '{stream_url_map[b_url]}': {b_url}")
            if "trailer" in b_url.lower() or "teaser" in b_url.lower():
                errors.append(f"Item '{cid}' ({title}) has trailer in backupUrls: {b_url}")
                
        # 7. Series & Episodes Architecture validation
        if ctype == 'SERIES' or media_type == 'series':
            seasons = item.get('seasons', [])
            if not seasons and not item.get('episodes'):
                warnings.append(f"Series '{cid}' has neither seasons nor episodes")
                
            for s_idx, season in enumerate(seasons):
                s_num = season.get('seasonNumber')
                if s_num is None:
                    errors.append(f"Series '{cid}' season #{s_idx} missing seasonNumber")
                    
                eps = season.get('episodes', [])
                last_ep_num = 0
                for e_idx, ep in enumerate(eps):
                    total_episodes += 1
                    eid = ep.get('id')
                    ep_num = ep.get('episodeNumber')
                    
                    if not eid:
                        errors.append(f"Series '{cid}' S{s_num} episode #{e_idx} missing 'id'")
                    elif eid in seen_episode_ids:
                        errors.append(f"Duplicate episode ID: {eid} in series '{cid}'")
                    else:
                        seen_episode_ids.add(eid)
                        
                    if ep_num is None:
                        errors.append(f"Series '{cid}' episode '{eid}' missing episodeNumber")
                    else:
                        try:
                            int_ep = int(ep_num)
                            if int_ep < last_ep_num:
                                warnings.append(f"Series '{cid}' S{s_num} episodes not sorted ASC: {last_ep_num} then {int_ep}")
                            last_ep_num = int_ep
                        except ValueError:
                            errors.append(f"Series '{cid}' episode '{eid}' has non-integer episodeNumber: {ep_num}")

    print()
    print(f"Total Titles:  {len(movies)}")
    print(f"  Movies:      {total_movies}")
    print(f"  Series:      {total_series}")
    print(f"  Episodes:    {total_episodes}")
    print(f"  Trailers:    {total_trailers}")
    print()
    print(f"Validation Result:")
    print(f"  Errors:      {len(errors)}")
    print(f"  Warnings:    {len(warnings)}")
    print()
    
    if errors:
        print("❌ CRITICAL ERRORS:")
        for e in errors:
            print(f"  - {e}")
            
    if warnings:
        print("⚠️ WARNINGS:")
        for w in warnings:
            print(f"  - {w}")
            
    if not errors and not warnings:
        print("✅ CATALOG VALIDATION PASSED WITH 0 ERRORS AND 0 WARNINGS!")
    elif not errors:
        print("✅ CATALOG VALIDATION PASSED (0 Critical Errors)!")
        
    return len(errors)

if __name__ == '__main__':
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cat = os.path.join(base, 'data', 'movies_catalog.json')
    posters = os.path.join(base, 'assets', 'posters')
    code = validate_catalog(cat, posters)
    sys.exit(code)
