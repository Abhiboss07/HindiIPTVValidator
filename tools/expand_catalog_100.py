#!/usr/bin/env python3
"""
T2L Catalog Expansion Script - Expands Catalog to 103 Titles
Adds 50 curated Korean, Chinese, Anime, Asian Cinema, and Bollywood titles
with Hindi language support and high-quality local poster assets.
"""

import os
import json
from PIL import Image, ImageDraw

POSTER_DIR_1 = "assets/posters"
POSTER_DIR_2 = "android_app/src/main/assets/assets/posters"
CATALOG_PATH_1 = "data/movies_catalog.json"
CATALOG_PATH_2 = "android_app/src/main/assets/data/movies_catalog.json"

os.makedirs(POSTER_DIR_1, exist_ok=True)
os.makedirs(POSTER_DIR_2, exist_ok=True)

NEW_TITLES = [
    # --- 1. KOREAN DRAMAS (12 Titles) ---
    {
        "id": "series_squid_game",
        "title": "Squid Game",
        "originalTitle": "오징어 게임",
        "year": 2021,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "thrillers", "action", "asian"],
        "durationFormatted": "1 Season • 9 Episodes",
        "genres": ["Thriller", "Survival", "Drama", "Mystery"],
        "rating": 8.0,
        "description": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean", "English"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Netflix Original (Hindi Dubbed)",
        "director": "Hwang Dong-hyuk",
        "cast": "Lee Jung-jae, Park Hae-soo, Wi Ha-joon, Jung Ho-yeon",
        "color": (229, 9, 20),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [
                {"id": "sg_s1e1", "episodeNumber": 1, "title": "Red Light, Green Light", "duration": "60m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e2", "episodeNumber": 2, "title": "Hell", "duration": "63m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e3", "episodeNumber": 3, "title": "The Man with the Umbrella", "duration": "54m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e4", "episodeNumber": 4, "title": "Stick to the Team", "duration": "52m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e5", "episodeNumber": 5, "title": "A Fair World", "duration": "51m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e6", "episodeNumber": 6, "title": "Gganbu", "duration": "62m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e7", "episodeNumber": 7, "title": "V.I.P.s", "duration": "58m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e8", "episodeNumber": 8, "title": "Front Man", "duration": "32m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"},
                {"id": "sg_s1e9", "episodeNumber": 9, "title": "One Lucky Day", "duration": "55m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"}
            ]
        }]
    },
    {
        "id": "series_all_of_us_are_dead",
        "title": "All of Us Are Dead",
        "originalTitle": "지금 우리 학교는",
        "year": 2022,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "horror", "action", "asian"],
        "durationFormatted": "1 Season • 12 Episodes",
        "genres": ["Horror", "Zombie", "Action", "Drama"],
        "rating": 7.5,
        "description": "A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or turn into one of the rabid infected.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean", "English"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Netflix Original (Hindi Dubbed)",
        "director": "Lee JQ, Kim Nam-su",
        "cast": "Park Ji-hu, Yoon Chan-young, Cho Yi-hyun, Lomon",
        "color": (16, 185, 129),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"aouad_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "60m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 13)]
        }]
    },
    {
        "id": "series_crash_landing_on_you",
        "title": "Crash Landing on You",
        "originalTitle": "사랑의 불시착",
        "year": 2019,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 16 Episodes",
        "genres": ["Romance", "Comedy", "Drama"],
        "rating": 8.7,
        "description": "A paragliding mishap drops a South Korean heiress into North Korea - and into the life of an army officer, who decides he will help her hide.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Studio Dragon (Hindi Dubbed)",
        "director": "Lee Jeong-hyo",
        "cast": "Hyun Bin, Son Ye-jin, Seo Ji-hye, Kim Jung-hyun",
        "color": (236, 72, 153),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"cloy_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "75m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 17)]
        }]
    },
    {
        "id": "series_vincenzo",
        "title": "Vincenzo",
        "originalTitle": "빈센조",
        "year": 2021,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "thrillers", "action", "asian"],
        "durationFormatted": "1 Season • 20 Episodes",
        "genres": ["Crime", "Comedy", "Action", "Drama"],
        "rating": 8.4,
        "description": "During a visit to his motherland, a Korean-Italian mafia lawyer gives an unrivaled conglomerate a taste of its own medicine with a side of justice.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean", "Italian"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "tvN / Netflix (Hindi Dubbed)",
        "director": "Kim Hee-won",
        "cast": "Song Joong-ki, Jeon Yeo-been, Ok Taec-yeon",
        "color": (30, 41, 59),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"vin_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "80m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 21)]
        }]
    },
    {
        "id": "series_the_glory",
        "title": "The Glory",
        "originalTitle": "더 글로리",
        "year": 2022,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "thrillers", "asian"],
        "durationFormatted": "1 Season • 16 Episodes",
        "genres": ["Drama", "Revenge", "Thriller"],
        "rating": 8.1,
        "description": "Years after surviving horrific high school abuse, a woman puts an elaborate revenge scheme into motion to make the perpetrators pay for their crimes.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Netflix Original (Hindi Dubbed)",
        "director": "Ahn Gil-ho",
        "cast": "Song Hye-kyo, Lee Do-hyun, Lim Ji-yeon, Yeom Hye-ran",
        "color": (88, 28, 135),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Part 1 & 2",
            "episodes": [{"id": f"glory_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "52m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 17)]
        }]
    },
    {
        "id": "series_business_proposal",
        "title": "Business Proposal",
        "originalTitle": "사내맞선",
        "year": 2022,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 12 Episodes",
        "genres": ["Romance", "Comedy", "Drama"],
        "rating": 8.1,
        "description": "In disguise as her friend, Ha-ri shows up on a blind date to scare away her prospective suitor. But plans go awry when he turns out to be her CEO and makes a proposal.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "SBS / Netflix (Hindi Dubbed)",
        "director": "Park Sun-ho",
        "cast": "Ahn Hyo-seop, Kim Se-jeong, Kim Min-gue, Seol In-ah",
        "color": (245, 158, 11),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"bp_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "60m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 13)]
        }]
    },
    {
        "id": "series_descendants_of_the_sun",
        "title": "Descendants of the Sun",
        "originalTitle": "태양의 후예",
        "year": 2016,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "action", "asian"],
        "durationFormatted": "1 Season • 16 Episodes",
        "genres": ["Action", "Romance", "Melodrama"],
        "rating": 8.2,
        "description": "A soldier and a doctor fall in love while providing aid in a country torn by war and disaster.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "KBS2 (Hindi Dubbed)",
        "director": "Lee Eung-bok, Baek Sang-hoon",
        "cast": "Song Joong-ki, Song Hye-kyo, Jin Goo, Kim Ji-won",
        "color": (217, 119, 6),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"dots_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "60m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 17)]
        }]
    },
    {
        "id": "series_happiness",
        "title": "Happiness",
        "originalTitle": "해피니스",
        "year": 2021,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "thrillers", "horror", "asian"],
        "durationFormatted": "1 Season • 12 Episodes",
        "genres": ["Action", "Thriller", "Horror", "Mystery"],
        "rating": 8.3,
        "description": "An apocalyptic thriller set in a high-rise apartment building isolated from the outside world due to a newly mutated infectious disease.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "tvN (Hindi Dubbed)",
        "director": "Ahn Gil-ho",
        "cast": "Han Hyo-joo, Park Hyung-sik, Jo Woo-jin",
        "color": (6, 182, 212),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"hap_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "65m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 13)]
        }]
    },
    {
        "id": "series_my_name",
        "title": "My Name",
        "originalTitle": "마이 네임",
        "year": 2021,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "action", "thrillers", "asian"],
        "durationFormatted": "1 Season • 8 Episodes",
        "genres": ["Action", "Crime", "Noir", "Drama"],
        "rating": 7.8,
        "description": "Following her father's murder, a revenge-driven woman puts her trust in a powerful crime boss — and enters the police force under his direction.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Netflix Original (Hindi Dubbed)",
        "director": "Kim Jin-min",
        "cast": "Han So-hee, Park Hee-soon, Ahn Bo-hyun",
        "color": (15, 23, 42),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"mn_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "50m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 9)]
        }]
    },
    {
        "id": "series_sweet_home",
        "title": "Sweet Home",
        "originalTitle": "스위트홈",
        "year": 2020,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "horror", "action", "asian"],
        "durationFormatted": "1 Season • 10 Episodes",
        "genres": ["Horror", "Action", "Sci-Fi", "Drama"],
        "rating": 7.3,
        "description": "As humans turn into savage monsters and wreak terror, one troubled teen and his apartment neighbors fight to survive and hold on to their humanity.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Netflix Original (Hindi Dubbed)",
        "director": "Lee Eung-bok",
        "cast": "Song Kang, Lee Jin-wook, Lee Si-young, Lee Do-hyun",
        "color": (185, 28, 28),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"sh_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "55m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 11)]
        }]
    },
    {
        "id": "series_goblin",
        "title": "Guardian: The Lonely and Great God",
        "originalTitle": "쓸쓸하고 찬란하神 – 도깨비",
        "year": 2016,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "asian"],
        "durationFormatted": "1 Season • 16 Episodes",
        "genres": ["Fantasy", "Romance", "Drama"],
        "rating": 8.6,
        "description": "In his quest for a bride to break his immortal curse, a 939-year-old Guardian meets a grim reaper and a sprightly student with a tragic past.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "tvN (Hindi Dubbed)",
        "director": "Lee Eung-bok",
        "cast": "Gong Yoo, Kim Go-eun, Lee Dong-wook, Yoo In-na",
        "color": (67, 56, 202),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"gob_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "70m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 17)]
        }]
    },
    {
        "id": "series_true_beauty",
        "title": "True Beauty",
        "originalTitle": "여신강림",
        "year": 2020,
        "mediaType": "series",
        "type": "K-Drama",
        "categories": ["korean", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 16 Episodes",
        "genres": ["Romance", "Comedy", "Youth", "Drama"],
        "rating": 8.0,
        "description": "After being bullied and discriminated against for her looks, a high school girl masters the art of makeup to transform into a drop-dead gorgeous 'goddess'.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "tvN (Hindi Dubbed)",
        "director": "Kim Sang-hyeop",
        "cast": "Moon Ga-young, Cha Eun-woo, Hwang In-youp, Park Yoo-na",
        "color": (244, 114, 182),
        "badge": "K-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"tb_s1e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "70m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 17)]
        }]
    },

    # --- 2. CHINESE DRAMAS (8 Titles) ---
    {
        "id": "series_the_untamed",
        "title": "The Untamed",
        "originalTitle": "陈情令",
        "year": 2019,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "action", "asian"],
        "durationFormatted": "1 Season • 50 Episodes",
        "genres": ["Xianxia", "Fantasy", "Mystery", "Action"],
        "rating": 8.8,
        "description": "Two talented disciples of respected clans cross paths and inadvertently discover a secret long kept hidden from the martial arts world.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Tencent Video (Hindi Dubbed)",
        "director": "Zheng Weiwen, Chen Jialin",
        "cast": "Xiao Zhan, Wang Yibo, Meng Ziyi, Xuan Lu",
        "color": (15, 118, 110),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Complete Series",
            "episodes": [{"id": f"untamed_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 51)]
        }]
    },
    {
        "id": "series_falling_into_your_smile",
        "title": "Falling Into Your Smile",
        "originalTitle": "你微笑时很美",
        "year": 2021,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 31 Episodes",
        "genres": ["Romance", "Comedy", "E-Sports"],
        "rating": 8.3,
        "description": "Tong Yao vows to never be in a relationship with someone in the same field as she breaks into the male-dominated world of professional e-sports.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Youku (Hindi Dubbed)",
        "director": "Qiu Zhongwei",
        "cast": "Xu Kai, Cheng Xiao, Zhai Xiaowen, Yao Chi",
        "color": (59, 130, 246),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"fiys_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 32)]
        }]
    },
    {
        "id": "series_hidden_love",
        "title": "Hidden Love",
        "originalTitle": "偷偷藏不住",
        "year": 2023,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 25 Episodes",
        "genres": ["Romance", "Youth", "Drama"],
        "rating": 8.6,
        "description": "Sang Zhi fell in love with Duan Jiaxu, a friend of her older brother. After losing touch, they reunite in university and blossom a sweet relationship.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Youku / Netflix (Hindi Dubbed)",
        "director": "Lee Ching-jung",
        "cast": "Zhao Lusi, Chen Zheyuan, Victor Ma, Zeng Li",
        "color": (251, 146, 60),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"hl_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 26)]
        }]
    },
    {
        "id": "series_love_between_fairy_and_devil",
        "title": "Love Between Fairy and Devil",
        "originalTitle": "苍兰诀",
        "year": 2022,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "asian"],
        "durationFormatted": "1 Season • 36 Episodes",
        "genres": ["Xianxia", "Fantasy", "Romance"],
        "rating": 8.7,
        "description": "A low-ranking flower fairy accidentally frees the fearsome Moon Supreme leader, who finds himself bound to her by a magical body-swap curse.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "iQIYI (Hindi Dubbed)",
        "director": "Yi Zheng",
        "cast": "Yu Shuxin, Dylan Wang, Xu Haiqiao, Cristy Guo",
        "color": (168, 85, 247),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"lbfad_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 37)]
        }]
    },
    {
        "id": "series_put_your_head_on_my_shoulder",
        "title": "Put Your Head on My Shoulder",
        "originalTitle": "致我们暖暖的小时光",
        "year": 2019,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 24 Episodes",
        "genres": ["Comedy", "Romance", "Youth"],
        "rating": 8.0,
        "description": "On the cusp of graduation, an accounting major girl ends up living together with a genius physics student, sparking unexpected sparks.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Tencent Video (Hindi Dubbed)",
        "director": "Zhu Dongning",
        "cast": "Xing Fei, Lin Yi, Tang Xiaotian, Zheng Yingchen",
        "color": (252, 211, 77),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"pyhoms_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 25)]
        }]
    },
    {
        "id": "series_meteor_garden",
        "title": "Meteor Garden",
        "originalTitle": "流星花园",
        "year": 2018,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "comedy", "asian"],
        "durationFormatted": "1 Season • 49 Episodes",
        "genres": ["Romance", "Drama", "School"],
        "rating": 7.8,
        "description": "An ordinary girl is admitted to the most prestigious school in the country where she encounters F4, an exclusive group of wealthy, handsome boys.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Mango TV / Netflix (Hindi Dubbed)",
        "director": "Lin Helong",
        "cast": "Shen Yue, Dylan Wang, Darren Chen, Connor Leong",
        "color": (244, 63, 94),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"mg_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 50)]
        }]
    },
    {
        "id": "series_word_of_honor",
        "title": "Word of Honor",
        "originalTitle": "山河令",
        "year": 2021,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "action", "asian"],
        "durationFormatted": "1 Season • 36 Episodes",
        "genres": ["Wuxia", "Action", "Mystery"],
        "rating": 8.5,
        "description": "Zhou Zishu gets entangled in a martial arts conspiracy after quitting his job as the leader of an imperial assassin group.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Youku (Hindi Dubbed)",
        "director": "Cheng Zhi Chao, Ma Hua Gan",
        "cast": "Zhang Zhehan, Gong Jun, Zhou Ye, Ma Wenyuan",
        "color": (79, 70, 229),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"woh_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 37)]
        }]
    },
    {
        "id": "series_reset",
        "title": "Reset",
        "originalTitle": "开端",
        "year": 2022,
        "mediaType": "series",
        "type": "C-Drama",
        "categories": ["chinese", "web_series", "thrillers", "asian"],
        "durationFormatted": "1 Season • 15 Episodes",
        "genres": ["Sci-Fi", "Time Loop", "Thriller", "Mystery"],
        "rating": 8.2,
        "description": "A college student and a video game designer find themselves trapped in a time loop on a public bus that explodes every single day.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Mandarin",
        "languages": ["Hindi", "Mandarin"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Tencent Video (Hindi Dubbed)",
        "director": "Sun Mo-long, Liu Hong-yuan",
        "cast": "Bai Jingting, Zhao Jinmai, Liu Yijun, Liu Tao",
        "color": (239, 68, 68),
        "badge": "C-DRAMA • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"reset_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "45m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 16)]
        }]
    },

    # --- 3. ASIAN CINEMA & MOVIES (10 Titles) ---
    {
        "id": "vod_train_to_busan",
        "title": "Train to Busan",
        "originalTitle": "부산행",
        "year": 2016,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "horror", "action", "thrillers"],
        "duration": 7080,
        "durationFormatted": "1h 58m",
        "genres": ["Action", "Horror", "Thriller"],
        "rating": 7.6,
        "description": "While a zombie virus breaks out in South Korea, passengers struggle to survive on the bullet train from Seoul to Busan.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Next Entertainment World (Hindi Dubbed)",
        "director": "Yeon Sang-ho",
        "cast": "Gong Yoo, Jung Yu-mi, Ma Dong-seok, Choi Woo-shik",
        "color": (153, 27, 27),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "TRAILER_ONLY",
        "trailerUrl": "https://archive.org/download/youtube-fvJvbA1MvTY/fvJvbA1MvTY.mp4"
    },
    {
        "id": "vod_parasite",
        "title": "Parasite",
        "originalTitle": "기생충",
        "year": 2019,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "thrillers"],
        "duration": 7920,
        "durationFormatted": "2h 12m",
        "genres": ["Drama", "Thriller", "Dark Comedy"],
        "rating": 8.5,
        "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "CJ Entertainment (Oscar Best Picture • Hindi Dubbed)",
        "director": "Bong Joon-ho",
        "cast": "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik",
        "color": (22, 101, 52),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_the_raid_redemption",
        "title": "The Raid: Redemption",
        "originalTitle": "Serbuan Maut",
        "year": 2011,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action", "thrillers"],
        "duration": 6060,
        "durationFormatted": "1h 41m",
        "genres": ["Action", "Martial Arts", "Thriller"],
        "rating": 7.6,
        "description": "A S.W.A.T. team becomes trapped in a tenement run by a ruthless mobster and his army of killers and thugs in the slums of Jakarta.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Indonesian",
        "languages": ["Hindi", "Indonesian"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "PT Merantau Films (Hindi Dubbed)",
        "director": "Gareth Evans",
        "cast": "Iko Uwais, Joe Taslim, Donny Alamsyah, Yayan Ruhian",
        "color": (120, 53, 15),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_ip_man",
        "title": "Ip Man",
        "originalTitle": "葉問",
        "year": 2008,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action"],
        "duration": 6360,
        "durationFormatted": "1h 46m",
        "genres": ["Martial Arts", "Action", "Biography", "History"],
        "rating": 8.0,
        "description": "During the Sino-Japanese War, a martial arts master in Foshan refuses to teach his skills to invading Japanese troops, fighting for national dignity.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Cantonese",
        "languages": ["Hindi", "Cantonese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Mandarin Films (Hindi Dubbed)",
        "director": "Wilson Yip",
        "cast": "Donnie Yen, Simon Yam, Lynn Hung, Hiroyuki Ikeuchi",
        "color": (180, 83, 9),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_ip_man_4",
        "title": "Ip Man 4: The Finale",
        "originalTitle": "葉問4：完結篇",
        "year": 2019,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action"],
        "duration": 6420,
        "durationFormatted": "1h 47m",
        "genres": ["Martial Arts", "Action", "Drama"],
        "rating": 7.0,
        "description": "Kung Fu master Ip Man travels to the U.S. where his student Bruce Lee has upset the local martial arts community by opening a Wing Chun school.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Cantonese",
        "languages": ["Hindi", "Cantonese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Pegasus Motion Pictures (Hindi Dubbed)",
        "director": "Wilson Yip",
        "cast": "Donnie Yen, Wu Yue, Vanness Wu, Scott Adkins",
        "color": (194, 65, 12),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_peninsula",
        "title": "Peninsula",
        "originalTitle": "반도",
        "year": 2020,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action", "horror"],
        "duration": 6960,
        "durationFormatted": "1h 56m",
        "genres": ["Action", "Horror", "Thriller"],
        "rating": 5.5,
        "description": "Four years after Train to Busan, a soldier returns to the quarantined Korean peninsula on a mission to retrieve a truck with 20 million dollars.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Next Entertainment World (Hindi Dubbed)",
        "director": "Yeon Sang-ho",
        "cast": "Gang Dong-won, Lee Jung-hyun, Lee Re, Kwon Hae-hyo",
        "color": (30, 58, 138),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_kung_fu_hustle",
        "title": "Kung Fu Hustle",
        "originalTitle": "功夫",
        "year": 2004,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action", "comedy"],
        "duration": 5940,
        "durationFormatted": "1h 39m",
        "genres": ["Action", "Comedy", "Fantasy", "Martial Arts"],
        "rating": 7.8,
        "description": "In 1940s Shanghai, a petty thief aspires to join the notorious Axe Gang, stumbling into an apartment slum run by eccentric kung fu masters.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Cantonese",
        "languages": ["Hindi", "Cantonese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Sony Pictures (Hindi Dubbed)",
        "director": "Stephen Chow",
        "cast": "Stephen Chow, Yuen Wah, Yuen Qiu, Danny Chan",
        "color": (202, 138, 4),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_shaolin_soccer",
        "title": "Shaolin Soccer",
        "originalTitle": "少林足球",
        "year": 2001,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "comedy", "action"],
        "duration": 5220,
        "durationFormatted": "1h 27m",
        "genres": ["Comedy", "Action", "Sports", "Fantasy"],
        "rating": 7.3,
        "description": "A former Shaolin monk reunites his five brothers to apply their superhuman martial arts skills to play soccer and take the tournament.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Cantonese",
        "languages": ["Hindi", "Cantonese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Star Overseas (Hindi Dubbed)",
        "director": "Stephen Chow",
        "cast": "Stephen Chow, Zhao Wei, Ng Man-tat, Patrick Tse",
        "color": (234, 88, 12),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_the_outlaws",
        "title": "The Outlaws",
        "originalTitle": "범죄도시",
        "year": 2017,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action", "thrillers"],
        "duration": 7260,
        "durationFormatted": "2h 01m",
        "genres": ["Action", "Crime", "Thriller"],
        "rating": 7.2,
        "description": "A Seoul detective is tasked with bringing peace to a turf war between rival Chinese-Korean gangs in the Garibong district.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Kiwi Media Group (Hindi Dubbed)",
        "director": "Kang Yoon-sung",
        "cast": "Ma Dong-seok, Yoon Kye-sang, Jo Jae-yoon, Choi Gwi-hwa",
        "color": (51, 65, 85),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_the_roundup",
        "title": "The Roundup",
        "originalTitle": "범죄도시2",
        "year": 2022,
        "mediaType": "movie",
        "type": "Asian Cinema",
        "categories": ["asian", "action", "thrillers"],
        "duration": 6360,
        "durationFormatted": "1h 46m",
        "genres": ["Action", "Crime", "Comedy"],
        "rating": 7.0,
        "description": "Detective Ma Seok-do travels to Vietnam to extradite a suspect, only to discover a serial kidnapper murdering South Korean tourists.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Korean",
        "languages": ["Hindi", "Korean"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "ABO Entertainment (Hindi Dubbed)",
        "director": "Lee Sang-yong",
        "cast": "Ma Dong-seok, Son Suk-ku, Choi Gwi-hwa, Park Ji-hwan",
        "color": (71, 85, 105),
        "badge": "ASIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },

    # --- 4. ANIME (8 Titles) ---
    {
        "id": "vod_demon_slayer_mugen_train",
        "title": "Demon Slayer: Mugen Train",
        "originalTitle": "劇場版 鬼滅の刃 無限列車編",
        "year": 2020,
        "mediaType": "movie",
        "type": "Anime",
        "categories": ["anime", "action", "asian"],
        "duration": 6960,
        "durationFormatted": "1h 56m",
        "genres": ["Anime", "Action", "Dark Fantasy"],
        "rating": 8.2,
        "description": "Tanjiro and the Demon Slayer Corps join Flame Hashira Kyojuro Rengoku aboard the mysterious Mugen Train to investigate demon disappearances.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Japanese",
        "languages": ["Hindi", "Japanese", "English"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Aniplex / Ufotable (Hindi Dubbed)",
        "director": "Haruo Sotozaki",
        "cast": "Natsuki Hanae, Satoshi Hino, Akari Kito, Hiro Shimono",
        "color": (225, 29, 72),
        "badge": "ANIME • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_jujutsu_kaisen_0",
        "title": "Jujutsu Kaisen 0",
        "originalTitle": "劇場版 呪術廻戦 0",
        "year": 2021,
        "mediaType": "movie",
        "type": "Anime",
        "categories": ["anime", "action", "asian"],
        "duration": 6300,
        "durationFormatted": "1h 45m",
        "genres": ["Anime", "Action", "Supernatural", "Fantasy"],
        "rating": 7.8,
        "description": "Yuta Okkotsu gains control of an extremely powerful cursed spirit and gets enrolled in Tokyo Prefectural Jujutsu High School by Satoru Gojo.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Japanese",
        "languages": ["Hindi", "Japanese", "English"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "MAPPA / Toho (Hindi Dubbed)",
        "director": "Sunghoo Park",
        "cast": "Megumi Ogata, Kana Hanazawa, Mikako Komatsu, Yuichi Nakamura",
        "color": (76, 29, 149),
        "badge": "ANIME • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_suzume",
        "title": "Suzume",
        "originalTitle": "すずめの戸締まり",
        "year": 2022,
        "mediaType": "movie",
        "type": "Anime",
        "categories": ["anime", "asian"],
        "duration": 7320,
        "durationFormatted": "2h 02m",
        "genres": ["Anime", "Adventure", "Fantasy"],
        "rating": 7.6,
        "description": "A modern action adventure road story where a 17-year-old girl named Suzume helps a mysterious young man close mysterious doors across Japan.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Japanese",
        "languages": ["Hindi", "Japanese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "CoMix Wave Films (Hindi Dubbed)",
        "director": "Makoto Shinkai",
        "cast": "Nanoka Hara, Hokuto Matsumura, Eri Fukatsu",
        "color": (14, 165, 233),
        "badge": "ANIME • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_your_name",
        "title": "Your Name",
        "originalTitle": "君の名は。",
        "year": 2016,
        "mediaType": "movie",
        "type": "Anime",
        "categories": ["anime", "asian"],
        "duration": 6420,
        "durationFormatted": "1h 47m",
        "genres": ["Anime", "Romance", "Fantasy", "Drama"],
        "rating": 8.4,
        "description": "Two teenagers share a profound, magical connection upon discovering that they are swapping bodies across time and space.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Japanese",
        "languages": ["Hindi", "Japanese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "CoMix Wave Films (Hindi Dubbed)",
        "director": "Makoto Shinkai",
        "cast": "Ryunosuke Kamiki, Mone Kamishiraishi, Ryo Narita",
        "color": (99, 102, 241),
        "badge": "ANIME • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "series_death_note",
        "title": "Death Note",
        "originalTitle": "デスノート",
        "year": 2006,
        "mediaType": "series",
        "type": "Anime",
        "categories": ["anime", "web_series", "thrillers", "asian"],
        "durationFormatted": "1 Season • 37 Episodes",
        "genres": ["Anime", "Psychological", "Supernatural", "Thriller"],
        "rating": 9.0,
        "description": "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Japanese",
        "languages": ["Hindi", "Japanese", "English"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Madhouse (Hindi Dubbed)",
        "director": "Tetsuro Araki",
        "cast": "Mamoru Miyano, Kappei Yamaguchi, Shido Nakamura",
        "color": (2, 6, 23),
        "badge": "ANIME • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Complete Series",
            "episodes": [{"id": f"dn_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "23m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 38)]
        }]
    },
    {
        "id": "series_naruto_classic",
        "title": "Naruto",
        "originalTitle": "ナルト",
        "year": 2002,
        "mediaType": "series",
        "type": "Anime",
        "categories": ["anime", "web_series", "action", "asian"],
        "durationFormatted": "1 Season • 52 Episodes",
        "genres": ["Anime", "Shonen", "Action", "Adventure"],
        "rating": 8.4,
        "description": "Naruto Uzumaki, a mischievous adolescent ninja, struggles for recognition and pursues his dream of becoming the Hokage of his village.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) / Japanese",
        "languages": ["Hindi", "Japanese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Studio Pierrot (Sony YAY! Hindi Dubbed)",
        "director": "Hayato Date",
        "cast": "Junko Takeuchi, Noriaki Sugiyama, Chie Nakamura, Kazuhiko Inoue",
        "color": (249, 115, 22),
        "badge": "ANIME • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1 (Hindi)",
            "episodes": [{"id": f"nar_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "23m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 53)]
        }]
    },
    {
        "id": "series_solo_leveling",
        "title": "Solo Leveling",
        "originalTitle": "나 혼자만 레벨업",
        "year": 2024,
        "mediaType": "series",
        "type": "Anime",
        "categories": ["anime", "web_series", "action", "korean", "asian"],
        "durationFormatted": "1 Season • 12 Episodes",
        "genres": ["Anime", "Action", "Fantasy"],
        "rating": 8.4,
        "description": "In a world where hunters battle deadly monsters to protect humanity, the notoriously weak hunter Sung Jinwoo awakens with a mysterious leveling system.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Korean / Japanese",
        "languages": ["Hindi", "Korean", "Japanese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "A-1 Pictures / Crunchyroll (Hindi Dubbed)",
        "director": "Shunsuke Nakashige",
        "cast": "Taito Ban, Genta Nakamura, Reina Ueda",
        "color": (37, 99, 235),
        "badge": "ANIME • HINDI DUB",
        "seasons": [{
            "seasonNumber": 1, "title": "Season 1",
            "episodes": [{"id": f"sl_e{i}", "episodeNumber": i, "title": f"Episode {i}", "duration": "24m", "streamUrl": None, "sourceState": "NO_AUTHORIZED_SOURCE"} for i in range(1, 13)]
        }]
    },
    {
        "id": "vod_one_piece_film_red",
        "title": "One Piece Film: Red",
        "originalTitle": "ONE PIECE FILM RED",
        "year": 2022,
        "mediaType": "movie",
        "type": "Anime",
        "categories": ["anime", "action", "asian"],
        "duration": 6900,
        "durationFormatted": "1h 55m",
        "genres": ["Anime", "Action", "Adventure", "Music"],
        "rating": 6.9,
        "description": "Uta, the world's most beloved singer, is revealed as Shanks' daughter as she prepares to give a legendary live performance.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Japanese",
        "languages": ["Hindi", "Japanese"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Toei Animation (Hindi Dubbed)",
        "director": "Goro Taniguchi",
        "cast": "Mayumi Tanaka, Kaori Nazuka, Ado, Shuichi Ikeda",
        "color": (220, 38, 38),
        "badge": "ANIME • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },

    # --- 5. BOLLYWOOD & INDIAN CINEMA (12 Titles) ---
    {
        "id": "vod_stree",
        "title": "Stree",
        "year": 2018,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "comedy", "horror"],
        "duration": 7680,
        "durationFormatted": "2h 08m",
        "genres": ["Comedy", "Horror"],
        "rating": 7.5,
        "description": "In the small town of Chanderi, men live in fear of an evil spirit named Stree who abducts men in the night during festival days.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Maddock Films (Hindi)",
        "director": "Amar Kaushik",
        "cast": "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi, Aparshakti Khurana",
        "color": (168, 85, 247),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_drishyam_2",
        "title": "Drishyam 2",
        "year": 2022,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "thrillers"],
        "duration": 8400,
        "durationFormatted": "2h 20m",
        "genres": ["Crime", "Drama", "Mystery", "Thriller"],
        "rating": 8.2,
        "description": "7 years after the case related to Vijay Salgaonkar and his family was closed, a series of unexpected events uncovers a truth that threatens everything.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Panorama Studios (Hindi)",
        "director": "Abhishek Pathak",
        "cast": "Ajay Devgn, Tabu, Akshaye Khanna, Shriya Saran",
        "color": (30, 41, 59),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_kantara",
        "title": "Kantara",
        "year": 2022,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action", "thrillers"],
        "duration": 8880,
        "durationFormatted": "2h 28m",
        "genres": ["Action", "Drama", "Thriller", "Folklore"],
        "rating": 8.2,
        "description": "When greed paves the way for betrayal and murder, a young tribal man reluctantly dons the traditions of his ancestors to seek justice.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Kannada",
        "languages": ["Hindi", "Kannada"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Hombale Films (Hindi Dubbed)",
        "director": "Rishab Shetty",
        "cast": "Rishab Shetty, Sapthami Gowda, Kishore, Achyuth Kumar",
        "color": (217, 119, 6),
        "badge": "INDIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_kgf_chapter_1",
        "title": "K.G.F: Chapter 1",
        "year": 2018,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action", "thrillers"],
        "duration": 9360,
        "durationFormatted": "2h 36m",
        "genres": ["Action", "Crime", "Drama"],
        "rating": 8.2,
        "description": "In the 1970s, a fierce rebel rises against brutal oppression and becomes the symbol of hope to the enslaved workers of the Kolar Gold Fields.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Kannada",
        "languages": ["Hindi", "Kannada"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Hombale Films (Hindi Dubbed)",
        "director": "Prashanth Neel",
        "cast": "Yash, Srinidhi Shetty, Ramachandra Raju, Anant Nag",
        "color": (161, 98, 7),
        "badge": "INDIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_baahubali_1",
        "title": "Baahubali: The Beginning",
        "year": 2015,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action"],
        "duration": 9540,
        "durationFormatted": "2h 39m",
        "genres": ["Action", "Drama", "Epic", "Fantasy"],
        "rating": 8.0,
        "description": "In the kingdom of Mahishmati, a fierce young man pursues his love and uncovers his noble lineage, setting off an epic clash of empires.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Telugu",
        "languages": ["Hindi", "Telugu", "Tamil"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Arka Media Works (Hindi Dubbed)",
        "director": "S.S. Rajamouli",
        "cast": "Prabhas, Rana Daggubati, Anushka Shetty, Tamannaah Bhatia",
        "color": (180, 83, 9),
        "badge": "INDIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_baahubali_2",
        "title": "Baahubali 2: The Conclusion",
        "year": 2017,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action"],
        "duration": 10020,
        "durationFormatted": "2h 47m",
        "genres": ["Action", "Drama", "Epic", "Fantasy"],
        "rating": 8.2,
        "description": "After learning that Bhallaladeva killed his father, Mahendra Baahubali raises an army to defeat the tyrant and free the kingdom of Mahishmati.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi (Dubbed) 5.1 / Telugu",
        "languages": ["Hindi", "Telugu", "Tamil"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Arka Media Works (Hindi Dubbed)",
        "director": "S.S. Rajamouli",
        "cast": "Prabhas, Rana Daggubati, Anushka Shetty, Sathyaraj",
        "color": (194, 65, 12),
        "badge": "INDIAN • HINDI DUB",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_tumbbad",
        "title": "Tumbbad",
        "year": 2018,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "horror", "thrillers"],
        "duration": 6240,
        "durationFormatted": "1h 44m",
        "genres": ["Horror", "Drama", "Fantasy", "Mystery"],
        "rating": 8.2,
        "description": "A mythological story about a goddess who created the entire universe. The plot revolves around the consequences when humans build a temple for her first-born monster, Hastar.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Sohum Shah Films (Hindi)",
        "director": "Rahi Anil Barve",
        "cast": "Sohum Shah, Jyoti Malshe, Anita Date-Kelkar, Deepak Damle",
        "color": (120, 53, 15),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_andhadhun",
        "title": "Andhadhun",
        "year": 2018,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "thrillers", "comedy"],
        "duration": 8340,
        "durationFormatted": "2h 19m",
        "genres": ["Dark Comedy", "Crime", "Mystery", "Thriller"],
        "rating": 8.2,
        "description": "A series of mysterious events changes the life of a blind pianist who now must report a murder that he never actually saw.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Viacom18 Studios (Hindi)",
        "director": "Sriram Raghavan",
        "cast": "Ayushmann Khurrana, Tabu, Radhika Apte, Anil Dhawan",
        "color": (5, 150, 105),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_shershaah",
        "title": "Shershaah",
        "year": 2021,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action"],
        "duration": 8100,
        "durationFormatted": "2h 15m",
        "genres": ["Action", "Biography", "Drama", "War"],
        "rating": 8.3,
        "description": "The life of Indian army captain Vikram Batra, PVC, from his first posting in the army to his ultimate sacrifice in the Kargil War.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Dharma Productions (Hindi)",
        "director": "Vishnuvardhan",
        "cast": "Sidharth Malhotra, Kiara Advani, Shiv Panditt, Nikitin Dheer",
        "color": (21, 128, 61),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_3_idiots",
        "title": "3 Idiots",
        "year": 2009,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "comedy"],
        "duration": 10200,
        "durationFormatted": "2h 50m",
        "genres": ["Comedy", "Drama"],
        "rating": 8.4,
        "description": "Two friends embark on a quest for a lost buddy. On this journey, they reminisce about their college days and their friend who inspired them to think differently.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "Vinod Chopra Films (Hindi)",
        "director": "Rajkumar Hirani",
        "cast": "Aamir Khan, R. Madhavan, Sharman Joshi, Kareena Kapoor",
        "color": (234, 179, 8),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_gangs_of_wasseypur",
        "title": "Gangs of Wasseypur",
        "year": 2012,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action", "thrillers"],
        "duration": 19200,
        "durationFormatted": "5h 20m (Part 1 & 2)",
        "genres": ["Action", "Crime", "Drama"],
        "rating": 8.2,
        "description": "A clash between Sultan and Shahid Khan leads to the expulsion of Khan from Wasseypur, sparking a deadly blood feud spanning three generations.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "AKFPL (Hindi)",
        "director": "Anurag Kashyap",
        "cast": "Manoj Bajpayee, Nawazuddin Siddiqui, Richa Chadha, Huma Qureshi",
        "color": (185, 28, 28),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    },
    {
        "id": "vod_vikram_vedha",
        "title": "Vikram Vedha",
        "year": 2022,
        "mediaType": "movie",
        "type": "Bollywood",
        "categories": ["bollywood", "action", "thrillers"],
        "duration": 9600,
        "durationFormatted": "2h 40m",
        "genres": ["Action", "Crime", "Drama", "Thriller"],
        "rating": 7.1,
        "description": "A tough police officer sets out to track down and kill an equally tough gangster. A story of moral ambiguity inspired by the ancient tale of Vikram and Betal.",
        "resolution": "1080p Full HD",
        "codec": "H.264 / AAC",
        "audio": "Hindi 5.1 / AAC",
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "container": "MP4",
        "license": "YNOT Studios / Reliance (Hindi)",
        "director": "Pushkar-Gayathri",
        "cast": "Hrithik Roshan, Saif Ali Khan, Radhika Apte, Rohit Saraf",
        "color": (51, 65, 85),
        "badge": "BOLLYWOOD • HINDI",
        "sourceState": "NO_AUTHORIZED_SOURCE"
    }
]

def generate_poster(item):
    """Generates a sleek, high-resolution (600x900) poster for an item."""
    width, height = 600, 900
    img = Image.new("RGB", (width, height), (15, 17, 23))
    draw = ImageDraw.Draw(img)

    accent_color = item.get("color", (56, 189, 248))
    
    # Background subtle radial/vertical gradient
    for y in range(height):
        factor = y / height
        r = int(accent_color[0] * 0.25 * (1 - factor) + 12 * factor)
        g = int(accent_color[1] * 0.25 * (1 - factor) + 14 * factor)
        b = int(accent_color[2] * 0.25 * (1 - factor) + 20 * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Dark overlay on lower 60%
    for y in range(int(height * 0.4), height):
        alpha_factor = (y - height * 0.4) / (height * 0.6)
        p = img.getpixel((0, y))
        cur_r, cur_g, cur_b = (p, p, p) if isinstance(p, int) else p[:3]
        r = int(cur_r * (1 - alpha_factor * 0.85))
        g = int(cur_g * (1 - alpha_factor * 0.85))
        b = int(cur_b * (1 - alpha_factor * 0.85))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Top accent bar
    draw.rectangle([(0, 0), (width, 8)], fill=accent_color)

    # Top category badge
    badge_text = item.get("badge", "HINDI DUBBED")
    badge_w = 260
    badge_h = 36
    draw.rounded_rectangle([(30, 30), (30 + badge_w, 30 + badge_h)], radius=6, fill=(0, 0, 0), outline=accent_color, width=2)
    draw.text((45, 38), badge_text, fill=accent_color)

    # Year & Rating pill
    yr_text = f"* {item['rating']} • {item['year']}"
    draw.rounded_rectangle([(width - 170, 30), (width - 30, 30 + badge_h)], radius=6, fill=(245, 158, 11), outline=(251, 191, 36), width=1)
    draw.text((width - 158, 38), yr_text, fill=(0, 0, 0))

    # Center decorative frame
    draw.rectangle([(40, 100), (width - 40, height - 260)], outline=(255, 255, 255), width=1)

    # Center icon or abbreviation
    initials = "".join([w[0] for w in item["title"].split() if w[0].isalnum()])[:3].upper()
    draw.text((width // 2 - 35, height // 2 - 120), initials, fill=(255, 255, 255))

    # Lower section: Title, original title, genres
    title = item["title"]
    orig_title = item.get("originalTitle", "")
    genres_text = " • ".join(item["genres"][:3])

    # Bottom Gradient block
    draw.rectangle([(0, height - 240), (width, height)], fill=(10, 12, 18))
    draw.rectangle([(0, height - 242), (width, height - 240)], fill=accent_color)

    # Title text
    draw.text((36, height - 215), title, fill=(255, 255, 255))
    if orig_title:
        draw.text((36, height - 170), f"({orig_title})", fill=(148, 163, 184))

    draw.text((36, height - 130), genres_text, fill=accent_color)
    draw.text((36, height - 90), f"Audio: {item['audio']}", fill=(203, 213, 225))
    draw.text((36, height - 55), f"Quality: {item['resolution']} • {item['durationFormatted']}", fill=(148, 163, 184))

    return img

def main():
    print(f"Adding {len(NEW_TITLES)} new titles to reach 103 items...")

    # 1. Load current catalog
    with open(CATALOG_PATH_1, "r") as f:
        catalog = json.load(f)

    existing_movies = catalog.get("movies", [])
    print(f"Current catalog has {len(existing_movies)} titles.")
    existing_ids = {m["id"] for m in existing_movies}

    added_count = 0
    for item in NEW_TITLES:
        if item["id"] in existing_ids:
            print(f"Skipping already existing {item['id']}")
            continue

        item_id = item["id"]
        poster_rel = f"assets/posters/{item_id}.jpg"
        item["posterUrl"] = poster_rel
        item["backdropUrl"] = poster_rel
        item["streamUrl"] = item.get("streamUrl", None)
        item["trailerUrl"] = item.get("trailerUrl", None)
        item["torrentUri"] = item.get("torrentUri", None)
        item["sourceState"] = item.get("sourceState", "NO_AUTHORIZED_SOURCE")
        item["qualityClass"] = "FULL HD" if "1080p" in item.get("resolution", "") else "HD"
        item["qualityHonestBadge"] = "1080p Full HD" if "1080p" in item.get("resolution", "") else "720p HD"
        item["contentType"] = "SERIES" if item["mediaType"] == "series" else "MOVIE"
        item["region"] = "ASIAN" if ("korean" in item.get("categories", []) or "chinese" in item.get("categories", []) or "asian" in item.get("categories", []) or "anime" in item.get("categories", [])) else "BOLLYWOOD"

        # Generate Poster
        img = generate_poster(item)
        p1 = os.path.join(POSTER_DIR_1, f"{item_id}.jpg")
        p2 = os.path.join(POSTER_DIR_2, f"{item_id}.jpg")
        img.save(p1, "JPEG", quality=90)
        img.save(p2, "JPEG", quality=90)

        # Cleanup internal keys
        item.pop("color", None)
        item.pop("badge", None)

        existing_movies.append(item)
        added_count += 1

    catalog["version"] = 9
    catalog["updated_at"] = "2026-09-14T15:30:00Z"
    catalog["movies"] = existing_movies

    # Write catalog to both locations
    with open(CATALOG_PATH_1, "w") as f:
        json.dump(catalog, f, indent=2)
    with open(CATALOG_PATH_2, "w") as f:
        json.dump(catalog, f, indent=2)

    print(f"Successfully added {added_count} titles.")
    print(f"New total catalog count: {len(existing_movies)} titles (Catalog version 9)")

if __name__ == "__main__":
    main()
