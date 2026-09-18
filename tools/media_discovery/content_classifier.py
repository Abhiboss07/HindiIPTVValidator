#!/usr/bin/env python3
"""
T2L Content Classifier & Anti-Trailer Engine.
Accurately categorizes media into MOVIE, SHORT_FILM, DOCUMENTARY, TV_EPISODE, SERIES, TRAILER, CLIP.
Strictly prevents trailers, promos, podcasts, and clips from masquerading as full movies.
"""

import re
from dataclasses import dataclass
from typing import Dict, Any, Optional, List


@dataclass
class ContentClassificationResult:
    content_type: str  # MOVIE, SHORT_FILM, DOCUMENTARY, TV_EPISODE, SERIES, TRAILER, CLIP, UNKNOWN
    is_feature_length: bool
    is_trailer_or_clip: bool
    confidence: float
    evidence: List[str]


class ContentClassifier:
    PROMO_TOKENS = [
        "trailer", "official trailer", "teaser", "promo", "preview", "featurette",
        "behind the scenes", "clip", "interview", "review", "reaction", "podcast",
        "tinker talk", "cordkillers", "bloopers", "making of", "deleted scene", "sneak peek"
    ]
    
    EPISODE_PATTERNS = [
        re.compile(r"[sS](\d+)[eE](\d+)", re.IGNORECASE),
        re.compile(r"season\s*(\d+)\s*episode\s*(\d+)", re.IGNORECASE),
        re.compile(r"ep(?:isode)?\s*(\d+)", re.IGNORECASE),
        re.compile(r"part\s*(\d+)", re.IGNORECASE)
    ]
    
    DOC_KEYWORDS = [
        "documentary", "educational", "lecture", "instructional", "historical document",
        "newsreel", "propaganda"
    ]

    def classify(
        self,
        title: str,
        filename: str,
        duration_s: float,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ContentClassificationResult:
        meta = metadata or {}
        evidence = []
        full_text = f"{title} {filename} {meta.get('description', '')} {meta.get('subject', '')}".lower()

        # 0. Exploitation / Adult Content Filtering
        EXPLICIT_TOKENS = ["sex madness", "dr. sex", "erotic", "nsfw", "pornography", "porn", "nudist", "nude"]
        for et in EXPLICIT_TOKENS:
            if et in full_text:
                evidence.append(f"Contains adult/exploitation token: '{et}'")
                return ContentClassificationResult(
                    content_type="EXPLICIT",
                    is_feature_length=False,
                    is_trailer_or_clip=True,
                    confidence=0.99,
                    evidence=evidence
                )

        # 1. Trailer / Promo / Podcast Check (Highest Priority Protection)
        is_promo = False
        matched_token = None
        for tok in self.PROMO_TOKENS:
            if tok in full_text:
                is_promo = True
                matched_token = tok
                break

        if is_promo:
            evidence.append(f"Contains promotional/clip token: '{matched_token}'")
            # If duration is small or token is explicitly trailer/teaser
            if any(t in full_text for t in ["trailer", "teaser", "promo", "preview"]):
                return ContentClassificationResult(
                    content_type="TRAILER",
                    is_feature_length=False,
                    is_trailer_or_clip=True,
                    confidence=0.95,
                    evidence=evidence
                )
            else:
                return ContentClassificationResult(
                    content_type="CLIP",
                    is_feature_length=False,
                    is_trailer_or_clip=True,
                    confidence=0.90,
                    evidence=evidence
                )

        # 2. Episode Pattern Detection
        is_ep = False
        for pat in self.EPISODE_PATTERNS:
            if pat.search(title) or pat.search(filename):
                is_ep = True
                evidence.append(f"Matches episode numbering pattern: {pat.pattern}")
                break

        if is_ep or "classic_tv" in str(meta.get("collection", "")).lower():
            if duration_s > 0 and duration_s < 4500:  # Episodes are generally < 75 min
                return ContentClassificationResult(
                    content_type="TV_EPISODE",
                    is_feature_length=False,
                    is_trailer_or_clip=False,
                    confidence=0.88,
                    evidence=evidence
                )

        # 3. Documentary Check
        for dk in self.DOC_KEYWORDS:
            if dk in full_text:
                evidence.append(f"Matches documentary keyword: '{dk}'")
                return ContentClassificationResult(
                    content_type="DOCUMENTARY",
                    is_feature_length=(duration_s >= 2400),
                    is_trailer_or_clip=False,
                    confidence=0.85,
                    evidence=evidence
                )

        # 4. Short Film vs Full Feature by Duration
        if duration_s > 0:
            if duration_s < 300:  # Under 5 min
                evidence.append(f"Duration is very short: {int(duration_s)}s (< 5m)")
                return ContentClassificationResult(
                    content_type="CLIP",
                    is_feature_length=False,
                    is_trailer_or_clip=True,
                    confidence=0.80,
                    evidence=evidence
                )
            elif duration_s < 2400:  # 5 to 40 min
                evidence.append(f"Duration is short-form: {int(duration_s)}s (< 40m)")
                return ContentClassificationResult(
                    content_type="SHORT_FILM",
                    is_feature_length=False,
                    is_trailer_or_clip=False,
                    confidence=0.85,
                    evidence=evidence
                )
            else:  # >= 40 min (2400s)
                evidence.append(f"Duration indicates full feature: {int(duration_s)}s (>= 40m)")
                return ContentClassificationResult(
                    content_type="MOVIE",
                    is_feature_length=True,
                    is_trailer_or_clip=False,
                    confidence=0.95,
                    evidence=evidence
                )

        # 5. Fallback if duration is unknown
        if "feature_films" in str(meta.get("collection", "")).lower():
            evidence.append("Item belongs to feature_films collection (duration unprobed)")
            return ContentClassificationResult(
                content_type="MOVIE",
                is_feature_length=True,
                is_trailer_or_clip=False,
                confidence=0.70,
                evidence=evidence
            )

        return ContentClassificationResult(
            content_type="UNKNOWN",
            is_feature_length=False,
            is_trailer_or_clip=False,
            confidence=0.50,
            evidence=["Insufficient duration or metadata evidence to classify definitively"]
        )
