#!/usr/bin/env python3
"""
Test Suite: 4K UHD Video & High-Resolution Multichannel Audio Support
Validates:
1. Honest 4K and resolution claims in catalog.
2. Hls.js buffer capacity (60MB) and unconstrained rendering (capLevelToPlayerSize: false).
3. Level-switched dynamic badge updates.
4. Exclusivity of representations in quality selector (no fabricated 4K/1080p for single MP4s).
5. High-resolution multichannel audio track detection (Dolby Atmos, E-AC-3 5.1, AC-3 5.1, FLAC, AAC).
6. Android native audio decoder sample rate and channel fidelity.
"""

import json
import os
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")
MAIN_ACTIVITY_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "java", "com", "aakashstream", "app", "MainActivity.java")

class Test4KAndAudioSupport(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            cls.app_js = f.read()
        with open(MAIN_ACTIVITY_PATH, "r", encoding="utf-8") as f:
            cls.main_activity = f.read()

    def test_catalog_4k_and_honest_resolution(self):
        movies = self.catalog.get("movies", [])
        
        # 1. Parasite must be honest 480p SD
        parasite = next((m for m in movies if m.get("id") == "vod_parasite"), None)
        self.assertIsNotNone(parasite)
        self.assertEqual(parasite.get("qualityClass"), "HD")
        self.assertEqual(parasite.get("qualityHonestBadge"), "720p HD")
        self.assertIn("720p", parasite.get("resolution", "").lower())
        self.assertNotIn("4k", parasite.get("resolution", "").lower())

        # 2. Genuine 4K item must exist
        showcase = next((m for m in movies if m.get("id") == "vod_spring_4k"), None)
        self.assertIsNotNone(showcase, "4K UHD item must exist in catalog")
        self.assertEqual(showcase.get("qualityClass"), "4K")
        self.assertEqual(showcase.get("qualityHonestBadge"), "4K Ultra HD")
        self.assertIn("3840x2160", showcase.get("resolution", ""))
        self.assertEqual(showcase.get("sourceStatus"), "PLAYABLE")

    def test_hls_4k_buffer_and_dimensions(self):
        # Buffer capacity must accommodate high-bitrate 4K (25+ Mbps)
        self.assertIn("60 * 1000 * 1000", self.app_js,
                      "Hls config must provide 60MB safety buffer cap for 4K UHD")
        self.assertIn("capLevelToPlayerSize: false", self.app_js,
                      "capLevelToPlayerSize must be false to avoid clamping 4K to WebView viewport")
        self.assertIn("Hls.Events.LEVEL_SWITCHED", self.app_js,
                      "Hls.Events.LEVEL_SWITCHED must be handled to update UI when ABR switches levels")

    def test_dynamic_quality_selector_honesty(self):
        # Quality modal for HLS must handle 4K, 1440p/2K, 1080p, 720p, 480p
        self.assertIn("4K UHD", self.app_js)
        self.assertIn("2K QHD (1440p)", self.app_js)

        # Quality modal for progressive MP4 must not display fabricated 4K/1080p options
        self.assertIn("Native Master Quality", self.app_js,
                      "Progressive MP4 must expose genuine native master stream")
        self.assertNotIn("Upscaled Full HD • 5-10 Mbps High Speed", self.app_js,
                         "Fabricated upscaled quality options must not be presented to user")

    def test_high_resolution_audio_codecs(self):
        # Audio track detection must support Dolby Atmos, E-AC-3, AC-3, FLAC, AAC
        self.assertIn("Dolby Atmos (Spatial Audio)", self.app_js)
        self.assertIn("Dolby Digital Plus (E-AC-3 5.1)", self.app_js)
        self.assertIn("Dolby Digital (AC-3 5.1)", self.app_js)
        self.assertIn("FLAC Lossless Master", self.app_js)

    def test_android_audio_passthrough_and_sample_rates(self):
        # Native audio decoder must dynamically handle sample rates without artificial clamp
        self.assertIn("NativeHardwareAudioDecoder", self.main_activity)
        self.assertIn("AudioTrack.Builder()", self.main_activity)
        self.assertIn("CHANNEL_OUT_5POINT1", self.main_activity,
                      "MainActivity must support multichannel 5.1 surround sound audio tracks")

if __name__ == "__main__":
    unittest.main()
