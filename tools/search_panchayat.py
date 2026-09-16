#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search_files(q):
    encoded = urllib.parse.quote(q)
    url = f"https://archive.org/advancedsearch.php?q={encoded}&fl[]=identifier,title,mediatype,downloads&sort[]=downloads+desc&rows=20&output=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            docs = data.get('response', {}).get('docs', [])
            print(f"\n--- Search query: '{q}' ({len(docs)} results) ---")
            for d in docs:
                print(f"  {d.get('identifier')} | {d.get('title')}")
            return docs
    except Exception as e:
        print(f"Search failed: {e}")
        return []

if __name__ == '__main__':
    search_files('panchayat AND mediatype:movies')
    search_files('panchayat AND (format:h.264 OR format:MPEG4)')
    search_files('panchayat 720p')
    search_files('panchayat season 2')
    search_files('panchayat season 3')
