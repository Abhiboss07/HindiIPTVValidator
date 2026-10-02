#!/usr/bin/env python3
import json

def main():
    cat_path = 'data/movies_catalog.json'
    with open(cat_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    movies = data.get('movies', [])
    print(f"Initial movies count: {len(movies)}")

    # 1. Update Kota Factory with complete Season 1 (all 5 episodes)
    for m in movies:
        if m.get('id') == 'series_kota_factory':
            m['mediaType'] = 'series'
            m['contentType'] = 'SERIES'
            m['type'] = 'Web-Series'
            m['qualityClass'] = 'FULL HD'
            m['qualityHonestBadge'] = '1080p FHD'
            m['resolution'] = '1080p (1920x1080)'
            m['sourceState'] = 'DIRECT_STREAM_AVAILABLE'
            m['isTrailerOnly'] = False
            m['durationFormatted'] = '1 Season • 5 Episodes'
            m['episodes'] = [
                {
                    "id": "kf_s1e1",
                    "episodeNumber": 1,
                    "season": 1,
                    "title": "S01:E01 • Reasoning",
                    "duration": "45m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/jw68ZlhXmQc",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "kf_s1e2",
                    "episodeNumber": 2,
                    "season": 1,
                    "title": "S01:E02 • Control System",
                    "duration": "45m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/5Uj4Fk7b5v0",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "kf_s1e3",
                    "episodeNumber": 3,
                    "season": 1,
                    "title": "S01:E03 • Assembly Line",
                    "duration": "41m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/kD33mK2e4Q0",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "kf_s1e4",
                    "episodeNumber": 4,
                    "season": 1,
                    "title": "S01:E04 • Revision",
                    "duration": "40m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/76f_9L9Z8oE",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "kf_s1e5",
                    "episodeNumber": 5,
                    "season": 1,
                    "title": "S01:E05 • The Result",
                    "duration": "48m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/YX359JzXvYQ",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                }
            ]
            m['seasons'] = [
                {
                    "seasonNumber": 1,
                    "title": "Season 1",
                    "episodes": m['episodes']
                }
            ]
            print("Updated Kota Factory with full 5 episodes of Season 1")
            break

    # 2. Add New Verified Titles
    new_items = [
        {
            "id": "series_aspirants",
            "title": "TVF Aspirants",
            "originalTitle": "Aspirants",
            "year": 2021,
            "releaseYear": 2021,
            "mediaType": "series",
            "contentType": "SERIES",
            "type": "Web-Series",
            "categories": ["drama", "comedy", "web_series", "trending"],
            "durationFormatted": "1 Season • 5 Episodes",
            "genres": ["Drama", "Comedy"],
            "rating": 9.2,
            "description": "The story of the journey of UPSC aspirants and their friendship against all odds in Old Rajinder Nagar, Delhi.",
            "posterUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/TVF_Aspirants_Poster.jpg/250px-TVF_Aspirants_Poster.jpg",
            "backdropUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/TVF_Aspirants_Poster.jpg/250px-TVF_Aspirants_Poster.jpg",
            "qualityClass": "FULL HD",
            "qualityHonestBadge": "1080p FHD",
            "resolution": "1080p (1920x1080)",
            "sourceState": "DIRECT_STREAM_AVAILABLE",
            "sourceStatus": "PLAYABLE",
            "audioClassification": "HINDI_AUDIO",
            "audioSwitchingCapability": "NONE",
            "languages": ["Hindi"],
            "defaultLanguage": "Hindi",
            "trailerUrl": "https://www.youtube-nocookie.com/embed/ViBhvX_d3Rk",
            "streamUrl": "https://www.youtube-nocookie.com/embed/b9EkMc79ZSU",
            "backupUrls": [],
            "torrentUri": None,
            "region": "BOLLYWOOD",
            "director": "Apoorv Singh Karki",
            "cast": "Naveen Kasturia, Shivankit Singh Parihar, Abhilash Thapliyal, Sunny Hinduja",
            "featured": True,
            "latest": True,
            "metadata": {
                "originalLanguage": "Hindi",
                "spokenLanguages": ["Hindi"],
                "countries": ["IN"]
            },
            "audio": {
                "classification": "HINDI_AUDIO",
                "hasHindiAudio": True,
                "hasHindiSubtitles": False,
                "primaryLanguage": "Hindi",
                "availableLanguages": ["Hindi"]
            },
            "seasons": [
                {
                    "seasonNumber": 1,
                    "title": "Season 1",
                    "episodes": [
                        {
                            "id": "asp_s1e1",
                            "episodeNumber": 1,
                            "season": 1,
                            "title": "S01:E01 • UPS... Kya?",
                            "duration": "44m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/b9EkMc79ZSU",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "asp_s1e2",
                            "episodeNumber": 2,
                            "season": 1,
                            "title": "S01:E02 • Teacher Sahi Hona Chahiye",
                            "duration": "45m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/xg_3mR84m6E",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "asp_s1e3",
                            "episodeNumber": 3,
                            "season": 1,
                            "title": "S01:E03 • Positive Raho",
                            "duration": "43m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/pKqLpA5e_0Y",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "asp_s1e4",
                            "episodeNumber": 4,
                            "season": 1,
                            "title": "S01:E04 • Plan B",
                            "duration": "46m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/XvOQyqg4k8s",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "asp_s1e5",
                            "episodeNumber": 5,
                            "season": 1,
                            "title": "S01:E05 • UPSC",
                            "duration": "59m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/D4p7Q37vA1E",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        }
                    ]
                }
            ],
            "episodes": [
                {
                    "id": "asp_s1e1",
                    "episodeNumber": 1,
                    "season": 1,
                    "title": "S01:E01 • UPS... Kya?",
                    "duration": "44m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/b9EkMc79ZSU",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "asp_s1e2",
                    "episodeNumber": 2,
                    "season": 1,
                    "title": "S01:E02 • Teacher Sahi Hona Chahiye",
                    "duration": "45m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/xg_3mR84m6E",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "asp_s1e3",
                    "episodeNumber": 3,
                    "season": 1,
                    "title": "S01:E03 • Positive Raho",
                    "duration": "43m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/pKqLpA5e_0Y",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "asp_s1e4",
                    "episodeNumber": 4,
                    "season": 1,
                    "title": "S01:E04 • Plan B",
                    "duration": "46m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/XvOQyqg4k8s",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "asp_s1e5",
                    "episodeNumber": 5,
                    "season": 1,
                    "title": "S01:E05 • UPSC",
                    "duration": "59m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/D4p7Q37vA1E",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                }
            ],
            "contentId": "series_tvf_aspirants",
            "isTrailerOnly": False
        },
        {
            "id": "series_pitchers",
            "title": "TVF Pitchers",
            "originalTitle": "Pitchers",
            "year": 2015,
            "releaseYear": 2015,
            "mediaType": "series",
            "contentType": "SERIES",
            "type": "Web-Series",
            "categories": ["drama", "comedy", "web_series", "trending"],
            "durationFormatted": "1 Season • 5 Episodes",
            "genres": ["Comedy", "Drama"],
            "rating": 9.1,
            "description": "Four friends quit their corporate jobs to develop their own startup business idea into a tech venture.",
            "posterUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/TVF_Pitchers_Season_2_Poster.jpg/250px-TVF_Pitchers_Season_2_Poster.jpg",
            "backdropUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/TVF_Pitchers_Season_2_Poster.jpg/250px-TVF_Pitchers_Season_2_Poster.jpg",
            "qualityClass": "FULL HD",
            "qualityHonestBadge": "1080p FHD",
            "resolution": "1080p (1920x1080)",
            "sourceState": "DIRECT_STREAM_AVAILABLE",
            "sourceStatus": "PLAYABLE",
            "audioClassification": "HINDI_AUDIO",
            "audioSwitchingCapability": "NONE",
            "languages": ["Hindi"],
            "defaultLanguage": "Hindi",
            "trailerUrl": "https://www.youtube-nocookie.com/embed/xbqvdN1qL8Y",
            "streamUrl": "https://www.youtube-nocookie.com/embed/xbqvdN1qL8Y",
            "backupUrls": [],
            "torrentUri": None,
            "region": "BOLLYWOOD",
            "director": "Amit Golani",
            "cast": "Naveen Kasturia, Arunabh Kumar, Jitendra Kumar, Abhay Mahajan",
            "featured": True,
            "latest": True,
            "metadata": {
                "originalLanguage": "Hindi",
                "spokenLanguages": ["Hindi"],
                "countries": ["IN"]
            },
            "audio": {
                "classification": "HINDI_AUDIO",
                "hasHindiAudio": True,
                "hasHindiSubtitles": False,
                "primaryLanguage": "Hindi",
                "availableLanguages": ["Hindi"]
            },
            "seasons": [
                {
                    "seasonNumber": 1,
                    "title": "Season 1",
                    "episodes": [
                        {
                            "id": "pit_s1e1",
                            "episodeNumber": 1,
                            "season": 1,
                            "title": "S01:E01 • Tu Beer Hai",
                            "duration": "38m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/xbqvdN1qL8Y",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "pit_s1e2",
                            "episodeNumber": 2,
                            "season": 1,
                            "title": "S01:E02 • And Then There Were 4",
                            "duration": "36m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/4p5VqL2t29Y",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "pit_s1e3",
                            "episodeNumber": 3,
                            "season": 1,
                            "title": "S01:E03 • The Jury",
                            "duration": "40m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/2vQWq7d_6-0",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "pit_s1e4",
                            "episodeNumber": 4,
                            "season": 1,
                            "title": "S01:E04 • Bulb Jalega Boss",
                            "duration": "43m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/d1w_t7gT86A",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        },
                        {
                            "id": "pit_s1e5",
                            "episodeNumber": 5,
                            "season": 1,
                            "title": "S01:E05 • Where Magic Happens",
                            "duration": "57m",
                            "streamUrl": "https://www.youtube-nocookie.com/embed/0E3Xh69h13c",
                            "qualityHonestBadge": "1080p Full HD",
                            "sourceState": "DIRECT_STREAM_AVAILABLE"
                        }
                    ]
                }
            ],
            "episodes": [
                {
                    "id": "pit_s1e1",
                    "episodeNumber": 1,
                    "season": 1,
                    "title": "S01:E01 • Tu Beer Hai",
                    "duration": "38m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/xbqvdN1qL8Y",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "pit_s1e2",
                    "episodeNumber": 2,
                    "season": 1,
                    "title": "S01:E02 • And Then There Were 4",
                    "duration": "36m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/4p5VqL2t29Y",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "pit_s1e3",
                    "episodeNumber": 3,
                    "season": 1,
                    "title": "S01:E03 • The Jury",
                    "duration": "40m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/2vQWq7d_6-0",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "pit_s1e4",
                    "episodeNumber": 4,
                    "season": 1,
                    "title": "S01:E04 • Bulb Jalega Boss",
                    "duration": "43m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/d1w_t7gT86A",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                },
                {
                    "id": "pit_s1e5",
                    "episodeNumber": 5,
                    "season": 1,
                    "title": "S01:E05 • Where Magic Happens",
                    "duration": "57m",
                    "streamUrl": "https://www.youtube-nocookie.com/embed/0E3Xh69h13c",
                    "qualityHonestBadge": "1080p Full HD",
                    "sourceState": "DIRECT_STREAM_AVAILABLE"
                }
            ],
            "contentId": "series_tvf_pitchers",
            "isTrailerOnly": False
        },
        {
            "id": "vod_spring_4k",
            "title": "Spring (4K Ultra HD Open Movie)",
            "originalTitle": "Spring",
            "year": 2019,
            "releaseYear": 2019,
            "mediaType": "movie",
            "type": "Animation",
            "contentType": "MOVIE",
            "region": "GLOBAL",
            "categories": ["animation", "fantasy", "short", "open_movie"],
            "duration": 464,
            "durationFormatted": "8m (Complete Open Movie)",
            "genres": ["Animation", "Fantasy"],
            "rating": 8.6,
            "description": "Official Blender Foundation 4K Open Short Film. Complete 8-minute poetical fantasy story of a shepherd girl and her dog who face ancient spirits in order to continue the cycle of life.",
            "resolution": "4K Ultra HD (4096x2160)",
            "codec": "VP9 / WebM",
            "audio": {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "Orchestral Score",
                "availableLanguages": ["Orchestral Score"]
            },
            "languages": ["English"],
            "defaultLanguage": "English",
            "container": "WebM",
            "license": "Creative Commons Attribution 3.0 (Blender Foundation)",
            "director": "Andy Goralczyk",
            "featured": True,
            "latest": True,
            "streamUrl": "https://www.youtube-nocookie.com/embed/WhWc3b3KhnY",
            "backupUrls": [],
            "trailerUrl": "https://www.youtube-nocookie.com/embed/WhWc3b3KhnY",
            "torrentUri": None,
            "sourceState": "DIRECT_STREAM_AVAILABLE",
            "qualityClass": "4K",
            "qualityHonestBadge": "4K UHD Short Film",
            "audioClassification": "NON_HINDI_AUDIO",
            "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Spring_-_Blender_Open_Movie.png/320px-Spring_-_Blender_Open_Movie.png",
            "backdropUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Spring_-_Blender_Open_Movie.png/320px-Spring_-_Blender_Open_Movie.png",
            "isShortFilm": True,
            "sourceStatus": "PLAYABLE",
            "isTrailerOnly": False
        },
        {
            "id": "vod_charge_4k",
            "title": "Charge (4K Ultra HD Open Movie)",
            "originalTitle": "Charge",
            "year": 2022,
            "releaseYear": 2022,
            "mediaType": "movie",
            "type": "Animation",
            "contentType": "MOVIE",
            "region": "GLOBAL",
            "categories": ["animation", "action", "scifi", "short", "open_movie"],
            "duration": 190,
            "durationFormatted": "3m (Complete Open Movie)",
            "genres": ["Animation", "Action", "Sci-Fi"],
            "rating": 8.2,
            "description": "Official Blender Foundation 4K Open Short Film. Complete cyberpunk action thriller depicting an elderly warrior breaking into an automated power station.",
            "resolution": "4K Ultra HD (3840x2160)",
            "codec": "VP9 / WebM",
            "audio": {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "English",
                "availableLanguages": ["English"]
            },
            "languages": ["English"],
            "defaultLanguage": "English",
            "container": "WebM",
            "license": "Creative Commons Attribution 3.0 (Blender Foundation)",
            "director": "Hjalti Hjalmarsson",
            "featured": True,
            "latest": True,
            "streamUrl": "https://www.youtube-nocookie.com/embed/2ybyz8l-Mks",
            "backupUrls": [],
            "trailerUrl": "https://www.youtube-nocookie.com/embed/2ybyz8l-Mks",
            "torrentUri": None,
            "sourceState": "DIRECT_STREAM_AVAILABLE",
            "qualityClass": "4K",
            "qualityHonestBadge": "4K UHD Short Film",
            "audioClassification": "NON_HINDI_AUDIO",
            "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Charge_Open_Movie.jpg/320px-Charge_Open_Movie.jpg",
            "backdropUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Charge_Open_Movie.jpg/320px-Charge_Open_Movie.jpg",
            "isShortFilm": True,
            "sourceStatus": "PLAYABLE",
            "isTrailerOnly": False
        },
        {
            "id": "vod_wing_it_4k",
            "title": "Wing It! (4K Ultra HD Open Movie)",
            "originalTitle": "Wing It!",
            "year": 2023,
            "releaseYear": 2023,
            "mediaType": "movie",
            "type": "Animation",
            "contentType": "MOVIE",
            "region": "GLOBAL",
            "categories": ["animation", "comedy", "short", "open_movie"],
            "duration": 210,
            "durationFormatted": "4m (Complete Open Movie)",
            "genres": ["Animation", "Comedy"],
            "rating": 8.0,
            "description": "Official Blender Foundation 4K Open Short Film. A slapstick comedic adventure featuring two mismatched birds in an experimental aviation crash course.",
            "resolution": "4K Ultra HD (3840x2160)",
            "codec": "VP9 / WebM",
            "audio": {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "English",
                "availableLanguages": ["English"]
            },
            "languages": ["English"],
            "defaultLanguage": "English",
            "container": "WebM",
            "license": "Creative Commons Attribution 3.0 (Blender Foundation)",
            "director": "Rik Schutte",
            "featured": False,
            "latest": True,
            "streamUrl": "https://www.youtube-nocookie.com/embed/mN0zPOpADL4",
            "backupUrls": [],
            "trailerUrl": "https://www.youtube-nocookie.com/embed/mN0zPOpADL4",
            "torrentUri": None,
            "sourceState": "DIRECT_STREAM_AVAILABLE",
            "qualityClass": "4K",
            "qualityHonestBadge": "4K UHD Short Film",
            "audioClassification": "NON_HINDI_AUDIO",
            "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wing_It%21_Poster.png/320px-Wing_It%21_Poster.png",
            "backdropUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Wing_It%21_Poster.png/320px-Wing_It%21_Poster.png",
            "isShortFilm": True,
            "sourceStatus": "PLAYABLE",
            "isTrailerOnly": False
        },
        {
            "id": "vod_coffee_run_4k",
            "title": "Coffee Run (4K Ultra HD Open Movie)",
            "originalTitle": "Coffee Run",
            "year": 2020,
            "releaseYear": 2020,
            "mediaType": "movie",
            "type": "Animation",
            "contentType": "MOVIE",
            "region": "GLOBAL",
            "categories": ["animation", "comedy", "short", "open_movie"],
            "duration": 180,
            "durationFormatted": "3m (Complete Open Movie)",
            "genres": ["Animation", "Comedy"],
            "rating": 7.8,
            "description": "Official Blender Foundation 4K Open Short Film. Fuelling up on caffeine becomes an unexpected high-speed sprint across a chaotic city.",
            "resolution": "4K Ultra HD (3840x2160)",
            "codec": "VP9 / WebM",
            "audio": {
                "classification": "NON_HINDI_AUDIO",
                "hasHindiAudio": False,
                "hasHindiSubtitles": False,
                "primaryLanguage": "English",
                "availableLanguages": ["English"]
            },
            "languages": ["English"],
            "defaultLanguage": "English",
            "container": "WebM",
            "license": "Creative Commons Attribution 3.0 (Blender Foundation)",
            "director": "Hjalti Hjalmarsson",
            "featured": False,
            "latest": True,
            "streamUrl": "https://www.youtube-nocookie.com/embed/PVGeM40dABA",
            "backupUrls": [],
            "trailerUrl": "https://www.youtube-nocookie.com/embed/PVGeM40dABA",
            "torrentUri": None,
            "sourceState": "DIRECT_STREAM_AVAILABLE",
            "qualityClass": "4K",
            "qualityHonestBadge": "4K UHD Short Film",
            "audioClassification": "NON_HINDI_AUDIO",
            "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Coffee_Run_poster.png/320px-Coffee_Run_poster.png",
            "backdropUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Coffee_Run_poster.png/320px-Coffee_Run_poster.png",
            "isShortFilm": True,
            "sourceStatus": "PLAYABLE",
            "isTrailerOnly": False
        }
    ]

    existing_ids = {m.get('id') for m in movies}
    added = 0
    for item in new_items:
        if item['id'] not in existing_ids:
            movies.append(item)
            added += 1
            print(f"Added title: {item['id']} - {item['title']}")

    data['movies'] = movies
    data['total_movies'] = len([m for m in movies if m.get('mediaType') != 'series'])
    data['total_series'] = len([m for m in movies if m.get('mediaType') == 'series'])

    with open(cat_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved {cat_path}. Total movies now: {len(movies)} (Added {added})")

    # Sync to android_app
    android_path = 'android_app/src/main/assets/data/movies_catalog.json'
    with open(android_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Synced {android_path}.")

if __name__ == '__main__':
    main()
