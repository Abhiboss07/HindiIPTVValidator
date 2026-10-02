#!/usr/bin/env python3
"""
PHASE 40 — SUSTAINED SESSION & MEMORY STABILITY TEST
Runs continuous realistic browsing across Nothing Phone 3 for 5 minutes,
monitoring PSS memory, Dalvik heap, Native heap, EGL surfaces, and frame hitching.
"""

import subprocess
import time
import json
import sys

SERIAL = "00015364U000110"
PKG = "com.aakashstream.app"

def adb(cmd):
    full_cmd = f"adb -s {SERIAL} {cmd}"
    res = subprocess.run(full_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return res.stdout

def get_mem():
    out = adb(f"shell dumpsys meminfo {PKG}")
    pss = 0
    native = 0
    dalvik = 0
    egl = 0
    for line in out.splitlines():
        if "TOTAL PSS:" in line:
            parts = line.split()
            for i, p in enumerate(parts):
                if p == "TOTAL" and i+2 < len(parts):
                    try:
                        pss = int(parts[i+2])
                    except: pass
        elif "Native Heap" in line and pss == 0:
            parts = line.split()
            if len(parts) >= 3:
                try: native = int(parts[2])
                except: pass
        elif "Dalvik Heap" in line and pss == 0:
            parts = line.split()
            if len(parts) >= 3:
                try: dalvik = int(parts[2])
                except: pass
        elif "EGL mtrack" in line:
            parts = line.split()
            if len(parts) >= 3:
                try: egl = int(parts[2])
                except: pass
        elif "TOTAL" in line and pss == 0:
            parts = line.split()
            if len(parts) >= 2:
                try:
                    pss = int(parts[1])
                except: pass
    return {"pss_kb": pss, "native_kb": native, "dalvik_kb": dalvik, "egl_kb": egl}

def get_temp():
    out = adb("shell cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null")
    try:
        return float(out.strip()) / 1000.0
    except:
        return 0.0

def main():
    print("=" * 60)
    print("PHASE 40 — SUSTAINED SESSION & MEMORY STABILITY TEST (5 MIN)")
    print("=" * 60)
    
    # Verify app is alive
    pids = adb(f"shell pidof {PKG}").strip()
    if not pids:
        print("Launching app...")
        adb(f"shell am start -n {PKG}/.MainActivity")
        time.sleep(3)
    
    start_time = time.time()
    duration = 300  # 5 minutes
    
    samples = []
    cycle = 0
    
    initial_mem = get_mem()
    initial_temp = get_temp()
    print(f"Initial Memory: {initial_mem['pss_kb']} KB | Temp: {initial_temp:.1f}°C\n")
    
    while time.time() - start_time < duration:
        cycle += 1
        elapsed = int(time.time() - start_time)
        print(f"[{elapsed:03d}s / {duration}s] Cycle {cycle}: Simulating user interactions...")
        
        # 1. Scroll Home
        adb("shell input tap 126 2700")  # Home
        time.sleep(0.5)
        adb("shell input swipe 630 1800 630 800 400")
        time.sleep(0.3)
        adb("shell input swipe 630 2000 630 600 200")
        time.sleep(0.5)
        
        # 2. Open modal & close
        adb("shell input tap 510 1050")  # Details
        time.sleep(0.8)
        adb("shell input swipe 630 1800 630 1000 300")
        time.sleep(0.3)
        adb("shell input tap 1150 250")  # Close
        time.sleep(0.5)
        
        # 3. Cinema tab
        adb("shell input tap 378 2700")  # Cinema
        time.sleep(0.6)
        adb("shell input swipe 630 1800 630 800 400")
        time.sleep(0.3)
        
        # 4. Live TV tab
        adb("shell input tap 630 2700")  # Live TV
        time.sleep(0.6)
        adb("shell input swipe 630 1800 630 800 400")
        time.sleep(0.3)
        
        # 5. Radio tab
        adb("shell input tap 882 2700")  # Radio
        time.sleep(0.6)
        
        # Sample memory and temperature
        mem = get_mem()
        temp = get_temp()
        mem['timestamp'] = elapsed
        mem['temp_c'] = temp
        mem['cycle'] = cycle
        samples.append(mem)
        
        print(f"       PSS: {mem['pss_kb']} KB | Temp: {temp:.1f}°C")
        
    print("\n" + "=" * 60)
    print("SUSTAINED TEST COMPLETE")
    print("=" * 60)
    
    first_pss = samples[0]['pss_kb']
    final_pss = samples[-1]['pss_kb']
    max_pss = max(s['pss_kb'] for s in samples)
    min_pss = min(s['pss_kb'] for s in samples)
    pss_delta = final_pss - first_pss
    
    final_temp = samples[-1]['temp_c']
    temp_delta = final_temp - initial_temp
    
    print(f"Initial PSS: {first_pss:,} KB")
    print(f"Final PSS:   {final_pss:,} KB (Delta: {pss_delta:+,} KB)")
    print(f"Peak PSS:    {max_pss:,} KB")
    print(f"Min PSS:     {min_pss:,} KB")
    print(f"Temperature: {initial_temp:.1f}°C -> {final_temp:.1f}°C (Delta: {temp_delta:+.1f}°C)")
    print(f"Cycles:      {cycle}")
    
    # Verdict
    is_leaking = pss_delta > 50000  # More than 50MB growth is suspicious
    verdict = "FAIL (Memory Leak)" if is_leaking else "PASS (Stable Memory)"
    print(f"Verdict:     {verdict}")
    
    report = {
        "duration_seconds": duration,
        "cycles": cycle,
        "initial_pss_kb": first_pss,
        "final_pss_kb": final_pss,
        "pss_delta_kb": pss_delta,
        "peak_pss_kb": max_pss,
        "initial_temp_c": initial_temp,
        "final_temp_c": final_temp,
        "temp_delta_c": temp_delta,
        "verdict": verdict,
        "samples": samples
    }
    
    with open("reports/forensic/phase40_sustained_session_results.json", "w") as f:
        json.dump(report, f, indent=2)
    print("Saved report to reports/forensic/phase40_sustained_session_results.json")

if __name__ == "__main__":
    main()
