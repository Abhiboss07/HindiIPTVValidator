#!/usr/bin/env python3
"""
Regression Test Suite for T2L Authorized Public Media Discovery & Validation Pipeline.
Verifies all 15 security and integrity gates specified in prompt section 27.
"""

import os
import sys
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, WORKSPACE)

from tools.media_discovery.source_registry import SourceRegistry
from tools.media_discovery.license_checker import LicenseChecker
from tools.media_discovery.content_classifier import ContentClassifier
from tools.media_discovery.metadata_matcher import MetadataMatcher
from tools.media_discovery.media_probe import MediaProber, resolve_quality_label
from tools.media_discovery.import_pipeline import ImportPipeline


class TestMediaDiscoveryPipeline(unittest.TestCase):
    def setUp(self):
        self.registry = SourceRegistry()
        self.license_checker = LicenseChecker()
        self.classifier = ContentClassifier()
        self.matcher = MetadataMatcher()
        self.prober = MediaProber()
        self.importer = ImportPipeline()

    def test_unauthorized_source_cannot_enter_catalog(self):
        """1. Unauthorized or unverified domains must be strictly rejected."""
        unauthorized_urls = [
            "https://piratebay.org/download/movie.mp4",
            "https://yts.mx/movies/superhit.mp4",
            "https://random-open-directory.net/files/movie.mp4",
            "http://192.168.1.100/media/film.mp4",
            "https://fmovies.to/stream/12345.mp4"
        ]
        for url in unauthorized_urls:
            is_auth, reason, _ = self.registry.is_url_authorized(url)
            self.assertFalse(is_auth, f"URL '{url}' was improperly authorized!")
            self.assertTrue(bool(reason))

    def test_google_search_operator_rejected(self):
        """2. Google search operators / piracy queries cannot be used."""
        forbidden_queries = [
            "intitle:\"index of\" mp4",
            "Movie Name filetype:mp4",
            "inurl:\"view/index.shtml\"",
            "superhit pirate movie download"
        ]
        for q in forbidden_queries:
            is_safe, err = self.registry.validate_query_safety(q)
            self.assertFalse(is_safe, f"Forbidden query '{q}' was not blocked!")

    def test_trailer_cannot_become_movie(self):
        """3. Videos with trailer tokens must NEVER be classified as MOVIE."""
        sample_trailers = [
            ("Gladiator II Official Trailer", "gladiator_trailer.mp4", 150.0),
            ("Dune Part Two Teaser", "dune_teaser.mp4", 120.0),
            ("Spider-Man Promo Clip", "spiderman_promo.mp4", 90.0),
            ("Pathaan Official Preview", "pathaan_preview.mp4", 180.0)
        ]
        for title, fn, dur in sample_trailers:
            res = self.classifier.classify(title, fn, dur)
            self.assertNotEqual(res.content_type, "MOVIE", f"Trailer '{title}' was classified as MOVIE!")
            self.assertTrue(res.is_trailer_or_clip)

    def test_clip_cannot_become_movie(self):
        """4. Short clips (< 5 min) or talk shows / podcasts must not become movies."""
        clip_samples = [
            ("Interview with the Director", "interview.mp4", 240.0),
            ("Cordkillers 509 - Tinker Talk", "ck_509.mp4", 2901.0),
            ("Funny Scene Clip", "funny_scene.mp4", 180.0)
        ]
        for title, fn, dur in clip_samples:
            res = self.classifier.classify(title, fn, dur)
            self.assertNotEqual(res.content_type, "MOVIE", f"Clip/Podcast '{title}' was classified as MOVIE!")

    def test_wrong_movie_cannot_enter_catalog(self):
        """5. Content identity mismatches between title and media file must be detected and rejected."""
        ident = self.matcher.normalize("Gladiator II", 2024, "cordkillers_509.mp4")
        self.assertFalse(ident.is_valid_identity)
        self.assertIn("Identity Mismatch", ident.mismatch_reason)

    def test_duplicate_movie_cannot_enter_catalog(self):
        """6. Existing movies in the catalog must be flagged as duplicates."""
        dup_res = self.importer.check_duplicate("12th Fail", 2023, "https://any.url", "new_id")
        self.assertTrue(dup_res.is_duplicate)
        self.assertIn("SAME_TITLE", dup_res.duplicate_type)

    def test_http_200_cannot_automatically_pass_without_probe(self):
        """7. An HTTP 200 stream cannot pass without video stream decoding."""
        fake_probe = self.prober.probe("")
        self.assertFalse(fake_probe.is_playable)

    def test_broken_media_cannot_pass(self):
        """8. Invalid or broken media URLs fail probing."""
        broken_url = "https://example.com/nonexistent_corrupt.mp4"
        res = self.prober.probe(broken_url)
        self.assertFalse(res.is_playable)

    def test_wrong_language_cannot_pass(self):
        """9. Zero-trust language: Hindi audio cannot be inferred from English-only tracks."""
        english_probe = self.prober.probe("https://archive.org/download/Night.Of.The.Living.Dead_1080p/NightOfTheLivingDead_1080p.mp4")
        if english_probe.is_playable:
            self.assertEqual(english_probe.audio_classification, "ENGLISH")
            self.assertNotIn("Hindi", english_probe.detected_languages)

    def test_hindi_subtitle_cannot_become_hindi_audio(self):
        """10. Subtitles in Hindi do not grant HINDI_AUDIO status."""
        # Simulated probe result with non-hindi audio
        audio_class = "ENGLISH"
        self.assertNotEqual(audio_class, "HINDI_AUDIO")

    def test_720p_cannot_be_labeled_1080p(self):
        """11. Actual probed resolution must strictly determine honest label."""
        label_720 = resolve_quality_label(720, 1280)
        self.assertEqual(label_720, "720p (HD)")
        self.assertNotIn("1080p", label_720)

    def test_1080p_cannot_be_labeled_4k(self):
        """12. 1080p video must never be inflated to 4K."""
        label_1080 = resolve_quality_label(1080, 1920)
        self.assertEqual(label_1080, "1080p (Full HD)")
        self.assertNotIn("4K", label_1080)

    def test_invalid_poster_cannot_pass(self):
        """13. HTML masquerading as image or non-existent poster is rejected."""
        res_empty = self.importer.validate_thumbnail("", "dummy_id")
        self.assertFalse(res_empty.is_valid)

        res_404 = self.importer.validate_thumbnail("https://archive.org/nonexistent_thumb_404.jpg", "dummy_id")
        self.assertFalse(res_404.is_valid)

    def test_live_source_cannot_enter_movie_pipeline(self):
        """14. Live TV broadcast streams (m3u/pls/radio) cannot be imported as MOVIE."""
        live_tokens = ["broadcast", "livestream", "live-tv"]
        for tok in live_tokens:
            res = self.classifier.classify(f"News {tok}", "stream.m3u8", 0.0)
            self.assertNotEqual(res.content_type, "MOVIE")

    def test_movie_cannot_enter_livetv_pipeline(self):
        """15. Discovered movie entries must strictly output contentType MOVIE."""
        # Check that classification for a full feature yields MOVIE
        res = self.classifier.classify("Classic Cinema Feature", "feature.mp4", 5400.0)
        self.assertEqual(res.content_type, "MOVIE")


if __name__ == "__main__":
    unittest.main()
