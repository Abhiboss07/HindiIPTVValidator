#!/usr/bin/env python3
import urllib.request
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_item(identifier):
    url = f"https://archive.org/metadata/{identifier}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            files = data.get("files", [])
            mp4s = [f for f in files if f.get("name", "").lower().endswith(".mp4")]
            print(f"\n=== {identifier} (Total files: {len(files)}, MP4s: {len(mp4s)}) ===")
            for f in mp4s[:20]:
                size_mb = int(f.get("size", 0)) / (1024*1024) if f.get("size") else 0
                print(f"  {f.get('name')} ({size_mb:.1f} MB, format: {f.get('format')})")
            return files
    except Exception as e:
        print(f"Error {identifier}: {e}")
        return None

if __name__ == '__main__':
    items = [
        "granada-holmes",
        "s-2-m-1",
        "stranger.-things.-s-01.720p.-blu-ray.x-264-galaxy-tv",
        "BreakingBadSeason11080PHEVC",
        "Kota-Factory-Season-2",
        "a2z-panchayat-season-1",
        "sacred-games-s02.-hevc"
    ]
    for it in items:
        check_item(it)
