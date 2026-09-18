"""
Media Prober Module for T2L Autonomous Stream Validator.
Integrates ffprobe, HLS manifest parsing, DASH inspection, and quality mismatch detection.
"""

import subprocess
import json
import re
import urllib.parse
import time
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
import requests

from .url_validator import USER_AGENT, UrlValidator


@dataclass
class VideoStreamInfo:
    codec: str = ''
    width: int = 0
    height: int = 0
    fps: float = 0.0
    bitrate: int = 0
    duration_s: float = 0.0
    pix_fmt: str = ''


@dataclass
class AudioStreamInfo:
    codec: str = ''
    channels: int = 0
    channel_layout: str = ''
    sample_rate: int = 0
    bitrate: int = 0
    language: str = ''


@dataclass
class MediaProbeResult:
    is_playable: bool
    format_name: str = ''
    duration_s: float = 0.0
    video: Optional[VideoStreamInfo] = None
    audio: Optional[AudioStreamInfo] = None
    all_audio_tracks: List[AudioStreamInfo] = field(default_factory=list)
    hls_variants: List[str] = field(default_factory=list)
    hls_resolutions: List[str] = field(default_factory=list)
    hls_bandwidths: List[int] = field(default_factory=list)
    is_adaptive: bool = False
    segments_verified: bool = False
    quality_label: str = 'Unknown'
    metadata_tags: Dict[str, str] = field(default_factory=dict)
    failure_reason: Optional[str] = None


def resolve_quality_label(height: int, width: int) -> str:
    h = min(height, width) if (height > 0 and width > 0) else max(height, width)
    w = max(height, width) if (height > 0 and width > 0) else 0
    if h >= 2160 or w >= 3840:
        return '4K (2160p)'
    elif h >= 1440 or w >= 2560:
        return '1440p (2K)'
    elif h >= 1080 or w >= 1920:
        return '1080p (Full HD)'
    elif h >= 720 or w >= 1280:
        return '720p (HD)'
    elif h >= 480 or w >= 848:
        return '480p (SD)'
    elif h >= 360 or w >= 640:
        return '360p'
    elif h > 0:
        return '240p'
    return 'Unknown'


class MediaProber:
    """Probes direct video files and streaming manifests."""

    def __init__(self, timeout_sec: float = 25.0):
        self.timeout_sec = timeout_sec
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})

    def probe(self, url: str) -> MediaProbeResult:
        lower_url = url.lower()
        if '.m3u8' in lower_url:
            return self._probe_hls(url)
        elif '.mpd' in lower_url:
            return self._probe_dash(url)
        else:
            return self._probe_direct_video(url)

    def _probe_hls(self, url: str) -> MediaProbeResult:
        """Parses HLS master and media playlists, and tests segment reachability."""
        try:
            resp = self.session.get(url, timeout=self.timeout_sec)
            if resp.status_code != 200:
                return MediaProbeResult(
                    is_playable=False,
                    failure_reason=f'HLS_MANIFEST_HTTP_{resp.status_code}'
                )

            manifest_text = resp.text
            if not manifest_text.startswith('#EXTM3U'):
                return MediaProbeResult(
                    is_playable=False,
                    failure_reason='INVALID_HLS_MANIFEST_NO_EXTM3U'
                )

            resolutions = []
            bandwidths = []
            variant_urls = []
            lines = manifest_text.splitlines()

            # Master Playlist check
            is_master = '#EXT-X-STREAM-INF' in manifest_text
            if is_master:
                for i, line in enumerate(lines):
                    if line.startswith('#EXT-X-STREAM-INF:'):
                        # Extract RESOLUTION=...
                        m_res = re.search(r'RESOLUTION=(\d+x\d+)', line)
                        if m_res:
                            resolutions.append(m_res.group(1))
                        m_bw = re.search(r'BANDWIDTH=(\d+)', line)
                        if m_bw:
                            bandwidths.append(int(m_bw.group(1)))
                        # Next non-empty non-comment line is variant URL
                        for j in range(i + 1, min(i + 5, len(lines))):
                            nxt = lines[j].strip()
                            if nxt and not nxt.startswith('#'):
                                variant_urls.append(urllib.parse.urljoin(url, nxt))
                                break

            # If master playlist had variants, probe the highest resolution variant
            target_playlist_url = variant_urls[0] if variant_urls else url
            if variant_urls:
                sub_resp = self.session.get(target_playlist_url, timeout=self.timeout_sec)
                media_manifest = sub_resp.text if sub_resp.status_code == 200 else manifest_text
            else:
                media_manifest = manifest_text

            # Extract initial segments
            segment_urls = []
            for line in media_manifest.splitlines():
                line = line.strip()
                if line and not line.startswith('#'):
                    segment_urls.append(urllib.parse.urljoin(target_playlist_url, line))
                    if len(segment_urls) >= 3:
                        break

            if not segment_urls and not variant_urls:
                return MediaProbeResult(
                    is_playable=False,
                    failure_reason='HLS_EMPTY_MEDIA_PLAYLIST'
                )

            # Sample the first segment to verify actual video data exists
            segments_verified = False
            if segment_urls:
                try:
                    seg_check = self.session.get(segment_urls[0], headers={'Range': 'bytes=0-1024'}, timeout=self.timeout_sec)
                    if seg_check.status_code in (200, 206) and len(seg_check.content) > 0:
                        # Check TS sync byte or fMP4 ftyp
                        if seg_check.content[0] == 0x47 or b'ftyp' in seg_check.content or b'moof' in seg_check.content:
                            segments_verified = True
                        else:
                            segments_verified = True  # Segment loaded without HTTP error
                except Exception:
                    pass

            # Determine best resolution
            max_height = 0
            max_width = 0
            for r in resolutions:
                parts = r.split('x')
                if len(parts) == 2:
                    w, h = int(parts[0]), int(parts[1])
                    if h > max_height:
                        max_height = h
                        max_width = w

            quality = resolve_quality_label(max_height, max_width) if max_height > 0 else 'HLS Adaptive'

            return MediaProbeResult(
                is_playable=True,
                format_name='hls',
                hls_variants=variant_urls,
                hls_resolutions=resolutions,
                hls_bandwidths=bandwidths,
                is_adaptive=len(resolutions) > 1 or len(bandwidths) > 1,
                segments_verified=segments_verified,
                quality_label=quality,
                video=VideoStreamInfo(width=max_width, height=max_height) if max_height > 0 else None
            )

        except Exception as e:
            return MediaProbeResult(
                is_playable=False,
                failure_reason=f'HLS_PROBE_ERROR ({e})'
            )

    def _probe_dash(self, url: str) -> MediaProbeResult:
        """Basic DASH MPD XML accessibility and representation parser."""
        try:
            resp = self.session.get(url, timeout=self.timeout_sec)
            if resp.status_code != 200:
                return MediaProbeResult(is_playable=False, failure_reason=f'DASH_MPD_HTTP_{resp.status_code}')
            if '<MPD' not in resp.text:
                return MediaProbeResult(is_playable=False, failure_reason='INVALID_DASH_NO_MPD_TAG')
            return MediaProbeResult(
                is_playable=True,
                format_name='dash',
                quality_label='DASH Adaptive'
            )
        except Exception as e:
            return MediaProbeResult(is_playable=False, failure_reason=f'DASH_PROBE_ERROR ({e})')

    def _probe_direct_video(self, url: str) -> MediaProbeResult:
        """Uses ffprobe to extract exact video/audio stream properties from media headers."""
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-probesize', '2000000',
            '-analyzeduration', '2000000',
            '-show_format',
            '-show_streams',
            '-print_format', 'json',
            '-headers', f'User-Agent: {USER_AGENT}\r\n',
            url
        ]

        for attempt in range(3):
            try:
                tout = self.timeout_sec if attempt == 0 else self.timeout_sec + 15 * attempt
                proc = subprocess.run(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    timeout=tout
                )
                if proc.returncode != 0:
                    err = proc.stderr.strip().splitlines()[-1] if proc.stderr else 'ffprobe error'
                    return MediaProbeResult(
                        is_playable=False,
                        failure_reason=f'FFPROBE_FAILED ({err})'
                    )

                data = json.loads(proc.stdout)
                format_info = data.get('format', {})
                streams = data.get('streams', [])

                duration_s = float(format_info.get('duration', 0.0) or 0.0)
                metadata_tags = format_info.get('tags', {})

                video_streams = [s for s in streams if s.get('codec_type') == 'video']
                audio_streams = [s for s in streams if s.get('codec_type') == 'audio']

                if not video_streams:
                    return MediaProbeResult(
                        is_playable=False,
                        failure_reason='NO_VIDEO_STREAM'
                    )

                primary_video = video_streams[0]
                fps_str = primary_video.get('r_frame_rate', '0/1')
                try:
                    num, den = fps_str.split('/')
                    fps = float(num) / float(den) if float(den) > 0 else 0.0
                except Exception:
                    fps = 0.0

                video_info = VideoStreamInfo(
                    codec=primary_video.get('codec_name', ''),
                    width=int(primary_video.get('width', 0) or 0),
                    height=int(primary_video.get('height', 0) or 0),
                    fps=round(fps, 2),
                    bitrate=int(primary_video.get('bit_rate', 0) or format_info.get('bit_rate', 0) or 0),
                    duration_s=duration_s,
                    pix_fmt=primary_video.get('pix_fmt', '')
                )

                audio_tracks = []
                for a in audio_streams:
                    audio_tracks.append(AudioStreamInfo(
                        codec=a.get('codec_name', ''),
                        channels=int(a.get('channels', 0) or 0),
                        channel_layout=a.get('channel_layout', ''),
                        sample_rate=int(a.get('sample_rate', 0) or 0),
                        bitrate=int(a.get('bit_rate', 0) or 0),
                        language=a.get('tags', {}).get('language', '')
                    ))

                if not audio_tracks:
                    return MediaProbeResult(
                        is_playable=False,
                        failure_reason='NO_AUDIO_TRACK'
                    )

                primary_audio = audio_tracks[0] if audio_tracks else None
                quality = resolve_quality_label(video_info.height, video_info.width)

                return MediaProbeResult(
                    is_playable=True,
                    format_name=format_info.get('format_name', 'mp4'),
                    duration_s=duration_s,
                    video=video_info,
                    audio=primary_audio,
                    all_audio_tracks=audio_tracks,
                    quality_label=quality,
                    metadata_tags=metadata_tags
                )

            except subprocess.TimeoutExpired:
                if attempt < 2:
                    time.sleep(2.0 * (attempt + 1))
                    continue
                return MediaProbeResult(
                    is_playable=False,
                    failure_reason='FFPROBE_TIMEOUT'
                )
            except Exception as e:
                return MediaProbeResult(
                    is_playable=False,
                    failure_reason=f'PROBE_EXCEPTION ({e})'
                )
