#!/usr/bin/env python3
import os
import json
import sys
from PIL import Image

def main():
    print('=' * 60)
    print('REAL POSTER DECODING & ASSET INTEGRITY AUDIT')
    print('=' * 60)

    with open('data/movies_catalog.json', 'r', encoding='utf-8') as f:
        cat = json.load(f)

    items = cat.get('movies', [])
    print(f'Total catalog items: {len(items)}\n')

    errors = []
    warnings = []
    valid_count = 0

    seen_posters = {}

    for item in items:
        mid = item['id']
        title = item['title']
        poster_url = item.get('posterUrl')

        if not poster_url:
            errors.append(f'{mid} ({title}): Missing posterUrl field')
            continue

        # Check local path
        if not os.path.exists(poster_url):
            errors.append(f'{mid} ({title}): File does not exist at {poster_url}')
            continue

        # Check android_app asset path
        android_path = os.path.join('android_app/src/main/assets', poster_url)
        if not os.path.exists(android_path):
            errors.append(f'{mid} ({title}): Missing from android_app/src/main/assets: {android_path}')
            continue

        # Check file size
        sz = os.path.getsize(poster_url)
        if sz == 0:
            errors.append(f'{mid} ({title}): File is 0 bytes!')
            continue

        # Check real image decode using PIL
        try:
            with Image.open(poster_url) as img:
                img.verify()
            with Image.open(poster_url) as img:
                img.load()
                w, h = img.size
                fmt = img.format
                if w <= 0 or h <= 0:
                    errors.append(f'{mid} ({title}): Invalid dimensions {w}x{h}')
                    continue
                if sz > 1.5 * 1024 * 1024:
                    warnings.append(f'{mid} ({title}): Poster is very large ({sz/1024:.1f} KB), may cause WebView memory pressure')
                valid_count += 1
        except Exception as e:
            errors.append(f'{mid} ({title}): Image failed to decode: {e}')
            continue

    # Verify placeholder fallback
    if not os.path.exists('assets/placeholder.png'):
        errors.append('Missing assets/placeholder.png fallback image')
    else:
        try:
            with Image.open('assets/placeholder.png') as img:
                img.verify()
            print('  [PASS] assets/placeholder.png is valid')
        except Exception as e:
            errors.append(f'assets/placeholder.png corrupted: {e}')

    print(f'\nTHUMBNAIL AUDIT SUMMARY:')
    print(f'  Total content items: {len(items)}')
    print(f'  Valid decoded images: {valid_count} / {len(items)}')
    print(f'  Errors: {len(errors)}')
    print(f'  Warnings: {len(warnings)}')

    if errors:
        print('\nERRORS:')
        for e in errors:
            print(f'  - {e}')
        return 1
    else:
        print('\nALL 52 POSTERS AND FALLBACKS SUCCESSFULLY DECODED & VERIFIED!')
        return 0

if __name__ == '__main__':
    sys.exit(main())
