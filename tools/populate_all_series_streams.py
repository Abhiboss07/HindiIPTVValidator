#!/usr/bin/env python3
import json
import os
import re

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    catalog_path = os.path.join(repo_root, 'data', 'movies_catalog.json')

    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # 1. Sherlock Holmes - Granada 1080p Full HD
    granada_base = "https://archive.org/download/granada-holmes/The%20Adventures%20Of%20Sherlock%20Holmes%20Season%201%20to%207%20Mp4%201080p/"
    sherlock_s1_eps = [
        "Season%201/Sherlock%20Holmes%20S01E01%20A%20Scandal%20In%20Bohemia.mp4",
        "Season%201/Sherlock%20Holmes%20S01E02%20The%20Dancing%20Men.mp4",
        "Season%201/Sherlock%20Holmes%20S01E03%20The%20Naval%20Treaty.mp4",
        "Season%201/Sherlock%20Holmes%20S01E04%20The%20Solitary%20Cyclist.mp4",
        "Season%201/Sherlock%20Holmes%20S01E05%20The%20Crooked%20Man.mp4",
        "Season%201/Sherlock%20Holmes%20S01E06%20The%20Speckled%20Band.mp4",
        "Season%201/Sherlock%20Holmes%20S01E07%20The%20Blue%20Carbuncle.mp4",
        "Season%202/Sherlock%20Holmes%20S02E01%20The%20Copper%20Beeches.mp4",
        "Season%202/Sherlock%20Holmes%20S02E02%20The%20Greek%20Interpreter.mp4",
        "Season%202/Sherlock%20Holmes%20S02E03%20The%20Norwood%20Builder.mp4",
        "Season%202/Sherlock%20Holmes%20S02E04%20The%20Resident%20Patient.mp4",
        "Season%202/Sherlock%20Holmes%20S02E05%20The%20Red%20Headed%20League.mp4",
        "Season%202/Sherlock%20Holmes%20S02E06%20The%20Final%20Problem.mp4",
        "Season%203/Sherlock%20Holmes%20S03E01%20The%20Empty%20House.mp4",
        "Season%203/Sherlock%20Holmes%20S03E02%20The%20Abbey%20Grange.mp4",
        "Season%203/Sherlock%20Holmes%20S03E03%20The%20Musgrave%20Ritual.mp4"
    ]
    sherlock_s2_eps = [
        "Season%203/Sherlock%20Holmes%20S03E04%20The%20Second%20Stain.mp4",
        "Season%203/Sherlock%20Holmes%20S03E05%20The%20Man%20With%20The%20Twisted%20Lip.mp4",
        "Season%203/Sherlock%20Holmes%20S03E06%20The%20Priory%20School.mp4",
        "Season%203/Sherlock%20Holmes%20S03E07%20The%20Six%20Napoleons.mp4",
        "Season%204/Sherlock%20Holmes%20S04E01%20The%20Sign%20Of%20Four.mp4",
        "Season%204/Sherlock%20Holmes%20S04E02%20The%20Devils%20Foot.mp4",
        "Season%204/Sherlock%20Holmes%20S04E03%20Silver%20Blaze.mp4",
        "Season%204/Sherlock%20Holmes%20S04E04%20Wisteria%20Lodge.mp4",
        "Season%204/Sherlock%20Holmes%20S04E05%20The%20Bruce%20Partington%20Plans.mp4",
        "Season%204/Sherlock%20Holmes%20S04E06%20The%20Hound%20Of%20The%20Baskervilles.mp4",
        "Season%205/Sherlock%20Holmes%20S05E01%20The%20Disappearance%20Of%20Lady%20Frances%20Carfax.mp4",
        "Season%205/Sherlock%20Holmes%20S05E02%20The%20Problem%20Of%20Thor%20Bridge.mp4",
        "Season%205/Sherlock%20Holmes%20S05E03%20Shoscombe%20Old%20Place.mp4",
        "Season%205/Sherlock%20Holmes%20S05E04%20The%20Boscombe%20Valley%20Mystery.mp4",
        "Season%205/Sherlock%20Holmes%20S05E05%20The%20Illustrious%20Client.mp4"
    ]

    # 2. Mirzapur - Direct MP4 Streams
    mirzapur_s2_urls = [
        "https://archive.org/download/s-2-m-1/s2%20m1.mp4",
        "https://archive.org/download/s-2-m-3/s2%20m3.mp4",
        "https://archive.org/download/s-2-m-3/s2%20m3.mp4",
        "https://archive.org/download/s-2-m-4_202412/s2%20m4.mp4",
        "https://archive.org/download/s-2-m-5/s2%20m5.mp4",
        "https://archive.org/download/s-2-m-6/s2%20m6.mp4",
        "https://archive.org/download/s-2-m-7/s2%20m7.mp4",
        "https://archive.org/download/s-2-m-8/s2%20m8.mp4",
        "https://archive.org/download/s-2-m-9/s2%20m9.mp4",
        "https://archive.org/download/s-2-m-10/s2%20m10.mp4"
    ]

    # 3. Panchayat - Direct MP4 Streams
    panchayat_s1_urls = [
        "https://archive.org/download/a2z-panchayat-season-1/E02.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E02.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E03.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E04.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E05.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E06.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E07.mp4",
        "https://archive.org/download/a2z-panchayat-season-1/E08.mp4"
    ]
    panchayat_s3_url = "https://archive.org/download/panchayat-s-03-e-1-8/Panchayat-S03E1-8.mp4"

    # 4. Stranger Things - 720p BluRay
    st_base = "https://archive.org/download/stranger.-things.-s-01.720p.-blu-ray.x-264-galaxy-tv/Stranger.Things.S01.COMPLETE.720p.BluRay.x264-GalaxyTV%5BTGx%5D/"
    st_s1_urls = [
        f"{st_base}Stranger.Things.S01E0{i}.720p.BluRay.x264-GalaxyTV.mp4" for i in range(1, 9)
    ]

    # 5. Breaking Bad - 1080p HD
    bb_base = "https://archive.org/download/BreakingBadSeason11080PHEVC/"
    bb_s1_urls = [
        f"{bb_base}01%20Pilot%20%281080p%20HD%29.mp4",
        f"{bb_base}02%20Cat%27s%20in%20the%20Bag...%20%281080p%20HD%29.mp4",
        f"{bb_base}03%20...And%20the%20Bag%27s%20in%20the%20River%20%281080p%20HD%29.mp4",
        f"{bb_base}04%20Cancer%20Man%20%281080p%20HD%29.mp4",
        f"{bb_base}05%20Gray%20Matter%20%281080p%20HD%29.mp4",
        f"{bb_base}06%20Crazy%20Handful%20of%20Nothin%27%20%281080p%20HD%29.mp4",
        f"{bb_base}07%20A%20No-Rough-Stuff-Type%20Deal%20%281080p%20HD%29.mp4"
    ]

    # 6. Kota Factory - 1080p HD
    kf_base = "https://archive.org/download/Kota-Factory-Season-2/"
    kf_s2_urls = [
        f"{kf_base}Kota.Factory.S02E01.Reasoning.1080p.NF.10bit.DDP.5.1.x265.%5BHashMiner%5D.mp4",
        f"{kf_base}Kota.Factory.S02E02.Control.System.1080p.NF.10bit.DDP.5.1.x265.%5BHashMiner%5D.mp4",
        f"{kf_base}Kota.Factory.S02E03.Atmospheric.Pressure.1080p.NF.10bit.DDP.5.1.x265.%5BHashMiner%5D.mp4",
        f"{kf_base}Kota.Factory.S02E04.Repair.And.Maintenance.1080p.NF.10bit.DDP.5.1.x265.%5BHashMiner%5D.mp4",
        f"{kf_base}Kota.Factory.S02E05.Packaging.1080p.NF.10bit.DDP.5.1.x265.%5BHashMiner%5D.mp4"
    ]

    # 7. Sacred Games - 720p HD
    sg_base = "https://archive.org/download/sacred-games-s02.-hevc/"
    sg_s2_urls = [
        f"{sg_base}World4ufree1.sbs_SacredGamesS02.E0{i}.HEVC.mp4" for i in range(1, 9)
    ]

    # 8. Farzi - 1080p/2k HD
    farzi_base = "https://archive.org/download/farzi-s-1-ep-all-hindi-2k/"
    farzi_s1_urls = [
        f"{farzi_base}Farzi%20S1%20EP{i}%20%28%20Hindi%202k%20%29.mp4" for i in range(1, 9)
    ]

    # 9. Money Heist - Direct MP4
    mh_base = "https://archive.org/download/money-heist-season-02/"
    mh_s2_urls = [
        f"{mh_base}Money%20Heist%20S02%20E0{i}.mp4" for i in range(1, 10)
    ]

    # 10. Scam 1992 - 720p HD
    scam_url = "https://archive.org/download/scam-1992-the-harshad-mehta-story-2020-hindi-season-1-720p/Scam_1992_the_Harshad_Mehta_Story_%282020%29_Hindi_Season_1_720p.mp4"

    # 11. The Family Man - Direct MP4
    family_man_url = "https://archive.org/download/the-family-man-2019/The_Family_Man_%282019%29.mp4"

    # 12. Paatal Lok - Direct MP4
    paatal_lok_url = "https://archive.org/download/paatal-lok-2025-amazon-prime-s-02-e-05-08-hindi-720p-web-dl-filmy-dhoom.com/Paatal_Lok_2025_Amazon_Prime_S02E01-04.mp4"

    # 13. Game of Thrones - Official 1080p HBO Trailer
    got_trailer_url = "https://archive.org/download/game-of-thrones-official-series-trailer-hbo-1080-p-hd/Game%20of%20Thrones%20_%20Official%20Series%20Trailer%20%28HBO%29%281080P_HD%29.mp4"

    for movie in catalog.get('movies', []):
        mid = movie.get('id')

        if mid == 'series_sherlock_holmes':
            movie['qualityHonestBadge'] = '1080p Full HD'
            movie['resolution'] = '1080p (1920x1080)'
            movie['qualityClass'] = 'FULL HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = granada_base + sherlock_s1_eps[0]
            for s in movie.get('seasons', []):
                snum = int(s.get('seasonNumber', 1))
                eps_list = sherlock_s1_eps if snum == 1 else sherlock_s2_eps
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = granada_base + eps_list[idx % len(eps_list)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = '1080p Full HD'

        elif mid == 'series_mirzapur':
            movie['qualityHonestBadge'] = 'HD 720p'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = mirzapur_s2_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = mirzapur_s2_urls[idx % len(mirzapur_s2_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = 'HD 720p'

        elif mid == 'series_panchayat':
            movie['qualityHonestBadge'] = 'HD 720p'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = panchayat_s1_urls[0]
            for s in movie.get('seasons', []):
                snum = int(s.get('seasonNumber', 1))
                for idx, ep in enumerate(s.get('episodes', [])):
                    if snum == 3:
                        ep['streamUrl'] = panchayat_s3_url
                    else:
                        ep['streamUrl'] = panchayat_s1_urls[idx % len(panchayat_s1_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = 'HD 720p'

        elif mid == 'series_stranger_things':
            movie['qualityHonestBadge'] = '720p BluRay'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = st_s1_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = st_s1_urls[idx % len(st_s1_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = '720p BluRay'

        elif mid == 'series_breaking_bad':
            movie['qualityHonestBadge'] = '1080p Full HD'
            movie['resolution'] = '1080p (1920x1080)'
            movie['qualityClass'] = 'FULL HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = bb_s1_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = bb_s1_urls[idx % len(bb_s1_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = '1080p Full HD'

        elif mid == 'series_kota_factory':
            movie['qualityHonestBadge'] = '1080p Full HD'
            movie['resolution'] = '1080p (1920x1080)'
            movie['qualityClass'] = 'FULL HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = kf_s2_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = kf_s2_urls[idx % len(kf_s2_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = '1080p Full HD'

        elif mid == 'series_sacred_games':
            movie['qualityHonestBadge'] = '720p HD'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = sg_s2_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = sg_s2_urls[idx % len(sg_s2_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = '720p HD'

        elif mid == 'series_farzi':
            movie['qualityHonestBadge'] = '1080p HD'
            movie['resolution'] = '1080p (1920x1080)'
            movie['qualityClass'] = 'FULL HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = farzi_s1_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = farzi_s1_urls[idx % len(farzi_s1_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = '1080p HD'

        elif mid == 'series_money_heist':
            movie['qualityHonestBadge'] = 'HD 720p'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = mh_s2_urls[0]
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = mh_s2_urls[idx % len(mh_s2_urls)]
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = 'HD 720p'

        elif mid == 'series_scam_1992':
            movie['qualityHonestBadge'] = 'HD 720p'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = scam_url
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = scam_url
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = 'HD 720p'

        elif mid == 'series_family_man':
            movie['qualityHonestBadge'] = 'HD 720p'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = family_man_url
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = family_man_url
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = 'HD 720p'

        elif mid == 'series_paatal_lok':
            movie['qualityHonestBadge'] = 'HD 720p'
            movie['resolution'] = '720p (1280x720)'
            movie['qualityClass'] = 'HD'
            movie['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            movie['streamUrl'] = paatal_lok_url
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = paatal_lok_url
                    ep['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
                    ep['qualityHonestBadge'] = 'HD 720p'

        elif mid == 'series_game_of_thrones':
            movie['qualityHonestBadge'] = '1080p Trailer'
            movie['resolution'] = '1080p (1920x1080)'
            movie['qualityClass'] = 'FULL HD'
            movie['sourceState'] = 'TRAILER_ONLY'
            movie['trailerUrl'] = got_trailer_url
            movie['streamUrl'] = None
            for s in movie.get('seasons', []):
                for idx, ep in enumerate(s.get('episodes', [])):
                    ep['streamUrl'] = None
                    ep['trailerUrl'] = got_trailer_url
                    ep['sourceState'] = 'TRAILER_ONLY'
                    ep['qualityHonestBadge'] = '1080p Trailer'

        # Also sync flat episodes array if present
        if movie.get('seasons') and movie.get('episodes'):
            all_eps = []
            for s in movie['seasons']:
                all_eps.extend(s.get('episodes', []))
            movie['episodes'] = all_eps

    # Save to data/movies_catalog.json
    with open(catalog_path, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"✅ Updated {catalog_path}")

    # Copy to android_app/src/main/assets/data/movies_catalog.json
    android_catalog_path = os.path.join(repo_root, 'android_app', 'src', 'main', 'assets', 'data', 'movies_catalog.json')
    os.makedirs(os.path.dirname(android_catalog_path), exist_ok=True)
    with open(android_catalog_path, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"✅ Updated {android_catalog_path}")

    # Now synchronize DEFAULT_MOVIES_CATALOG in app.js files and bump version to 7
    movies = catalog.get('movies', [])
    catalog_json_str = json.dumps(movies, separators=(',', ':'), ensure_ascii=False)

    app_js_files = [
        os.path.join(repo_root, 'assets', 'app.js'),
        os.path.join(repo_root, 'android_app', 'src', 'main', 'assets', 'assets', 'app.js')
    ]

    for app_js_path in app_js_files:
        with open(app_js_path, 'r', encoding='utf-8') as f:
            content = f.read()

        cat_pattern = re.compile(r'const DEFAULT_MOVIES_CATALOG = \[.*?\];\nconst CatalogProvider = {', re.DOTALL)
        replacement = f"const DEFAULT_MOVIES_CATALOG = {catalog_json_str};\nconst CatalogProvider = {{"
        if cat_pattern.search(content):
            content = cat_pattern.sub(replacement, content, count=1)
            print(f"  ✅ Updated DEFAULT_MOVIES_CATALOG in {app_js_path}")
        else:
            print(f"  ⚠️ Could not find DEFAULT_MOVIES_CATALOG pattern in {app_js_path}")

        content = re.sub(
            r'const CURRENT_CATALOG_VERSION = \d+;',
            'const CURRENT_CATALOG_VERSION = 7;',
            content
        )
        print(f"  ✅ Bumped CURRENT_CATALOG_VERSION to 7 in {app_js_path}")

        with open(app_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Saved {app_js_path}")

if __name__ == '__main__':
    main()
