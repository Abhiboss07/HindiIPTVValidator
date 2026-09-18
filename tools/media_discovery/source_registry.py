#!/usr/bin/env python3
"""
T2L Source Registry & Authorization Engine.
Enforces zero-trust allowlist verification for public media discovery.
Rejects unauthorized domains, open web scraping queries, and non-allowlisted sources.
"""

import os
import json
import urllib.parse
from typing import Dict, Any, List, Optional, Tuple

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "source_registry.json")


class SourceRegistry:
    def __init__(self, registry_file: str = REGISTRY_PATH):
        self.registry_file = registry_file
        with open(registry_file, "r", encoding="utf-8") as f:
            self.data = json.load(f)
        
        self.sources: List[Dict[str, Any]] = [s for s in self.data.get("sources", []) if s.get("allowed", False)]
        self.allowed_domains: set = {s.get("domain", "").lower() for s in self.sources if s.get("domain")}
        self.forbidden_domains: List[str] = [d.lower() for d in self.data.get("forbiddenDomains", [])]
        self.forbidden_operators: List[str] = [op.lower() for op in self.data.get("forbiddenQueryOperators", [])]

    def get_allowed_sources(self) -> List[Dict[str, Any]]:
        return list(self.sources)

    def validate_query_safety(self, query: str) -> Tuple[bool, Optional[str]]:
        """Verifies that search queries do not utilize unauthorized search operators or seek piracy."""
        q_lower = query.lower()
        for op in self.forbidden_operators:
            if op in q_lower:
                return False, f"Forbidden piracy search operator detected: {op}"
        
        for f in ["pirate", "crack", "torrent", "rip", "camrip", "hdrip", "leak"]:
            if f in q_lower:
                return False, f"Forbidden piracy keyword detected in discovery query: {f}"
        
        return True, None

    def is_url_authorized(self, url: str, collection: Optional[str] = None) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """
        Evaluates whether a media URL originates from an explicitly allowlisted repository.
        Returns:
            (is_authorized, reason, source_info)
        """
        if not url:
            return False, "Empty URL provided", None
        
        try:
            parsed = urllib.parse.urlparse(url)
            hostname = parsed.hostname.lower() if parsed.hostname else ""
        except Exception as e:
            return False, f"Malformed URL: {e}", None

        # 1. Check forbidden piracy / cyberlocker domains
        for fd in self.forbidden_domains:
            if fd in hostname or fd in url.lower():
                return False, f"URL belongs to forbidden or untrusted domain matching '{fd}'", None

        # 2. Check allowlisted domains
        matched_source = None
        for s in self.sources:
            domain = s.get("domain", "").lower()
            if hostname == domain or hostname.endswith("." + domain):
                matched_source = s
                break

        if not matched_source:
            return False, f"Domain '{hostname}' is not in the authorized media source allowlist", None

        # 3. Collection-level validation (e.g. for archive.org)
        allowed_colls = [c.lower() for c in matched_source.get("allowedCollections", [])]
        if allowed_colls and collection:
            if collection.lower() not in allowed_colls:
                return False, f"Collection '{collection}' is not in allowed collections for {matched_source['name']}", matched_source

        # 4. Check path restrictions for archive.org downloads
        if "archive.org" in hostname and parsed.path not in ("/", ""):
            # Valid archive.org URLs are https://archive.org/download/... or https://dn...ca.archive.org/...
            if "/download/" not in parsed.path and "/items/" not in parsed.path and "/metadata/" not in parsed.path and "/services/" not in parsed.path and not hostname.startswith("ia") and not ".archive.org" in hostname:
                return False, "Archive.org URL path is not an authorized media item path", matched_source

        return True, "Authorized", matched_source
