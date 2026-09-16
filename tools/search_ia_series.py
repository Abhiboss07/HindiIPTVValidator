#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search_ia(query):
    encoded_q = urllib.parse.quote(query)
    url = f"https://archive.org/advancedsearch.php?q={encoded_q}&fl[]=identifier,title,mediatype,publicdate,downloads&sort[]=downloads+desc&rows=15&page=1&output=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            docs = data.get('response', {}).get('docs', [])
            print(f"\n--- Search: '{query}' ({len(docs)} results) ---")
            for d in docs:
                print(f"  ID: {d.get('identifier')} | Title: {d.get('title')} | Mediatype: {d.get('mediatype')}")
            return docs
    except Exception as e:
        print(f"Search failed for '{query}': {e}")
        return []

if __name__ == '__main__':
    queries = [
        'panchayat season',
        'panchayat s01',
        'mirzapur season 1',
        'mirzapur season 2',
        'kota factory season 1',
        'sacred games season 1',
        'family man season 1',
        'scam 1992',
        'farzi season 1',
        'paatal lok season 1'
    ]
    for q in queries:
        search_ia(q)
