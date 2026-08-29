#!/usr/bin/env python3
"""
T2L (Television to Live) - Stream Hygiene & Health Validation Utility
=====================================================================
Offline CLI tool to inspect channels in data/channels.json for:
- HTTP Reachability & response codes
- CORS Header compatibility
- HLS Manifest syntax and segment validity
- Heuristic Metadata / Channel name mismatch detection

Generates: validation_report.json (Non-destructive, never alters channels.json directly)
Purge: Only purges entries explicitly flagged 'confirmed_dead: true' when --purge-confirmed is passed.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
import argparse
from datetime import datetime, timezone

USER_AGENT = 'Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5'

def probe_stream(ch, timeout=10):
    url = ch.get('url', '')
    if not url:
        return {
            'id': ch.get('id', 'unknown'),
            'name': ch.get('name', 'Unknown'),
            'url': '',
            'status': 'unreachable',
            'http_code': 0,
            'manifest_valid': False,
            'has_cors': False,
            'metadata_extracted': {},
            'notes': 'Empty stream URL',
            'confirmed_dead': False,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }

    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': USER_AGENT,
            'Icy-MetaData': '1'
        }
    )

    result = {
        'id': ch.get('id', 'unknown'),
        'name': ch.get('name', 'Unknown'),
        'url': url,
        'status': 'healthy',
        'http_code': 0,
        'manifest_valid': False,
        'has_cors': False,
        'metadata_extracted': {},
        'notes': '',
        'confirmed_dead': False,
        'timestamp': datetime.now(timezone.utc).isoformat()
    }

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            result['http_code'] = resp.getcode()
            headers = dict(resp.info())
            
            # CORS check
            cors = headers.get('Access-Control-Allow-Origin', headers.get('access-control-allow-origin', ''))
            result['has_cors'] = (cors == '*' or bool(cors))

            # Metadata extraction from headers
            for k, v in headers.items():
                if k.lower().startswith('icy-'):
                    result['metadata_extracted'][k.lower()] = v

            content_type = headers.get('Content-Type', headers.get('content-type', ''))
            result['metadata_extracted']['content_type'] = content_type

            # Read first chunk to inspect manifest / stream syntax
            first_chunk = resp.read(4096)
            try:
                text_content = first_chunk.decode('utf-8', errors='ignore')
            except Exception:
                text_content = ''

            if '#EXTM3U' in text_content:
                result['manifest_valid'] = True
                if '#EXT-X-STREAM-INF' in text_content:
                    result['metadata_extracted']['hls_type'] = 'master_playlist'
                else:
                    result['metadata_extracted']['hls_type'] = 'media_playlist'
                
                # Heuristic title / program search
                for line in text_content.splitlines():
                    if line.startswith('#EXTINF:'):
                        result['metadata_extracted']['extinf'] = line[:80]
                        break
            elif 'video' in content_type or 'audio' in content_type or 'octet-stream' in content_type:
                result['manifest_valid'] = True
            else:
                result['manifest_valid'] = False
                result['status'] = 'invalid_manifest'
                result['notes'] = f'Content-Type is {content_type}, no #EXTM3U found.'

            # Heuristic Mismatch Detection (Advisory flag for human review)
            icy_name = result['metadata_extracted'].get('icy-name', '')
            if icy_name:
                ch_name_lower = ch.get('name', '').lower()
                icy_lower = icy_name.lower()
                # If icy_name exists and shares 0 words with channel name
                ch_words = set(ch_name_lower.split())
                icy_words = set(icy_lower.split())
                if ch_words and icy_words and not (ch_words & icy_words):
                    result['status'] = 'potential_mismatch'
                    result['notes'] = f"Heuristic advisory: ICY title '{icy_name}' does not contain expected channel keywords."

            if not result['notes'] and result['status'] == 'healthy':
                result['notes'] = 'Stream responsive with valid media manifest.'

    except urllib.error.HTTPError as e:
        result['http_code'] = e.code
        result['status'] = 'unreachable'
        result['notes'] = f'HTTP Error {e.code}: {e.reason}'
    except urllib.error.URLError as e:
        result['status'] = 'unreachable'
        result['notes'] = f'Network URLError: {e.reason}'
    except Exception as e:
        result['status'] = 'unreachable'
        result['notes'] = f'Exception: {str(e)}'

    return result

def main():
    parser = argparse.ArgumentParser(description='Validate streams in channels.json and output validation_report.json')
    parser.add_argument('--input', default='data/channels.json', help='Path to channels.json')
    parser.add_argument('--output', default='validation_report.json', help='Path to output validation_report.json')
    parser.add_argument('--limit', type=int, default=0, help='Limit number of channels to check (0 for all)')
    parser.add_argument('--timeout', type=int, default=8, help='Timeout per stream in seconds')
    parser.add_argument('--purge-confirmed', action='store_true', help='Only purge entries marked confirmed_dead: true in validation report')
    args = parser.parse_args()

    if args.purge_confirmed:
        if not os.path.exists(args.output):
            print(f"❌ Error: Validation report '{args.output}' not found. Run validation first to review confirmed_dead entries.")
            sys.exit(1)
        
        with open(args.output, 'r', encoding='utf-8') as f:
            report_data = json.load(f)
        
        dead_ids = set(r['id'] for r in report_data.get('results', []) if r.get('confirmed_dead') is True)
        if not dead_ids:
            print("ℹ️ No entries marked 'confirmed_dead: true' found in report. Nothing purged.")
            return

        with open(args.input, 'r', encoding='utf-8') as f:
            channels = json.load(f)

        before_count = len(channels)
        cleaned_channels = [c for c in channels if c.get('id') not in dead_ids]
        after_count = len(cleaned_channels)

        with open(args.input, 'w', encoding='utf-8') as f:
            json.dump(cleaned_channels, f, indent=2, ensure_ascii=False)

        print(f"✅ Purged {before_count - after_count} human-confirmed dead entries from {args.input}. Remaining: {after_count}")
        return

    if not os.path.exists(args.input):
        print(f"❌ Error: Input file '{args.input}' not found.")
        sys.exit(1)

    with open(args.input, 'r', encoding='utf-8') as f:
        channels = json.load(f)

    if args.limit > 0:
        channels_to_check = channels[:args.limit]
    else:
        channels_to_check = channels

    total = len(channels_to_check)
    print(f"🔍 Starting stream health validation for {total} channels (Timeout: {args.timeout}s)...")
    results = []

    healthy_count = 0
    unreachable_count = 0
    invalid_count = 0
    mismatch_count = 0

    for idx, ch in enumerate(channels_to_check, 1):
        name = ch.get('name', 'Unknown')
        print(f"[{idx}/{total}] Checking: {name[:35]:<35} ... ", end='', flush=True)
        res = probe_stream(ch, timeout=args.timeout)
        status = res['status']

        if status == 'healthy':
            healthy_count += 1
            print("✅ OK")
        elif status == 'potential_mismatch':
            mismatch_count += 1
            print("⚠️ MISMATCH")
        elif status == 'invalid_manifest':
            invalid_count += 1
            print("❓ INVALID")
        else:
            unreachable_count += 1
            print(f"❌ {res['http_code'] or 'TIMEOUT'}")

        results.append(res)
        time.sleep(0.05)

    summary = {
        'total_checked': total,
        'healthy': healthy_count,
        'unreachable': unreachable_count,
        'invalid_manifest': invalid_count,
        'potential_mismatch': mismatch_count
    }

    report = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'summary': summary,
        'results': results
    }

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print("\n=======================================================")
    print(f"🎉 Validation Complete! Report saved to '{args.output}'")
    print(f"📊 Healthy: {healthy_count} | Unreachable: {unreachable_count} | Invalid: {invalid_count} | Potential Mismatch: {mismatch_count}")
    print("=======================================================")
    print("💡 To mark dead streams for purging, review validation_report.json, set 'confirmed_dead: true' on reviewed items, and run:")
    print(f"   python3 scripts/validate_channels.py --purge-confirmed --input {args.input} --output {args.output}")

if __name__ == '__main__':
    main()
