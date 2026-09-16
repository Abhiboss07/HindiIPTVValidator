#!/usr/bin/env python3
import urllib.request
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def inspect(item_id):
    url = f"https://archive.org/metadata/{item_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
            data = json.loads(r.read().decode('utf-8'))
            files = data.get('files', [])
            print(f"=== {item_id}: Total files {len(files)} ===")
            for f in files:
                name = f.get('name', '')
                ext = name.split('.')[-1].lower() if '.' in name else ''
                if ext in ['mp4', 'mkv', 'avi', 'm4v', 'ts']:
                    size_mb = int(f.get('size', 0)) / (1024*1024) if f.get('size') else 0
                    print(f"  {name} | size: {size_mb:.1f} MB | format: {f.get('format')}")
    except Exception as e:
        print(f"Error {item_id}: {e}")

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        inspect(arg)
