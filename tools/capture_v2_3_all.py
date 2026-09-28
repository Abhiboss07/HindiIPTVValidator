#!/usr/bin/env python3
"""
T2L V2.3 Precision UI Automated Screenshot Suite
Captures all 12 required views via Headless Chrome:
- Header (closed & open hamburger)
- Footer (mobile compact & desktop multi-column)
- Cinema (390, 412, desktop 1024, scroll state)
- Radio compact tiles
- Local Vault restored (V2.1 baseline)
- Brand Consistency across views
"""

import subprocess
import os
import sys

CHROME_BIN = "/home/abhiboss/.local/bin/google-chrome"
OUT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator/reports/ui_redesign/v2.3/screenshots"
BASE_URL = "http://localhost:8080/reports/ui_redesign/v2.3/prototype/index.html"

os.makedirs(OUT_DIR, exist_ok=True)

SHOTS = [
    # 1. Top Bar & Hamburger Sheet
    {
        "filename": "header_hamburger_closed.png",
        "url": f"{BASE_URL}?noSplash=1#home",
        "width": 390,
        "height": 844,
        "desc": "Top bar with Symbol ONLY on left, Bell, Profile, Hamburger on right"
    },
    {
        "filename": "header_hamburger_open.png",
        "url": f"{BASE_URL}?noSplash=1#hamburger",
        "width": 390,
        "height": 844,
        "desc": "Hamburger slide-over side-sheet opened with grouped utilities"
    },

    # 2. Redesigned Footers
    {
        "filename": "footer_final.png",
        "url": f"{BASE_URL}?noSplash=1#footer",
        "width": 390,
        "height": 844,
        "desc": "Final mobile footer without Zero-Trust Architecture label"
    },
    {
        "filename": "footer_final_desktop.png",
        "url": f"{BASE_URL}?noSplash=1#footer",
        "width": 1024,
        "height": 768,
        "desc": "Final desktop footer without Zero-Trust Architecture label"
    },
    {
        "filename": "footer_mobile.png",
        "url": f"{BASE_URL}?noSplash=1#footer",
        "width": 390,
        "height": 844,
        "desc": "Compact mobile expandable footer with brand lockup"
    },
    {
        "filename": "footer_desktop.png",
        "url": f"{BASE_URL}?noSplash=1#footer",
        "width": 1024,
        "height": 768,
        "desc": "Multi-column desktop footer layout"
    },

    # 3. 100% Horizontal Cinema Suite (Zero 2x2 Grid)
    {
        "filename": "cinema_mobile_390.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 390,
        "height": 844,
        "desc": "Cinema view on iPhone 390x844 with 100% horizontal rails"
    },
    {
        "filename": "cinema_mobile_412.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 412,
        "height": 915,
        "desc": "Cinema view on Android 412x915 viewport"
    },
    {
        "filename": "cinema_desktop_1024.png",
        "url": f"{BASE_URL}?noSplash=1#cinema",
        "width": 1024,
        "height": 800,
        "desc": "Cinema view on desktop 1024x800 viewport"
    },
    {
        "filename": "cinema_scroll.png",
        "url": f"{BASE_URL}?noSplash=1#cinema-scroll",
        "width": 390,
        "height": 844,
        "desc": "Cinema scrolled state under frosted glass top bar"
    },

    # 4. Refined Compact Radio Tiles
    {
        "filename": "radio_compact_cards.png",
        "url": f"{BASE_URL}?noSplash=1#radio",
        "width": 390,
        "height": 844,
        "desc": "Compact refined radio tiles with turntable and equalizer"
    },

    # 5. Restored V2.1 Local Vault
    {
        "filename": "local_restored.png",
        "url": f"{BASE_URL}?noSplash=1#local",
        "width": 390,
        "height": 844,
        "desc": "Restored V2.1 local media vault without storage telemetry"
    },

    # 6. Brand Consistency Across Frozen Views
    {
        "filename": "home_header_symbol_only.png",
        "url": f"{BASE_URL}?noSplash=1#home",
        "width": 390,
        "height": 844,
        "desc": "Home view confirming symbol-only branding"
    },
    {
        "filename": "player_symbol_only.png",
        "url": f"{BASE_URL}?noSplash=1#player",
        "width": 390,
        "height": 844,
        "desc": "Player modal with subtle brand mark watermark"
    }
]

print("=== Starting T2L V2.3 Automated Screenshot Captures ===")

success_count = 0
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
    print(f"Capturing {shot['filename']} ({shot['width']}x{shot['height']})...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(dest):
        size_kb = os.path.getsize(dest) / 1024
        print(f" -> SUCCESS: {dest} ({size_kb:.1f} KB)")
        success_count += 1
    else:
        print(f" -> FAILED ({res.returncode}): {res.stderr}")

print(f"\n=== Completed: {success_count}/{len(SHOTS)} Screenshots Captured Successfully ===")
if success_count < len(SHOTS):
    sys.exit(1)
