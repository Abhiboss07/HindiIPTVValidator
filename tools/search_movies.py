#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def search(q):
    url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}&fl[]=identifier,title,description,downloads&sort[]=downloads+desc&rows=50&output=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
            docs = json.loads(r.read().decode('utf-8')).get('response', {}).get('docs', [])
            print(f"=== Query: {q} ({len(docs)} results) ===")
            for d in docs:
                print(f"  {d.get('identifier')} | {d.get('title')}")
            return docs
    except Exception as e:
        print(f"Error {q}: {e}")
        return []

if __name__ == '__main__':
    query = sys.argv[1] if len(sys.argv) > 1 else 'panchayat AND mediatype:movies'
    search(query)
