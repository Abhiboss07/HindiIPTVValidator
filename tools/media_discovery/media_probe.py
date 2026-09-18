#!/usr/bin/env python3
"""
T2L Media Discovery Probe Engine.
Wraps ffprobe for rapid, low-latency stream inspection.
Extracts honest resolution, video/audio codecs, audio tracks, and language classifications.
"""

import json
import subprocess
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional, Tuple


@dataclass
class ProbedAudioTrack:
    index: int
    codec: str
    channels: int
    language: str
    title: str = ""


@dataclass
class DiscoveryProbeResult:
    is_playable: bool
    duration_s: float
    width: int
    height: int
    quality_label: str  # 2160p, 1440p, 1080p, 720p, 480p, 360p, Unknown
    video_codec: str
    audio_tracks: List[ProbedAudioTrack]
    audio_classification: str  # HINDI_AUDIO, MULTI_AUDIO_INCLUDING_HINDI, ENGLISH, OTHER, HINDI_SUBTITLE_ONLY, UNKNOWN
    detected_languages: List[str]
    failure_reason: Optional[str] = None


def resolve_quality_label(height: int, width: int) -> str:
    h = min(height, width) if (height > 0 and width > 0) else max(height, width)
    w = max(height, width) if (height > 0 and width > 0) else 0
    if h >= 2160 or w >= 3840:
        return "2160p (4K UHD)"
    if h >= 1440 or w >= 2560:
        return "1440p (2K)"
    if h >= 1000 or w >= 1800:
        return "1080p (Full HD)"
    if h >= 700 or w >= 1200:
        return "720p (HD)"
    if h >= 460 or w >= 700:
        return "480p (SD)"
    if h >= 300 or w >= 480:
        return "360p"
    return "240p"


class MediaProber:
    def __init__(self, timeout_s: int = 8):
        self.timeout_s = timeout_s

    def probe(self, url: str) -> DiscoveryProbeResult:
        if not url:
            return DiscoveryProbeResult(
                is_playable=False, duration_s=0.0, width=0, height=0,
                quality_label="Unknown", video_codec="", audio_tracks=[],
                audio_classification="UNKNOWN", detected_languages=[],
                failure_reason="Empty stream URL"
            )

        cmd = [
            "ffprobe", "-v", "error",
            "-analyzeduration", "2000000",
            "-probesize", "2000000",
            "-show_entries", "stream=index,codec_type,codec_name,width,height,channels,sample_rate:stream_tags=language,title:format=duration,tags",
            "-of", "json",
            url
        ]

        try:
            out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, timeout=self.timeout_s)
            data = json.loads(out.decode("utf-8", errors="ignore"))
        except subprocess.TimeoutExpired:
            return DiscoveryProbeResult(
                is_playable=False, duration_s=0.0, width=0, height=0,
                quality_label="Unknown", video_codec="", audio_tracks=[],
                audio_classification="UNKNOWN", detected_languages=[],
                failure_reason=f"Network probe timed out after {self.timeout_s}s"
            )
        except Exception as e:
            return DiscoveryProbeResult(
                is_playable=False, duration_s=0.0, width=0, height=0,
                quality_label="Unknown", video_codec="", audio_tracks=[],
                audio_classification="UNKNOWN", detected_languages=[],
                failure_reason=f"ffprobe execution error: {e}"
            )

        streams = data.get("streams", [])
        duration_s = float(data.get("format", {}).get("duration", 0.0) or 0.0)

        width = 0
        height = 0
        video_codec = ""
        audio_tracks: List[ProbedAudioTrack] = []
        detected_langs: List[str] = []

        for s in streams:
            ctype = s.get("codec_type")
            if ctype == "video" and not width:
                width = int(s.get("width", 0) or 0)
                height = int(s.get("height", 0) or 0)
                video_codec = s.get("codec_name", "")
            elif ctype == "audio":
                tags = s.get("tags", {})
                lang_raw = tags.get("language", "und").lower().strip()
                title_raw = tags.get("title", "").strip()
                
                lang_name = "Unknown"
                if lang_raw in ("hin", "hindi"):
                    lang_name = "Hindi"
                elif lang_raw in ("eng", "en", "english"):
                    lang_name = "English"
                elif lang_raw in ("tel", "te", "telugu"):
                    lang_name = "Telugu"
                elif lang_raw in ("tam", "ta", "tamil"):
                    lang_name = "Tamil"
                elif lang_raw in ("kor", "ko", "korean"):
                    lang_name = "Korean"
                elif lang_raw in ("jpn", "ja", "japanese"):
                    lang_name = "Japanese"
                elif lang_raw not in ("und", "zxx", "mis"):
                    lang_name = lang_raw.capitalize()

                if lang_name != "Unknown" and lang_name not in detected_langs:
                    detected_langs.append(lang_name)

                audio_tracks.append(ProbedAudioTrack(
                    index=int(s.get("index", 0)),
                    codec=s.get("codec_name", ""),
                    channels=int(s.get("channels", 2) or 2),
                    language=lang_name,
                    title=title_raw
                ))

        quality_label = resolve_quality_label(height, width) if (width or height) else "Unknown"

        # Classify Audio
        has_hindi = "Hindi" in detected_langs
        if has_hindi and len(detected_langs) > 1:
            audio_class = "MULTI_AUDIO_INCLUDING_HINDI"
        elif has_hindi and len(detected_langs) == 1:
            audio_class = "HINDI_AUDIO"
        elif "English" in detected_langs and len(detected_langs) == 1:
            audio_class = "ENGLISH"
        elif detected_langs:
            audio_class = "OTHER"
        else:
            audio_class = "UNKNOWN"

        is_playable = bool(video_codec)

        return DiscoveryProbeResult(
            is_playable=is_playable,
            duration_s=duration_s,
            width=width,
            height=height,
            quality_label=quality_label,
            video_codec=video_codec,
            audio_tracks=audio_tracks,
            audio_classification=audio_class,
            detected_languages=detected_langs
        )
