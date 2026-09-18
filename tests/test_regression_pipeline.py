#!/usr/bin/env python3
"""
T2L Regression Test Suite: Pipeline Isolation, Hindi Language Integrity & Content Integrity.
Asserts zero-trust content pipeline separation and prevents regression of forensic fixes.
"""

import os
import re
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")


class TestPipelineRegression(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = cls.catalog.get("movies", [])
        
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            cls.app_js = f.read()

    def test_gladiator_cannot_enter_broadcast_pipeline(self):
        """Forensic Fix: Gladiator II must never route to broadcast, live TV, or podcast streams."""
        gladiator = next((m for m in self.movies if m.get("id") == "vod_gladiator_2"), None)
        self.assertIsNotNone(gladiator, "Gladiator II should exist in catalog")
        
        # Must be classified as a MOVIE, never BROADCAST or LIVE_CHANNEL
        self.assertEqual(gladiator.get("contentType"), "MOVIE")
        self.assertNotEqual(gladiator.get("mediaType"), "broadcast")
        self.assertNotEqual(gladiator.get("mediaType"), "channel")
        
        # Must NOT be linked to ck_509.mp4 (Cordkillers podcast) or any talk show / podcast
        stream_url = gladiator.get("streamUrl") or ""
        trailer_url = gladiator.get("trailerUrl") or ""
        all_urls = (stream_url + " " + trailer_url).lower()
        
        forbidden = ["ck_509", "cordkillers", "podcast", "review", "reaction"]
        for f in forbidden:
            self.assertNotIn(f, all_urls, f"Gladiator media URL contains forbidden token '{f}'")
            
        # Since full feature is not authorized on archive.org, must be TRAILER_ONLY
        self.assertEqual(gladiator.get("sourceState"), "TRAILER_ONLY")
        self.assertIsNone(gladiator.get("streamUrl"))
        self.assertTrue(bool(gladiator.get("trailerUrl")))
        self.assertEqual(gladiator.get("audioClassification"), "NON_HINDI_AUDIO")

    def test_movie_cannot_enter_radio_pipeline(self):
        """Movies must never route to audio-only radio pipeline."""
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title")
            ctype = m.get("contentType", "MOVIE")
            self.assertIn(ctype, ["MOVIE", "SERIES"], f"{title} ({mid}) has invalid contentType {ctype}")
            self.assertNotEqual(m.get("mediaType"), "radio", f"{title} ({mid}) has mediaType 'radio'")
            
            s_url = m.get("streamUrl") or ""
            self.assertFalse(s_url.endswith(".pls") or s_url.endswith(".m3u"), f"{title} ({mid}) has radio playlist URL")

    def test_movie_cannot_enter_livetv_pipeline(self):
        """Movies and series must never have IPTV channel or broadcast attributes."""
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title")
            self.assertNotIn("channel_id", m, f"{title} ({mid}) has live TV channel_id")
            self.assertNotIn("tvg_id", m, f"{title} ({mid}) has IPTV tvg_id")
            self.assertNotEqual(m.get("contentType"), "LIVE_CHANNEL", f"{title} ({mid}) has LIVE_CHANNEL contentType")

    def test_trailer_cannot_become_full_movie(self):
        """Trailers and previews must not be labeled as full movies with streamUrl."""
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title")
            s_state = m.get("sourceState")
            if s_state == "TRAILER_ONLY":
                self.assertIsNone(
                    m.get("streamUrl"),
                    f"{title} ({mid}) is TRAILER_ONLY but has non-null streamUrl: {m.get('streamUrl')}"
                )
                self.assertTrue(
                    bool(m.get("trailerUrl")),
                    f"{title} ({mid}) is TRAILER_ONLY but has no trailerUrl"
                )
                badge = m.get("qualityHonestBadge", "").lower()
                self.assertIn("trailer", badge, f"{title} ({mid}) badge does not indicate trailer: {badge}")

    def test_episode_cannot_resolve_to_wrong_episode(self):
        """Web-series must have sequential 1..N seasons and 1..M episodes with unique URLs."""
        series_items = [m for m in self.movies if m.get("mediaType") == "series" or "seasons" in m]
        self.assertGreater(len(series_items), 0, "There should be series in the catalog")
        
        for s in series_items:
            sid = s.get("id")
            title = s.get("title")
            seasons = s.get("seasons", [])
            self.assertGreater(len(seasons), 0, f"Series {title} ({sid}) has no seasons")
            
            all_episode_urls = []
            expected_season = 1
            for season in seasons:
                s_num = int(season.get("seasonNumber", 0))
                self.assertEqual(s_num, expected_season, f"{title} season out of order: got {s_num}, expected {expected_season}")
                expected_season += 1
                
                episodes = season.get("episodes", [])
                self.assertGreater(len(episodes), 0, f"{title} S{s_num} has no episodes")
                
                expected_ep = 1
                for ep in episodes:
                    e_num = int(ep.get("episodeNumber", 0))
                    self.assertEqual(e_num, expected_ep, f"{title} S{s_num}E{e_num} out of order: expected {expected_ep}")
                    expected_ep += 1
                    
                    ep_url = ep.get("streamUrl")
                    if ep_url:
                        self.assertNotIn(
                            ep_url,
                            all_episode_urls,
                            f"{title} S{s_num}E{e_num} duplicates stream URL of another episode: {ep_url}"
                        )
                        all_episode_urls.append(ep_url)

    def test_hindi_metadata_cannot_falsely_imply_hindi_audio(self):
        """Zero-Trust Audio: NON_HINDI_AUDIO titles must never claim Hindi audio."""
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title")
            audio_class = m.get("audioClassification")
            audio_obj = m.get("audio", {})
            langs = m.get("languages", [])
            
            if audio_class == "NON_HINDI_AUDIO":
                self.assertFalse(
                    audio_obj.get("hasHindiAudio", False),
                    f"{title} ({mid}) is NON_HINDI_AUDIO but hasHindiAudio is True"
                )
                self.assertNotIn(
                    "Hindi",
                    langs,
                    f"{title} ({mid}) is NON_HINDI_AUDIO but lists Hindi in languages"
                )

    def test_hindi_subtitles_cannot_be_reported_as_hindi_audio(self):
        """Titles with only Hindi subtitles must not be labeled as Hindi Audio."""
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title")
            audio_class = m.get("audioClassification")
            audio_obj = m.get("audio", {})
            
            if audio_class == "HINDI_SUBTITLE_ONLY":
                self.assertFalse(
                    audio_obj.get("hasHindiAudio", False),
                    f"{title} ({mid}) has Hindi subtitles only, but hasHindiAudio is True"
                )
                self.assertTrue(
                    audio_obj.get("hasHindiSubtitles", False),
                    f"{title} ({mid}) is HINDI_SUBTITLE_ONLY but hasHindiSubtitles is False"
                )

    def test_english_only_source_cannot_be_labeled_hindi(self):
        """Verified Hollywood English films must be strictly NON_HINDI_AUDIO."""
        english_titles = [
            "vod_dark_knight", "vod_spider_verse", "vod_oppenheimer",
            "vod_alien_romulus", "vod_the_batman", "vod_top_gun_maverick",
            "vod_his_girl_friday", "vod_bbb_720p", "series_sherlock_holmes"
        ]
        for mid in english_titles:
            m = next((item for item in self.movies if item.get("id") == mid), None)
            if m:
                self.assertEqual(
                    m.get("audioClassification"),
                    "NON_HINDI_AUDIO",
                    f"{m.get('title')} ({mid}) should be NON_HINDI_AUDIO, got {m.get('audioClassification')}"
                )

    def test_multi_audio_source_exposes_actual_tracks(self):
        """Multi-Audio items must have multiple languages with Hindi included."""
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title")
            if m.get("audioClassification") == "MULTI_AUDIO_INCLUDING_HINDI":
                langs = m.get("languages", [])
                self.assertGreater(
                    len(langs), 1,
                    f"{title} ({mid}) is MULTI_AUDIO_INCLUDING_HINDI but has < 2 languages: {langs}"
                )
                self.assertIn(
                    "Hindi",
                    langs,
                    f"{title} ({mid}) is MULTI_AUDIO_INCLUDING_HINDI but does not include Hindi: {langs}"
                )

    def test_no_duplicate_movies(self):
        """All catalog items must have unique IDs and unique title+year combinations."""
        seen_ids = set()
        seen_title_years = set()
        for m in self.movies:
            mid = m.get("id")
            title = m.get("title", "").strip().lower()
            year = str(m.get("year", "")).strip()
            key = f"{title}_{year}"
            
            self.assertNotIn(mid, seen_ids, f"Duplicate movie ID found: {mid}")
            seen_ids.add(mid)
            
            # Allow series with multiple seasons if titles differ
            if m.get("mediaType") != "series":
                self.assertNotIn(key, seen_title_years, f"Duplicate movie title and year: {title} ({year})")
                seen_title_years.add(key)

    def test_vod_pipeline_isolation_in_app_js(self):
        """Assets/app.js must strictly isolate VOD playback from Live TV channels."""
        # 1. Check that VOD content does not write to Live TV recents (aakash_recents)
        self.assertIn("!isVodContent", self.app_js, "app.js must guard aakash_recents behind !isVodContent")
        
        # 2. Check that startTorrentPlayback sets VOD_MOVIE / VOD_SERIES
        self.assertIn("VOD_MOVIE", self.app_js, "app.js must support VOD_MOVIE playbackMode")
        self.assertIn("VOD_SERIES", self.app_js, "app.js must support VOD_SERIES playbackMode")
        
        # 3. Check that VOD error state provides Close / Retry rather than next channel
        self.assertIn("btnPlayerErrorClose", self.app_js, "app.js must provide close button for VOD error state")


if __name__ == "__main__":
    unittest.main()
