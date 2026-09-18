#!/usr/bin/env python3
"""
T2L Safe Public Media Index Discovery Engine.
Interacts with allowlisted repositories via official APIs and browsable directory listings.
Strictly excludes open-web Google scraping queries and untrusted pirate directories.
"""

import os
import re
import json
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional, Tuple

from .source_registry import SourceRegistry


@dataclass
class DiscoveredCandidate:
    id: str
    title: str
    year: Optional[int]
    source_id: str
    source_url: str
    collection: str
    poster_url: Optional[str]
    metadata: Dict[str, Any]
    file_size: int
    format: str
    duration_s: float = 0.0


class IndexDiscovery:
    SUPPORTED_EXTENSIONS = [".mp4", ".webm", ".m3u8"]

    def __init__(self, registry: Optional[SourceRegistry] = None):
        self.registry = registry or SourceRegistry()

    def discover_archive_org(
        self,
        collection: str = "feature_films",
        query_filter: str = "mediatype:movies",
        max_items: int = 20,
        min_size_bytes: int = 150_000_000
    ) -> List[DiscoveredCandidate]:
        """
        Discovers media files strictly within an allowed collection on Archive.org.
        Uses official Archive.org Advanced Search API and Metadata API.
        """
        # Validate collection is in allowlist
        is_auth, reason, source_info = self.registry.is_url_authorized("https://archive.org/", collection)
        if not is_auth:
            print(f"⚠️ Collection '{collection}' not authorized on archive.org: {reason}")
            return []

        # Validate query safety
        safe, q_err = self.registry.validate_query_safety(query_filter)
        if not safe:
            print(f"⚠️ Query rejected by safety policy: {q_err}")
            return []

        params = {
            "q": f"collection:({collection}) AND {query_filter}",
            "fl[]": "identifier,title,year,downloads,licenseurl,rights,description,collection",
            "sort[]": "downloads desc",
            "rows": str(max_items),
            "output": "json"
        }
        search_url = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode(params)

        candidates: List[DiscoveredCandidate] = []
        try:
            req = urllib.request.Request(search_url, headers={"User-Agent": "Mozilla/5.0 (T2L Safe Discovery Engine)"})
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8", errors="ignore"))
                docs = data.get("response", {}).get("docs", [])
        except Exception as e:
            print(f"⚠️ Error querying Archive.org API: {e}")
            return []

        for doc in docs:
            ident = doc.get("identifier")
            if not ident:
                continue

            # Fetch file list from Metadata API
            meta_url = f"https://archive.org/metadata/{ident}/files"
            try:
                m_req = urllib.request.Request(meta_url, headers={"User-Agent": "Mozilla/5.0 (T2L Safe Discovery Engine)"})
                with urllib.request.urlopen(m_req, timeout=8) as m_resp:
                    m_data = json.loads(m_resp.read().decode("utf-8", errors="ignore"))
                    files = m_data.get("result", [])
            except Exception:
                continue

            # Find matching video files
            valid_videos = []
            for f in files:
                fn = f.get("name", "")
                f_ext = os.path.splitext(fn)[1].lower()
                f_size = int(float(f.get("size", 0) or 0))
                
                # Check extension and min size
                if f_ext in self.SUPPORTED_EXTENSIONS and f_size >= min_size_bytes:
                    # Prefer high quality MP4s that are not sample/preview
                    valid_videos.append((fn, f_size, f_ext))

            if not valid_videos:
                continue

            # Sort by file size descending to pick the highest quality feature rip
            valid_videos.sort(key=lambda x: x[1], reverse=True)
            best_fn, best_size, best_ext = valid_videos[0]

            encoded_fn = urllib.parse.quote(best_fn)
            stream_url = f"https://archive.org/download/{ident}/{encoded_fn}"
            poster_url = f"https://archive.org/services/img/{ident}"

            title = doc.get("title") or ident.replace("_", " ")
            year = None
            if doc.get("year"):
                try:
                    year = int(str(doc.get("year")).strip()[:4])
                except Exception:
                    pass

            candidates.append(DiscoveredCandidate(
                id=f"disc_{ident}",
                title=title,
                year=year,
                source_id="archive_org_feature_films",
                source_url=stream_url,
                collection=collection,
                poster_url=poster_url,
                metadata=doc,
                file_size=best_size,
                format=best_ext.replace(".", "").upper()
            ))

        return candidates

    def parse_directory_index(
        self,
        base_url: str,
        html_content: str,
        source_id: str
    ) -> List[DiscoveredCandidate]:
        """
        Parses standard apache/nginx 'Index of /' HTML directory listings.
        Strictly restricted to explicitly allowlisted base URLs.
        """
        is_auth, reason, _ = self.registry.is_url_authorized(base_url)
        if not is_auth:
            print(f"⚠️ Directory index parsing rejected: {reason}")
            return []

        # Find all <a href="..."> links
        links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html_content, re.IGNORECASE)
        candidates = []

        media_links = [l for l in links if any(l.lower().endswith(ext) for ext in self.SUPPORTED_EXTENSIONS)]
        poster_link = next((l for l in links if any(l.lower().endswith(img) for img in [".jpg", ".png", ".webp"])), None)

        for ml in media_links:
            stream_url = urllib.parse.urljoin(base_url, ml)
            raw_name = os.path.splitext(os.path.basename(ml))[0]
            title = re.sub(r"[\._\-]", " ", raw_name).title()

            poster_url = urllib.parse.urljoin(base_url, poster_link) if poster_link else None

            candidates.append(DiscoveredCandidate(
                id=f"disc_{raw_name}",
                title=title,
                year=None,
                source_id=source_id,
                source_url=stream_url,
                collection="directory_index",
                poster_url=poster_url,
                metadata={"filename": ml},
                file_size=0,
                format=os.path.splitext(ml)[1].replace(".", "").upper()
            ))

        return candidates
