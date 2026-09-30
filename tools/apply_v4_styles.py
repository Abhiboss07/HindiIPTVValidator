import re
import os

ROOT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator"
STYLES_PATH = os.path.join(ROOT_DIR, "assets/styles.css")
ANDROID_STYLES_PATH = os.path.join(ROOT_DIR, "android_app/src/main/assets/assets/styles.css")

with open(STYLES_PATH, "r", encoding="utf-8") as f:
    css = f.read()

# 1. Update :root to define --t2l-safe-top
if "--t2l-safe-top" not in css:
    css = css.replace(
        "--t2l-safe-bottom: env(safe-area-inset-bottom, 16px);",
        "--t2l-safe-bottom: env(safe-area-inset-bottom, 16px);\n  --t2l-safe-top: max(36px, env(safe-area-inset-top, 36px));"
    )
    print("✓ Added --t2l-safe-top to :root")

# 2. Append V4 Camera Cutout, Ookla Speedometer & Subtitle Styles
v4_styles = """
/* ==============================================================================
   REFINEMENTS V4: PUNCH-HOLE CAMERA SAFE AREA CLEARANCE
   ============================================================================== */
.t2l-header {
  padding-top: var(--t2l-safe-top, 36px) !important;
  height: calc(56px + var(--t2l-safe-top, 36px)) !important;
  box-sizing: border-box !important;
}

.page-view, .t2l-view, #view-home, #view-cinema, #page-movies, #page-live, #page-radio, #page-local {
  padding-top: calc(56px + var(--t2l-safe-top, 36px)) !important;
}

.hero-premiere {
  margin-top: calc(-1 * var(--t2l-safe-top, 36px)) !important;
  padding-top: calc(24px + var(--t2l-safe-top, 36px)) !important;
}

/* VLC Video Player Top Header: shifted safely down past center punch-hole camera */
.vlc-top-bar {
  padding-top: max(38px, calc(env(safe-area-inset-top, 38px) + 6px)) !important;
  padding-left: 18px !important;
  padding-right: 18px !important;
  padding-bottom: 12px !important;
  box-sizing: border-box !important;
}

/* Modal Headers & Floating Close Buttons */
.movie-modal-close-btn {
  top: max(40px, calc(env(safe-area-inset-top, 40px) + 6px)) !important;
  right: 18px !important;
}

.speed-test-modal-header,
.settings-modal-header,
.app-info-modal-header {
  padding-top: max(16px, env(safe-area-inset-top, 16px)) !important;
}

/* ==============================================================================
   REFINEMENTS V4: OOKLA-STYLE SPEEDOMETER ARC DIAL ENHANCEMENTS
   ============================================================================== */
.ookla-gauge-wrapper {
  position: relative !important;
  width: 100% !important;
  max-width: 290px !important;
  height: 200px !important;
  margin: 6px auto 14px auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.ookla-gauge-svg {
  width: 100% !important;
  height: 100% !important;
  overflow: visible !important;
}

.ookla-track-arc {
  fill: none !important;
  stroke: rgba(255, 255, 255, 0.12) !important;
  stroke-width: 9 !important;
  stroke-linecap: round !important;
}

.ookla-progress-arc {
  fill: none !important;
  stroke: url(#ooklaArcGrad) !important;
  stroke-width: 9 !important;
  stroke-linecap: round !important;
  stroke-dasharray: 356 !important;
  stroke-dashoffset: 356;
  filter: drop-shadow(0 0 10px rgba(0, 242, 254, 0.6)) !important;
  transition: stroke-dashoffset 0.12s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.ookla-tick-lbl {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  fill: #94a3b8 !important;
  user-select: none !important;
}

.ookla-readout-center {
  position: absolute !important;
  top: 60% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  pointer-events: none !important;
  z-index: 5 !important;
}

.ookla-digits {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace !important;
  font-size: 36px !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
  line-height: 1 !important;
  letter-spacing: -1px !important;
  text-shadow: 0 0 18px rgba(56, 189, 248, 0.6) !important;
}

.ookla-unit-text {
  font-size: 12px !important;
  font-weight: 800 !important;
  color: #38BDF8 !important;
  letter-spacing: 1px !important;
  margin-top: 3px !important;
}

.ookla-sub-text {
  font-size: 9px !important;
  font-weight: 800 !important;
  color: #64748B !important;
  letter-spacing: 0.5px !important;
  margin-top: 2px !important;
}

/* ==============================================================================
   REFINEMENTS V4: BULLETPROOF SUBTITLES & CLOSED CAPTIONS RENDERING
   ============================================================================== */
.player-cc-container {
  position: absolute !important;
  bottom: 84px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  max-width: 90% !important;
  min-width: 140px !important;
  background: rgba(8, 9, 13, 0.90) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-radius: 8px !important;
  padding: 8px 18px !important;
  z-index: 55 !important;
  pointer-events: none !important;
  text-align: center !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8) !important;
  transition: opacity 0.2s ease, transform 0.2s ease !important;
}

.player-cc-text {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 1.4 !important;
  color: #FFFFFF !important;
  margin: 0 !important;
  white-space: pre-wrap !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.95), 0 0 2px #000000 !important;
}
"""

css += "\n" + v4_styles

with open(STYLES_PATH, "w", encoding="utf-8") as f:
    f.write(css)
with open(ANDROID_STYLES_PATH, "w", encoding="utf-8") as f:
    f.write(css)
print("✓ Updated styles.css and synced to Android assets")
