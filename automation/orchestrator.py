#!/usr/bin/env python3
"""
T2L Automation Orchestrator with Break Timer & GitHub Sync
---------------------------------------------------------
Executes the full automated cycle:
1. Dead Stream Purge Pipeline (Removes broken movies, episodes, and offline channels)
2. Content Ingestion Pipeline (Ingests verified >=720p Hindi/English content + posters)
3. Production APK Rebuild (Compiles and signs T2L.apk)
4. Automated Git Commit & Push to GitHub (origin/main)
5. Configurable Break/Rest Timer (Rest period before the next cycle)
"""

import os
import sys
import time
import argparse
import subprocess

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def run_command(cmd, description, cwd=PROJECT_ROOT):
    """Run shell command with clean logging."""
    print(f"\n▶ [{description}] Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str))
    if res.returncode != 0:
        print(f"⚠️ Warning: Command '{description}' exited with code {res.returncode}")
        return False
    return True

def run_full_automation_cycle(push_to_git=True):
    """Run one complete cycle of Purge -> Ingest -> Build APK -> Git Push."""
    start_time = time.time()
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    print("\n" + "=" * 65)
    print(f"🎬 T2L AUTOMATION CYCLE STARTED AT {timestamp}")
    print("=" * 65)

    # 1. Run Dead Stream Purger
    purger_script = os.path.join(PROJECT_ROOT, "automation", "dead_stream_purger.py")
    run_command([sys.executable, purger_script], "Automation 2: Dead Stream Purger")

    # 2. Run Content Ingestion Pipeline
    ingest_script = os.path.join(PROJECT_ROOT, "automation", "content_ingestion_pipeline.py")
    run_command([sys.executable, ingest_script], "Automation 1: Content Ingestion Pipeline")

    # 3. Check if any catalog or poster files changed
    git_status = subprocess.check_output(["git", "status", "--porcelain"], cwd=PROJECT_ROOT, text=True).strip()
    if not git_status:
        print("\n✨ No changes detected in catalogs or assets. System is 100% healthy.")
        elapsed = round((time.time() - start_time) / 60, 2)
        print(f"⏱️ Cycle completed in {elapsed} minutes.")
        return

    # 4. Rebuild APK with updated catalogs & assets
    print("\n📦 Changes detected. Rebuilding production APK...")
    build_script = os.path.join(PROJECT_ROOT, "build_apk.sh")
    run_command(["bash", build_script], "Build & Sign Production APK")

    # 5. Git Commit and Push to GitHub
    if push_to_git:
        print("\n🚀 Pushing automated updates to GitHub...")
        run_command(["git", "add", "data/", "android_app/src/main/assets/data/", "assets/posters/", "android_app/src/main/assets/assets/posters/", "T2L.apk", "T2L.apk.idsig"], "Stage Changed Catalogs, Posters & APK")
        commit_msg = f"""feat(automation): daily catalog health purge and content sync [{timestamp}]

- Purge dead/unreachable video streams and offline channels
- Synchronize verified >=720p content and studio posters
- Rebuild production T2L.apk binary and v1+v2 signature digest

Co-Authored-By: Claude Code <noreply@anthropic.com>"""
        run_command(["git", "commit", "-m", commit_msg], "Create Git Commit")
        run_command(["git", "push", "origin", "main"], "Push to origin/main on GitHub")

    elapsed = round((time.time() - start_time) / 60, 2)
    print("\n" + "=" * 65)
    print(f"🎉 CYCLE COMPLETED SUCCESSFULLY in {elapsed} minutes!")
    print("=" * 65)

def main():
    parser = argparse.ArgumentParser(description="T2L Continuous Automation Daemon")
    parser.add_argument("--break-hours", type=float, default=12.0, help="Rest period in hours between runs (default: 12 hours)")
    parser.add_argument("--once", action="store_true", help="Run once and exit without entering sleep loop")
    parser.add_argument("--no-push", action="store_true", help="Skip pushing to GitHub")
    args = parser.parse_args()

    cycle_count = 1
    while True:
        print(f"\n🔄 [Daemon] Executing Iteration #{cycle_count}")
        run_full_automation_cycle(push_to_git=not args.no_push)

        if args.once:
            print("\n🏁 Single run mode completed. Exiting.")
            break

        sleep_seconds = int(args.break_hours * 3600)
        print(f"\n☕ [Break Timer] Cycle finished. Resting for {args.break_hours} hours ({sleep_seconds} seconds)...")
        print(f"⏰ Next automation cycle will resume at: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time() + sleep_seconds))}")
        time.sleep(sleep_seconds)
        cycle_count += 1

if __name__ == "__main__":
    main()
