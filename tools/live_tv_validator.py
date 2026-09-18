#!/usr/bin/env python3
"""
T2L Live TV Zero-Trust Forensic Validator CLI
Validates HLS / DASH / Live Media streams, identifies broken feeds, classifies failure causes,
probes media segments, verifies channel identity and audio tracks, and generates comprehensive reports.
"""

import sys
import os
import re
import json
import csv
import time
import argparse
import urllib.request
import urllib.error
import urllib.parse
import socket
import ssl

# Enforce strict global socket timeout to prevent hung unroutable IPs from stalling threads
socket.setdefaulttimeout(4.0)

from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Any

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

# Known fake / cross-mapped channel URLs to flag WRONG_CHANNEL_SOURCE
KNOWN_MISMAPPINGS = {
    "discovery-channel-hindi-hd": ["lightning-fnf-samsungaus.amagi.tv"],
    "animal-planet-hindi-hd": ["moonbug-rokuus.amagi.tv"],
    "nickelodeon-hindi-hd": ["plu-63f87d057533d80008ab9549", "NICK_JR_US"],
    "disney-channel-hindi-hd": ["dil9xdvretp0f.cloudfront.net"],
}

@dataclass
class ChannelValidationResult:
    channel_id: str
    name: str
    country: str
    language: str
    category: str
    source_url: str
    source_type: str
    status: str  # PASS, FAIL, BLOCKED, UNVERIFIED, DISCONTINUED
    failure_reason: Optional[str] = None
    http_status: Optional[int] = None
    resolution: Optional[str] = None
    codecs: Optional[str] = None
    audio_tracks: List[str] = field(default_factory=list)
    detected_audio_language: str = "UNKNOWN"
    segments_verified: bool = False
    is_master: bool = False
    variants_count: int = 0
    response_time_ms: int = 0
    backup_urls_tested: int = 0
    backup_urls_working: int = 0
    identity_valid: bool = True
    identity_notes: Optional[str] = None


class LiveTvStreamValidator:
    """Performs zero-trust live stream validation."""

    def __init__(self, timeout: float = 6.0):
        self.timeout = timeout
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def probe_channel(self, ch: Dict[str, Any]) -> ChannelValidationResult:
        ch_id = ch.get("id", "")
        name = ch.get("name", "")
        country = ch.get("country", "IN")
        lang = ch.get("language", "Hindi")
        cat = ch.get("category", "Entertainment")
        url = ch.get("url", "").strip()
        backup_urls = ch.get("backupUrls", [])

        stype = ch.get("sourceType")
        if not stype:
            if ".m3u8" in url.lower():
                stype = "LIVE_HLS"
            elif ".mpd" in url.lower():
                stype = "LIVE_DASH"
            else:
                stype = "LIVE_MEDIA"

        identity_valid = True
        identity_notes = None
        if ch_id in KNOWN_MISMAPPINGS:
            for pattern in KNOWN_MISMAPPINGS[ch_id]:
                if pattern in url:
                    identity_valid = False
                    identity_notes = f"Source contains banned pattern '{pattern}' assigned to wrong network"
                    break

        if "like Gecko)" in name or 'group-title="' in name:
            identity_valid = False
            identity_notes = "Channel name contains unparsed M3U metadata headers"

        if not url:
            return ChannelValidationResult(
                channel_id=ch_id,
                name=name,
                country=country,
                language=lang,
                category=cat,
                source_url="",
                source_type=stype,
                status="FAIL",
                failure_reason="EMPTY_SOURCE_URL",
                identity_valid=False,
                identity_notes="No source URL specified"
            )

        start_t = time.time()
        res = self._validate_hls(url) if stype == "LIVE_HLS" else self._validate_media(url)
        elapsed_ms = int((time.time() - start_t) * 1000)

        working_backups = 0
        tested_backups = 0
        if res.get("status") != "PASS" and backup_urls:
            for b_url in backup_urls:
                if b_url:
                    tested_backups += 1
                    b_res = self._validate_hls(b_url) if ".m3u8" in b_url.lower() else self._validate_media(b_url)
                    if b_res.get("status") == "PASS":
                        working_backups += 1

        final_status = res.get("status", "FAIL")
        failure_reason = res.get("failure_reason")

        if not identity_valid:
            final_status = "FAIL"
            failure_reason = f"WRONG_CHANNEL_SOURCE: {identity_notes}"

        detected_lang = self._classify_language(lang, name, res.get("audio_tracks", []))

        return ChannelValidationResult(
            channel_id=ch_id,
            name=name,
            country=country,
            language=lang,
            category=cat,
            source_url=url,
            source_type=stype,
            status=final_status,
            failure_reason=failure_reason,
            http_status=res.get("http_status"),
            resolution=res.get("resolution"),
            codecs=res.get("codecs"),
            audio_tracks=res.get("audio_tracks", []),
            detected_audio_language=detected_lang,
            segments_verified=res.get("segments_verified", False),
            is_master=res.get("is_master", False),
            variants_count=res.get("variants_count", 0),
            response_time_ms=elapsed_ms,
            backup_urls_tested=tested_backups,
            backup_urls_working=working_backups,
            identity_valid=identity_valid,
            identity_notes=identity_notes
        )

    def _classify_language(self, claimed_lang: str, channel_name: str, audio_tracks: List[str]) -> str:
        name_lower = channel_name.lower()
        claimed_lower = claimed_lang.lower() if claimed_lang else ""

        tracks_str = " ".join(audio_tracks).lower()
        if "hin" in tracks_str:
            if "eng" in tracks_str:
                return "MULTI_LANGUAGE"
            return "HINDI"

        if "dubbed" in name_lower and ("hindi" in name_lower or "hindi" in claimed_lower):
            return "HINDI_DUBBED"

        if "hindi" in name_lower or "hindi" in claimed_lower:
            return "HINDI"

        if any(r in name_lower or r in claimed_lower for r in ["tamil", "telugu", "kannada", "malayalam", "bengali", "bhojpuri", "marathi", "gujarati", "punjabi", "oriya", "urdu", "kashir"]):
            return "REGIONAL"

        if "english" in name_lower or "english" in claimed_lower:
            return "ENGLISH_ONLY"

        return "UNKNOWN"

    def _fetch(self, url: str, headers: Optional[Dict[str, str]] = None, range_bytes: Optional[str] = None):
        req_headers = {"User-Agent": USER_AGENT}
        if headers:
            req_headers.update(headers)
        if range_bytes:
            req_headers["Range"] = f"bytes={range_bytes}"

        req = urllib.request.Request(url, headers=req_headers)
        try:
            with urllib.request.urlopen(req, timeout=self.timeout, context=self.ctx) as resp:
                data = resp.read()
                resp_headers = dict(resp.headers.items())
                return resp.status, data, resp_headers, None
        except urllib.error.HTTPError as e:
            return e.code, b"", {}, f"HTTP_{e.code}"
        except urllib.error.URLError as e:
            reason = str(e.reason).lower()
            if "timed out" in reason or "timeout" in reason:
                return 0, b"", {}, "TIMEOUT"
            if "name or service not known" in reason or "nodename nor servname" in reason:
                return 0, b"", {}, "DNS_FAILURE"
            if "ssl" in reason or "certificate" in reason:
                return 0, b"", {}, "TLS_FAILURE"
            if "connection refused" in reason:
                return 0, b"", {}, "CONNECTION_REFUSED"
            return 0, b"", {}, f"NETWORK_ERROR_{type(e.reason).__name__}"
        except Exception as e:
            return 0, b"", {}, f"UNKNOWN_EXCEPTION_{type(e).__name__}"

    def _validate_hls(self, url: str) -> Dict[str, Any]:
        status_code, data, headers, err = self._fetch(url)

        if err:
            if status_code in (401, 407):
                return {"status": "FAIL", "failure_reason": "AUTH_REQUIRED", "http_status": status_code}
            elif status_code == 403:
                return {"status": "BLOCKED", "failure_reason": "HTTP_403_FORBIDDEN", "http_status": status_code}
            elif status_code == 404:
                return {"status": "FAIL", "failure_reason": "HTTP_404_NOT_FOUND", "http_status": status_code}
            elif status_code == 410:
                return {"status": "DISCONTINUED", "failure_reason": "SOURCE_DISCONTINUED_HTTP_410", "http_status": status_code}
            elif status_code == 429:
                return {"status": "BLOCKED", "failure_reason": "RATE_LIMITED_HTTP_429", "http_status": status_code}
            elif status_code >= 500:
                return {"status": "FAIL", "failure_reason": f"SERVER_ERROR_HTTP_{status_code}", "http_status": status_code}
            return {"status": "FAIL", "failure_reason": err, "http_status": status_code}

        if len(data) == 0:
            return {"status": "FAIL", "failure_reason": "EMPTY_RESPONSE", "http_status": status_code}

        content_str = data.decode("utf-8", errors="ignore")
        content_lower_prefix = content_str.lstrip().lower()[:200]
        if "<!doctype html" in content_lower_prefix or "<html" in content_lower_prefix or "<head" in content_lower_prefix:
            return {"status": "FAIL", "failure_reason": "HTML_RESPONSE_NOT_M3U8", "http_status": status_code}

        if not content_str.startswith("#EXTM3U"):
            return {"status": "FAIL", "failure_reason": "INVALID_MANIFEST_NO_EXTM3U", "http_status": status_code}

        lines = content_str.splitlines()
        is_master = "#EXT-X-STREAM-INF" in content_str
        variants = []
        resolutions = []
        codecs_list = []
        audio_tracks = []

        if is_master:
            for i, line in enumerate(lines):
                line_str = line.strip()
                if line_str.startswith("#EXT-X-MEDIA:TYPE=AUDIO"):
                    m_lang = re.search(r'LANGUAGE="([^"]+)"', line_str)
                    if m_lang:
                        audio_tracks.append(m_lang.group(1))
                    m_name = re.search(r'NAME="([^"]+)"', line_str)
                    if m_name and (not m_lang or m_name.group(1) not in audio_tracks):
                        audio_tracks.append(m_name.group(1))

                if line_str.startswith("#EXT-X-STREAM-INF:"):
                    m_res = re.search(r'RESOLUTION=(\d+x\d+)', line_str)
                    if m_res:
                        resolutions.append(m_res.group(1))
                    m_cod = re.search(r'CODECS="([^"]+)"', line_str)
                    if m_cod:
                        codecs_list.append(m_cod.group(1))
                    for j in range(i + 1, min(i + 5, len(lines))):
                        nxt = lines[j].strip()
                        if nxt and not nxt.startswith("#"):
                            variants.append(urllib.parse.urljoin(url, nxt))
                            break

        target_media_url = variants[0] if variants else url
        media_content = content_str
        if variants:
            m_code, m_data, _, m_err = self._fetch(target_media_url)
            if m_err or not m_data:
                return {
                    "status": "FAIL",
                    "failure_reason": f"VARIANT_FETCH_FAILED_{m_err}",
                    "http_status": m_code,
                    "is_master": is_master,
                    "variants_count": len(variants)
                }
            media_content = m_data.decode("utf-8", errors="ignore")

        segment_urls = []
        for line in media_content.splitlines():
            sline = line.strip()
            if sline and not sline.startswith("#"):
                segment_urls.append(urllib.parse.urljoin(target_media_url, sline))
                if len(segment_urls) >= 2:
                    break

        if not segment_urls:
            return {
                "status": "FAIL",
                "failure_reason": "HLS_EMPTY_MEDIA_PLAYLIST",
                "http_status": status_code,
                "is_master": is_master
            }

        first_seg_url = segment_urls[0]
        s_code, s_data, _, s_err = self._fetch(first_seg_url, range_bytes="0-1024")
        if s_err or len(s_data) == 0:
            return {
                "status": "FAIL",
                "failure_reason": f"DEAD_SEGMENT_{s_err or 'EMPTY'}",
                "http_status": s_code,
                "is_master": is_master,
                "variants_count": len(variants)
            }

        best_res = resolutions[0] if resolutions else None
        if not best_res:
            m_h = re.search(r'(\d{3,4})[pP]', url)
            if m_h:
                best_res = m_h.group(1) + "p"

        return {
            "status": "PASS",
            "failure_reason": None,
            "http_status": status_code,
            "resolution": best_res or "Auto/Adaptive",
            "codecs": ",".join(set(codecs_list)) if codecs_list else "h264,aac",
            "audio_tracks": audio_tracks,
            "segments_verified": True,
            "is_master": is_master,
            "variants_count": len(variants)
        }

    def _validate_media(self, url: str) -> Dict[str, Any]:
        s_code, s_data, _, s_err = self._fetch(url, range_bytes="0-1024")
        if s_err or len(s_data) == 0:
            return {
                "status": "FAIL",
                "failure_reason": f"MEDIA_CONNECT_FAIL_{s_err or 'EMPTY'}",
                "http_status": s_code
            }
        return {
            "status": "PASS",
            "failure_reason": None,
            "http_status": s_code,
            "resolution": "Direct Media",
            "codecs": "Unknown",
            "audio_tracks": [],
            "segments_verified": True,
            "is_master": False,
            "variants_count": 0
        }


def run_full_validation(
    channels: List[Dict[str, Any]],
    workers: int = 16,
    broken_only: bool = False
) -> List[ChannelValidationResult]:
    validator = LiveTvStreamValidator(timeout=5.0)
    results: List[ChannelValidationResult] = []

    print(f"[*] Starting Zero-Trust Live TV validation on {len(channels)} channels (Workers: {workers})...")
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {executor.submit(validator.probe_channel, ch): ch for ch in channels}
        completed = 0
        total = len(channels)
        for future in as_completed(future_map):
            completed += 1
            res = future.result()
            results.append(res)
            if completed % 50 == 0 or completed == total:
                print(f"    Progress: {completed}/{total} channels probed ({completed*100//total}%)")

    id_order = {ch.get("id"): i for i, ch in enumerate(channels)}
    results.sort(key=lambda r: id_order.get(r.channel_id, 99999))
    return results


def write_reports(results: List[ChannelValidationResult], output_dir: str = "reports"):
    os.makedirs(output_dir, exist_ok=True)

    json_path = os.path.join(output_dir, "live_tv_validation_report.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump([asdict(r) for r in results], f, indent=2)

    csv_path = os.path.join(output_dir, "live_tv_validation_report.csv")
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ChannelId", "Name", "Country", "Language", "Category",
            "Status", "FailureReason", "HttpStatus", "Resolution",
            "Codecs", "DetectedAudio", "SegmentsVerified", "ResponseTimeMs", "SourceUrl"
        ])
        for r in results:
            writer.writerow([
                r.channel_id, r.name, r.country, r.language, r.category,
                r.status, r.failure_reason or "", r.http_status or "", r.resolution or "",
                r.codecs or "", r.detected_audio_language, r.segments_verified,
                r.response_time_ms, r.source_url
            ])

    total = len(results)
    passed = sum(1 for r in results if r.status == "PASS")
    failed = sum(1 for r in results if r.status == "FAIL")
    blocked = sum(1 for r in results if r.status == "BLOCKED")
    unverified = sum(1 for r in results if r.status == "UNVERIFIED")
    discontinued = sum(1 for r in results if r.status == "DISCONTINUED")

    lang_counts = {}
    for r in results:
        lang_counts[r.detected_audio_language] = lang_counts.get(r.detected_audio_language, 0) + 1

    cat_counts = {}
    for r in results:
        cat_counts[r.category] = cat_counts.get(r.category, 0) + 1

    fail_reasons = {}
    for r in results:
        if r.failure_reason:
            clean_reason = r.failure_reason.split(":")[0]
            fail_reasons[clean_reason] = fail_reasons.get(clean_reason, 0) + 1

    md_path = os.path.join(output_dir, "live_tv_validation_report.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# T2L Live TV Zero-Trust Validation Report\n\n")
        f.write(f"**Generated:** {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n")
        f.write(f"**Total Channels Probed:** {total}\n\n")

        f.write("## 1. Overall Status Breakdown\n\n")
        f.write("| Status | Count | Percentage |\n")
        f.write("| :--- | :--- | :--- |\n")
        f.write(f"| **PASS (Verified Playable)** | {passed} | {passed*100/total:.1f}% |\n")
        f.write(f"| **FAIL (Broken / Dead)** | {failed} | {failed*100/total:.1f}% |\n")
        f.write(f"| **BLOCKED (Geo / 403 / 429)** | {blocked} | {blocked*100/total:.1f}% |\n")
        f.write(f"| **UNVERIFIED** | {unverified} | {unverified*100/total:.1f}% |\n")
        f.write(f"| **DISCONTINUED (410)** | {discontinued} | {discontinued*100/total:.1f}% |\n\n")

        f.write("## 2. Language Breakdown\n\n")
        f.write("| Audio Language Class | Count |\n")
        f.write("| :--- | :--- |\n")
        for l, count in sorted(lang_counts.items(), key=lambda x: -x[1]):
            f.write(f"| {l} | {count} |\n")
        f.write("\n")

        f.write("## 3. Category Breakdown\n\n")
        f.write("| Category | Total | Working (PASS) |\n")
        f.write("| :--- | :--- | :--- |\n")
        for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
            cat_pass = sum(1 for r in results if r.category == cat and r.status == "PASS")
            f.write(f"| {cat} | {count} | {cat_pass} |\n")
        f.write("\n")

        f.write("## 4. Top Failure Reasons\n\n")
        f.write("| Failure Class | Count |\n")
        f.write("| :--- | :--- |\n")
        for reason, count in sorted(fail_reasons.items(), key=lambda x: -x[1])[:15]:
            f.write(f"| `{reason}` | {count} |\n")
        f.write("\n")

    fq_path = os.path.join(output_dir, "LIVE_TV_FIX_QUEUE.md")
    with open(fq_path, "w", encoding="utf-8") as f:
        f.write("# T2L Live TV Remediation & Fix Queue\n\n")
        f.write("This document tracks channels with broken sources, improper mappings, and required migrations.\n\n")

        mismapped = [r for r in results if not r.identity_valid]
        f.write(f"## P0 — IDENTITY / WRONG CHANNEL SOURCE ({len(mismapped)} Channels)\n\n")
        for r in mismapped:
            f.write(f"### {r.name} (`{r.channel_id}`)\n")
            f.write(f"- **Current URL**: `{r.source_url}`\n")
            f.write(f"- **Diagnostic Issue**: {r.identity_notes}\n")
            f.write(f"- **Required Action**: Unmap foreign feed and replace with verified broadcast origin stream.\n\n")

        broken_kids = [r for r in results if r.category in ("Kids & Animation", "KIDS", "CARTOONS") and r.status != "PASS"]
        f.write(f"## P1 — BROKEN KIDS & CARTOON CHANNELS ({len(broken_kids)} Channels)\n\n")
        for r in broken_kids:
            f.write(f"### {r.name} (`{r.channel_id}`)\n")
            f.write(f"- **URL**: `{r.source_url}`\n")
            f.write(f"- **Failure**: `{r.failure_reason}`\n")
            f.write(f"- **Action**: Replace with authenticated/live feed.\n\n")

        broken_info = [r for r in results if r.category in ("Entertainment", "INFOTAINMENT", "DOCUMENTARY") and any(k in r.name.lower() for k in ["discovery", "animal planet", "national geographic", "nat geo", "tlc"]) and r.status != "PASS"]
        f.write(f"## P2 — BROKEN INFOTAINMENT & DOCUMENTARY CHANNELS ({len(broken_info)} Channels)\n\n")
        for r in broken_info:
            f.write(f"### {r.name} (`{r.channel_id}`)\n")
            f.write(f"- **URL**: `{r.source_url}`\n")
            f.write(f"- **Failure**: `{r.failure_reason}`\n")
            f.write(f"- **Action**: Deploy verified broadcaster feed.\n\n")

    print(f"[+] Reports generated successfully in '{output_dir}/':")
    print(f"    - JSON: {json_path}")
    print(f"    - CSV:  {csv_path}")
    print(f"    - MD:   {md_path}")
    print(f"    - FIX:  {fq_path}")


def main():
    parser = argparse.ArgumentParser(description="T2L Live TV Zero-Trust Forensic Validator")
    parser.add_argument("--all", action="store_true", help="Audit all channels in catalog")
    parser.add_argument("--hindi", action="store_true", help="Filter for Hindi channels")
    parser.add_argument("--kids", action="store_true", help="Filter for Kids & Cartoon channels")
    parser.add_argument("--infotainment", action="store_true", help="Filter for Infotainment channels")
    parser.add_argument("--broken-only", action="store_true", help="Audit only previously failing channels")
    parser.add_argument("--json", action="store_true", help="Output summary in JSON format")
    parser.add_argument("--workers", type=int, default=16, help="Concurrent probe worker threads")
    parser.add_argument("--channel-id", type=str, help="Validate single channel by ID")
    parser.add_argument("--catalog", type=str, default="data/channels.json", help="Path to channels.json")
    parser.add_argument("--reports-dir", type=str, default="reports", help="Output directory for reports")

    args = parser.parse_args()

    catalog_path = os.path.abspath(args.catalog)
    if not os.path.exists(catalog_path):
        print(f"[-] Catalog file not found: {catalog_path}")
        sys.exit(1)

    with open(catalog_path, "r", encoding="utf-8") as f:
        channels = json.load(f)

    if args.channel_id:
        channels = [c for c in channels if c.get("id") == args.channel_id]
    elif args.kids:
        channels = [c for c in channels if c.get("category") in ("Kids & Animation", "KIDS", "CARTOONS") or any(k in c.get("name", "").lower() for k in ["nick", "cartoon", "pogo", "sonic", "hungama", "disney", "yay", "bal bharat"])]
    elif args.infotainment:
        channels = [c for c in channels if c.get("category") in ("INFOTAINMENT", "DOCUMENTARY", "Science & Space") or any(k in c.get("name", "").lower() for k in ["discovery", "animal planet", "national geographic", "nat geo", "tlc", "sony bbc earth", "history", "travel xp"])]
    elif args.hindi:
        channels = [c for c in channels if "hindi" in c.get("language", "").lower() or "hindi" in c.get("name", "").lower()]

    results = run_full_validation(channels, workers=args.workers, broken_only=args.broken_only)
    write_reports(results, output_dir=args.reports_dir)

    total = len(results)
    passed = sum(1 for r in results if r.status == "PASS")
    failed = sum(1 for r in results if r.status == "FAIL")
    blocked = sum(1 for r in results if r.status == "BLOCKED")

    print("\n" + "="*50)
    print(f"LIVE TV AUDIT SUMMARY ({total} Channels)")
    print("="*50)
    print(f"  PASS:        {passed} ({passed*100//total if total else 0}%)")
    print(f"  FAIL:        {failed}")
    print(f"  BLOCKED:     {blocked}")
    print("="*50)

    if args.json:
        print(json.dumps([asdict(r) for r in results], indent=2))


if __name__ == "__main__":
    main()
