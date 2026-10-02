#!/bin/bash
# Phase 40 — Real Nothing Phone 3 Performance Testing Script
# Tests all critical user flows via ADB input and captures gfxinfo frame data
# Device: Nothing Phone 3 (A024) — 120Hz, 1260x2800, 480dpi

PKG="com.aakashstream.app"
SERIAL="00015364U000110"
RESULTS_DIR="/home/abhiboss/Projects/HindiIPTVValidator/reports/forensic"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_FILE="${RESULTS_DIR}/phase40_gfxinfo_${TIMESTAMP}.txt"

mkdir -p "$RESULTS_DIR"

echo "=== PHASE 40 REAL DEVICE TESTING ===" | tee "$RESULTS_FILE"
echo "Device: Nothing Phone 3 (A024)" | tee -a "$RESULTS_FILE"
echo "Timestamp: $(date)" | tee -a "$RESULTS_FILE"
echo "Display: 120Hz, 1260x2800" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

# Helper: Reset gfxinfo, perform action, capture results
capture_gfxinfo() {
    local test_name="$1"
    echo "--- TEST: ${test_name} ---" | tee -a "$RESULTS_FILE"
    
    # Reset gfxinfo
    adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" reset > /dev/null 2>&1
    sleep 0.5
}

dump_gfxinfo() {
    local test_name="$1"
    sleep 0.5
    echo "  [gfxinfo for: ${test_name}]" >> "$RESULTS_FILE"
    adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"
    
    # Extract key stats
    local janky_line=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "Janky frames")
    local total_line=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "Total frames rendered")
    local p50=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "50th percentile")
    local p90=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "90th percentile")
    local p95=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "95th percentile")
    local p99=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "99th percentile")
    local missed=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "Number Missed Vsync")
    local slow_ui=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "Number Slow UI thread")
    local slow_bitmap=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "Number Slow bitmap uploads")
    local slow_issue=$(adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" 2>&1 | grep "Number Slow issue draw commands")
    
    echo "  SUMMARY: $total_line | $janky_line" | tee -a "$RESULTS_FILE"
    echo "  $p50 | $p90 | $p95 | $p99" | tee -a "$RESULTS_FILE"
    echo "  $missed | $slow_ui" | tee -a "$RESULTS_FILE"
    echo "" | tee -a "$RESULTS_FILE"
}

# Force-stop and restart fresh
echo "=== RESTARTING APP ===" | tee -a "$RESULTS_FILE"
adb -s "$SERIAL" shell am force-stop "$PKG"
sleep 2
adb -s "$SERIAL" shell am start -n "$PKG/.MainActivity"
sleep 5

# ============================================================
# TEST A: COLD START / INITIAL RENDER
# ============================================================
echo "=== TEST A: APP COLD START ===" | tee -a "$RESULTS_FILE"
adb -s "$SERIAL" shell am force-stop "$PKG"
sleep 2
adb -s "$SERIAL" shell dumpsys gfxinfo "$PKG" reset > /dev/null 2>&1
adb -s "$SERIAL" shell am start -n "$PKG/.MainActivity"
sleep 6
dump_gfxinfo "COLD_START"

# Capture Choreographer skipped frames from logcat
adb -s "$SERIAL" logcat -d -s Choreographer | grep "Skipped" | tail -5 >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# ============================================================
# TEST B: HOME SCROLL (slow + fast)
# ============================================================
capture_gfxinfo "HOME_SCROLL"
# Slow scroll down
for i in $(seq 1 5); do
    adb -s "$SERIAL" shell input swipe 630 2000 630 800 600
    sleep 0.3
done
# Fast flick scroll
for i in $(seq 1 3); do
    adb -s "$SERIAL" shell input swipe 630 2200 630 400 150
    sleep 0.5
done
# Scroll back up
for i in $(seq 1 3); do
    adb -s "$SERIAL" shell input swipe 630 800 630 2000 300
    sleep 0.3
done
dump_gfxinfo "HOME_SCROLL"

# ============================================================
# TEST C: NAVIGATION — TAP CINEMA TAB
# ============================================================
capture_gfxinfo "NAV_TO_CINEMA"
# Bottom nav Cinema tab — approximate y=2750, x for Cinema ~375
adb -s "$SERIAL" shell input tap 375 2750
sleep 2
dump_gfxinfo "NAV_TO_CINEMA"

# ============================================================
# TEST D: CINEMA SCROLL
# ============================================================
capture_gfxinfo "CINEMA_SCROLL"
for i in $(seq 1 5); do
    adb -s "$SERIAL" shell input swipe 630 2000 630 800 500
    sleep 0.3
done
for i in $(seq 1 3); do
    adb -s "$SERIAL" shell input swipe 630 2200 630 400 150
    sleep 0.5
done
dump_gfxinfo "CINEMA_SCROLL"

# ============================================================
# TEST E: NAVIGATION — TAP LIVE TV TAB
# ============================================================
capture_gfxinfo "NAV_TO_LIVETV"
# Bottom nav Live TV tab — approximate x=630
adb -s "$SERIAL" shell input tap 630 2750
sleep 2
dump_gfxinfo "NAV_TO_LIVETV"

# ============================================================
# TEST F: LIVE TV SCROLL
# ============================================================
capture_gfxinfo "LIVETV_SCROLL"
for i in $(seq 1 5); do
    adb -s "$SERIAL" shell input swipe 630 2000 630 800 500
    sleep 0.3
done
for i in $(seq 1 3); do
    adb -s "$SERIAL" shell input swipe 630 2200 630 400 150
    sleep 0.5
done
dump_gfxinfo "LIVETV_SCROLL"

# ============================================================
# TEST G: NAVIGATE BACK TO HOME
# ============================================================
capture_gfxinfo "NAV_TO_HOME"
# Home tab — leftmost, x~125
adb -s "$SERIAL" shell input tap 125 2750
sleep 2
dump_gfxinfo "NAV_TO_HOME"

# ============================================================
# TEST H: MOVIE DETAIL MODAL OPEN
# ============================================================
capture_gfxinfo "MODAL_OPEN"
# Tap on a movie card — approximate position of first card
# First scroll to top
adb -s "$SERIAL" shell input swipe 630 800 630 2200 300
sleep 1
# Tap first movie card (typically around y=600-800, x=200-400 area)
adb -s "$SERIAL" shell input tap 300 700
sleep 2
dump_gfxinfo "MODAL_OPEN"

# ============================================================
# TEST I: MODAL SCROLL (inside movie detail)
# ============================================================
capture_gfxinfo "MODAL_SCROLL"
for i in $(seq 1 3); do
    adb -s "$SERIAL" shell input swipe 630 2000 630 1000 400
    sleep 0.3
done
dump_gfxinfo "MODAL_SCROLL"

# ============================================================
# TEST J: MODAL CLOSE
# ============================================================
capture_gfxinfo "MODAL_CLOSE"
# Close button top-right or back gesture
adb -s "$SERIAL" shell input tap 1150 150
sleep 1
dump_gfxinfo "MODAL_CLOSE"

# ============================================================
# TEST K: SEARCH OPEN + TYPING
# ============================================================
capture_gfxinfo "SEARCH_OPEN"
# Search icon — typically top-right area
adb -s "$SERIAL" shell input tap 1150 100
sleep 1.5
dump_gfxinfo "SEARCH_OPEN"

capture_gfxinfo "SEARCH_TYPING"
# Type a search query character by character
adb -s "$SERIAL" shell input text "b"
sleep 0.2
adb -s "$SERIAL" shell input text "a"
sleep 0.2
adb -s "$SERIAL" shell input text "h"
sleep 0.2
adb -s "$SERIAL" shell input text "u"
sleep 0.2
adb -s "$SERIAL" shell input text "b"
sleep 0.2
adb -s "$SERIAL" shell input text "a"
sleep 0.2
adb -s "$SERIAL" shell input text "l"
sleep 0.2
adb -s "$SERIAL" shell input text "i"
sleep 0.5
dump_gfxinfo "SEARCH_TYPING"

# Close search
adb -s "$SERIAL" shell input keyevent KEYCODE_BACK
sleep 1

# ============================================================
# TEST L: RAPID TAB SWITCHING
# ============================================================
capture_gfxinfo "RAPID_NAV"
for i in $(seq 1 3); do
    adb -s "$SERIAL" shell input tap 125 2750  # Home
    sleep 0.5
    adb -s "$SERIAL" shell input tap 375 2750  # Cinema
    sleep 0.5
    adb -s "$SERIAL" shell input tap 630 2750  # Live
    sleep 0.5
    adb -s "$SERIAL" shell input tap 880 2750  # Radio
    sleep 0.5
done
adb -s "$SERIAL" shell input tap 125 2750  # Back to Home
sleep 1
dump_gfxinfo "RAPID_NAV"

# ============================================================
# MEMORY BASELINE
# ============================================================
echo "=== MEMORY BASELINE ===" | tee -a "$RESULTS_FILE"
adb -s "$SERIAL" shell dumpsys meminfo "$PKG" 2>&1 | head -40 >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# ============================================================
# SUMMARY
# ============================================================
echo "=== TEST COMPLETE ===" | tee -a "$RESULTS_FILE"
echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"
echo "Total gfxinfo captures: 14 tests" | tee -a "$RESULTS_FILE"
