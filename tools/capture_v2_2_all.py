#!/usr/bin/env python3
"""
T2L V2.2 Automated Screenshot Suite
Captures all branding, cinema, and consistency views via Headless Chrome
"""

import subprocess
import os
import time

CHROME_BIN = "/home/abhiboss/.local/bin/google-chrome"
OUT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator/reports/ui_redesign/v2.2/screenshots"
BASE_URL = "http://localhost:8080/reports/ui_redesign/v2.2/prototype/index.html"

os.makedirs(OUT_DIR, exist_ok=True)

SHOTS = [
    # 1. Branding Suite
    {
        "filename": "logo_concepts.png",
        "url": f"{BASE_URL}#brand-concepts",
        "width": 880,
        "height": 450
    },
    {
        "filename": "logo_selected.png",
        "url": f"{BASE_URL}#brand-selected",
        "width": 880,
        "height": 540
    },
    {
        "filename": "logo_small_sizes.png",
        "url": f"{BASE_URL}#brand-sizes",
        "width": 880,
        "height": 380
    },
    {
        "filename": "splash_new_logo.png",
        "url": f"{BASE_URL}?keepSplash=1#splash",
        "width": 390,
        "height": 844
    },
    # 2. Cinema Suite
    {
        "filename": "cinema_mobile_390.png",
        "url": f"{BASE_URL}#cinema",
        "width": 390,
        "height": 844
    },
    {
        "filename": "cinema_mobile_412.png",
        "url": f"{BASE_URL}#cinema",
        "width": 412,
        "height": 915
    },
    {
        "filename": "cinema_mobile_430.png",
        "url": f"{BASE_URL}#cinema",
        "width": 430,
        "height": 932
    },
    {
        "filename": "cinema_desktop_1024.png",
        "url": f"{BASE_URL}#cinema",
        "width": 1024,
        "height": 800
    },
    {
        "filename": "cinema_scroll_state.png",
        "url": f"{BASE_URL}#cinema-scroll",
        "width": 390,
        "height": 844
    },
    {
        "filename": "cinema_detail_transition.png",
        "url": f"{BASE_URL}#details",
        "width": 390,
        "height": 844
    },
    # 3. Consistency Across Frozen Views
    {
        "filename": "home_new_logo.png",
        "url": f"{BASE_URL}?noSplash=1",
        "width": 390,
        "height": 844
    },
    {
        "filename": "player_new_logo.png",
        "url": f"{BASE_URL}#player",
        "width": 390,
        "height": 844
    },
    {
        "filename": "footer_new_logo.png",
        "url": f"{BASE_URL}#footer",
        "width": 390,
        "height": 844
    },
    {
        "filename": "nav_new_logo.png",
        "url": f"{BASE_URL}#cinema",
        "width": 390,
        "height": 844
    }
]

print("=== Starting T2L V2.2 Automated Screenshot Captures ===")

for shot in SHOTS:
    dest = os.path.join(OUT_DIR, shot["filename"])
    cmd = [
        CHROME_BIN,
        "--headless",
        "--disable-gpu",
        f"--window-size={shot['width']},{shot['height']}",
        f"--screenshot={dest}",
        shot["url"]
    ]
    print(f"Capturing {shot['filename']} ({shot['width']}x{shot['height']})...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(dest):
        size_kb = os.path.getsize(dest) / 1024
        print(f" -> SUCCESS: {dest} ({size_kb:.1f} KB)")
    else:
        print(f" -> FAILED ({res.returncode}): {res.stderr}")

print("\n=== All V2.2 Screenshots Captured Successfully ===")
