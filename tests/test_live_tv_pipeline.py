#!/usr/bin/env python3
"""
T2L Live TV Pipeline Regression & Identity Protection Test Suite.
Validates zero-trust channel identity, language classification integrity,
cross-pipeline isolation, and stream validator robustness.
"""

import os
import json
import unittest
import urllib.request

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHANNELS_PATH = os.path.join(WORKSPACE, "data", "channels.json")
MOVIES_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")

from tools.live_tv_validator import LiveTvStreamValidator, ChannelValidationResult


class TestLiveTvPipelineRegression(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CHANNELS_PATH, "r", encoding="utf-8") as f:
            cls.channels = json.load(f)
        with open(MOVIES_PATH, "r", encoding="utf-8") as f:
            cls.movies_catalog = json.load(f)
        cls.validator = LiveTvStreamValidator(timeout=3.0)

    def test_nick_cannot_map_to_unrelated_channel(self):
        """Nick channels must never map to unrelated Pluto US, French, or dead feeds."""
        banned_patterns = [
            "plu-63f87d057533d80008ab9549",
            "NICK_JR_US",
            "NICKTOONS_US",
            "176.61.157.250",
            "116.90.120.157"
        ]
        nick_channels = [c for c in self.channels if "nick" in c.get("name", "").lower() or "nickelodeon" in c.get("name", "").lower()]
        self.assertGreater(len(nick_channels), 0, "Nick channels should exist in catalog")
        for ch in nick_channels:
            url = ch.get("url", "")
            for b in banned_patterns:
                self.assertNotIn(b, url, f"Nick channel '{ch.get('name')}' contains banned invalid pattern '{b}' in URL: {url}")
            # Ensure backup URLs are also clean
            for bk in ch.get("backupUrls", []):
                for b in banned_patterns:
                    self.assertNotIn(b, bk, f"Nick channel '{ch.get('name')}' contains banned pattern in backup: {bk}")

    def test_discovery_cannot_map_to_animal_planet(self):
        """Discovery Channel must never map to Animal Planet, Fear Factor Australia, or Moonbug."""
        disc = next((c for c in self.channels if c.get("id") == "discovery-channel-hindi-hd"), None)
        self.assertIsNotNone(disc, "Discovery Channel HD should exist in catalog")
        url = disc.get("url", "")
        self.assertNotIn("lightning-fnf-samsungaus.amagi.tv", url, "Discovery HD must not map to Fear Factor Australia")
        self.assertNotIn("moonbug", url, "Discovery HD must not map to Moonbug")
        self.assertNotIn("animal", url.lower(), "Discovery HD must not map to Animal Planet")

    def test_animal_planet_cannot_map_to_discovery(self):
        """Animal Planet must never map to Discovery or Moonbug CoComelon."""
        ap = next((c for c in self.channels if c.get("id") == "animal-planet-hindi-hd"), None)
        self.assertIsNotNone(ap, "Animal Planet HD should exist in catalog")
        url = ap.get("url", "")
        self.assertNotIn("moonbug-rokuus.amagi.tv", url, "Animal Planet must not map to Moonbug")
        self.assertNotIn("discovery", url.lower(), "Animal Planet must not map to Discovery")

    def test_national_geographic_cannot_map_to_nat_geo_wild(self):
        """National Geographic HD must never map to Nat Geo Wild."""
        ng = next((c for c in self.channels if c.get("id") == "natgeo-hindi-hd"), None)
        self.assertIsNotNone(ng, "National Geographic HD should exist in catalog")
        url = ng.get("url", "")
        self.assertNotIn("wild", url.lower(), "National Geographic HD must not map to Nat Geo Wild")
        self.assertIn("NGCHD", url, "National Geographic HD must map to authentic NGCHD feed")

    def test_movie_cannot_enter_live_tv(self):
        """Movies, series, or VOD files must never enter the Live TV channels catalog."""
        for c in self.channels:
            cid = c.get("id", "")
            cname = c.get("name", "")
            self.assertNotEqual(c.get("contentType"), "MOVIE", f"{cname} ({cid}) has contentType MOVIE in Live TV catalog")
            self.assertNotEqual(c.get("contentType"), "SERIES", f"{cname} ({cid}) has contentType SERIES in Live TV catalog")
            self.assertFalse(c.get("isTorrent", False), f"{cname} ({cid}) has isTorrent in Live TV catalog")
            url = c.get("url", "")
            self.assertNotIn("archive.org/download", url, f"{cname} ({cid}) routes to archive.org VOD file in Live TV")

    def test_live_tv_cannot_enter_movie_pipeline(self):
        """Live TV broadcast streams must never enter the movie catalog."""
        movies = self.movies_catalog.get("movies", [])
        for m in movies:
            mid = m.get("id", "")
            mtitle = m.get("title", "")
            stype = m.get("sourceType", "")
            self.assertNotEqual(stype, "LIVE_HLS", f"Movie {mtitle} ({mid}) has sourceType LIVE_HLS")
            self.assertNotEqual(stype, "LIVE_DASH", f"Movie {mtitle} ({mid}) has sourceType LIVE_DASH")
            surl = m.get("streamUrl") or ""
            self.assertFalse(".m3u8" in surl and "live" in surl.lower(), f"Movie {mtitle} ({mid}) has live TV stream URL: {surl}")

    def test_radio_cannot_enter_live_tv(self):
        """Radio stations must have type 'radio' and never masquerade as TV."""
        radio_ids = ["air-vividh-bharati", "air-gold-fm", "air-rainbow-fm"]
        for rid in radio_ids:
            ch = next((c for c in self.channels if c.get("id") == rid), None)
            if ch:
                self.assertEqual(ch.get("type"), "radio", f"Radio station {rid} is not typed as 'radio'")

    def test_category_model_normalized(self):
        """All channels must have normalized valid categories."""
        valid_categories = {
            "NEWS", "ENTERTAINMENT", "MOVIES", "KIDS", "CARTOONS",
            "INFOTAINMENT", "DOCUMENTARY", "SPORTS", "MUSIC", "LIFESTYLE",
            "DEVOTIONAL", "REGIONAL", "INTERNATIONAL"
        }
        for c in self.channels:
            cat = c.get("category")
            self.assertIn(cat, valid_categories, f"Channel '{c.get('name')}' has non-standard category '{cat}'")

    def test_source_types_normalized(self):
        """All channels must have valid source types."""
        valid_source_types = {"LIVE_HLS", "LIVE_DASH", "AUTHORIZED_LIVE_API", "LIVE_MEDIA"}
        for c in self.channels:
            stype = c.get("sourceType")
            self.assertIn(stype, valid_source_types, f"Channel '{c.get('name')}' has invalid sourceType '{stype}'")

    def test_http_200_alone_not_pass(self):
        """HTTP 200 returning HTML or invalid manifest must NOT result in PASS."""
        fake_ch = {
            "id": "fake_test_html",
            "name": "Fake Channel",
            "url": "https://www.google.com",  # Returns HTTP 200 HTML
            "category": "NEWS",
            "sourceType": "LIVE_HLS"
        }
        res = self.validator.probe_channel(fake_ch)
        self.assertNotEqual(res.status, "PASS", "Validator must NOT pass an HTTP 200 HTML page as HLS stream")
        self.assertIn("HTML_RESPONSE", res.failure_reason)

    def test_dead_hls_cannot_pass(self):
        """A dead or 404 HLS URL must result in FAIL with concrete failure code."""
        dead_ch = {
            "id": "dead_test_404",
            "name": "Dead Test Channel",
            "url": "https://test-streams.mux.dev/non_existent_stream_12345.m3u8",
            "category": "ENTERTAINMENT",
            "sourceType": "LIVE_HLS"
        }
        res = self.validator.probe_channel(dead_ch)
        self.assertEqual(res.status, "FAIL", "Validator must fail on 404 URL")
        self.assertIn("HTTP_404", res.failure_reason)

    def test_wrong_channel_identity_fails(self):
        """Mis-mapped channel URLs must trigger WRONG_CHANNEL_SOURCE failure."""
        mismapped_ch = {
            "id": "discovery-channel-hindi-hd",
            "name": "Discovery Channel HD (Hindi)",
            "url": "https://lightning-fnf-samsungaus.amagi.tv/playlist.m3u8",
            "category": "INFOTAINMENT",
            "sourceType": "LIVE_HLS"
        }
        res = self.validator.probe_channel(mismapped_ch)
        self.assertEqual(res.status, "FAIL")
        self.assertIn("WRONG_CHANNEL_SOURCE", res.failure_reason)


if __name__ == "__main__":
    unittest.main()
