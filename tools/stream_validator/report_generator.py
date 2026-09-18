"""
Report Generator Module for T2L Autonomous Stream Validator.
Produces Movie-First Markdown, JSON, and CSV validation reports and computes regression deltas.
"""

import os
import json
import csv
import time
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional


@dataclass
class ValidationItemReport:
    category: str  # MOVIE, EPISODE, TRAILER, LIVE_TV
    id: str
    title: str
    parent_title: Optional[str] = None
    stream_url: Optional[str] = None
    source_state: str = ''
    http_status: int = 0
    content_type: str = ''
    claimed_resolution: str = ''
    probed_resolution: str = ''
    claimed_audio: str = ''
    probed_audio: str = ''
    probed_duration_s: float = 0.0
    status: str = 'UNKNOWN'  # PASS, FAIL, BLOCKED, UNVERIFIED, TRAILER_ONLY
    failure_reason: Optional[str] = None
    identity_status: Optional[str] = None
    poster_status: Optional[str] = None
    resolution_tier: str = ''  # 4K UHD, 1080p Full HD, <1080p


@dataclass
class SummaryMetrics:
    total_movies: int = 0
    movies_passed: int = 0
    movies_failed: int = 0
    movies_trailer_only: int = 0
    movies_no_source: int = 0
    movies_quality_mismatch: int = 0
    movies_identity_unverified: int = 0
    trailer_without_movie_count: int = 0
    movies_4k_count: int = 0
    movies_1080p_count: int = 0
    movies_below_1080p: int = 0

    total_series: int = 0
    total_episodes: int = 0
    episodes_passed: int = 0
    episodes_failed: int = 0
    episodes_no_stream: int = 0
    episodes_wrong_mapping: int = 0

    total_trailers: int = 0
    trailers_passed: int = 0
    trailers_failed: int = 0

    total_channels: int = 0
    channels_passed: int = 0
    channels_failed: int = 0

    total_posters: int = 0
    posters_passed: int = 0
    posters_failed: int = 0

    pass_rate_pct: float = 0.0
    failure_rate_pct: float = 0.0
    timestamp: str = ''


class ReportGenerator:
    """Generates comprehensive validation reports in Markdown, JSON, and CSV."""

    def __init__(self, repo_root: str):
        self.repo_root = os.path.abspath(repo_root)
        self.reports_dir = os.path.join(self.repo_root, 'reports')
        self.history_dir = os.path.join(self.reports_dir, 'history')
        os.makedirs(self.history_dir, exist_ok=True)

    def generate_reports(self, items: List[ValidationItemReport], metrics: SummaryMetrics) -> Dict[str, str]:
        ts = time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
        file_ts = time.strftime('%Y%m%d_%H%M%S', time.gmtime())
        metrics.timestamp = ts

        # 1. JSON Report
        json_path = os.path.join(self.reports_dir, 'stream_validation_report.json')
        history_json_path = os.path.join(self.history_dir, f'report_{file_ts}.json')
        report_data = {
            'metrics': asdict(metrics),
            'items': [asdict(i) for i in items]
        }
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2)
        with open(history_json_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2)

        # 2. CSV Report
        csv_path = os.path.join(self.reports_dir, 'stream_validation_report.csv')
        with open(csv_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Category', 'ID', 'Title', 'Parent_Title', 'Stream_URL',
                'HTTP_Status', 'Content_Type', 'Claimed_Res', 'Probed_Res',
                'Status', 'Failure_Reason', 'Identity_Status', 'Poster_Status'
            ])
            for i in items:
                writer.writerow([
                    i.category, i.id, i.title, i.parent_title or '', i.stream_url or '',
                    i.http_status, i.content_type, i.claimed_resolution, i.probed_resolution,
                    i.status, i.failure_reason or '', i.identity_status or '', i.poster_status or ''
                ])

        # 3. Markdown Report (Movie-First)
        md_path = os.path.join(self.reports_dir, 'stream_validation_report.md')
        regression_info = self._calculate_regression(report_data)
        md_content = self._build_markdown_report(items, metrics, regression_info)
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        return {
            'json': json_path,
            'csv': csv_path,
            'markdown': md_path
        }

    def _build_markdown_report(self, items: List[ValidationItemReport], m: SummaryMetrics, regression_info: Dict[str, Any]) -> str:
        lines = []
        lines.append('# T2L Autonomous Stream & Movie Source Validation Report')
        lines.append(f'**Generated:** `{m.timestamp}` | **Engine Version:** `1.0.0`')
        lines.append('')
        lines.append('---')
        lines.append('')
        lines.append('## Executive Summary & Source Health Overview')
        lines.append('')
        lines.append('| Media Category | Total Discovered | PASS (Playable) | FAIL (Broken) | TRAILER_ONLY | NO_SOURCE | Quality Mismatches |')
        lines.append('| :--- | :---: | :---: | :---: | :---: | :---: | :---: |')
        lines.append(f'| 🎬 **Movies (Priority 1)** | **{m.total_movies}** | **{m.movies_passed}** | **{m.movies_failed}** | **{m.movies_trailer_only}** | {m.movies_no_source} | {m.movies_quality_mismatch} |')
        lines.append(f'| 📺 **Series & Episodes (Priority 2)** | {m.total_series} series ({m.total_episodes} eps) | **{m.episodes_passed}** eps | **{m.episodes_failed}** eps | - | {m.episodes_no_stream} | {m.episodes_wrong_mapping} wrong |')
        lines.append(f'| 📹 **Trailers (Priority 3)** | **{m.total_trailers}** | **{m.trailers_passed}** | **{m.trailers_failed}** | - | - | - |')
        lines.append(f'| 📡 **Live TV & Radio** | **{m.total_channels}** | **{m.channels_passed}** | **{m.channels_failed}** | - | - | - |')
        lines.append(f'| 🖼️ **Posters / Thumbnails** | **{m.total_posters}** | **{m.posters_passed}** | **{m.posters_failed}** | - | - | - |')
        lines.append('')
        lines.append('### 🌟 Movie Resolution Standard (Min 1080p up to 4K)')
        lines.append(f'- **4K UHD (2160p):** `{m.movies_4k_count}`')
        lines.append(f'- **1080p (Full HD):** `{m.movies_1080p_count}`')
        lines.append(f'- **Sub-1080p (<1080p):** `{m.movies_below_1080p}`')
        lines.append(f'- **Trailer-to-Movie Enforcement:** `{m.trailer_without_movie_count} missing movie streams for trailer entries` (Rule: If trailer is present, movie must be present)')
        lines.append('')

        # Regression section
        if regression_info.get('has_history'):
            lines.append('### 📊 Regression Tracking vs Previous Run')
            lines.append(f'- **Previous Run Timestamp:** `{regression_info.get("prev_ts")}`')
            lines.append(f'- **Fixed Sources:** `+{regression_info.get("fixed_count", 0)}`')
            lines.append(f'- **New Failures:** `{regression_info.get("new_failures_count", 0)}`')
            lines.append(f'- **Playable Movies Delta:** `{regression_info.get("movie_delta", 0):+d}`')
            lines.append('')

        lines.append('---')
        lines.append('')
        lines.append('## 1. Movies (Priority 1 Audit)')
        lines.append('')
        lines.append('> [!IMPORTANT]')
        lines.append('> Trailers are strictly classified as `TRAILER_ONLY` and **never** reported as a movie PASS.')
        lines.append('')
        lines.append('| ID | Movie Title | Status | Source Type | Probed Quality | Claimed Quality | Failure Reason / Details |')
        lines.append('| :--- | :--- | :---: | :---: | :---: | :---: | :--- |')

        movies = [i for i in items if i.category == 'MOVIE']
        for mv in movies:
            badge = '✅ PASS' if mv.status == 'PASS' else ('📹 TRAILER_ONLY' if mv.status == 'TRAILER_ONLY' else f'❌ {mv.status}')
            src_type = 'Direct Stream' if mv.stream_url else ('Trailer' if mv.source_state == 'TRAILER_ONLY' else 'None')
            lines.append(f'| `{mv.id}` | **{mv.title}** | {badge} | {src_type} | `{mv.probed_resolution or "-"}` | `{mv.claimed_resolution or "-"}` | {mv.failure_reason or mv.identity_status or "Verified"} |')

        lines.append('')
        lines.append('---')
        lines.append('')
        lines.append('## 2. Web Series & Episodes (Priority 2 Audit)')
        lines.append('')
        lines.append('| Series Title | Episode Title | Status | Stream URL / Source | Probed Resolution | Reason / Note |')
        lines.append('| :--- | :--- | :---: | :--- | :---: | :--- |')

        episodes = [i for i in items if i.category == 'EPISODE']
        failing_eps = [e for e in episodes if e.status != 'PASS']
        passing_eps = [e for e in episodes if e.status == 'PASS']
        sample_eps = failing_eps + passing_eps[:25]

        for ep in sample_eps:
            badge = '✅ PASS' if ep.status == 'PASS' else f'❌ {ep.status}'
            stream_snippet = f'`{ep.stream_url[:40]}...`' if ep.stream_url else '*None (Torrent Engine)*'
            lines.append(f'| **{ep.parent_title}** | {ep.title} | {badge} | {stream_snippet} | `{ep.probed_resolution or "-"}` | {ep.failure_reason or ep.identity_status or "OK"} |')

        if len(episodes) > len(sample_eps):
            lines.append(f'| *... and {len(episodes) - len(sample_eps)} more episodes ...* | | | | | |')

        lines.append('')
        lines.append('---')
        lines.append('')
        lines.append('## 3. Official Trailers (Priority 3 Audit)')
        lines.append('')
        lines.append('| Parent Title | Category | Status | Embed URL | Failure Reason |')
        lines.append('| :--- | :---: | :---: | :--- | :--- |')

        trailers = [i for i in items if i.category == 'TRAILER']
        failing_tr = [t for t in trailers if t.status != 'PASS']
        sample_tr = failing_tr + [t for t in trailers if t.status == 'PASS'][:25]
        for tr in sample_tr:
            badge = '✅ PASS' if tr.status == 'PASS' else f'❌ {tr.status}'
            lines.append(f'| **{tr.parent_title}** | `{tr.source_state or "TRAILER"}` | {badge} | `{tr.stream_url}` | {tr.failure_reason or "OK"} |')

        return '\n'.join(lines)

    def _calculate_regression(self, current_data: Dict[str, Any]) -> Dict[str, Any]:
        """Compares current run with the most recent previous run in reports/history/."""
        history_files = sorted([
            os.path.join(self.history_dir, f) for f in os.listdir(self.history_dir)
            if f.startswith('report_') and f.endswith('.json')
        ])

        if len(history_files) < 2:
            return {'has_history': False}

        prev_file = history_files[-2]
        try:
            with open(prev_file, 'r', encoding='utf-8') as f:
                prev_data = json.load(f)

            prev_metrics = prev_data.get('metrics', {})
            curr_metrics = current_data.get('metrics', {})

            movie_delta = curr_metrics.get('movies_passed', 0) - prev_metrics.get('movies_passed', 0)

            prev_fails = set(i['id'] for i in prev_data.get('items', []) if i.get('status') not in ('PASS', 'TRAILER_ONLY'))
            curr_fails = set(i['id'] for i in current_data.get('items', []) if i.get('status') not in ('PASS', 'TRAILER_ONLY'))

            fixed = prev_fails - curr_fails
            new_fails = curr_fails - prev_fails

            return {
                'has_history': True,
                'prev_ts': prev_metrics.get('timestamp', 'Unknown'),
                'fixed_count': len(fixed),
                'new_failures_count': len(new_fails),
                'movie_delta': movie_delta
            }
        except Exception:
            return {'has_history': False}
