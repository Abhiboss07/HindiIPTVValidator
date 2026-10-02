import json
import subprocess

def audit_series():
    old_raw = subprocess.check_output(['git', 'show', 'dc36a64~1:data/movies_catalog.json']).decode('utf-8')
    old_cat = json.loads(old_raw)
    old37_raw = subprocess.check_output(['git', 'show', '37a3525:data/movies_catalog.json']).decode('utf-8')
    old37_cat = json.loads(old37_raw)
    
    with open('data/movies_catalog.json') as f:
        curr_cat = json.load(f)
        
    all_series_map = {}
    for m in old37_cat.get('movies', []):
        if m.get('mediaType') == 'series' or m.get('type') == 'Web-Series':
            all_series_map[m['id']] = m
    for m in old_cat.get('movies', []):
        if m.get('mediaType') == 'series' or m.get('type') == 'Web-Series':
            all_series_map[m['id']] = m
    for m in curr_cat.get('movies', []):
        if m.get('mediaType') == 'series' or m.get('type') == 'Web-Series':
            all_series_map[m['id']] = m

    gap_report = []

    for sid, s in sorted(all_series_map.items()):
        title = s.get('title')
        eps = s.get('episodes', [])
        
        # Collect seasons
        season_numbers = set()
        season_episodes = {} # season_num -> list of ep_numbers
        duplicates = []
        seen_eps = set()
        
        for ep in eps:
            s_num = ep.get('season')
            e_num = ep.get('episodeNumber')
            if s_num is not None:
                season_numbers.add(s_num)
                season_episodes.setdefault(s_num, []).append(e_num)
            key = (s_num, e_num)
            if key in seen_eps:
                duplicates.append(key)
            seen_eps.add(key)
            
        sorted_seasons = sorted(list(season_numbers))
        
        # Check missing seasons
        missing_seasons = []
        if sorted_seasons:
            min_s = min(sorted_seasons)
            max_s = max(sorted_seasons)
            for expected_s in range(1, max_s + 1):
                if expected_s not in sorted_seasons:
                    missing_seasons.append(expected_s)
                    
        # Check missing episodes per season
        missing_episodes = {}
        misordered_episodes = {}
        for s_num, ep_nums in season_episodes.items():
            valid_nums = [n for n in ep_nums if isinstance(n, int)]
            if valid_nums:
                # check if misordered
                if valid_nums != sorted(valid_nums):
                    misordered_episodes[s_num] = valid_nums
                max_e = max(valid_nums)
                missing_in_s = [e for e in range(1, max_e + 1) if e not in valid_nums]
                if missing_in_s:
                    missing_episodes[s_num] = missing_in_s
                    
        invalid_streams = []
        for ep in eps:
            if not ep.get('streamUrl'):
                invalid_streams.append({
                    'id': ep.get('id'),
                    'title': ep.get('title'),
                    'season': ep.get('season'),
                    'episode': ep.get('episodeNumber')
                })

        entry = {
            'seriesId': sid,
            'title': title,
            'totalEpisodes': len(eps),
            'seasonsPresent': sorted_seasons,
            'missingSeasons': missing_seasons,
            'missingEpisodes': missing_episodes,
            'duplicateEpisodes': duplicates,
            'misorderedEpisodes': misordered_episodes,
            'invalidStreamsCount': len(invalid_streams),
            'invalidStreams': invalid_streams
        }
        gap_report.append(entry)

    with open('reports/forensic/series_gap_audit.json', 'w') as out:
        json.dump(gap_report, out, indent=2)

    print(f"Generated series gap audit for {len(gap_report)} series.")
    for r in gap_report:
        if r['missingSeasons'] or r['missingEpisodes'] or r['duplicateEpisodes'] or r['misorderedEpisodes']:
            print(f"⚠️ {r['seriesId']} ({r['title']}):")
            if r['missingSeasons']: print(f"   Missing Seasons: {r['missingSeasons']}")
            if r['missingEpisodes']: print(f"   Missing Episodes: {r['missingEpisodes']}")
            if r['duplicateEpisodes']: print(f"   Duplicates: {r['duplicateEpisodes']}")
            if r['misorderedEpisodes']: print(f"   Misordered: {r['misorderedEpisodes']}")

if __name__ == '__main__':
    audit_series()
