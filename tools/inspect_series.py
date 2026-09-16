import json

with open("data/movies_catalog.json") as f:
    cat = json.load(f)

movies = cat.get("movies", [])
series_list = [m for m in movies if m.get("mediaType") == "series" or m.get("contentType") == "SERIES"]

print(f"Total Series: {len(series_list)}")

for s in series_list:
    sid = s["id"]
    title = s.get("title")
    tor = s.get("torrentUri")
    state = s.get("sourceState")
    seasons = s.get("seasons", [])
    flat_eps = s.get("episodes", [])
    print(f"\n=======================================================")
    print(f"SERIES: {sid} - {title}")
    print(f"State: {state} | Torrent: {'YES' if tor else 'NO'} | Seasons: {len(seasons)} | Flat Eps: {len(flat_eps)}")
    
    total_eps = 0
    playable_eps = 0
    for s_idx, season in enumerate(seasons, 1):
        s_num = season.get("seasonNumber", s_idx)
        eps = season.get("episodes", [])
        print(f"  Season {s_num}: {len(eps)} episodes")
        for ep in eps:
            total_eps += 1
            st = ep.get("streamUrl")
            if st:
                playable_eps += 1
            ep_state = ep.get("sourceState")
            ep_badge = ep.get("qualityHonestBadge")
            if st or ep_state != "NO_AUTHORIZED_SOURCE":
                print(f"    - {ep.get('id')}: {ep.get('title')} | st={st is not None} | state={ep_state} | badge={ep_badge}")
    print(f"  TOTAL: {total_eps} episodes ({playable_eps} direct playable)")
