#!/usr/bin/env python3
import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")

class TestMirzapurForensic(unittest.TestCase):
    def setUp(self):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            self.catalog = json.load(f)
        self.movies = self.catalog.get("movies", [])
        self.mirzapur = next((m for m in self.movies if m["id"] == "series_mirzapur"), None)

    def test_mirzapur_exists(self):
        self.assertIsNotNone(self.mirzapur, "Mirzapur should exist in catalog")

    def test_mirzapur_honest_classification(self):
        self.assertEqual(self.mirzapur.get("sourceState"), "DIRECT_STREAM_AVAILABLE",
                         "Mirzapur must be classified DIRECT_STREAM_AVAILABLE with verified active stream")
        self.assertIsNotNone(self.mirzapur.get("streamUrl"),
                             "Mirzapur root streamUrl must not be null")
        self.assertEqual(self.mirzapur.get("qualityHonestBadge"), "HD 720p",
                         "Mirzapur honest badge must be HD 720p")
        self.assertEqual(self.mirzapur.get("audioClassification"), "HINDI_AUDIO",
                         "Mirzapur must be verified HINDI_AUDIO")

    def test_mirzapur_official_trailer_linked(self):
        trailer = self.mirzapur.get("trailerUrl")
        self.assertIsNotNone(trailer, "Mirzapur must have an official trailer")
        self.assertIn("youtube-nocookie.com/embed", trailer, "Official trailer embed must be valid")

    def test_mirzapur_episodes_linked(self):
        seasons = self.mirzapur.get("seasons", [])
        self.assertTrue(len(seasons) > 0, "Mirzapur must have seasons defined")
        for s in seasons:
            for ep in s.get("episodes", []):
                self.assertIsNotNone(ep.get("streamUrl"), f"Episode {ep.get('id')} streamUrl must not be null")
                self.assertEqual(ep.get("sourceState"), "DIRECT_STREAM_AVAILABLE",
                                 f"Episode {ep.get('id')} sourceState must be DIRECT_STREAM_AVAILABLE")
                self.assertEqual(ep.get("qualityHonestBadge"), "HD 720p")

if __name__ == "__main__":
    unittest.main()
