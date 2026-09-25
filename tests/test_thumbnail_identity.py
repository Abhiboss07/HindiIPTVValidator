#!/usr/bin/env python3
"""
Unit test for Zero-Trust Thumbnail Identity
Validates:
- All catalog items have poster files present locally in assets/posters and android assets.
- Files are valid images (decodable by PIL).
- Theatrical dimensions standard: minimum 250 width, 350 height.
- File size > 10KB (rejecting empty or corrupt placeholders).
"""

import os
import json
import unittest
from PIL import Image

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
POSTERS_DIR = os.path.join(WORKSPACE, "assets", "posters")
ANDROID_POSTERS_DIR = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "posters")

class TestThumbnailIdentity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = cls.catalog.get("movies", [])

    def test_catalog_has_items(self):
        self.assertGreaterEqual(len(self.movies), 150)

    def test_all_posters_exist_locally(self):
        missing = []
        for m in self.movies:
            mid = m["id"]
            poster_file = os.path.basename(m.get("posterUrl", f"{mid}.jpg"))
            local_path = os.path.join(POSTERS_DIR, poster_file)
            if not os.path.exists(local_path):
                missing.append(f"{mid}: {poster_file}")
        self.assertEqual(len(missing), 0, f"Missing local posters: {missing}")

    def test_all_posters_mirrored_to_android_assets(self):
        missing = []
        for m in self.movies:
            mid = m["id"]
            poster_file = os.path.basename(m.get("posterUrl", f"{mid}.jpg"))
            android_path = os.path.join(ANDROID_POSTERS_DIR, poster_file)
            if not os.path.exists(android_path):
                missing.append(f"{mid}: {poster_file}")
        self.assertEqual(len(missing), 0, f"Missing Android mirrored posters: {missing}")

    def test_poster_dimensions_and_validity(self):
        substandard = []
        for m in self.movies:
            mid = m["id"]
            poster_file = os.path.basename(m.get("posterUrl", f"{mid}.jpg"))
            local_path = os.path.join(POSTERS_DIR, poster_file)
            size = os.path.getsize(local_path)
            if size < 10000:
                substandard.append(f"{mid}: size {size} < 10KB")
                continue
            try:
                with Image.open(local_path) as img:
                    w, h = img.size
                    if w < 250 or h < 350:
                        substandard.append(f"{mid}: dimensions {w}x{h} below 250x350")
            except Exception as e:
                substandard.append(f"{mid}: invalid image ({e})")
        self.assertEqual(len(substandard), 0, f"Substandard/invalid posters found: {substandard}")

    def test_target_posters_identity(self):
        targets = ["vod_salaar", "vod_tumbbad", "vod_spirit_2026", "vod_spiderman_4_2026", "vod_king_2026", "vod_alpha_2026"]
        for t in targets:
            path = os.path.join(POSTERS_DIR, f"{t}.jpg")
            self.assertTrue(os.path.exists(path), f"Target poster {t}.jpg missing")
            with Image.open(path) as img:
                w, h = img.size
                self.assertGreaterEqual(w, 400)
                self.assertGreaterEqual(h, 600)

if __name__ == "__main__":
    unittest.main()
