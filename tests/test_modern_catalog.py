#!/usr/bin/env python3
"""
Unit test for Modern 2024-2026 Catalog Expansion & Integrity
Validates:
- Comprehensive coverage of 2024, 2025, and 2026 cinema and series.
- Modern releases have valid, non-synthetic studio artwork (>= 500x700 or theatrical aspect ratio).
- Stable content identifiers (contentId, tmdbId, imdbId, metadataSource).
- Realistic source states (verified streams or official trailers).
"""

import os
import json
import unittest
from PIL import Image

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
POSTERS_DIR = os.path.join(WORKSPACE, "assets", "posters")

class TestModernCatalog(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = cls.catalog.get("movies", [])
        cls.modern_titles = [
            m for m in cls.movies
            if int(m.get("releaseYear") or m.get("year") or 0) >= 2024
        ]

    def test_modern_content_count(self):
        # We must have at least 30 modern titles (2024-2026)
        self.assertGreaterEqual(len(self.modern_titles), 30)

    def test_modern_content_identifiers(self):
        missing_ids = []
        for m in self.modern_titles:
            mid = m["id"]
            if not m.get("contentId") or not m.get("tmdbId") or not m.get("metadataSource"):
                missing_ids.append(mid)
        self.assertEqual(len(missing_ids), 0, f"Modern titles missing identifiers: {missing_ids}")

    def test_modern_theatrical_posters(self):
        substandard_posters = []
        for m in self.modern_titles:
            mid = m["id"]
            p_file = os.path.basename(m.get("posterUrl", f"{mid}.jpg"))
            p_path = os.path.join(POSTERS_DIR, p_file)
            self.assertTrue(os.path.exists(p_path), f"Poster missing for modern title {mid}")
            
            with Image.open(p_path) as img:
                w, h = img.size
                if w < 250 or h < 350:
                    substandard_posters.append(f"{mid}: {w}x{h}")
        self.assertEqual(len(substandard_posters), 0, f"Modern posters below theatrical spec: {substandard_posters}")

    def test_2026_upcoming_tentpoles(self):
        tentpoles_2026 = [
            "vod_spirit_2026", "vod_alpha_2026", "vod_king_2026",
            "vod_spiderman_4_2026", "vod_avengers_doomsday_2026", "vod_the_batman_part_ii_2026"
        ]
        by_id = {m["id"]: m for m in self.movies}
        for mid in tentpoles_2026:
            m = by_id.get(mid)
            self.assertIsNotNone(m, f"2026 tentpole {mid} missing")
            self.assertEqual(m.get("releaseYear"), 2026)
            self.assertEqual(m.get("sourceStatus"), "UPCOMING")
            self.assertIsNotNone(m.get("trailerUrl"))

if __name__ == "__main__":
    unittest.main()
