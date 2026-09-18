#!/usr/bin/env python3
"""
T2L Authorized Public Media Discovery Engine & Validation Pipeline.

Executes zero-trust discovery from allowlisted repositories, performs license checks,
media probing, anti-trailer classification, identity matching, duplicate detection,
and exports comprehensive diagnostic reports.
"""

import os
import sys
import json
import time
import argparse
from typing import Dict, Any, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, WORKSPACE)

from tools.media_discovery.source_registry import SourceRegistry
from tools.media_discovery.license_checker import LicenseChecker
from tools.media_discovery.index_discovery import IndexDiscovery, DiscoveredCandidate
from tools.media_discovery.content_classifier import ContentClassifier
from tools.media_discovery.metadata_matcher import MetadataMatcher
from tools.media_discovery.media_probe import MediaProber
from tools.media_discovery.import_pipeline import ImportPipeline

REPORTS_DIR = os.path.join(WORKSPACE, "reports")


class PublicMediaDiscoveryEngine:
    def __init__(self, timeout_s: int = 15, workers: int = 8):
        self.registry = SourceRegistry()
        self.license_checker = LicenseChecker()
        self.discovery = IndexDiscovery(self.registry)
        self.classifier = ContentClassifier()
        self.matcher = MetadataMatcher()
        self.prober = MediaProber(timeout_s=timeout_s)
        self.importer = ImportPipeline()
        self.workers = workers

    def run_pipeline(
        self,
        collection: str = "feature_films",
        query_filter: str = "mediatype:movies",
        limit: int = 20,
        do_import: bool = False
    ) -> Dict[str, Any]:
        print("=" * 80)
        print("    T2L AUTHORIZED PUBLIC MEDIA DISCOVERY & VALIDATION PIPELINE")
        print("=" * 80)
        print(f"Mode: {'IMPORT (Live Catalog Update)' if do_import else 'DRY-RUN (Diagnostic Inspection)'}")
        print(f"Target Collection: {collection} | Limit: {limit}")
        print("-" * 80)

        # 1. DISCOVERY STAGE
        print("🔍 1. Discovering candidates from authorized repositories...")
        candidates = self.discovery.discover_archive_org(
            collection=collection,
            query_filter=query_filter,
            max_items=limit
        )
        print(f"   Found {len(candidates)} raw candidates in allowlisted source.\n")

        processed_items: List[Dict[str, Any]] = []
        import_queue: List[Dict[str, Any]] = []

        # 2. PIPELINE VALIDATION
        def validate_candidate(cand: DiscoveredCandidate) -> Dict[str, Any]:
            cid = cand.id
            title = cand.title
            url = cand.source_url
            record = {
                "id": cid,
                "title": title,
                "year": cand.year,
                "url": url,
                "collection": cand.collection,
                "status": "PENDING",
                "stages": {},
                "rejection_reasons": []
            }

            # 2.1 Source Authorization Check
            is_auth, auth_reason, source_info = self.registry.is_url_authorized(url, cand.collection)
            record["stages"]["source_auth"] = {"passed": is_auth, "reason": auth_reason}
            if not is_auth:
                record["status"] = "REJECTED_UNAUTHORIZED_SOURCE"
                record["rejection_reasons"].append(auth_reason)
                return record

            # 2.2 License Check
            lic_res = self.license_checker.verify_license(cand.metadata, cand.year)
            record["stages"]["license"] = {
                "passed": lic_res.is_valid,
                "type": lic_res.license_type,
                "details": lic_res.license_details
            }
            if not lic_res.is_valid:
                record["status"] = "REJECTED_UNLICENSED"
                record["rejection_reasons"].append(lic_res.rejection_reason or "Unverifiable license")
                return record

            # 2.3 Metadata & Identity Normalization
            ident = self.matcher.normalize(title, cand.year, os.path.basename(url))
            record["stages"]["identity"] = {
                "passed": ident.is_valid_identity,
                "clean_title": ident.clean_title,
                "year": ident.year
            }
            if not ident.is_valid_identity:
                record["status"] = "REJECTED_IDENTITY_MISMATCH"
                record["rejection_reasons"].append(ident.mismatch_reason or "Identity validation failed")
                return record

            # 2.4 Duplicate Check
            dup_res = self.importer.check_duplicate(ident.clean_title, ident.year, url, cid)
            record["stages"]["duplicate_check"] = {
                "is_duplicate": dup_res.is_duplicate,
                "type": dup_res.duplicate_type
            }
            if dup_res.is_duplicate:
                record["status"] = "REJECTED_DUPLICATE"
                record["rejection_reasons"].append(f"Duplicate content already in catalog ({dup_res.duplicate_type})")
                return record

            # 2.5 Media & Stream Probe
            probe_res = self.prober.probe(url)
            record["stages"]["media_probe"] = {
                "is_playable": probe_res.is_playable,
                "duration_s": probe_res.duration_s,
                "resolution": probe_res.quality_label,
                "video_codec": probe_res.video_codec,
                "audio_classification": probe_res.audio_classification,
                "languages": probe_res.detected_languages
            }
            if not probe_res.is_playable:
                record["status"] = "REJECTED_UNPLAYABLE"
                record["rejection_reasons"].append(probe_res.failure_reason or "Stream is unplayable or corrupt")
                return record

            # 2.6 Content Classification & Anti-Trailer Check
            class_res = self.classifier.classify(
                title=ident.clean_title,
                filename=os.path.basename(url),
                duration_s=probe_res.duration_s,
                metadata=cand.metadata
            )
            record["stages"]["content_classification"] = {
                "content_type": class_res.content_type,
                "is_feature": class_res.is_feature_length,
                "is_trailer_or_clip": class_res.is_trailer_or_clip,
                "evidence": class_res.evidence
            }
            if class_res.is_trailer_or_clip:
                record["status"] = "REJECTED_TRAILER_OR_CLIP"
                record["rejection_reasons"].append(f"Promotional trailer or short clip rejected as full movie ({class_res.content_type})")
                return record

            if class_res.content_type != "MOVIE" and class_res.content_type != "DOCUMENTARY":
                record["status"] = "REJECTED_NON_MOVIE"
                record["rejection_reasons"].append(f"Content classified as {class_res.content_type}, not full movie")
                return record

            # 2.7 Thumbnail Validation
            thumb_res = self.importer.validate_thumbnail(cand.poster_url, cid)
            record["stages"]["thumbnail"] = {
                "passed": thumb_res.is_valid,
                "failure_reason": thumb_res.failure_reason
            }
            if not thumb_res.is_valid:
                record["status"] = "REJECTED_INVALID_THUMBNAIL"
                record["rejection_reasons"].append(f"Thumbnail invalid: {thumb_res.failure_reason}")
                return record

            # Candidate PASSED all zero-trust gates!
            record["status"] = "READY_FOR_IMPORT"
            record["ready_catalog_entry"] = {
                "id": cid,
                "title": ident.clean_title,
                "year": ident.year or cand.year,
                "mediaType": "movie",
                "type": "Bollywood" if probe_res.audio_classification in ("HINDI_AUDIO", "MULTI_AUDIO_INCLUDING_HINDI") else "Hollywood",
                "categories": ["classics", "movies"],
                "duration": int(probe_res.duration_s),
                "durationFormatted": f"{int(probe_res.duration_s // 3600)}h {int((probe_res.duration_s % 3600) // 60):02d}m",
                "genres": ["Classics", "Drama"],
                "rating": 7.5,
                "description": str(cand.metadata.get("description") or f"Public domain historic motion picture: {ident.clean_title}."),
                "posterUrl": f"assets/posters/{cid}.jpg",
                "backdropUrl": f"assets/posters/{cid}.jpg",
                "resolution": probe_res.quality_label,
                "codec": f"{probe_res.video_codec.upper()} / AVC",
                "audio": {
                    "classification": probe_res.audio_classification,
                    "hasHindiAudio": probe_res.audio_classification in ("HINDI_AUDIO", "MULTI_AUDIO_INCLUDING_HINDI"),
                    "hasHindiSubtitles": False,
                    "primaryLanguage": "Hindi" if "Hindi" in probe_res.detected_languages else (probe_res.detected_languages[0] if probe_res.detected_languages else "English"),
                    "availableLanguages": probe_res.detected_languages or ["English"]
                },
                "languages": probe_res.detected_languages or ["English"],
                "defaultLanguage": "Hindi" if "Hindi" in probe_res.detected_languages else (probe_res.detected_languages[0] if probe_res.detected_languages else "English"),
                "container": cand.format,
                "fileSize": f"{cand.file_size // (1024*1024)} MB",
                "license": lic_res.license_details,
                "contentSource": source_info["name"] if source_info else "Public Domain Archive",
                "director": "Various Artists",
                "cast": "Historic Cast in Credits",
                "featured": False,
                "latest": False,
                "swarmSeeders": None,
                "streamUrl": url,
                "backupUrls": [],
                "torrentUri": None,
                "contentType": "MOVIE",
                "region": "PUBLIC_DOMAIN",
                "trailerUrl": None,
                "sourceState": "DIRECT_STREAM_AVAILABLE",
                "qualityHonestBadge": probe_res.quality_label,
                "audioClassification": probe_res.audio_classification,
                "metadata": {
                    "originalLanguage": "hi" if "Hindi" in probe_res.detected_languages else "en",
                    "spokenLanguages": probe_res.detected_languages or ["English"],
                    "countries": ["IN"] if "Hindi" in probe_res.detected_languages else ["US"]
                }
            }

            return record

        print("⚙️  2. Running Zero-Trust Validation Pipeline (concurrent ffprobe)...")
        with ThreadPoolExecutor(max_workers=self.workers) as executor:
            futures = {executor.submit(validate_candidate, c): c for c in candidates}
            for f in as_completed(futures):
                res = f.result()
                processed_items.append(res)
                icon = "✅" if res["status"] == "READY_FOR_IMPORT" else "❌"
                print(f"   {icon} [{res['status']}] {res['title']} ({res.get('year') or 'N/A'})")
                if res["rejection_reasons"]:
                    for r in res["rejection_reasons"]:
                        print(f"      ↳ {r}")
                if res["status"] == "READY_FOR_IMPORT":
                    import_queue.append(res["ready_catalog_entry"])

        # 3. IMPORT STAGE
        imported_count = 0
        if do_import and import_queue:
            print("\n📦 3. Ingesting validated candidates into T2L catalog...")
            backup_path = self.importer.create_backup()
            print(f"   Pre-import backup saved: {backup_path}")
            for entry in import_queue:
                success = self.importer.import_item(entry)
                if success:
                    imported_count += 1
                    print(f"   ✓ Ingested: {entry['title']} ({entry['year']}) [{entry['qualityHonestBadge']}]")

        # 4. GENERATE REPORTS
        summary = self._generate_reports(processed_items, import_queue, imported_count, do_import)
        return summary

    def _generate_reports(
        self,
        items: List[Dict[str, Any]],
        import_queue: List[Dict[str, Any]],
        imported_count: int,
        do_import: bool
    ) -> Dict[str, Any]:
        os.makedirs(REPORTS_DIR, exist_ok=True)
        report_json_path = os.path.join(REPORTS_DIR, "public_media_discovery.json")
        report_md_path = os.path.join(REPORTS_DIR, "public_media_discovery.md")
        queue_json_path = os.path.join(REPORTS_DIR, "public_media_import_queue.json")

        total_discovered = len(items)
        ready_count = sum(1 for i in items if i["status"] == "READY_FOR_IMPORT")
        rejected_count = total_discovered - ready_count

        rejections_by_reason: Dict[str, int] = {}
        for i in items:
            if i["status"] != "READY_FOR_IMPORT":
                st = i["status"]
                rejections_by_reason[st] = rejections_by_reason.get(st, 0) + 1

        qualities: Dict[str, int] = {}
        languages: Dict[str, int] = {}
        for i in items:
            if i.get("stages", {}).get("media_probe"):
                q = i["stages"]["media_probe"].get("resolution", "Unknown")
                qualities[q] = qualities.get(q, 0) + 1
                ac = i["stages"]["media_probe"].get("audio_classification", "UNKNOWN")
                languages[ac] = languages.get(ac, 0) + 1

        summary = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "total_discovered": total_discovered,
            "ready_for_import": ready_count,
            "rejected": rejected_count,
            "imported": imported_count,
            "rejections_by_category": rejections_by_reason,
            "quality_breakdown": qualities,
            "audio_breakdown": languages
        }

        # Write JSON Reports
        with open(report_json_path, "w", encoding="utf-8") as f:
            json.dump({"summary": summary, "candidates": items}, f, indent=2)

        with open(queue_json_path, "w", encoding="utf-8") as f:
            json.dump(import_queue, f, indent=2)

        # Write Markdown Report
        with open(report_md_path, "w", encoding="utf-8") as f:
            f.write("# T2L Public Media Discovery & Validation Report\n\n")
            f.write(f"- **Execution Timestamp**: `{summary['timestamp']}`\n")
            f.write(f"- **Execution Mode**: `{'IMPORT' if do_import else 'DRY-RUN'}`\n")
            f.write(f"- **Total Discovered Candidates**: {total_discovered}\n")
            f.write(f"- **Approved / Ready for Import**: {ready_count}\n")
            f.write(f"- **Rejected Candidates**: {rejected_count}\n")
            f.write(f"- **Catalog Imported Count**: {imported_count}\n\n")

            f.write("### Rejection Reasons\n")
            for reason, cnt in rejections_by_reason.items():
                f.write(f"- **{reason}**: {cnt}\n")
            f.write("\n")

            f.write("### Quality Breakdown\n")
            for q, cnt in qualities.items():
                f.write(f"- **{q}**: {cnt}\n")
            f.write("\n")

            f.write("### Audio / Language Breakdown\n")
            for a, cnt in languages.items():
                f.write(f"- **{a}**: {cnt}\n")
            f.write("\n")

            f.write("### Candidates Table\n\n")
            f.write("| Title | Year | Status | Resolution | Audio | Rejection / Notes |\n")
            f.write("|---|---|---|---|---|---|\n")
            for i in items:
                q = i.get("stages", {}).get("media_probe", {}).get("resolution", "-")
                a = i.get("stages", {}).get("media_probe", {}).get("audio_classification", "-")
                rej = "; ".join(i.get("rejection_reasons", [])) or "PASS"
                f.write(f"| **{i['title']}** | {i.get('year') or 'N/A'} | `{i['status']}` | {q} | {a} | {rej} |\n")

        print("\n" + "=" * 80)
        print("                     DISCOVERY & VALIDATION SUMMARY")
        print("=" * 80)
        print(f"🎬 Total Discovered:     {total_discovered}")
        print(f"   • Ready For Import:   {ready_count}")
        print(f"   • Rejected:           {rejected_count}")
        print(f"   • Ingested to Catalog:{imported_count}")
        print(f"📁 Reports Generated:")
        print(f"   • {report_md_path}")
        print(f"   • {report_json_path}")
        print(f"   • {queue_json_path}")
        print("=" * 80 + "\n")

        return summary


def main():
    parser = argparse.ArgumentParser(description="T2L Authorized Public Media Discovery Engine")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Diagnostic dry-run without catalog import (default)")
    parser.add_argument("--import", dest="do_import", action="store_true", help="Ingest validated candidates into catalog")
    parser.add_argument("--collection", type=str, default="feature_films", help="Target archive collection")
    parser.add_argument("--query", type=str, default="mediatype:movies", help="Search filter query")
    parser.add_argument("--limit", type=int, default=15, help="Maximum candidates to inspect")
    parser.add_argument("--workers", type=int, default=8, help="Concurrent probe workers")
    args = parser.parse_args()

    engine = PublicMediaDiscoveryEngine(workers=args.workers)
    engine.run_pipeline(
        collection=args.collection,
        query_filter=args.query,
        limit=args.limit,
        do_import=args.do_import
    )


if __name__ == "__main__":
    main()
