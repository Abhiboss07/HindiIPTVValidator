#!/usr/bin/env python3
"""
Rigorous Hindi Live HLS Stream Tester
Probes candidate streams with HTTP checks, playlist parsing, segment verification,
and ffprobe validation.
"""

import sys
import os
import re
import json
import time
import urllib.request
import urllib.parse
import urllib.error
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

def probe_stream(entry):
    name = entry['name']
    url = entry['url']
    logo = entry.get('logo', '')
    group = entry.get('group', '')
    
    result = {
        'name': name,
        'url': url,
        'logo': logo,
        'group': group,
        'http_status': None,
        'latency_s': 0,
        'is_m3u': False,
        'segment_verified': False,
        'resolution': None,
        'video_codec': None,
        'audio_codec': None,
        'ffprobe_ok': False,
        'error': None,
        'working': False
    }
    
    # 1. Fetch Playlist
    t0 = time.time()
    headers = {'User-Agent': USER_AGENT}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            latency = time.time() - t0
            result['latency_s'] = round(latency, 2)
            result['http_status'] = resp.status
            body = resp.read(8192).decode('utf-8', errors='ignore')
            
            if '#EXTM3U' not in body and '#EXT-X' not in body:
                result['error'] = 'Not a valid HLS playlist (missing #EXTM3U)'
                return result
            result['is_m3u'] = True
            
            # Check if master playlist (contains #EXT-X-STREAM-INF)
            lines = [l.strip() for l in body.splitlines() if l.strip()]
            child_url = None
            segment_url = None
            
            if '#EXT-X-STREAM-INF' in body:
                for idx, line in enumerate(lines):
                    if line.startswith('#EXT-X-STREAM-INF') and idx + 1 < len(lines):
                        next_line = lines[idx + 1]
                        if not next_line.startswith('#'):
                            child_url = urllib.parse.urljoin(url, next_line)
                            break
            
            # If child URL found, fetch child playlist
            if child_url:
                try:
                    c_req = urllib.request.Request(child_url, headers=headers)
                    with urllib.request.urlopen(c_req, timeout=3.0) as c_resp:
                        c_body = c_resp.read(8192).decode('utf-8', errors='ignore')
                        c_lines = [l.strip() for l in c_body.splitlines() if l.strip()]
                        for l in c_lines:
                            if not l.startswith('#') and ('.ts' in l or '.aac' in l or '.m4s' in l or 'chunk' in l or 'segment' in l or 'fragment' in l or 'index' in l or 'http' in l):
                                segment_url = urllib.parse.urljoin(child_url, l)
                                break
                except Exception as ce:
                    pass
            else:
                for l in lines:
                    if not l.startswith('#') and ('.ts' in l or '.aac' in l or '.m4s' in l or 'chunk' in l or 'segment' in l or 'fragment' in l or 'http' in l):
                        segment_url = urllib.parse.urljoin(url, l)
                        break
            
            # Verify segment
            if segment_url:
                try:
                    s_req = urllib.request.Request(segment_url, headers=headers)
                    # Read just 512 bytes
                    with urllib.request.urlopen(s_req, timeout=3.5) as s_resp:
                        if s_resp.status == 200:
                            s_data = s_resp.read(512)
                            if len(s_data) > 0:
                                result['segment_verified'] = True
                except Exception as se:
                    pass

    except urllib.error.HTTPError as he:
        result['http_status'] = he.code
        result['error'] = f'HTTP {he.code}'
        return result
    except Exception as e:
        result['error'] = f'{type(e).__name__}: {str(e)[:50]}'
        return result

    # If HTTP 200 and is_m3u and latency < 3.5s
    if result['is_m3u']:
        # Quick ffprobe test (max 4.5s)
        try:
            cmd = [
                'ffprobe', '-v', 'error',
                '-timeout', '3500000',
                '-user_agent', USER_AGENT,
                '-show_entries', 'stream=index,codec_type,codec_name,width,height',
                '-print_format', 'json',
                '-i', url
            ]
            ff_proc = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            if ff_proc.returncode == 0:
                result['ffprobe_ok'] = True
                ff_data = json.loads(ff_proc.stdout)
                streams = ff_data.get('streams', [])
                for st in streams:
                    ctype = st.get('codec_type')
                    if ctype == 'video':
                        w = st.get('width')
                        h = st.get('height')
                        result['video_codec'] = st.get('codec_name')
                        if h:
                            if h >= 1080:
                                result['resolution'] = '1080p FHD'
                            elif h >= 720:
                                result['resolution'] = '720p HD'
                            elif h >= 576:
                                result['resolution'] = '576p SD Broadcast'
                            else:
                                result['resolution'] = f'{h}p'
                    elif ctype == 'audio':
                        result['audio_codec'] = st.get('codec_name')
                
                result['working'] = True
            else:
                # If ffprobe timed out but segment was verified, it might still work in player
                if result['segment_verified']:
                    result['working'] = True
                    result['ffprobe_ok'] = False
                    result['error'] = 'ffprobe failed but segment verified'
        except subprocess.TimeoutExpired:
            if result['segment_verified']:
                result['working'] = True
                result['error'] = 'ffprobe timeout, segment ok'
        except Exception as ffe:
            result['error'] = f'ffprobe err: {str(ffe)[:40]}'

    return result

def main():
    with open('temp_candidates_to_test.json') as f:
        candidates = json.load(f)
    
    print(f'Starting rigorous probing of {len(candidates)} candidates...')
    working = []
    
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(probe_stream, c): c for c in candidates}
        for future in as_completed(futures):
            res = future.result()
            if res['working']:
                working.append(res)
                print(f"[PASS] {res['name']} | Latency: {res['latency_s']}s | Res: {res.get('resolution')} | Codec: {res.get('video_codec')}/{res.get('audio_codec')}")
            else:
                pass
                
    print(f'\nTotal verified working streams: {len(working)}')
    with open('verified_hindi_working.json', 'w') as out:
        json.dump(working, out, indent=2)
    print('Saved verified results to verified_hindi_working.json')

if __name__ == '__main__':
    main()
