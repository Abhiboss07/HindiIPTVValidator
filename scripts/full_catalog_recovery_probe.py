import json
import urllib.request
import urllib.error
import urllib.parse
import socket
import time
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

USER_AGENT = "Mozilla/5.0 (Linux; Android 16; Nothing Phone 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
socket.setdefaulttimeout(12)

def probe_url(url):
    if not url:
        return {'alive': False, 'status': 0, 'reason': 'EMPTY', 'resolved_url': None, 'content_type': None}
    
    if 'youtube.com' in url or 'youtu.be' in url:
        return {'alive': True, 'status': 200, 'reason': 'YOUTUBE_EMBED', 'resolved_url': url, 'content_type': 'video/embed'}
    
    req = urllib.request.Request(url, headers={
        'User-Agent': USER_AGENT,
        'Range': 'bytes=0-1024'
    })
    
    # Retry up to 2 times for transient network hiccups
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = resp.status
                ctype = resp.headers.get('Content-Type', '')
                final_url = resp.geturl()
                if status in [200, 206, 302]:
                    return {'alive': True, 'status': status, 'reason': 'OK', 'resolved_url': final_url, 'content_type': ctype}
                return {'alive': False, 'status': status, 'reason': f'HTTP_{status}', 'resolved_url': final_url, 'content_type': ctype}
        except urllib.error.HTTPError as e:
            if e.code in [200, 206]:
                return {'alive': True, 'status': e.code, 'reason': 'OK', 'resolved_url': e.geturl(), 'content_type': e.headers.get('Content-Type')}
            is_temp = e.code in [429, 500, 502, 503, 504]
            if is_temp and attempt == 0:
                time.sleep(1)
                continue
            return {'alive': False, 'status': e.code, 'reason': 'TEMP_ERROR' if is_temp else f'HTTP_{e.code}', 'resolved_url': None, 'content_type': None}
        except Exception as ex:
            if attempt == 0:
                time.sleep(1)
                continue
            return {'alive': False, 'status': 0, 'reason': str(ex)[:40], 'resolved_url': None, 'content_type': None}
            
    return {'alive': False, 'status': 0, 'reason': 'FAILED_RETRIES', 'resolved_url': None, 'content_type': None}

def main():
    print("Loading current catalog and previous commit catalogs...")
    with open('data/movies_catalog.json') as f:
        curr_data = json.load(f)
    curr_movies = curr_data.get('movies', [])
    
    old_raw = subprocess.check_output(['git', 'show', 'dc36a64~1:data/movies_catalog.json']).decode('utf-8')
    old_movies = {m['id']: m for m in json.loads(old_raw).get('movies', [])}

    old37_raw = subprocess.check_output(['git', 'show', '37a3525:data/movies_catalog.json']).decode('utf-8')
    old37_movies = {m['id']: m for m in json.loads(old37_raw).get('movies', [])}

    # Collect unique URLs to test
    urls_to_test = set()
    url_targets = {} # url -> list of (item_id, kind)
    
    # 1. Test backupUrls of current movies
    for m in curr_movies:
        mid = m['id']
        for b in m.get('backupUrls', []):
            if b:
                urls_to_test.add(b)
                url_targets.setdefault(b, []).append((mid, 'current_backup'))
        if m.get('streamUrl'):
            urls_to_test.add(m['streamUrl'])
            url_targets.setdefault(m['streamUrl'], []).append((mid, 'current_stream'))
            
    # 2. Test streamUrls of old movies
    for mid, om in old_movies.items():
        s = om.get('streamUrl')
        if s:
            urls_to_test.add(s)
            url_targets.setdefault(s, []).append((mid, 'old_stream'))
        for ep in om.get('episodes', []):
            es = ep.get('streamUrl')
            if es:
                urls_to_test.add(es)
                url_targets.setdefault(es, []).append((f"{mid}::ep::{ep.get('id')}", 'old_ep_stream'))
                
    # 3. Test Asian/K-Drama series from 37a3525
    for mid in ['series_crash_landing_on_you', 'series_descendants_of_the_sun', 'vod_parasite']:
        if mid in old37_movies:
            m = old37_movies[mid]
            if m.get('streamUrl'):
                urls_to_test.add(m['streamUrl'])
                url_targets.setdefault(m['streamUrl'], []).append((mid, 'old37_stream'))
            for ep in m.get('episodes', []):
                es = ep.get('streamUrl')
                if es:
                    urls_to_test.add(es)
                    url_targets.setdefault(es, []).append((f"{mid}::ep::{ep.get('id')}", 'old37_ep'))

    print(f"Total unique URLs to probe concurrently: {len(urls_to_test)}")
    
    probe_results = {}
    completed = 0
    with ThreadPoolExecutor(max_workers=25) as executor:
        future_map = {executor.submit(probe_url, u): u for u in urls_to_test}
        for future in as_completed(future_map):
            u = future_map[future]
            try:
                res = future.result()
            except Exception as e:
                res = {'alive': False, 'status': 0, 'reason': str(e), 'resolved_url': None, 'content_type': None}
            probe_results[u] = res
            completed += 1
            if completed % 25 == 0 or completed == len(urls_to_test):
                print(f"Progress: {completed}/{len(urls_to_test)} probed...")

    alive_count = sum(1 for res in probe_results.values() if res['alive'])
    print(f"\nProbe complete! Alive URLs: {alive_count} / {len(urls_to_test)}")
    
    with open('reports/forensic/url_probe_cache.json', 'w') as out:
        json.dump(probe_results, out, indent=2)
    print("Saved cache to reports/forensic/url_probe_cache.json")

if __name__ == '__main__':
    main()
