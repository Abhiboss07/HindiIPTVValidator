"""
Catalog Scanner Module for T2L Autonomous Stream Validator.
Discovers and normalizes all media entries across JSON catalogs, Android assets, and JavaScript bundles.
"""

import os
import json
import re
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Any, Set


class MediaCategory(str, Enum):
    MOVIE = 'MOVIE'
    SERIES = 'SERIES'
    EPISODE = 'EPISODE'
    TRAILER = 'TRAILER'
    LIVE_TV = 'LIVE_TV'
    RADIO = 'RADIO'
    UNKNOWN = 'UNKNOWN'


@dataclass
class MovieItem:
    id: str
    title: str
    year: Optional[int] = None
    stream_url: Optional[str] = None
    backup_urls: List[str] = field(default_factory=list)
    trailer_url: Optional[str] = None
    torrent_uri: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    claimed_resolution: str = ''
    claimed_audio: str = ''
    claimed_languages: List[str] = field(default_factory=list)
    claimed_duration_s: int = 0
    categories: List[str] = field(default_factory=list)
    genres: List[str] = field(default_factory=list)
    source_state: str = ''
    quality_honest_badge: Optional[str] = None
    source_file: str = ''


@dataclass
class EpisodeItem:
    id: str
    series_id: str
    series_title: str
    season_number: int
    episode_number: int
    title: str
    duration_str: str = ''
    stream_url: Optional[str] = None
    trailer_url: Optional[str] = None
    torrent_uri: Optional[str] = None
    source_state: str = ''
    quality_honest_badge: Optional[str] = None
    source_file: str = ''


@dataclass
class SeriesItem:
    id: str
    title: str
    year: Optional[int] = None
    trailer_url: Optional[str] = None
    torrent_uri: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    claimed_resolution: str = ''
    claimed_audio: str = ''
    claimed_languages: List[str] = field(default_factory=list)
    episodes: List[EpisodeItem] = field(default_factory=list)
    source_state: str = ''
    source_file: str = ''


@dataclass
class TrailerItem:
    parent_id: str
    parent_title: str
    parent_type: str  # MOVIE, SERIES, or EPISODE
    trailer_url: str
    youtube_id: Optional[str] = None
    source_file: str = ''


@dataclass
class LiveItem:
    id: str
    name: str
    url: str
    backup_urls: List[str] = field(default_factory=list)
    category: str = ''
    quality: str = ''
    is_radio: bool = False
    source_file: str = ''


@dataclass
class CatalogInventory:
    movies: List[MovieItem] = field(default_factory=list)
    series: List[SeriesItem] = field(default_factory=list)
    episodes: List[EpisodeItem] = field(default_factory=list)
    trailers: List[TrailerItem] = field(default_factory=list)
    channels: List[LiveItem] = field(default_factory=list)
    duplicate_ids: List[Dict[str, Any]] = field(default_factory=list)
    duplicate_urls: List[Dict[str, Any]] = field(default_factory=list)
    duplicate_episodes: List[Dict[str, Any]] = field(default_factory=list)
    trailer_missing_movie_streams: List[Dict[str, Any]] = field(default_factory=list)
    catalog_files_scanned: List[str] = field(default_factory=list)


def extract_youtube_id(url: Optional[str]) -> Optional[str]:
    if not url:
        return None
    patterns = [
        r'embed/([a-zA-Z0-9_-]{11})',
        r'[?&]v=([a-zA-Z0-9_-]{11})',
        r'youtu\.be/([a-zA-Z0-9_-]{11})',
    ]
    for pat in patterns:
        m = re.search(pat, url)
        if m:
            return m.group(1)
    if re.match(r'^[a-zA-Z0-9_-]{11}$', url.strip()):
        return url.strip()
    return None


class CatalogScanner:
    """Scans repository to discover all VOD movies, series, episodes, trailers, and live channels."""

    def __init__(self, repo_root: str):
        self.repo_root = os.path.abspath(repo_root)

    def scan(self) -> CatalogInventory:
        inventory = CatalogInventory()

        # 1. Primary Movie / Series Catalog
        movies_path = os.path.join(self.repo_root, 'data', 'movies_catalog.json')
        if os.path.exists(movies_path):
            self._scan_movies_catalog(movies_path, inventory)
            inventory.catalog_files_scanned.append(os.path.relpath(movies_path, self.repo_root))

        # 2. Live Channels Catalog
        channels_path = os.path.join(self.repo_root, 'data', 'channels.json')
        if os.path.exists(channels_path):
            self._scan_channels_catalog(channels_path, inventory)
            inventory.catalog_files_scanned.append(os.path.relpath(channels_path, self.repo_root))

        # 3. Detect Catalog Duplication & Anomaly Mappings
        self._detect_catalog_anomalies(inventory)

        return inventory

    def _scan_movies_catalog(self, filepath: str, inventory: CatalogInventory):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        items = data.get('movies', []) if isinstance(data, dict) else (data if isinstance(data, list) else [])

        for item in items:
            item_id = item.get('id', '').strip()
            title = item.get('title', '').strip()
            media_type = (item.get('mediaType') or item.get('contentType') or '').lower()

            if media_type == 'series' or 'episodes' in item or 'seasons' in item:
                # Process as Series
                series = SeriesItem(
                    id=item_id,
                    title=title,
                    year=item.get('year'),
                    trailer_url=item.get('trailerUrl'),
                    torrent_uri=item.get('torrentUri'),
                    poster_url=item.get('posterUrl'),
                    backdrop_url=item.get('backdropUrl'),
                    claimed_resolution=item.get('resolution', ''),
                    claimed_audio=item.get('audio', ''),
                    claimed_languages=item.get('languages', []),
                    source_state=item.get('sourceState', ''),
                    source_file=filepath
                )

                # Collect trailer if present
                if series.trailer_url:
                    inventory.trailers.append(TrailerItem(
                        parent_id=series.id,
                        parent_title=series.title,
                        parent_type='SERIES',
                        trailer_url=series.trailer_url,
                        youtube_id=extract_youtube_id(series.trailer_url),
                        source_file=filepath
                    ))

                # Process episodes from seasons or flat episodes array
                ep_map: Dict[str, EpisodeItem] = {}

                # 1) Check seasons array
                if 'seasons' in item and isinstance(item['seasons'], list):
                    for season in item['seasons']:
                        s_num = season.get('seasonNumber', 1)
                        for ep in season.get('episodes', []):
                            ep_id = ep.get('id', '')
                            ep_item = EpisodeItem(
                                id=ep_id,
                                series_id=series.id,
                                series_title=series.title,
                                season_number=s_num,
                                episode_number=ep.get('episodeNumber', 1),
                                title=ep.get('title', f'Episode {ep.get("episodeNumber", 1)}'),
                                duration_str=ep.get('duration', ''),
                                stream_url=ep.get('streamUrl'),
                                trailer_url=ep.get('trailerUrl'),
                                torrent_uri=ep.get('torrentUri') or series.torrent_uri,
                                source_state=ep.get('sourceState', ''),
                                quality_honest_badge=ep.get('qualityHonestBadge'),
                                source_file=filepath
                            )
                            ep_map[ep_id] = ep_item

                # 2) Check flat episodes array (fill any missing)
                if 'episodes' in item and isinstance(item['episodes'], list):
                    for ep in item['episodes']:
                        ep_id = ep.get('id', '')
                        if ep_id not in ep_map:
                            ep_item = EpisodeItem(
                                id=ep_id,
                                series_id=series.id,
                                series_title=series.title,
                                season_number=ep.get('season', 1),
                                episode_number=ep.get('episodeNumber', 1),
                                title=ep.get('title', f'Episode {ep.get("episodeNumber", 1)}'),
                                duration_str=ep.get('duration', ''),
                                stream_url=ep.get('streamUrl'),
                                trailer_url=ep.get('trailerUrl'),
                                torrent_uri=ep.get('torrentUri') or series.torrent_uri,
                                source_state=ep.get('sourceState', ''),
                                quality_honest_badge=ep.get('qualityHonestBadge'),
                                source_file=filepath
                            )
                            ep_map[ep_id] = ep_item

                series.episodes = list(ep_map.values())
                inventory.series.append(series)
                inventory.episodes.extend(series.episodes)

                # Add episode-specific trailers if any
                for ep in series.episodes:
                    if ep.trailer_url and ep.trailer_url != series.trailer_url:
                        inventory.trailers.append(TrailerItem(
                            parent_id=ep.id,
                            parent_title=f'{series.title} - {ep.title}',
                            parent_type='EPISODE',
                            trailer_url=ep.trailer_url,
                            youtube_id=extract_youtube_id(ep.trailer_url),
                            source_file=filepath
                        ))

            else:
                # Process as Movie
                movie = MovieItem(
                    id=item_id,
                    title=title,
                    year=item.get('year'),
                    stream_url=item.get('streamUrl'),
                    backup_urls=item.get('backupUrls', []),
                    trailer_url=item.get('trailerUrl'),
                    torrent_uri=item.get('torrentUri'),
                    poster_url=item.get('posterUrl'),
                    backdrop_url=item.get('backdropUrl'),
                    claimed_resolution=item.get('resolution', ''),
                    claimed_audio=item.get('audio', ''),
                    claimed_languages=item.get('languages', []),
                    claimed_duration_s=item.get('duration', 0) or 0,
                    categories=item.get('categories', []),
                    genres=item.get('genres', []),
                    source_state=item.get('sourceState', ''),
                    quality_honest_badge=item.get('qualityHonestBadge'),
                    source_file=filepath
                )
                inventory.movies.append(movie)

                # Collect movie trailer
                if movie.trailer_url:
                    inventory.trailers.append(TrailerItem(
                        parent_id=movie.id,
                        parent_title=movie.title,
                        parent_type='MOVIE',
                        trailer_url=movie.trailer_url,
                        youtube_id=extract_youtube_id(movie.trailer_url),
                        source_file=filepath
                    ))

    def _scan_channels_catalog(self, filepath: str, inventory: CatalogInventory):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        items = data if isinstance(data, list) else data.get('channels', [])
        for item in items:
            ch_id = item.get('id', '').strip()
            name = item.get('name', '').strip()
            url = item.get('url', '').strip()
            if not url:
                continue

            inventory.channels.append(LiveItem(
                id=ch_id,
                name=name,
                url=url,
                backup_urls=item.get('backupUrls', []),
                category=item.get('category', ''),
                quality=item.get('quality', ''),
                is_radio=item.get('type') == 'radio' or 'radio' in item.get('category', '').lower(),
                source_file=filepath
            ))

    def _detect_catalog_anomalies(self, inventory: CatalogInventory):
        """Identifies duplicate IDs, duplicate URLs mapped across distinct titles, etc."""
        # 1. Check duplicate IDs
        seen_ids: Dict[str, str] = {}
        for m in inventory.movies:
            if m.id in seen_ids:
                inventory.duplicate_ids.append({
                    'id': m.id,
                    'title': m.title,
                    'first_title': seen_ids[m.id],
                    'type': 'MOVIE'
                })
            else:
                seen_ids[m.id] = m.title

        for s in inventory.series:
            if s.id in seen_ids:
                inventory.duplicate_ids.append({
                    'id': s.id,
                    'title': s.title,
                    'first_title': seen_ids[s.id],
                    'type': 'SERIES'
                })
            else:
                seen_ids[s.id] = s.title

        # 2. Check duplicate stream URLs across different movies
        url_to_titles: Dict[str, List[str]] = {}
        for m in inventory.movies:
            if m.stream_url:
                url_to_titles.setdefault(m.stream_url, []).append(f'Movie: {m.title}')

        for s in inventory.series:
            for ep in s.episodes:
                if ep.stream_url:
                    url_to_titles.setdefault(ep.stream_url, []).append(f'{s.title} S{ep.season_number}E{ep.episode_number}')

        for url, titles in url_to_titles.items():
            if len(titles) > 1:
                # If mapped across different root titles, record anomaly
                distinct_titles = set(t.split(' S')[0].replace('Movie: ', '') for t in titles)
                if len(distinct_titles) > 1:
                    inventory.duplicate_urls.append({
                        'url': url,
                        'titles': titles,
                        'conflict': True
                    })

        # 3. Check for movies where trailer is present but movie stream is missing
        for m in inventory.movies:
            if m.trailer_url and not m.stream_url:
                inventory.trailer_missing_movie_streams.append({
                    'id': m.id,
                    'title': m.title,
                    'trailer_url': m.trailer_url
                })
