#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import urllib.parse
import re
import socket
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
socket.setdefaulttimeout(8)

def extract_yt_id(url):
    if not url:
        return None
    m = re.search(r'(?:embed/|watch\?v=|youtu\.be/|vi/)([a-zA-Z0-9_-]{11})', url)
    return m.group(1) if m else None

def parse_archive_url(url):
    if not url or 'archive.org' not in url:
        return None, None
    m = re.search(r'archive\.org/(?:download|0/items|items)/([^/]+)/(.+)', url)
    if m:
        item = m.group(1)
        filename = m.group(2).split('?')[0]
        return item, urllib.parse.unquote(filename)
    m2 = re.search(r'archive\.org/(?:details|metadata)/([^/]+)', url)
    if m2:
        return m2.group(1), None
    return None, None

def check_youtube(video_id):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            return (True, resp.status, "YouTube Alive")
    except urllib.error.HTTPError as e:
        return (False, e.code, f"YouTube HTTP {e.code}")
    except Exception as e:
        return (False, 0, f"YouTube Err: {str(e)[:40]}")

archive_cache = {}

def check_archive_item(item_id, filename=None):
    if item_id not in archive_cache:
        url = f"https://archive.org/metadata/{item_id}"
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=6) as resp:
                meta = json.load(resp)
                if not meta or 'files' not in meta:
                    archive_cache[item_id] = (False, meta.get('error', 'Item Not Found'), set(), None)
                else:
                    files = {f.get('name') for f in meta.get('files', []) if f.get('name')}
                    server = meta.get('server')
                    archive_cache[item_id] = (True, 'OK', files, server)
        except urllib.error.HTTPError as e:
            archive_cache[item_id] = (False, f"HTTP {e.code}", set(), None)
        except Exception as e:
            archive_cache[item_id] = (False, str(e)[:40], set(), None)

    alive, msg, files, server = archive_cache[item_id]
    if not alive:
        return (False, msg)
    if filename:
        # Check if filename is in files
        if filename in files or any(f.endswith(filename) or filename.endswith(f) for f in files):
            return (True, f"File Found on {server}")
        else:
            return (False, f"File {filename} not in item files (has {len(files)} files)")
    return (True, f"Item exists on {server}")

def check_generic_http(url):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Range': 'bytes=0-100'})
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            if resp.status in [200, 206, 302]:
                return (True, resp.status, f"HTTP {resp.status}")
            return (False, resp.status, f"HTTP {resp.status}")
    except urllib.error.HTTPError as e:
        return (False, e.code, f"HTTP {e.code}")
    except Exception as e:
        return (False, 0, f"HTTP Err: {str(e)[:40]}")

def check_url(url):
    if not url:
        return (False, "EMPTY_URL")
    yt = extract_yt_id(url)
    if yt:
        ok, code, msg = check_youtube(yt)
        return (ok, msg)
    item_id, filename = parse_archive_url(url)
    if item_id:
        ok, msg = check_archive_item(item_id, filename)
        if ok:
            return (True, msg)
        else:
            # Fallback to direct HTTP check in case metadata structure differed
            ok_h, code, msg_h = check_generic_http(url)
            if ok_h:
                return (True, f"Direct HTTP OK ({msg_h})")
            return (False, msg)
    ok_h, code, msg_h = check_generic_http(url)
    return (ok_h, msg_h)

def main():
    with open('data/movies_catalog.json') as f:
        catalog = json.load(f)

    movies = catalog.get('movies', [])
    print(f"Total catalog entries: {len(movies)}")

    # Collect URLs
    url_tasks = {} # url -> list of (item_id, field)
    for m in movies:
        mid = m['id']
        s_url = m.get('streamUrl')
        if s_url:
            url_tasks.setdefault(s_url, []).append((mid, 'streamUrl'))
        t_url = m.get('trailerUrl')
        if t_url:
            url_tasks.setdefault(t_url, []).append((mid, 'trailerUrl'))
        for ep in m.get('episodes', []):
            ep_url = ep.get('streamUrl')
            if ep_url:
                url_tasks.setdefault(ep_url, []).append((f"{mid}::ep::{ep.get('id')}", 'epStreamUrl'))

    print(f"Total unique URLs to test: {len(url_tasks)}")

    results = {}
    done_count = 0
    with ThreadPoolExecutor(max_workers=20) as executor:
        future_map = {executor.submit(check_url, u): u for u in url_tasks}
        for future in as_completed(future_map):
            u = future_map[future]
            try:
                ok, msg = future.result()
            except Exception as e:
                ok, msg = False, str(e)
            results[u] = (ok, msg)
            done_count += 1
            if done_count % 50 == 0 or done_count == len(url_tasks):
                print(f"Progress: {done_count}/{len(url_tasks)} probed...")

    # Analyze dead URLs
    dead_urls = {u: res for u, res in results.items() if not res[0]}
    print(f"\n================ AUDIT SUMMARY ================")
    print(f"Unique URLs probed: {len(url_tasks)}")
    print(f"Working URLs: {len(url_tasks) - len(dead_urls)}")
    print(f"Dead URLs: {len(dead_urls)}")
    print(f"===============================================\n")

    with open('audit_dead_urls.json', 'w') as out:
        out_data = []
        for u, (ok, msg) in dead_urls.items():
            refs = url_tasks[u]
            out_data.append({
                'url': u,
                'status': msg,
                'references': refs
            })
            print(f"[DEAD] {msg} -> {u}")
            for r in refs:
                print(f"   Ref: {r[0]} ({r[1]})")
        json.dump(out_data, out, indent=2)

if __name__ == '__main__':
    main()
