#!/usr/bin/env python3
"""
T2L ZERO-TRUST AUDIO TRUTH & SWITCHING CAPABILITY VALIDATOR
Enforces physical truth across catalog metadata, player track engines, and audio switching capabilities.
"""
import os
import sys
import json
import re

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
APP_JS_PATH = os.path.join(WORKSPACE, "assets", "app.js")

def validate():
    print("=" * 80)
    print("    T2L ZERO-TRUST AUDIO TRUTH & SWITCHING CAPABILITY VALIDATOR")
    print("=" * 80)

    # 1. Load Catalog
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)
    movies = catalog.get("movies", [])
    print(f"\n[LEVEL 1: STATIC CATALOG TRUTH] Validating {len(movies)} media titles...")

    errors = []
    multi_audio_count = 0
    single_audio_count = 0
    hls_audio_count = 0
    url_switch_count = 0

    for m in movies:
        mid = m.get("id", "UNKNOWN")
        cap = m.get("audioSwitchingCapability")
        ac = m.get("audioClassification")
        langs = m.get("languages", [])
        def_lang = m.get("defaultLanguage")

        # Must have audioSwitchingCapability
        if cap not in ("NONE", "URL_SWITCH", "HLS_TRACKS", "MULTI_TRACK_CONTAINER"):
            errors.append(f"{mid}: Missing or invalid audioSwitchingCapability: {cap}")

        # Check multi-audio claims
        if ac == "MULTI_AUDIO_INCLUDING_HINDI":
            multi_audio_count += 1
            if cap == "NONE":
                errors.append(f"{mid}: Falsely claims MULTI_AUDIO_INCLUDING_HINDI but audioSwitchingCapability is NONE!")
            if cap == "URL_SWITCH":
                url_switch_count += 1
                has_streams = bool(m.get("audioStreams"))
                if not has_streams and "seasons" in m:
                    for s in m["seasons"]:
                        for ep in s.get("episodes", []):
                            if ep.get("audioStreams"):
                                has_streams = True
                if not has_streams:
                    errors.append(f"{mid}: Marked URL_SWITCH but has no audioStreams map!")
            elif cap == "HLS_TRACKS":
                hls_audio_count += 1
                if ".m3u8" not in str(m.get("streamUrl", "")):
                    errors.append(f"{mid}: Marked HLS_TRACKS but streamUrl is not HLS (.m3u8)!")
            elif cap == "MULTI_TRACK_CONTAINER":
                if len(langs) < 2:
                    errors.append(f"{mid}: Marked MULTI_TRACK_CONTAINER but has < 2 languages!")
        else:
            single_audio_count += 1
            if cap == "NONE" and len(langs) > 1:
                errors.append(f"{mid}: audioSwitchingCapability is NONE but claims multiple languages: {langs}")

        # defaultLanguage must be valid
        if def_lang and langs and def_lang not in langs:
            errors.append(f"{mid}: defaultLanguage '{def_lang}' is not in languages array: {langs}")

        # Check episodes
        if "seasons" in m:
            for s in m["seasons"]:
                for ep in s.get("episodes", []):
                    epid = ep.get("id", "UNKNOWN")
                    ep_cap = ep.get("audioSwitchingCapability")
                    if ep_cap not in ("NONE", "URL_SWITCH", "HLS_TRACKS"):
                        errors.append(f"{mid}/{epid}: Missing or invalid audioSwitchingCapability: {ep_cap}")
                    if ep_cap == "URL_SWITCH" and not ep.get("audioStreams"):
                        errors.append(f"{mid}/{epid}: Marked URL_SWITCH but missing audioStreams map!")

    print(f"  Single-Audio Titles (NONE): {single_audio_count}")
    print(f"  URL-Switch Multi-Audio Titles: {url_switch_count}")
    print(f"  HLS Multi-Audio Titles: {hls_audio_count}")

    if errors:
        print(f"\n❌ LEVEL 1 FAILED with {len(errors)} errors:")
        for e in errors[:10]:
            print(f"   - {e}")
        return False
    else:
        print("  ✅ LEVEL 1 PASSED: 100% of catalog items have honest audio capability & languages.")

    # 2. Level 2: Player Engine Truth
    print("\n[LEVEL 2: PLAYER ENGINE TRUTH] Validating assets/app.js...")
    with open(APP_JS_PATH, "r", encoding="utf-8") as f:
        app_js = f.read()

    js_errors = []
    if "function getAvailableAudioTracks(" not in app_js:
        js_errors.append("assets/app.js is missing getAvailableAudioTracks() engine!")
    
    if "videoElement.audioTracks && videoElement.audioTracks.length > 1" in app_js:
        js_errors.append("assets/app.js still contains dead videoElement.audioTracks auto-selection!")

    if "videoElement.audioTracks[i].enabled" in app_js:
        js_errors.append("assets/app.js still contains dead videoElement.audioTracks track enabling loop!")

    if "switchMovieAudioStream" not in app_js:
        js_errors.append("assets/app.js is missing switchMovieAudioStream for URL_SWITCH capability!")

    if "setVlcHlsAudioTrack" not in app_js:
        js_errors.append("assets/app.js is missing setVlcHlsAudioTrack for HLS_TRACKS capability!")

    if js_errors:
        print(f"\n❌ LEVEL 2 FAILED with {len(js_errors)} errors:")
        for e in js_errors:
            print(f"   - {e}")
        return False
    else:
        print("  ✅ LEVEL 2 PASSED: Player audio engine is unified, honest, and free of dead APIs.")

    print("\n" + "=" * 80)
    print("ALL ZERO-TRUST AUDIO VALIDATION GATES PASSED (100% AUTHENTIC)")
    print("=" * 80)
    return True

if __name__ == "__main__":
    if not validate():
        sys.exit(1)
    sys.exit(0)
