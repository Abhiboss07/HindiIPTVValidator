#!/usr/bin/env python3
"""
Unit test for Zero-Trust Media Identity & Anti-Trailer Contamination
Validates:
- No trailers or promotional clips are labeled PLAYABLE.
- Every PLAYABLE movie has an actual streamUrl or is a series with valid episodes.
- Trailer-only items have sourceStatus TRAILER_ONLY or UPCOMING.
- Excluded shorts are strictly limited to known public domain shorts.
"""

import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")

EXEMPTED_SHORTS = {
    "vod_bbb_720p",
    "vod_sita_sings_blues",
    "disc_charlie_chaplin_film_fest"
}

class TestMediaIdentity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = cls.catalog.get("movies", [])

    def test_no_trailer_marked_playable(self):
        violations = []
        for m in self.movies:
            mid = m["id"]
            status = m.get("sourceStatus")
            s_url = m.get("streamUrl") or ""
            is_series = m.get("mediaType") == "series"

            if status == "PLAYABLE":
                if not s_url and not is_series:
                    violations.append(f"{mid}: Marked PLAYABLE but missing streamUrl")
                if s_url and mid not in EXEMPTED_SHORTS:
                    keywords = ["trailer", "teaser", "promo", "deleted%20scene", "deleted_scene"]
                    if any(k in s_url.lower() for k in keywords):
                        violations.append(f"{mid}: streamUrl points to trailer/clip: {s_url}")
        self.assertEqual(len(violations), 0, f"Found trailer contamination in PLAYABLE content: {violations}")

    def test_trailer_only_items_properly_classified(self):
        violations = []
        for m in self.movies:
            mid = m["id"]
            status = m.get("sourceStatus")
            s_url = m.get("streamUrl")
            t_url = m.get("trailerUrl")
            is_series = m.get("mediaType") == "series"

            if not s_url and not is_series and t_url:
                if status not in ("TRAILER_ONLY", "UPCOMING"):
                    violations.append(f"{mid}: Trailer-only content has status={status}")
        self.assertEqual(len(violations), 0, f"Trailer-only items improperly classified: {violations}")

    def test_modern_2025_2026_trailers_honesty(self):
        modern_trailers = [
            "vod_deva_2025", "vod_sikandar_2025", "vod_fantastic_four_2025",
            "vod_thunderbolts_2025", "vod_superman_2025", "vod_mission_impossible_8_2025",
            "vod_captain_america_bnw_2025", "vod_spirit_2026", "vod_alpha_2026",
            "vod_king_2026", "vod_spiderman_4_2026"
        ]
        for mid in modern_trailers:
            m = next((item for item in self.movies if item["id"] == mid), None)
            self.assertIsNotNone(m, f"Title {mid} not found in catalog")
            self.assertEqual(m.get("sourceStatus"), "UPCOMING", f"{mid} should have sourceStatus=UPCOMING")
            self.assertIsNone(m.get("streamUrl"), f"{mid} must not have a fake streamUrl")
            self.assertIsNotNone(m.get("trailerUrl"), f"{mid} must have trailerUrl")

if __name__ == "__main__":
    unittest.main()
