#!/usr/bin/env python3
import os
import subprocess
import unittest

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VALIDATOR_PATH = os.path.join(WORKSPACE, "tools", "media_validator.py")
REPORTS_DIR = os.path.join(WORKSPACE, "reports")

class TestMasterMediaValidator(unittest.TestCase):
    def test_validator_execution(self):
        res = subprocess.run([VALIDATOR_PATH], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"media_validator failed:\n{res.stdout}\n{res.stderr}")
        self.assertIn("All 141 titles passed 100% strict zero-trust media validation", res.stdout)

    def test_reports_generated(self):
        self.assertTrue(os.path.exists(os.path.join(REPORTS_DIR, "playback_startup_report.json")))
        self.assertTrue(os.path.exists(os.path.join(REPORTS_DIR, "playback_startup_report.csv")))
        self.assertTrue(os.path.exists(os.path.join(REPORTS_DIR, "language_integrity_report.json")))
        self.assertTrue(os.path.exists(os.path.join(REPORTS_DIR, "final_streaming_forensic_report.md")))

if __name__ == "__main__":
    unittest.main()
