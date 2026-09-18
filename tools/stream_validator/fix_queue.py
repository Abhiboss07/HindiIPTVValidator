"""
Fix Queue Generator Module for T2L Autonomous Stream Validator.
Generates an actionable, prioritized ANTIGRAVITY_FIX_QUEUE.md markdown queue.
"""

import os
import time
from dataclasses import dataclass
from typing import List, Dict, Any, Optional

from .report_generator import ValidationItemReport


class FixQueueGenerator:
    """Creates a prioritized, actionable fix queue for Antigravity."""

    def __init__(self, repo_root: str):
        self.repo_root = os.path.abspath(repo_root)
        self.output_path = os.path.join(self.repo_root, 'reports', 'ANTIGRAVITY_FIX_QUEUE.md')

    def generate_queue(self, items: List[ValidationItemReport]) -> str:
        ts = time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())

        # Group items by priority
        p0_wrong_content = []
        p0_broken_movies = []
        p0_trailers_missing_movie = []
        p0_wrong_episodes = []
        p1_broken_episodes = []
        p1_quality_mismatch = []
        p1_sub_1080p_movies = []
        p1_audio_failures = []
        p2_broken_trailers = []
        p2_broken_posters = []

        for item in items:
            f_reason = (item.failure_reason or '').upper()
            id_status = (item.identity_status or '').upper()

            # P0: Wrong Content / Trailer as Movie / Trailer Present W/O Movie Stream
            if 'WRONG_CONTENT' in id_status or 'TRAILER_AS_MOVIE' in id_status:
                p0_wrong_content.append(item)
            elif 'TRAILER_PRESENT_WITHOUT_MOVIE_STREAM' in f_reason:
                p0_trailers_missing_movie.append(item)
            elif 'WRONG_EPISODE' in id_status:
                p0_wrong_episodes.append(item)
            elif item.category == 'MOVIE' and item.status == 'FAIL':
                p0_broken_movies.append(item)
            elif item.category == 'EPISODE' and item.status == 'FAIL':
                p1_broken_episodes.append(item)
            elif 'QUALITY_MISMATCH' in f_reason or (item.claimed_resolution and item.probed_resolution and '4K' in item.claimed_resolution and '4K' not in item.probed_resolution):
                p1_quality_mismatch.append(item)
            elif item.category == 'MOVIE' and item.resolution_tier == '<1080p' and item.status == 'PASS':
                p1_sub_1080p_movies.append(item)
            elif 'NO_AUDIO' in f_reason:
                p1_audio_failures.append(item)
            elif item.category == 'TRAILER' and item.status == 'FAIL':
                p2_broken_trailers.append(item)
            elif item.poster_status and item.poster_status != 'PASS':
                p2_broken_posters.append(item)

        lines = []
        lines.append('# T2L Stream & Source Fix Queue (Antigravity Remediation)')
        lines.append(f'**Generated:** `{ts}` | **Action Priority:** `P0 (Critical) > P1 (High) > P2 (Normal)`')
        lines.append('')
        lines.append('> [!NOTE]')
        lines.append('> This queue contains ONLY actionable discrepancies detected during independent verification.')
        lines.append('> Remediations must use authorized, legitimate studio releases or public-domain sources.')
        lines.append('')

        total_issues = (
            len(p0_wrong_content) + len(p0_broken_movies) + len(p0_trailers_missing_movie) + len(p0_wrong_episodes) +
            len(p1_broken_episodes) + len(p1_quality_mismatch) + len(p1_sub_1080p_movies) + len(p1_audio_failures) +
            len(p2_broken_trailers) + len(p2_broken_posters)
        )
        lines.append(f'### 🎯 Queue Summary: **{total_issues} Actionable Issues**')
        lines.append(f'- **P0 — Critical (Wrong Content / Broken Movies / Trailer W/O Movie / Wrong Episodes):** `{len(p0_wrong_content) + len(p0_broken_movies) + len(p0_trailers_missing_movie) + len(p0_wrong_episodes)}`')
        lines.append(f'- **P1 — High (Broken Episodes / Sub-1080p Resolution / Quality Mismatches):** `{len(p1_broken_episodes) + len(p1_quality_mismatch) + len(p1_sub_1080p_movies) + len(p1_audio_failures)}`')
        lines.append(f'- **P2 — Normal (Broken Trailers / Missing Posters):** `{len(p2_broken_trailers) + len(p2_broken_posters)}`')
        lines.append('')
        lines.append('---')
        lines.append('')

        # 1. P0 Wrong Content
        if p0_wrong_content:
            lines.append('## 🚨 P0 — WRONG CONTENT / TRAILER MAPPED AS FULL MOVIE')
            for it in p0_wrong_content:
                lines.append(f'### Movie: {it.title} (`{it.id}`)')
                lines.append(f'- **Catalog Source URL:** `{it.stream_url}`')
                lines.append(f'- **Observed Discrepancy:** `{it.identity_status}` — {it.failure_reason}')
                lines.append(f'- **Required Action:** Decouple invalid source from `{it.title}`. If full movie is unavailable from authorized source, mark `sourceState: \"TRAILER_ONLY\"` or `\"TORRENT_SOURCE_AVAILABLE\"`. Do NOT leave a mismatched video file.')
                lines.append('- **Validation Criteria:** Media duration and title tags must match the catalog title.')
                lines.append('')

        # 2. P0 Broken Movies
        if p0_broken_movies:
            lines.append('## 🚨 P0 — BROKEN MOVIE STREAMS (HTTP 404 / 403 / HTML / UNPLAYABLE)')
            for it in p0_broken_movies:
                lines.append(f'### Movie: {it.title} (`{it.id}`)')
                lines.append(f'- **Configured Stream URL:** `{it.stream_url}`')
                lines.append(f'- **Observed HTTP / Probe Failure:** `{it.failure_reason}` (HTTP {it.http_status})')
                lines.append('- **Required Action:** Replace with working authorized cinema stream or fallback to trailer.')
                lines.append('- **Validation Criteria:** URL returns video container with valid video/audio streams via `ffprobe`.')
                lines.append('')

        # 3. P0 Trailer Present Without Movie Stream
        if p0_trailers_missing_movie:
            lines.append('## 🚨 P0 — TRAILER PRESENT WITHOUT FULL MOVIE STREAM')
            for it in p0_trailers_missing_movie:
                lines.append(f'### Movie: {it.title} (`{it.id}`)')
                lines.append(f'- **Trailer Status:** Official trailer is configured and active.')
                lines.append(f'- **Discrepancy:** `{it.failure_reason}`')
                lines.append('- **Required Action:** Sourcing/binding full playable movie stream to fulfill the strict trailer-movie pairing rule.')
                lines.append('- **Validation Criteria:** Playable video stream with full duration (> 4000s) must be linked.')
                lines.append('')

        # 4. P0 Wrong Episodes
        if p0_wrong_episodes:
            lines.append('## 🚨 P0 — WRONG EPISODE MAPPING')
            for it in p0_wrong_episodes:
                lines.append(f'### Episode: {it.parent_title} — {it.title} (`{it.id}`)')
                lines.append(f'- **Configured Stream URL:** `{it.stream_url}`')
                lines.append(f'- **Observed Mismatch:** `{it.identity_status}` — {it.failure_reason}')
                lines.append('- **Required Action:** Re-align episode stream URL to match the exact season and episode number.')
                lines.append('- **Validation Criteria:** Episode path and runtime align with episode numbering.')
                lines.append('')

        # 4. P1 Quality Mismatches
        if p1_quality_mismatch:
            lines.append('## ⚠️ P1 — METADATA QUALITY MISMATCHES')
            for it in p1_quality_mismatch:
                lines.append(f'### Title: {it.title} (`{it.id}`)')
                lines.append(f'- **Claimed in Metadata:** `{it.claimed_resolution}`')
                lines.append(f'- **Actual Probed Quality:** `{it.probed_resolution}`')
                lines.append(f'- **Required Action:** Update catalog `resolution` field to accurately match the probed resolution (`{it.probed_resolution}`). Never fabricate 4K or 1080p labels.')
                lines.append('- **Validation Criteria:** Probed video height/width corresponds to metadata label.')
                lines.append('')

        # 5. P1 Sub-1080p Resolution Upgrades
        if p1_sub_1080p_movies:
            lines.append('## ⚠️ P1 — RESOLUTION UPGRADE REQUIRED (< 1080p)')
            for it in p1_sub_1080p_movies:
                lines.append(f'### Movie: {it.title} (`{it.id}`)')
                lines.append(f'- **Current Probed Resolution:** `{it.probed_resolution}` (Target: min 1080p up to 4K)')
                lines.append(f'- **Stream URL:** `{it.stream_url}`')
                lines.append('- **Required Action:** Search Archive.org / studio CDN for 1080p Full HD / 4K UHD release or adaptive HLS stream.')
                lines.append('')

        # 6. P1 Broken Episodes
        if p1_broken_episodes:
            lines.append('## ⚠️ P1 — BROKEN WEB SERIES EPISODES')
            for it in p1_broken_episodes[:25]:
                lines.append(f'### Episode: {it.parent_title} — {it.title} (`{it.id}`)')
                lines.append(f'- **Stream URL:** `{it.stream_url}`')
                lines.append(f'- **Failure Reason:** `{it.failure_reason}`')
                lines.append('')
            if len(p1_broken_episodes) > 25:
                lines.append(f'*... and {len(p1_broken_episodes) - 25} more broken episodes.*')
                lines.append('')

        # 6. P2 Broken Trailers
        if p2_broken_trailers:
            lines.append('## 📹 P2 — BROKEN OFFICIAL TRAILERS')
            for it in p2_broken_trailers:
                lines.append(f'### Title: {it.parent_title} (`{it.id}`)')
                lines.append(f'- **Trailer URL:** `{it.stream_url}`')
                lines.append(f'- **Observed Failure:** `{it.failure_reason}`')
                lines.append('- **Required Action:** Replace deleted/private video ID with verified active studio trailer.')
                lines.append('')

        # 7. P2 Broken Posters
        if p2_broken_posters:
            lines.append('## 🖼️ P2 — BROKEN OR MISSING POSTERS')
            for it in p2_broken_posters:
                lines.append(f'### Title: {it.title} (`{it.id}`)')
                lines.append(f'- **Poster Status:** `{it.poster_status}`')
                lines.append('- **Required Action:** Download genuine TMDB poster and place in `assets/posters/`.')
                lines.append('')

        if total_issues == 0:
            lines.append('## 🎉 ZERO ACTIONABLE ISSUES DETECTED!')
            lines.append('All discovered media streams, series episodes, trailers, and posters are in 100% verified health.')
            lines.append('')

        content = '\n'.join(lines)
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        with open(self.output_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return self.output_path
