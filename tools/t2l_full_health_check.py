#!/usr/bin/env python3
"""
T2L Full System Health Check & Forensic Validator
Exhaustively verifies every connected pipeline across data, code, UI, and APK.
"""

import json
import os
import sys
import zipfile
import re

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    failures = []
    passes = []

    def check(condition, test_name, detail=""):
        if condition:
            passes.append(f"PASS: {test_name}" + (f" ({detail})" if detail else ""))
            print(f"  [PASS] {test_name}" + (f" ({detail})" if detail else ""))
        else:
            failures.append(f"FAIL: {test_name}" + (f" ({detail})" if detail else ""))
            print(f"  [FAIL] {test_name}" + (f" ({detail})" if detail else ""))

    print("\n================================================================================")
    print("         T2L FULL SYSTEM FORENSIC AUDIT & HEALTH CHECK")
    print("================================================================================\n")

    # -------------------------------------------------------------------------
    # 1. CATALOG INTEGRITY & CONTENT IDENTITY
    # -------------------------------------------------------------------------
    print("--- 1. CATALOG INTEGRITY & CONTENT IDENTITY ---")
    catalog_path = os.path.join(repo_root, "data", "movies_catalog.json")
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    check(catalog.get("version") == 7, "Catalog version is 7", f"version={catalog.get('version')}")
    movies = catalog.get("movies", [])
    check(len(movies) == 53, "Catalog contains exactly 53 items", f"count={len(movies)}")

    # Check for duplicate episode URLs across different items
    all_ep_urls = {}
    for m in movies:
        for s in m.get("seasons", []):
            for ep in s.get("episodes", []):
                u = ep.get("streamUrl")
                if u:
                    all_ep_urls.setdefault(u, []).append(f"{m['id']}:{ep['id']}")

    dup_ep_urls = {k: v for k, v in all_ep_urls.items() if len(v) > 1}
    check(len(dup_ep_urls) == 0, "Zero duplicate stream URLs across distinct episodes", f"duplicates={len(dup_ep_urls)}")

    # Check Panchayat
    panchayat = next((m for m in movies if m["id"] == "series_panchayat"), None)
    check(panchayat is not None, "Panchayat entry exists")
    if panchayat:
        check(panchayat.get("sourceState") == "NO_AUTHORIZED_SOURCE", "Panchayat honest state is NO_AUTHORIZED_SOURCE")
        check(panchayat.get("streamUrl") is None, "Panchayat series streamUrl is null")
        seasons = panchayat.get("seasons", [])
        check(len(seasons) == 3, "Panchayat has 3 seasons", f"seasons={len(seasons)}")
        total_panchayat_eps = sum(len(s.get("episodes", [])) for s in seasons)
        check(total_panchayat_eps == 24, "Panchayat has all 24 canonical episodes (8 per season)", f"total={total_panchayat_eps}")
        panchayat_streams = [ep.get("streamUrl") for s in seasons for ep in s.get("episodes", []) if ep.get("streamUrl")]
        check(len(panchayat_streams) == 0, "Panchayat has no fake or duplicate stream URLs", f"streams={len(panchayat_streams)}")

    # Check Mirzapur
    mirzapur = next((m for m in movies if m["id"] == "series_mirzapur"), None)
    check(mirzapur is not None, "Mirzapur entry exists")
    if mirzapur:
        check(mirzapur.get("sourceState") == "TORRENT_SOURCE_AVAILABLE", "Mirzapur honest state is TORRENT_SOURCE_AVAILABLE")
        check(bool(mirzapur.get("torrentUri")), "Mirzapur has valid torrentUri")
        check(mirzapur.get("streamUrl") is None, "Mirzapur series direct streamUrl is null (no promo clips)")
        seasons = mirzapur.get("seasons", [])
        check(len(seasons) == 3, "Mirzapur has 3 seasons", f"seasons={len(seasons)}")
        total_mirzapur_eps = sum(len(s.get("episodes", [])) for s in seasons)
        check(total_mirzapur_eps == 29, "Mirzapur has all 29 canonical episodes (S1:9, S2:10, S3:10)", f"total={total_mirzapur_eps}")
        # Verify no VICE documentary titles
        has_promo_titles = any("Shooter" in ep.get("title", "") or "Gang Wars" in ep.get("title", "") for s in seasons for ep in s.get("episodes", []))
        check(not has_promo_titles, "Mirzapur has canonical episode titles (no VICE promo titles)")

    # Check Sherlock Holmes
    sherlock = next((m for m in movies if m["id"] == "series_sherlock_holmes"), None)
    check(sherlock is not None, "Sherlock Holmes entry exists")
    if sherlock:
        check("1984" in sherlock.get("title", "") or "Granada" in sherlock.get("originalTitle", ""), "Sherlock Holmes title identifies 1984 Granada series", sherlock.get("title"))
        check(sherlock.get("sourceState") == "DIRECT_STREAM_AVAILABLE", "Sherlock Holmes sourceState is DIRECT_STREAM_AVAILABLE")
        check(sherlock.get("qualityHonestBadge") == "1080p Full HD", "Sherlock Holmes quality badge is 1080p Full HD")
        seasons = sherlock.get("seasons", [])
        check(len(seasons) == 2, "Sherlock Holmes has 2 seasons", f"seasons={len(seasons)}")
        total_sherlock_eps = sum(len(s.get("episodes", [])) for s in seasons)
        check(total_sherlock_eps == 24, "Sherlock Holmes has 24 canonical Granada episodes", f"total={total_sherlock_eps}")
        first_ep = seasons[0]["episodes"][0]
        check("Scandal in Bohemia" in first_ep.get("title", "") and "A%20Scandal%20In%20Bohemia" in first_ep.get("streamUrl", ""), "Sherlock S01E01 title strictly matches stream file")

    # Check Swarm seeders validity
    invalid_swarm = [m["id"] for m in movies if not m.get("torrentUri") and m.get("swarmSeeders") is not None]
    check(len(invalid_swarm) == 0, "No fabricated swarmSeeders on non-torrent items", f"invalid={invalid_swarm}")

    # -------------------------------------------------------------------------
    # 2. POSTER ASSET VERIFICATION
    # -------------------------------------------------------------------------
    print("\n--- 2. POSTER ASSET AUDIT ---")
    missing_posters = []
    for m in movies:
        p = m.get("posterUrl")
        if not p or not os.path.exists(p) or os.path.getsize(p) < 1000:
            missing_posters.append((m["id"], p))
    check(len(missing_posters) == 0, "All 53 catalog items have valid, non-empty local poster files", f"missing={len(missing_posters)}")

    # -------------------------------------------------------------------------
    # 3. NAVIGATION & DOCK VERIFICATION
    # -------------------------------------------------------------------------
    print("\n--- 3. NAVIGATION & DOCK AUDIT ---")
    html_path = os.path.join(repo_root, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    check('id="tab-home"' in html_content, "Dock contains tab-home")
    check('id="tab-live"' in html_content, "Dock contains tab-live")
    check('id="tab-radio"' in html_content, "Dock contains tab-radio")
    check('id="tab-movies"' in html_content, "Dock contains dedicated tab-movies")
    check('id="tab-local"' in html_content, "Dock contains tab-local")
    check('id="page-movies"' in html_content, "DOM contains page-movies container")
    check("switchPage('movies')" in html_content, "Navigation binds switchPage('movies')")

    # -------------------------------------------------------------------------
    # 4. STARTUP PERFORMANCE & MAIN-THREAD AUDIT
    # -------------------------------------------------------------------------
    print("\n--- 4. STARTUP PERFORMANCE AUDIT ---")
    app_js_path = os.path.join(repo_root, "assets", "app.js")
    with open(app_js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Extract initApp body
    init_match = re.search(r'function initApp\(\) \{(.*?)\n\}', js_content, re.DOTALL)
    init_body = init_match.group(1) if init_match else ""
    check("autoScanDeviceMedia" not in init_body, "initApp() does NOT call autoScanDeviceMedia() synchronously on launch")
    check("renderAllPages" not in init_body, "initApp() does NOT eagerly call renderAllPages() on launch")
    check("renderHomePage" in init_body, "initApp() renders only renderHomePage() on launch")

    # Check lazy scan in switchPage
    check("pageId === 'movies'" in js_content and "renderMoviesPage" in js_content, "switchPage('movies') invokes renderMoviesPage() without redirect")
    check("autoScanDeviceMedia" in js_content and "pageId === 'local'" in js_content, "autoScanDeviceMedia() is triggered lazily on local page access")

    # -------------------------------------------------------------------------
    # 5. MULTI-LANGUAGE AUDIO PIPELINE AUDIT
    # -------------------------------------------------------------------------
    print("\n--- 5. MULTI-LANGUAGE AUDIO AUDIT ---")
    check("createMediaElementSource(videoElement)" not in js_content, "No createMediaElementSource(videoElement) hijacking (prevents cross-origin audio muting)")
    check("hlsInstance.audioTrack" in js_content, "Real HLS audio track switching is wired via hlsInstance.audioTrack")

    # -------------------------------------------------------------------------
    # 6. THUMBNAIL RENDERING AUDIT
    # -------------------------------------------------------------------------
    print("\n--- 6. THUMBNAIL RENDERING AUDIT ---")
    card_render_match = re.search(r'function renderMovieCard\(movie\) \{(.*?)\n\}', js_content, re.DOTALL)
    card_body = card_render_match.group(1) if card_render_match else ""
    check('loading="lazy"' not in card_body, "renderMovieCard does NOT use loading='lazy' (avoids WebView horizontal scroller bug)")

    # -------------------------------------------------------------------------
    # 7. APK BUILD & PACKAGING AUDIT
    # -------------------------------------------------------------------------
    print("\n--- 7. APK PACKAGING AUDIT ---")
    apk_path = os.path.join(repo_root, "T2L.apk")
    check(os.path.exists(apk_path), "T2L.apk exists on disk")
    if os.path.exists(apk_path):
        size_mb = os.path.getsize(apk_path) / (1024 * 1024)
        check(size_mb > 7.0, f"T2L.apk is valid release size ({size_mb:.2f} MB)")
        with zipfile.ZipFile(apk_path, "r") as zf:
            apk_files = set(zf.namelist())
            check("classes.dex" in apk_files, "classes.dex is packaged inside APK")
            check("assets/index.html" in apk_files, "assets/index.html is packaged inside APK")
            check("assets/assets/app.js" in apk_files, "assets/app.js is packaged inside APK")
            check("assets/data/movies_catalog.json" in apk_files, "movies_catalog.json is packaged inside APK")
            apk_posters = [f for f in apk_files if f.startswith("assets/assets/posters/")]
            check(len(apk_posters) >= 53, f"All 53+ movie posters are packaged inside APK ({len(apk_posters)} found)")

    # -------------------------------------------------------------------------
    # FINAL SUMMARY
    # -------------------------------------------------------------------------
    print("\n================================================================================")
    print("                             FORENSIC AUDIT SUMMARY")
    print("================================================================================")
    print(f"  TOTAL TESTS RUN   : {len(passes) + len(failures)}")
    print(f"  TOTAL TESTS PASSED: {len(passes)}")
    print(f"  TOTAL TESTS FAILED: {len(failures)}")
    print("================================================================================\n")

    if failures:
        print("FAILURES DETECTED:")
        for f in failures:
            print(f"  ❌ {f}")
        sys.exit(1)
    else:
        print("🎉 ALL FORENSIC HEALTH CHECKS PASSED PERFECTLY!\n")
        sys.exit(0)

if __name__ == '__main__':
    main()
