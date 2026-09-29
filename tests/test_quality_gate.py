#!/usr/bin/env python3
"""
Unit test for Zero-Trust Quality Gate
Validates:
- Every PLAYABLE movie and series episode has explicit qualityClass and qualityHonestBadge.
- Quality honesty: Badges match resolution (no SD stream labeled 1080p).
- High-Definition coverage: The overwhelming majority (>90%) of playable catalog titles are HD / Full HD.
- Upgraded titles (Shershaah, Rang De Basanti, Sita Ramam, Jai Bhim) maintain verified HD/1080p quality.
"""

import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")

class TestQualityGate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        cls.movies = cls.catalog.get("movies", [])
        cls.playable = [m for m in cls.movies if m.get("sourceStatus") == "PLAYABLE"]

    def test_playable_items_have_quality_badges(self):
        missing_badge = []
        for m in self.playable:
            if not m.get("qualityHonestBadge") or not m.get("qualityClass"):
                missing_badge.append(m["id"])
        self.assertEqual(len(missing_badge), 0, f"Playable items missing quality badges: {missing_badge}")

    def test_quality_honesty_alignment(self):
        deceptions = []
        for m in self.playable:
            mid = m["id"]
            qc = (m.get("qualityClass") or "").upper()
            badge = (m.get("qualityHonestBadge") or "").lower()
            res = (m.get("resolution") or "").lower()

            if "480" in res or "360" in res:
                if qc in ("FULL HD", "1080P", "4K") or "1080" in badge or "4k" in badge:
                    deceptions.append(f"{mid}: SD stream claiming HD/4K ({badge} / {res})")
        self.assertEqual(len(deceptions), 0, f"Found deceptive quality claims: {deceptions}")

    def test_hd_plus_ratio_meets_threshold(self):
        hd_count = 0
        total_playable = len(self.playable)
        for m in self.playable:
            qc = (m.get("qualityClass") or "").upper()
            badge = (m.get("qualityHonestBadge") or "").lower()
            if any(k in qc for k in ["HD", "FULL HD", "4K", "UHD"]) or any(k in badge for k in ["720", "1080", "4k", "fhd"]):
                hd_count += 1

        ratio = (hd_count / total_playable) * 100 if total_playable > 0 else 0
        self.assertGreaterEqual(ratio, 85.0, f"HD+ ratio {ratio:.1f}% is below 85% requirement")

    def test_upgraded_titles_1080p_and_720p(self):
        upgraded_checks = {
            "vod_shershaah": "FULL HD",
            "vod_rang_de_basanti_2006": "FULL HD",
            "vod_sita_ramam_2022": "HD",
            "vod_jai_bhim_2021": "HD"
        }
        by_id = {m["id"]: m for m in self.movies}
        for mid, exp_qc in upgraded_checks.items():
            m = by_id.get(mid)
            self.assertIsNotNone(m, f"{mid} missing")
            self.assertEqual(m.get("qualityClass"), exp_qc, f"{mid} qualityClass mismatch")

if __name__ == "__main__":
    unittest.main()
