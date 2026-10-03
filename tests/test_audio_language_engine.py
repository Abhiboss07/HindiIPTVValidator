#!/usr/bin/env python3
import os
import json
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")

class TestAudioLanguageEngine(unittest.TestCase):
    def setUp(self):
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            self.app_js = f.read()
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            self.catalog = json.load(f)
        self.movies = self.catalog.get("movies", [])

    def test_canonical_language_map_defined(self):
        self.assertIn("const CANONICAL_LANG_MAP", self.app_js,
                      "Global CANONICAL_LANG_MAP must be defined in app.js")
        self.assertIn("function normalizeLanguage", self.app_js,
                      "normalizeLanguage function must be defined in app.js")

    def test_apply_preferred_audio_track(self):
        self.assertIn("function applyPreferredAudioTrack", self.app_js,
                      "applyPreferredAudioTrack must be defined in app.js")
        self.assertIn("applyPreferredAudioTrack(hlsInstance", self.app_js,
                      "Hls MANIFEST_PARSED & AUDIO_TRACKS_UPDATED must call applyPreferredAudioTrack")

    def test_non_hindi_audio_catalog_honesty(self):
        for mid in ["series_death_note"]:
            m = next((x for x in self.movies if x["id"] == mid), None)
            self.assertIsNotNone(m, f"{mid} must exist in catalog")
            audio = m.get("audio", {})
            self.assertEqual(audio.get("classification"), "NON_HINDI_AUDIO",
                             f"{mid} must be honestly classified NON_HINDI_AUDIO")
            self.assertFalse(audio.get("hasHindiAudio"),
                             f"{mid} hasHindiAudio must be False")

        # Verify Korean-only series have been completely excised
        for removed_id in ["series_crash_landing_on_you", "series_descendants_of_the_sun"]:
            m = next((x for x in self.movies if x["id"] == removed_id), None)
            self.assertIsNone(m, f"{removed_id} must be excised from catalog")

if __name__ == "__main__":
    unittest.main()
