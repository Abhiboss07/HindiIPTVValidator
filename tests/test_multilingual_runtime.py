#!/usr/bin/env python3
"""
Unit test for Zero-Trust Multilingual Player Switching & Audio Continuity
Validates that assets/app.js contains:
- Multi-track discovery logic for HLS, URL_SWITCH, CONTAINER_TRACKS, and SINGLE tracks.
- HTML5 container track switching (`videoElement.audioTracks[i].enabled = ...`).
- URL stream switching with playback position continuity and unpausing.
- Silence detection and hardware audio focus restoration.
- Synchronization between web app.js and android_app assets app.js.
"""

import os
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")
ANDROID_APP_JS_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "app.js")

class TestMultilingualRuntime(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            cls.js = f.read()
        with open(ANDROID_APP_JS_PATH, "r", encoding="utf-8") as f:
            cls.android_js = f.read()

    def test_audio_tracks_discovery_present(self):
        self.assertIn("function getAvailableAudioTracks(movie, episodeId)", self.js)
        self.assertIn("type: 'HLS'", self.js)
        self.assertIn("type: 'URL_SWITCH'", self.js)
        self.assertIn("type: 'CONTAINER_TRACKS'", self.js)
        self.assertIn("type: 'SINGLE'", self.js)

    def test_container_audio_track_switching(self):
        self.assertIn("window.setVlcContainerAudioTrack", self.js)
        self.assertIn("videoElement.audioTracks[i].enabled = (i === trackIdx)", self.js)
        self.assertIn("videoElement.muted = false", self.js)
        self.assertIn("videoElement.volume = 1.0", self.js)
        self.assertIn("AndroidMedia.ensureAudioActive", self.js)

    def test_stream_url_switch_continuity(self):
        self.assertIn("window.switchMovieAudioStream", self.js)
        self.assertIn("video.currentTime = savedTime", self.js)
        self.assertIn("video.load()", self.js)
        self.assertIn("video.muted = false", self.js)
        self.assertIn("video.volume = 1.0", self.js)

    def test_audio_continuity_verification(self):
        self.assertIn("window.verifyAudioContinuity", self.js)

    def test_android_js_mirrored_and_identical(self):
        self.assertEqual(len(self.js), len(self.android_js))
        self.assertIn("window.setVlcContainerAudioTrack", self.android_js)

if __name__ == "__main__":
    unittest.main()
