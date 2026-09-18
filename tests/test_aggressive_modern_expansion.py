#!/usr/bin/env python3
"""
Test Suite: Section 20 - Automated Regression Tests for Aggressive Modern Expansion.
Asserts all 16 required conditions:
[✓] 2020 movie accepted correctly
[✓] 2021 movie accepted correctly
[✓] 2022 movie accepted correctly
[✓] 2023 movie accepted correctly
[✓] 2024 movie accepted correctly
[✓] 2025 movie accepted correctly
[✓] released 2026 movie accepted correctly
[✓] upcoming 2026 movie cannot become playable
[✓] trailer cannot become movie
[✓] old movie cannot be mislabeled as new
[✓] wrong source cannot pass
[✓] Hindi subtitle cannot become Hindi audio
[✓] Hindi audio is detected correctly
[✓] multi-audio is detected correctly
[✓] 1080p cannot be mislabeled 4K
[✓] duplicate movie cannot be imported
"""

import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
POSTERS_DIR = os.path.join(WORKSPACE, "assets", "posters")
ANDROID_POSTERS_DIR = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "posters")


class TestAggressiveModernExpansion(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = [m for m in cls.catalog.get("movies", []) if m.get("contentType", "MOVIE").upper() == "MOVIE"]

    def test_01_2020_movie_accepted_correctly(self):
        """[✓] 2020 movie accepted correctly"""
        ids_2020 = ["vod_ala_vaikunthapurramuloo_2020", "vod_ludo_2020", "vod_thappad_2020"]
        found = 0
        for m in self.movies:
            if m.get("id") in ids_2020:
                self.assertEqual(m.get("releaseYear") or m.get("year"), 2020)
                self.assertIsNotNone(m.get("streamUrl"))
                self.assertTrue(m.get("streamUrl").startswith("https://"))
                self.assertGreater(m.get("duration", 0), 3600)  # > 1 hour
                # Verify poster existence in both dirs
                self.assertTrue(os.path.exists(os.path.join(WORKSPACE, m.get("posterUrl"))))
                self.assertTrue(os.path.exists(os.path.join(ANDROID_POSTERS_DIR, f"{m['id']}.jpg")))
                found += 1
        self.assertEqual(found, len(ids_2020))

    def test_02_2021_movie_accepted_correctly(self):
        """[✓] 2021 movie accepted correctly"""
        ids_2021 = ["vod_minnal_murali_2021", "vod_sardar_udham_2021", "vod_jai_bhim_2021"]
        found = 0
        for m in self.movies:
            if m.get("id") in ids_2021:
                self.assertEqual(m.get("releaseYear") or m.get("year"), 2021)
                self.assertIsNotNone(m.get("streamUrl"))
                self.assertTrue(m.get("streamUrl").startswith("https://"))
                self.assertGreater(m.get("duration", 0), 3600)
                self.assertTrue(os.path.exists(os.path.join(WORKSPACE, m.get("posterUrl"))))
                self.assertTrue(os.path.exists(os.path.join(ANDROID_POSTERS_DIR, f"{m['id']}.jpg")))
                found += 1
        self.assertEqual(found, len(ids_2021))

    def test_03_2022_movie_accepted_correctly(self):
        """[✓] 2022 movie accepted correctly"""
        ids_2022 = ["vod_vikram_2022", "vod_sita_ramam_2022", "vod_karthikeya_2_2022", "vod_777_charlie_2022"]
        found = 0
        for m in self.movies:
            if m.get("id") in ids_2022:
                self.assertEqual(m.get("releaseYear") or m.get("year"), 2022)
                self.assertIsNotNone(m.get("streamUrl"))
                self.assertTrue(m.get("streamUrl").startswith("https://"))
                self.assertGreater(m.get("duration", 0), 3600)
                self.assertTrue(os.path.exists(os.path.join(WORKSPACE, m.get("posterUrl"))))
                self.assertTrue(os.path.exists(os.path.join(ANDROID_POSTERS_DIR, f"{m['id']}.jpg")))
                found += 1
        self.assertEqual(found, len(ids_2022))

    def test_04_2023_movie_accepted_correctly(self):
        """[✓] 2023 movie accepted correctly"""
        ids_2023 = ["vod_bandaa_2023", "vod_sam_bahadur_2023"]
        found = 0
        for m in self.movies:
            if m.get("id") in ids_2023:
                self.assertEqual(m.get("releaseYear") or m.get("year"), 2023)
                self.assertIsNotNone(m.get("streamUrl"))
                self.assertTrue(m.get("streamUrl").startswith("https://"))
                self.assertGreater(m.get("duration", 0), 3600)
                self.assertTrue(os.path.exists(os.path.join(WORKSPACE, m.get("posterUrl"))))
                self.assertTrue(os.path.exists(os.path.join(ANDROID_POSTERS_DIR, f"{m['id']}.jpg")))
                found += 1
        self.assertEqual(found, len(ids_2023))

    def test_05_2024_movie_accepted_correctly(self):
        """[✓] 2024 movie accepted correctly"""
        ids_2024 = [
            "vod_aavesham_2024", "vod_bramayugam_2024", "vod_aadujeevitham_2024",
            "vod_maharaja_2024", "vod_premalu_2024", "vod_manjummel_boys_2024",
            "vod_amar_singh_chamkila_2024", "vod_blackout_2024", "vod_hanuman_2024",
            "vod_kill_2024", "vod_crew_2024"
        ]
        found = 0
        for m in self.movies:
            if m.get("id") in ids_2024:
                self.assertEqual(m.get("releaseYear") or m.get("year"), 2024)
                self.assertIsNotNone(m.get("streamUrl"))
                self.assertTrue(m.get("streamUrl").startswith("https://"))
                self.assertGreater(m.get("duration", 0), 3600)
                self.assertTrue(os.path.exists(os.path.join(WORKSPACE, m.get("posterUrl"))))
                self.assertTrue(os.path.exists(os.path.join(ANDROID_POSTERS_DIR, f"{m['id']}.jpg")))
                found += 1
        self.assertEqual(found, len(ids_2024))

    def test_06_2025_movie_accepted_correctly(self):
        """[✓] 2025 movie accepted correctly"""
        ids_2025 = ["vod_fateh_2025", "vod_sky_force_2025", "vod_game_changer_2025", "vod_chhavaa"]
        found = 0
        for m in self.movies:
            if m.get("id") in ids_2025:
                self.assertEqual(m.get("releaseYear") or m.get("year"), 2025)
                self.assertIsNotNone(m.get("streamUrl"))
                self.assertTrue(m.get("streamUrl").startswith("https://"))
                self.assertTrue(os.path.exists(os.path.join(WORKSPACE, m.get("posterUrl"))))
                found += 1
        self.assertEqual(found, len(ids_2025))

    def test_07_released_2026_movie_accepted_correctly(self):
        """[✓] released 2026 movie accepted correctly: verifies gate rule that 2026 titles require full runtime to be playable."""
        for m in self.movies:
            yr = m.get("releaseYear") or m.get("year")
            if yr == 2026:
                if m.get("streamUrl"):
                    # If any 2026 title has streamUrl, it MUST be fully released with duration >= 40m
                    self.assertGreaterEqual(m.get("duration", 0), 2400)
                    self.assertEqual(m.get("sourceState"), "ACTIVE_STREAM")
                else:
                    # Otherwise it must be upcoming trailer only
                    self.assertIn(m.get("sourceState"), ["UPCOMING_TRAILER", "TRAILER_ONLY"])

    def test_08_upcoming_2026_movie_cannot_become_playable(self):
        """[✓] upcoming 2026 movie cannot become playable"""
        upcoming_2026_ids = ["vod_avengers_doomsday_2026", "vod_the_batman_part_ii_2026"]
        for m in self.movies:
            if m.get("id") in upcoming_2026_ids:
                self.assertIsNone(m.get("streamUrl"), f"Upcoming title {m['title']} must not have playable streamUrl")
                self.assertEqual(m.get("sourceState"), "UPCOMING_TRAILER")
                self.assertIsNotNone(m.get("trailerUrl"))

    def test_09_trailer_cannot_become_movie(self):
        """[✓] trailer cannot become movie"""
        for m in self.movies:
            if m.get("sourceState") in ["TRAILER_ONLY", "UPCOMING_TRAILER"]:
                self.assertIsNone(m.get("streamUrl"), f"Trailer-only title {m['title']} has streamUrl")
                self.assertEqual(m.get("qualityHonestBadge"), "Official Trailer")
                # Theatrical duration retained for metadata display

    def test_10_old_movie_cannot_be_mislabeled_as_new(self):
        """[✓] old movie cannot be mislabeled as new"""
        classic_ids = {
            "vod_sholay_1975": 1975,
            "vod_lagaan_2001": 2001,
            "vod_3_idiots": 2009,
            "vod_ghajini_2008": 2008,
            "vod_taare_zameen_par_2007": 2007,
            "vod_rang_de_basanti_2006": 2006
        }
        for m in self.movies:
            if m.get("id") in classic_ids:
                expected_year = classic_ids[m["id"]]
                actual_year = m.get("releaseYear") or m.get("year")
                self.assertEqual(actual_year, expected_year, f"{m['title']} mislabeled year")
                self.assertLess(actual_year, 2020)

    def test_11_wrong_source_cannot_pass(self):
        """[✓] wrong source cannot pass"""
        gladiator = next((m for m in self.movies if m.get("id") == "vod_gladiator_2"), None)
        self.assertIsNotNone(gladiator)
        self.assertIsNone(gladiator.get("streamUrl"), "Gladiator II corrupted source not rejected")

        # Verify Maharaja does not link to Blackout stream
        maharaja = next((m for m in self.movies if m.get("id") == "vod_maharaja_2024"), None)
        blackout = next((m for m in self.movies if m.get("id") == "vod_blackout_2024"), None)
        self.assertIsNotNone(maharaja)
        self.assertIsNotNone(blackout)
        self.assertNotEqual(maharaja.get("streamUrl"), blackout.get("streamUrl"))

    def test_12_hindi_subtitle_cannot_become_hindi_audio(self):
        """[✓] Hindi subtitle cannot become Hindi audio"""
        for m in self.movies:
            audio = m.get("audio", {})
            if audio.get("hasHindiSubtitles") and not audio.get("hasHindiAudio"):
                self.assertNotEqual(
                    m.get("audioClassification"),
                    "HINDI_AUDIO",
                    f"{m['title']} has subtitles only but was classified as HINDI_AUDIO"
                )

    def test_13_hindi_audio_is_detected_correctly(self):
        """[✓] Hindi audio is detected correctly"""
        hindi_titles = [
            "vod_sam_bahadur_2023", "vod_sardar_udham_2021", "vod_ludo_2020",
            "vod_thappad_2020", "vod_amar_singh_chamkila_2024", "vod_kill_2024",
            "vod_crew_2024", "vod_hanuman_2024", "vod_aadujeevitham_2024"
        ]
        for m in self.movies:
            if m.get("id") in hindi_titles:
                self.assertEqual(m.get("audioClassification"), "HINDI_AUDIO", f"{m['title']} audio classification incorrect")
                self.assertTrue(m.get("audio", {}).get("hasHindiAudio", False))

    def test_14_multi_audio_is_detected_correctly(self):
        """[✓] multi-audio is detected correctly"""
        multi_titles = [
            "vod_aavesham_2024", "vod_bramayugam_2024", "vod_vikram_2022",
            "vod_minnal_murali_2021", "vod_ala_vaikunthapurramuloo_2020"
        ]
        for m in self.movies:
            if m.get("id") in multi_titles:
                self.assertEqual(
                    m.get("audioClassification"),
                    "MULTI_AUDIO_INCLUDING_HINDI",
                    f"{m['title']} multi-audio classification failed"
                )
                self.assertGreaterEqual(len(m.get("languages", [])), 2)
                self.assertTrue(m.get("audio", {}).get("hasHindiAudio", False))

    def test_15_1080p_cannot_be_mislabeled_4k(self):
        """[✓] 1080p cannot be mislabeled 4K"""
        p1080_titles = [
            "vod_aavesham_2024", "vod_premalu_2024", "vod_manjummel_boys_2024",
            "vod_amar_singh_chamkila_2024", "vod_hanuman_2024", "vod_bandaa_2023",
            "vod_sam_bahadur_2023", "vod_777_charlie_2022", "vod_minnal_murali_2021",
            "vod_ala_vaikunthapurramuloo_2020"
        ]
        for m in self.movies:
            if m.get("id") in p1080_titles:
                badge = m.get("qualityHonestBadge", "")
                self.assertIn("1080p", badge, f"{m['title']} badge missing 1080p")
                self.assertNotIn("4K", badge, f"{m['title']} falsely labeled 4K")
                self.assertEqual(m.get("resolution"), "1080p")

    def test_16_duplicate_movie_cannot_be_imported(self):
        """[✓] duplicate movie cannot be imported"""
        seen_ids = set()
        seen_urls = set()
        seen_titles_years = set()

        for m in self.movies:
            mid = m.get("id")
            url = m.get("streamUrl")
            title = m.get("title", "").strip().lower()
            year = str(m.get("releaseYear") or m.get("year") or "")[:4]

            self.assertNotIn(mid, seen_ids, f"Duplicate movie ID detected: {mid}")
            seen_ids.add(mid)

            if url:
                self.assertNotIn(url, seen_urls, f"Duplicate active stream URL: {url} on {mid}")
                seen_urls.add(url)

                norm_key = (title, year)
                self.assertNotIn(norm_key, seen_titles_years, f"Duplicate playable title/year: {title} ({year})")
                seen_titles_years.add(norm_key)


if __name__ == "__main__":
    unittest.main()
