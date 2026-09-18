"""
Identity Validator Module for T2L Autonomous Stream Validator.
Cross-verifies media duration, metadata title, and URL filenames to prevent wrong content mapping.
"""

import re
import urllib.parse
from dataclasses import dataclass
from typing import Optional, List, Dict, Any

from .media_probe import MediaProbeResult


@dataclass
class IdentityValidationResult:
    status: str  # PASS, WRONG_CONTENT, WRONG_EPISODE, TRAILER_AS_MOVIE, IDENTITY_UNVERIFIED
    confidence: float  # 0.0 to 1.0
    detected_title: Optional[str] = None
    detected_duration_s: float = 0.0
    notes: str = ''


def _normalize(text: str) -> str:
    return re.sub(r'[^a-z0-9]', '', text.lower())


class IdentityValidator:
    """Ensures that stream sources accurately correspond to their catalog titles."""

    def validate_movie_identity(self, catalog_title: str, claimed_duration_s: int, probe_res: MediaProbeResult, stream_url: str) -> IdentityValidationResult:
        if not probe_res.is_playable:
            return IdentityValidationResult(
                status='UNPLAYABLE',
                confidence=0.0,
                notes='Source media could not be probed.'
            )

        duration = probe_res.duration_s
        # 1. Check for Trailer / Clip masquerading as a full movie
        # Full movies are virtually always > 45 minutes (2700s). Trailers/clips are usually < 300s.
        if duration > 0 and duration < 400 and (claimed_duration_s == 0 or claimed_duration_s > 1800):
            return IdentityValidationResult(
                status='TRAILER_AS_MOVIE',
                confidence=0.95,
                detected_duration_s=duration,
                notes=f'Duration is only {int(duration)}s (< 6.6m). Full movie expected (~{claimed_duration_s or 5400}s).'
            )

        # 2. Extract title clues from URL and format metadata tags
        parsed = urllib.parse.urlparse(stream_url)
        path = urllib.parse.unquote(parsed.path).lower()
        tag_title = (probe_res.metadata_tags.get('title') or '').lower()

        clean_cat = _normalize(catalog_title)

        # Check if URL or metadata strongly matches catalog title
        if clean_cat in _normalize(path) or (tag_title and clean_cat in _normalize(tag_title)):
            return IdentityValidationResult(
                status='PASS',
                confidence=0.95,
                detected_title=catalog_title,
                detected_duration_s=duration,
                notes='Filename/metadata matches catalog title.'
            )

        # 3. Known cross-content conflict detection
        # e.g., if catalog title is "Interstellar", but path has "oppenheimer"
        conflict_tokens = {
            'interstellar': ['oppenheimer', 'jawan', 'avatar', 'alien'],
            'pathaan': ['jawan', 'tiger', 'dangal'],
            'gladiator': ['alien', 'romulus', 'furiosa'],
            'dark knight': ['the batman', 'batman 2022'],
            'pushpa': ['kgf', 'salaar'],
            'game of thrones': ['avatar', 'dune', 'alien'],
            'stranger things': ['alien', 'dune', 'avatar']
        }

        cat_lower = catalog_title.lower()
        for key, bad_tokens in conflict_tokens.items():
            if key in cat_lower:
                for bad in bad_tokens:
                    if bad in path or bad in tag_title:
                        return IdentityValidationResult(
                            status='WRONG_CONTENT',
                            confidence=0.98,
                            detected_title=bad.title(),
                            detected_duration_s=duration,
                            notes=f'Conflict detected: Assigned to "{catalog_title}", but source references "{bad}".'
                        )

        # 4. If duration matches (> 45 min) but no strong title clue exists in URL
        if duration >= 2400:
            return IdentityValidationResult(
                status='IDENTITY_UNVERIFIED',
                confidence=0.5,
                detected_duration_s=duration,
                notes=f'Duration ({int(duration//60)}m) matches full movie, but filename lacks title verification tags.'
            )

        return IdentityValidationResult(
            status='IDENTITY_UNVERIFIED',
            confidence=0.4,
            detected_duration_s=duration,
            notes='Could not deterministically verify media identity.'
        )

    def validate_episode_identity(self, series_title: str, season_num: int, ep_num: int, ep_title: str, probe_res: MediaProbeResult, stream_url: str) -> IdentityValidationResult:
        if not probe_res.is_playable:
            return IdentityValidationResult(status='UNPLAYABLE', confidence=0.0, notes='Source could not be probed.')

        duration = probe_res.duration_s
        parsed = urllib.parse.urlparse(stream_url)
        path = urllib.parse.unquote(parsed.path).lower()

        # Check for wrong episode number in URL
        # e.g. looking for S01E01, but path has s01e04 or ep04 or episode4
        expected_ep_token = f'e{ep_num:02d}'
        expected_alt_token = f'ep{ep_num:02d}'
        expected_sp_token = f'episode {ep_num}'

        # Look for other episode numbers
        other_ep_match = re.search(r's(\d+)e(\d+)', path)
        if other_ep_match:
            found_s = int(other_ep_match.group(1))
            found_e = int(other_ep_match.group(2))
            if found_s != season_num or found_e != ep_num:
                return IdentityValidationResult(
                    status='WRONG_EPISODE',
                    confidence=0.98,
                    detected_title=f'S{found_s:02d}E{found_e:02d}',
                    detected_duration_s=duration,
                    notes=f'Episode mismatch: expected S{season_num:02d}E{ep_num:02d}, but source path specifies S{found_s:02d}E{found_e:02d}.'
                )

        # Check if promo clip masquerading as episode (< 180s)
        if 0 < duration < 180:
            return IdentityValidationResult(
                status='TRAILER_AS_EPISODE',
                confidence=0.90,
                detected_duration_s=duration,
                notes=f'Duration is only {int(duration)}s (< 3m), indicating a promo/trailer instead of a full episode.'
            )

        clean_ser = _normalize(series_title)
        if clean_ser in _normalize(path) or expected_ep_token in path or expected_alt_token in path or expected_sp_token in path:
            return IdentityValidationResult(
                status='PASS',
                confidence=0.90,
                detected_duration_s=duration,
                notes='Filename matches series and episode numbering.'
            )

        return IdentityValidationResult(
            status='IDENTITY_UNVERIFIED',
            confidence=0.5,
            detected_duration_s=duration,
            notes='Episode source is playable but lacks explicit episode numbering tags.'
        )
