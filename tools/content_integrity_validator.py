#!/usr/bin/env python3
"""
T2L Content Integrity & Pipeline Validator.
Enforces:
1. Strict Content-Type vs Transport-Source separation (Movies never route to Broadcast/Live/Radio).
2. Honest Audio & Hindi Language Classification (actual audio stream inspection).
3. Series Sequential Continuity (Seasons 1..N and Episodes 1..N).
4. Identity verification (No podcasts, reviews, promos masquerading as movies).
"""

import os
import sys
import json
import re
import argparse
import subprocess
import urllib.parse
from dataclasses import dataclass, asdict, field
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
REPORTS_DIR = os.path.join(WORKSPACE, "reports")


@dataclass
class AudioTrackInfo:
    index: int
    codec: str
    channels: int
    language: str
    title: str = ""


@dataclass
class ContentIntegrityItem:
    id: str
    title: str
    content_type: str  # MOVIE, SERIES, EPISODE, TRAILER
    claimed_languages: List[str]
    audio_classification: str  # HINDI_AUDIO, MULTI_AUDIO_INCLUDING_HINDI, NON_HINDI_AUDIO, HINDI_SUBTITLE_ONLY, LANGUAGE_UNKNOWN
    detected_languages: List[str]
    detected_audio_tracks: List[Dict[str, Any]]
    source_url: Optional[str]
    source_type: str  # DIRECT_STREAM, HLS, TORRENT, YOUTUBE_EMBED, NO_SOURCE
    pipeline_mode: str  # VOD_MOVIE, VOD_SERIES, LIVE_BROADCAST, RADIO
    status: str  # PASS, FAIL, WARNING
    failure_reasons: List[str] = field(default_factory=list)


def probe_media_audio(url: str, timeout_s: int = 6) -> (List[AudioTrackInfo], float, Dict[str, Any]):
    """Probes audio streams and duration of a media file via ffprobe."""
    if not url or "youtube" in url:
        return [], 0.0, {}
    
    cmd = [
        "ffprobe", "-v", "error",
        "-analyzeduration", "2000000",
        "-probesize", "2000000",
        "-show_entries", "stream=index,codec_type,codec_name,channels,sample_rate:stream_tags=language,title:format=duration,tags",
        "-of", "json",
        url
    ]
    try:
        res = subprocess.check_output(cmd, stderr=subprocess.STDOUT, timeout=timeout_s)
        data = json.loads(res.decode("utf-8", errors="ignore"))
        streams = data.get("streams", [])
        duration = float(data.get("format", {}).get("duration", 0.0) or 0.0)
        format_tags = data.get("format", {}).get("tags", {})
        
        audio_tracks = []
        for s in streams:
            if s.get("codec_type") == "audio":
                tags = s.get("tags", {})
                lang = tags.get("language", "und").lower().strip()
                title = tags.get("title", "").strip()
                audio_tracks.append(AudioTrackInfo(
                    index=int(s.get("index", 0)),
                    codec=s.get("codec_name", "unknown"),
                    channels=int(s.get("channels", 2) or 2),
                    language=lang,
                    title=title
                ))
        return audio_tracks, duration, format_tags
    except Exception:
        return [], 0.0, {}


def classify_audio_integrity(
    catalog_title: str,
    catalog_langs: List[str],
    audio_tracks: List[AudioTrackInfo],
    format_tags: Dict[str, Any]
) -> (str, List[str], List[str]):
    """
    Returns:
      audio_classification, detected_langs, discrepancies
    """
    discrepancies = []
    detected_langs = []

    # Check for known language tokens in format title / track tags
    full_text = " ".join([
        t.title for t in audio_tracks
    ] + [str(v) for v in format_tags.values()]).lower()

    for t in audio_tracks:
        lang = t.language
        if lang in ("hin", "hindi"):
            detected_langs.append("Hindi")
        elif lang in ("eng", "en", "english"):
            detected_langs.append("English")
        elif lang in ("tel", "te", "telugu"):
            detected_langs.append("Telugu")
        elif lang in ("tam", "ta", "tamil"):
            detected_langs.append("Tamil")
        elif lang in ("kan", "kn", "kannada"):
            detected_langs.append("Kannada")
        elif lang in ("mal", "ml", "malayalam"):
            detected_langs.append("Malayalam")
        elif lang in ("ben", "bn", "bengali"):
            detected_langs.append("Bengali")
        elif lang in ("mar", "mr", "marathi"):
            detected_langs.append("Marathi")
        elif lang in ("kor", "ko", "korean"):
            detected_langs.append("Korean")
        elif lang in ("jpn", "ja", "japanese"):
            detected_langs.append("Japanese")
        elif lang in ("spa", "es", "spanish"):
            detected_langs.append("Spanish")
        elif lang in ("fre", "fra", "fr", "french"):
            detected_langs.append("French")
        elif lang in ("ger", "deu", "de", "german"):
            detected_langs.append("German")
        elif lang in ("ita", "it", "italian"):
            detected_langs.append("Italian")

    detected_langs = list(dict.fromkeys(detected_langs))

    # If stream language tags were 'und', inspect format tags for clues
    if not detected_langs:
        if "dual audio" in full_text or "hindi-english" in full_text or "hindi & english" in full_text:
            detected_langs = ["Hindi", "English"]
        elif "hindi" in full_text:
            detected_langs = ["Hindi"]
        elif "english" in full_text:
            detected_langs = ["English"]

    # Determine classification
    has_hindi_audio = "Hindi" in detected_langs
    has_multi = len(detected_langs) > 1

    if has_hindi_audio and has_multi:
        classification = "MULTI_AUDIO_INCLUDING_HINDI"
    elif has_hindi_audio and not has_multi:
        classification = "HINDI_AUDIO"
    elif detected_langs and not has_hindi_audio:
        classification = "NON_HINDI_AUDIO"
    else:
        classification = "LANGUAGE_UNKNOWN"

    # Check for Mismatch against Catalog Claims
    cat_langs_norm = [l.strip().title() for l in catalog_langs]
    if "Hindi" in cat_langs_norm and classification == "NON_HINDI_AUDIO":
        discrepancies.append(
            f"LANGUAGE_METADATA_MISMATCH: Catalog claims Hindi audio, but media stream only contains {', '.join(detected_langs)}."
        )

    return classification, detected_langs, discrepancies


class ContentIntegrityValidator:
    def __init__(self, catalog_path: str = CATALOG_PATH):
        self.catalog_path = catalog_path
        with open(catalog_path, "r", encoding="utf-8") as f:
            self.catalog = json.load(f)

    def validate_all(self, probe_streams: bool = True, max_workers: int = 6) -> Dict[str, Any]:
        movies = self.catalog.get("movies", [])
        reports: List[ContentIntegrityItem] = []
        pipeline_errors: List[Dict[str, Any]] = []

        standalone_movies = [m for m in movies if m.get("mediaType") != "series" and "seasons" not in m]
        series_items = [m for m in movies if m.get("mediaType") == "series" or "seasons" in m]

        print(f"Auditing {len(standalone_movies)} Movies and {len(series_items)} Web-Series...")

        # 1. Standalone Movies Validation
        def check_movie(m: Dict[str, Any]) -> ContentIntegrityItem:
            mid = m.get("id")
            title = m.get("title")
            ctype = m.get("contentType", "MOVIE").upper()
            url = m.get("streamUrl")
            trailer_url = m.get("trailerUrl")
            cat_langs = m.get("languages", [])

            stype = "NO_SOURCE"
            if url:
                stype = "HLS" if ".m3u8" in url else "DIRECT_STREAM"
            elif m.get("torrentUri"):
                stype = "TORRENT"
            elif trailer_url:
                stype = "YOUTUBE_EMBED" if "youtube" in trailer_url else "DIRECT_STREAM"

            pipeline_mode = "VOD_MOVIE"
            reasons = []

            # 1.1 Forbidden token check (Gladiator / broadcast bug detector)
            url_str = (url or "") + " " + (trailer_url or "")
            forbidden_tokens = ["cordkillers", "podcast", "review", "reaction", "interview", "gameplay", "parody"]
            for token in forbidden_tokens:
                if token in url_str.lower() or token in title.lower():
                    reasons.append(f"PIPELINE_ERROR: Media source is a {token.upper()} / talk-show, not a cinema movie.")
                    pipeline_errors.append({
                        "id": mid,
                        "title": title,
                        "error": f"Movie routed to {token.upper()} source ({url})"
                    })

            # 1.2 Pipeline Type Check
            if ctype != "MOVIE":
                reasons.append(f"CONTENT_TYPE_MISMATCH: Expected MOVIE, found {ctype}")
                pipeline_errors.append({"id": mid, "title": title, "error": f"Invalid content type {ctype}"})

            # 1.3 Audio & Duration Probe
            audio_tracks = []
            duration = 0.0
            format_tags = {}
            if probe_streams and url and not "youtube" in url:
                audio_tracks, duration, format_tags = probe_media_audio(url)

                # Duration check: Full movies must be >= 40 minutes (2400s), unless explicitly classified as a Short film
                if duration > 0 and duration < 2400 and "Short" not in m.get("genres", []):
                    reasons.append(f"TRAILER_OR_CLIP_MASQUERADING_AS_MOVIE: Duration is only {int(duration)}s (< 40 min).")

            # 1.4 Audio Classification & Language Verification
            audio_class = m.get("audioClassification")
            if audio_tracks or format_tags:
                probed_class, detected_langs, lang_errs = classify_audio_integrity(
                    title, cat_langs, audio_tracks, format_tags
                )
                if not audio_class:
                    audio_class = probed_class
                reasons.extend(lang_errs)
            else:
                detected_langs = []
                if not audio_class:
                    audio_class = "HINDI_AUDIO" if ("Hindi" in cat_langs and len(cat_langs) == 1) else ("MULTI_AUDIO_INCLUDING_HINDI" if "Hindi" in cat_langs else "NON_HINDI_AUDIO")

            status = "FAIL" if any("MISMATCH" in r or "ERROR" in r or "MASQUERADING" in r for r in reasons) else ("WARNING" if reasons else "PASS")

            return ContentIntegrityItem(
                id=mid,
                title=title,
                content_type=ctype,
                claimed_languages=cat_langs,
                audio_classification=audio_class,
                detected_languages=detected_langs,
                detected_audio_tracks=[asdict(t) for t in audio_tracks],
                source_url=url,
                source_type=stype,
                pipeline_mode=pipeline_mode,
                status=status,
                failure_reasons=reasons
            )

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(check_movie, m): m for m in standalone_movies}
            for f in as_completed(futures):
                reports.append(f.result())

        # 2. Web-Series Continuity & Pipeline Validation
        series_ordering_errors = []
        for s in series_items:
            sid = s.get("id")
            stitle = s.get("title")
            seasons = s.get("seasons", [])
            s_langs = s.get("languages", [])

            expected_s = 1
            for season in seasons:
                s_num = int(season.get("seasonNumber", 0))
                if s_num != expected_s:
                    series_ordering_errors.append(f"{stitle} ({sid}): Season {s_num} out of order (expected {expected_s})")
                expected_s += 1

                eps = season.get("episodes", [])
                expected_e = 1
                for ep in eps:
                    e_num = int(ep.get("episodeNumber", 0))
                    if e_num != expected_e:
                        series_ordering_errors.append(f"{stitle} S{s_num}E{e_num}: Episode out of order (expected {expected_e})")
                    expected_e += 1

        # Summary Metrics
        total_movies = len(standalone_movies)
        passed_movies = sum(1 for r in reports if r.status == "PASS")
        failed_movies = sum(1 for r in reports if r.status == "FAIL")
        warn_movies = sum(1 for r in reports if r.status == "WARNING")

        hindi_audio_count = sum(1 for r in reports if r.audio_classification == "HINDI_AUDIO")
        multi_audio_count = sum(1 for r in reports if r.audio_classification == "MULTI_AUDIO_INCLUDING_HINDI")
        non_hindi_count = sum(1 for r in reports if r.audio_classification == "NON_HINDI_AUDIO")
        hindi_sub_count = sum(1 for r in reports if r.audio_classification == "HINDI_SUBTITLE_ONLY")
        unknown_lang_count = sum(1 for r in reports if r.audio_classification == "LANGUAGE_UNKNOWN")

        summary = {
            "total_movies": total_movies,
            "movies_passed": passed_movies,
            "movies_failed": failed_movies,
            "movies_warning": warn_movies,
            "total_series": len(series_items),
            "series_ordering_errors": len(series_ordering_errors),
            "pipeline_errors": len(pipeline_errors),
            "audio_classifications": {
                "HINDI_AUDIO": hindi_audio_count,
                "MULTI_AUDIO_INCLUDING_HINDI": multi_audio_count,
                "NON_HINDI_AUDIO": non_hindi_count,
                "HINDI_SUBTITLE_ONLY": hindi_sub_count,
                "LANGUAGE_UNKNOWN": unknown_lang_count
            }
        }

        # Generate Reports
        os.makedirs(REPORTS_DIR, exist_ok=True)
        report_json_path = os.path.join(REPORTS_DIR, "content_integrity_report.json")
        report_md_path = os.path.join(REPORTS_DIR, "content_integrity_report.md")

        full_output = {
            "summary": summary,
            "pipeline_errors": pipeline_errors,
            "series_ordering_errors": series_ordering_errors,
            "items": [asdict(r) for r in reports]
        }

        with open(report_json_path, "w", encoding="utf-8") as f:
            json.dump(full_output, f, indent=2)

        with open(report_md_path, "w", encoding="utf-8") as f:
            f.write("# T2L Content Integrity & Pipeline Report\n\n")
            f.write("## Summary Metrics\n")
            f.write(f"- **Total Movies Audited**: {total_movies}\n")
            f.write(f"- **Movies PASS**: {passed_movies}\n")
            f.write(f"- **Movies FAIL**: {failed_movies}\n")
            f.write(f"- **Pipeline Contamination Errors**: {len(pipeline_errors)}\n")
            f.write(f"- **Series Ordering Errors**: {len(series_ordering_errors)}\n\n")
            f.write("### Audio & Language Classifications\n")
            f.write(f"- 🇮🇳 **HINDI_AUDIO**: {hindi_audio_count}\n")
            f.write(f"- 🌐 **MULTI_AUDIO_INCLUDING_HINDI**: {multi_audio_count}\n")
            f.write(f"- 🌍 **NON_HINDI_AUDIO**: {non_hindi_count}\n")
            f.write(f"- 💬 **HINDI_SUBTITLE_ONLY**: {hindi_sub_count}\n")
            f.write(f"- ❓ **LANGUAGE_UNKNOWN**: {unknown_lang_count}\n\n")

            if pipeline_errors:
                f.write("## ⚠️ Pipeline Errors\n")
                for err in pipeline_errors:
                    f.write(f"- **{err.get('title')}** ({err.get('id')}): {err.get('error')}\n")
                f.write("\n")

            if series_ordering_errors:
                f.write("## ⚠️ Series Ordering Errors\n")
                for err in series_ordering_errors:
                    f.write(f"- {err}\n")
                f.write("\n")

            f.write("## Catalog Item Integrity Details\n\n")
            f.write("| ID | Title | Content Type | Source Type | Audio Class | Status | Issues |\n")
            f.write("|---|---|---|---|---|---|---|\n")
            for r in sorted(reports, key=lambda x: (x.status != "FAIL", x.title)):
                issues = "<br>".join(r.failure_reasons) if r.failure_reasons else "OK"
                f.write(f"| `{r.id}` | **{r.title}** | `{r.content_type}` | `{r.source_type}` | `{r.audio_classification}` | `{r.status}` | {issues} |\n")

        print("\n" + "=" * 70)
        print("                 CONTENT INTEGRITY VALIDATION SUMMARY")
        print("=" * 70)
        print(f"🎬 Movies Audited:        {total_movies}")
        print(f"   Playable & Valid:     {passed_movies}")
        print(f"   Pipeline/Lang Failed: {failed_movies}")
        print(f"   Pipeline Violations:  {len(pipeline_errors)}")
        print(f"📺 Web-Series Audited:    {len(series_items)}")
        print(f"   Series Order Errors:  {len(series_ordering_errors)}")
        print(f"🔊 Audio Classifications:")
        print(f"   • Hindi Audio:        {hindi_audio_count}")
        print(f"   • Multi Audio (w/ Hi):{multi_audio_count}")
        print(f"   • Non-Hindi Audio:    {non_hindi_count}")
        print(f"   • Hindi Subtitles:    {hindi_sub_count}")
        print(f"   • Language Unknown:   {unknown_lang_count}")
        print("=" * 70)
        print(f"Reports written to:\n  {report_md_path}\n  {report_json_path}\n")

        return full_output


def main():
    parser = argparse.ArgumentParser(description="T2L Content Integrity Validator")
    parser.add_argument("--no-probe", action="store_true", help="Skip media ffprobe network inspection")
    parser.add_argument("--workers", type=int, default=16, help="Concurrent workers")
    args = parser.parse_args()

    validator = ContentIntegrityValidator()
    res = validator.validate_all(probe_streams=not args.no_probe, max_workers=args.workers)
    
    if res["summary"]["pipeline_errors"] > 0 or res["summary"]["series_ordering_errors"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
