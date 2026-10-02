#!/usr/bin/env python3
import json
import sys

def get_content_classification(item):
    if not item:
        return {
            'kind': 'movie',
            'isSeries': False,
            'isMovie': True,
            'isTrailer': False,
            'isCompleteContent': False,
            'label': 'Cinema',
            'typeLabel': 'Cinema',
            'badgeLabel': 'HD',
            'subtext': 'Feature',
            'seasonsCount': 0,
            'episodesCount': 0,
            'playableEpisodesCount': 0
        }

    has_episodes = isinstance(item.get('episodes'), list) and len(item['episodes']) > 0
    has_seasons = isinstance(item.get('seasons'), list) and len(item['seasons']) > 0
    is_explicit_series = (
        item.get('mediaType') == 'series' or
        item.get('contentType') == 'SERIES' or
        item.get('type') in ['Web-Series', 'K-Drama', 'C-Drama', 'Anime Series']
    )
    is_series = is_explicit_series or has_episodes or has_seasons

    is_explicit_trailer = not is_series and (
        item.get('mediaType') == 'trailer' or
        item.get('contentType') == 'TRAILER' or
        item.get('type') == 'Trailer' or
        (isinstance(item.get('id'), str) and item['id'].startswith('trailer_'))
    )

    if is_series:
        active_episodes = [
            e for e in item.get('episodes', [])
            if (e.get('streamUrl') and e['streamUrl'].strip()) or (e.get('url') and e['url'].strip())
        ] if has_episodes else []
        has_playable = len(active_episodes) > 0 or bool(item.get('streamUrl') and item['streamUrl'].strip())

        num_seasons = len(item['seasons']) if has_seasons else 1
        num_eps = len(item.get('episodes', [])) if has_episodes else 0

        if num_seasons > 1 and num_eps > 0:
            season_ep_label = f'{num_seasons} Seasons • {num_eps} Episodes'
        elif num_eps > 0:
            season_ep_label = f'{num_eps} Episodes'
        elif num_seasons > 1:
            season_ep_label = f'{num_seasons} Seasons'
        else:
            season_ep_label = 'Web-Series'

        qb = (item.get('qualityHonestBadge') or '').strip()
        res = (item.get('resolution') or '').strip()
        qc = (item.get('qualityClass') or '').upper()

        if qb and 'trailer' not in qb.lower():
            badge = qb
        elif res and 'trailer' not in res.lower():
            badge = res.split(' ')[0]
        elif qc in ['4K', 'UHD']:
            badge = '4K UHD'
        elif qc in ['FULL HD'] or '1080' in qc:
            badge = '1080p FHD'
        elif qc in ['HD'] or '720' in qc:
            badge = '720p HD'
        elif has_playable:
            badge = '1080p FHD'
        else:
            badge = 'Web-Series'

        return {
            'kind': 'series',
            'isSeries': True,
            'isMovie': False,
            'isTrailer': False,
            'isCompleteContent': has_playable,
            'label': 'Complete Web Series' if has_playable else 'Web Series',
            'typeLabel': 'Series',
            'badgeLabel': badge,
            'subtext': season_ep_label,
            'seasonsCount': num_seasons,
            'episodesCount': num_eps,
            'playableEpisodesCount': len(active_episodes)
        }

    if is_explicit_trailer:
        return {
            'kind': 'trailer',
            'isSeries': False,
            'isMovie': False,
            'isTrailer': True,
            'isCompleteContent': False,
            'label': 'Official Trailer',
            'typeLabel': 'Trailer',
            'badgeLabel': 'Official Trailer',
            'subtext': 'Trailer',
            'seasonsCount': 0,
            'episodesCount': 0,
            'playableEpisodesCount': 0
        }

    cats = item.get('categories') or []
    is_short = bool(item.get('isShortFilm') or 'short' in cats or 'open_movie' in cats)
    is_upcoming_or_trailer = bool(
        item.get('isTrailerOnly') or
        item.get('sourceState') == 'UPCOMING_TRAILER' or
        (item.get('sourceState') == 'TRAILER_ONLY' and not item.get('streamUrl'))
    )

    qb = (item.get('qualityHonestBadge') or '').lower()
    qc = (item.get('qualityClass') or '').upper()
    res = (item.get('resolution') or '').lower()
    s_url = (item.get('streamUrl') or '').lower()

    if is_upcoming_or_trailer:
        badge = 'Official Trailer'
    elif is_short:
        badge = '4K Short' if ('4k' in qb or qc == '4K' or '4k' in res) else 'Short Film'
    elif '4k' in qb or '2160' in qb or qc in ['4K', 'UHD'] or '2160' in res or '4k' in res or '2160p' in s_url:
        badge = '4K UHD'
    elif '1080' in qb or qc in ['FULL HD'] or '1080' in qc or '1080' in res or 'fhd' in res or '1080p' in s_url or 'bluray' in s_url:
        badge = '1080p'
    elif '720' in qb or qc in ['HD'] or '720' in qc or '720' in res or '720p' in s_url:
        badge = '720p HD'
    elif item.get('qualityHonestBadge') and 'trailer' not in item.get('qualityHonestBadge', '').lower():
        badge = item['qualityHonestBadge']
    else:
        badge = 'HD'

    return {
        'kind': 'trailer' if is_upcoming_or_trailer else 'movie',
        'isSeries': False,
        'isMovie': True,
        'isTrailer': is_upcoming_or_trailer,
        'isCompleteContent': not is_upcoming_or_trailer and bool(item.get('streamUrl')),
        'label': 'Official Trailer' if is_upcoming_or_trailer else ('Short Film' if is_short else 'Cinema'),
        'typeLabel': 'Short Film' if is_short else ('Trailer' if is_upcoming_or_trailer else 'Cinema'),
        'badgeLabel': badge,
        'subtext': 'Short Film' if is_short else ('Trailer' if is_upcoming_or_trailer else (item.get('durationFormatted') or 'Feature')),
        'seasonsCount': 0,
        'episodesCount': 0,
        'playableEpisodesCount': 0
    }

def main():
    target_files = ['data/movies_catalog.json', 'android_app/src/main/assets/data/movies_catalog.json']
    all_passed = True

    for fpath in target_files:
        print(f"\n==========================================")
        print(f"Auditing catalog: {fpath}")
        print(f"==========================================")
        with open(fpath, 'r', encoding='utf-8') as f:
            catalog = json.load(f)

        movies = catalog.get('movies', [])
        print(f"Total catalog items: {len(movies)}")

        series_with_trailer_badge = []
        series_classified_as_trailer = []
        movies_classified_as_series = []
        playable_series_missing_content = []

        for m in movies:
            mid = m.get('id', '')
            c = get_content_classification(m)

            # Rule 1: A series must never have a trailer badge
            if c['isSeries'] and 'trailer' in c['badgeLabel'].lower():
                series_with_trailer_badge.append((mid, m.get('title'), c['badgeLabel']))

            # Rule 2: A series must never have kind='trailer' or isTrailer=True
            if c['isSeries'] and (c['kind'] == 'trailer' or c['isTrailer']):
                series_classified_as_trailer.append((mid, m.get('title')))

            # Rule 3: Known series must be classified as series
            if mid.startswith('series_') and not c['isSeries']:
                movies_classified_as_series.append((mid, m.get('title')))

            # Rule 4: Known complete series must have isCompleteContent=True
            if mid in ['series_gullak', 'series_panchayat', 'series_stranger_things', 'series_mirzapur', 'series_breaking_bad']:
                if not c['isCompleteContent']:
                    playable_series_missing_content.append((mid, m.get('title')))

        # Suzume check
        suzume = next((m for m in movies if 'suzume' in m.get('id', '').lower()), None)
        if suzume:
            sc = get_content_classification(suzume)
            print(f"Suzume Classification: kind={sc['kind']}, isMovie={sc['isMovie']}, isCompleteContent={sc['isCompleteContent']}, badge={sc['badgeLabel']}")
            if not sc['isMovie'] or not sc['isCompleteContent'] or 'trailer' in sc['badgeLabel'].lower():
                print("❌ FAIL: Suzume misclassified!")
                all_passed = False
            else:
                print("✅ PASS: Suzume correctly classified as 1080p full movie")

        # Gullak check
        gullak = next((m for m in movies if m.get('id') == 'series_gullak'), None)
        if gullak:
            gc = get_content_classification(gullak)
            print(f"Gullak Classification: kind={gc['kind']}, isSeries={gc['isSeries']}, badge={gc['badgeLabel']}, subtext={gc['subtext']}")
            if not gc['isSeries'] or 'trailer' in gc['badgeLabel'].lower():
                print("❌ FAIL: Gullak misclassified with trailer badge!")
                all_passed = False
            else:
                print(f"✅ PASS: Gullak correctly classified as Series with '{gc['badgeLabel']}' ({gc['subtext']})")

        # Panchayat check
        panchayat = next((m for m in movies if m.get('id') == 'series_panchayat'), None)
        if panchayat:
            pc = get_content_classification(panchayat)
            print(f"Panchayat Classification: kind={pc['kind']}, isSeries={pc['isSeries']}, badge={pc['badgeLabel']}, subtext={pc['subtext']}")
            if not pc['isSeries'] or 'trailer' in pc['badgeLabel'].lower():
                print("❌ FAIL: Panchayat misclassified with trailer badge!")
                all_passed = False
            else:
                print(f"✅ PASS: Panchayat correctly classified as Series with '{pc['badgeLabel']}' ({pc['subtext']})")

        # Genuine trailer check
        trailer = next((m for m in movies if m.get('id') == 'trailer_bhool_bhulaiyaa_3_2024'), None)
        if trailer:
            tc = get_content_classification(trailer)
            print(f"Bhool Bhulaiyaa 3 Trailer: kind={tc['kind']}, isTrailer={tc['isTrailer']}, badge={tc['badgeLabel']}")
            if not tc['isTrailer']:
                print("❌ FAIL: Explicit trailer not classified as trailer!")
                all_passed = False
            else:
                print("✅ PASS: Explicit trailer correctly classified")

        # Results summary
        if series_with_trailer_badge:
            print(f"❌ FAIL: {len(series_with_trailer_badge)} series have trailer badges: {series_with_trailer_badge}")
            all_passed = False
        else:
            print("✅ PASS: Zero series have trailer badges!")

        if series_classified_as_trailer:
            print(f"❌ FAIL: {len(series_classified_as_trailer)} series classified as trailers: {series_classified_as_trailer}")
            all_passed = False
        else:
            print("✅ PASS: Zero series classified as trailers!")

        if movies_classified_as_series:
            print(f"❌ FAIL: {len(movies_classified_as_series)} items misclassified: {movies_classified_as_series}")
            all_passed = False
        else:
            print("✅ PASS: All series_ IDs recognized as series!")

        if playable_series_missing_content:
            print(f"❌ FAIL: Complete series missing playable content: {playable_series_missing_content}")
            all_passed = False
        else:
            print("✅ PASS: All core complete series verified playable!")

    if all_passed:
        print("\n🎉 ALL CATALOG CLASSIFICATION AUDITS PASSED 100%!")
        sys.exit(0)
    else:
        print("\n❌ AUDIT FAILED - Fix issues above!")
        sys.exit(1)

if __name__ == '__main__':
    main()
