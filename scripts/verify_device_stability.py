import subprocess
import time
import json
import re

DEVICE = "00015364U000110"
PKG = "com.aakashstream.app"
ACTIVITY = "com.aakashstream.app/.MainActivity"

def run_adb(cmd):
    res = subprocess.run(f"adb -s {DEVICE} {cmd}", shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("--- 1. COLD LAUNCH STRESS TEST (10 CYCLES) ---")
cold_results = []
for i in range(1, 11):
    run_adb(f"shell am force-stop {PKG}")
    time.sleep(0.5)
    run_adb("logcat -c")
    out = run_adb(f"shell am start -W -n {ACTIVITY}")
    time.sleep(1.5)
    # Check if video was played
    logcat = run_adb("logcat -d")
    autoplay_detected = "togglePlay" in logcat or "LuminaVideo" in logcat and "playing" in logcat.lower()
    
    # Extract TotalTime
    match = re.search(r"TotalTime:\s*(\d+)", out)
    total_time = int(match.group(1)) if match else -1
    cold_results.append({"cycle": i, "total_time_ms": total_time, "unexpected_autoplay": autoplay_detected})
    print(f"  Cycle {i}: Launch Time: {total_time}ms | Unexpected Autoplay: {autoplay_detected}")

print("\n--- 2. WARM APP-SWITCH STRESS TEST (10 CYCLES) ---")
warm_results = []
for i in range(1, 11):
    # Press HOME
    run_adb("shell input keyevent KEYCODE_HOME")
    time.sleep(0.8)
    pip_check = run_adb("shell dumpsys window | grep -i pip")
    has_pip = len(pip_check.strip()) > 0
    
    # Resume
    out = run_adb(f"shell am start -W -n {ACTIVITY}")
    time.sleep(0.8)
    warm_results.append({"cycle": i, "unwanted_pip": has_pip})
    print(f"  Cycle {i}: Unwanted PiP: {has_pip}")

print("\n--- 3. VERIFY SUZUME METADATA ON DEVICE ---")
catalog_raw = run_adb(f"shell cat /data/data/{PKG}/files/movies_catalog.json")
# If not in files, check if accessible or check assets
print(f"  Catalog file in data dir check: {len(catalog_raw)} bytes")

# Frame performance dumpsys gfxinfo
print("\n--- 4. GFXINFO FRAME METRICS ---")
gfx = run_adb(f"shell dumpsys gfxinfo {PKG}")
total_frames_match = re.search(r"Total frames rendered:\s*(\d+)", gfx)
janky_frames_match = re.search(r"Janky frames:\s*(\d+)\s*\(([\d\.]+)%\)", gfx)

if total_frames_match and janky_frames_match:
    total_f = total_frames_match.group(1)
    jank_f = janky_frames_match.group(1)
    jank_pct = janky_frames_match.group(2)
    print(f"  Total frames: {total_f} | Janky frames: {jank_f} ({jank_pct}%)")
else:
    print("  Gfxinfo output snippet:")
    for line in gfx.splitlines()[:20]:
        print("   ", line)

with open("reports/forensic/device_stability_validation.json", "w") as f:
    json.dump({
        "device": "Nothing Phone 3 (A024)",
        "cold_launch_results": cold_results,
        "warm_app_switch_results": warm_results,
        "gfxinfo_summary": {
            "total_frames": total_frames_match.group(1) if total_frames_match else None,
            "janky_frames": janky_frames_match.group(1) if janky_frames_match else None,
            "janky_pct": janky_frames_match.group(2) if janky_frames_match else None
        }
    }, f, indent=2)

print("\nSaved validation report to reports/forensic/device_stability_validation.json")
