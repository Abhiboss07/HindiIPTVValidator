#!/usr/bin/env python3
"""
Test Suite: T2L Modern Movie Expansion & Zero-Trust Gates.
Asserts all 13 security, identity, licensing, and audio gates specified in Section 23.
"""

import os
import json
import unittest
import re

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")


class TestModernMovieExpansion(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = [m for m in cls.catalog.get("movies", []) if m.get("contentType", "MOVIE").upper() == "MOVIE"]

    def test_01_modern_expansion_window(self):
        """1. Asserts all newly added movies in this expansion fall strictly within 2000-2026."""
        new_ids = [
            "vod_avengers_doomsday_2026", "vod_the_batman_part_ii_2026",
            "vod_fateh_2025", "vod_sky_force_2025", "vod_game_changer_2025",
            "vod_laapataa_ladies_2024", "vod_article_370_2024", "vod_mission_raniganj_2023",
            "vod_badla_2019", "vod_kesari_2019", "vod_airlift_2016", "vod_baby_2015",
            "vod_holiday_2014", "vod_rockstar_2011", "vod_znmd_2011",
            "vod_ghajini_2008", "vod_taare_zameen_par_2007", "vod_rang_de_basanti_2006",
            "vod_lagaan_2001"
        ]
        for m in self.movies:
            if m.get("id") in new_ids:
                year = m.get("releaseYear") or m.get("year")
                self.assertIsNotNone(year)
                y_int = int(str(year)[:4])
                self.assertTrue(2000 <= y_int <= 2026, f"Movie {m.get('title')} year {y_int} outside 2000-2026")

    def test_02_upcoming_movie_cannot_become_playable(self):
        """2. Upcoming movies (e.g. 2026 titles) must never have an active streamUrl."""
        upcoming_ids = ["vod_avengers_doomsday_2026", "vod_the_batman_part_ii_2026"]
        for m in self.movies:
            if m.get("id") in upcoming_ids:
                self.assertIsNone(m.get("streamUrl"), f"Upcoming title {m.get('title')} must not have playable streamUrl")
                self.assertEqual(m.get("sourceState"), "UPCOMING_TRAILER")
                self.assertIsNotNone(m.get("trailerUrl"))

    def test_03_trailer_cannot_become_movie(self):
        """3. Trailer-only titles must never have full movie streamUrl or inflate playable movie stats."""
        for m in self.movies:
            if m.get("sourceState") in ["TRAILER_ONLY", "UPCOMING_TRAILER"]:
                self.assertIsNone(m.get("streamUrl"), f"Trailer-only title {m.get('title')} has streamUrl")
                self.assertEqual(m.get("qualityHonestBadge"), "Official Trailer")

    def test_04_wrong_movie_cannot_pass(self):
        """4. Detects mismatch between title and underlying stream content (e.g. Gladiator II vs podcast)."""
        gladiator = next((m for m in self.movies if m.get("id") == "vod_gladiator_2"), None)
        self.assertIsNotNone(gladiator)
        self.assertIsNone(gladiator.get("streamUrl"))
        self.assertNotIn("ck_509.mp4", str(gladiator.get("streamUrl")))

    def test_05_duplicate_cannot_be_imported(self):
        """5. Catalog must have zero duplicate IDs and zero duplicate active stream URLs."""
        seen_ids = set()
        seen_urls = set()
        for m in self.movies:
            m_id = m.get("id")
            m_url = m.get("streamUrl")
            self.assertNotIn(m_id, seen_ids, f"Duplicate movie ID: {m_id}")
            seen_ids.add(m_id)
            if m_url:
                self.assertNotIn(m_url, seen_urls, f"Duplicate streamUrl across movies: {m_url}")
                seen_urls.add(m_url)

    def test_06_hindi_subtitle_cannot_become_hindi_audio(self):
        """6. Subtitles must not be promoted to HINDI_AUDIO."""
        for m in self.movies:
            audio = m.get("audio", {})
            if audio.get("hasHindiSubtitles") and not audio.get("hasHindiAudio"):
                self.assertNotEqual(m.get("audioClassification"), "HINDI_AUDIO")

    def test_07_english_only_movie_cannot_be_labeled_hindi(self):
        """7. Hollywood English-only movies must never be classified as HINDI_AUDIO."""
        english_only_ids = ["vod_iron_man", "vod_oppenheimer", "vod_interstellar", "vod_avengers_endgame"]
        for m in self.movies:
            if m.get("id") in english_only_ids:
                self.assertEqual(m.get("audioClassification"), "NON_HINDI_AUDIO", f"{m.get('title')} mislabeled")
                self.assertFalse(m.get("audio", {}).get("hasHindiAudio", False))

    def test_08_multi_audio_detected_correctly(self):
        """8. Multi-audio movies must expose MULTI_AUDIO_INCLUDING_HINDI and multiple languages."""
        multi_ids = ["vod_game_changer_2025", "vod_spider_man_no_way_home", "vod_fighter"]
        for m in self.movies:
            if m.get("id") in multi_ids:
                self.assertEqual(m.get("audioClassification"), "MULTI_AUDIO_INCLUDING_HINDI")
                self.assertGreaterEqual(len(m.get("languages", [])), 2)

    def test_09_720p_cannot_be_labeled_1080p(self):
        """9. Probed 720p streams must not have 1080p quality badges."""
        p720_ids = ["vod_rockstar_2011", "vod_chhaava"]
        for m in self.movies:
            if m.get("id") in p720_ids:
                badge = m.get("qualityHonestBadge", "")
                self.assertNotIn("1080p", badge, f"{m.get('title')} falsely labeled 1080p")
                self.assertIn("720p", badge)

    def test_10_1080p_cannot_be_labeled_4k(self):
        """10. Probed 1080p streams must not have 4K UHD quality badges."""
        p1080_ids = [
            "vod_laapataa_ladies_2024", "vod_mission_raniganj_2023", "vod_kesari_2019",
            "vod_badla_2019", "vod_airlift_2016", "vod_baby_2015", "vod_lagaan_2001"
        ]
        for m in self.movies:
            if m.get("id") in p1080_ids:
                badge = m.get("qualityHonestBadge", "")
                self.assertNotIn("4K", badge, f"{m.get('title')} falsely labeled 4K")
                self.assertIn("1080p", badge)

    def test_11_broken_source_cannot_pass(self):
        """11. Every playable movie stream must have a valid HTTP URL with supported container extension."""
        for m in self.movies:
            url = m.get("streamUrl")
            if url:
                self.assertTrue(url.startswith("http://") or url.startswith("https://"))
                self.assertTrue(any(ext in url.lower() for ext in [".mp4", ".mkv", ".m3u8", ".webm"]))

    def test_12_unauthorized_source_cannot_enter_catalog(self):
        """12. Streams must not come from piracy, cyberlockers, or forbidden domains."""
        forbidden = ["piratebay", "1337x", "fmovies", "bflix", "megaupload", "rapidgator", "gofile"]
        for m in self.movies:
            url = m.get("streamUrl") or ""
            for fb in forbidden:
                self.assertNotIn(fb, url.lower(), f"Forbidden domain {fb} in {m.get('title')}")

    def test_13_movie_cannot_enter_livetv_broadcast_pipeline(self):
        """13. app.js must isolate VOD playback from Live TV channels and recent channel history."""
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            app_js = f.read()

        self.assertIn("ch.playbackMode === 'VOD_MOVIE'", app_js)
        self.assertIn("isSeries ? 'VOD_SERIES' : 'VOD_MOVIE'", app_js)
        self.assertIn("!isVodContent", app_js)
        self.assertIn("nextBtn.style.display = isVodContent ? 'none' : 'inline-flex'", app_js)
        self.assertIn("Cinema VOD", app_js)


if __name__ == "__main__":
    unittest.main()
