"""
Thumbnail and Poster Validator Module for T2L Autonomous Stream Validator.
Validates poster/backdrop image existence, file integrity, and dimensions.
"""

import os
from dataclasses import dataclass
from typing import Optional
from PIL import Image


@dataclass
class ThumbnailCheckResult:
    rel_path: str
    abs_path: str
    exists: bool
    is_valid: bool
    status: str  # PASS, MISSING_POSTER, BROKEN_POSTER, ZERO_BYTE_FILE
    file_size_bytes: int = 0
    width: int = 0
    height: int = 0
    format: str = ''
    failure_reason: Optional[str] = None


class ThumbnailValidator:
    """Validates poster and backdrop images on disk."""

    def __init__(self, repo_root: str):
        self.repo_root = os.path.abspath(repo_root)

    def validate(self, poster_rel_path: Optional[str]) -> ThumbnailCheckResult:
        if not poster_rel_path:
            return ThumbnailCheckResult(
                rel_path='',
                abs_path='',
                exists=False,
                is_valid=False,
                status='MISSING_POSTER',
                failure_reason='No poster URL configured in metadata'
            )

        abs_path = os.path.join(self.repo_root, poster_rel_path.lstrip('/'))
        if not os.path.exists(abs_path):
            return ThumbnailCheckResult(
                rel_path=poster_rel_path,
                abs_path=abs_path,
                exists=False,
                is_valid=False,
                status='MISSING_POSTER',
                failure_reason=f'File does not exist on disk: {poster_rel_path}'
            )

        size = os.path.getsize(abs_path)
        if size == 0:
            return ThumbnailCheckResult(
                rel_path=poster_rel_path,
                abs_path=abs_path,
                exists=True,
                is_valid=False,
                status='ZERO_BYTE_FILE',
                file_size_bytes=0,
                failure_reason='Poster file is 0 bytes (empty file)'
            )

        try:
            with Image.open(abs_path) as img:
                w, h = img.size
                fmt = img.format or 'UNKNOWN'

                if w < 50 or h < 50:
                    return ThumbnailCheckResult(
                        rel_path=poster_rel_path,
                        abs_path=abs_path,
                        exists=True,
                        is_valid=False,
                        status='BROKEN_POSTER',
                        file_size_bytes=size,
                        width=w,
                        height=h,
                        format=fmt,
                        failure_reason=f'Dimensions suspiciously small: {w}x{h}'
                    )

                return ThumbnailCheckResult(
                    rel_path=poster_rel_path,
                    abs_path=abs_path,
                    exists=True,
                    is_valid=True,
                    status='PASS',
                    file_size_bytes=size,
                    width=w,
                    height=h,
                    format=fmt
                )
        except Exception as e:
            return ThumbnailCheckResult(
                rel_path=poster_rel_path,
                abs_path=abs_path,
                exists=True,
                is_valid=False,
                status='BROKEN_POSTER',
                file_size_bytes=size,
                failure_reason=f'Failed to decode image ({e})'
            )
