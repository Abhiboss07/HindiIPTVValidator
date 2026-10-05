#!/usr/bin/env python3
"""
Dead Stream Purger & Self-Healing Pipeline for T2L
--------------------------------------------------
Continuously verifies:
1. Every movie in data/movies_catalog.json
2. Every episode in every season of all web series & anime
3. Every Live TV channel in data/channels.json

If any stream source is dead (404, 410, 403, 500, DNS failure, timeout,
broken HLS manifest, or unavailable YouTube embed), this pipeline:
- Purges dead movies and broken episodes from catalog
- Purges dead Live TV channels from channels.json
- Synchronizes changes to android_app/src/main/assets/data/
- Generates a forensic audit log of all removed items
"""

import os
import sys
import json
import time
import shutil
import urllib.request
import urllib.error
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(PROJECT_ROOT, "data", "movies_catalog.json")
CHANNELS_PATH = os.path.join(PROJECT_ROOT, "data", "channels.json")
ANDROID_CATALOG_PATH = os.path.join(PROJECT_ROOT, "android_app", "src", "main", "assets", "data", "movies_catalog.json")
ANDROID_CHANNELS_PATH = os.path.join(PROJECT_ROOT, "android_app", "src", "main", "assets", "data", "channels.json")
REPORT_PATH = os.path.join(PROJECT_ROOT, "automation", "reports", "latest_purge_report.json")

os.makedirs(os.path.join(PROJECT_ROOT, "automation", "reports"), exist_ok=True)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)

USER_AGENT = "Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5"

def check_youtube_video(video_id, timeout=8):
    """Verify if a YouTube video is playable and not deleted/private."""
    try:
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        req = urllib.request.Request(oembed_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status == 200
    except urllib.error.HTTPError as e:
        if e.code in (401, 403, 404):
            return False
        # Server rate limit or temporary 429/500: do not aggressively purge
        return True
    except Exception:
        # Network glitch: don't aggressively drop on network timeout
        return True

def probe_http_stream(url, is_hls=False, timeout=5):
    """
    Probe HTTP/HTTPS media stream.
    Supports range requests for progressive MP4s and manifest checks for HLS.
    """
    if not url or not url.startswith(("http://", "https://")):
        return False, "Invalid URL schema"

    # YouTube embed handling (supports youtube-nocookie.com, youtube.com, youtu.be)
    if "youtube" in url or "youtu.be" in url:
        v_id = None
        if "embed/" in url:
            v_id = url.split("embed/")[1].split("?")[0].split("/")[0]
        elif "watch?v=" in url:
            v_id = url.split("watch?v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            v_id = url.split("youtu.be/")[1].split("?")[0].split("/")[0]
        if v_id:
            ok = check_youtube_video(v_id, timeout=timeout)
            return ok, "YouTube embed check" if ok else "YouTube video deleted/private"

    try:
        headers = {
            "User-Agent": USER_AGENT,
            "Accept": "*/*"
        }
        if not is_hls and not url.endswith(".m3u8"):
            headers["Range"] = "bytes=0-1024"

        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            code = resp.status
            if is_hls or url.endswith(".m3u8"):
                sample = resp.read(256).decode("utf-8", errors="ignore")
                if "#EXTM3U" in sample:
                    return True, f"HTTP {code} valid HLS"
                return False, f"HTTP {code} invalid HLS manifest"
            else:
                if code in (200, 206):
                    return True, f"HTTP {code} OK"
                return False, f"HTTP {code} unexpected status"
    except urllib.error.HTTPError as e:
        if e.code in (404, 410):
            return False, f"HTTP {e.code} Not Found/Gone"
        if e.code == 403:
            return False, "HTTP 403 Forbidden"
        if e.code in (500, 502, 503, 504):
            return False, f"HTTP {e.code} Server Offline"
        return False, f"HTTP {e.code}"
    except urllib.error.URLError as e:
        if "archive.org/download/" in url:
            parts = url.split("archive.org/download/")[1].split("/")
            if parts:
                ident = parts[0]
                meta_url = f"https://archive.org/metadata/{ident}"
                try:
                    mreq = urllib.request.Request(meta_url, headers={"User-Agent": USER_AGENT})
                    with urllib.request.urlopen(mreq, timeout=6) as mresp:
                        if mresp.status == 200:
                            return True, "Archive.org item exists (retained despite CDN timeout)"
                except Exception:
                    pass
        return False, f"URLError: {str(e.reason)}"
    except Exception as e:
        if "archive.org/download/" in url:
            parts = url.split("archive.org/download/")[1].split("/")
            if parts:
                ident = parts[0]
                meta_url = f"https://archive.org/metadata/{ident}"
                try:
                    mreq = urllib.request.Request(meta_url, headers={"User-Agent": USER_AGENT})
                    with urllib.request.urlopen(mreq, timeout=6) as mresp:
                        if mresp.status == 200:
                            return True, "Archive.org item exists (retained despite CDN timeout)"
                except Exception:
                    pass
        return False, f"Exception: {str(e)}"

def audit_and_purge_movies(catalog_data, max_workers=20):
    """Scan and purge dead movies and episodes from catalog."""
    movies = catalog_data.get("movies", [])
    purged_items = []
    retained_movies = []

    print(f"🔍 [Catalog Audit] Probing {len(movies)} media titles...")

    # Build probe tasks
    tasks = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for item in movies:
            is_series = (item.get("mediaType") == "series" or
                         item.get("contentType") == "SERIES" or
                         "seasons" in item)
            title = item.get("title", "Untitled")

            if not is_series:
                # Strict Quality Gate: reject sub-720p immediately
                q = str(item.get("quality", "")).lower()
                res = str(item.get("resolution", "")).lower()
                url = str(item.get("streamUrl", ""))
                if any(bad in q or bad in res or bad in url.lower() for bad in ["240p", "360p", "480p", "576p"]):
                    print(f"❌ [PURGE SUB-720P] '{title}' ({q}) -> Below 720p minimum threshold")
                    purged_items.append({"id": item.get("id"), "title": title, "type": "movie", "reason": "Strict Quality Gate: Sub-720p rejected"})
                    continue

                # Trailer Lifecycle Gate: Purge trailers older than 2-3 months or pre-September 2026
                cats = [c.lower() for c in item.get("categories", [])]
                is_trailer = item.get("isTrailerOnly") or "trailers" in cats or item.get("type") == "Trailers"
                if is_trailer:
                    rel_date = item.get("trailerReleaseDate") or item.get("releaseDate") or item.get("addedDate") or "2026-08-01"
                    if str(rel_date) < "2026-09-01":
                        print(f"❌ [PURGE OUTDATED TRAILER] '{title}' -> Released before September 2026 ({rel_date})")
                        purged_items.append({"id": item.get("id"), "title": title, "type": "movie", "reason": f"Trailer Lifecycle: Released before Sep 2026 ({rel_date})"})
                        continue

                fut = executor.submit(probe_http_stream, url, is_hls=False)
                tasks.append((item, "movie", None, None, fut))
            else:
                seasons = item.get("seasons", [])
                ep_count = sum(len(s.get("episodes", [])) for s in seasons)
                if ep_count == 0:
                    purged_items.append({"title": title, "reason": "Empty series with 0 episodes"})
                    continue
                # Reject series if marked sub-720p
                q = str(item.get("quality", "")).lower()
                res = str(item.get("resolution", "")).lower()
                if any(bad in q or bad in res for bad in ["240p", "360p", "480p", "576p"]):
                    print(f"❌ [PURGE SUB-720P SERIES] '{title}' ({q}) -> Below 720p minimum threshold")
                    purged_items.append({"id": item.get("id"), "title": title, "type": "series", "reason": "Strict Quality Gate: Sub-720p rejected"})
                    continue
                for s_idx, season in enumerate(seasons):
                    for e_idx, ep in enumerate(season.get("episodes", [])):
                        url = ep.get("streamUrl", "")
                        if any(bad in url.lower() for bad in ["240p", "360p", "480p", "576p"]):
                            print(f"❌ [PURGE SUB-720P EPISODE] '{title}' Ep {e_idx+1} -> Sub-720p rejected")
                            continue
                        fut = executor.submit(probe_http_stream, url, is_hls=False)
                        tasks.append((item, "series", s_idx, e_idx, fut))

        # Collect results
        series_failed_eps = {}
        for item, itype, s_idx, e_idx, fut in tasks:
            title = item.get("title")
            ok, reason = fut.result()
            if itype == "movie":
                if ok:
                    retained_movies.append(item)
                else:
                    print(f"❌ [PURGE MOVIE] '{title}' ({item.get('quality', 'HD')}) -> {reason}")
                    purged_items.append({
                        "id": item.get("id"),
                        "title": title,
                        "type": "movie",
                        "streamUrl": item.get("streamUrl"),
                        "reason": reason
                    })
            elif itype == "series":
                item_id = item.get("id")
                if item_id not in series_failed_eps:
                    series_failed_eps[item_id] = {"item": item, "bad_eps": set()}
                if not ok:
                    ep_title = item["seasons"][s_idx]["episodes"][e_idx].get("title", f"S{s_idx+1}E{e_idx+1}")
                    print(f"⚠️ [BAD EPISODE] '{title}' -> {ep_title}: {reason}")
                    series_failed_eps[item_id]["bad_eps"].add((s_idx, e_idx, reason))

    # Clean up series episodes and filter out dead series
    for item_id, data in series_failed_eps.items():
        series = data["item"]
        bad_eps = data["bad_eps"]
        title = series.get("title")

        if bad_eps:
            cleaned_seasons = []
            for s_idx, season in enumerate(series.get("seasons", [])):
                cleaned_episodes = []
                for e_idx, ep in enumerate(season.get("episodes", [])):
                    if (s_idx, e_idx) not in [(b[0], b[1]) for b in bad_eps]:
                        cleaned_episodes.append(ep)
                if cleaned_episodes:
                    season_copy = dict(season)
                    season_copy["episodes"] = cleaned_episodes
                    cleaned_seasons.append(season_copy)

            if cleaned_seasons:
                series["seasons"] = cleaned_seasons
                retained_movies.append(series)
                print(f"🔧 [REPAIRED SERIES] '{title}': Retained with remaining healthy episodes.")
            else:
                print(f"❌ [PURGE SERIES] '{title}': All episodes dead. Purging entire series.")
                purged_items.append({
                    "id": item_id,
                    "title": title,
                    "type": "series",
                    "reason": "All episodes unreachable"
                })
        else:
            retained_movies.append(series)

    catalog_data["movies"] = retained_movies
    catalog_data["total_movies"] = sum(1 for m in retained_movies if m.get("mediaType") != "series")
    catalog_data["total_series"] = sum(1 for m in retained_movies if m.get("mediaType") == "series")
    catalog_data["updated_at"] = time.strftime("%Y-%m-%d %H:%M:%S")

    return catalog_data, purged_items

def audit_and_purge_channels(channels_data, max_workers=30):
    """Scan and purge dead Live TV channels."""
    channels = channels_data if isinstance(channels_data, list) else channels_data.get("channels", [])
    print(f"📺 [Live TV Audit] Probing {len(channels)} channels...")

    purged_channels = []
    healthy_channels = []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        fut_to_ch = {
            executor.submit(probe_http_stream, ch.get("url", ""), is_hls=True): ch
            for ch in channels
        }
        for fut in as_completed(fut_to_ch):
            ch = fut_to_ch[fut]
            name = ch.get("name", "Unknown")
            ok, reason = fut.result()
            if ok:
                healthy_channels.append(ch)
            else:
                print(f"❌ [PURGE CHANNEL] '{name}' ({ch.get('category', 'TV')}) -> {reason}")
                purged_channels.append({
                    "id": ch.get("id"),
                    "name": name,
                    "url": ch.get("url"),
                    "category": ch.get("category"),
                    "reason": reason
                })

    if isinstance(channels_data, list):
        updated_channels = healthy_channels
    else:
        channels_data["channels"] = healthy_channels
        updated_channels = channels_data

    return updated_channels, purged_channels

def run_purge_pipeline():
    """Main execution entry point."""
    print("=" * 60)
    print("🚀 STARTING AUTOMATION 2: DEAD STREAM HEALTH AUDIT & PURGE")
    print("=" * 60)

    # 1. Audit Movies & Series
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)

    updated_catalog, purged_movies = audit_and_purge_movies(catalog_data)

    # 2. Audit Channels
    with open(CHANNELS_PATH, "r", encoding="utf-8") as f:
        channels_data = json.load(f)

    updated_channels, purged_channels = audit_and_purge_channels(channels_data)

    # 3. Save updated catalogs
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(updated_catalog, f, indent=2, ensure_ascii=False)
    with open(ANDROID_CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(updated_catalog, f, indent=2, ensure_ascii=False)

    with open(CHANNELS_PATH, "w", encoding="utf-8") as f:
        json.dump(updated_channels, f, indent=2, ensure_ascii=False)
    with open(ANDROID_CHANNELS_PATH, "w", encoding="utf-8") as f:
        json.dump(updated_channels, f, indent=2, ensure_ascii=False)

    # 4. Generate forensic report
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_movies_retained": len(updated_catalog["movies"]),
        "total_channels_retained": len(updated_channels if isinstance(updated_channels, list) else updated_channels["channels"]),
        "purged_movies_count": len(purged_movies),
        "purged_channels_count": len(purged_channels),
        "purged_movies": purged_movies,
        "purged_channels": purged_channels
    }
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print("=" * 60)
    print(f"✅ PURGE AUDIT COMPLETE!")
    print(f"• Movies Retained: {report['total_movies_retained']} (Purged: {len(purged_movies)})")
    print(f"• Channels Retained: {report['total_channels_retained']} (Purged: {len(purged_channels)})")
    print(f"• Report saved to: {REPORT_PATH}")
    print("=" * 60)

    return report

if __name__ == "__main__":
    run_purge_pipeline()
