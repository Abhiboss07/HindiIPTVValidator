#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_item_files(identifier):
    url = f"https://archive.org/metadata/{identifier}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            files = data.get('files', [])
            media = [f for f in files if any(f.get('name', '').lower().endswith(ext) for ext in ['.mp4', '.mkv', '.m4v'])]
            print(f"\n=== {identifier} ({len(media)} media files) ===")
            for m in media:
                size_mb = int(m.get('size', 0)) / (1024*1024) if m.get('size') else 0
                print(f"  {m.get('name')} ({size_mb:.1f} MB, format: {m.get('format')})")
            return media
    except Exception as e:
        print(f"Error {identifier}: {e}")
        return []

def search_files(q):
    encoded = urllib.parse.quote(q)
    url = f"https://archive.org/advancedsearch.php?q={encoded}&fl[]=identifier,title,mediatype&rows=10&output=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            docs = data.get('response', {}).get('docs', [])
            print(f"\n--- Search query: '{q}' ---")
            for d in docs:
                print(f"  {d.get('identifier')} | {d.get('title')}")
            return docs
    except Exception as e:
        print(f"Search failed: {e}")
        return []

if __name__ == '__main__':
    get_item_files('scam-1992-the-harshad-mehta-story-2020-hindi-season-1-720p')
    get_item_files('kota-factory-hindi-aac-2-0-x-264-mkv-cinemas')
    search_files('panchayat e01 OR panchayat s01e01 OR "panchayat s01"')
    search_files('mirzapur s01 OR "mirzapur season 1"')
    search_files('"family man" s01 OR "the family man" season')
    search_files('"money heist" s01 OR "money heist" season 1')
    search_files('"game of thrones" s01 OR "game of thrones" season 1')
