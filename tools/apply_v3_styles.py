STYLES_PATHS = ['assets/styles.css', 'android_app/src/main/assets/assets/styles.css']

NEW_CSS = """
/* ==========================================================================
   REFINEMENTS V3: REDESIGNED ABOUT MODAL (ZERO HORIZONTAL SCROLL)
   ========================================================================== */
.app-info-modal-card {
  width: 94% !important;
  max-width: 480px !important;
  max-height: 86vh !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
}

.app-info-tab-panel {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  box-sizing: border-box !important;
  width: 100% !important;
}

.info-specs-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.info-spec-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 12px !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
  padding: 11px 14px !important;
  box-sizing: border-box !important;
  width: 100% !important;
}

.info-spec-row-left {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  flex-shrink: 0 !important;
}

.info-spec-icon {
  font-size: 16px !important;
}

.info-spec-label {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: #94a3b8 !important;
  letter-spacing: 0.3px !important;
}

.info-spec-val {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: #FFFFFF !important;
  text-align: right !important;
  word-break: break-word !important;
  white-space: normal !important;
}

/* ==========================================================================
   REFINEMENTS V3: OOKLA-STYLE SPEEDOMETER ARC GAUGE
   ========================================================================== */
.ookla-gauge-wrapper {
  position: relative;
  width: 280px;
  height: 185px;
  margin: 0 auto 10px auto;
  display: flex;
  justify-content: center;
}

.ookla-gauge-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ookla-track-arc {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 12;
  stroke-linecap: round;
}

.ookla-progress-arc {
  fill: none;
  stroke: url(#ooklaArcGrad);
  stroke-width: 14;
  stroke-linecap: round;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  filter: drop-shadow(0 0 10px rgba(0, 242, 254, 0.7));
  transition: stroke-dashoffset 0.08s linear;
}

.ookla-tick-lbl {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  fill: #64748b;
  dominant-baseline: middle;
}

#ooklaNeedleGroup {
  transition: transform 0.08s linear;
  will-change: transform;
}

.ookla-readout-center {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.ookla-digits {
  font-family: var(--font-mono, monospace);
  font-size: 38px;
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1;
  display: block;
  letter-spacing: -1px;
  text-shadow: 0 0 18px rgba(56, 189, 248, 0.55);
}

.ookla-unit-text {
  font-size: 12px;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.5px;
  display: block;
  margin-top: 2px;
}

.ookla-sub-text {
  font-size: 9px;
  font-weight: 800;
  color: #10b981;
  letter-spacing: 0.8px;
  display: block;
  margin-top: 1px;
}
"""

for p in STYLES_PATHS:
    with open(p, 'a', encoding='utf-8') as f:
        f.write("\n" + NEW_CSS)
    print(f"Appended v3 styles to {p}")

