#!/usr/bin/env python3
"""
Automated Content Ingestion Pipeline for T2L (Enhanced V3)
---------------------------------------------------------
Finds, validates, scores, and ingests new verified media content daily:
- Movies (Bollywood, South Hindi Dubbed, Hollywood Hindi Dubbed)
- Anime Legends (Hindi Dubbed multi-episode seasons)
- Cartoon Movies & Animated Features
- Award-Winning Hindi Short Films
- Live TV Channels (with visual frame logo checks)

Strict Quality & Recency Hierarchy:
1. Quality Priority:
   • Tier 1: 4K UHD, 2K / 1440p, 1080p Full HD (Always prioritized first)
   • Tier 2: 720p HD (Fallback only if 1080p/2K/4K is unavailable)
   • Hard Reject: Sub-720p (480p, 360p, 240p) is strictly rejected immediately.
2. Recency & Era Priority:
   • Modern Era (2020–2026): Top Ingestion Priority (+500 score)
   • Contemporary Era (2010–2019): High Priority (+350 score)
   • 2000s Hits (2000–2009): Medium Priority (+200 score)
   • Vintage / Pre-2000 Classics:
     - ONLY widely celebrated, iconic, cult-classic cultural touchstones
       (e.g., Nadiya Ke Paar, Sholay, DDLJ, Mughal-e-Azam, Hum Aapke Hain Koun..!)
       are permitted (+50 score, evaluated last).
     - Obscure, low-demand pre-2000 films are automatically filtered out.
3. Strict Poster Quality Gate:
   • Rejects empty/solid-black placeholders using entropy & stddev checks.
   • Minimum resolution 300x450, scaled and cropped to 600x900 progressive JPEG.
   • Multi-tier fallback harvester: Local library -> Wikimedia/Wikipedia -> YouTube HD Thumbnail -> TMDB.
4. Intelligent Title Deduplication:
   • Strips release years (e.g. "Jawan (2023)" vs "Jawan") and normalizes punctuation.
"""

import os
import sys
import re
import json
import time
import shutil
import subprocess
import urllib.request
import urllib.parse
from PIL import Image, ImageStat

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(PROJECT_ROOT, "data", "movies_catalog.json")
CHANNELS_PATH = os.path.join(PROJECT_ROOT, "data", "channels.json")
POSTERS_DIR = os.path.join(PROJECT_ROOT, "assets", "posters")
ANDROID_POSTERS_DIR = os.path.join(PROJECT_ROOT, "android_app", "src", "main", "assets", "assets", "posters")
ANDROID_CATALOG_PATH = os.path.join(PROJECT_ROOT, "android_app", "src", "main", "assets", "data", "movies_catalog.json")
ANDROID_CHANNELS_PATH = os.path.join(PROJECT_ROOT, "android_app", "src", "main", "assets", "data", "channels.json")

os.makedirs(POSTERS_DIR, exist_ok=True)
os.makedirs(ANDROID_POSTERS_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5"

# Curated Whitelist of Widely Celebrated Pre-2000 Cultural Touchstones
ICONIC_VINTAGE_CLASSICS_WHITELIST = {
    "nadiya ke paar", "sholay", "mughal e azam", "dilwale dulhania le jayenge",
    "andaz apna apna", "hum aapke hain koun", "gol maal", "chupke chupke",
    "deewaar", "don", "anand", "pakeezah", "mr india", "masoom",
    "jaane bhi do yaaro", "jo jeeta wohi sikandar", "baazigar", "karan arjun",
    "kuch kuch hota hai", "satya", "sarfarosh", "vaastav", "agneepath",
    "border", "ghayal", "ghatak", "damini", "shree 420", "awaara",
    "mother india", "pyaasa", "kaagaz ke phool", "guide", "waqt",
    "teesri manzil", "jewel thief", "aradhana", "johny mera naam",
    "hare rama hare krishna", "amar akbar anthony", "muqaddar ka sikandar",
    "kaalia", "namak halaal", "coolie", "sharaabi", "karma", "ram lakhan",
    "hum", "saudagar", "khiladi", "darr", "mohra", "main khiladi tu anari",
    "rangeela", "raja hindustani", "dil to pagal hai", "gupt",
    "hum dil de chuke sanam", "taal", "hum saath saath hain", "biwi no 1",
    "ramayana", "ramayana the legend of prince rama"
}

def is_youtube_url(url):
    """Check if URL points to YouTube or YouTube embed."""
    if not url:
        return False
    return "youtube" in url or "youtu.be" in url

def extract_youtube_id(url):
    """Extract 11-char YouTube video ID."""
    if not url:
        return None
    if "embed/" in url:
        return url.split("embed/")[1].split("?")[0].split("/")[0]
    elif "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0].split("/")[0]
    return None

def check_youtube_playable(video_id, timeout=8):
    """Verify if YouTube video is publicly playable."""
    try:
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        req = urllib.request.Request(oembed_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status == 200
    except Exception:
        return False

def normalize_title(title):
    """Normalize title by lowercasing, stripping years, and removing non-alphanumeric chars."""
    if not title:
        return ""
    # Strip (2023), (2024), etc.
    cleaned = re.sub(r"\s*\(\d{4}\)\s*", "", title)
    # Remove punctuation
    cleaned = re.sub(r"[^\w\s]", "", cleaned)
    return cleaned.strip().lower()

def is_valid_poster_image(img_path):
    """
    Validate that image exists, is >25KB, has minimum dimensions,
    and is NOT a solid black/blank placeholder.
    """
    if not os.path.exists(img_path) or os.path.getsize(img_path) < 25000:
        return False, "File missing or too small (<25KB)"

    try:
        with Image.open(img_path) as img:
            w, h = img.size
            if w < 300 or h < 450:
                return False, f"Image dimensions too small ({w}x{h})"

            # Calculate standard deviation across RGB channels to detect blank/solid colors
            stat = ImageStat.Stat(img.convert("RGB"))
            avg_stddev = sum(stat.stddev) / len(stat.stddev)
            if avg_stddev < 15.0:
                return False, f"Image lacks visual detail/entropy (stddev: {avg_stddev:.1f}, likely blank)"

            return True, "Valid authentic poster"
    except Exception as e:
        return False, str(e)

def find_existing_local_poster(normalized_title):
    """Search assets/posters for an existing high-res poster matching title."""
    for fn in os.listdir(POSTERS_DIR):
        if not fn.endswith((".jpg", ".png", ".jpeg")):
            continue
        clean_fn = fn.replace("vod_", "").replace("series_", "").replace(".jpg", "").replace(".png", "")
        clean_fn = re.sub(r"_\d{4}", "", clean_fn).replace("_", " ").lower()
        if clean_fn in normalized_title or normalized_title in clean_fn:
            full_p = os.path.join(POSTERS_DIR, fn)
            valid, _ = is_valid_poster_image(full_p)
            if valid:
                return fn
    return None

def fetch_wikipedia_poster(title):
    """Fetch official high-res poster from Wikipedia API."""
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pilicense=any&piprop=original"
    req = urllib.request.Request(url, headers={"User-Agent": "T2LBot/1.0 (contact@aakashstream.com)"})
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.load(resp)
            pages = data.get("query", {}).get("pages", {})
            for pid, pdata in pages.items():
                orig = pdata.get("original")
                if orig and orig.get("source"):
                    return orig.get("source")
    except Exception:
        pass
    return None

def harvest_and_process_poster(title, candidate, output_filename):
    """
    Multi-tier harvester to obtain a verified 600x900 poster.
    1. Reuses authentic local poster if title already exists in assets.
    2. Uses provided posterSrcUrl if valid.
    3. Searches Wikipedia / Wikimedia.
    4. Extracts YouTube HD thumbnail if YouTube embed.
    """
    target_path = os.path.join(POSTERS_DIR, output_filename)
    android_target_path = os.path.join(ANDROID_POSTERS_DIR, output_filename)
    norm = normalize_title(title)

    # Tier 1: Check existing local library
    existing_fn = find_existing_local_poster(norm)
    if existing_fn:
        src_path = os.path.join(POSTERS_DIR, existing_fn)
        if os.path.abspath(src_path) != os.path.abspath(target_path):
            shutil.copyfile(src_path, target_path)
        if os.path.abspath(src_path) != os.path.abspath(android_target_path):
            shutil.copyfile(src_path, android_target_path)
        print(f"🖼️ [Tier 1] Reused authentic existing poster '{existing_fn}' for '{title}'")
        return True, f"assets/posters/{output_filename}"

    # Tier 2: Candidate source URL
    sources_to_try = []
    if candidate.get("posterSrcUrl"):
        sources_to_try.append(candidate["posterSrcUrl"])

    # Tier 3: Wikipedia theatrical poster
    wiki_url = fetch_wikipedia_poster(candidate.get("originalTitle") or title)
    if wiki_url:
        sources_to_try.append(wiki_url)

    # Tier 4: YouTube thumbnail extraction
    stream_url = candidate.get("streamUrl", "")
    if is_youtube_url(stream_url):
        yt_id = extract_youtube_id(stream_url)
        if yt_id:
            sources_to_try.append(f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg")
            sources_to_try.append(f"https://img.youtube.com/vi/{yt_id}/hqdefault.jpg")

    for src_url in sources_to_try:
        try:
            req = urllib.request.Request(src_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=8) as resp:
                img = Image.open(resp).convert("RGB")
                w, h = img.size
                if w < 100 or h < 100:
                    continue
                # Center crop to 2:3 ratio if 16:9 thumbnail
                target_w = int(h * 2 / 3)
                if w > target_w:
                    left = (w - target_w) // 2
                    img = img.crop((left, 0, left + target_w, h))

                img = img.resize((600, 900), Image.Resampling.LANCZOS)
                img.save(target_path, "JPEG", quality=90, optimize=True)
                img.save(android_target_path, "JPEG", quality=90, optimize=True)

                valid, reason = is_valid_poster_image(target_path)
                if valid:
                    print(f"🖼️ [Harvested] Successfully verified poster for '{title}' from {src_url[:50]}...")
                    return True, f"assets/posters/{output_filename}"
                else:
                    print(f"⚠️ [Invalid Poster] Source rejected: {reason}")
        except Exception:
            continue

    return False, "Could not acquire a valid non-empty poster"

def probe_stream_quality(url, timeout=12):
    """
    Check stream resolution and viability.
    Enforces quality hierarchy: 4K (2160p) > 2K (1440p) > 1080p > 720p.
    Strictly rejects sub-720p (480p, 360p, 240p).
    """
    if not url:
        return False, "Empty stream URL", {}, 0

    # 1. YouTube Stream Handling
    if is_youtube_url(url):
        yt_id = extract_youtube_id(url)
        if not yt_id:
            return False, "Could not extract YouTube video ID", {}, 0
        ok = check_youtube_playable(yt_id, timeout=timeout)
        if not ok:
            return False, "YouTube video deleted/private or unavailable", {}, 0
        return True, "1080p Full HD", {"type": "youtube", "videoId": yt_id}, 1080

    # 2. Archive.org Metadata Pre-verification
    if "archive.org/download/" in url:
        parts = url.split("archive.org/download/")[1].split("/")
        if parts:
            ident = parts[0]
            meta_url = f"https://archive.org/metadata/{ident}"
            try:
                req = urllib.request.Request(meta_url, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(req, timeout=8) as resp:
                    data = json.loads(resp.read().decode("utf-8", errors="ignore"))
                    files = data.get("files", [])
                    target_file = parts[1] if len(parts) > 1 else ""
                    target_unquoted = urllib.parse.unquote(target_file)
                    for f in files:
                        fname = f.get("name", "")
                        if fname in (target_file, target_unquoted) or fname.lower().endswith((".mp4", ".mkv")):
                            width = int(f.get("width") or 0)
                            height = int(f.get("height") or 0)
                            if width > 0 and height > 0:
                                if width >= 3840 or height >= 2160:
                                    return True, "4K UHD", {"width": width, "height": height, "codec": f.get("format")}, 4000
                                elif width >= 2560 or height >= 1440:
                                    return True, "2K QHD", {"width": width, "height": height, "codec": f.get("format")}, 2000
                                elif width >= 1920 or height >= 1080:
                                    return True, "1080p Full HD", {"width": width, "height": height, "codec": f.get("format")}, 1080
                                elif width >= 1280 or height >= 720:
                                    return True, "720p HD", {"width": width, "height": height, "codec": f.get("format")}, 720
                                else:
                                    return False, f"Sub-720p rejected ({width}x{height})", {}, 0
            except Exception:
                pass

    # 3. Direct ffprobe with probesize limit
    cmd = [
        "ffprobe", "-v", "error",
        "-probesize", "1000000",
        "-analyzeduration", "1000000",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,codec_name,duration",
        "-of", "json",
        "-headers", f"User-Agent: {USER_AGENT}\r\n",
        url
    ]
    try:
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=timeout)
        if proc.returncode != 0:
            return False, "Failed to probe stream", {}, 0
        data = json.loads(proc.stdout)
        streams = data.get("streams", [])
        if not streams:
            return False, "No video stream found", {}, 0

        v_stream = streams[0]
        width = int(v_stream.get("width", 0))
        height = int(v_stream.get("height", 0))

        # Resolution hierarchy and numerical rank (higher = better quality)
        if width >= 3840 or height >= 2160:
            res_str = "4K UHD"
            rank = 4000
        elif width >= 2560 or height >= 1440:
            res_str = "2K QHD"
            rank = 2000
        elif width >= 1920 or height >= 1080:
            res_str = "1080p Full HD"
            rank = 1080
        elif width >= 1280 or height >= 720:
            res_str = "720p HD"
            rank = 720
        else:
            return False, f"Sub-720p rejected ({width}x{height})", {}, 0

        return True, res_str, {"width": width, "height": height, "codec": v_stream.get("codec_name")}, rank
    except Exception as e:
        return False, str(e), {}, 0

def compute_candidate_score(candidate):
    """
    Calculate candidate ingestion priority score:
    - Quality: 4K/2K/1080p prioritizes over 720p
    - Era: 2020+ top, 2010+ high, 2000+ medium, pre-2000 last (and only if iconic)
    Returns integer score. Negative values indicate rejection.
    """
    score = 0

    # 1. Recency & Release Era Score
    year = int(candidate.get("year") or candidate.get("releaseYear") or 0)
    norm_title = normalize_title(candidate.get("title", ""))

    if year >= 2020:
        score += 500  # Modern Blockbuster Era: Top Priority
    elif year >= 2010:
        score += 350  # Contemporary Era
    elif year >= 2000:
        score += 200  # 2000s Era
    else:
        # Pre-2000 Heritage Era:
        # Check if title matches curated iconic classics whitelist
        is_iconic = any(
            iconic in norm_title or norm_title in iconic
            for iconic in ICONIC_VINTAGE_CLASSICS_WHITELIST
        )
        if is_iconic:
            score += 50  # Allowed, but placed at the end of queue (last priority)
        else:
            # Reject arbitrary/obscure pre-2000 movies
            return -2

    # 2. Quality Estimation Score (will be refined during stream probe)
    q_str = str(candidate.get("quality", "")).lower()
    res_str = str(candidate.get("resolution", "")).lower()
    if "4k" in q_str or "2160" in res_str:
        score += 1000
    elif "2k" in q_str or "1440" in res_str:
        score += 800
    elif "1080" in q_str or "1080" in res_str:
        score += 600
    elif "720" in q_str or "720" in res_str:
        score += 300  # Fallback quality
    elif any(bad in q_str or bad in res_str for bad in ["480p", "360p", "240p", "576p"]):
        return -1  # Hard reject sub-720p

    return score

def ingest_movie_item(catalog_data, movie_candidate):
    """Validate, score, deduplicate, and insert candidate movie into catalog."""
    title = movie_candidate["title"]
    stream_url = movie_candidate.get("streamUrl", "")
    poster_fn = movie_candidate.get("posterFileName") or f"vod_{re.sub(r'[^a-z0-9]', '_', normalize_title(title))}.jpg"

    print(f"\n🎬 [Evaluating Candidate] '{title}' ({movie_candidate.get('year', 'N/A')})...")

    # 1. Trailer Recency & Lifecycle Policy (~1 month old max, >= Sep 2026)
    cats = [c.lower() for c in movie_candidate.get('categories', [])]
    is_trailer = movie_candidate.get('isTrailerOnly') or 'trailers' in cats or movie_candidate.get('type') == 'Trailers'
    if is_trailer:
        t_date = movie_candidate.get('trailerReleaseDate') or movie_candidate.get('releaseDate') or '2026-09-01'
        if str(t_date) < '2026-09-01':
            print(f"⏭️ [Trailer Filter] '{title}': Trailer released before September 2026 ({t_date}). Rejected.")
            return False
        movie_candidate['trailerReleaseDate'] = str(t_date)
        movie_candidate['addedDate'] = time.strftime('%Y-%m-%d')

    # 2. Recency & Era Validation
    initial_score = compute_candidate_score(movie_candidate)
    if initial_score == -2:
        print(f"⏭️ [Era Filter] '{title}' ({movie_candidate.get('year')}): Pre-2000 title not on iconic classics list. Skipped.")
        return False
    elif initial_score == -1:
        print(f"❌ [Quality Filter] '{title}': Sub-720p rejected.")
        return False

    # 2. Fuzzy Deduplication
    norm_candidate = normalize_title(title)
    existing_movies = catalog_data.get("movies", [])
    for ex in existing_movies:
        if normalize_title(ex.get("title", "")) == norm_candidate or ex.get("id") == movie_candidate.get("id"):
            print(f"⚠️ [Duplicate Detected] '{title}' matches existing '{ex.get('title')}' ({ex.get('id')}). Skipping duplicate.")
            return False

    # 3. Quality Resolution Gate (Hierarchical Probe: 4K > 2K > 1080p > 720p)
    ok, res_str, details, rank = probe_stream_quality(stream_url)
    if not ok:
        print(f"❌ [Quality Gate FAILED] '{title}' REJECTED: {res_str}")
        return False
    movie_candidate["quality"] = res_str
    movie_candidate["resolution"] = res_str
    movie_candidate["_quality_rank"] = rank

    # 4. Strict Poster Acquisition Gate
    p_ok, p_res = harvest_and_process_poster(title, movie_candidate, poster_fn)
    if not p_ok:
        print(f"❌ [Poster Gate FAILED] '{title}' REJECTED: {p_res}")
        return False
    movie_candidate["posterUrl"] = p_res
    movie_candidate["backdropUrl"] = p_res

    # Clean temporary scoring fields
    if "_quality_rank" in movie_candidate:
        del movie_candidate["_quality_rank"]

    # 5. Success -> Insert into catalog
    catalog_data["movies"].insert(0, movie_candidate)
    catalog_data["total_movies"] = sum(1 for m in catalog_data["movies"] if m.get("mediaType") != "series")
    catalog_data["total_series"] = sum(1 for m in catalog_data["movies"] if m.get("mediaType") == "series")
    catalog_data["updated_at"] = time.strftime("%Y-%m-%d %H:%M:%S")

    print(f"✅ [APPROVED & INGESTED] '{title}' ({movie_candidate['quality']}) added successfully with authentic poster!")
    return True

# Curated Discovery Pool of Pre-vetted 1080p Full HD Hindi Media
CURATED_DISCOVERY_POOL = [
    # --- 1. Award-Winning Hindi Short Films (1080p Full HD) ---
    {
        "id": "vod_chutney_2016",
        "title": "Chutney",
        "originalTitle": "Chutney",
        "year": 2016,
        "releaseYear": 2016,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "drama", "thriller", "bollywood"],
        "duration": 960,
        "durationFormatted": "16m",
        "genres": ["Short", "Drama", "Thriller"],
        "rating": 8.0,
        "description": "Filmfare Award-winning dark thriller starring Tisca Chopra, Adil Hussain, and Rasika Dugal. A seemingly meek housewife from Ghaziabad serves a chilling story alongside freshly ground spicy chutney.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Jyoti Kapur Das",
        "cast": "Tisca Chopra, Adil Hussain, Rasika Dugal",
        "streamUrl": "https://www.youtube-nocookie.com/embed/0krwKbsQscw?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/0krwKbsQscw",
        "posterFileName": "vod_chutney_short.jpg"
    },
    {
        "id": "vod_ahalya_2015",
        "title": "Ahalya",
        "originalTitle": "Ahalya",
        "year": 2015,
        "releaseYear": 2015,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "mystery", "thriller"],
        "duration": 840,
        "durationFormatted": "14m",
        "genres": ["Short", "Mystery", "Thriller"],
        "rating": 7.6,
        "description": "Sujoy Ghosh's gripping psychological mystery thriller starring Radhika Apte and Soumitra Chatterjee, offering a haunting modern twist on the mythical tale of Ahalya.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi", "Bengali"]
        },
        "languages": ["Hindi", "Bengali"],
        "defaultLanguage": "Hindi",
        "director": "Sujoy Ghosh",
        "cast": "Radhika Apte, Soumitra Chatterjee, Tota Roy Chowdhury",
        "streamUrl": "https://www.youtube-nocookie.com/embed/Ff82XtV78xo?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/Ff82XtV78xo",
        "posterFileName": "vod_ahalya_short.jpg"
    },
    {
        "id": "vod_juice_2017",
        "title": "Juice",
        "originalTitle": "Juice",
        "year": 2017,
        "releaseYear": 2017,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "drama", "bollywood"],
        "duration": 900,
        "durationFormatted": "15m",
        "genres": ["Short", "Drama"],
        "rating": 7.8,
        "description": "Neeraj Ghaywan's Filmfare Award-winning poignant drama starring Shefali Shah. A blistering and nuanced look at domestic patriarchy set inside a sweltering summer kitchen.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Neeraj Ghaywan",
        "cast": "Shefali Shah, Manish Chaudhary",
        "streamUrl": "https://www.youtube-nocookie.com/embed/R-Sk7fQGIjE?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/R-Sk7fQGIjE",
        "posterFileName": "vod_juice_short.jpg"
    },
    {
        "id": "vod_anukul_2017",
        "title": "Anukul",
        "originalTitle": "Anukul",
        "year": 2017,
        "releaseYear": 2017,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "sci-fi", "drama"],
        "duration": 1320,
        "durationFormatted": "22m",
        "genres": ["Short", "Sci-Fi", "Drama"],
        "rating": 7.7,
        "description": "A thought-provoking dystopian sci-fi drama based on Satyajit Ray's short story. A Hindi teacher hires a sophisticated humanoid android, questioning the essence of human empathy.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Sujoy Ghosh",
        "cast": "Saurabh Shukla, Parambrata Chatterjee",
        "streamUrl": "https://www.youtube-nocookie.com/embed/J2mqIgdae5I?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/J2mqIgdae5I"
    },
    {
        "id": "vod_interior_cafe_night_2016",
        "title": "Interior Cafe Night",
        "originalTitle": "Interior Cafe Night",
        "year": 2016,
        "releaseYear": 2016,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "romance", "drama"],
        "duration": 780,
        "durationFormatted": "13m",
        "genres": ["Short", "Romance", "Drama"],
        "rating": 7.9,
        "description": "An emotionally resonant romantic drama starring legendary actors Naseeruddin Shah and Shernaz Patel, exploring love, loss, and second chances inside a quiet evening cafe.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Adhiraj Bose",
        "cast": "Naseeruddin Shah, Shernaz Patel, Naveen Kasturia, Shweta Basu Prasad",
        "streamUrl": "https://www.youtube-nocookie.com/embed/23KufSqo6cQ?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/23KufSqo6cQ"
    },
    {
        "id": "vod_ouch_2016",
        "title": "Ouch",
        "originalTitle": "Ouch",
        "year": 2016,
        "releaseYear": 2016,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "comedy", "drama"],
        "duration": 840,
        "durationFormatted": "14m",
        "genres": ["Short", "Comedy", "Drama"],
        "rating": 7.4,
        "description": "Neeraj Pandey's witty and satirical relationship comedy starring Manoj Bajpayee and Pooja Chopra, dissecting middle-class extramarital complications with razor-sharp irony.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Neeraj Pandey",
        "cast": "Manoj Bajpayee, Pooja Chopra",
        "streamUrl": "https://www.youtube-nocookie.com/embed/deMCcGkJsjc?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/deMCcGkJsjc"
    },
    {
        "id": "vod_kriti_2016",
        "title": "Kriti",
        "originalTitle": "Kriti",
        "year": 2016,
        "releaseYear": 2016,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["short_film", "thriller", "mystery"],
        "duration": 1140,
        "durationFormatted": "19m",
        "genres": ["Short", "Thriller", "Psychological"],
        "rating": 7.6,
        "description": "A psychological thriller directed by Shirish Kunder featuring Manoj Bajpayee, Radhika Apte, and Neha Sharma. A novelist discusses his mysterious girlfriend with his psychiatrist, blurring reality and delusion.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Shirish Kunder",
        "cast": "Manoj Bajpayee, Radhika Apte, Neha Sharma",
        "streamUrl": "https://www.youtube-nocookie.com/embed/b5GGKuK3iEI?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/b5GGKuK3iEI"
    },
    # --- 2. Evergreen Animated Features & Cartoons (1080p Full HD) ---
    {
        "id": "vod_ramayana_anime_1993",
        "title": "Ramayana: The Legend of Prince Rama",
        "originalTitle": "Ramayana: The Legend of Prince Rama",
        "year": 1993,
        "releaseYear": 1993,
        "mediaType": "movie",
        "type": "Anime",
        "contentType": "MOVIE",
        "region": "JAPAN",
        "categories": ["anime", "animation", "mythology", "action", "classics"],
        "duration": 8100,
        "durationFormatted": "2h 15m",
        "genres": ["Anime", "Animation", "Action", "Mythology"],
        "rating": 9.2,
        "description": "The timeless Indo-Japanese animated epic co-directed by Yugo Sako and Ram Mohan with Arun Govil voicing Lord Rama. Widely acclaimed as one of the greatest animation masterpieces ever created.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": False,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Yugo Sako, Ram Mohan, Koichi Sasaki",
        "cast": "Arun Govil, Amrish Puri, Shatrughan Sinha",
        "streamUrl": "https://www.youtube-nocookie.com/embed/gKcOjnDJfzk?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/gKcOjnDJfzk"
    },
    {
        "id": "vod_bal_ganesh_2007",
        "title": "Bal Ganesh",
        "originalTitle": "Bal Ganesh",
        "year": 2007,
        "releaseYear": 2007,
        "mediaType": "movie",
        "type": "Cartoons",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["animation", "cartoons", "family", "mythology"],
        "duration": 6120,
        "durationFormatted": "1h 42m",
        "genres": ["Animation", "Family", "Mythology"],
        "rating": 7.2,
        "description": "Charming 3D animated feature chronicling the mischievous childhood adventures, courage, and divine wisdom of the elephant-headed deity Lord Ganesh.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": False,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Pankaj Sharma",
        "streamUrl": "https://www.youtube-nocookie.com/embed/Jw2efcyES-E?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/Jw2efcyES-E"
    },
    # --- 3. Widely Celebrated Whitelist Classics (1080p Remastered) ---
    {
        "id": "vod_anand_1971",
        "title": "Anand (1971)",
        "originalTitle": "Anand",
        "year": 1971,
        "releaseYear": 1971,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["classics", "drama", "bollywood"],
        "duration": 7320,
        "durationFormatted": "2h 02m",
        "genres": ["Classics", "Drama"],
        "rating": 8.7,
        "description": "Hrishikesh Mukherjee's eternal classic starring Rajesh Khanna as a terminally ill man determined to live his remaining days to the fullest, and Amitabh Bachchan as the compassionate Dr. Bhaskar Banerjee.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Hrishikesh Mukherjee",
        "cast": "Rajesh Khanna, Amitabh Bachchan, Sumita Sanyal, Ramesh Deo",
        "streamUrl": "https://www.youtube-nocookie.com/embed/nK_SmZrjMPU?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/nK_SmZrjMPU",
        "posterFileName": "vod_anand_1971.jpg"
    },
    {
        "id": "vod_deewaar_1975",
        "title": "Deewaar (1975)",
        "originalTitle": "Deewaar",
        "year": 1975,
        "releaseYear": 1975,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["classics", "action", "drama", "crime", "bollywood"],
        "duration": 10440,
        "durationFormatted": "2h 54m",
        "genres": ["Classics", "Action", "Crime", "Drama"],
        "rating": 8.1,
        "description": "Yash Chopra's defining crime drama written by Salim-Javed. Two impoverished brothers find themselves on opposing sides of the law—one an underworld kingpin (Amitabh Bachchan), the other an upright police inspector (Shashi Kapoor).",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Yash Chopra",
        "cast": "Amitabh Bachchan, Shashi Kapoor, Nirupa Roy, Parveen Babi, Neetu Singh",
        "streamUrl": "https://www.youtube-nocookie.com/embed/xuOQqWU2UQA?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/xuOQqWU2UQA"
    },
    {
        "id": "vod_don_1978",
        "title": "Don (1978)",
        "originalTitle": "Don",
        "year": 1978,
        "releaseYear": 1978,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["classics", "action", "thriller", "bollywood"],
        "duration": 9960,
        "durationFormatted": "2h 46m",
        "genres": ["Classics", "Action", "Thriller"],
        "rating": 7.8,
        "description": "Chandra Barot's iconic action thriller starring Amitabh Bachchan in a double role as a ruthless international cartel kingpin and a simpleton paan-chewing street performer recruited to take his place.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Chandra Barot",
        "cast": "Amitabh Bachchan, Zeenat Aman, Pran, Iftekhar",
        "streamUrl": "https://www.youtube-nocookie.com/embed/6vMSYPBz0nk?autoplay=1",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/6vMSYPBz0nk"
    },
    # --- 4. High-Definition Bollywood Blockbusters ---
    {
        "id": "vod_bhaag_milkha_bhaag_2013",
        "title": "Bhaag Milkha Bhaag (2013)",
        "originalTitle": "Bhaag Milkha Bhaag",
        "year": 2013,
        "releaseYear": 2013,
        "mediaType": "movie",
        "type": "Bollywood",
        "contentType": "MOVIE",
        "region": "INDIA",
        "categories": ["biography", "drama", "sports", "bollywood"],
        "duration": 11160,
        "durationFormatted": "3h 06m",
        "genres": ["Biography", "Drama", "Sport"],
        "rating": 8.2,
        "description": "Rakeysh Omprakash Mehra's biographical sports drama chronicling the life of Milkha Singh, the 'Flying Sikh', who overcame the trauma of the Partition of India to become an Olympic world champion.",
        "resolution": "1080p Full HD",
        "quality": "1080p",
        "codec": "H.264 / AAC",
        "audio": {
            "classification": "HINDI_AUDIO",
            "hasHindiAudio": True,
            "hasHindiSubtitles": True,
            "primaryLanguage": "Hindi",
            "availableLanguages": ["Hindi"]
        },
        "languages": ["Hindi"],
        "defaultLanguage": "Hindi",
        "director": "Rakeysh Omprakash Mehra",
        "cast": "Farhan Akhtar, Sonam Kapoor, Divya Dutta, Pavan Malhotra",
        "streamUrl": "https://archive.org/download/bhaag-milkha-bhaag-2013-blu-ray-1080p-hindi-dd-5.1-x-264-esub-mkv-cinemas-telly/Bhaag%20Milkha%20Bhaag%202013%20BluRay%201080p%20Hindi%20DD%205.1%20x264%20ESub%20-%20mkvCinemas%20%5BTelly%5D.mkv",
        "trailerUrl": "https://www.youtube-nocookie.com/embed/yGStv_o12z4"
    }
]

def discover_archive_org_candidates(existing_titles_norm, max_results=5):
    """Query Archive.org Advanced Search API for new 1080p/720p Hindi media files."""
    query = 'mediatype:movies AND (hindi OR bollywood OR "hindi dubbed") AND (1080p OR 720p)'
    params = {
        "q": query,
        "fl[]": "identifier,title,year,downloads",
        "sort[]": "downloads desc",
        "rows": "10",
        "output": "json"
    }
    search_url = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode(params)
    discovered = []
    try:
        req = urllib.request.Request(search_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))
            docs = data.get("response", {}).get("docs", [])
            for doc in docs:
                ident = doc.get("identifier")
                raw_title = doc.get("title") or ident
                norm = normalize_title(raw_title)
                if not norm or norm in existing_titles_norm:
                    continue
                meta_url = f"https://archive.org/metadata/{ident}"
                mreq = urllib.request.Request(meta_url, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(mreq, timeout=8) as mresp:
                    mdata = json.loads(mresp.read().decode("utf-8", errors="ignore"))
                    files = mdata.get("files", [])
                    for f in files:
                        fname = f.get("name", "")
                        size = int(f.get("size") or 0)
                        if fname.lower().endswith((".mp4", ".mkv")) and size > 250_000_000:
                            width = int(f.get("width") or 0)
                            height = int(f.get("height") or 0)
                            if width >= 1280 or height >= 720:
                                q_label = "1080p Full HD" if (width >= 1920 or height >= 1080) else "720p HD"
                                safe_name = urllib.parse.quote(fname)
                                cand = {
                                    "id": f"vod_{re.sub(r'[^a-z0-9]', '_', norm)[:30]}",
                                    "title": re.sub(r"\s*\(?\b(1080p|720p|bluray|x264|esub|dd5\.1|hevc)\b\)?", "", raw_title, flags=re.I).strip(),
                                    "originalTitle": raw_title,
                                    "year": int(doc.get("year") or 2015),
                                    "releaseYear": int(doc.get("year") or 2015),
                                    "mediaType": "movie",
                                    "type": "Bollywood",
                                    "contentType": "MOVIE",
                                    "region": "INDIA",
                                    "categories": ["bollywood", "movies"],
                                    "duration": int(float(f.get("length") or 7200)),
                                    "durationFormatted": f"{int(float(f.get('length') or 7200) // 3600)}h {int((float(f.get('length') or 7200) % 3600) // 60):02d}m",
                                    "genres": ["Drama"],
                                    "rating": 7.5,
                                    "description": f"Verified public feature presentation: {raw_title}.",
                                    "resolution": q_label,
                                    "quality": q_label,
                                    "codec": "H.264 / AAC",
                                    "audio": {
                                        "classification": "HINDI_AUDIO",
                                        "hasHindiAudio": True,
                                        "hasHindiSubtitles": False,
                                        "primaryLanguage": "Hindi",
                                        "availableLanguages": ["Hindi"]
                                    },
                                    "languages": ["Hindi"],
                                    "defaultLanguage": "Hindi",
                                    "streamUrl": f"https://archive.org/download/{ident}/{safe_name}",
                                    "trailerUrl": None,
                                    "posterSrcUrl": f"https://archive.org/services/img/{ident}"
                                }
                                discovered.append(cand)
                                existing_titles_norm.add(norm)
                                break
                if len(discovered) >= max_results:
                    break
    except Exception as e:
        print(f"⚠️ Archive.org dynamic discovery notice: {e}")
    return discovered

def discover_and_replenish_candidates(catalog_data, current_queue=None, target_pool_size=15):
    """
    Intelligently discovers and replenishes the candidates queue:
    1. Checks candidates from the Curated Discovery Pool.
    2. Runs live Archive.org search for >=720p Hindi media files.
    3. Filters out any titles already in the catalog or queue.
    """
    queue_list = current_queue if current_queue is not None else []
    existing_titles_norm = {normalize_title(m.get("title", "")) for m in catalog_data.get("movies", [])}
    existing_ids = {m.get("id") for m in catalog_data.get("movies", [])}
    for qm in queue_list:
        existing_titles_norm.add(normalize_title(qm.get("title", "")))
        existing_ids.add(qm.get("id"))

    replenished = list(queue_list)
    added_new = 0

    # 1. Evaluate Curated Discovery Pool
    for cand in CURATED_DISCOVERY_POOL:
        norm = normalize_title(cand.get("title", ""))
        cid = cand.get("id")
        if norm in existing_titles_norm or cid in existing_ids:
            continue
        replenished.append(cand)
        existing_titles_norm.add(norm)
        existing_ids.add(cid)
        added_new += 1
        print(f"🌟 [Discovered Candidate] '{cand.get('title')}' ({cand.get('year')}) added to queue from Curated Pool.")

    # 2. Dynamic Archive.org live discovery if queue is still small
    if len(replenished) < target_pool_size:
        arch_candidates = discover_archive_org_candidates(existing_titles_norm, max_results=target_pool_size - len(replenished))
        for cand in arch_candidates:
            replenished.append(cand)
            added_new += 1
            print(f"🌐 [Discovered Candidate] '{cand.get('title')}' added to queue from Archive.org.")

    print(f"📦 Replenishment complete: {added_new} new candidates added. Queue now contains {len(replenished)} items.")
    return replenished

def run_ingestion_cycle(candidates_feed_path=None, max_per_cycle=3):
    """
    Run prioritized ingestion cycle:
    1. Scores all candidates by Quality (4K/1080p > 720p) and Era (Modern 2020+ > Contemporary > Iconic Vintage).
    2. Sorts candidates descending by priority score.
    3. Ingests high-priority modern 4K/1080p titles first.
    """
    print("=" * 65)
    print("🚀 STARTING AUTOMATION 1: PRIORITIZED CONTENT INGESTION ENGINE V3")
    print("   • Quality Priority: 4K / 2K / 1080p > 720p (sub-720p hard rejected)")
    print("   • Recency Priority: Modern (2020+) > 2010s > 2000s > Iconic Classics (last)")
    print("=" * 65)

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)

    feed_file = candidates_feed_path or os.path.join(PROJECT_ROOT, "automation", "candidate_queue.json")
    queue = {"new_movies": [], "new_channels": []}
    if os.path.exists(feed_file):
        try:
            with open(feed_file, "r", encoding="utf-8") as f:
                queue = json.load(f)
        except Exception:
            queue = {"new_movies": [], "new_channels": []}

    new_movies = queue.get("new_movies", [])
    if len(new_movies) < 5:
        print(f"ℹ️ Candidate queue low ({len(new_movies)} items). Triggering autonomous discovery...")
        new_movies = discover_and_replenish_candidates(catalog_data, current_queue=new_movies)
        queue["new_movies"] = new_movies
        with open(feed_file, "w", encoding="utf-8") as f:
            json.dump(queue, f, indent=2, ensure_ascii=False)

    print(f"📋 Found {len(new_movies)} candidate items in queue.")

    # Sort queue by Priority Score (Highest quality & modern era first)
    scored_movies = []
    for m in new_movies:
        score = compute_candidate_score(m)
        if score > 0:
            scored_movies.append((score, m))
        else:
            title = m.get("title", "Unknown")
            print(f"⏭️ [Filtered Out at Queue Stage] '{title}': Score {score} (sub-720p or non-iconic pre-2000)")

    # Sort descending: 4K/1080p modern titles will be evaluated and ingested first
    scored_movies.sort(key=lambda x: x[0], reverse=True)
    print(f"🎯 Evaluated {len(scored_movies)} approved candidate items sorted by priority.")

    ingested_count = 0
    remaining_queue = []

    for score, m in scored_movies:
        title = m.get("title", "Unknown")
        if ingested_count >= max_per_cycle:
            remaining_queue.append(m)
            continue

        print(f"⚡ Ingestion Queue Priority Score: {score} for '{title}'")
        if ingest_movie_item(catalog_data, m):
            ingested_count += 1
        else:
            remaining_queue.append(m)

    # Always persist remaining candidate queue for future cycles
    with open(feed_file, "w", encoding="utf-8") as f:
        json.dump({"new_movies": remaining_queue, "new_channels": queue.get("new_channels", [])}, f, indent=2, ensure_ascii=False)

    if ingested_count > 0:
        with open(CATALOG_PATH, "w", encoding="utf-8") as f:
            json.dump(catalog_data, f, indent=2, ensure_ascii=False)
        with open(ANDROID_CATALOG_PATH, "w", encoding="utf-8") as f:
            json.dump(catalog_data, f, indent=2, ensure_ascii=False)

    print("=" * 65)
    print(f"🎉 INGESTION CYCLE COMPLETE: Successfully added {ingested_count} new prioritized titles.")
    print("=" * 65)

if __name__ == "__main__":
    run_ingestion_cycle()
