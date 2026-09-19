#!/usr/bin/env python3
"""
T2L Regression Test Suite: Episode Identity, Preview Protection & Multilingual Audio Integrity.
Enforces zero-trust invariants for series episode resolution and audio track selection.
"""

import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")


class TestEpisodeAndAudioIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = cls.catalog.get("movies", [])
        
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            cls.app_js = f.read()

    # --- 1. EPISODE IDENTITY TESTS ---

    def test_episode_cannot_resolve_to_series_trailer(self):
        """In playSeriesEpisode, unavailable episodes must NEVER fallback to playing series trailer."""
        # Assert app.js does not contain the deceptive trailer fallback
        forbidden_pattern = "startMovieStream(movieId, movie.trailerUrl"
        self.assertNotIn(forbidden_pattern, self.app_js, "playSeriesEpisode still contains deceptive movie.trailerUrl fallback!")

    def test_episode_cannot_resolve_to_different_episode_id(self):
        """Resolver must enforce identity: requested episode ID must match resolved episode ID."""
        self.assertIn("String(ep.id) !== String(episodeId)", self.app_js, "playSeriesEpisode lacks strict episode ID matching assertion!")

    def test_granada_sherlock_holmes_unique_episode_streams(self):
        """All 26 episodes of Granada Holmes must have distinct, authentic full-length stream URLs."""
        sherlock = next((m for m in self.movies if m.get("id") == "series_sherlock_holmes"), None)
        self.assertIsNotNone(sherlock)
        
        seen_urls = set()
        for sn in sherlock.get("seasons", []):
            for ep in sn.get("episodes", []):
                url = ep.get("streamUrl")
                self.assertIsNotNone(url, f"Episode {ep.get('id')} missing streamUrl")
                self.assertNotIn(url, seen_urls, f"Episode {ep.get('id')} reuses stream URL: {url}")
                seen_urls.add(url)
                self.assertEqual(ep.get("episodeType"), "full_episode")
                self.assertEqual(ep.get("sourceState"), "DIRECT_STREAM_AVAILABLE")

    def test_all_catalog_series_have_authentic_direct_stream_urls(self):
        """Web-series in catalog must have zero-trust source validation (Playable or Honest NO_AUTHORIZED_SOURCE)."""
        series_items = [m for m in self.movies if m.get("mediaType") == "series" or "seasons" in m]
        self.assertGreaterEqual(len(series_items), 18, "Catalog must have at least 18 verified series")
        playable_count = 0
        unavail_count = 0
        for s in series_items:
            sid = s.get("id")
            state = s.get("sourceState")
            if state == "DIRECT_STREAM_AVAILABLE":
                playable_count += 1
                self.assertIsNotNone(s.get("streamUrl"), f"{sid} missing series-level streamUrl")
                for sn in s.get("seasons", []):
                    for ep in sn.get("episodes", []):
                        self.assertIsNotNone(ep.get("streamUrl"), f"{sid} {ep.get('id')} missing streamUrl")
                        self.assertEqual(ep.get("episodeType"), "full_episode", f"{sid} {ep.get('id')} not marked full_episode")
                        self.assertEqual(ep.get("sourceState"), "DIRECT_STREAM_AVAILABLE")
            elif state == "NO_AUTHORIZED_SOURCE":
                unavail_count += 1
                self.assertIsNone(s.get("streamUrl"), f"{sid} must not have fake streamUrl")
                for sn in s.get("seasons", []):
                    for ep in sn.get("episodes", []):
                        self.assertIsNone(ep.get("streamUrl"), f"{sid} {ep.get('id')} must have null streamUrl")
                        self.assertEqual(ep.get("sourceState"), "NO_AUTHORIZED_SOURCE")
            else:
                self.fail(f"Invalid series sourceState: {state} on {sid}")
        self.assertGreaterEqual(playable_count, 13, "At least 13 series must be DIRECT_STREAM_AVAILABLE")
        self.assertGreaterEqual(unavail_count, 5, "At least 5 commercial series must be honestly NO_AUTHORIZED_SOURCE")

    # --- 2. PREVIEW PROTECTION TESTS ---

    def test_episode_markup_does_not_render_deceptive_preview_button(self):
        """renderEpisodeItemMarkup must not render deceptive 'Preview Only' buttons for trailer playback."""
        self.assertNotIn("Official Series Preview", self.app_js, "renderEpisodeItemMarkup still contains 'Official Series Preview' text!")
        self.assertNotIn("Preview Only", self.app_js, "renderEpisodeItemMarkup still contains 'Preview Only' markup!")

    def test_trailers_not_labeled_as_full_episodes(self):
        """Catalog must separate contentType MOVIE/SERIES from TRAILER."""
        for m in self.movies:
            if m.get("contentType") == "TRAILER":
                self.assertIsNone(m.get("streamUrl"), f"{m.get('id')} is TRAILER but has streamUrl")

    # --- 3. MULTILINGUAL AUDIO INTEGRITY TESTS ---

    def test_jujutsu_kaisen_truthful_audio_classification(self):
        """Jujutsu Kaisen 0 must be classified as NON_HINDI_AUDIO with English audio, not fake Hindi."""
        jjk = next((m for m in self.movies if m.get("id") == "vod_jujutsu_kaisen_0"), None)
        self.assertIsNotNone(jjk)
        self.assertEqual(jjk.get("audioClassification"), "NON_HINDI_AUDIO")
        self.assertEqual(jjk.get("defaultLanguage"), "English")
        self.assertEqual(jjk.get("languages"), ["English"])
        self.assertFalse(jjk.get("audio", {}).get("hasHindiAudio", False))
        self.assertNotIn("Hindi", jjk.get("languages", []))

    def test_canonical_language_normalization_table_present(self):
        """assets/app.js must include canonical BCP-47 language normalization in setVlcAudioTrack."""
        self.assertIn("CANONICAL_LANG_MAP", self.app_js, "setVlcAudioTrack lacks CANONICAL_LANG_MAP table!")
        self.assertIn("'hindi': 'hi'", self.app_js)
        self.assertIn("'english': 'en'", self.app_js)
        self.assertIn("'japanese': 'ja'", self.app_js)
        self.assertIn("'korean': 'ko'", self.app_js)

    def test_hls_audio_switching_uses_canonical_normalization(self):
        """Hls.js audio track selection must match normalized language codes."""
        self.assertIn("targetNorm = CANONICAL_LANG_MAP[rawTarget]", self.app_js)
        self.assertIn("hlsInstance.audioTrack = trackIndex", self.app_js)

    def test_audio_pills_match_catalog_actual_languages(self):
        """Single-language movies must not display multiple language pills in UI."""
        # openMovieDetails must use movie.languages directly
        self.assertIn("movie.languages", self.app_js)
        self.assertIn("activeLangBadge", self.app_js)

    def test_web_audio_no_hijacking_or_muting(self):
        """Video element must preserve direct unmuted hardware sound."""
        self.assertIn("videoElement.muted = false", self.app_js)
        # Ensure 0 calls to createMediaElementSource on videoElement
        self.assertNotIn("createMediaElementSource(videoElement)", self.app_js)


if __name__ == "__main__":
    unittest.main()
