#!/usr/bin/env python3
import os
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")
MAIN_ACTIVITY_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "java", "com", "aakashstream", "app", "MainActivity.java")

class TestAbrStartup(unittest.TestCase):
    def setUp(self):
        with open(APP_JS_PATH, "r", encoding="utf-8") as f:
            self.app_js = f.read()
        with open(MAIN_ACTIVITY_PATH, "r", encoding="utf-8") as f:
            self.main_activity = f.read()

    def test_hls_fast_start_configuration(self):
        self.assertIn("startLevel: 0", self.app_js,
                      "Hls config must start at lowest level 0 for instant mobile loading <1.5s")
        self.assertIn("maxBufferLength: 10", self.app_js,
                      "Hls config must maintain safe 10s buffer limit")

    def test_dynamic_abr_speed_matcher(self):
        self.assertIn("function applySpeedMatchedQualityToHls", self.app_js,
                      "applySpeedMatchedQualityToHls must be defined")
        self.assertIn("hlsInstance.currentLevel = -1", self.app_js,
                      "Hls ABR must dynamically unlock to auto (-1) upon buffer established")

    def test_startup_telemetry_instrumentation(self):
        self.assertIn("recordTelemetry", self.main_activity,
                      "MainActivity must implement recordTelemetry bridge")
        self.assertIn("window.AndroidMedia.recordTelemetry", self.app_js,
                      "app.js must report startup metrics via AndroidMedia.recordTelemetry")

    def test_5g_network_speed_bridge(self):
        self.assertIn("getNetworkSpeedInfo", self.main_activity,
                      "MainActivity must implement getNetworkSpeedInfo")
        self.assertIn("window.AndroidMedia.getNetworkSpeedInfo", self.app_js,
                      "app.js must query OS network speed from AndroidMedia.getNetworkSpeedInfo")

    def test_cellular_dns_override_removed(self):
        self.assertIn("isCellular", self.main_activity,
                      "MainActivity must check for cellular transport")
        self.assertIn("if (!isCellular)", self.main_activity,
                      "MainActivity must not override DNS on cellular connections (preserves DNS64/NAT64)")

    def test_direct_stream_instant_launch(self):
        self.assertIn("Instant fast-start: bypass artificial 1.8s delay and launch immediately", self.app_js,
                      "startMovieStream must launch direct streams without artificial delay")

if __name__ == "__main__":
    unittest.main()
