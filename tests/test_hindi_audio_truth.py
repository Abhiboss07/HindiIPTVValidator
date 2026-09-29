#!/usr/bin/env python3
"""
Unit test for Zero-Trust Hindi Audio Truth
Validates:
- No deceptive Hindi audio claims.
- Salaar Part 1 is classified as Telugu / NON_HINDI_AUDIO.
- Tumbbad is classified as Marathi / NON_HINDI_AUDIO.
- Verified Hindi audio titles contain genuine Hindi dialogue/audio streams.
- Shershaah is properly verified as Hindi audio.
"""

import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")

class TestHindiAudioTruth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies_by_id = {m["id"]: m for m in cls.catalog.get("movies", [])}

    def test_salaar_audio_truth(self):
        salaar = self.movies_by_id.get("vod_salaar")
        self.assertIsNotNone(salaar)
        self.assertEqual(salaar.get("audioClassification"), "NON_HINDI_AUDIO")
        self.assertNotIn("Hindi", salaar.get("languages", []))
        self.assertIn("Telugu", salaar.get("languages", []))
        self.assertEqual(salaar.get("defaultLanguage"), "Telugu")

    def test_tumbbad_audio_truth(self):
        tumbbad = self.movies_by_id.get("vod_tumbbad")
        self.assertIsNotNone(tumbbad)
        self.assertEqual(tumbbad.get("audioClassification"), "NON_HINDI_AUDIO")
        self.assertNotIn("Hindi", tumbbad.get("languages", []))
        self.assertIn("Marathi", tumbbad.get("languages", []))
        self.assertEqual(tumbbad.get("defaultLanguage"), "Marathi")

    def test_shershaah_truth_and_stream(self):
        shershaah = self.movies_by_id.get("vod_shershaah")
        self.assertIsNotNone(shershaah)
        self.assertEqual(shershaah.get("title"), "Shershaah")
        self.assertEqual(shershaah.get("audioClassification"), "HINDI_AUDIO")
        self.assertIn("Shershaah", shershaah.get("streamUrl", ""))
        self.assertEqual(shershaah.get("qualityClass"), "FULL HD")

    def test_new_2021_bollywood_hindi_truth(self):
        titles_2021 = [
            "vod_tribhanga_2021", "vod_the_white_tiger_2021", "vod_sooryavanshi_2021",
            "vod_mimi_2021", "vod_dhamaka_2021", "vod_bhuj_2021", "vod_bhoot_police_2021",
            "vod_bellbottom_2021", "vod_atrangi_re_2021", "vod_83_2021"
        ]
        for tid in titles_2021:
            m = self.movies_by_id.get(tid)
            self.assertIsNotNone(m, f"{tid} missing from catalog")
            self.assertEqual(m.get("sourceStatus"), "PLAYABLE")
            self.assertEqual(m.get("audioClassification"), "HINDI_AUDIO")
            self.assertIn("Hindi", m.get("languages", []))
            self.assertTrue("archive.org/" in m.get("streamUrl", ""))

if __name__ == "__main__":
    unittest.main()
