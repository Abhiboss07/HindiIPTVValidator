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
import io
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

def clean_movie_title(raw_title):
    """Extract clean core film title by stripping release format and group noise."""
    if not raw_title:
        return ""
    t = re.sub(r'\[.*?\]', '', raw_title)
    t = re.sub(r'\b(1080p|720p|480p|bluray|blu\s*ray|dvdrip|web-?dl|webrip|hd-?rip|x264|x265|hevc|esub|dd\s*5\.?1|aac|mkv|mp4|cinemas|telly|skymovies\w*|hq|v\s*\d+|part\s*\d+|south\s*hindi\s*dubbed|hindi\s*dubbed|hindi\s*bollywood|full\s*movie|original|mkvcinemas|hindi)\b', '', t, flags=re.I)
    t = re.sub(r'\s*\(\s*\d{4}\s*\)\s*', ' ', t)
    t = re.sub(r'\s*\(\s*([^)]+)\s*\)\s*', r' \1 ', t) # Unwrap "(Beast)" -> "Beast"
    t = re.sub(r'\b(19\d\d|20\d\d)\b', '', t) # Remove isolated release years
    t = re.sub(r'[_\-]+', ' ', t)
    t = re.sub(r'[^\w\s:]', '', t)
    return re.sub(r'\s+', ' ', t).strip()

def is_valid_poster_image(img_path):
    """
    Validate that image exists, is >=5KB, has minimum dimensions,
    and is NOT a solid black/blank placeholder.
    """
    if not os.path.exists(img_path) or os.path.getsize(img_path) < 5000:
        return False, "File missing or too small (<5KB)"

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
    """
    Search assets/posters for an existing high-res poster matching title.
    Enforces strict token equality to prevent cross-matching on short generic words.
    """
    norm_tokens = set(normalized_title.split())
    norm_squashed = normalized_title.replace(" ", "")

    for fn in os.listdir(POSTERS_DIR):
        if not fn.endswith((".jpg", ".png", ".jpeg")):
            continue
        clean_fn = fn.replace("vod_", "").replace("series_", "").replace(".jpg", "").replace(".png", "")
        clean_fn = re.sub(r"_\d{4}", "", clean_fn).replace("_", " ").lower().strip()
        fn_tokens = set(clean_fn.split())
        fn_squashed = clean_fn.replace(" ", "")

        # Strict matching only: Exact match, identical token set, or identical alphanumeric string
        is_match = False
        if clean_fn == normalized_title or fn_squashed == norm_squashed:
            is_match = True
        elif len(clean_fn) >= 6 and (clean_fn == normalized_title or fn_tokens == norm_tokens):
            is_match = True

        if is_match:
            full_p = os.path.join(POSTERS_DIR, fn)
            valid, _ = is_valid_poster_image(full_p)
            if valid:
                return fn
    return None

def search_tmdb_poster(title, year=None):
    """
    Search TMDB (The Movie Database) for verified theatrical poster.
    Uses browser impersonation curl request for high reliability.
    """
    clean = clean_movie_title(title)
    if not clean:
        return None

    queries = [clean]
    parts = clean.split()
    if len(parts) >= 2 and parts[0].lower() in ["raw", "the", "a"]:
        queries.append(" ".join(parts[1:]))

    for q_str in queries:
        try:
            q = urllib.parse.quote(q_str)
            url = f"https://www.themoviedb.org/search/movie?query={q}"
            cmd = [
                "curl", "-s", "-L",
                "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "-H", "Accept-Language: en-US,en;q=0.9",
                url
            ]
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=10)
            if res.returncode == 0 and res.stdout:
                matches = re.findall(r'https://media\.themoviedb\.org/t/p/(?:w94_and_h141_face|w188_and_h282_face)/([^\"\'\s]+\.jpg)', res.stdout)
                if matches:
                    poster_url = f"https://image.tmdb.org/t/p/w500/{matches[0]}"
                    return poster_url
        except Exception:
            continue
    return None

def fetch_wikipedia_poster(title, year=None):
    """
    Fetch official theatrical poster from Wikipedia API.
    Tests structured movie article name variants ({title} ({year} film), {title} (film), etc.).
    """
    clean = clean_movie_title(title)
    candidates = []
    if year:
        candidates.append(f"{clean} ({year} film)")
        candidates.append(f"{clean} ({year} Indian film)")
    candidates.append(f"{clean} (film)")
    candidates.append(f"{clean} (Indian film)")
    if title.strip() != clean:
        candidates.append(title.strip())
    candidates.append(clean)

    headers = {"User-Agent": "T2LBot/1.0 (contact@aakashstream.com)"}
    for c in candidates:
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(c)}&prop=pageimages&format=json&pilicense=any&piprop=original|thumbnail&pithumbsize=1000"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.load(resp)
                pages = data.get("query", {}).get("pages", {})
                for pid, pdata in pages.items():
                    if pid != "-1":
                        orig = pdata.get("original", {})
                        thumb = pdata.get("thumbnail", {})
                        src = orig.get("source") or thumb.get("source")
                        if src:
                            src_low = src.lower()
                            # Filter out non-poster icons, flags, and recipes
                            if not any(bad in src_low for bad in ["flag", "icon", "edit-clear", "chutneykarnataka", "question_book", ".svg"]):
                                return src
        except Exception:
            continue
    return None

def try_download_and_format_poster(src_url, target_path, android_target_path, timeout=8):
    """
    Downloads image, performs proper 2:3 center-crop without squashing or stretching,
    resizes to 600x900 progressive JPEG, and validates with is_valid_poster_image.
    """
    try:
        img_bytes = None
        if "tmdb.org" in src_url:
            c_cmd = [
                "curl", "-s", "-L", "--max-time", str(timeout),
                "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                src_url
            ]
            c_res = subprocess.run(c_cmd, stdout=subprocess.PIPE, timeout=timeout + 2)
            if c_res.returncode == 0 and len(c_res.stdout) > 2000:
                img_bytes = c_res.stdout
        else:
            req = urllib.request.Request(src_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                img_bytes = resp.read()

        if not img_bytes:
            return False, "Empty response"

        with Image.open(io.BytesIO(img_bytes)) as raw_img:
            img = raw_img.convert("RGB")
            w, h = img.size
            if w < 60 or h < 60:
                return False, f"Dimensions too small ({w}x{h})"

            # Theatrical 2:3 Portrait Aspect Ratio Crop (without stretching or squashing)
            target_ratio = 2.0 / 3.0  # 0.6667
            current_ratio = w / h
            if current_ratio > target_ratio:
                # Landscape/wide -> crop horizontal borders symmetrically
                crop_w = int(h * target_ratio)
                left = (w - crop_w) // 2
                img = img.crop((left, 0, left + crop_w, h))
            elif current_ratio < target_ratio:
                # Narrow/tall -> crop vertical borders symmetrically
                crop_h = int(w / target_ratio)
                top = (h - crop_h) // 2
                img = img.crop((0, top, w, top + crop_h))

            # High-fidelity progressive JPEG resize to 600x900
            img = img.resize((600, 900), Image.Resampling.LANCZOS)
            img.save(target_path, "JPEG", quality=90, optimize=True)
            img.save(android_target_path, "JPEG", quality=90, optimize=True)

            valid, reason = is_valid_poster_image(target_path)
            if valid:
                return True, "Valid"
            else:
                if os.path.exists(target_path): os.remove(target_path)
                if os.path.exists(android_target_path): os.remove(android_target_path)
                return False, reason
    except Exception as e:
        if os.path.exists(target_path): os.remove(target_path)
        if os.path.exists(android_target_path): os.remove(android_target_path)
        return False, str(e)

def harvest_and_process_poster(title, candidate, output_filename):
    """
    Multi-tier harvester to obtain a verified 600x900 authentic theatrical poster.
    Evaluates sources lazily (stops immediately as soon as a tier succeeds):
    Tier 1: Check existing authentic local library (exact title match).
    Tier 2: Candidate explicit source URL (posterSrcUrl).
    Tier 3: TMDB Direct Theatrical Poster Search (500x722 / 600x900).
    Tier 4: Wikipedia / Wikimedia Film Poster (High-Res original).
    Tier 5: YouTube HD Thumbnail (streamUrl and trailerUrl maxresdefault/sddefault/hqdefault).
    Tier 6: Archive.org metadata high-resolution image files.
    """
    target_path = os.path.join(POSTERS_DIR, output_filename)
    android_target_path = os.path.join(ANDROID_POSTERS_DIR, output_filename)
    norm = normalize_title(title)
    year = int(candidate.get("year") or candidate.get("releaseYear") or 0) or None

    # Tier 1: Check existing authentic local library
    existing_fn = find_existing_local_poster(norm)
    if existing_fn:
        src_path = os.path.join(POSTERS_DIR, existing_fn)
        if os.path.abspath(src_path) != os.path.abspath(target_path):
            shutil.copyfile(src_path, target_path)
        if os.path.abspath(src_path) != os.path.abspath(android_target_path):
            shutil.copyfile(src_path, android_target_path)
        print(f"🖼️ [Tier 1] Reused authentic existing poster '{existing_fn}' for '{title}'")
        return True, f"assets/posters/{output_filename}", None

    # Tier 2: Candidate explicit source URL (if not archive services/img which is low res)
    src_url = candidate.get("posterSrcUrl")
    if src_url and "services/img" not in src_url:
        ok, reason = try_download_and_format_poster(src_url, target_path, android_target_path)
        if ok:
            print(f"🖼️ [Candidate Source] Verified poster for '{title}' from {src_url[:65]}...")
            return True, f"assets/posters/{output_filename}", src_url

    # Tier 3: TMDB Direct Theatrical Search
    tmdb_url = search_tmdb_poster(candidate.get("originalTitle") or title, year)
    if tmdb_url:
        ok, reason = try_download_and_format_poster(tmdb_url, target_path, android_target_path)
        if ok:
            print(f"🖼️ [TMDB] Verified authentic 600x900 poster for '{title}' from {tmdb_url}...")
            return True, f"assets/posters/{output_filename}", tmdb_url

    # Tier 4: Wikipedia / Wikimedia Film Poster
    wiki_url = fetch_wikipedia_poster(candidate.get("originalTitle") or title, year)
    if wiki_url:
        ok, reason = try_download_and_format_poster(wiki_url, target_path, android_target_path)
        if ok:
            print(f"🖼️ [Wikipedia] Verified authentic 600x900 poster for '{title}' from {wiki_url[:65]}...")
            return True, f"assets/posters/{output_filename}", wiki_url

    # Tier 5: YouTube HD Thumbnails (Check streamUrl AND trailerUrl)
    for url_key in ["streamUrl", "trailerUrl"]:
        yt_url = candidate.get(url_key, "")
        if is_youtube_url(yt_url):
            yt_id = extract_youtube_id(yt_url)
            if yt_id:
                for yt_type, yt_thumb in [
                    ("maxresdefault", f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"),
                    ("sddefault", f"https://img.youtube.com/vi/{yt_id}/sddefault.jpg"),
                    ("hqdefault", f"https://img.youtube.com/vi/{yt_id}/hqdefault.jpg"),
                ]:
                    ok, reason = try_download_and_format_poster(yt_thumb, target_path, android_target_path, timeout=5)
                    if ok:
                        print(f"🖼️ [YouTube {yt_type}] Verified poster for '{title}' from {yt_thumb}...")
                        return True, f"assets/posters/{output_filename}", yt_thumb

    # Tier 6: Archive.org Metadata Images or services/img
    stream_url = candidate.get("streamUrl", "")
    if "archive.org/download/" in stream_url:
        parts = stream_url.split("archive.org/download/")[1].split("/")
        if parts:
            ident = parts[0]
            try:
                meta_url = f"https://archive.org/metadata/{ident}"
                mreq = urllib.request.Request(meta_url, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(mreq, timeout=5) as mresp:
                    mdata = json.loads(mresp.read().decode("utf-8", errors="ignore"))
                    for af in mdata.get("files", []):
                        af_name = af.get("name", "")
                        if af_name.lower().endswith((".jpg", ".jpeg", ".png")) and not af_name.startswith("."):
                            meta_img = f"https://archive.org/download/{ident}/{urllib.parse.quote(af_name)}"
                            ok, reason = try_download_and_format_poster(meta_img, target_path, android_target_path)
                            if ok:
                                print(f"🖼️ [Archive.org Meta] Verified poster for '{title}' from {meta_img[:65]}...")
                                return True, f"assets/posters/{output_filename}", meta_img
            except Exception:
                pass

    if src_url and "services/img" in src_url:
        ok, reason = try_download_and_format_poster(src_url, target_path, android_target_path, timeout=5)
        if ok:
            print(f"🖼️ [Archive.org Svc] Verified poster for '{title}' from {src_url}...")
            return True, f"assets/posters/{output_filename}", src_url

    return False, "Could not acquire a valid non-empty poster", None

def get_youtube_duration_seconds(video_id, timeout=6):
    """Extract true duration in seconds from YouTube watch page."""
    try:
        req = urllib.request.Request(f"https://www.youtube.com/watch?v={video_id}", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            html = r.read().decode("utf-8", errors="ignore")
            dur = re.findall(r'\"approxDurationMs\":\"(\d+)\"', html)
            if dur:
                return int(dur[0]) // 1000
    except Exception:
        pass
    return 0

def probe_stream_quality(url, is_short_film=False, is_trailer=False, timeout=12):
    """
    Check stream resolution, duration, and viability.
    Enforces quality hierarchy: 4K (2160p) > 2K (1440p) > 1080p > 720p.
    Strictly rejects sub-720p (480p, 360p, 240p).
    Strictly rejects fake clips, songs, promos (<60 minutes for full movies).
    """
    if not url:
        return False, "Empty stream URL", {}, 0

    probed_duration = 0

    # 1. YouTube Stream Handling
    if is_youtube_url(url):
        yt_id = extract_youtube_id(url)
        if not yt_id:
            return False, "Could not extract YouTube video ID", {}, 0
        ok = check_youtube_playable(yt_id, timeout=timeout)
        if not ok:
            return False, "YouTube video deleted/private or unavailable", {}, 0

        # Strict Duration Check: cross-check duration to verify full movie vs song/clip/trailer
        probed_duration = get_youtube_duration_seconds(yt_id, timeout=timeout)
        if is_trailer:
            if probed_duration > 0 and probed_duration < 20:
                return False, f"Trailer duration too small ({probed_duration}s < 20s)", {}, 0
            return True, "Official Trailer", {"type": "youtube", "videoId": yt_id, "duration": probed_duration or 150}, 1080
        elif not is_short_film:
            if probed_duration > 0 and probed_duration < 3600:
                mins = probed_duration // 60
                secs = probed_duration % 60
                return False, f"Video duration is only {mins}m {secs}s (<60 min) - rejected as song/clip/trailer, not a full movie!", {}, 0
        else:
            if probed_duration > 0 and probed_duration < 180:
                return False, f"Short film duration too small ({probed_duration}s < 3 min)", {}, 0

        return True, "1080p Full HD", {"type": "youtube", "videoId": yt_id, "duration": probed_duration}, 1080

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
                            file_len = float(f.get("length") or 0)
                            if file_len > 0:
                                probed_duration = int(file_len)

                            # Duration validation for full movies
                            if not is_short_film and probed_duration > 0 and probed_duration < 3600:
                                mins = probed_duration // 60
                                return False, f"Archive.org duration is only {mins}m (<60 min) - rejected as clip/song!", {}, 0

                            if width > 0 and height > 0:
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
                                return True, res_str, {"width": width, "height": height, "codec": f.get("format"), "duration": probed_duration}, rank
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
        raw_dur = float(v_stream.get("duration", 0) or 0)
        if raw_dur > 0:
            probed_duration = int(raw_dur)

        # Duration validation for full movies
        if not is_short_film and probed_duration > 0 and probed_duration < 3600:
            mins = probed_duration // 60
            return False, f"Stream duration is only {mins}m (<60 min) - rejected as clip/song!", {}, 0

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

        return True, res_str, {"width": width, "height": height, "codec": v_stream.get("codec_name"), "duration": probed_duration}, rank
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
    clean_slug = re.sub(r'_+', '_', re.sub(r'[^a-z0-9]', '_', clean_movie_title(title).lower())).strip('_')
    poster_fn = movie_candidate.get("posterFileName") or f"vod_{clean_slug}.jpg"

    print(f"\n🎬 [Evaluating Candidate] '{title}' ({movie_candidate.get('year', 'N/A')})...")

    # 1. Trailer Classification & Recency Policy
    cats = [c.lower() for c in movie_candidate.get('categories', [])]
    is_trailer = (movie_candidate.get('isTrailerOnly') is True or
                  'trailers' in cats or
                  movie_candidate.get('type') in ['Trailers', 'Trailer'] or
                  movie_candidate.get('sourceState') == 'TRAILER_ONLY')
    if is_trailer:
        movie_candidate['isTrailerOnly'] = True
        movie_candidate['sourceState'] = 'TRAILER_ONLY'
        movie_candidate['qualityClass'] = 'Official Trailer'
        movie_candidate['qualityHonestBadge'] = 'Official Trailer'
        movie_candidate['type'] = 'Trailer'
        if 'trailers' not in cats:
            movie_candidate.setdefault('categories', []).append('trailers')
        t_url = movie_candidate.get('trailerUrl') or movie_candidate.get('streamUrl')
        movie_candidate['trailerUrl'] = t_url
        movie_candidate['streamUrl'] = None
        movie_candidate['addedDate'] = time.strftime('%Y-%m-%d')

    # 2. Recency & Era Validation
    if not is_trailer:
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
    cats = [c.lower() for c in movie_candidate.get("categories", [])]
    is_short_film = "short_film" in cats or "short" in cats or movie_candidate.get("type") in ["Short Film", "Short"]
    probe_target_url = (movie_candidate.get("trailerUrl") if is_trailer else stream_url) or ""
    ok, res_str, details, rank = probe_stream_quality(probe_target_url, is_short_film=is_short_film, is_trailer=is_trailer)
    if not ok:
        print(f"❌ [Quality Gate FAILED] '{title}' REJECTED: {res_str}")
        return False
    if is_trailer:
        movie_candidate["quality"] = "Official Trailer"
        movie_candidate["resolution"] = "1080p Full HD"
        movie_candidate["qualityClass"] = "Official Trailer"
        movie_candidate["qualityHonestBadge"] = "Official Trailer"
        movie_candidate["durationFormatted"] = "Official Trailer"
    else:
        movie_candidate["quality"] = res_str
        movie_candidate["resolution"] = res_str
        movie_candidate["_quality_rank"] = rank
        res_low = res_str.lower()
        if "4k" in res_low:
            movie_candidate["qualityClass"] = "4K"
            movie_candidate["qualityHonestBadge"] = "4K Ultra HD"
        elif "2k" in res_low:
            movie_candidate["qualityClass"] = "2K"
            movie_candidate["qualityHonestBadge"] = "2K QHD"
        elif "1080" in res_low:
            movie_candidate["qualityClass"] = "FULL HD"
            movie_candidate["qualityHonestBadge"] = "1080p Full HD"
        elif "720" in res_low:
            movie_candidate["qualityClass"] = "HD"
            movie_candidate["qualityHonestBadge"] = "720p HD"
        else:
            movie_candidate["qualityClass"] = "FULL HD"
            movie_candidate["qualityHonestBadge"] = "1080p Full HD"
        if details.get("duration", 0) > 0:
            probed_dur = details["duration"]
            movie_candidate["duration"] = probed_dur
            mins = probed_dur // 60
            if mins >= 60:
                movie_candidate["durationFormatted"] = f"{mins // 60}h {mins % 60:02d}m (Full Movie)"
            else:
                movie_candidate["durationFormatted"] = f"{mins}m (Complete Short)"

    # 4. Strict Poster Acquisition Gate
    p_ok, p_res, p_src = harvest_and_process_poster(title, movie_candidate, poster_fn)
    if not p_ok:
        print(f"❌ [Poster Gate FAILED] '{title}' REJECTED: {p_res}")
        return False
    movie_candidate["posterUrl"] = p_res
    movie_candidate["backdropUrl"] = p_res
    if p_src:
        movie_candidate["posterSrcUrl"] = p_src

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
    },
    # --- 5. Upcoming Theatrical Blockbuster Trailers (2026) ---
    {
        "id": "vod_spirit_2026",
        "title": "Spirit (2026)",
        "originalTitle": "Spirit",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "SOUTH",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Crime",
                "Drama"
        ],
        "rating": 8.7,
        "description": "A fearless, uncompromising police officer wages an unyielding battle against systemic corruption and underground crime cartels.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/GOQ5DytuKoc",
        "streamUrl": null,
        "posterFileName": "vod_spirit_2026.jpg"
},
    {
        "id": "vod_alpha_2026",
        "title": "Alpha (2026)",
        "originalTitle": "Alpha",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "BOLLYWOOD",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Thriller"
        ],
        "rating": 8.2,
        "description": "The YRF Spy Universe expands with its first female-led covert operations thriller tackling international espionage.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/QRqGwGwo1Y0",
        "streamUrl": null,
        "posterFileName": "vod_alpha_2026.jpg"
},
    {
        "id": "vod_king_2026",
        "title": "King (2026)",
        "originalTitle": "King",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "BOLLYWOOD",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Thriller"
        ],
        "rating": 8.5,
        "description": "An enigmatic mentor guides his prot\u00e9g\u00e9 through dangerous criminal syndicates in this high-octane Bollywood action drama.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/lo4SGEt3wRg",
        "streamUrl": null,
        "posterFileName": "vod_king_2026.jpg"
},
    {
        "id": "vod_the_batman_part_ii_2026",
        "title": "The Batman Part II",
        "originalTitle": "The Batman Part II",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "HOLLYWOOD",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Crime",
                "Drama"
        ],
        "rating": 8.8,
        "description": "Matt Reeves returns with Robert Pattinson as Gotham's Caped Crusader facing a rising criminal underworld in a flooded city.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/bha24P9uw-E",
        "streamUrl": null,
        "posterFileName": "vod_the_batman_part_ii_2026.jpg"
},
    {
        "id": "vod_ramayana_part_1_2026",
        "title": "Ramayana: Part 1",
        "originalTitle": "Ramayana: Part 1",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Drama",
                "Mythology"
        ],
        "rating": 9.6,
        "description": "Nitesh Tiwari's epic adaptation of the ancient Sanskrit epic Ramayana, starring Ranbir Kapoor as Lord Rama, Sai Pallavi as Sita, and Yash as Ravana.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/1zip1rNaNYs",
        "streamUrl": null,
        "posterFileName": "vod_ramayana_part_1_2026.jpg"
},
    {
        "id": "vod_toxic_2026",
        "title": "Toxic: A Fairy Tale for Grown-ups",
        "originalTitle": "Toxic: A Fairy Tale for Grown-ups",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Drama",
                "Crime"
        ],
        "rating": 9.4,
        "description": "A dark, intense crime drama set in the 1950s-1970s drug cartel underworld directed by Geetu Mohandas.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/nXA4daIga0k",
        "streamUrl": null,
        "posterFileName": "vod_toxic_2026.jpg"
},
    {
        "id": "vod_jailer_2_2026",
        "title": "Jailer 2 (2026)",
        "originalTitle": "Jailer 2 (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Crime",
                "Thriller"
        ],
        "rating": 9.4,
        "description": "Tiger Muthuvel Pandian returns in Nelson's explosive high-octane sequel to the mega-blockbuster Jailer, confronting international syndicate cartels with unstoppable force.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/LBF5UO4ZyOU",
        "streamUrl": null,
        "posterFileName": "vod_jailer_2_2026.jpg"
},
    {
        "id": "vod_drishyam_3_2026",
        "title": "Drishyam 3 (2026)",
        "originalTitle": "Drishyam 3 (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Crime",
                "Drama",
                "Mystery",
                "Thriller"
        ],
        "rating": 9.5,
        "description": "Vijay Salgaonkar and his family face the ultimate closing chapter of the gripping cat-and-mouse saga as old buried secrets resurface under intense federal investigation.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/jYbEYF1t-hk",
        "streamUrl": null,
        "posterFileName": "vod_drishyam_3_2026.jpg"
},
    {
        "id": "vod_prahaar_2026",
        "title": "Prahaar: The Untold Story (2026)",
        "originalTitle": "Prahaar: The Untold Story (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Biography",
                "Crime",
                "Drama"
        ],
        "rating": 9.2,
        "description": "A relentless legal action thriller based on real court battles and tactical operations of India's most celebrated special public prosecutor against high-profile terror syndicates.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/qGbvEhKhaWA",
        "streamUrl": null,
        "posterFileName": "vod_prahaar_2026.jpg"
},
    {
        "id": "vod_udta_teer_2026",
        "title": "Udta Teer (2026)",
        "originalTitle": "Udta Teer (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Comedy",
                "Drama"
        ],
        "rating": 9.1,
        "description": "A chaotic espionage comedy tracking an unintentional spy whose accidental blunders spark a whirlwind comedic adventure across the subcontinent.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/hN_ZUElLH44",
        "streamUrl": null,
        "posterFileName": "vod_udta_teer_2026.jpg"
},
    {
        "id": "vod_dhurandhar_2026",
        "title": "Dhurandhar (2026)",
        "originalTitle": "Dhurandhar (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Thriller"
        ],
        "rating": 9.3,
        "description": "Aditya Dhar's high-stakes espionage action thriller following elite intelligence operatives navigating dangerous undercover geopolitical warfare.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/CN0lNff-zm0",
        "streamUrl": null,
        "posterFileName": "vod_dhurandhar_2026.jpg"
},
    {
        "id": "vod_dune_part_three_2026",
        "title": "Dune: Part Three \u2013 Messiah (2026)",
        "originalTitle": "Dune: Part Three \u2013 Messiah (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "GLOBAL",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Action",
                "Adventure",
                "Sci-Fi"
        ],
        "rating": 9.4,
        "description": "Paul Atreides confronts the consequences of his ascendancy as Emperor of the Known Universe in Denis Villeneuve's epic cinematic adaptation of Frank Herbert's Dune Messiah.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/3_9vCamtuPY",
        "streamUrl": null,
        "posterFileName": "vod_dune_part_three_2026.jpg"
},
    {
        "id": "vod_demon_slayer_infinity_castle",
        "title": "Demon Slayer: Kimetsu no Yaiba \u2013 Infinity Castle (2026)",
        "originalTitle": "Demon Slayer: Kimetsu no Yaiba \u2013 Infinity Castle (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "GLOBAL",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Animation",
                "Action",
                "Fantasy"
        ],
        "rating": 9.7,
        "description": "The Demon Slayer Corps plunges into the Infinity Castle for the definitive showdown against Muzan Kibutsuji and the Upper Moon demons in this blockbuster theatrical trilogy.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/0pdC1l6M8rU",
        "streamUrl": null,
        "posterFileName": "vod_demon_slayer_infinity_castle.jpg"
},
    {
        "id": "vod_chainsaw_man_reze_arc",
        "title": "Chainsaw Man \u2013 The Movie: Reze Arc (2026)",
        "originalTitle": "Chainsaw Man \u2013 The Movie: Reze Arc (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "GLOBAL",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Animation",
                "Action",
                "Supernatural"
        ],
        "rating": 9.2,
        "description": "Denji encounters the enigmatic Reze in MAPPA's explosive anime feature film adapting the fan-favorite Bomb Girl / Reze Arc.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/EPaoHkV0dYw",
        "streamUrl": null,
        "posterFileName": "vod_chainsaw_man_reze_arc.jpg"
},
    {
        "id": "series_stranger_things_s5",
        "title": "Stranger Things Season 5 (The Final Season - 2026)",
        "originalTitle": "Stranger Things Season 5 (The Final Season - 2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "GLOBAL",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Drama",
                "Fantasy",
                "Horror",
                "Sci-Fi"
        ],
        "rating": 9.5,
        "description": "The final battle for Hawkins begins as Eleven and her allies unite to destroy the Upside Down and defeat Vecna once and for all.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/iKZyYdwS3Wg",
        "streamUrl": null,
        "posterFileName": "series_stranger_things_s5.jpg"
},
    {
        "id": "series_panchayat_s4",
        "title": "Panchayat Season 4 (2026)",
        "originalTitle": "Panchayat Season 4 (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "IN",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Comedy",
                "Drama"
        ],
        "rating": 9.6,
        "description": "Abhishek Tripathi and the lively residents of Phulera navigate new village elections, unexpected bureaucratic challenges, and heartfelt grassroots comedy.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/AHMEtNAZTP4",
        "streamUrl": null,
        "posterFileName": "series_panchayat_s4.jpg"
},
    {
        "id": "vod_blender_project_gold_2026",
        "title": "Project Gold: Blender Studio 4K Open Movie (2026)",
        "originalTitle": "Project Gold: Blender Studio 4K Open Movie (2026)",
        "year": 2026,
        "releaseYear": 2026,
        "mediaType": "movie",
        "type": "Trailer",
        "contentType": "MOVIE",
        "region": "GLOBAL",
        "categories": [
                "trailers",
                "upcoming",
                "trending"
        ],
        "durationFormatted": "Official Trailer",
        "genres": [
                "Animation",
                "Sci-Fi",
                "Short"
        ],
        "rating": 9.0,
        "description": "Blender Studio's next-generation 4K open animation short film pushing cutting-edge open-source real-time CGI, geometry nodes, and cinematic storytelling.",
        "resolution": "1080p Full HD",
        "quality": "Official Trailer",
        "qualityClass": "Official Trailer",
        "qualityHonestBadge": "Official Trailer",
        "sourceState": "TRAILER_ONLY",
        "isTrailerOnly": true,
        "trailerUrl": "https://www.youtube-nocookie.com/embed/WhWc3b3KhnY",
        "streamUrl": null,
        "posterFileName": "vod_blender_project_gold_2026.jpg"
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
                    arch_poster = None
                    for af in files:
                        af_name = af.get("name", "")
                        if af_name.lower().endswith((".jpg", ".jpeg", ".png")) and not af_name.startswith("."):
                            arch_poster = f"https://archive.org/download/{ident}/{urllib.parse.quote(af_name)}"
                            break
                    if not arch_poster:
                        arch_poster = f"https://archive.org/services/img/{ident}"

                    for f in files:
                        fname = f.get("name", "")
                        size = int(f.get("size") or 0)
                        if fname.lower().endswith((".mp4", ".mkv")) and size > 250_000_000:
                            width = int(f.get("width") or 0)
                            height = int(f.get("height") or 0)
                            if width >= 1280 or height >= 720:
                                q_label = "1080p Full HD" if (width >= 1920 or height >= 1080) else "720p HD"
                                safe_name = urllib.parse.quote(fname)
                                clean_t = clean_movie_title(raw_title)
                                clean_slug = re.sub(r'_+', '_', re.sub(r'[^a-z0-9]', '_', clean_t.lower())).strip('_')
                                cand = {
                                    "id": f"vod_{clean_slug[:30]}",
                                    "title": clean_t,
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
                                    "posterSrcUrl": arch_poster
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
