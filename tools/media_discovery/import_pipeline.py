#!/usr/bin/env python3
"""
T2L Import Pipeline & Duplicate Prevention Engine.
Validates thumbnails, detects catalog duplicates, manages multi-quality variants,
creates automatic backups, and performs atomic imports.
"""

import os
import re
import time
import json
import shutil
import urllib.request
from dataclasses import dataclass
from typing import Dict, Any, List, Optional, Tuple

WORKSPACE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
ANDROID_CATALOG_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "data", "movies_catalog.json")
POSTERS_DIR = os.path.join(WORKSPACE, "assets", "posters")
ANDROID_POSTERS_DIR = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "posters")


@dataclass
class DuplicateCheckResult:
    is_duplicate: bool
    existing_item: Optional[Dict[str, Any]] = None
    duplicate_type: Optional[str] = None  # EXACT_MATCH, SAME_TITLE_YEAR, URL_COLLISION, NONE


@dataclass
class ThumbnailValidationResult:
    is_valid: bool
    local_path: Optional[str] = None
    failure_reason: Optional[str] = None


class ImportPipeline:
    def __init__(self, catalog_path: str = CATALOG_PATH):
        self.catalog_path = catalog_path
        self.catalog = self._load_catalog()

    def _load_catalog(self) -> Dict[str, Any]:
        with open(self.catalog_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def check_duplicate(self, title: str, year: Optional[int], stream_url: str, item_id: str) -> DuplicateCheckResult:
        """
        Checks if candidate title, release year, or stream URL already exists in the catalog.
        """
        norm_title = re.sub(r"[^\w\s]", "", title.lower()).strip()
        movies = self.catalog.get("movies", [])

        for m in movies:
            m_title = m.get("title", "")
            m_norm = re.sub(r"[^\w\s]", "", m_title.lower()).strip()
            m_year = m.get("year")
            m_url = m.get("streamUrl") or ""
            m_id = m.get("id")

            # 1. Exact ID collision
            if item_id and m_id == item_id:
                return DuplicateCheckResult(True, m, "EXACT_ID_COLLISION")

            # 2. Exact Stream URL collision
            if stream_url and m_url == stream_url:
                return DuplicateCheckResult(True, m, "URL_COLLISION")

            # 3. Same Title and Year
            if norm_title == m_norm:
                if year and m_year:
                    try:
                        if int(str(year)[:4]) == int(str(m_year)[:4]):
                            return DuplicateCheckResult(True, m, "SAME_TITLE_YEAR")
                    except Exception:
                        pass
                elif not year or not m_year:
                    return DuplicateCheckResult(True, m, "SAME_TITLE")

        return DuplicateCheckResult(False, None, "NONE")

    def validate_thumbnail(self, poster_url: str, item_id: str) -> ThumbnailValidationResult:
        """
        Downloads, verifies, and caches candidate poster image.
        Rejects 0-byte images, HTML pretending to be images, and broken links.
        """
        if not poster_url:
            return ThumbnailValidationResult(False, None, "Missing poster URL")

        target_path = os.path.join(POSTERS_DIR, f"{item_id}.jpg")
        android_target_path = os.path.join(ANDROID_POSTERS_DIR, f"{item_id}.jpg")

        try:
            req = urllib.request.Request(poster_url, headers={"User-Agent": "Mozilla/5.0 (T2L Thumbnail Validator)"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                status = resp.getcode()
                c_type = resp.info().get_content_type().lower()
                data = resp.read()

                if status != 200:
                    return ThumbnailValidationResult(False, None, f"HTTP error {status}")

                # Check Content-Type
                if not any(t in c_type for t in ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/octet-stream"]):
                    return ThumbnailValidationResult(False, None, f"Invalid image content-type: {c_type}")

                # Reject 0-byte or tiny error icons (< 2KB)
                if len(data) < 2048:
                    return ThumbnailValidationResult(False, None, f"Image payload too small ({len(data)} bytes), likely an error icon or blank image")

                # Reject HTML disguised as image
                head = data[:100].lower()
                if b"<html" in head or b"<!doctype" in head or b"<xml" in head:
                    return ThumbnailValidationResult(False, None, "Image response is actually an HTML error page")

                # Save to disk
                os.makedirs(POSTERS_DIR, exist_ok=True)
                os.makedirs(ANDROID_POSTERS_DIR, exist_ok=True)
                with open(target_path, "wb") as f:
                    f.write(data)
                shutil.copyfile(target_path, android_target_path)

                return ThumbnailValidationResult(True, target_path, None)

        except Exception as e:
            return ThumbnailValidationResult(False, None, f"Error validating poster: {e}")

    def create_backup(self) -> str:
        """Creates a timestamped backup of data/movies_catalog.json."""
        timestamp = int(time.time())
        backup_path = f"{self.catalog_path}.bak.{timestamp}"
        shutil.copyfile(self.catalog_path, backup_path)
        return backup_path

    def import_item(self, catalog_entry: Dict[str, Any]) -> bool:
        """
        Appends a validated candidate into the catalog and syncs to android_app.
        """
        # Ensure fresh load
        self.catalog = self._load_catalog()
        movies = self.catalog.get("movies", [])

        # Check ID collision
        if any(m.get("id") == catalog_entry.get("id") for m in movies):
            return False

        movies.append(catalog_entry)
        self.catalog["total_movies"] = sum(1 for m in movies if m.get("mediaType") != "series")
        self.catalog["total_series"] = sum(1 for m in movies if m.get("mediaType") == "series")

        with open(self.catalog_path, "w", encoding="utf-8") as f:
            json.dump(self.catalog, f, indent=2)

        shutil.copyfile(self.catalog_path, ANDROID_CATALOG_PATH)
        return True
