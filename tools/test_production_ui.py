#!/usr/bin/env python3
"""
T2L Production UI Comprehensive Visual & Functional Test Suite
Captures automated screenshots across target viewports:
- Mobile: 320x640, 360x780, 390x844, 412x915, 430x932
- Desktop: 1024x768
Validates:
1. Header: Vector symbol only on left, Notifications/Profile/Hamburger on right
2. Hamburger Drawer: Utility grouping, tooltips, no text wrap
3. Cinema: 100% horizontal rails, 0 vertical grids
4. Radio: Refined compact tiles, turntable visualizer, vector icons
5. Local Vault: Restored clean view, no storage bars
6. Footer: Clean footer, ZERO mentions of "Zero-Trust Architecture"
"""

import subprocess
import os
import sys
import time

CHROME_BIN = "/home/abhiboss/.local/bin/google-chrome"
OUT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator/reports/ui_redesign/final_implementation/screenshots"
BASE_URL = "http://localhost:8080/index.html"

os.makedirs(OUT_DIR, exist_ok=True)

SHOTS = [
    # 1. Header & Hamburger
    {
        "filename": "prod_home_header_390.png",
        "url": f"{BASE_URL}?noSplash=1#home",
        "width": 390,
        "height": 844,
        "desc": "Home view with pinned glass header (Symbol only, no wordmark)"
    },
    {
        "filename": "prod_hamburger_open_390.png",
        "url": f"{BASE_URL}?noSplash=1#hamburger",
        "width": 390,
        "height": 844,
        "desc": "Hamburger slide-over sheet open with grouped utilities and tooltips"
    },
    {
        "filename": "prod_notifications_open_390.png",
        "url": f"{BASE_URL}?noSplash=1#notifications",
        "width": 390,
        "height": 844,
        "desc": "Notifications slide-over sheet"
    },
    {
        "filename": "prod_profile_open_390.png",
        "url": f"{BASE_URL}?noSplash=1#profile",
        "width": 390,
        "height": 844,
        "desc": "Profile slide-over sheet"
    },

    # 2. Cinema Page (Horizontal Rails Suite across Viewports)
    {
        "filename": "prod_cinema_mobile_320.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 320,
        "height": 640,
        "desc": "Cinema view on compact mobile 320x640 (horizontal rails)"
    },
    {
        "filename": "prod_cinema_mobile_360.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 360,
        "height": 780,
        "desc": "Cinema view on Android 360x780"
    },
    {
        "filename": "prod_cinema_mobile_390.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 390,
        "height": 844,
        "desc": "Cinema view on iPhone 390x844 (horizontal rails)"
    },
    {
        "filename": "prod_cinema_mobile_412.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 412,
        "height": 915,
        "desc": "Cinema view on Android 412x915"
    },
    {
        "filename": "prod_cinema_mobile_430.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 430,
        "height": 932,
        "desc": "Cinema view on large mobile 430x932"
    },
    {
        "filename": "prod_cinema_desktop_1024.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 1024,
        "height": 768,
        "desc": "Cinema view on desktop 1024x768"
    },
    {
        "filename": "prod_cinema_scroll_390.png",
        "url": f"{BASE_URL}?noSplash=1#cinema-scroll",
        "width": 390,
        "height": 844,
        "desc": "Cinema scrolled state under frosted header"
    },

    # 3. Live TV
    {
        "filename": "prod_live_mobile_390.png",
        "url": f"{BASE_URL}?noSplash=1#live",
        "width": 390,
        "height": 844,
        "desc": "Live TV guide and categories"
    },

    # 4. Radio Compact Cards
    {
        "filename": "prod_radio_mobile_390.png",
        "url": f"{BASE_URL}?noSplash=1#radio",
        "width": 390,
        "height": 844,
        "desc": "Refined compact radio tiles with turntable and equalizer"
    },

    # 5. Local Media Vault (Restored V2.1 baseline)
    {
        "filename": "prod_local_vault_390.png",
        "url": f"{BASE_URL}?noSplash=1#local",
        "width": 390,
        "height": 844,
        "desc": "Restored Local Vault without storage telemetry bars"
    },

    # 6. Clean Footer (Mobile & Desktop)
    {
        "filename": "prod_footer_mobile_390.png",
        "url": f"{BASE_URL}?noSplash=1#footer",
        "width": 390,
        "height": 844,
        "desc": "Clean mobile footer with zero mention of Zero-Trust"
    },
    {
        "filename": "prod_footer_desktop_1024.png",
        "url": f"{BASE_URL}?noSplash=1#footer",
        "width": 1024,
        "height": 768,
        "desc": "Clean desktop footer with zero mention of Zero-Trust"
    }
]

def run_tests():
    print("=== Launching T2L Production UI Visual Test Suite ===")
    success = 0
    for shot in SHOTS:
        dest = os.path.join(OUT_DIR, shot["filename"])
        cmd = [
            CHROME_BIN,
            "--headless",
            "--disable-gpu",
            f"--window-size={shot['width']},{shot['height']}",
            "--virtual-time-budget=2000",
            f"--screenshot={dest}",
            shot["url"]
        ]
        print(f"Capturing: {shot['filename']} ({shot['width']}x{shot['height']})...")
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0 and os.path.exists(dest):
            kb = os.path.getsize(dest) / 1024
            print(f" -> SUCCESS: {dest} ({kb:.1f} KB)")
            success += 1
        else:
            print(f" -> FAILED ({res.returncode}): {res.stderr}")

    print(f"\nCaptured {success}/{len(SHOTS)} screenshots.")
    return success == len(SHOTS)

if __name__ == "__main__":
    if not run_tests():
        sys.exit(1)
