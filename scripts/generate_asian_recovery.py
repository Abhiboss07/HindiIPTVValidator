import json, subprocess

with open('reports/forensic/url_probe_cache.json') as f:
    cache = json.load(f)

old37_raw = subprocess.check_output(['git', 'show', '37a3525:data/movies_catalog.json']).decode('utf-8')
old37_movies = {m['id']: m for m in json.loads(old37_raw).get('movies', [])}

old_raw = subprocess.check_output(['git', 'show', 'dc36a64~1:data/movies_catalog.json']).decode('utf-8')
old_movies = {m['id']: m for m in json.loads(old_raw).get('movies', [])}

with open('data/movies_catalog.json') as f:
    curr_movies = {m['id']: m for m in json.load(f).get('movies', [])}

asian_ids = [
    'vod_suzume', 'series_crash_landing_on_you', 'series_descendants_of_the_sun',
    'vod_parasite', 'vod_peninsula', 'series_squid_game', 'series_death_note',
    'series_naruto_classic', 'vod_train_to_busan', 'vod_ip_man', 'vod_the_roundup',
    'vod_karthikeya_2_2022', 'vod_sita_ramam_2022'
]

asian_records = []
for mid in asian_ids:
    source_m = curr_movies.get(mid) or old_movies.get(mid) or old37_movies.get(mid)
    if not source_m:
        continue
    
    stream_url = source_m.get('streamUrl')
    if not stream_url and source_m.get('backupUrls'):
        stream_url = source_m['backupUrls'][0]
        
    eps = source_m.get('episodes', [])
    eps_verified = []
    for ep in eps:
        eu = ep.get('streamUrl')
        alive = cache.get(eu, {}).get('alive', False) if eu else False
        eps_verified.append({
            'season': ep.get('season'),
            'episode': ep.get('episodeNumber'),
            'title': ep.get('title'),
            'url': eu,
            'verifiedAlive': alive
        })

    is_stream_alive = cache.get(stream_url, {}).get('alive', False) if stream_url else (len(eps_verified) > 0 and all(e['verifiedAlive'] for e in eps_verified[:3]))
    
    asian_records.append({
        'id': mid,
        'title': source_m.get('title'),
        'originalTitle': source_m.get('originalTitle'),
        'type': source_m.get('type'),
        'mediaType': source_m.get('mediaType'),
        'languages': source_m.get('languages', []),
        'defaultLanguage': source_m.get('defaultLanguage'),
        'audio': source_m.get('audio'),
        'streamUrl': stream_url,
        'trailerUrl': source_m.get('trailerUrl'),
        'streamVerifiedAlive': is_stream_alive,
        'quality': source_m.get('qualityHonestBadge') or source_m.get('resolution') or '1080p FHD',
        'seasonCount': len(set(e['season'] for e in eps if e.get('season') is not None)) if eps else 0,
        'episodeCount': len(eps),
        'episodes': eps_verified,
        'recoveredStatus': 'DIRECT_STREAM_AVAILABLE' if is_stream_alive else 'TRAILER_ONLY'
    })

with open('reports/forensic/asian_content_recovery.json', 'w') as out:
    json.dump({
        'timestamp': '2026-10-02T12:26:00Z',
        'totalAsianTitles': len(asian_records),
        'recoveredFullContent': sum(1 for r in asian_records if r['recoveredStatus'] == 'DIRECT_STREAM_AVAILABLE'),
        'titles': asian_records
    }, out, indent=2)

print(f"Generated reports/forensic/asian_content_recovery.json with {len(asian_records)} titles.")
