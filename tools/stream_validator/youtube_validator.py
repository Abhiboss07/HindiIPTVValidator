"""
YouTube Trailer Validator Module for T2L Autonomous Stream Validator.
Validates YouTube video IDs, embed availability, and oEmbed metadata without counting trailers as movies.
"""

import re
import urllib.parse
from dataclasses import dataclass
from typing import Optional, Dict, Any
import requests

from .url_validator import USER_AGENT
from .catalog_scanner import extract_youtube_id


@dataclass
class YouTubeValidationResult:
    video_id: str
    is_available: bool
    status: str  # TRAILER_AVAILABLE, TRAILER_DELETED, TRAILER_PRIVATE, TRAILER_RESTRICTED, INVALID_YOUTUBE_ID
    title: Optional[str] = None
    author: Optional[str] = None
    embed_url: str = ''
    failure_reason: Optional[str] = None


class YouTubeValidator:
    """Validates YouTube video availability and embeddability."""

    def __init__(self, timeout_sec: float = 10.0):
        self.timeout_sec = timeout_sec
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})

    def validate(self, url_or_id: str) -> YouTubeValidationResult:
        video_id = extract_youtube_id(url_or_id)
        if not video_id or not re.match(r'^[a-zA-Z0-9_-]{11}$', video_id):
            return YouTubeValidationResult(
                video_id=url_or_id,
                is_available=False,
                status='INVALID_YOUTUBE_ID',
                failure_reason='Not a valid 11-character YouTube video ID'
            )

        embed_url = f'https://www.youtube-nocookie.com/embed/{video_id}'

        # 1. Query oEmbed endpoint for deterministic public metadata
        oembed_url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json'
        try:
            resp = self.session.get(oembed_url, timeout=self.timeout_sec)
            if resp.status_code == 200:
                data = resp.json()
                return YouTubeValidationResult(
                    video_id=video_id,
                    is_available=True,
                    status='TRAILER_AVAILABLE',
                    title=data.get('title'),
                    author=data.get('author_name'),
                    embed_url=embed_url
                )
            elif resp.status_code == 404:
                return YouTubeValidationResult(
                    video_id=video_id,
                    is_available=False,
                    status='TRAILER_DELETED',
                    embed_url=embed_url,
                    failure_reason='Video deleted or unavailable on YouTube (HTTP 404)'
                )
            elif resp.status_code in (401, 403):
                return YouTubeValidationResult(
                    video_id=video_id,
                    is_available=False,
                    status='TRAILER_PRIVATE',
                    embed_url=embed_url,
                    failure_reason='Video is private, restricted, or embedding disabled'
                )
        except Exception as e:
            # Fallback to direct embed head check if oEmbed had a temporary network glitch
            pass

        # 2. Fallback: Check embed URL directly
        try:
            embed_resp = self.session.head(embed_url, timeout=self.timeout_sec, allow_redirects=True)
            if embed_resp.status_code == 200:
                return YouTubeValidationResult(
                    video_id=video_id,
                    is_available=True,
                    status='TRAILER_AVAILABLE',
                    embed_url=embed_url
                )
            else:
                return YouTubeValidationResult(
                    video_id=video_id,
                    is_available=False,
                    status='TRAILER_RESTRICTED',
                    embed_url=embed_url,
                    failure_reason=f'Embed URL returned HTTP {embed_resp.status_code}'
                )
        except Exception as e:
            return YouTubeValidationResult(
                video_id=video_id,
                is_available=False,
                status='TRAILER_TIMEOUT',
                embed_url=embed_url,
                failure_reason=f'Network timeout/error ({e})'
            )
