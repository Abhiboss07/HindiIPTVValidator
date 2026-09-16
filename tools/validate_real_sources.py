#!/usr/bin/env python3
import json
import urllib.request
import ssl
import sys

def main():
    print('=' * 60)
    print('REAL SOURCE REACHABILITY & RANGE REQUEST AUDIT')
    print('=' * 60)

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    with open('data/movies_catalog.json', 'r', encoding='utf-8') as f:
        cat = json.load(f)

    items = cat.get('movies', [])
    print(f'Total catalog items: {len(items)}\n')

    direct_stream_tests = []
    trailer_tests = []
    torrent_tests = []
    no_source_tests = []

    seen_stream_urls = {}
    seen_trailer_urls = {}
    seen_torrents = {}

    errors = []

    for item in items:
        mid = item['id']
        title = item['title']
        s_state = item.get('sourceState')
        s_url = item.get('streamUrl')
        t_url = item.get('trailerUrl')
        t_uri = item.get('torrentUri')
        ctype = item.get('contentType')

        # Check collision
        if s_url:
            if s_url in seen_stream_urls:
                errors.append(f'COLLISION: {mid} shares streamUrl with {seen_stream_urls[s_url]}')
            seen_stream_urls[s_url] = mid

        if t_url:
            if t_url in seen_trailer_urls:
                errors.append(f'COLLISION: {mid} shares trailerUrl with {seen_trailer_urls[t_url]}')
            seen_trailer_urls[t_url] = mid

        if t_uri:
            if t_uri in seen_torrents:
                errors.append(f'COLLISION: {mid} shares torrentUri with {seen_torrents[t_uri]}')
            seen_torrents[t_uri] = mid

        if s_url:
            direct_stream_tests.append((mid, title, s_url))
        elif t_url:
            trailer_tests.append((mid, title, t_url))
        elif t_uri:
            torrent_tests.append((mid, title, t_uri))
        else:
            no_source_tests.append((mid, title))

    print(f'Direct Streams to test: {len(direct_stream_tests)}')
    print(f'Trailers to test: {len(trailer_tests)}')
    print(f'Torrents: {len(torrent_tests)}')
    print(f'No Source (honestly unavailable): {len(no_source_tests)}\n')

    # 1. Test Direct Streams
    print('--- 1. TESTING DIRECT FULL-MOVIE STREAMS (Range: bytes=0-1023) ---')
    direct_ok = 0
    for mid, title, url in direct_stream_tests:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14) ExoPlayerLib/2.19.1',
            'Range': 'bytes=0-1023'
        })
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
                status = resp.status
                ctype_hdr = resp.headers.get('Content-Type', '')
                crange_hdr = resp.headers.get('Content-Range', '')
                clen = resp.headers.get('Content-Length', '')
                if status in (200, 206) and any(x in ctype_hdr for x in ['video/', 'mpegurl', 'application/']):
                    print(f'  [PASS] {title[:30]:<30} -> HTTP {status} ({ctype_hdr}), Range: {crange_hdr}')
                    direct_ok += 1
                else:
                    errors.append(f'Direct stream invalid headers for {mid}: HTTP {status}, Type: {ctype_hdr}')
                    print(f'  [FAIL] {title[:30]:<30} -> HTTP {status}, Type: {ctype_hdr}')
        except Exception as e:
            errors.append(f'Direct stream network error for {mid}: {e}')
            print(f'  [FAIL] {title[:30]:<30} -> ERROR: {e}')

    # 2. Test Trailers
    print('\n--- 2. TESTING OFFICIAL TRAILERS (Range: bytes=0-1023) ---')
    trailer_ok = 0
    for mid, title, url in trailer_tests:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14) ExoPlayerLib/2.19.1',
            'Range': 'bytes=0-1023'
        })
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
                status = resp.status
                ctype_hdr = resp.headers.get('Content-Type', '')
                if status in (200, 206) and any(x in ctype_hdr for x in ['video/', 'mpegurl', 'application/']):
                    print(f'  [PASS] {title[:30]:<30} -> HTTP {status} ({ctype_hdr})')
                    trailer_ok += 1
                else:
                    errors.append(f'Trailer invalid headers for {mid}: HTTP {status}, Type: {ctype_hdr}')
                    print(f'  [FAIL] {title[:30]:<30} -> HTTP {status}, Type: {ctype_hdr}')
        except Exception as e:
            errors.append(f'Trailer network error for {mid}: {e}')
            print(f'  [FAIL] {title[:30]:<30} -> ERROR: {e}')

    print('\n' + '=' * 60)
    print('STREAM AUDIT SUMMARY')
    print('=' * 60)
    print(f'Total items: {len(items)}')
    print(f'Direct playable: {direct_ok} / {len(direct_stream_tests)}')
    print(f'Trailers verified: {trailer_ok} / {len(trailer_tests)}')
    print(f'Torrent only: {len(torrent_tests)}')
    print(f'Unavailable: {len(no_source_tests)}')
    print(f'Total Errors: {len(errors)}')

    if errors:
        print('\nERRORS ENCOUNTERED:')
        for err in errors:
            print(f'  - {err}')
        return 1
    else:
        print('\nALL DIRECT STREAMS AND TRAILERS ARE 100% REACHABLE & VERIFIED!')
        return 0

if __name__ == '__main__':
    sys.exit(main())
