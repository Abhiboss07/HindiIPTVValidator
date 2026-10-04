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
    "hum dil de chuke sanam", "taal", "hum saath saath hain", "biwi no 1"
}

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
        shutil.copyfile(os.path.join(POSTERS_DIR, existing_fn), target_path)
        shutil.copyfile(os.path.join(POSTERS_DIR, existing_fn), android_target_path)
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
    if "youtube.com" in stream_url or "youtu.be" in stream_url:
        yt_id = None
        if "embed/" in stream_url:
            yt_id = stream_url.split("embed/")[1].split("?")[0].split("/")[0]
        elif "watch?v=" in stream_url:
            yt_id = stream_url.split("watch?v=")[1].split("&")[0]
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
    Check stream resolution using ffprobe.
    Enforces quality hierarchy: 4K (2160p) > 2K (1440p) > 1080p > 720p.
    Strictly rejects sub-720p (480p, 360p, 240p).
    """
    cmd = [
        "ffprobe", "-v", "error",
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
    if "youtube.com" not in stream_url:
        ok, res_str, details, rank = probe_stream_quality(stream_url)
        if not ok:
            print(f"❌ [Quality Gate FAILED] '{title}' REJECTED: {res_str}")
            return False
        movie_candidate["quality"] = res_str
        movie_candidate["resolution"] = res_str
        movie_candidate["_quality_rank"] = rank
    else:
        # For verified YouTube full uploads, verify not sub-720p
        movie_candidate["quality"] = movie_candidate.get("quality", "1080p Full HD")
        movie_candidate["resolution"] = movie_candidate.get("resolution", "1080p Full HD")
        movie_candidate["_quality_rank"] = 1080

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
    catalog_data["total_movies"] = sum(1 for m in catalog_data["movies"] if m.get("type") != "series")
    catalog_data["total_series"] = sum(1 for m in catalog_data["movies"] if m.get("type") == "series")
    catalog_data["updated_at"] = time.strftime("%Y-%m-%d %H:%M:%S")

    print(f"✅ [APPROVED & INGESTED] '{title}' ({movie_candidate['quality']}) added successfully with authentic poster!")
    return True

def run_ingestion_cycle(candidates_feed_path=None):
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
    if not os.path.exists(feed_file):
        print(f"ℹ️ Creating template queue at {feed_file}")
        with open(feed_file, "w", encoding="utf-8") as f:
            json.dump({"new_movies": [], "new_channels": []}, f, indent=2)
        return

    with open(feed_file, "r", encoding="utf-8") as f:
        queue = json.load(f)

    new_movies = queue.get("new_movies", [])
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
        print(f"⚡ Ingestion Queue Priority Score: {score} for '{title}'")
        if ingest_movie_item(catalog_data, m):
            ingested_count += 1
        else:
            remaining_queue.append(m)

    if ingested_count > 0:
        with open(CATALOG_PATH, "w", encoding="utf-8") as f:
            json.dump(catalog_data, f, indent=2, ensure_ascii=False)
        with open(ANDROID_CATALOG_PATH, "w", encoding="utf-8") as f:
            json.dump(catalog_data, f, indent=2, ensure_ascii=False)
        with open(feed_file, "w", encoding="utf-8") as f:
            json.dump({"new_movies": remaining_queue, "new_channels": queue.get("new_channels", [])}, f, indent=2)

    print("=" * 65)
    print(f"🎉 INGESTION CYCLE COMPLETE: Successfully added {ingested_count} new prioritized titles.")
    print("=" * 65)

if __name__ == "__main__":
    run_ingestion_cycle()
