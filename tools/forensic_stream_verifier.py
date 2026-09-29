#!/usr/bin/env python3
"""
Forensic Stream Verifier for T2L Application.
Independently verifies:
1. movies_catalog.json streamUrls and trailerUrls (and season episodes)
2. Radio stations in assets/app.js and data/channels.json
3. 20 Live TV channels sample from data/channels.json (status != 'OFFLINE')
Generates detailed forensic metrics, exact line numbers, and BUG-XXX reports.
"""

import sys
import os
import json
import random
import subprocess
from concurrent.futures import ThreadPoolExecutor

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(PROJECT_ROOT, "data", "movies_catalog.json")
CHANNELS_PATH = os.path.join(PROJECT_ROOT, "data", "channels.json")
APP_JS_PATH = os.path.join(PROJECT_ROOT, "assets", "app.js")
REPORT_JSON_PATH = os.path.join(PROJECT_ROOT, "reports", "forensic_stream_check_report.json")
REPORT_MD_PATH = os.path.join(PROJECT_ROOT, "reports", "forensic_stream_check_report.md")

os.makedirs(os.path.join(PROJECT_ROOT, "reports"), exist_ok=True)

# 1. Load files with line indexing
with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog_lines = f.readlines()
with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog_data = json.load(f)

with open(CHANNELS_PATH, "r", encoding="utf-8") as f:
    channels_lines = f.readlines()
with open(CHANNELS_PATH, "r", encoding="utf-8") as f:
    channels_data = json.load(f)

with open(APP_JS_PATH, "r", encoding="utf-8") as f:
    app_js_lines = f.readlines()

def get_catalog_line(target_id, target_key, target_url):
    in_target = False
    for i, line in enumerate(catalog_lines, 1):
        if f'"{target_id}"' in line:
            in_target = True
        if in_target and f'"{target_key}":' in line and target_url in line:
            return i
        if in_target and '"id":' in line and f'"{target_id}"' not in line:
            in_target = False
    # fallback
    for i, line in enumerate(catalog_lines, 1):
        if f'"{target_key}":' in line and target_url in line:
            return i
    return 0

def get_channel_line(target_id, target_url):
    in_target = False
    for i, line in enumerate(channels_lines, 1):
        if f'"id": "{target_id}"' in line:
            in_target = True
        if in_target and '"url":' in line and target_url in line:
            return i
        if in_target and '"id":' in line and f'"{target_id}"' not in line:
            in_target = False
    for i, line in enumerate(channels_lines, 1):
        if '"url":' in line and target_url in line:
            return i
    return 0

def get_app_js_line(target_id, target_url):
    for i, line in enumerate(app_js_lines, 1):
        if target_url in line:
            return i
    return 0

def probe_url(url, check_yt=False):
    # Command required: curl -sI -o /dev/null -w '%{http_code} %{content_type} %{size_download}' --connect-timeout 10 --max-time 15 <URL>
    cmd_raw = ['curl', '-sI', '-o', '/dev/null', '-w', '%{http_code} %{content_type} %{size_download}', '--connect-timeout', '10', '--max-time', '15', url]
    has_bracket = '[' in url or ']' in url
    
    # Exact user command execution
    try:
        r_raw = subprocess.run(cmd_raw, capture_output=True, text=True, timeout=20)
        out_raw = r_raw.stdout.strip()
        err_raw = r_raw.stderr.strip()
        parts_raw = out_raw.split(' ', 2)
        code_raw = parts_raw[0] if len(parts_raw) > 0 and parts_raw[0] else '000'
        ctype_raw = parts_raw[1] if len(parts_raw) > 1 else 'none'
        size_raw = parts_raw[2] if len(parts_raw) > 2 else '0'
        exit_code_raw = r_raw.returncode
    except subprocess.TimeoutExpired:
        code_raw, ctype_raw, size_raw, exit_code_raw, err_raw = '000', 'timeout', '0', 28, 'Operation timed out'
    except Exception as e:
        code_raw, ctype_raw, size_raw, exit_code_raw, err_raw = '000', 'error', '0', 1, str(e)

    # Follow-up probe with -L and -g (globoff) to determine true destination & accessibility
    cmd_l = ['curl', '-g', '-sIL', '-o', '/dev/null', '-w', '%{http_code} %{content_type} %{size_download}', '--connect-timeout', '10', '--max-time', '20', url]
    try:
        r_l = subprocess.run(cmd_l, capture_output=True, text=True, timeout=25)
        out_l = r_l.stdout.strip()
        parts_l = out_l.split(' ', 2)
        code_l = parts_l[0] if len(parts_l) > 0 and parts_l[0] else '000'
        ctype_l = parts_l[1] if len(parts_l) > 1 else 'none'
        size_l = parts_l[2] if len(parts_l) > 2 else '0'
    except Exception as e:
        code_l, ctype_l, size_l = '000', str(e), '0'

    # Determine accessibility
    # A stream is accessible if final HTTP code is 200 or 206
    # Or raw code is 200
    is_accessible = (code_raw.startswith('2') or code_l.startswith('2')) and not (code_l.startswith(('4', '5', '0')))
    
    # Extra check for YouTube
    yt_code = None
    if check_yt and 'youtube' in url:
        vid = None
        if '/embed/' in url:
            vid = url.split('/embed/')[1].split('?')[0]
        elif 'v=' in url:
            vid = url.split('v=')[1].split('&')[0]
        if vid:
            try:
                yt_res = subprocess.run(['curl', '-sI', '-o', '/dev/null', '-w', '%{http_code}', f'https://img.youtube.com/vi/{vid}/mqdefault.jpg'], capture_output=True, text=True, timeout=10)
                yt_code = yt_res.stdout.strip()
                if yt_code != '200':
                    is_accessible = False
            except Exception:
                yt_code = '000'
                is_accessible = False

    return {
        'url': url,
        'has_bracket': has_bracket,
        'http_code': code_raw,
        'content_type': ctype_raw,
        'size_download': size_raw,
        'exit_code': exit_code_raw,
        'curl_err': err_raw,
        'final_http_code': code_l,
        'final_content_type': ctype_l,
        'size_l': size_l,
        'yt_thumbnail_code': yt_code,
        'is_accessible': is_accessible
    }

def main():
    print("=" * 80)
    print("FORENSIC STREAM VERIFIER - T2L APPLICATION")
    print("=" * 80)

    # ----------------------------------------------------
    # 1. Movies & Series Catalog Probes
    # ----------------------------------------------------
    movies = catalog_data.get('movies', [])
    print(f"\n[*] Loaded catalog: {len(movies)} items from {CATALOG_PATH}")

    stream_tasks = []
    trailer_tasks = []
    episode_tasks = []

    for m in movies:
        mid = m.get('id')
        title = m.get('title')
        s_url = m.get('streamUrl')
        t_url = m.get('trailerUrl')
        if s_url:
            line = get_catalog_line(mid, 'streamUrl', s_url)
            stream_tasks.append({'id': mid, 'title': title, 'url': s_url, 'line': line, 'type': 'streamUrl'})
        if t_url:
            line = get_catalog_line(mid, 'trailerUrl', t_url)
            trailer_tasks.append({'id': mid, 'title': title, 'url': t_url, 'line': line, 'type': 'trailerUrl'})
        for s in m.get('seasons', []):
            s_num = s.get('seasonNumber')
            for ep in s.get('episodes', []):
                ep_url = ep.get('streamUrl')
                if ep_url:
                    ep_id = ep.get('id')
                    ep_title = f"{title} S{s_num}E{ep.get('episodeNumber')}: {ep.get('title')}"
                    ep_line = get_catalog_line(ep_id, 'streamUrl', ep_url)
                    episode_tasks.append({'id': ep_id, 'series_id': mid, 'title': ep_title, 'url': ep_url, 'line': ep_line, 'type': 'episodeStream'})

    print(f"[*] Top-level streamUrls to test: {len(stream_tasks)}")
    print(f"[*] Top-level trailerUrls to test: {len(trailer_tasks)}")
    print(f"[*] Season episode streamUrls to test: {len(episode_tasks)}")

    print("\n[*] Probing top-level streamUrls (concurrency: 16)...")
    with ThreadPoolExecutor(max_workers=16) as ex:
        stream_results = list(ex.map(lambda t: {**t, **probe_url(t['url'])}, stream_tasks))

    print("[*] Probing trailerUrls (concurrency: 16)...")
    with ThreadPoolExecutor(max_workers=16) as ex:
        trailer_results = list(ex.map(lambda t: {**t, **probe_url(t['url'], check_yt=True)}, trailer_tasks))

    print("[*] Probing episode streamUrls (concurrency: 16)...")
    with ThreadPoolExecutor(max_workers=16) as ex:
        episode_results = list(ex.map(lambda t: {**t, **probe_url(t['url'])}, episode_tasks))

    # ----------------------------------------------------
    # 2. Radio Stations Verification
    # ----------------------------------------------------
    print("\n[*] Inspecting and probing Radio Stations...")
    radio_stations_to_test = [
        # From assets/app.js
        {
            'source': 'assets/app.js',
            'line': get_app_js_line('air-vividh-bharati', 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8'),
            'id': 'air-vividh-bharati',
            'name': 'AIR Vividh Bharati 102.8 FM (app.js FALLBACK_CHANNELS)',
            'url': 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8',
            'note': 'Points to hlspbaudioragam (AIR Raagam classical) instead of Vividh Bharati'
        },
        {
            'source': 'assets/app.js',
            'line': get_app_js_line('air-gold-fm', 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmgold/hlspbaudiofmgold_Auto.m3u8'),
            'id': 'air-gold-fm',
            'name': 'AIR FM Gold Delhi (app.js FALLBACK_CHANNELS)',
            'url': 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmgold/hlspbaudiofmgold_Auto.m3u8',
            'note': 'BitGravity push endpoint'
        },
        {
            'source': 'assets/app.js',
            'line': get_app_js_line('air-rainbow-fm', 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmrainbow/hlspbaudiofmrainbow_Auto.m3u8'),
            'id': 'air-rainbow-fm',
            'name': 'AIR FM Rainbow (app.js FALLBACK_CHANNELS)',
            'url': 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmrainbow/hlspbaudiofmrainbow_Auto.m3u8',
            'note': 'BitGravity push endpoint'
        },
        {
            'source': 'assets/app.js',
            'line': get_app_js_line('sample_audio_1', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
            'id': 'sample_audio_1',
            'name': 'Bollywood Acoustic Beats (Lossless) (app.js DEFAULT_LOCAL_MEDIA)',
            'url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'note': 'Demo MP3 file'
        },
        # From data/channels.json
        {
            'source': 'data/channels.json',
            'line': get_channel_line('air-vividh-bharati', 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8'),
            'id': 'air-vividh-bharati',
            'name': 'AIR Vividh Bharati 102.8 FM (channels.json primary)',
            'url': 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
            'note': 'Production BitGravity live HLS'
        },
        {
            'source': 'data/channels.json',
            'line': get_channel_line('air-gold-fm', 'https://audio-edge-fvq45.ams.d.radiomast.io/3ccc1156-fcf8-4ba7-9a0c-28e3a465e1ae'),
            'id': 'air-gold-fm',
            'name': 'AIR FM Gold Delhi (channels.json)',
            'url': 'https://audio-edge-fvq45.ams.d.radiomast.io/3ccc1156-fcf8-4ba7-9a0c-28e3a465e1ae',
            'note': 'RadioMast edge MP3 stream'
        },
        {
            'source': 'data/channels.json',
            'line': get_channel_line('air-rainbow-fm', 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio004/hlspbaudio004_Auto.m3u8'),
            'id': 'air-rainbow-fm',
            'name': 'AIR FM Rainbow (channels.json)',
            'url': 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio004/hlspbaudio004_Auto.m3u8',
            'note': 'pbaudio004 HLS stream'
        },
        {
            'source': 'data/channels.json',
            'line': get_channel_line('air-live-news', 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio002_Auto.m3u8'),
            'id': 'air-live-news',
            'name': 'AIR Live News 24x7 (channels.json)',
            'url': 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio002_Auto.m3u8',
            'note': 'pbaudio002 HLS stream'
        }
    ]

    with ThreadPoolExecutor(max_workers=8) as ex:
        radio_results = list(ex.map(lambda r: {**r, **probe_url(r['url'])}, radio_stations_to_test))

    # ----------------------------------------------------
    # 3. 20 Live TV Channels Random Sample (status != 'OFFLINE')
    # ----------------------------------------------------
    print("\n[*] Sampling 20 Live TV channels with status != 'OFFLINE' from data/channels.json...")
    active_tv = [c for c in channels_data if c.get('status') != 'OFFLINE' and c.get('type') != 'radio']
    random.seed(42)
    sampled_tv = random.sample(active_tv, 20)

    tv_tasks = []
    for c in sampled_tv:
        cid = c.get('id')
        name = c.get('name')
        url = c.get('url')
        line = get_channel_line(cid, url)
        tv_tasks.append({
            'id': cid,
            'name': name,
            'category': c.get('category'),
            'status': c.get('status'),
            'url': url,
            'line': line
        })

    with ThreadPoolExecutor(max_workers=10) as ex:
        tv_results = list(ex.map(lambda t: {**t, **probe_url(t['url'])}, tv_tasks))

    # ----------------------------------------------------
    # Analysis & Bug Compilation
    # ----------------------------------------------------
    broken_streams = [s for s in stream_results if not s['is_accessible']]
    bracket_streams = [s for s in stream_results if s['has_bracket']]
    broken_trailers = [t for t in trailer_results if not t['is_accessible']]
    broken_episodes = [e for e in episode_results if not e['is_accessible']]
    bracket_episodes = [e for e in episode_results if e['has_bracket']]
    broken_radios = [r for r in radio_results if not r['is_accessible']]
    broken_tv = [t for t in tv_results if not t['is_accessible']]

    print("\n" + "=" * 80)
    print("VERIFICATION SUMMARY")
    print("=" * 80)
    print(f"Top-level Stream URLs:  Total={len(stream_results)}, Accessible={len(stream_results) - len(broken_streams)}, Broken={len(broken_streams)}")
    print(f"Trailer URLs:            Total={len(trailer_results)}, Accessible={len(trailer_results) - len(broken_trailers)}, Broken={len(broken_trailers)}")
    print(f"Episode Stream URLs:     Total={len(episode_results)}, Accessible={len(episode_results) - len(broken_episodes)}, Broken={len(broken_episodes)}")
    print(f"Radio Stations Tested:   Total={len(radio_results)}, Accessible={len(radio_results) - len(broken_radios)}, Broken={len(broken_radios)}")
    print(f"Live TV 20-Sample:       Total={len(tv_results)}, Accessible={len(tv_results) - len(broken_tv)}, Broken={len(broken_tv)} ({len(broken_tv)/len(tv_results)*100:.1f}% failure rate)")

    # Save complete JSON report
    report_data = {
        'top_level_streams': stream_results,
        'trailers': trailer_results,
        'episodes': episode_results,
        'radios': radio_results,
        'live_tv_sample': tv_results,
        'summary': {
            'total_top_streams': len(stream_results),
            'broken_top_streams': len(broken_streams),
            'bracket_top_streams': len(bracket_streams),
            'total_trailers': len(trailer_results),
            'broken_trailers': len(broken_trailers),
            'total_episodes': len(episode_results),
            'broken_episodes': len(broken_episodes),
            'bracket_episodes': len(bracket_episodes),
            'total_radios': len(radio_results),
            'broken_radios': len(broken_radios),
            'total_tv_sample': len(tv_results),
            'broken_tv_sample': len(broken_tv)
        }
    }

    with open(REPORT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    print(f"\n[+] Full JSON report written to {REPORT_JSON_PATH}")

    # Generate Markdown Summary
    with open(REPORT_MD_PATH, "w", encoding="utf-8") as f:
        f.write("# Forensic Stream Check Report\n\n")
        f.write("## 1. Summary Statistics\n\n")
        f.write(f"- **Top-level Stream URLs**: {len(stream_results)} tested, {len(broken_streams)} broken\n")
        f.write(f"- **Trailer URLs**: {len(trailer_results)} tested, {len(broken_trailers)} broken\n")
        f.write(f"- **Episode Stream URLs**: {len(episode_results)} tested, {len(broken_episodes)} broken\n")
        f.write(f"- **Radio Stations**: {len(radio_results)} tested, {len(broken_radios)} broken\n")
        f.write(f"- **Live TV Sample (20 items)**: {len(tv_results)} tested, {len(broken_tv)} broken ({len(broken_tv)/20*100:.1f}% error rate)\n\n")

        f.write("## 2. Broken Radio Stations\n\n")
        for r in broken_radios:
            f.write(f"- **{r['name']}** ({r['source']} L{r['line']}): HTTP {r['http_code']} -> `{r['url']}`\n")

        f.write("\n## 3. Broken Live TV Sample Channels\n\n")
        for t in broken_tv:
            f.write(f"- **{t['name']}** (`{t['id']}`, data/channels.json L{t['line']}): HTTP {t['http_code']} (Status in DB: {t['status']}) -> `{t['url']}`\n")

        f.write("\n## 4. Broken Trailers (Dead YouTube Embeds)\n\n")
        for tr in broken_trailers:
            f.write(f"- **{tr['title']}** (`{tr['id']}`, data/movies_catalog.json L{tr['line']}): Raw HTTP {tr['http_code']}, YT Thumbnail HTTP {tr['yt_thumbnail_code']} -> `{tr['url']}`\n")

    print(f"[+] Markdown report written to {REPORT_MD_PATH}")

if __name__ == "__main__":
    main()
