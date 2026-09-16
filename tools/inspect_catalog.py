import json

with open("data/movies_catalog.json") as f:
    cat = json.load(f)

v = cat.get("version")
print(f"Catalog Version: {v}")
movies = cat.get("movies", [])
print(f"Total entries: {len(movies)}")

playable = []
trailers = []
torrents = []
unavailable = []

for m in movies:
    mid = m["id"]
    title = m.get("title", "")
    st = m.get("streamUrl")
    tr = m.get("trailerUrl")
    tor = m.get("torrentUri")
    state = m.get("sourceState")
    ctype = m.get("contentType", m.get("mediaType"))
    
    # Check if it is a series with episode streamUrls
    has_ep_streams = False
    if m.get("seasons"):
        for s in m["seasons"]:
            for ep in s.get("episodes", []):
                if ep.get("streamUrl"):
                    has_ep_streams = True
                    break
    
    if st or has_ep_streams:
        playable.append((mid, title, ctype, st or "(episodes)", m.get("languages", [])))
    elif tr:
        trailers.append((mid, title, ctype, tr))
    elif tor:
        torrents.append((mid, title, ctype, tor))
    else:
        unavailable.append((mid, title, ctype, state))

print(f"\n--- PLAYABLE ({len(playable)}) ---")
for p in playable:
    print(f"  {p[0]}: {p[1]} ({p[2]}) -> {str(p[3])[:60]}... | langs: {p[4]}")

print(f"\n--- TRAILERS ({len(trailers)}) ---")
for t in trailers:
    print(f"  {t[0]}: {t[1]} ({t[2]}) -> {str(t[3])[:60]}...")

print(f"\n--- TORRENTS ({len(torrents)}) ---")
for to in torrents:
    print(f"  {to[0]}: {to[1]} ({to[2]})")

print(f"\n--- UNAVAILABLE ({len(unavailable)}) ---")
for u in unavailable:
    print(f"  {u[0]}: {u[1]} ({u[2]}) -> state={u[3]}")
