#!/usr/bin/env python3
"""
T2L Autonomous Stream & Movie Source Validator CLI.
Fast, concurrent, multi-tier validation engine prioritizing movies over trailers.
"""

import sys
import os
import argparse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any, Optional

# Add repo root to import path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.stream_validator.catalog_scanner import CatalogScanner, CatalogInventory, MovieItem, SeriesItem, EpisodeItem, TrailerItem
from tools.stream_validator.url_validator import UrlValidator, UrlCheckResult
from tools.stream_validator.media_probe import MediaProber, MediaProbeResult
from tools.stream_validator.identity_validator import IdentityValidator, IdentityValidationResult
from tools.stream_validator.youtube_validator import YouTubeValidator, YouTubeValidationResult
from tools.stream_validator.thumbnail_validator import ThumbnailValidator, ThumbnailCheckResult
from tools.stream_validator.report_generator import ReportGenerator, SummaryMetrics, ValidationItemReport
from tools.stream_validator.fix_queue import FixQueueGenerator


def validate_single_movie(
    movie: MovieItem,
    url_val: UrlValidator,
    prober: MediaProber,
    id_val: IdentityValidator,
    thumb_val: ThumbnailValidator,
    require_movie_for_trailer: bool = True,
    min_resolution: str = '1080p',
    max_resolution: str = '4k',
    enforce_resolution: bool = False
) -> ValidationItemReport:
    # 1. Poster validation
    poster_res = thumb_val.validate(movie.poster_url)
    poster_status = poster_res.status

    # 2. Source Stream Validation
    if movie.stream_url:
        # Full movie stream exists — MUST be rigorously probed
        url_res = url_val.validate_url(movie.stream_url)
        if not url_res.is_valid:
            return ValidationItemReport(
                category='MOVIE',
                id=movie.id,
                title=movie.title,
                stream_url=movie.stream_url,
                source_state='DIRECT_STREAM_AVAILABLE',
                http_status=url_res.status_code,
                content_type=url_res.content_type,
                claimed_resolution=movie.claimed_resolution,
                status='FAIL',
                failure_reason=f'Network/HTTP Failure: {url_res.failure_reason}',
                poster_status=poster_status
            )

        # Probe with ffprobe / HLS parser
        probe_res = prober.probe(movie.stream_url)
        if not probe_res.is_playable:
            return ValidationItemReport(
                category='MOVIE',
                id=movie.id,
                title=movie.title,
                stream_url=movie.stream_url,
                source_state='DIRECT_STREAM_AVAILABLE',
                http_status=url_res.status_code,
                content_type=url_res.content_type,
                claimed_resolution=movie.claimed_resolution,
                status='FAIL',
                failure_reason=f'Media Probe Failed: {probe_res.failure_reason}',
                poster_status=poster_status
            )

        # Content Identity and Quality Verification
        ident_res = id_val.validate_movie_identity(
            catalog_title=movie.title,
            claimed_duration_s=movie.claimed_duration_s,
            probe_res=probe_res,
            stream_url=movie.stream_url
        )

        status = 'PASS'
        reason = None
        if ident_res.status == 'WRONG_CONTENT':
            status = 'FAIL'
            reason = f'Wrong Content Detected: {ident_res.notes}'
        elif ident_res.status == 'TRAILER_AS_MOVIE':
            status = 'FAIL'
            reason = f'Trailer substituted for Movie: {ident_res.notes}'

        # Quality Mismatch Check
        if movie.claimed_resolution and probe_res.quality_label != 'Unknown':
            if '4k' in movie.claimed_resolution.lower() and '4k' not in probe_res.quality_label.lower():
                status = 'FAIL'
                reason = f'Quality Mismatch: Claimed {movie.claimed_resolution} but probed {probe_res.quality_label}'

        # Resolution tier evaluation (min 1080p up to 4K)
        w = probe_res.video.width if probe_res.video else 0
        h = probe_res.video.height if probe_res.video else 0
        dim_min = min(h, w) if (h > 0 and w > 0) else max(h, w)
        dim_max = max(h, w) if (h > 0 and w > 0) else 0

        is_4k = (dim_min >= 2160 or dim_max >= 3840 or '4k' in probe_res.quality_label.lower())
        is_1080p = (dim_min >= 800 or dim_max >= 1920 or '1080p' in probe_res.quality_label.lower())
        is_adaptive = probe_res.is_adaptive or (probe_res.hls_resolutions and any('1080' in r or '2160' in r for r in probe_res.hls_resolutions))

        if is_4k:
            res_tier = '4K UHD'
        elif is_1080p or is_adaptive:
            res_tier = '1080p Full HD'
        else:
            res_tier = '<1080p'
            if enforce_resolution:
                status = 'FAIL'
                reason = f'QUALITY_BELOW_MINIMUM: Probed {probe_res.quality_label} is below minimum {min_resolution}'

        return ValidationItemReport(
            category='MOVIE',
            id=movie.id,
            title=movie.title,
            stream_url=movie.stream_url,
            source_state='DIRECT_STREAM_AVAILABLE',
            http_status=url_res.status_code,
            content_type=url_res.content_type,
            claimed_resolution=movie.claimed_resolution,
            probed_resolution=probe_res.quality_label,
            claimed_audio=movie.claimed_audio,
            probed_audio=f'{probe_res.audio.codec} {probe_res.audio.channels}ch' if probe_res.audio else '',
            probed_duration_s=probe_res.duration_s,
            status=status,
            failure_reason=reason,
            identity_status=ident_res.status,
            poster_status=poster_status,
            resolution_tier=res_tier
        )

    elif movie.trailer_url:
        # If require_movie_for_trailer is active, movie must have full stream if trailer is present!
        if require_movie_for_trailer:
            return ValidationItemReport(
                category='MOVIE',
                id=movie.id,
                title=movie.title,
                stream_url=None,
                source_state='TRAILER_ONLY',
                claimed_resolution=movie.claimed_resolution,
                status='FAIL',
                failure_reason='TRAILER_PRESENT_WITHOUT_MOVIE_STREAM: Trailer is present but full movie stream is missing.',
                identity_status='TRAILER_ONLY',
                poster_status=poster_status
            )
        else:
            return ValidationItemReport(
                category='MOVIE',
                id=movie.id,
                title=movie.title,
                stream_url=None,
                source_state='TRAILER_ONLY',
                claimed_resolution=movie.claimed_resolution,
                status='TRAILER_ONLY',
                failure_reason='Only official trailer is available; full movie stream absent.',
                identity_status='TRAILER_ONLY',
                poster_status=poster_status
            )
    else:
        return ValidationItemReport(
            category='MOVIE',
            id=movie.id,
            title=movie.title,
            stream_url=None,
            source_state='NO_AUTHORIZED_SOURCE',
            claimed_resolution=movie.claimed_resolution,
            status='FAIL',
            failure_reason='No authorized stream or trailer configured in catalog.',
            identity_status='NO_SOURCE',
            poster_status=poster_status
        )


def validate_single_episode(ep: EpisodeItem, url_val: UrlValidator, prober: MediaProber, id_val: IdentityValidator) -> ValidationItemReport:
    if ep.stream_url:
        url_res = url_val.validate_url(ep.stream_url)
        if not url_res.is_valid:
            return ValidationItemReport(
                category='EPISODE',
                id=ep.id,
                title=ep.title,
                parent_title=ep.series_title,
                stream_url=ep.stream_url,
                source_state='EPISODE_AVAILABLE',
                http_status=url_res.status_code,
                content_type=url_res.content_type,
                status='FAIL',
                failure_reason=f'HTTP Failure: {url_res.failure_reason}'
            )

        probe_res = prober.probe(ep.stream_url)
        if not probe_res.is_playable:
            return ValidationItemReport(
                category='EPISODE',
                id=ep.id,
                title=ep.title,
                parent_title=ep.series_title,
                stream_url=ep.stream_url,
                source_state='EPISODE_AVAILABLE',
                http_status=url_res.status_code,
                content_type=url_res.content_type,
                status='FAIL',
                failure_reason=f'Probe Failure: {probe_res.failure_reason}'
            )

        ident_res = id_val.validate_episode_identity(
            series_title=ep.series_title,
            season_num=ep.season_number,
            ep_num=ep.episode_number,
            ep_title=ep.title,
            probe_res=probe_res,
            stream_url=ep.stream_url
        )

        status = 'PASS'
        reason = None
        if ident_res.status == 'WRONG_EPISODE':
            status = 'FAIL'
            reason = f'Wrong Episode: {ident_res.notes}'
        elif ident_res.status == 'TRAILER_AS_EPISODE':
            status = 'FAIL'
            reason = f'Trailer as episode: {ident_res.notes}'

        return ValidationItemReport(
            category='EPISODE',
            id=ep.id,
            title=ep.title,
            parent_title=ep.series_title,
            stream_url=ep.stream_url,
            source_state='EPISODE_AVAILABLE',
            http_status=url_res.status_code,
            content_type=url_res.content_type,
            probed_resolution=probe_res.quality_label,
            probed_duration_s=probe_res.duration_s,
            status=status,
            failure_reason=reason,
            identity_status=ident_res.status
        )
    else:
        return ValidationItemReport(
            category='EPISODE',
            id=ep.id,
            title=ep.title,
            parent_title=ep.series_title,
            stream_url=None,
            source_state=ep.source_state or 'NO_SOURCE',
            status='UNVERIFIED' if ep.torrent_uri else 'NO_SOURCE',
            failure_reason='Episode has no direct stream URL (requires peer-to-peer / torrent source).' if ep.torrent_uri else 'No stream URL configured.'
        )


def validate_single_trailer(tr: TrailerItem, yt_val: YouTubeValidator, url_val: UrlValidator) -> ValidationItemReport:
    if tr.youtube_id:
        yt_res = yt_val.validate(tr.youtube_id)
        return ValidationItemReport(
            category='TRAILER',
            id=f'tr_{tr.parent_id}',
            title=f'{tr.parent_title} (Official Trailer)',
            parent_title=tr.parent_title,
            stream_url=tr.trailer_url,
            source_state='TRAILER_ONLY',
            status='PASS' if yt_res.is_available else 'FAIL',
            failure_reason=None if yt_res.is_available else yt_res.failure_reason
        )
    else:
        url_res = url_val.validate_url(tr.trailer_url)
        return ValidationItemReport(
            category='TRAILER',
            id=f'tr_{tr.parent_id}',
            title=f'{tr.parent_title} (Trailer)',
            parent_title=tr.parent_title,
            stream_url=tr.trailer_url,
            source_state='TRAILER_ONLY',
            http_status=url_res.status_code,
            status='PASS' if url_res.is_valid else 'FAIL',
            failure_reason=None if url_res.is_valid else url_res.failure_reason
        )


def main():
    parser = argparse.ArgumentParser(description='T2L Autonomous Stream & Movie Source Validator')
    parser.add_argument('--all', action='store_true', help='Validate all movies, series, episodes, trailers, channels')
    parser.add_argument('--movies-only', action='store_true', help='Validate movies only (Priority 1)')
    parser.add_argument('--series-only', action='store_true', help='Validate series & episodes only (Priority 2)')
    parser.add_argument('--trailers-only', action='store_true', help='Validate official trailers only (Priority 3)')
    parser.add_argument('--workers', type=int, default=8, help='Number of concurrent validation workers (default: 8)')
    parser.add_argument('--timeout', type=float, default=25.0, help='Network and ffprobe timeout in seconds (default: 25.0)')
    parser.add_argument('--json', action='store_true', help='Print summary JSON to stdout')
    parser.add_argument('--ci', action='store_true', help='CI mode: exit with non-zero status if failure thresholds exceeded')
    parser.add_argument('--max-broken-movies', type=int, default=0, help='Maximum permitted broken movies in CI (default: 0)')
    parser.add_argument('--require-movie-for-trailer', action='store_true', default=True, help='Require movie stream to be present whenever trailer is present (default: True)')
    parser.add_argument('--allow-trailer-only', dest='require_movie_for_trailer', action='store_false', help='Allow trailer-only entries without failing')
    parser.add_argument('--min-resolution', choices=['360p', '480p', '720p', '1080p', '4k'], default='1080p', help='Minimum required movie resolution standard (default: 1080p)')
    parser.add_argument('--max-resolution', choices=['1080p', '4k'], default='4k', help='Maximum supported movie resolution (default: 4k)')
    parser.add_argument('--enforce-resolution', action='store_true', help='Strictly fail movies whose probed resolution is below --min-resolution')

    args = parser.parse_args()
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print('=' * 80)
    print('       T2L AUTONOMOUS STREAM & MOVIE SOURCE VALIDATION ENGINE')
    print('=' * 80)
    print(f'Repo Root:   {repo_root}')
    print(f'Workers:     {args.workers} concurrent threads | Timeout: {args.timeout}s')
    print(f'Resolution:  Standard min {args.min_resolution} up to {args.max_resolution} (Enforce: {args.enforce_resolution})')
    if args.require_movie_for_trailer:
        print('Policy:      STRICT (Trailer Requires Playable Movie Stream)')
    print('-' * 80)

    # 1. Source Discovery
    scanner = CatalogScanner(repo_root)
    inventory = scanner.scan()
    print(f'📂 Discovered Catalog Items:')
    print(f'   • Movies (Priority 1):        {len(inventory.movies)}')
    print(f'   • Series (Priority 2):        {len(inventory.series)}')
    print(f'   • Episodes:                   {len(inventory.episodes)}')
    print(f'   • Official Trailers:          {len(inventory.trailers)}')
    print(f'   • Live TV & Radio Channels:   {len(inventory.channels)}')
    print('-' * 80)

    # Initialize sub-validators
    url_val = UrlValidator(timeout_sec=args.timeout)
    prober = MediaProber(timeout_sec=args.timeout)
    id_val = IdentityValidator()
    yt_val = YouTubeValidator(timeout_sec=args.timeout)
    thumb_val = ThumbnailValidator(repo_root)

    report_items: List[ValidationItemReport] = []

    # 2. Priority 1: Movies
    do_movies = args.movies_only or args.all or (not args.series_only and not args.trailers_only)
    if do_movies:
        print(f'🚀 [Priority 1/3] Validating {len(inventory.movies)} Movies (Min: {args.min_resolution} - Max: {args.max_resolution})...')
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_to_movie = {
                executor.submit(
                    validate_single_movie,
                    m,
                    url_val,
                    prober,
                    id_val,
                    thumb_val,
                    args.require_movie_for_trailer,
                    args.min_resolution,
                    args.max_resolution,
                    args.enforce_resolution
                ): m
                for m in inventory.movies
            }
            for future in as_completed(future_to_movie):
                m = future_to_movie[future]
                try:
                    res = future.result()
                    report_items.append(res)
                    icon = '✅ PASS' if res.status == 'PASS' else ('📹 TRAILER' if res.status == 'TRAILER_ONLY' else f'❌ {res.status}')
                    print(f'   [{icon:^9}] Movie: {m.title[:35]:<35} | Probed: {res.probed_resolution or "-":<12} | {res.failure_reason or "OK"}')
                except Exception as e:
                    print(f'   [❌ ERROR] Movie: {m.title} failed with exception: {e}')

    # 3. Priority 2: Series & Episodes
    do_series = args.series_only or args.all or (not args.movies_only and not args.trailers_only)
    if do_series:
        # Sample or validate episodes with streams
        stream_eps = [e for e in inventory.episodes if e.stream_url]
        torrent_eps = [e for e in inventory.episodes if not e.stream_url]
        print(f'\n🚀 [Priority 2/3] Validating Series ({len(stream_eps)} stream episodes + {len(torrent_eps)} torrent/catalog episodes)...')
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_to_ep = {
                executor.submit(validate_single_episode, ep, url_val, prober, id_val): ep
                for ep in stream_eps
            }
            for future in as_completed(future_to_ep):
                ep = future_to_ep[future]
                try:
                    res = future.result()
                    report_items.append(res)
                    icon = '✅ PASS' if res.status == 'PASS' else f'❌ {res.status}'
                    print(f'   [{icon:^9}] Episode: {ep.series_title[:18]} S{ep.season_number:02d}E{ep.episode_number:02d} | {res.probed_resolution or "-":<12} | {res.failure_reason or "OK"}')
                except Exception as e:
                    print(f'   [❌ ERROR] Episode: {ep.series_title} failed: {e}')

        # Add remaining episodes without direct stream
        for ep in torrent_eps:
            report_items.append(ValidationItemReport(
                category='EPISODE',
                id=ep.id,
                title=ep.title,
                parent_title=ep.series_title,
                stream_url=None,
                source_state=ep.source_state or 'TORRENT_ONLY',
                status='UNVERIFIED' if ep.torrent_uri else 'NO_SOURCE',
                failure_reason='Episode relies on P2P/torrent stream engine; no direct HTTP stream available.'
            ))

    # 4. Priority 3: Trailers
    do_trailers = args.trailers_only or args.all or (not args.movies_only and not args.series_only)
    if do_trailers:
        print(f'\n🚀 [Priority 3/3] Validating {len(inventory.trailers)} Official Trailers...')
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_to_tr = {
                executor.submit(validate_single_trailer, tr, yt_val, url_val): tr
                for tr in inventory.trailers
            }
            for future in as_completed(future_to_tr):
                tr = future_to_tr[future]
                try:
                    res = future.result()
                    report_items.append(res)
                except Exception as e:
                    print(f'   [❌ ERROR] Trailer: {tr.parent_title} failed: {e}')
        print(f'   ✅ Validated {len(inventory.trailers)} trailers.')

    # 5. Summarize Metrics
    metrics = SummaryMetrics()
    movie_reports = [i for i in report_items if i.category == 'MOVIE']
    metrics.total_movies = len(movie_reports)
    metrics.movies_passed = sum(1 for i in movie_reports if i.status == 'PASS')
    metrics.movies_failed = sum(1 for i in movie_reports if i.status == 'FAIL')
    metrics.movies_trailer_only = sum(1 for i in movie_reports if i.status == 'TRAILER_ONLY')
    metrics.movies_no_source = sum(1 for i in movie_reports if i.status == 'NO_SOURCE')
    metrics.movies_quality_mismatch = sum(1 for i in movie_reports if i.failure_reason and 'QUALITY_MISMATCH' in i.failure_reason)
    metrics.trailer_without_movie_count = len(inventory.trailer_missing_movie_streams)
    metrics.movies_4k_count = sum(1 for i in movie_reports if i.resolution_tier == '4K UHD')
    metrics.movies_1080p_count = sum(1 for i in movie_reports if i.resolution_tier == '1080p Full HD')
    metrics.movies_below_1080p = sum(1 for i in movie_reports if i.resolution_tier == '<1080p')

    ep_reports = [i for i in report_items if i.category == 'EPISODE']
    metrics.total_series = len(inventory.series)
    metrics.total_episodes = len(ep_reports)
    metrics.episodes_passed = sum(1 for i in ep_reports if i.status == 'PASS')
    metrics.episodes_failed = sum(1 for i in ep_reports if i.status == 'FAIL')
    metrics.episodes_no_stream = sum(1 for i in ep_reports if i.status in ('UNVERIFIED', 'NO_SOURCE'))
    metrics.episodes_wrong_mapping = sum(1 for i in ep_reports if i.identity_status == 'WRONG_EPISODE')

    tr_reports = [i for i in report_items if i.category == 'TRAILER']
    metrics.total_trailers = len(tr_reports)
    metrics.trailers_passed = sum(1 for i in tr_reports if i.status == 'PASS')
    metrics.trailers_failed = sum(1 for i in tr_reports if i.status == 'FAIL')

    metrics.total_posters = len([i for i in movie_reports if i.poster_status])
    metrics.posters_passed = sum(1 for i in movie_reports if i.poster_status == 'PASS')
    metrics.posters_failed = sum(1 for i in movie_reports if i.poster_status and i.poster_status != 'PASS')

    total_checked = metrics.total_movies + metrics.total_episodes + metrics.total_trailers
    total_passed = metrics.movies_passed + metrics.episodes_passed + metrics.trailers_passed
    metrics.pass_rate_pct = round((total_passed / total_checked * 100) if total_checked > 0 else 0.0, 1)

    # 6. Generate Reports and Fix Queue
    rep_gen = ReportGenerator(repo_root)
    out_paths = rep_gen.generate_reports(report_items, metrics)

    fix_gen = FixQueueGenerator(repo_root)
    queue_path = fix_gen.generate_queue(report_items)

    print('\n' + '=' * 80)
    print('                      FINAL VALIDATION SUMMARY')
    print('=' * 80)
    print(f'🎬 MOVIES (Priority 1):')
    print(f'   Total:              {metrics.total_movies}')
    print(f'   Playable (PASS):    {metrics.movies_passed}')
    print(f'   Broken (FAIL):      {metrics.movies_failed}')
    print(f'   Trailer Only:       {metrics.movies_trailer_only}')
    print(f'   Quality Mismatches: {metrics.movies_quality_mismatch}')
    print(f'   Trailer W/O Movie:  {metrics.trailer_without_movie_count}')
    print(f'   4K UHD Streams:     {metrics.movies_4k_count}')
    print(f'   1080p FHD Streams:  {metrics.movies_1080p_count}')
    print(f'   Sub-1080p Streams:  {metrics.movies_below_1080p}')
    print('')
    print(f'📺 SERIES & EPISODES (Priority 2):')
    print(f'   Total Series:       {metrics.total_series}')
    print(f'   Total Episodes:     {metrics.total_episodes}')
    print(f'   Playable Episodes:  {metrics.episodes_passed}')
    print(f'   Broken Episodes:    {metrics.episodes_failed}')
    print(f'   P2P / No Stream:    {metrics.episodes_no_stream}')
    print('')
    print(f'📹 TRAILERS (Priority 3):')
    print(f'   Total:              {metrics.total_trailers}')
    print(f'   Active (PASS):      {metrics.trailers_passed}')
    print(f'   Broken (FAIL):      {metrics.trailers_failed}')
    print('')
    print(f'🖼️ POSTERS / THUMBNAILS:')
    print(f'   Total Tested:       {metrics.total_posters}')
    print(f'   Valid (PASS):       {metrics.posters_passed}')
    print(f'   Missing/Broken:     {metrics.posters_failed}')
    print('-' * 80)
    md_out = out_paths['markdown']
    json_out = out_paths['json']
    csv_out = out_paths['csv']
    print(f'   • Markdown:   {md_out}')
    print(f'   • JSON:       {json_out}')
    print(f'   • CSV:        {csv_out}')
    print(f'   • Fix Queue:  {queue_path}')
    print('=' * 80)

    if args.json:
        import json
        print('\nJSON_METRICS:' + json.dumps(metrics.__dict__))

    if args.ci:
        if metrics.movies_failed > args.max_broken_movies:
            print(f'❌ CI FAILURE: Broken movies ({metrics.movies_failed}) exceeds threshold ({args.max_broken_movies}).')
            sys.exit(1)
        if metrics.episodes_wrong_mapping > 0:
            print(f'❌ CI FAILURE: Detected {metrics.episodes_wrong_mapping} wrong episode mappings.')
            sys.exit(1)
        print('✅ CI PASSED: All threshold checks satisfied.')


if __name__ == '__main__':
    main()
