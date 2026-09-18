#!/usr/bin/env python3
"""
T2L Metadata Matcher & Identity Validator.
Cleans titles, parses years, detects content/filename mismatches, and prevents mistaken identities.
"""

import re
from dataclasses import dataclass
from typing import Optional, Dict, Any, Tuple


@dataclass
class NormalizedIdentity:
    clean_title: str
    year: Optional[int]
    is_valid_identity: bool
    mismatch_reason: Optional[str] = None


class MetadataMatcher:
    STRIP_PATTERNS = [
        re.compile(r"\(?\b(19\d\d|20\d\d)\b\)?"),
        re.compile(r"\b(1080p|720p|480p|360p|2160p|4k|uhd|fhd|hd|sd)\b", re.IGNORECASE),
        re.compile(r"\b(x264|x265|hevc|h264|h265|aac|ac3|dvdrip|bluray|web-dl|webrip)\b", re.IGNORECASE),
        re.compile(r"\b(hindi|english|telugu|tamil|malayalam|korean|japanese)\b", re.IGNORECASE),
        re.compile(r"\b(full movie|movie|film|complete|remastered|restored)\b", re.IGNORECASE),
        re.compile(r"\[.*?\]|\(.*?\)")
    ]

    def normalize(self, raw_title: str, raw_year: Optional[int] = None, filename: str = "") -> NormalizedIdentity:
        title = raw_title or ""
        detected_year = raw_year

        # 1. Try to extract year from title or filename if not provided
        if not detected_year:
            year_match = re.search(r"\b(19\d\d|20\d\d)\b", title + " " + filename)
            if year_match:
                try:
                    detected_year = int(year_match.group(1))
                except Exception:
                    pass

        # 2. Clean title of junk/codec tags
        clean = title
        for pat in self.STRIP_PATTERNS:
            clean = pat.sub(" ", clean)
        
        # Clean underscores, dots, multiple spaces
        clean = re.sub(r"[\._\-]", " ", clean)
        clean = re.sub(r"\s+", " ", clean).strip().title()

        if not clean:
            return NormalizedIdentity(
                clean_title=raw_title,
                year=detected_year,
                is_valid_identity=False,
                mismatch_reason="Title could not be resolved to a recognizable name"
            )

        # 3. Filename vs Title Consistency Check
        if filename:
            fn_clean = os_clean_name = re.sub(r"[\._\-]", " ", filename).lower()
            # If filename clearly mentions a completely different major franchise
            known_discrepancies = [
                ("gladiator", "cordkillers"),
                ("iron man", "dark knight"),
                ("spider-man", "superman"),
                ("batman", "superman")
            ]
            for title_sub, fn_sub in known_discrepancies:
                if title_sub in clean.lower() and fn_sub in fn_clean:
                    return NormalizedIdentity(
                        clean_title=clean,
                        year=detected_year,
                        is_valid_identity=False,
                        mismatch_reason=f"Identity Mismatch: Title '{clean}' conflicts with media filename '{filename}'"
                    )

        return NormalizedIdentity(
            clean_title=clean,
            year=detected_year,
            is_valid_identity=True
        )
