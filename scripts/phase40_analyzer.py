#!/usr/bin/env python3
"""Phase 40 v3 — Isolated per-test measurement.
Each test restarts app or waits for buffer to fill with fresh frames.
Uses timestamp-based windowing to isolate test frames.
"""
import subprocess, time, json, os, statistics, sys

SERIAL = "00015364U000110"
PKG = "com.aakashstream.app"

def adb(cmd):
    r = subprocess.run(f"adb -s {SERIAL} {cmd}", shell=True, capture_output=True, text=True, timeout=20)
    return r.stdout

def find_surface():
    out = adb("shell dumpsys SurfaceFlinger --list")
    for line in out.split('\n'):
        s = line.strip()
        if PKG in s and 'InputSink' not in s and 'ActivityRecord' not in s and not s[0:1].isalnum() == False:
            # Prefer the one without hex prefix (BufferLayer)
            if s.startswith(PKG):
                return s
    # Fallback: any match
    for line in out.split('\n'):
        s = line.strip()
        if PKG in s and 'InputSink' not in s and 'ActivityRecord' not in s:
            return s
    return ""

def get_frames(surface):
    raw = adb(f'shell dumpsys SurfaceFlinger --latency "{surface}"')
    lines = raw.strip().split('\n')
    if not lines:
        return 0, []
    try:
        refresh_ns = int(lines[0].strip())
    except:
        return 0, []
    hz = 1e9 / refresh_ns if refresh_ns > 0 else 60
    
    frames = []
    for line in lines[1:]:
        parts = line.strip().split('\t')
        if len(parts) >= 3:
            try:
                d, a, r = int(parts[0]), int(parts[1]), int(parts[2])
                if d > 0 and a > 0 and r > 0:
                    frames.append((d, a, r))
            except:
                pass
    return hz, frames

def analyze(hz, frames):
    if len(frames) < 3:
        return None
    
    budget = 1000.0 / hz
    intervals = []
    for i in range(1, len(frames)):
        dt = (frames[i][1] - frames[i-1][1]) / 1e6
        if 0 < dt < 500:
            intervals.append(dt)
    
    if len(intervals) < 2:
        return None
    
    n = len(intervals)
    s = sorted(intervals)
    avg = statistics.mean(intervals)
    
    p50 = s[int(n * 0.50)]
    p90 = s[min(int(n * 0.90), n-1)]
    p95 = s[min(int(n * 0.95), n-1)]
    p99 = s[min(int(n * 0.99), n-1)]
    
    jt = budget * 1.5
    dt = budget * 2.0
    
    janky = sum(1 for f in intervals if f > jt)
    dropped = sum(1 for f in intervals if f > dt)
    
    max_c = 0
    c = 0
    for f in intervals:
        if f > dt:
            c += 1
            max_c = max(max_c, c)
        else:
            c = 0
    
    jp = janky / n * 100
    dp = dropped / n * 100
    score = min(100, int(jp*0.4 + dp*0.3 + max_c*5 + max(0, (p95-dt))*0.2))
    
    if score <= 10: v = "EXCELLENT"
    elif score <= 25: v = "GOOD"
    elif score <= 45: v = "ACCEPTABLE"
    elif score <= 65: v = "JANKY"
    else: v = "SEVERE_JANK"
    
    return {
        'frames': n, 'hz': round(hz,1), 'budget_ms': round(budget,2),
        'fps': round(1000/avg, 1), 'avg_ms': round(avg, 2),
        'min_ms': round(min(intervals), 2), 'max_ms': round(max(intervals), 2),
        'p50': round(p50, 2), 'p90': round(p90, 2),
        'p95': round(p95, 2), 'p99': round(p99, 2),
        'janky': janky, 'janky_pct': round(jp, 1),
        'dropped': dropped, 'dropped_pct': round(dp, 1),
        'max_consecutive': max_c, 'score': score, 'verdict': v
    }

def restart_app():
    adb(f"shell am force-stop {PKG}")
    time.sleep(1.5)
    adb(f"shell am start -n {PKG}/.MainActivity")
    time.sleep(4)

def do_test(name, gestures, fresh_start=False):
    """Run a test with proper frame isolation."""
    if fresh_start:
        restart_app()
    
    surface = find_surface()
    if not surface:
        print(f"  {name}: ERROR - no surface found")
        return {'test': name, 'error': 'no_surface'}
    
    # Record last frame timestamp before test
    hz, pre_frames = get_frames(surface)
    last_pre_ts = pre_frames[-1][1] if pre_frames else 0
    
    time.sleep(0.2)
    
    # Execute gestures
    for g in gestures:
        adb(f"shell {g[0]}")
        time.sleep(g[1])
    
    time.sleep(0.5)
    
    # Get frames after test
    hz2, post_frames = get_frames(surface)
    hz_use = hz2 or hz
    
    # Filter: only frames with actual_present > last_pre_ts
    new_frames = [(d, a, r) for (d, a, r) in post_frames if a > last_pre_ts]
    
    stats = analyze(hz_use, new_frames)
    if stats is None:
        # Fallback: use all frames from the last few seconds
        if post_frames:
            cutoff = post_frames[-1][1] - 8_000_000_000  # last 8 seconds
            recent = [(d,a,r) for (d,a,r) in post_frames if a > cutoff]
            stats = analyze(hz_use, recent)
    
    if stats:
        stats['test'] = name
        print(f"  {name}: {stats['fps']} FPS | p50={stats['p50']}ms p95={stats['p95']}ms p99={stats['p99']}ms | Jank={stats['janky_pct']}% Drop={stats['dropped_pct']}% MaxC={stats['max_consecutive']} | Score={stats['score']} {stats['verdict']}")
    else:
        stats = {'test': name, 'error': 'no_data', 'new_frames': len(new_frames)}
        print(f"  {name}: ERROR (new_frames={len(new_frames)})")
    
    return stats

def main():
    print("=" * 70)
    print("PHASE 40 v3 — ISOLATED REAL DEVICE TESTS")
    print("=" * 70)
    
    model = adb("shell getprop ro.product.model").strip()
    brand = adb("shell getprop ro.product.brand").strip()
    android_v = adb("shell getprop ro.build.version.release").strip()
    print(f"Device: {brand} {model} (Android {android_v})")
    
    results = []
    
    # 1. HOME SCROLL (fresh start)
    print("\n--- TEST 1: HOME SCROLL ---")
    r = do_test("HOME_SCROLL", [
        *[("input swipe 630 2000 630 800 500", 0.2) for _ in range(5)],
        *[("input swipe 630 2200 630 400 100", 0.5) for _ in range(3)],
        *[("input swipe 630 800 630 2200 300", 0.2) for _ in range(3)],
    ], fresh_start=True)
    results.append(r)
    
    # 2. NAV TO CINEMA (fresh start after pre-warming)
    print("\n--- TEST 2: NAV TO CINEMA ---")
    restart_app()
    time.sleep(3.0)  # Wait for background pre-warm
    r = do_test("NAV_TO_CINEMA", [
        ("input tap 260 2750", 1.5),
    ])
    results.append(r)
    
    # 3. CINEMA SCROLL (continues from cinema)
    print("\n--- TEST 3: CINEMA SCROLL ---")
    r = do_test("CINEMA_SCROLL", [
        *[("input swipe 630 2000 630 800 500", 0.2) for _ in range(5)],
        *[("input swipe 630 2200 630 400 100", 0.5) for _ in range(3)],
    ])
    results.append(r)
    
    # 4. NAV TO LIVE TV
    print("\n--- TEST 4: NAV TO LIVE TV ---")
    r = do_test("NAV_TO_LIVETV", [
        ("input tap 378 2750", 1.5),
    ])
    results.append(r)
    
    # 5. LIVE TV SCROLL
    print("\n--- TEST 5: LIVE TV SCROLL ---")
    r = do_test("LIVETV_SCROLL", [
        *[("input swipe 630 2000 630 800 500", 0.2) for _ in range(5)],
        *[("input swipe 630 2200 630 400 100", 0.5) for _ in range(3)],
    ])
    results.append(r)
    
    # 6. MODAL OPEN (fresh start on Home, tap Hero Details)
    print("\n--- TEST 6: MODAL OPEN ---")
    restart_app()
    time.sleep(2.0)
    r = do_test("MODAL_OPEN", [
        ("input tap 510 1050", 1.5),  # Hero Details button directly
    ])
    results.append(r)
    
    # 7. MODAL SCROLL (inside detail)
    print("\n--- TEST 7: MODAL SCROLL ---")
    r = do_test("MODAL_SCROLL", [
        *[("input swipe 630 2000 630 1000 400", 0.3) for _ in range(3)],
        *[("input swipe 630 1000 630 2000 400", 0.3) for _ in range(2)],
    ])
    results.append(r)
    
    # 8. MODAL CLOSE
    print("\n--- TEST 8: MODAL CLOSE ---")
    r = do_test("MODAL_CLOSE", [
        ("input tap 1150 250", 1.0),  # Close X button
    ])
    results.append(r)
    
    # 9. SEARCH (fresh start to isolate)
    print("\n--- TEST 9: SEARCH TYPING ---")
    restart_app()
    time.sleep(2.5)
    # Go to Cinema tab where search icon is pinned
    adb("shell input tap 378 2700")
    time.sleep(1.0)
    # Open search
    adb("shell input tap 1150 100")
    time.sleep(1.5)  # Wait for soft keyboard to settle
    r = do_test("SEARCH_TYPING", [
        ('input text "b"', 0.15),
        ('input text "a"', 0.15),
        ('input text "h"', 0.15),
        ('input text "u"', 0.15),
        ('input text "b"', 0.15),
        ('input text "a"', 0.15),
        ('input text "l"', 0.15),
        ('input text "i"', 0.4),
    ])
    results.append(r)
    
    # 10. RAPID TAB SWITCH (fresh start)
    print("\n--- TEST 10: RAPID TAB SWITCH ---")
    r = do_test("RAPID_TAB_SWITCH", [
        ("input tap 126 2700", 0.3),
        ("input tap 378 2700", 0.3),
        ("input tap 630 2700", 0.3),
        ("input tap 882 2700", 0.3),
        ("input tap 126 2700", 0.3),
        ("input tap 378 2700", 0.3),
        ("input tap 630 2700", 0.3),
        ("input tap 126 2700", 0.3),
    ], fresh_start=True)
    results.append(r)
    
    # MEMORY
    print("\n--- MEMORY ---")
    meminfo = adb(f"shell dumpsys meminfo {PKG}")
    total_pss = "?"
    for line in meminfo.split('\n'):
        if 'TOTAL' in line:
            parts = line.split()
            if len(parts) >= 2:
                total_pss = f"{parts[1]} KB"
            print(f"  {line.strip()}")
            break
    
    # GFXINFO
    print("\n--- GFXINFO ---")
    gfx = adb(f"shell dumpsys gfxinfo {PKG}")
    for line in gfx.split('\n'):
        s = line.strip()
        if any(k in s for k in ['Total frames', 'Janky frames:', 'percentile:', 'Frame deadline']):
            print(f"  {s}")
    
    # SAVE
    output = {
        'device': {'model': model, 'brand': brand, 'android': android_v,
                   'soc': 'SM8735', 'resolution': '1260x2800', 'dpi': 480,
                   'webview': '153.0.8010.36'},
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%S%z'),
        'total_pss': total_pss,
        'tests': results
    }
    
    outfile = "/home/abhiboss/Projects/HindiIPTVValidator/reports/forensic/motion_phase40_real_device_results.json"
    os.makedirs(os.path.dirname(outfile), exist_ok=True)
    with open(outfile, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'='*70}")
    print("FINAL SUMMARY")
    print(f"{'='*70}")
    print(f"{'Test':<22} {'FPS':>6} {'p50':>7} {'p95':>7} {'p99':>7} {'Jnk%':>6} {'Drp%':>6} {'Score':>6} {'Verdict':<12}")
    print("-" * 85)
    for r in results:
        if 'error' not in r:
            print(f"{r['test']:<22} {r['fps']:>6} {r['p50']:>6}m {r['p95']:>6}m {r['p99']:>6}m {r['janky_pct']:>5}% {r['dropped_pct']:>5}% {r['score']:>5} {r['verdict']:<12}")
        else:
            print(f"{r['test']:<22} ERROR ({r.get('error','')})")
    print(f"\nMemory: {total_pss}")
    print(f"Saved: {outfile}")

if __name__ == '__main__':
    main()
